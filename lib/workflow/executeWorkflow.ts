import "server-only";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflows";
import { ExecutionPhase } from "@prisma/client";
import { TaskRegistry } from "./task/registry";
import { AppNode } from "@/types/appNode";
import { ExecutorRegistry } from "@/lib/workflow/executor/registy";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "@/lib/log";

export const ExecuteWorkflow = async (executionId: string, nextRunAt?: Date) => {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error('Execution on found');
  }

  const edges = JSON.parse(execution.workflow.definition).edges as Edge[];

  const environment: Environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt);
  await initializePhaseStatuses(execution);

  
  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId,
    );
    creditsConsumed += phaseExecution.creditsConsumed;

    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);

  await cleanupEnvironment(environment);

  revalidatePath('/workflow/runs');
};

const initializeWorkflowExecution = async (executionId: string, workflowId: string, nextRunAt?: Date) => {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    }
  });
  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt }),
    },
  })
}

const initializePhaseStatuses = async (execution: any) => {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      }
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    }
  })
};

const finalizeWorkflowExecution = async (
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number,
) => {
  const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;
  await prisma.workflowExecution.update({
    where: {
      id: executionId
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    }
  });
  await prisma.workflow.update({
    where: {
      id: workflowId,
      lastRunId: executionId,
    },
    data: {
      lastRunStatus: finalStatus,
    }
  }).catch(() => {

  });
};

const executeWorkflowPhase = async (
  phase: ExecutionPhase,
  environment: Environment,
  edges:Edge[],
  userId: string,
) => {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmeentForPhase(node, environment, edges);

  // update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    }
  });
  const creditsRequired = TaskRegistry[node.data.type].credits;

  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    // we can execute the phasee if the credits are sufficient
    success = await executePhase(phase, node, environment, logCollector);
  }


  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);
  return { success, creditsConsumed };
}

const finalizePhase = async (
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number,
) => {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          }))
        }
      }
    }
  });
};

const executePhase = async (
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector,
): Promise<boolean> => {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    logCollector.error(`No executor found for task type: ${node.data.type}`);
    return false;
  }

  const exectionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);

  return await runFn(exectionEnvironment);
};

const setupEnvironmeentForPhase = (node: AppNode, environment: Environment, edges: Edge[]) => {
  environment.phases[node.id] = { inputs: {}, outputs: {} };

  const inputs = TaskRegistry[node.data.type].inputs;

  for(const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value from outouuts in the environment
    const connectedEdge = edges.find((edge => edge.target === node.id && edge.targetHandle === input.name))
    if (!connectedEdge) {
      console.error('Missing edge for input')
      continue;
    }

    const outputValue = environment.phases[connectedEdge.source].outputs[
      connectedEdge.sourceHandle!
    ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
};

const createExecutionEnvironment = (
  node: AppNode,
  environment: Environment,
  LogCollector: LogCollector
): ExecutionEnvironment<any> => {
  return ({
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => environment.page = page,

    log: LogCollector,
  });
}

const cleanupEnvironment = async (environment: Environment) => {
  if (environment.browser) {
    // await environment.browser.close()
    //   .catch((err) => {
    //     console.error('Cannot close browser, reason:', err)
    //   });
  }
};

const decrementCredits = async (
  userId: string,
  amount: number,
  logCollector: LogCollector,
) => {
  try {
    await prisma.userBalance.update({
      where: { userId, credits: { gte: amount } },
      data: { credits: { decrement: amount } },
    });
    return true;
  } catch {
    logCollector.error('insufficient balance');
    return false;
  }
};