'use client';

import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export default function ScoreGauge({ score, size = 200 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s <= 30) return { stroke: '#ef4444', glow: '#ef444480', label: 'SUSPICIOUS', bg: 'from-red-500/10 to-red-900/10' };
    if (s <= 60) return { stroke: '#f59e0b', glow: '#f59e0b80', label: 'QUESTIONABLE', bg: 'from-amber-500/10 to-amber-900/10' };
    return { stroke: '#22c55e', glow: '#22c55e80', label: 'CREDIBLE', bg: 'from-green-500/10 to-green-900/10' };
  };

  const { stroke, glow, label, bg } = getColor(score);

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className={`relative flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-b ${bg} p-6`}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-lg" style={{ filter: `drop-shadow(0 0 20px ${glow})` }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-100"
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: '12px' }}>
        <span className="text-5xl font-black tabular-nums" style={{ color: stroke }}>
          {animatedScore}
        </span>
        <span className="text-xs font-medium text-zinc-500 mt-1">/ 100</span>
      </div>

      <span
        className="text-xs font-bold tracking-[0.2em] uppercase"
        style={{ color: stroke }}
      >
        {label}
      </span>
    </div>
  );
}
