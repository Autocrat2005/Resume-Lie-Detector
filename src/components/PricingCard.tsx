'use client';

import { PricingTier } from '../../lib/types';

interface PricingCardProps {
  tier: PricingTier;
  isYearly: boolean;
  onSelect?: () => void;
  loading?: boolean;
  isActive?: boolean;
}

export default function PricingCard({ tier, isYearly, onSelect, loading, isActive }: PricingCardProps) {
  const price = isYearly && tier.yearlyPrice ? tier.yearlyPrice : tier.price;

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] ${
        isActive
          ? 'border-green-500/30 bg-gradient-to-b from-green-500/5 to-transparent shadow-xl shadow-green-500/5'
          : tier.popular
          ? 'border-red-500/30 bg-gradient-to-b from-red-500/10 to-transparent shadow-xl shadow-red-500/5'
          : 'border-white/10 bg-zinc-900/50 hover:border-white/20'
      }`}
    >
      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-green-500/30 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            ACTIVE PLAN
          </span>
        </div>
      )}
      {!isActive && tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-red-500/30">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
        <p className="mt-1 text-sm text-zinc-400">{tier.description}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-2">
        <span className="text-4xl font-black text-white">{price}</span>
        {price !== 'Free' && price !== 'Custom' && (
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-bold text-zinc-400">
            One-time payment
          </span>
        )}
      </div>

      <button
        onClick={isActive ? undefined : onSelect}
        disabled={loading || isActive}
        className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-75 ${
          isActive
            ? 'bg-green-500/10 border border-green-500/20 text-green-400 cursor-default'
            : tier.popular
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40'
            : 'bg-white/5 text-white hover:bg-white/10'
        }`}
      >
        {loading ? 'Processing...' : isActive ? 'Current Plan' : tier.cta}
      </button>

      <div className="mt-6 space-y-3">
        {tier.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="mt-0.5 shrink-0">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-sm text-zinc-300">{feature}</span>
          </div>
        ))}
        {tier.limitations?.map((limitation) => (
          <div key={limitation} className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
            <span className="text-sm text-zinc-500">{limitation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
