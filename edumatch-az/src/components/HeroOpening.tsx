'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ChalkboardTeacher,
  MapPin,
  Scales,
  SealCheck,
  Sparkle,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { SUBJECTS } from '@/data/catalog';
import { COPY, GRADE_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import { COMPARE_COPY } from '@/data/tutorVisuals';
import { WOW_COPY } from '@/lib/wowCopy';
import type { GradeId, Locale, SubjectId } from '@/types/edumatch';

interface HeroOpeningProps {
  locale: Locale;
  selectedSubject: SubjectId | '';
  selectedGrade: GradeId | '';
  resultCount: number;
  onSubjectChange: (subj: SubjectId | '') => void;
  onGradeChange: (cat: GradeId | '') => void;
  onQuickApply: () => void;
  onOpenMap: () => void;
  onOpenQuiz: () => void;
  onOpenTour: () => void;
  onSwitchToTeacher: () => void;
  onOpenCompare?: () => void;
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
  },
};

const QUICK_GRADES: GradeId[] = ['9 класс', '11 класс', '1 курс'];

export function HeroOpening({
  locale,
  selectedSubject,
  selectedGrade,
  resultCount,
  onSubjectChange,
  onGradeChange,
  onQuickApply,
  onOpenMap,
  onOpenQuiz,
  onOpenTour,
  onSwitchToTeacher,
  onOpenCompare,
}: HeroOpeningProps) {
  const copy = COPY[locale];
  const wow = WOW_COPY[locale];
  const cmp = COMPARE_COPY[locale];
  const stepCopy = HERO_STEP_COPY[locale];
  const [intent, setIntent] = useState<HeroIntent>('tutor');
  const [categoriesOpen, setCategoriesOpen] = useState(true);

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
      className="mx-auto mb-10 w-full max-w-4xl pb-2 pt-5 text-center sm:pt-10"
    >
      {/* 1. Minimalist Verified Platform Badge */}
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

      {/* 2. Clean Breathable Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.04, ease: EASE_EDITORIAL }}
        className="mx-auto mt-5 max-w-3xl break-words text-[1.7rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--ink)] sm:text-[2.85rem] lg:text-[3.25rem]"
      >
        {copy.hero.titleStart}{' '}
        <em className="font-serif-editorial font-normal italic text-[var(--accent-ink)]">
          {copy.hero.titleAccent}
        </em>
        {copy.hero.titleEnd}
      </motion.h1>

      {/* 3. Concise 1.5-line Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.08, ease: EASE_EDITORIAL }}
        className="mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-[var(--ink-2)] sm:text-[15px]"
      >
        {copy.hero.subtitle}
      </motion.p>

      {/* 4. Minimalist Progressive Guided Selector (Step 1 Intent -> Step 2 Categories) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.12, ease: EASE_EDITORIAL }}
        className="mx-auto mt-7 w-full rounded-[26px] border border-[var(--glass-border)] bg-[var(--surface)]/96 p-4 text-left shadow-[var(--shadow-float)] backdrop-blur-md sm:p-6"
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

        {/* Step 2: Opens progressive category pills when searching for a tutor */}
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
              {/* Subject Pills */}
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
                    onClick={() => onSubjectChange('')}
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
                        onClick={() => onSubjectChange(subj)}
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

              {/* Quick Class / Target Bar + Single Aligned CTA */}
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

      {/* 5. Quiet Proof Strip & Secondary Actions */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--muted)]">
        {copy.hero.metrics.map((m) => (
          <span key={m.label} className="inline-flex items-baseline gap-1.5">
            <strong className="font-mono-num text-sm font-bold text-[var(--ink)]">
              {m.value}
            </strong>
            <span>{m.label}</span>
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--muted)]">
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
    </section>
  );
}
