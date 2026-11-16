'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpenText,
  Calculator,
  ChalkboardTeacher,
  Flask,
  GraduationCap,
  Lightbulb,
  MapPin,
  Scales,
  SealCheck,
  Sparkle,
  Star,
  TerminalWindow,
  Translate,
  TrendUp,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { SUBJECTS } from '@/data/catalog';
import { COPY, GRADE_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import { INITIAL_TUTORS, resolveLocalized, resolveTutorName } from '@/data/tutors';
import {
  COMPARE_COPY,
  HERO_GOAL_PRESETS,
  getSubjectTheme,
  getTutorVisual,
} from '@/data/tutorVisuals';
import { WOW_COPY } from '@/lib/wowCopy';
import { Avatar } from '@/components/ui/Avatar';
import type { GradeId, Locale, SubjectId, TutorProfile } from '@/types/edumatch';

interface HeroOpeningProps {
  locale: Locale;
  selectedSubject: SubjectId | '';
  selectedGrade: GradeId | '';
  resultCount: number;
  spotlightTutors?: TutorProfile[];
  onSubjectChange: (subj: SubjectId | '') => void;
  onGradeChange: (cat: GradeId | '') => void;
  onQuickApply: () => void;
  onOpenMap: () => void;
  onOpenQuiz: () => void;
  onOpenTour: () => void;
  onSwitchToTeacher: () => void;
  onOpenCompare?: () => void;
  onOpenProfile?: (tutorId: string) => void;
  onSendRequest?: (tutorId: string, trial: boolean) => void;
}

type HeroIntent = 'tutor' | 'map' | 'quiz';

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

const SUBJECT_ICONS: Record<
  SubjectId,
  React.ComponentType<{ size?: number; weight?: 'regular' | 'bold' | 'fill'; className?: string }>
> = {
  Математика: Calculator,
  Физика: Atom,
  Химия: Flask,
  'Английский язык': Translate,
  'Азербайджанский язык': BookOpenText,
  Информатика: TerminalWindow,
};

const HERO_STEP_COPY: Record<
  Locale,
  {
    intentTutor: string;
    intentMap: string;
    intentQuiz: string;
    goalsLabel: string;
    allSubjects: string;
    step2GradeLabel: string;
    allGrades: string;
    showResultsCta: string;
    tutorsUnit: string;
    dimVerifiedBadge: string;
    trialPillBadge: string;
    spotlightLive: string;
    smartPickPrefix: string;
    viewDossier: string;
    bookTrialShort: string;
    prevSpotlight: string;
    nextSpotlight: string;
    quickSwitchLabel: string;
    dimLabel: string;
    rateUnit: string;
  }
> = {
  ru: {
    intentTutor: 'Найти репетитора',
    intentMap: 'Посмотреть на карте',
    intentQuiz: 'Пройти тест уровня',
    goalsLabel: 'Быстрая цель',
    allSubjects: 'Все предметы',
    step2GradeLabel: 'Класс',
    allGrades: 'Любой класс',
    showResultsCta: 'Показать репетиторов',
    tutorsUnit: 'менторов',
    dimVerifiedBadge: 'DİM проверен',
    trialPillBadge: 'Первый пробный бесплатно',
    spotlightLive: 'Топ-ментор · онлайн',
    smartPickPrefix: 'Умный выбор',
    viewDossier: 'Смотреть досье',
    bookTrialShort: 'Пробный · 0 ₼',
    prevSpotlight: 'Предыдущий ментор',
    nextSpotlight: 'Следующий ментор',
    quickSwitchLabel: 'Быстрый выбор ментора',
    dimLabel: 'Балл DİM',
    rateUnit: '/ урок',
  },
  az: {
    intentTutor: 'Müəllim tapmaq',
    intentMap: 'Xəritədə baxmaq',
    intentQuiz: 'Səviyyə testi keçmək',
    goalsLabel: 'Hədəf seçimi',
    allSubjects: 'Bütün fənlər',
    step2GradeLabel: 'Sinif',
    allGrades: 'Bütün siniflər',
    showResultsCta: 'Müəllimləri göstər',
    tutorsUnit: 'müəllim',
    dimVerifiedBadge: 'Təsdiqlənmiş DİM',
    trialPillBadge: 'İlk sınaq dərsi pulsuz',
    spotlightLive: 'Top mentor · aktiv',
    smartPickPrefix: 'Ağıllı tövsiyə',
    viewDossier: 'Dosyeyə bax',
    bookTrialShort: 'Sınaq · 0 ₼',
    prevSpotlight: 'Əvvəlki müəllim',
    nextSpotlight: 'Növbəti müəllim',
    quickSwitchLabel: 'Müəllimlər arasında keçid',
    dimLabel: 'DİM Balı',
    rateUnit: '/ dərs',
  },
  en: {
    intentTutor: 'Find a tutor',
    intentMap: 'Browse on map',
    intentQuiz: 'Take level quiz',
    goalsLabel: 'Quick goal',
    allSubjects: 'All subjects',
    step2GradeLabel: 'Grade',
    allGrades: 'All grades',
    showResultsCta: 'Show matching tutors',
    tutorsUnit: 'mentors',
    dimVerifiedBadge: 'Verified DİM',
    trialPillBadge: 'First trial lesson free',
    spotlightLive: 'Top mentor · active',
    smartPickPrefix: 'Smart match',
    viewDossier: 'View dossier',
    bookTrialShort: 'Book trial · 0 ₼',
    prevSpotlight: 'Previous mentor',
    nextSpotlight: 'Next mentor',
    quickSwitchLabel: 'Quick mentor switcher',
    dimLabel: 'DİM Score',
    rateUnit: '/ lesson',
  },
};

const QUICK_GRADES: GradeId[] = ['9 класс', '11 класс', '1 курс'];

export function HeroOpening({
  locale,
  selectedSubject,
  selectedGrade,
  resultCount,
  spotlightTutors,
  onSubjectChange,
  onGradeChange,
  onQuickApply,
  onOpenMap,
  onOpenQuiz,
  onOpenTour,
  onSwitchToTeacher,
  onOpenCompare,
  onOpenProfile,
  onSendRequest,
}: HeroOpeningProps) {
  const copy = COPY[locale];
  const wow = WOW_COPY[locale];
  const cmp = COMPARE_COPY[locale];
  const stepCopy = HERO_STEP_COPY[locale];
  const [intent, setIntent] = useState<HeroIntent>('tutor');
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [spotlightCursor, setSpotlightCursor] = useState(0);

  const pool =
    spotlightTutors && spotlightTutors.length > 0 ? spotlightTutors : INITIAL_TUTORS;
  const matchingPool = selectedSubject
    ? [
        ...pool.filter((t) => t.subj[0] === selectedSubject),
        ...pool.filter((t) => t.subj.includes(selectedSubject) && t.subj[0] !== selectedSubject),
      ]
    : pool;
  const activePool = matchingPool.length > 0 ? matchingPool : pool;
  const safeIdx = activePool.length > 0 ? spotlightCursor % activePool.length : 0;
  const activeTutor = activePool[safeIdx] ?? INITIAL_TUTORS[0];
  const activeVisual = getTutorVisual(activeTutor.id, safeIdx);
  const activePrimarySubject = selectedSubject || activeTutor.subj[0];
  const subjectTheme = getSubjectTheme(activePrimarySubject);
  const activeTutorName = resolveTutorName(activeTutor, locale);
  const activeUniversity = resolveLocalized(activeTutor.education.university, locale);
  const activeAchievement = activeTutor.achievements[0];
  const quickSwitchPool = activePool.slice(0, 4);

  const handleIntentClick = (next: HeroIntent) => {
    setIntent(next);
    if (next === 'map') {
      onOpenMap();
    } else if (next === 'quiz') {
      onOpenQuiz();
    }
  };

  const handleSelectPreset = (presetId: string, subj: SubjectId) => {
    setActiveGoalId(presetId);
    setSpotlightCursor(0);
    onSubjectChange(subj);
  };

  return (
    <section
      aria-label="EduMatch showcase"
      className="mx-auto mb-8 w-full max-w-7xl pt-3 pb-2 sm:pt-7"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        {/* LEFT COLUMN: Open-Air Editorial Canvas (No Heavy Form Card) */}
        <div className="text-center lg:col-span-6 lg:text-left">
          {/* Eyebrow Status & Segmented Action Mode Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--accent-ink)]">
              <SealCheck size={13} weight="fill" aria-hidden="true" />
              <span>{wow.hero.liveOnlineLabel}</span>
            </span>

            {HERO_GOAL_PRESETS.slice(0, 3).map((preset) => {
              const isGoalActive =
                activeGoalId === preset.id && selectedSubject === preset.subject;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={isGoalActive}
                  onClick={() => handleSelectPreset(preset.id, preset.subject)}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    isGoalActive
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)] shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface)]/80 text-[var(--ink-2)] backdrop-blur-md hover:border-[var(--accent-border)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span>{preset.label[locale]}</span>
                  <span
                    className={`font-mono-num text-[10px] font-bold ${
                      isGoalActive ? 'text-[var(--lime)]' : 'text-[var(--accent-ink)]'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Display Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: EASE_EDITORIAL }}
            className="mx-auto mt-4 max-w-2xl break-words text-[1.85rem] font-bold leading-[1.08] tracking-[-0.035em] text-[var(--ink)] sm:text-[2.65rem] lg:mx-0 lg:text-[3.05rem]"
          >
            {copy.hero.titleStart}{' '}
            <em className="relative inline-block font-serif-editorial font-normal italic text-[var(--accent-ink)]">
              {copy.hero.titleAccent}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 -z-10 h-2.5 rounded-full bg-[var(--lime)]/55 dark:bg-emerald-500/30"
              />
            </em>
            {copy.hero.titleEnd}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.05, ease: EASE_EDITORIAL }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-2)] sm:text-[15px] lg:mx-0"
          >
            {copy.hero.subtitle}
          </motion.p>

          {/* Floating Command Action Dock (Replaces Old Boxy Form!) */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
            <motion.button
              type="button"
              onClick={onQuickApply}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex min-h-[46px] cursor-pointer items-center gap-3 rounded-full bg-[var(--primary-btn)] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-[var(--primary-btn-ink)] shadow-[var(--shadow-float)] transition-colors hover:bg-[var(--primary-btn-hover)]"
            >
              <ChalkboardTeacher size={17} weight="bold" aria-hidden="true" />
              <span>
                {stepCopy.showResultsCta} ({resultCount})
              </span>
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <ArrowRight size={15} weight="bold" />
              </span>
            </motion.button>

            <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/85 p-1 shadow-xs backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleIntentClick('tutor')}
                aria-pressed={intent === 'tutor'}
                className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  intent === 'tutor'
                    ? 'bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                }`}
              >
                <span>{stepCopy.intentTutor}</span>
              </button>

              <button
                type="button"
                onClick={() => handleIntentClick('map')}
                aria-pressed={intent === 'map'}
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]"
              >
                <MapPin size={13} weight="bold" aria-hidden="true" />
                <span>{stepCopy.intentMap}</span>
              </button>

              <button
                type="button"
                onClick={() => handleIntentClick('quiz')}
                aria-pressed={intent === 'quiz'}
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--accent-ink)]"
              >
                <Sparkle size={13} weight="fill" className="text-[var(--accent)]" aria-hidden="true" />
                <span>{stepCopy.intentQuiz}</span>
              </button>
            </div>
          </div>

          {/* Open-Air Colorful Subject Tiles (No Monotone Bordered Box) */}
          <div className="mt-5">
            <div
              className="flex flex-wrap items-center justify-center gap-1.5 lg:justify-start"
              role="group"
              aria-label={wow.hero.subjectQuickLabel}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveGoalId(null);
                  setSpotlightCursor(0);
                  onSubjectChange('');
                }}
                aria-pressed={selectedSubject === ''}
                className={`min-h-[34px] cursor-pointer rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedSubject === ''
                    ? 'bg-[var(--ink)] text-[var(--bg)] shadow-sm'
                    : 'bg-[var(--surface)]/75 text-[var(--ink-2)] ring-1 ring-[var(--border)] backdrop-blur-sm hover:bg-[var(--surface)] hover:text-[var(--ink)]'
                }`}
              >
                {stepCopy.allSubjects}
              </button>

              {SUBJECTS.map((subj) => {
                const active = selectedSubject === subj;
                const theme = getSubjectTheme(subj);
                const SubjIcon = SUBJECT_ICONS[subj];
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setActiveGoalId(null);
                      setSpotlightCursor(0);
                      onSubjectChange(subj);
                    }}
                    aria-pressed={active}
                    className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[var(--ink)] text-[var(--bg)] shadow-sm ring-2 ring-[var(--accent)]/40'
                        : `border backdrop-blur-sm hover:-translate-y-0.5 ${theme.pillClass}`
                    }`}
                  >
                    <SubjIcon
                      size={13}
                      weight={active ? 'fill' : 'bold'}
                      aria-hidden="true"
                      className={active ? 'text-[var(--lime)]' : ''}
                    />
                    <span>{SUBJECT_LABELS[subj][locale]}</span>
                  </button>
                );
              })}

              {/* Goal Preset #4 for IELTS/ADA cleanly tucked inline */}
              {HERO_GOAL_PRESETS[3] ? (
                <button
                  type="button"
                  aria-pressed={
                    activeGoalId === HERO_GOAL_PRESETS[3].id &&
                    selectedSubject === HERO_GOAL_PRESETS[3].subject
                  }
                  onClick={() =>
                    handleSelectPreset(HERO_GOAL_PRESETS[3].id, HERO_GOAL_PRESETS[3].subject)
                  }
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-3 py-1.5 text-xs font-semibold text-amber-800 transition-all hover:-translate-y-0.5 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-200"
                >
                  <span>{HERO_GOAL_PRESETS[3].label[locale]}</span>
                  <span className="font-mono-num text-[10px] font-bold">
                    {HERO_GOAL_PRESETS[3].badge}
                  </span>
                </button>
              ) : null}
            </div>

            {/* Compact Grade Row + 1-Line Live Advisor Hint */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs lg:justify-start">
              <div className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)]/75 p-1 ring-1 ring-[var(--border)] backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => onGradeChange('')}
                  aria-pressed={selectedGrade === ''}
                  className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                    selectedGrade === ''
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {stepCopy.allGrades}
                </button>
                {QUICK_GRADES.map((g) => {
                  const active = selectedGrade === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onGradeChange(g)}
                      aria-pressed={active}
                      className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                        active
                          ? 'bg-[var(--accent)] text-white'
                          : 'text-[var(--muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {GRADE_LABELS[g][locale]}
                    </button>
                  );
                })}
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)]/70 bg-[var(--surface)]/80 px-3 py-1 text-[11px] text-[var(--ink-2)] backdrop-blur-sm">
                <Lightbulb size={13} weight="fill" className="text-[var(--accent-ink)]" aria-hidden="true" />
                <span>{stepCopy.smartPickPrefix}:</span>
                <button
                  type="button"
                  onClick={() =>
                    onOpenProfile ? onOpenProfile(activeTutor.id) : onQuickApply()
                  }
                  className="cursor-pointer font-bold text-[var(--accent-ink)] underline underline-offset-2"
                >
                  {activeTutorName}
                </button>
              </span>
            </div>
          </div>

          {/* Clean Proof Stats & Secondary Shortcuts */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[var(--border)]/70 pt-4 text-xs text-[var(--muted)] lg:justify-start">
            {copy.hero.metrics.map((m) => (
              <span key={m.label} className="inline-flex items-baseline gap-1.5">
                <strong className="font-mono-num text-sm font-bold text-[var(--ink)]">
                  {m.value}
                </strong>
                <span>{m.label}</span>
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--muted)] lg:justify-start">
            {onOpenCompare ? (
              <button
                type="button"
                onClick={onOpenCompare}
                className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent-ink)]"
              >
                <Scales size={14} weight="bold" className="text-[var(--accent-ink)]" aria-hidden="true" />
                <span>{cmp.vsHeroBtn}</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={onOpenTour}
              className="cursor-pointer transition-colors hover:text-[var(--ink)]"
            >
              {copy.hero.ctaTour}
            </button>

            <button
              type="button"
              onClick={onSwitchToTeacher}
              className="cursor-pointer transition-colors hover:text-[var(--ink)]"
            >
              {copy.hero.ctaTeacher}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: High-Contrast #0F172A Obsidian Live Mentor Telemetry Stage */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, delay: 0.12, ease: EASE_EDITORIAL }}
            className="relative mx-auto w-full max-w-[520px] lg:max-w-none"
          >
            {/* Obsidian Dark Contrast Card */}
            <div className="relative overflow-hidden rounded-[32px] border border-slate-800/90 bg-[#0F172A] p-5 text-white shadow-[0_30px_70px_-20px_rgba(15,23,42,0.55)] dark:border-emerald-500/25 dark:bg-[#0D1729] sm:p-6">
              {/* Subject-Reactive Ambient Glow inside Dark Stage */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-gradient-to-br ${subjectTheme.barGradientClass} opacity-30 blur-3xl transition-colors duration-300`}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-emerald-500/15 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8F542]/80 to-transparent"
              />

              {/* Top Stage Bar: Live Status + Subject Tag + Pager Controls */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C8F542] animate-pulse" />
                    <span>{stepCopy.spotlightLive}</span>
                  </span>

                  {activePrimarySubject ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${subjectTheme.dotColorClass}`}
                      />
                      {SUBJECT_LABELS[activePrimarySubject][locale]}
                    </span>
                  ) : null}
                </div>

                {activePool.length > 1 ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSpotlightCursor((c) => (c - 1 + activePool.length) % activePool.length)
                      }
                      aria-label={stepCopy.prevSpotlight}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/8 text-slate-200 transition-colors hover:border-white/35 hover:bg-white/15"
                    >
                      <ArrowLeft size={12} weight="bold" />
                    </button>
                    <span className="font-mono-num min-w-[34px] text-center text-[11px] font-semibold text-slate-300">
                      {safeIdx + 1}/{activePool.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSpotlightCursor((c) => (c + 1) % activePool.length)}
                      aria-label={stepCopy.nextSpotlight}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/8 text-slate-200 transition-colors hover:border-white/35 hover:bg-white/15"
                    >
                      <ArrowRight size={12} weight="bold" />
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Animated Active Mentor Identity + Hero Score Telemetry Block */}
              <motion.div
                key={activeTutor.id}
                initial={{ opacity: 0.55, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
                className="relative z-10 mt-5 space-y-4 text-left"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="shrink-0 rounded-full ring-2 ring-[#C8F542]/80 ring-offset-2 ring-offset-[#0F172A]">
                      <Avatar
                        id={activeTutor.id}
                        name={activeTutorName}
                        index={safeIdx}
                        size="xl"
                        verified={activeTutor.education.verified}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">
                          {activeTutorName}
                        </h2>
                        {activeTutor.education.verified ? (
                          <SealCheck
                            size={16}
                            weight="fill"
                            className="shrink-0 text-[#C8F542]"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                        <GraduationCap
                          size={14}
                          weight="fill"
                          className="shrink-0 text-emerald-400"
                          aria-hidden="true"
                        />
                        <span className="truncate">{activeUniversity}</span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold text-white">
                          <Star
                            size={12}
                            weight="fill"
                            className="text-amber-400"
                            aria-hidden="true"
                          />
                          {activeTutor.rating.toFixed(1)}
                          <span className="font-normal text-slate-400">
                            ({activeTutor.n})
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-slate-600">
                          •
                        </span>
                        <span className="font-mono-num font-bold text-[#C8F542]">
                          {activeTutor.price} ₼{' '}
                          <span className="font-normal text-slate-400">{stepCopy.rateUnit}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hero DİM Telemetry Card */}
                  <div className="flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-emerald-400/25 bg-white/6 px-4 py-2.5 backdrop-blur-md sm:block sm:text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      {stepCopy.dimVerifiedBadge}
                    </div>
                    <div className="font-mono-num mt-0.5 flex items-baseline gap-1 sm:justify-end">
                      <span className="text-2xl font-black tracking-tight text-[#C8F542]">
                        {activeTutor.education.admissionScore}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        / {activeTutor.education.maxScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dark-Glass Outcome + Animated Score Growth Visualizer */}
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-300 sm:text-sm">
                      {resolveLocalized(activeVisual.superpowerTag, locale)}
                    </span>
                    {activeAchievement ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 font-mono-num text-[11px] font-bold text-white">
                        {activeAchievement.metric}{' '}
                        <span className="font-normal text-slate-300">
                          {resolveLocalized(activeAchievement.label, locale)}
                        </span>
                      </span>
                    ) : null}
                  </div>

                  {/* Glowing Progress Trajectory inside Dark Stage */}
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
                        <TrendUp size={14} weight="bold" className="text-[#C8F542]" aria-hidden="true" />
                        <span>{resolveLocalized(activeVisual.trajectory.label, locale)}</span>
                      </span>
                      <span className="font-mono-num rounded-full bg-[#C8F542]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#C8F542]">
                        {activeVisual.trajectory.before} → {activeVisual.trajectory.after} ({activeVisual.trajectory.delta})
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, Math.max(18, activeVisual.trajectory.bar1Pct))}%`,
                        }}
                        transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
                        className="h-full rounded-full bg-gradient-to-r from-[#10B981] via-emerald-400 to-[#C8F542]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Clickable Mentor Portrait Switcher Strip (Stationary Outside Animated Block) */}
              {quickSwitchPool.length > 1 ? (
                <div
                  className="relative z-10 mt-4 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
                  role="group"
                  aria-label={stepCopy.quickSwitchLabel}
                >
                  <span className="text-[11px] font-medium text-slate-300">
                    {stepCopy.quickSwitchLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {quickSwitchPool.map((candidate, idx) => {
                      const cName = resolveTutorName(candidate, locale);
                      const isCurrent = candidate.id === activeTutor.id;
                      return (
                        <button
                          key={candidate.id}
                          type="button"
                          onClick={() => setSpotlightCursor(idx)}
                          aria-label={cName}
                          aria-pressed={isCurrent}
                          title={cName}
                          className={`cursor-pointer rounded-full transition-all ${
                            isCurrent
                              ? 'scale-110 ring-2 ring-[#C8F542] ring-offset-2 ring-offset-[#0F172A]'
                              : 'opacity-65 hover:opacity-100'
                          }`}
                        >
                          <Avatar id={candidate.id} name={cName} index={idx} size="sm" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Dark Stage Action Footer */}
              <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    onOpenProfile ? onOpenProfile(activeTutor.id) : onQuickApply()
                  }
                  className="inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                >
                  {stepCopy.viewDossier}
                </button>

                <motion.button
                  type="button"
                  onClick={() =>
                    onSendRequest ? onSendRequest(activeTutor.id, true) : onQuickApply()
                  }
                  whileTap={{ scale: 0.98 }}
                  className="group/spot inline-flex min-h-[42px] flex-1 cursor-pointer items-center justify-between gap-2 rounded-full bg-[var(--lime)] py-1 pl-4 pr-1 text-xs font-bold text-[#0F172A] shadow-md transition-colors hover:bg-[#d8fa6b]"
                >
                  <span className="truncate">{stepCopy.bookTrialShort}</span>
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0F172A] text-[#C8F542] transition-transform duration-200 group-hover/spot:translate-x-0.5"
                  >
                    <ArrowRight size={14} weight="bold" />
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
