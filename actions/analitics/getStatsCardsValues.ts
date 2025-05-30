"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from '@/lib/prisma';
import { Period } from "@/types/analitics";
import { PeriodToDateRange } from "@/lib/helper/dates";
import { WorkflowExecutionStatus } from "@/types/workflows";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function GetStatsCardsValues(period: Period) {
    const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      }
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    }
  });

  const stats = {
    workflowExecutions: executions.length,
    phaseExecutions: 0,
    creditsConsumed: 0,
  };

  stats.creditsConsumed = executions.reduce((acc, execution) => acc + execution.creditsConsumed, 0);
  stats.phaseExecutions = executions.reduce((acc, execution) => acc + execution.phases.length, 0);

  return stats;
};