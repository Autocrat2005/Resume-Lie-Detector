'use client';

import { useEffect, useState } from 'react';
import { useApp } from '../../components/Providers';
import { SessionData } from '../../../lib/types';
import { getLocalSessions } from '../../../lib/store';
import HistoryList from '../../components/HistoryList';
import ScoreTrendChart from '../../components/ScoreTrendChart';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, supabase, loading } = useApp();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      if (loading) return;

      if (user && supabase) {
        const { data } = await supabase
          .from('sessions')
          .select('*')
          .order('created_at', { ascending: false });

        setSessions(data || []);
      } else {
        // Convert local sessions to SessionData format
        const local = getLocalSessions();
        const converted: SessionData[] = local.map((s) => ({
          id: s.id,
          user_id: null,
          resume_text: s.resume_text,
          score: s.score,
          verdict: s.verdict,
          results_json: s.results,
          ai_provider: s.ai_provider,
          created_at: s.created_at,
        }));
        setSessions(converted);
      }
      setFetching(false);
    }

    fetchSessions();
  }, [user, supabase, loading]);

  const chartData = [...sessions]
    .reverse()
    .map((s) => ({
      date: s.created_at,
      score: s.score,
    }));

  if (fetching || loading) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis History</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {user ? `${sessions.length} analyses saved` : 'Local sessions (sign in to persist)'}
            </p>
          </div>
          {!user && (
            <Link
              href="/auth"
              className="rounded-lg bg-white/5 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
            >
              Sign in to save
            </Link>
          )}
        </div>

        <ScoreTrendChart data={chartData} />

        <HistoryList
          sessions={sessions}
          onSelect={(session) => setSelectedSession(session)}
        />

        {/* Selected session modal */}
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6">
              <button
                onClick={() => setSelectedSession(null)}
                className="absolute top-4 right-4 rounded-lg p-1 text-zinc-500 hover:bg-white/5 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                    selectedSession.score <= 30 ? 'bg-red-500/10 text-red-400'
                    : selectedSession.score <= 60 ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-green-500/10 text-green-400'
                  }`}>
                    <span className="text-2xl font-black tabular-nums">{selectedSession.score}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Analysis Details</h2>
                    <p className="text-xs text-zinc-500">
                      {new Date(selectedSession.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Verdict</h3>
                  <p className="text-sm text-zinc-300 italic">&ldquo;{selectedSession.verdict}&rdquo;</p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Resume</h3>
                  <p className="text-xs text-zinc-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedSession.resume_text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
