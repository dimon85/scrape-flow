"use server";

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe/stripe';
import { getCreditsPack, PackId } from "@/types/billing";
import { getAppUrl } from '@/lib/helper/url';

export async function PurchaseCredits(packId: PackId) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const selectedPack = getCreditsPack(packId);

  if (!selectedPack) {
    throw new Error("Invalid credits pack selected");
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    invoice_creation: {
      enabled: true,
    },
    success_url: getAppUrl('/billing'),
    cancel_url: getAppUrl('/billing'),
    metadata: {
      userId,
      packId,
    },
    line_items: [
      {
        quantity: 1,
        price: selectedPack.priceId,
      },
    ],
  });

  if (!session.url) {
    throw new Error("Failed to create stripe session");
  }

  redirect(session.url);
}