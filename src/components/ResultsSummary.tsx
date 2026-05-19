'use client';

import { AnalysisResult } from '../../lib/types';
import ScoreGauge from './ScoreGauge';
import SkillCard from './SkillCard';

interface ResultsSummaryProps {
  results: AnalysisResult;
  onStartInterview: () => void;
}

export default function ResultsSummary({ results, onStartInterview }: ResultsSummaryProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Score + Verdict */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
        <ScoreGauge score={results.score} />

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">The Verdict</h2>
          <p className="text-xl font-bold text-white leading-relaxed">
            &ldquo;{results.verdict}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-4 justify-center sm:justify-start">
            <span className="text-xs text-zinc-500">
              {results.skills.length} claims analyzed
            </span>
            <span className="text-xs text-zinc-600">•</span>
            <span className="text-xs text-zinc-500">
              {results.questions.length} questions ready
            </span>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
          Skill Assessment
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {results.skills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartInterview}
          className="group relative"
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 opacity-50 blur-lg transition-opacity group-hover:opacity-80" />
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-black px-8 py-4 text-base font-semibold text-white transition-all group-hover:border-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
            Start the Interrogation
            <span className="text-xs text-zinc-500">({results.questions.length} questions)</span>
          </div>
        </button>
      </div>
    </div>
  );
}
