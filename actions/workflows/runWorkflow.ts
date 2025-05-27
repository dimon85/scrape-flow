"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  WorkflowExecutionPlan,
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflows";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";

export async function RunWorkflow(from: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if  (!userId) {
    throw new Error("User not authenticated");
  }

  const { workflowId, flowDefinition } = from;
  if (!workflowId) {
    throw new Error("workflow ID is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;
  let workflowDefinition = flowDefinition;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error('Execution plan not found');
    }
    executionPlan = JSON.parse(workflow.executionPlan!);
    workflowDefinition = workflow.definition;
  } else {
    if (!flowDefinition) {
      throw new Error('Flow definition is required');
    }

    const flow = JSON.parse(flowDefinition);

    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
      throw new Error('Invalid flow definition');
    }

    if (!result.executionPlan) {
      throw new Error('Execution plan not found');
    }

    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      trigger: WorkflowExecutionTrigger.MANUAL,
      startedAt: new Date(),
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => ({
            userId,
            status: ExecutionPhaseStatus.CREATED,
            number: phase.phase,
            node: JSON.stringify(node),
            name: TaskRegistry[node.data.type].label
          }));
        })
      }
    },
    select: {
      id: true,
      phases: true
    }
  });

  if (!execution) {
    throw new Error("Failed to create workflow execution");
  }

  ExecuteWorkflow(execution.id); // run this on background;

  return {
    workflowId,
    executionId: execution.id,
  }
};