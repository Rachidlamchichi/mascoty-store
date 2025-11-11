import { NextResponse } from 'next/server';

// TODO: Implement Stripe webhook handler
export async function POST(request: Request) {
  try {
    const body = await request.text();
    // Handle Stripe webhook events
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
