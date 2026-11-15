'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChalkboardTeacher,
  GraduationCap,
  MapPin,
  Scales,
  SealCheck,
  Sparkle,
  Star,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { SUBJECTS } from '@/data/catalog';
import { COPY, GRADE_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import { INITIAL_TUTORS, resolveLocalized, resolveTutorName } from '@/data/tutors';
import { COMPARE_COPY, getSubjectTheme, getTutorVisual } from '@/data/tutorVisuals';
import { WOW_COPY } from '@/lib/wowCopy';
import { Avatar } from '@/components/ui/Avatar';
import { ScoreTrajectoryBar } from '@/components/ui/ScoreTrajectoryBar';
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

const HERO_STEP_COPY: Record<
  Locale,
  {
    step1Prompt: string;
    intentTutor: string;
    intentMap: string;
    intentQuiz: string;
    step2SubjectLabel: string;
    allSubjects: string;
    step2GradeLabel: string;
    allGrades: string;
    showResultsCta: string;
    tutorsUnit: string;
    dimVerifiedBadge: string;
    trialPillBadge: string;
    spotlightLive: string;
    viewDossier: string;
    bookTrialShort: string;
    prevSpotlight: string;
    nextSpotlight: string;
  }
> = {
  ru: {
    step1Prompt: 'Что вам нужно сейчас?',
    intentTutor: 'Найти репетитора',
    intentMap: 'Посмотреть на карте',
    intentQuiz: 'Пройти тест уровня',
    step2SubjectLabel: 'Выберите предмет',
    allSubjects: 'Все предметы',
    step2GradeLabel: 'Класс или цель',
    allGrades: 'Любой класс',
    showResultsCta: 'Показать репетиторов',
    tutorsUnit: 'репетиторов',
    dimVerifiedBadge: 'Балл DİM проверен',
    trialPillBadge: 'Первый пробный — 0 ₼',
    spotlightLive: 'Топ-ментор · онлайн',
    viewDossier: 'Смотреть досье',
    bookTrialShort: 'Пробный · 0 ₼',
    prevSpotlight: 'Предыдущий ментор',
    nextSpotlight: 'Следующий ментор',
  },
  az: {
    step1Prompt: 'İndi nə axtarırsınız?',
    intentTutor: 'Müəllim tapmaq',
    intentMap: 'Xəritədə baxmaq',
    intentQuiz: 'Səviyyə testi keçmək',
    step2SubjectLabel: 'Fənn seçin',
    allSubjects: 'Bütün fənlər',
    step2GradeLabel: 'Sinif və ya məqsəd',
    allGrades: 'Bütün siniflər',
    showResultsCta: 'Müəllimləri göstər',
    tutorsUnit: 'müəllim',
    dimVerifiedBadge: 'Təsdiqlənmiş DİM balı',
    trialPillBadge: 'İlk sınaq dərsi pulsuz',
    spotlightLive: 'Top mentor · aktiv',
    viewDossier: 'Dosyeyə bax',
    bookTrialShort: 'Sınaq · 0 ₼',
    prevSpotlight: 'Əvvəlki müəllim',
    nextSpotlight: 'Növbəti müəllim',
  },
  en: {
    step1Prompt: 'What are you looking for?',
    intentTutor: 'Find a tutor',
    intentMap: 'Browse on map',
    intentQuiz: 'Take level quiz',
    step2SubjectLabel: 'Choose subject',
    allSubjects: 'All subjects',
    step2GradeLabel: 'Grade or target',
    allGrades: 'All grades',
    showResultsCta: 'Show matching tutors',
    tutorsUnit: 'tutors',
    dimVerifiedBadge: 'Verified DİM score',
    trialPillBadge: 'First trial lesson free',
    spotlightLive: 'Top mentor · active',
    viewDossier: 'View dossier',
    bookTrialShort: 'Book trial · 0 ₼',
    prevSpotlight: 'Previous mentor',
    nextSpotlight: 'Next mentor',
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
  const [categoriesOpen, setCategoriesOpen] = useState(true);
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

  const handleIntentClick = (next: HeroIntent) => {
    setIntent(next);
    if (next === 'tutor') {
      setCategoriesOpen(true);
    } else if (next === 'map') {
      onOpenMap();
    } else {
      onOpenQuiz();
    }
  };

  return (
    <section
      aria-label="EduMatch showcase"
      className="mx-auto mb-8 w-full max-w-7xl pt-4 pb-2 sm:pt-8"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Brand Proof + Headline + Progressive Selector */}
        <div className="text-center lg:col-span-7 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
            className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/92 p-1 pr-3 text-[11px] font-medium text-[var(--ink-2)] shadow-2xs sm:text-xs"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent-ink)]">
              <SealCheck size={13} weight="fill" aria-hidden="true" />
              <span>
                {locale === 'az'
                  ? 'Təsdiqlənmiş müəllimlər'
                  : locale === 'en'
                    ? 'Verified mentors'
                    : 'Проверенные менторы'}
              </span>
            </span>
            <span className="min-w-0 truncate">{wow.hero.liveOnlineLabel}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.04, ease: EASE_EDITORIAL }}
            className="mx-auto mt-4 max-w-2xl break-words text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--ink)] sm:text-[2.65rem] lg:mx-0 lg:text-[3rem]"
          >
            {copy.hero.titleStart}{' '}
            <em className="font-serif-editorial font-normal italic text-[var(--accent-ink)]">
              {copy.hero.titleAccent}
            </em>
            {copy.hero.titleEnd}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: 0.08, ease: EASE_EDITORIAL }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-2)] sm:text-[15px] lg:mx-0"
          >
            {copy.hero.subtitle}
          </motion.p>

          {/* Progressive Guided Selector (Step 01 Intent -> Step 02 Subject / Grade) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: EASE_EDITORIAL }}
            className="mt-6 w-full rounded-[26px] border border-[var(--glass-border)] bg-[var(--surface)]/92 p-4 text-left shadow-[var(--shadow-float)] backdrop-blur-xl sm:p-5"
          >
            {/* Step 1: Primary Goal / Intent */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                01 · {stepCopy.step1Prompt}
              </span>

              <div
                className="flex flex-wrap items-center gap-1.5"
                role="group"
                aria-label={stepCopy.step1Prompt}
              >
                <button
                  type="button"
                  onClick={() => handleIntentClick('tutor')}
                  aria-pressed={intent === 'tutor'}
                  className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    intent === 'tutor'
                      ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                      : 'border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  <ChalkboardTeacher size={14} weight="bold" aria-hidden="true" />
                  <span>{stepCopy.intentTutor}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleIntentClick('map')}
                  aria-pressed={intent === 'map'}
                  className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    intent === 'map'
                      ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                      : 'border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  <MapPin size={14} weight="bold" aria-hidden="true" />
                  <span>{stepCopy.intentMap}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleIntentClick('quiz')}
                  aria-pressed={intent === 'quiz'}
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 py-1 text-xs font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent-ink)]"
                >
                  <Sparkle size={14} weight="fill" className="text-[var(--accent)]" aria-hidden="true" />
                  <span>{stepCopy.intentQuiz}</span>
                </button>
              </div>
            </div>

            {/* Step 2: Quick Subject + Target Grade + CTA */}
            <AnimatePresence initial={false}>
              {categoriesOpen ? (
                <motion.div
                  key="hero-categories"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
                  className="mt-4 space-y-3.5 border-t border-[var(--border)] pt-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                        02 · {stepCopy.step2SubjectLabel}
                      </span>
                      <span className="font-mono-num text-[11px] font-semibold text-[var(--accent-ink)]">
                        {resultCount} {stepCopy.tutorsUnit}
                      </span>
                    </div>

                    <div
                      className="flex flex-wrap gap-1.5"
                      role="group"
                      aria-label={wow.hero.subjectQuickLabel}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSpotlightCursor(0);
                          onSubjectChange('');
                        }}
                        aria-pressed={selectedSubject === ''}
                        className={`min-h-[34px] cursor-pointer rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                          selectedSubject === ''
                            ? 'bg-[var(--ink)] text-[var(--bg)]'
                            : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {stepCopy.allSubjects}
                      </button>

                      {SUBJECTS.map((subj) => {
                        const active = selectedSubject === subj;
                        return (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => {
                              setSpotlightCursor(0);
                              onSubjectChange(subj);
                            }}
                            aria-pressed={active}
                            className={`min-h-[34px] cursor-pointer rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                              active
                                ? 'bg-[var(--ink)] text-[var(--bg)]'
                                : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'
                            }`}
                          >
                            {SUBJECT_LABELS[subj][locale]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[var(--border)]/70 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="mr-1 text-[11px] font-medium text-[var(--muted)]">
                        {stepCopy.step2GradeLabel}:
                      </span>
                      <button
                        type="button"
                        onClick={() => onGradeChange('')}
                        aria-pressed={selectedGrade === ''}
                        className={`min-h-[30px] cursor-pointer rounded-full px-3 py-0.5 text-[11px] font-semibold transition-colors ${
                          selectedGrade === ''
                            ? 'bg-[var(--accent-soft)] text-[var(--accent-ink)] ring-1 ring-[var(--accent-border)]'
                            : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
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
                            className={`min-h-[30px] cursor-pointer rounded-full px-3 py-0.5 text-[11px] font-semibold transition-colors ${
                              active
                                ? 'bg-[var(--accent-soft)] text-[var(--accent-ink)] ring-1 ring-[var(--accent-border)]'
                                : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
                            }`}
                          >
                            {GRADE_LABELS[g][locale]}
                          </button>
                        );
                      })}
                    </div>

                    <motion.button
                      type="button"
                      onClick={onQuickApply}
                      whileTap={{ scale: 0.98 }}
                      className="group inline-flex min-h-[40px] w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--primary-btn)] py-1.5 pl-4 pr-1.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)] sm:w-auto"
                    >
                      <span>
                        {stepCopy.showResultsCta} ({resultCount})
                      </span>
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        <ArrowRight size={14} weight="bold" />
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {/* Compact Proof Numbers & Secondary Links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--muted)] lg:justify-start">
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

        {/* Right Column: Live Interactive Top-Mentor Visual Showcase */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.14, ease: EASE_EDITORIAL }}
            className="relative mx-auto w-full max-w-[430px] px-2 py-3 sm:px-3 lg:max-w-none"
          >
            {/* Soft Ambient Backdrop Halo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-[36px] bg-gradient-to-br from-sky-400/20 via-emerald-400/20 to-[#C8F542]/25 blur-2xl"
            />

            {/* Floating Verified DİM Score Badge (Top-Right) */}
            <div className="absolute right-3 -top-1 z-20 flex items-center gap-2 rounded-2xl border border-emerald-200/90 bg-[var(--surface)]/95 px-3 py-2 shadow-xl backdrop-blur-md dark:border-emerald-700/60 sm:right-0">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--accent)] font-mono-num text-[11px] font-black text-white shadow-sm">
                DİM
              </span>
              <div className="leading-tight">
                <div className="font-mono-num text-xs font-extrabold text-[var(--ink)] sm:text-sm">
                  {activeTutor.education.admissionScore} / {activeTutor.education.maxScore}
                </div>
                <div className="text-[10px] font-medium text-[var(--muted)]">
                  {stepCopy.dimVerifiedBadge}
                </div>
              </div>
            </div>

            {/* Frosted Gradient Border Showcase Card */}
            <div className="relative rounded-[30px] bg-gradient-to-br from-[#0F172A] via-[#0F4C5C] to-[#10B981] p-[1.5px] shadow-[var(--shadow-float)] dark:from-emerald-400/50 dark:via-sky-400/40 dark:to-[#C8F542]/50">
              <div className="rounded-[28.5px] bg-[var(--surface)]/96 p-4 pb-6 backdrop-blur-xl sm:p-5 sm:pb-6">
                {/* Live Indicator + Colored Subject Span + Carousel Controls */}
                <div className="flex items-center justify-between gap-2 pt-2 sm:pt-0">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="truncate">{stepCopy.spotlightLive}</span>
                    </span>
                    {activePrimarySubject ? (
                      <span
                        className={`hidden rounded-full border px-2.5 py-0.5 text-[11px] font-semibold sm:inline-flex ${subjectTheme.pillClass}`}
                      >
                        {SUBJECT_LABELS[activePrimarySubject][locale]}
                      </span>
                    ) : null}
                  </div>

                  {activePool.length > 1 ? (
                    <div className="flex shrink-0 items-center gap-1 pr-24 sm:pr-28">
                      <button
                        type="button"
                        onClick={() =>
                          setSpotlightCursor((c) => (c - 1 + activePool.length) % activePool.length)
                        }
                        aria-label={stepCopy.prevSpotlight}
                        className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink-2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
                      >
                        <ArrowLeft size={12} weight="bold" />
                      </button>
                      <span className="font-mono-num text-[11px] font-semibold text-[var(--muted)]">
                        {safeIdx + 1}/{activePool.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSpotlightCursor((c) => (c + 1) % activePool.length)}
                        aria-label={stepCopy.nextSpotlight}
                        className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink-2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
                      >
                        <ArrowRight size={12} weight="bold" />
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Animated Tutor Identity & Growth Content */}
                <motion.div
                  key={activeTutor.id}
                  initial={{ opacity: 0.5, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
                  className="mt-4 space-y-3.5 text-left"
                >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          id={activeTutor.id}
                          name={activeTutorName}
                          index={safeIdx}
                          size="xl"
                          verified={activeTutor.education.verified}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h2 className="truncate text-base font-bold tracking-tight text-[var(--ink)] sm:text-lg">
                              {activeTutorName}
                            </h2>
                            {activeTutor.education.verified ? (
                              <SealCheck
                                size={15}
                                weight="fill"
                                className="shrink-0 text-[var(--accent)]"
                                aria-hidden="true"
                              />
                            ) : null}
                          </div>

                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                            <GraduationCap
                              size={14}
                              weight="fill"
                              className="shrink-0 text-[var(--accent-ink)]"
                              aria-hidden="true"
                            />
                            <span className="truncate">{activeUniversity}</span>
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 font-semibold text-[var(--ink)]">
                              <Star
                                size={12}
                                weight="fill"
                                className="text-amber-500"
                                aria-hidden="true"
                              />
                              {activeTutor.rating.toFixed(1)}
                              <span className="font-normal text-[var(--muted)]">
                                ({activeTutor.n})
                              </span>
                            </span>
                            <span aria-hidden="true" className="text-[var(--border-strong)]">
                              •
                            </span>
                            <span className="font-mono-num font-bold text-[var(--ink)]">
                              {activeTutor.price} ₼
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subject Superpower Tag + Top Student Proof */}
                    <div
                      className={`rounded-2xl border px-3.5 py-2.5 ${subjectTheme.softBoxClass}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[var(--accent-ink)]">
                          {resolveLocalized(activeVisual.superpowerTag, locale)}
                        </span>
                        {activeAchievement ? (
                          <span className="rounded-full bg-[var(--surface)]/90 px-2.5 py-0.5 font-mono-num text-[11px] font-bold text-[var(--ink)] shadow-2xs">
                            {activeAchievement.metric}{' '}
                            <span className="font-normal text-[var(--muted)]">
                              {resolveLocalized(activeAchievement.label, locale)}
                            </span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Visual Before -> After DİM Score Growth Bar */}
                    <ScoreTrajectoryBar
                      before={activeVisual.trajectory.before}
                      after={activeVisual.trajectory.after}
                      delta={activeVisual.trajectory.delta}
                      label={resolveLocalized(activeVisual.trajectory.label, locale)}
                      progressPct={activeVisual.trajectory.bar1Pct}
                      subject={activePrimarySubject}
                      compact
                    />

                    {/* Showcase Quick Actions */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenProfile ? onOpenProfile(activeTutor.id) : onQuickApply()
                        }
                        className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-4 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                      >
                        {stepCopy.viewDossier}
                      </button>

                      <motion.button
                        type="button"
                        onClick={() =>
                          onSendRequest ? onSendRequest(activeTutor.id, true) : onQuickApply()
                        }
                        whileTap={{ scale: 0.98 }}
                        className="group/spot inline-flex min-h-[38px] flex-1 cursor-pointer items-center justify-between gap-2 rounded-full bg-[var(--primary-btn)] py-1 pl-4 pr-1 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
                      >
                        <span className="truncate">{stepCopy.bookTrialShort}</span>
                        <span
                          aria-hidden="true"
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover/spot:translate-x-0.5"
                        >
                          <ArrowRight size={13} weight="bold" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
              </div>
            </div>

            {/* Floating Bottom-Left Free Trial Pill */}
            <div className="absolute left-3 -bottom-1 z-20 inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-3.5 py-2 text-xs font-bold text-white shadow-xl ring-1 ring-white/15 sm:left-0">
              <span className="rounded-lg bg-[var(--lime)] px-2 py-0.5 font-mono-num text-[11px] font-black text-[#0F172A]">
                0 ₼
              </span>
              <span>{stepCopy.trialPillBadge}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
