import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';
import { HandleCheckoutSessionCompleted } from '@/lib/stripe/handleCheckoutSessionCompleted';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        HandleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        break;
      }
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('stripe webhook error:', error);
    return new NextResponse('Webhook Error', { status: 400 });
  }
}