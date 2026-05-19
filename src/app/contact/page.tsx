'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call for form submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <main className="relative min-h-screen pt-24 pb-16 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-red-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Interrogation
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Contact
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Us</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Have questions about your Pro subscription, billing, or technical issues? Get in touch.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Support Details (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-xl">
              <h2 className="text-base font-bold text-white mb-4">Support Channels</h2>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Support</div>
                    <a href="mailto:support@resumeliedetector.com" className="text-sm font-bold text-white hover:text-red-400 transition-colors">
                      support@resumeliedetector.com
                    </a>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Average response time: 24 hours</div>
                  </div>
                </div>

                {/* Operating Address */}
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Business Address</div>
                    <div className="text-sm font-bold text-white leading-relaxed">
                      Resume Lie Detector Inc.<br />
                      HSR Layout, Sector 6,<br />
                      Bengaluru, Karnataka 560102<br />
                      India
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Helpline</div>
                    <div className="text-sm font-bold text-white">+91 80 4912 3456</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Mon - Fri: 10:00 AM - 6:00 PM IST</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-xl">
              <h2 className="text-sm font-bold text-white mb-2">Whitelisting Verification Details</h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Resume Lie Detector is a fully registered service product. All transactions on this site are securely processed in Indian Rupees (INR) under modern encryption standards.
              </p>
            </div>
          </div>

          {/* Form (3 cols) */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white mb-6">Send Us a Message</h2>

              {status === 'success' ? (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400 border border-green-500/20 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Message Transmitted</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    We have intercepted your transmission. A technician will review your claims and respond to your email shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-400 mb-1.5">Your Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-red-500/30 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-red-500/30 focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-medium text-zinc-400 mb-1.5">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-red-500/30 focus:outline-none transition-colors"
                      placeholder="e.g. Pro subscription issue"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-400 mb-1.5">Message Details</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-red-500/30 focus:outline-none transition-colors resize-none"
                      placeholder="Explain your issue in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/40 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transmitting...
                      </>
                    ) : (
                      'Transmit Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
