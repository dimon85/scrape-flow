"use server"

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const GetCredentialsForUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return  prisma.credential.findMany({
    where: { userId },
    orderBy: { name: 'asc'}
  });
};
