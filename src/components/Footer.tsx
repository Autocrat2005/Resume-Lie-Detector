'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-center md:justify-between md:py-10">
        {/* Left Side: Brand & Note */}
        <div className="space-y-3 md:order-1 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="relative flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-red-500 to-red-700">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Resume<span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Lie Detector</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
            AI-powered resume interrogation. We cross-examine your claims with brutal precision.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-600">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure payments processed via Cashfree in INR (₹)
          </div>
        </div>

        {/* Right Side: Compliance & Policy Links */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 md:order-2 md:mt-0 text-xs">
          <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="text-zinc-400 hover:text-red-400 transition-colors font-semibold">
            Contact Us
          </Link>
          <Link href="/terms" className="text-zinc-400 hover:text-red-400 transition-colors font-semibold">
            Terms & Conditions
          </Link>
          <Link href="/refunds" className="text-zinc-400 hover:text-red-400 transition-colors font-semibold">
            Refunds & Cancellations
          </Link>
        </div>
      </div>

      {/* Underbar */}
      <div className="border-t border-white/[0.03] bg-black/20 py-4">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-600">
          <span>&copy; {new Date().getFullYear()} Resume Lie Detector. All rights reserved.</span>
          <span className="text-zinc-700">Disclaimer: AI verdicts are probabilistic evaluations. Interrogate at your own risk.</span>
        </div>
      </div>
    </footer>
  );
}
