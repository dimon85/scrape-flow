"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { symmetricEncrypt } from "@/lib/encryption";

export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const ecnryptedValue = symmetricEncrypt(data.value);

  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: ecnryptedValue,
    }
  });

  if (!result) {
    throw new Error("Failed to create credential");
  }

  revalidatePath("/credential");
};