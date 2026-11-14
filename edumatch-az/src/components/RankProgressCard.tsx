'use client';

import React from 'react';
import { Lock } from '@phosphor-icons/react';
import { RANK_TIERS } from '@/data/catalog';
import { COPY } from '@/data/i18n';
import { resolveLocalized } from '@/data/tutors';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { getRankIndex } from '@/lib/matching';
import type { Locale } from '@/types/edumatch';

interface RankProgressCardProps {
  locale: Locale;
  xp: number;
  onSelectRank: (rankIndex: number) => void;
}

export function RankProgressCard({
  locale,
  xp,
  onSelectRank,
}: RankProgressCardProps) {
  const copy = COPY[locale];
  const currentIdx = getRankIndex(xp);
  const current = RANK_TIERS[currentIdx];
  const next = RANK_TIERS[currentIdx + 1];
  const pct = next ? Math.min(100, ((xp - current.xp) / (next.xp - current.xp)) * 100) : 100;

  return (
    <div className="em-card rounded-3xl p-5">
      <div className="flex items-center gap-4">
        <AcademicEmblem iconKey={current.iconKey} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]">
            {copy.quiz.yourRank}
          </div>
          <h3 className="text-xl font-extrabold text-[var(--ink)]">
            {resolveLocalized(current.title, locale)}
          </h3>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="font-mono-num mt-1.5 text-xs font-bold text-[var(--muted)]">
            {xp} XP
            {next
              ? ` → ${next.xp} XP · ${resolveLocalized(next.title, locale)}`
              : ''}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {RANK_TIERS.map((tier, idx) => {
          const unlocked = idx <= currentIdx;
          return (
            <button
              key={tier.xp}
              type="button"
              onClick={() => onSelectRank(idx)}
              className={`flex w-24 shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition ${
                unlocked
                  ? 'border-[var(--border)] bg-[var(--surface-subtle)]/70 hover:border-[var(--primary)]'
                  : 'border-dashed border-[var(--border)] bg-[var(--surface)] opacity-75 hover:opacity-100'
              }`}
            >
              <AcademicEmblem iconKey={tier.iconKey} size="sm" locked={!unlocked} />
              <span className="flex items-center gap-0.5 text-[11px] font-extrabold text-[var(--ink)]">
                {unlocked ? (
                  resolveLocalized(tier.title, locale)
                ) : (
                  <>
                    <Lock size={10} weight="bold" aria-hidden="true" />
                    <span className="font-mono-num">{tier.xp}</span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
