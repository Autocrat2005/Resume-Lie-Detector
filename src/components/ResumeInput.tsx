'use client';

import { useState, useRef } from 'react';
import { AIProvider } from '../../lib/types';

interface ResumeInputProps {
  onAnalyze: (text: string, provider: AIProvider) => void;
  isLoading: boolean;
}

export default function ResumeInput({ onAnalyze, isLoading }: ResumeInputProps) {
  const [text, setText] = useState('');
  const [provider, setProvider] = useState<AIProvider>('groq');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch {
      // Clipboard API not available
    }
  };

  const charCount = text.length;
  const isValid = charCount >= 50 && charCount <= 15000;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        {/* Glow border */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-500/20 via-transparent to-cyan-500/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl p-1">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Paste your resume</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1 text-xs text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Paste
              </button>
              <button
                onClick={() => setText('')}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1 text-xs text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Drop your resume text here... We'll find the lies."
            className="w-full min-h-[300px] resize-y bg-transparent px-4 py-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none leading-relaxed"
            spellCheck={false}
          />

          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span className={`text-xs tabular-nums ${charCount > 15000 ? 'text-red-400' : charCount >= 50 ? 'text-zinc-500' : 'text-zinc-600'}`}>
                {charCount.toLocaleString()} / 15,000
              </span>

              {/* Provider toggle */}
              <div className="flex items-center gap-1 rounded-lg bg-white/5 p-0.5">
                <button
                  onClick={() => setProvider('groq')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    provider === 'groq'
                      ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Free (GROQ Llama)
                </button>
                <button
                  onClick={() => setProvider('claude')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    provider === 'claude'
                      ? 'bg-red-500/20 text-red-400 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Pro (Claude Sonnet)
                </button>
              </div>
            </div>

            <button
              onClick={() => onAnalyze(text, provider)}
              disabled={!isValid || isLoading}
              className="relative group/btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 opacity-70 blur-sm transition-opacity group-hover/btn:opacity-100" />
              <div className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xl shadow-red-500/25 transition-all hover:shadow-red-500/40">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    Detect Lies
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
