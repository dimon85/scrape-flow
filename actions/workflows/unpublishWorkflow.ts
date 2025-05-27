"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflows";
import { revalidatePath } from "next/cache";

export async function UnpublishWorkflow(id: string) {
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

    if (workflow.status !== WorkflowStatus.PUBLISHED) {
      throw new Error("workflow is not a published")
    }

    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        status: WorkflowStatus.DRAFT,
        executionPlan: null,
        creditsCost: 0,
      }
    });
    revalidatePath(`/workflow/editor/${id}`);
};