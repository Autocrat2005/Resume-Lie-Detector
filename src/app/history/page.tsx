'use client';

import { useEffect, useState } from 'react';
import { useApp } from '../../components/Providers';
import { SessionData } from '../../../lib/types';
import { getLocalSessions } from '../../../lib/store';
import HistoryList from '../../components/HistoryList';
import ScoreTrendChart from '../../components/ScoreTrendChart';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { user, supabase, loading } = useApp();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

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
          onSelect={(session) => router.push(`/results?id=${session.id}`)}
        />
      </div>
    </main>
  );
}
