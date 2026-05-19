'use client';

import { SessionData } from '../../lib/types';

interface HistoryListProps {
  sessions: SessionData[];
  onSelect: (session: SessionData) => void;
}

export default function HistoryList({ sessions, onSelect }: HistoryListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
            <path d="M9 12h6M12 9v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500">No analyses yet</p>
        <p className="text-xs text-zinc-600 mt-1">Submit a resume to get started</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-red-400 bg-red-500/10';
    if (score <= 60) return 'text-amber-400 bg-amber-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onSelect(session)}
          className="w-full group rounded-xl border border-white/5 bg-zinc-900/50 p-4 text-left transition-all hover:border-white/10 hover:bg-zinc-900/80"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">
                {session.resume_text.substring(0, 80)}...
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-xs text-zinc-600">
                  {new Date(session.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  session.ai_provider === 'claude' ? 'bg-red-500/10 text-red-400' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {session.ai_provider === 'claude' ? 'Claude' : 'GROQ'}
                </span>
              </div>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getScoreColor(session.score)}`}>
              <span className="text-lg font-bold tabular-nums">{session.score}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500 line-clamp-1 italic">
            &ldquo;{session.verdict}&rdquo;
          </p>
        </button>
      ))}
    </div>
  );
}
