'use client';

import React from 'react';
import {
  ArrowRight,
  ChatCircleDots,
  Crown,
  GraduationCap,
  Heart,
  MapPin,
  Scales,
  SealCheck,
  Sparkle,
  Star,
  Trophy,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { COPY, FORMAT_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import { resolveLocalized, resolveTutorName } from '@/data/tutors';
import { COMPARE_COPY, getSmartMatchTag, getSubjectTheme, getTutorVisual } from '@/data/tutorVisuals';
import { Avatar } from '@/components/ui/Avatar';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { ScoreTrajectoryBar } from '@/components/ui/ScoreTrajectoryBar';
import type { LevelId, Locale, TutorProfile } from '@/types/edumatch';

interface TutorCardProps {
  tutor: TutorProfile;
  index: number;
  locale: Locale;
  isPromoted: boolean;
  isFavorite: boolean;
  isCompared?: boolean;
  matchScore: number;
  distanceKm: number | null;
  studentLevel: LevelId | null;
  onToggleFavorite: (tutorId: string) => void;
  onToggleCompare?: (tutorId: string) => void;
  onOpenProfile: (tutorId: string) => void;
  onSendRequest: (tutorId: string, trial: boolean) => void;
}

const EASE_CARD = [0.22, 1, 0.36, 1] as const;

export function TutorCard({
  tutor,
  index,
  locale,
  isPromoted,
  isFavorite,
  isCompared = false,
  matchScore,
  distanceKm,
  onToggleFavorite,
  onToggleCompare,
  onOpenProfile,
  onSendRequest,
}: TutorCardProps) {
  const copy = COPY[locale];
  const cmp = COMPARE_COPY[locale];
  const visual = getTutorVisual(tutor.id, index);

  const tutorName = resolveTutorName(tutor, locale);
  const university = resolveLocalized(tutor.education.university, locale);
  const faculty = resolveLocalized(tutor.education.faculty, locale);
  const differentiator = resolveLocalized(tutor.strengths.differentiator, locale);
  const primaryAchievement = tutor.achievements[0];
  const secondaryAchievement = tutor.achievements[1];
  const primarySubject = tutor.subj[0];
  const subjectTheme = getSubjectTheme(primarySubject);
  const smartTag = getSmartMatchTag(tutor, locale, matchScore, index);

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.14, ease: EASE_CARD }}
      className={`group flex w-full min-w-0 flex-col justify-between overflow-hidden rounded-[28px] border bg-[var(--surface)] shadow-[var(--shadow-card)] transition-all duration-150 ${
        isCompared
          ? 'border-[var(--accent)] ring-1 ring-[var(--accent-border)]'
          : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-float)]'
      }`}
    >
      <div
        aria-hidden="true"
        className={`h-1.5 w-full bg-gradient-to-r ${subjectTheme.topStripClass}`}
      />
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
      <div className="space-y-4">
        {/* 1. Clean Top Row: Photo, Name, Subject Pill & Rate */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <Avatar
              id={tutor.id}
              name={tutorName}
              index={index}
              size="lg"
              verified={tutor.education.verified}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenProfile(tutor.id)}
                  className="cursor-pointer truncate text-left text-[17px] font-semibold tracking-tight text-[var(--ink)] underline-offset-4 transition-colors hover:text-[var(--accent-ink)] hover:underline"
                >
                  {tutorName}
                </button>
                {tutor.education.verified ? (
                  <SealCheck
                    size={15}
                    weight="fill"
                    className="shrink-0 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                ) : null}
                {isPromoted ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--lime-soft)] px-2 py-0.5 text-[10px] font-bold text-[#0F172A] dark:text-[var(--lime)]">
                    <Crown size={11} weight="fill" aria-hidden="true" />
                    <span>{copy.tutorCard.adBadge}</span>
                  </span>
                ) : null}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--ink)]">
                  <Star
                    size={12}
                    weight="fill"
                    className="text-amber-500"
                    aria-hidden="true"
                  />
                  {tutor.rating.toFixed(1)}
                  <span className="font-normal text-[var(--muted)]">({tutor.n})</span>
                </span>
                {primarySubject ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${subjectTheme.pillClass}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${subjectTheme.dotColorClass}`}
                    />
                    {SUBJECT_LABELS[primarySubject][locale]}
                  </span>
                ) : null}
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${smartTag.toneClass}`}
                >
                  <Sparkle size={10} weight="fill" aria-hidden="true" />
                  <span>{smartTag.text}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <div className="text-right leading-none">
              <span className="font-mono-num text-lg font-bold text-[var(--ink)]">
                {tutor.price} ₼
              </span>
              <span className="ml-1 text-[11px] text-[var(--muted)]">
                {copy.tutorCard.perLesson}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {onToggleCompare ? (
                <button
                  type="button"
                  onClick={() => onToggleCompare(tutor.id)}
                  aria-pressed={isCompared}
                  className={`inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${isCompared
                    ? 'border-[var(--primary-btn)] bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                    : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'
                    }`}
                >
                  <Scales size={12} weight="bold" aria-hidden="true" />
                  <span>{isCompared ? cmp.vsButtonActive : cmp.vsButtonShort}</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => onToggleFavorite(tutor.id)}
                aria-label={
                  locale === 'az'
                    ? `Yadda saxla: ${tutorName}`
                    : locale === 'en'
                      ? `Save mentor: ${tutorName}`
                      : `Сохранить: ${tutorName}`
                }
                aria-pressed={isFavorite}
                className={`grid h-7 w-7 cursor-pointer place-items-center rounded-full border transition-colors ${isFavorite
                  ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'
                  }`}
              >
                <Heart
                  size={13}
                  weight={isFavorite ? 'fill' : 'regular'}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Soft Sky-Mint University & Verified Score Strip */}
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-[20px] bg-gradient-to-r from-[#F0F9FF]/95 to-[#ECFDF5]/95 px-4 py-3 dark:from-[#16273E] dark:to-[#122B28]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
              <GraduationCap
                size={15}
                weight="fill"
                className="shrink-0 text-[var(--accent-ink)]"
                aria-hidden="true"
              />
              <span className="truncate">{university}</span>
            </div>
            <div className="mt-0.5 truncate text-[11px] text-[var(--muted)]">{faculty}</div>
          </div>

          <ScoreGauge
            score={tutor.education.admissionScore}
            maxScore={tutor.education.maxScore}
            size="sm"
            tone="emerald"
          />
        </div>

        {/* 3. Two Clean Outcomes + Single Superpower Differentiator */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 rounded-[18px] bg-[var(--surface-subtle)]/65 p-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1 font-mono-num text-base font-bold text-[var(--ink)]">
                <Trophy
                  size={14}
                  weight="fill"
                  className="shrink-0 text-[var(--accent)]"
                  aria-hidden="true"
                />
                <span>{primaryAchievement?.metric ?? visual.trajectory.delta}</span>
              </div>
              <div className="mt-0.5 line-clamp-1 text-[11px] text-[var(--muted)]">
                {primaryAchievement
                  ? resolveLocalized(primaryAchievement.label, locale)
                  : resolveLocalized(visual.trajectory.label, locale)}
              </div>
            </div>

            <div className="min-w-0 border-l border-[var(--border)]/70 pl-3">
              <div className="font-mono-num text-base font-bold text-[var(--ink)]">
                {secondaryAchievement?.metric ?? visual.trajectory.after}
              </div>
              <div className="mt-0.5 line-clamp-1 text-[11px] text-[var(--muted)]">
                {secondaryAchievement
                  ? resolveLocalized(secondaryAchievement.label, locale)
                  : resolveLocalized(visual.trajectory.label, locale)}
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border-l-2 border-[var(--accent)] bg-[var(--accent-soft)]/25 px-3.5 py-2.5">
            <div className="text-xs font-semibold text-[var(--accent-ink)]">
              {resolveLocalized(visual.superpowerTag, locale)}
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--ink-2)]">
              {differentiator}
            </p>
          </div>

          <ScoreTrajectoryBar
            before={visual.trajectory.before}
            after={visual.trajectory.after}
            delta={visual.trajectory.delta}
            label={resolveLocalized(visual.trajectory.label, locale)}
            progressPct={visual.trajectory.bar1Pct}
            subject={primarySubject}
            compact
          />

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-medium text-[var(--muted)]">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {locale === 'az'
                ? 'Boş yer var'
                : locale === 'en'
                  ? 'Slots open'
                  : 'Есть места'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{tutor.fmt.map((f) => FORMAT_LABELS[f][locale]).join(' · ')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num font-semibold text-[var(--accent-ink)]">
              {matchScore}% {copy.tutorCard.match}
            </span>
            {distanceKm !== null ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 font-mono-num">
                  <MapPin size={11} weight="bold" aria-hidden="true" />
                  {distanceKm.toFixed(1)} {copy.tutorCard.km}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* 4. Minimal Solaris Action Footer */}
      <div className="mt-5 flex items-center gap-2 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={() => onOpenProfile(tutor.id)}
          className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
        >
          {copy.tutorCard.profileBtn}
        </button>

        <motion.button
          type="button"
          onClick={() => onSendRequest(tutor.id, true)}
          whileTap={{ scale: 0.98 }}
          className="group/btn inline-flex min-h-[38px] flex-1 cursor-pointer items-center justify-between gap-2 rounded-full bg-[var(--primary-btn)] py-1 pl-4 pr-1 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
        >
          <span className="truncate">{copy.tutorCard.freeTrial}</span>
          <span
            aria-hidden="true"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover/btn:translate-x-0.5"
          >
            <ArrowRight size={13} weight="bold" />
          </span>
        </motion.button>

        <button
          type="button"
          onClick={() => onSendRequest(tutor.id, false)}
          aria-label={copy.tutorCard.messageBtn}
          title={copy.tutorCard.messageBtn}
          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
        >
          <ChatCircleDots size={16} weight="bold" aria-hidden="true" />
        </button>
      </div>
      </div>
    </motion.article>
  );
}
