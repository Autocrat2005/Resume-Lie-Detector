import { NextRequest, NextResponse } from 'next/server';
import { createCashfreeOrder, getPlanPrice } from '../../../../../lib/cashfree';
import { createServerSupabaseClient } from '../../../../../lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, currency = 'INR', customerName, customerEmail, customerPhone } = body as {
      plan: 'pro';
      currency?: 'INR' | 'USD';
      customerName: string;
      customerEmail: string;
      customerPhone: string;
    };

    if (!plan || plan !== 'pro') {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "pro"' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Customer email and phone are required' },
        { status: 400 }
      );
    }

    // Determine flat price based on currency selection (INR 399 vs USD 4.99)
    const finalCurrency = currency === 'USD' ? 'USD' : 'INR';
    const amount = finalCurrency === 'USD' ? 4.99 : 399;
    const orderId = `rld_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let origin = request.headers.get('origin') || 'http://localhost:3000';

    // Cashfree production gateway strictly requires HTTPS return URLs.
    if (origin.startsWith('http://')) {
      origin = origin.replace('http://', 'https://');
    }

    const orderData = await createCashfreeOrder({
      orderId,
      amount,
      currency: finalCurrency,
      customerName: customerName || customerEmail.split('@')[0],
      customerEmail,
      customerPhone,
      returnUrl: `${origin}/payments/success`,
      plan,
    });

    // Save pending payment to Supabase if user is authenticated
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('payment_history').insert({
          user_id: user.id,
          cashfree_order_id: orderId,
          amount,
          currency: finalCurrency,
          status: 'pending',
          metadata: { plan, interval: 'one-time' },
        });
      }
    }

    return NextResponse.json({
      order_id: orderId,
      payment_session_id: orderData.payment_session_id,
      order_amount: amount,
      plan,
      interval: 'one-time',
    });
  } catch (error) {
    console.error('Create order error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
