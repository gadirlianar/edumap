'use client';

import React from 'react';
import { ArrowRight, TrendUp } from '@phosphor-icons/react';
import { getSubjectTheme } from '@/data/tutorVisuals';
import type { SubjectId } from '@/types/edumatch';

interface ScoreTrajectoryBarProps {
  before: string;
  after: string;
  delta: string;
  label: string;
  progressPct: number;
  subject?: SubjectId;
  compact?: boolean;
}

/**
 * Compact visual score-growth bar shared across Hero Spotlight and TutorCard.
 */
export function ScoreTrajectoryBar({
  before,
  after,
  delta,
  label,
  progressPct,
  subject,
  compact = false,
}: ScoreTrajectoryBarProps) {
  const theme = getSubjectTheme(subject);
  const clampedPct = Math.max(24, Math.min(100, Math.round(progressPct)));

  return (
    <div
      className={`rounded-[18px] border ${theme.softBoxClass} ${
        compact ? 'px-3.5 py-2.5' : 'px-4 py-3'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[var(--ink-2)]">
          <TrendUp size={13} weight="bold" className="shrink-0 text-[var(--accent-ink)]" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono-num text-[11px] font-bold ${theme.pillClass}`}
        >
          <span>{before}</span>
          <ArrowRight size={10} weight="bold" aria-hidden="true" />
          <span>{after}</span>
          <span className="opacity-80">({delta})</span>
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--surface)]/80 ring-1 ring-black/5 dark:bg-slate-950/60 dark:ring-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.barGradientClass} transition-all duration-500`}
          style={{ width: `${clampedPct}%` }}
        />
      </div>
    </div>
  );
}
