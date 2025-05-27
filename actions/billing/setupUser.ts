"use server";

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function SetupUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }
  const balance = await prisma.userBalance.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!balance) {
    // Free 100
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    });
  }

  redirect('/');
};