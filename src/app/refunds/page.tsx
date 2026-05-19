import React from 'react';
import Link from 'next/link';

export default function RefundsPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-16 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-red-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Interrogation
          </Link>
        </div>

        {/* Content Box */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-6 md:p-10 backdrop-blur-xl space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Refunds &
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Cancellations</span>
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
              Last Updated: May 20, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-zinc-400 space-y-6 leading-relaxed">
            <p>
              At <strong>Resume Lie Detector</strong>, we want to ensure you have an optimal experience. However, because our service utilizes premium third-party AI models (including Anthropic Claude Sonnet) which incur substantial, instantaneous computation and token usage costs, we have established a clear and fair Refunds & Cancellations policy.
            </p>

            <div className="h-px bg-white/5 my-6" />

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">1. Cancellation Policy</h2>
              <p>
                You have full control over your subscription and can cancel at any time:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-500">
                <li>
                  <strong className="text-white">Self-Service Cancellation:</strong> You can cancel your Pro plan at any time through your Profile or Account settings page.
                </li>
                <li>
                  <strong className="text-white">Email Cancellation:</strong> Alternatively, you may request a cancellation by emailing our support team at <a href="mailto:support@resumeliedetector.com" className="text-red-400 hover:underline">support@resumeliedetector.com</a>. Please send the request from the email address registered with your account.
                </li>
              </ul>
              <p className="text-xs text-zinc-400">
                Upon cancellation, you will retain full access to all Pro features (including Claude Sonnet analysis and cloud history) until the end of your current active billing cycle. No further recurring charges will be made.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">2. Refund Policy</h2>
              <p>
                As a general rule, <strong className="text-white">payments made for Pro subscriptions are final and non-refundable</strong>. This is because high-end AI computation resources and API token limits are provisioned instantly upon your upgrade.
              </p>
              
              <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-xs text-zinc-400">
                <span className="font-bold text-red-400 uppercase tracking-wide block mb-1">Exceptional Refund Circumstances</span>
                We review refund requests on a case-by-case basis and may issue a refund in the following situations:
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li><strong className="text-white">Billing Errors:</strong> You were double-billed or charged an incorrect amount due to a technical error on our platform or the payment gateway.</li>
                  <li><strong className="text-white">Unauthorized Transactions:</strong> In the event of confirmed fraudulent card use or unauthorized charges, we will immediately process a full refund.</li>
                  <li><strong className="text-white">Technical Failures:</strong> If a persistent technical system outage prevents you from utilizing the Pro features for more than 48 consecutive hours, we will issue a pro-rata refund for the affected period.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">3. Refund Processing and Timeline</h2>
              <p>
                If a refund request is approved:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-500">
                <li>The refund will be processed directly through our payment processor, <strong className="text-white">Cashfree Payments</strong>.</li>
                <li>Refunds can only be credited back to the original payment source (credit/debit card, UPI, net banking, or wallet) used for the initial transaction.</li>
                <li>The refunded amount typically reflects in your bank account or payment method within <strong className="text-white">5 to 7 business days</strong>, depending on your bank&apos;s processing times.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">4. Contact for Refund and Cancellation Support</h2>
              <p>
                To lodge a refund dispute or inquire about your billing status, please submit a request to our billing desk:
              </p>
              <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-4 space-y-2 text-xs">
                <p>
                  <strong className="text-zinc-400">Email Address:</strong> <a href="mailto:support@resumeliedetector.com" className="text-red-400 hover:underline">support@resumeliedetector.com</a>
                </p>
                <p>
                  <strong className="text-zinc-400">Required Details:</strong> Please include your full name, registered account email, date of transaction, amount paid, and transaction reference ID (obtained from your email receipt).
                </p>
                <p>
                  <strong className="text-zinc-400">Response Window:</strong> We review all financial queries within 24 hours.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
