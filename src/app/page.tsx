'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResumeInput from '../components/ResumeInput';
import { AIProvider, AnalysisResult } from '../../lib/types';
import { saveLocalSession, getLocalSessions } from '../../lib/store';
import { useApp } from '../components/Providers';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasExhaustedLimit, setHasExhaustedLimit] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');
  const router = useRouter();
  const { user, supabase, plan } = useApp();

  useEffect(() => {
    async function checkLimits() {
      if (!user) {
        // Anonymous users check
        const localSessions = getLocalSessions();
        const todayStr = new Date().toDateString();
        const todayCount = localSessions.filter(
          (s) => new Date(s.created_at).toDateString() === todayStr
        ).length;

        if (todayCount >= 1) {
          setHasExhaustedLimit(true);
          setLimitMessage('Daily limit reached. Anonymous users are limited to 1 resume analysis per day. Please sign up or log in to continue!');
        } else {
          setHasExhaustedLimit(false);
          setLimitMessage('');
        }
      } else if (supabase) {
        // Logged-in user check
        try {
          const maxResumes = plan === 'pro' ? 2 : 1;

          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);

          const { count, error: countError } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', startOfDay.toISOString());

          if (!countError && count !== null && count >= maxResumes) {
            setHasExhaustedLimit(true);
            setLimitMessage(`Daily limit reached. Your ${plan === 'pro' ? 'Pro' : 'Free'} plan is limited to ${maxResumes} resume analysis per day. Please check back tomorrow!`);
          } else {
            setHasExhaustedLimit(false);
            setLimitMessage('');
          }
        } catch (err) {
          console.error('Failed to check limits:', err);
        }
      }
    }

    checkLimits();
  }, [user, supabase, plan]);

  const handleAnalyze = async (text: string, provider: AIProvider) => {
    setIsLoading(true);
    setError('');

    try {
      // Anonymous users limit check on frontend
      if (!user) {
        const localSessions = getLocalSessions();
        const todayStr = new Date().toDateString();
        const todayCount = localSessions.filter(
          (s) => new Date(s.created_at).toDateString() === todayStr
        ).length;

        if (todayCount >= 1) {
          throw new Error(
            'Daily limit reached. Anonymous users are limited to 1 resume analysis per day. Please sign up or log in to continue!'
          );
        }
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: text, provider }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis failed');
      }

      const results: AnalysisResult & { provider: AIProvider } = await res.json();

      // Generate a session ID
      const sessionId = crypto.randomUUID();

      // Save to Supabase if authenticated
      if (user && supabase) {
        await supabase.from('sessions').insert({
          id: sessionId,
          user_id: user.id,
          resume_text: text,
          score: results.score,
          verdict: results.verdict,
          results_json: results,
          ai_provider: results.provider,
        });
      }

      // Always save locally for quick access
      saveLocalSession({
        id: sessionId,
        resume_text: text,
        score: results.score,
        verdict: results.verdict,
        results: results,
        ai_provider: results.provider,
        answers: [],
        created_at: new Date().toISOString(),
      });

      // Navigate to results
      router.push(`/results?id=${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-red-500/5 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center px-4 pt-16 sm:pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-12 max-w-2xl animate-slideUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-xs font-medium text-red-400">AI-Powered Resume Interrogation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            <span className="text-white">We Know</span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              You&apos;re Lying
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Paste your resume. Our AI will dissect every claim, generate aggressive interview questions,
            and expose what you <span className="italic text-zinc-300">actually</span> know.
          </p>

          {/* Stats */}
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-black text-white">87%</div>
              <div className="text-xs text-zinc-500">Resumes have exaggerations</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-white">12</div>
              <div className="text-xs text-zinc-500">Avg questions generated</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-white">2s</div>
              <div className="text-xs text-zinc-500">Analysis time</div>
            </div>
          </div>
        </div>

        {/* Resume Input */}
        <div className="w-full max-w-3xl animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <ResumeInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            hasExhaustedLimit={hasExhaustedLimit}
            limitMessage={limitMessage}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 w-full max-w-3xl rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 animate-fadeIn">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center space-y-4 animate-fadeIn">
              <div className="relative mx-auto h-20 w-20">
                <div className="absolute inset-0 rounded-full border-2 border-red-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-red-400 animate-spin" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Scanning your resume...</p>
                <p className="text-xs text-zinc-500 mt-1">Extracting claims and generating questions</p>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-20 w-full max-w-3xl animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 text-center mb-8">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Paste Resume',
                desc: 'Drop in your resume text. We analyze every single claim.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Face Questions',
                desc: 'AI generates targeted questions to verify your claims.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Get Exposed',
                desc: 'Each answer is evaluated. No more hiding behind buzzwords.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M2 12h20" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group rounded-xl border border-white/5 bg-zinc-900/30 p-5 transition-all hover:border-white/10 hover:bg-zinc-900/60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-zinc-400 group-hover:bg-red-500/10 group-hover:text-red-400 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 tracking-widest">{item.step}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
