'use client';

import Link from 'next/link';
import { useApp } from './Providers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, supabase, loading } = useApp();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-white">Resume</span>
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Lie Detector</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            Analyze
          </Link>
          <Link href="/pricing" className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            Pricing
          </Link>
          <Link href="/history" className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            History
          </Link>

          <div className="ml-2 h-5 w-px bg-white/10" />

          {loading ? (
            <div className="ml-2 h-8 w-20 animate-pulse rounded-lg bg-white/5" />
          ) : user ? (
            <div className="ml-2 flex items-center gap-2">
              <span className="text-xs text-zinc-500 truncate max-w-[120px]">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="ml-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/40"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-black/95 backdrop-blur-xl sm:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">Analyze</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">Pricing</Link>
            <Link href="/history" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">History</Link>
            <div className="my-2 h-px bg-white/10" />
            {user ? (
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-400 hover:bg-white/5 hover:text-white">Sign out</button>
            ) : (
              <Link href="/auth" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-white/5">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
