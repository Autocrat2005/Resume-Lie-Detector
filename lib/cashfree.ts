import { Cashfree, CFEnvironment } from 'cashfree-pg';

const environment =
  process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(
  environment,
  process.env.CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);

export interface CreateOrderParams {
  orderId: string;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  plan: 'pro';
}

export async function createCashfreeOrder(params: CreateOrderParams) {
  const request = {
    order_id: params.orderId,
    order_amount: params.amount,
    order_currency: params.currency || 'INR',
    customer_details: {
      customer_id: params.orderId.split('_')[1] || 'customer',
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
    },
    order_meta: {
      return_url: params.returnUrl + '?order_id={order_id}',
    },
    order_tags: {
      plan: params.plan,
    },
  };

  const response = await cashfree.PGCreateOrder(request);
  return response.data;
}

export async function verifyCashfreePayment(orderId: string) {
  const response = await cashfree.PGOrderFetchPayments(orderId);
  return response.data;
}

export async function getOrderStatus(orderId: string) {
  const response = await cashfree.PGFetchOrder(orderId);
  return response.data;
}

export const PLAN_PRICES = {
  pro: {
    monthly: 399,
    yearly: 3399,
  },
} as const;

export function getPlanPrice(plan: 'pro', interval: 'monthly' | 'yearly'): number {
  return PLAN_PRICES[plan][interval];
}
