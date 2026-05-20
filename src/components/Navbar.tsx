'use client';

import Link from 'next/link';
import { useApp } from './Providers';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { user, supabase, loading, plan } = useApp();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

          {!mounted || loading ? (
            <div className="ml-2 h-8 w-20 animate-pulse rounded-lg bg-white/5" />
          ) : user ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl bg-white/5 p-1.5 pr-3 text-sm text-zinc-400 transition-all hover:bg-white/10 hover:text-white border border-white/5 focus:outline-none"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-violet-600 text-xs font-bold text-white shadow-md shadow-red-500/10">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate text-xs font-medium text-zinc-300">
                  {user.email ? user.email.split('@')[0] : 'User'}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`text-zinc-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-2.5 border-b border-white/5">
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-medium text-white truncate mt-0.5">{user.email}</p>
                    
                    <div className="mt-2 flex items-center gap-1.5">
                      {plan === 'pro' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-400 shadow-sm shadow-yellow-500/10 uppercase tracking-wider">
                          👑 Pro Member
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          Free Account
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" x2="4" y1="22" y2="15" />
                      </svg>
                      Analyze Resume
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Analysis History
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                      Pricing Tiers
                    </Link>
                  </div>

                  <div className="h-px bg-white/5 my-1" />

                  <div className="p-1">
                    <button
                      onClick={() => { handleSignOut(); setDropdownOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
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
            {!mounted || loading ? (
              <div className="h-8 w-full animate-pulse rounded-lg bg-white/5 mb-1" />
            ) : user ? (
              <div className="rounded-xl border border-white/5 bg-white/5 p-3 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-violet-600 text-xs font-bold text-white shadow-md shadow-red-500/10">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="truncate min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1 uppercase tracking-wider font-bold">
                      {plan === 'pro' ? (
                        <span className="text-yellow-400">👑 Pro Member</span>
                      ) : (
                        <span>Free Account</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false); }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
