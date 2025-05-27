"use server";

import { auth } from "@clerk/nextjs/server";
import type { Edge } from "@xyflow/react";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflows";
import prisma from "@/lib/prisma";
import type { AppNode } from "@/types/appNode";
import { WorkflowStatus } from "@/types/workflows";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const initialWorkflow: {nodes: AppNode[], edges: Edge[]} = {
    nodes: [],
    edges: [],
  };
  initialWorkflow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialWorkflow),
      ...data,
    }
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  return result;
}