"use server";

import { auth } from "@clerk/nextjs/server";
import type { Edge } from "@xyflow/react";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflows";
import prisma from "@/lib/prisma";
import type { AppNode } from "@/types/appNode";
import { WorkflowStatus } from "@/types/workflows";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId,
    },
  });

  if (!sourceWorkflow) {
    throw new Error("Workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    }
  });

  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  revalidatePath('/workflows')
}