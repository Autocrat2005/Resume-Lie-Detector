'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type PaymentStatus = 'loading' | 'success' | 'failed' | 'error';

function PaymentResult() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [details, setDetails] = useState<{ amount?: number; currency?: string } | null>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    async function verifyPayment() {
      try {
        const res = await fetch(`/api/payments/verify?order_id=${orderId}`);
        if (!res.ok) throw new Error('Verification failed');
        const data = await res.json();
        setDetails({ amount: data.amount, currency: data.currency });
        setStatus(data.paid ? 'success' : 'failed');
      } catch {
        setStatus('error');
      }
    }

    verifyPayment();
  }, [orderId]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
        </div>
        <p className="text-sm text-zinc-400">Verifying your payment...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-6 animate-fadeIn">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Your Pro plan is now active.
            {details?.amount && ` ₹${details.amount} charged.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
          >
            Start Analyzing
          </Link>
          <Link
            href="/history"
            className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
          >
            View History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          {status === 'failed' ? 'Payment Failed' : 'Something Went Wrong'}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {status === 'failed'
            ? 'Your payment could not be processed. Please try again.'
            : 'We could not verify your payment. Please contact support.'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/pricing"
          className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-400">Loading...</p>
          </div>
        }
      >
        <PaymentResult />
      </Suspense>
    </main>
  );
}
