import { NextRequest, NextResponse } from 'next/server';
import { getOrderStatus } from '../../../../../lib/cashfree';
import { createServerSupabaseClient } from '../../../../../lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      );
    }

    const orderData = await getOrderStatus(orderId);
    const isPaid = orderData.order_status === 'PAID';

    // Update records in Supabase
    const supabase = await createServerSupabaseClient();
    if (supabase && isPaid) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Update payment history
        await supabase
          .from('payment_history')
          .update({
            status: 'success',
            cashfree_payment_id: orderData.cf_order_id?.toString(),
          })
          .eq('cashfree_order_id', orderId);

        // Determine plan from order tags or payment history
        const { data: paymentRecord } = await supabase
          .from('payment_history')
          .select('metadata')
          .eq('cashfree_order_id', orderId)
          .single();

        const plan = paymentRecord?.metadata?.plan || 'pro';
        const interval = paymentRecord?.metadata?.interval || 'monthly';
        const daysToAdd = interval === 'yearly' ? 365 : 30;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + daysToAdd);

        // Deactivate existing subscriptions
        await supabase
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('user_id', user.id)
          .eq('status', 'active');

        // Create new subscription
        await supabase.from('subscriptions').insert({
          user_id: user.id,
          plan,
          status: 'active',
          cashfree_order_id: orderId,
          cashfree_payment_id: orderData.cf_order_id?.toString(),
          amount: orderData.order_amount,
          currency: orderData.order_currency || 'INR',
          expires_at: expiresAt.toISOString(),
        });
      }
    } else if (supabase && !isPaid) {
      // Update payment as failed
      await supabase
        .from('payment_history')
        .update({ status: 'failed' })
        .eq('cashfree_order_id', orderId);
    }

    return NextResponse.json({
      order_id: orderId,
      status: orderData.order_status,
      paid: isPaid,
      amount: orderData.order_amount,
      currency: orderData.order_currency,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
