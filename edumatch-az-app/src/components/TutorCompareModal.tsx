'use client';

import React from 'react';
import {
  Crown,
  GraduationCap,
  Scales,
  SealCheck,
  Star,
  TrendUp,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import {
  COPY,
  FORMAT_LABELS,
  LANG_LABELS,
  STYLE_LABELS,
  SUBJECT_LABELS,
} from '@/data/i18n';
import { resolveLocalized, resolveTutorName } from '@/data/tutors';
import { COMPARE_COPY, getTutorVisual } from '@/data/tutorVisuals';
import { Avatar } from '@/components/ui/Avatar';
import { ModalShell } from '@/components/ui/ModalShell';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import type { Locale, TutorProfile } from '@/types/edumatch';

interface TutorCompareModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  tutors: TutorProfile[];
  compareIds: string[];
  onSelectSlot: (slotIndex: 0 | 1, tutorId: string) => void;
  onOpenProfile: (tutorId: string) => void;
  onSendRequest: (tutorId: string, trial: boolean) => void;
  getMatchScore: (tutor: TutorProfile) => number;
}

export function TutorCompareModal({
  open,
  onClose,
  locale,
  tutors,
  compareIds,
  onSelectSlot,
  onOpenProfile,
  onSendRequest,
  getMatchScore,
}: TutorCompareModalProps) {
  const copy = COPY[locale];
  const cmp = COMPARE_COPY[locale];

  if (!open || tutors.length === 0) return null;

  const fallbackA = tutors[0];
  const fallbackB = tutors.find((t) => t.id !== (compareIds[0] ?? fallbackA.id)) ?? tutors[0];

  const tutorA = tutors.find((t) => t.id === compareIds[0]) ?? fallbackA;
  const tutorB =
    tutors.find((t) => t.id === compareIds[1] && t.id !== tutorA.id) ?? fallbackB;

  const pair: [TutorProfile, TutorProfile] = [tutorA, tutorB];
  const higherScoreId =
    tutorA.education.admissionScore >= tutorB.education.admissionScore
      ? tutorA.id
      : tutorB.id;

  const nameA = resolveTutorName(tutorA, locale).split(' ')[0];
  const nameB = resolveTutorName(tutorB, locale).split(' ')[0];
  const fitA = getMatchScore(tutorA);
  const fitB = getMatchScore(tutorB);
  const scoreDiff = Math.abs(
    tutorA.education.admissionScore - tutorB.education.admissionScore
  );
  const advLabels = {
    ru: { score: 'Балл DİM', fit: 'Совпадение', price: 'Выгоднее', rating: 'Рейтинг', tie: 'Равно' },
    az: { score: 'DİM balı', fit: 'Uyğunluq', price: 'Sərfəli', rating: 'Reytinq', tie: 'Bərabər' },
    en: { score: 'DİM Score', fit: 'Match Fit', price: 'Lower Rate', rating: 'Rating', tie: 'Tie' },
  }[locale];

  const advantageItems = [
    {
      label: advLabels.score,
      value:
        scoreDiff === 0
          ? advLabels.tie
          : `${tutorA.education.admissionScore > tutorB.education.admissionScore ? nameA : nameB} (+${scoreDiff})`,
    },
    {
      label: advLabels.fit,
      value:
        fitA === fitB
          ? `${fitA}% (${advLabels.tie})`
          : `${fitA > fitB ? nameA : nameB} (${Math.max(fitA, fitB)}%)`,
    },
    {
      label: advLabels.price,
      value:
        tutorA.price === tutorB.price
          ? `${tutorA.price} ₼`
          : `${tutorA.price < tutorB.price ? nameA : nameB} (${Math.min(tutorA.price, tutorB.price)} ₼)`,
    },
    {
      label: advLabels.rating,
      value:
        tutorA.rating === tutorB.rating
          ? `${tutorA.rating.toFixed(1)} ★`
          : `${tutorA.rating > tutorB.rating ? nameA : nameB} (${Math.max(tutorA.rating, tutorB.rating).toFixed(1)} ★)`,
    },
  ];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={cmp.modalTitle}
      subtitle={cmp.modalSubtitle}
      closeLabel={copy.chat.close}
      maxWidthClass="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Clean Quick-Pick Comparison Slot Selectors (All 12 Tutors) */}
        <div className="grid gap-3 sm:grid-cols-2">
          {([0, 1] as const).map((slotIdx) => {
            const selected = pair[slotIdx];
            return (
              <div
                key={slotIdx}
                className="rounded-3xl bg-[var(--surface-subtle)]/80 p-3.5"
              >
                <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  <span>{slotIdx === 0 ? cmp.pickLeftLabel : cmp.pickRightLabel}</span>
                  <span className="font-mono-num text-[var(--accent-ink)]">
                    {selected.education.admissionScore}/{selected.education.maxScore}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tutors.map((t) => {
                    const active = selected.id === t.id;
                    const tName = resolveTutorName(t, locale);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onSelectSlot(slotIdx, t.id)}
                        className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 active:scale-[0.97] ${
                          active
                            ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                            : 'bg-[var(--surface)] text-[var(--ink-2)] hover:bg-[var(--accent-soft)]/50 hover:text-[var(--ink)]'
                        }`}
                      >
                        {tName.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Head-to-Head Advantage Strip */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--accent-soft)]/45 p-3 sm:grid-cols-4">
          {advantageItems.map((item) => (
            <div key={item.label} className="rounded-xl bg-[var(--surface)]/80 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {item.label}
              </div>
              <div className="mt-0.5 truncate font-mono-num text-xs font-bold text-[var(--accent-ink)]">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Clean Minimalist Side-by-Side Comparison Columns */}
        <div className="relative grid gap-4 md:grid-cols-2">
          {/* Desktop Center VS Pill */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-10 z-20 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--ink)] font-mono-num text-[11px] font-bold text-[var(--bg)] shadow-xs md:flex"
          >
            VS
          </div>

          {pair.map((tutor, idx) => {
            const tName = resolveTutorName(tutor, locale);
            const visual = getTutorVisual(tutor.id, idx);
            const isLeader = tutor.id === higherScoreId;
            const fit = getMatchScore(tutor);

            return (
              <div
                key={`${idx}-${tutor.id}`}
                className={`flex flex-col overflow-hidden rounded-[28px] border bg-[var(--surface)] transition-all duration-150 ${
                  isLeader ? 'border-[var(--accent)] shadow-sm' : 'border-[var(--border)]'
                }`}
              >
                {/* Header Section without Banner Noise */}
                <div className="bg-[var(--surface-subtle)]/80 p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    {isLeader ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-ink)]">
                        <Crown size={12} weight="fill" aria-hidden="true" />
                        {cmp.winnerBadge}
                      </span>
                    ) : (
                      <span className="font-mono-num text-[11px] font-semibold text-[var(--muted)]">
                        {idx === 0 ? cmp.pickLeftLabel : cmp.pickRightLabel}
                      </span>
                    )}
                    <span className="font-mono-num text-xs font-semibold text-[var(--ink)]">
                      {tutor.price} ₼ {copy.tutorCard.perLesson} · {fit}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <Avatar
                      id={tutor.id}
                      name={tName}
                      index={idx}
                      size="lg"
                      verified={tutor.education.verified}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate text-lg font-semibold tracking-tight text-[var(--ink)]">
                          {tName}
                        </h3>
                        {tutor.education.verified ? (
                          <SealCheck
                            size={15}
                            weight="fill"
                            className="shrink-0 text-[var(--accent)]"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                        <span className="inline-flex items-center gap-1 font-semibold text-[var(--ink)]">
                          <Star
                            size={12}
                            weight="fill"
                            className="text-[var(--accent)]"
                            aria-hidden="true"
                          />
                          {tutor.rating.toFixed(1)}
                        </span>
                        <span>({tutor.n})</span>
                        <span>·</span>
                        <span>{tutor.education.universityShort}</span>
                        <span>·</span>
                        <span className="font-mono-num">{tutor.education.admissionYear}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Matrix Body */}
                <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                  {/* Superpower Differentiator */}
                  <div className="border-l-2 border-[var(--accent)] pl-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {cmp.superpowerRowLabel}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-[var(--accent-ink)]">
                      {resolveLocalized(visual.superpowerTag, locale)}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--ink-2)]">
                      {resolveLocalized(tutor.strengths.differentiator, locale)}
                    </p>
                  </div>

                  {/* University & Entrance Score */}
                  <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        {cmp.scoreRowLabel}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
                        <GraduationCap
                          size={15}
                          weight="fill"
                          className="shrink-0 text-[var(--accent-ink)]"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          {resolveLocalized(tutor.education.university, locale)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        {resolveLocalized(tutor.education.faculty, locale)}
                      </p>
                    </div>
                    <ScoreGauge
                      score={tutor.education.admissionScore}
                      maxScore={tutor.education.maxScore}
                      size="md"
                      tone="emerald"
                    />
                  </div>

                  {/* Proven Outcomes */}
                  <div className="border-t border-[var(--border)] pt-3.5">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {cmp.resultsRowLabel}
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
                      {tutor.achievements.slice(0, 2).map((ach, achIdx) => (
                        <div key={ach.id} className={achIdx === 0 ? 'pr-3' : 'pl-3'}>
                          <div className="flex items-center gap-1 font-mono-num text-sm font-semibold text-[var(--accent-ink)]">
                            <TrendUp size={12} weight="bold" aria-hidden="true" />
                            <span>{ach.metric}</span>
                          </div>
                          <div className="mt-0.5 text-[11px] leading-snug text-[var(--muted)]">
                            {resolveLocalized(ach.label, locale)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trajectory Progress */}
                  <div className="border-t border-[var(--border)] pt-3.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[var(--ink)]">
                        {resolveLocalized(visual.trajectory.label, locale)}
                      </span>
                      <span className="font-mono-num text-[var(--accent-ink)]">
                        {visual.trajectory.before} → {visual.trajectory.after}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${visual.trajectory.bar1Pct}%` }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${
                          isLeader ? 'bg-[var(--accent)]' : 'bg-[var(--ink)]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Tags & Format */}
                  <div className="flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-3.5">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink)]">
                      {SUBJECT_LABELS[tutor.subj[0]][locale]}
                    </span>
                    {tutor.sty.length > 0 ? (
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
                        {tutor.sty
                          .slice(0, 2)
                          .map((s) => STYLE_LABELS[s][locale])
                          .join(' · ')}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
                      {tutor.fmt.map((f) => FORMAT_LABELS[f][locale]).join(' · ')}
                    </span>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
                      {tutor.lang.map((l) => LANG_LABELS[l][locale]).join(', ')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProfile(tutor.id);
                      }}
                      className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                    >
                      {cmp.openDossierBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSendRequest(tutor.id, true);
                      }}
                      className="inline-flex min-h-[38px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
                    >
                      <Scales size={13} weight="bold" aria-hidden="true" />
                      <span>{cmp.bookTrialBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}
