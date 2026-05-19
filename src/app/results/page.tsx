'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnalysisResult, AIProvider } from '../../../lib/types';
import { getLocalSession, updateLocalSessionAnswers } from '../../../lib/store';
import ResultsSummary from '../../components/ResultsSummary';
import InterviewSession, { AnswerResult } from '../../components/InterviewSession';
import Link from 'next/link';

type Phase = 'summary' | 'interview' | 'complete';

function ResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [provider, setProvider] = useState<AIProvider>('groq');
  const [phase, setPhase] = useState<Phase>('summary');
  const [interviewResults, setInterviewResults] = useState<AnswerResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const session = getLocalSession(sessionId);
    if (session) {
      setResults(session.results);
      setProvider(session.ai_provider);
    }
    setLoading(false);
  }, [sessionId]);

  const handleInterviewComplete = (answers: AnswerResult[]) => {
    setInterviewResults(answers);
    setPhase('complete');

    // Save answers locally
    if (sessionId) {
      answers.forEach((a) => {
        updateLocalSessionAnswers(sessionId, {
          question: a.question.question,
          skill: a.question.skill,
          answer: a.answer,
          passed: a.passed,
          feedback: a.feedback,
        });
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
            <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white">Session not found</h2>
        <p className="mt-1 text-sm text-zinc-500">This analysis may have expired or been deleted.</p>
        <Link href="/" className="mt-4 rounded-lg bg-white/5 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-all">
          Start New Analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full animate-fadeIn">
      {phase === 'summary' && (
        <ResultsSummary
          results={results}
          onStartInterview={() => setPhase('interview')}
        />
      )}

      {phase === 'interview' && (
        <InterviewSession
          questions={results.questions}
          provider={provider}
          onComplete={handleInterviewComplete}
        />
      )}

      {phase === 'complete' && (
        <div className="w-full max-w-3xl mx-auto space-y-8 animate-slideUp">
          {/* Final Score */}
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
              Interrogation Complete
            </h2>

            {(() => {
              const passed = interviewResults.filter((r) => r.passed).length;
              const total = interviewResults.length;
              const pct = Math.round((passed / total) * 100);
              const label = pct >= 70 ? 'VERIFIED' : pct >= 40 ? 'PARTIALLY VERIFIED' : 'EXPOSED';
              const color = pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400';
              const borderColor = pct >= 70 ? 'border-green-500/20' : pct >= 40 ? 'border-amber-500/20' : 'border-red-500/20';
              const bgColor = pct >= 70 ? 'from-green-500/10' : pct >= 40 ? 'from-amber-500/10' : 'from-red-500/10';

              return (
                <div className={`rounded-2xl border ${borderColor} bg-gradient-to-b ${bgColor} to-transparent p-8`}>
                  <div className={`text-6xl font-black ${color}`}>{pct}%</div>
                  <div className={`text-sm font-bold tracking-[0.15em] mt-2 ${color}`}>{label}</div>
                  <p className="mt-3 text-sm text-zinc-400">
                    You passed <span className="font-bold text-white">{passed}</span> out of{' '}
                    <span className="font-bold text-white">{total}</span> questions
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Answer Review */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Answer Review
            </h3>
            {interviewResults.map((result, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  result.passed
                    ? 'border-green-500/10 bg-green-500/5'
                    : 'border-red-500/10 bg-red-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.passed ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="mt-0.5 shrink-0">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="mt-0.5 shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{result.question.question}</p>
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">Your answer: {result.answer}</p>
                    <p className={`mt-2 text-xs ${result.passed ? 'text-green-400/80' : 'text-red-400/80'}`}>
                      {result.feedback}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
            >
              Analyze Another
            </Link>
            <Link
              href="/history"
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
            >
              View History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </main>
  );
}
