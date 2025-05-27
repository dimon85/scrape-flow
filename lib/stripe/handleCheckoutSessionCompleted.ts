import "server only";
import Stripe from "stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import prisma from '@/lib/prisma';

export async function HandleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
  const { userId, packId } = event.metadata;

  if (!event.metadata) {
    throw new Error("Metadata is required in the event");
  }

  if (!userId) {
    throw new Error("User ID is required in metadata");
  }

  if (!packId) {
    throw new Error("Pack ID is required in metadata");
  }

  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error("Purchase pack not found");
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    }
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    }
  })
};