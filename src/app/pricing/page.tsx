'use client';

import { useState, useEffect } from 'react';
import PricingCard from '../../components/PricingCard';
import { PricingTier } from '../../../lib/types';
import { useApp } from '../../components/Providers';
import { useRouter } from 'next/navigation';

const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: 'Free',
    description: 'Dissect resumes with GROQ Llama AI',
    aiProvider: 'groq',
    features: [
      '2 resume analyses per day',
      'GROQ API (Llama 3.3)',
      'Basic interview questions',
      'Local session storage',
    ],
    limitations: [
      'No persistent cloud history',
      'Standard question depth',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '\u20B9399',
    yearlyPrice: '\u20B93,399',
    description: 'Deep brutal interrogation with Sonnet',
    aiProvider: 'claude',
    popular: true,
    features: [
      '1 resume analysis per day',
      'Claude Sonnet AI (Direct)',
      'Deep interview questions',
      'Persistent cloud history',
      'Score trends & analytics',
      'Priority processing',
    ],
    cta: 'Get Pro',
  },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState<{ plan: 'pro' } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const { user, plan } = useApp();
  const router = useRouter();

  useEffect(() => {
    // Dynamically detect if client is outside India based on timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isInternational = !tz.includes('Calcutta') && !tz.includes('Asia/Kolkata');
      setCurrency(isInternational ? 'USD' : 'INR');
    } catch {
      setCurrency('INR');
    }
  }, []);

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Free') {
      router.push('/');
      return;
    }
    if (!user) {
      router.push('/auth');
      return;
    }
    setShowForm({ plan: 'pro' });
    setFormData((prev) => ({ ...prev, email: user.email || '' }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showForm) return;
    setLoading('pro');
    setError('');

    try {
      // 1. Create order on backend with selected currency
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pro',
          currency,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create order');
      }

      const { payment_session_id } = await res.json();

      // 2. Load Cashfree SDK and open checkout
      const { load } = await import('@cashfreepayments/cashfree-js');
      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox',
      });

      await cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: '_self',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(null);
    }
  };

  const dynamicTiers = tiers.map((tier) => {
    if (tier.name === 'Pro') {
      return {
        ...tier,
        price: currency === 'USD' ? '$4.99' : '₹399',
        features: [
          '50 resume analyses per month',
          'Claude Sonnet AI (Direct)',
          'Deep interview questions',
          'Persistent cloud history',
          'Score trends & analytics',
          'Priority processing',
        ],
      };
    }
    return tier;
  });

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Choose Your
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Interrogation </span>
            Level
          </h1>
          <p className="mt-3 text-sm text-zinc-500 max-w-md mx-auto">
            Free tier for quick Llama-powered checks. Pro for deep, Sonnet-powered analysis with cloud history.
          </p>
        </div>

        {/* GROQ vs Claude comparison banner */}
        <div className="mb-10 rounded-2xl border border-white/5 bg-zinc-900/50 p-6 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-white mb-4 text-center">Free vs Pro &mdash; How do they compare?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Free (GROQ Llama)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li>&bull; Llama 3.3 Model</li>
                <li>&bull; 2 resumes per day</li>
                <li>&bull; Results stored locally only</li>
                <li>&bull; Ideal for quick self-assessments</li>
              </ul>
            </div>
            <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Pro (Claude Sonnet)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li>&bull; Claude Sonnet AI (direct)</li>
                <li>&bull; 50 resumes per month</li>
                <li>&bull; Persistent cloud history</li>
                <li>&bull; Deep interrogation & analytics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 max-w-3xl mx-auto">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {dynamicTiers.map((tier) => {
            const isPlanActive =
              tier.name === 'Free'
                ? !user || plan === 'free'
                : !!user && plan === 'pro';
            return (
              <PricingCard
                key={tier.name}
                tier={tier}
                isYearly={false}
                onSelect={() => handleSelectPlan(tier.name)}
                loading={loading === tier.name.toLowerCase()}
                isActive={isPlanActive}
              />
            );
          })}
        </div>

        {/* Payment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 animate-fadeIn">
              <button
                onClick={() => setShowForm(null)}
                className="absolute top-4 right-4 rounded-lg p-1 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-lg font-bold text-white mb-1">
                Get Pro Plan (Lifetime Access)
              </h2>
              <p className="text-xs text-zinc-500 mb-6">
                One-time purchase &bull; Lifetime membership &bull; Powered by Cashfree
              </p>

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label htmlFor="pay-name" className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                  <input
                    id="pay-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="pay-email" className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                  <input
                    id="pay-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="pay-phone" className="block text-xs font-medium text-zinc-400 mb-1.5">Phone Number</label>
                  <input
                    id="pay-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none"
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!!loading}
                  className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/40 disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : `Pay ${currency === 'USD' ? '$4.99' : '₹399'} Once`
                  }
                </button>

                <p className="text-center text-[10px] text-zinc-600">
                  Secure payment powered by Cashfree. You will be redirected to complete payment.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
