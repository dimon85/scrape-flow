"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflows";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!workflow) {
      throw new Error('workflow not found');
    }

    if (workflow.status !== WorkflowStatus.DRAFT) {
      throw new Error("workflow is not a draft")
    }

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error('Flow defenition not valid');
    }

    if (!result.executionPlan) {
      throw new Error('no execution plan generated');
    }

    const creditsCost = CalculateWorkflowCost(flow.nodes);
    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        definition: flowDefinition,
        executionPlan: JSON.stringify(result.executionPlan),
        creditsCost,
        status: WorkflowStatus.PUBLISHED,
      }
    });
    revalidatePath(`/workflow/editor/${id}`);
};