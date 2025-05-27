"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from '@/lib/prisma';
import { Period } from "@/types/analitics";

export async function GetPeriods() {
    const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const years = await prisma.workflowExecution.aggregate({
    where: {
      userId,
    },
    _min: {
      createdAt: true,
    },
  });
  const currentYear = new Date().getFullYear();

  const minYear = years._min.createdAt
    ? new Date(years._min.createdAt).getFullYear()
    : currentYear;
  const periods: Period[] = [];
  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month });
    }
  }

  return periods;
}