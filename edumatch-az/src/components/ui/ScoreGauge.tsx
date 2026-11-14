'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  tone?: 'emerald' | 'indigo' | 'amber';
  className?: string;
}

const SIZE_MAP = {
  sm: { px: 48, stroke: 3.5, numClass: 'text-xs', subClass: 'text-[9px]' },
  md: { px: 62, stroke: 4, numClass: 'text-sm', subClass: 'text-[10px]' },
  lg: { px: 82, stroke: 5, numClass: 'text-lg', subClass: 'text-[11px]' },
} as const;

const TONE_MAP = {
  // Harmonized with Solaris Sky-Mint Pastel & Emerald Accent system
  amber: {
    stroke: 'var(--accent)',
    track: 'var(--accent-soft)',
  },
  emerald: {
    stroke: 'var(--accent)',
    track: 'var(--accent-soft)',
  },
  indigo: {
    stroke: 'var(--ink)',
    track: 'var(--surface-subtle)',
  },
} as const;

/**
 * Minimalist animated circular SVG admission score gauge (e.g., 686 / 700).
 * Uses physics-tuned SVG strokeDashoffset draw without blurry glows.
 */
export function ScoreGauge({
  score,
  maxScore = 700,
  size = 'md',
  label,
  tone = 'amber',
  className = '',
}: ScoreGaugeProps) {
  const cfg = SIZE_MAP[size];
  const palette = TONE_MAP[tone];
  const center = cfg.px / 2;
  const radius = center - cfg.stroke;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.max(0.08, Math.min(1, score / Math.max(1, maxScore)));
  const dashOffset = circumference * (1 - clampedPct);

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: cfg.px, height: cfg.px }}
      role="img"
      aria-label={label ?? `${score}/${maxScore}`}
    >
      <svg
        width={cfg.px}
        height={cfg.px}
        viewBox={`0 0 ${cfg.px} ${cfg.px}`}
        className="-rotate-90 overflow-visible"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={palette.track}
          strokeWidth={cfg.stroke}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={palette.stroke}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={`font-mono-num font-bold text-[var(--ink)] ${cfg.numClass}`}>
          {score}
        </span>
        <span className={`font-mono-num mt-0.5 font-medium text-[var(--muted)] ${cfg.subClass}`}>
          /{maxScore}
        </span>
      </div>
    </div>
  );
}
