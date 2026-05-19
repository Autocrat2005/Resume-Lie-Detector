'use client';

import { SkillClaim } from '../../lib/types';

interface SkillCardProps {
  skill: SkillClaim;
  index: number;
}

const confidenceConfig = {
  low: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: 'bg-red-500',
    label: 'Low Confidence',
  },
  medium: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500',
    label: 'Medium Confidence',
  },
  high: {
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    dot: 'bg-green-500',
    label: 'High Confidence',
  },
};

export default function SkillCard({ skill, index }: SkillCardProps) {
  const config = confidenceConfig[skill.confidence];

  return (
    <div
      className={`group relative rounded-xl border ${config.border} ${config.bg} p-4 transition-all duration-300 hover:scale-[1.02] hover:border-white/20`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{skill.name}</h3>
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{skill.reason}</p>
        </div>
        <span className={`flex items-center gap-1.5 shrink-0 rounded-full ${config.bg} px-2.5 py-1 text-xs font-medium ${config.color}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>
    </div>
  );
}
