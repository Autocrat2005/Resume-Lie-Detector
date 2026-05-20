import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
              Terms &
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Conditions</span>
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
              Last Updated: May 20, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-zinc-400 space-y-6 leading-relaxed">
            <p>
              Welcome to <strong>Resume Lie Detector</strong>. These Terms & Conditions govern your access to and use of our website, platform, APIs, and associated services (collectively, the &quot;Service&quot;). By accessing, browsing, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>

            <div className="h-px bg-white/5 my-6" />

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">1. Description of Service</h2>
              <p>
                Resume Lie Detector is an advanced AI-powered platform that analyzes submitted professional resumes, estimates the probability of exaggerated claims, and generates targeted, rigorous interview questions to verify candidate qualifications. The Service is provided for educational, career development, and verification purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">2. Account Creation & Eligibility</h2>
              <p>
                To access certain features of the Service (such as cloud history, analytical scores, and direct Claude Sonnet integration), you must register for an account using a valid email address via our authentication system. You are entirely responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-500">
                <li>Maintaining the confidentiality of your login credentials.</li>
                <li>Ensuring the accuracy of any registration information you provide.</li>
                <li>All activities occurring under your account.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">3. Subscription Tiers, Pricing & Payments</h2>
              <p>
                We offer two tiers of access:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400">
                <li>
                  <strong className="text-white">Free Tier:</strong> Free of charge. Limited to 1 resume analysis per day. Powered by GROQ Llama 3.3. Results are saved in your local browser session.
                </li>
                <li>
                  <strong className="text-white">Pro Tier:</strong> Priced at <strong className="text-white">₹399 per month</strong> or <strong className="text-white">₹3,399 per year</strong> (inclusive of all applicable taxes). Billed recurringly. Provides access to Claude Sonnet analysis, 1 resume analysis per day, and persistent cloud-based analytics history.
                </li>
              </ul>
              <p>
                Payments are securely routed via our payment partner, <strong className="text-white">Cashfree Payments</strong>. All transactions are billed in Indian Rupees (INR).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">4. Acceptable Use Policy</h2>
              <p>
                By using the Service, you agree that you will not:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-500">
                <li>Upload resumes, CVs, or personal data belonging to third parties without their explicit consent.</li>
                <li>Submit material that violates patent, copyright, trademark, privacy, or proprietary rights.</li>
                <li>Employ bots, scrapers, automated scripts, or tools to request or harvest information from the platform.</li>
                <li>Attempt to bypass subscription limitations or daily limits.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">5. AI Model Disclaimers & Accuracy</h2>
              <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-xs text-zinc-400 leading-relaxed">
                <span className="font-bold text-red-400 uppercase tracking-wide block mb-1">Important Disclaimer</span>
                Resume Lie Detector relies on third-party Large Language Models (LLMs) including Anthropic Claude Sonnet and GROQ Llama. You acknowledge and agree that:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>AI models can generate inaccurate, hallucinated, incomplete, or biased information.</li>
                  <li>The platform&apos;s &quot;Verdict&quot; and &quot;Interrogation Score&quot; are speculative predictions and do not constitute absolute proof of truthfulness or lying.</li>
                  <li>We are not responsible for any recruitment, hiring, firing, or career decisions made based on reports from this Service.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">6. Intellectual Property</h2>
              <p>
                The designs, code, text outputs, logos, algorithms, and interface elements of Resume Lie Detector are protected by trademark, copyright, and database laws. Your subscription grants you a personal, non-transferable, revocable license to access the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">7. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms & Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any dispute arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts located in Bengaluru, Karnataka, India.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">8. Contact Information</h2>
              <p>
                If you have any questions or clarifications regarding these Terms, please reach out to us at:
              </p>
              <p className="text-zinc-300 font-medium">
                Email: <a href="mailto:yash@causalith.com" className="text-red-400 hover:underline">yash@causalith.com</a><br />
                Address: Resume Lie Detector Inc., Sector 6, HSR Layout, Bengaluru, KA, 560102, India
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
