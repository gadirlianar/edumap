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
  MapPin,
  SealCheck,
  Sparkle,
  Star,
  TerminalWindow,
  Translate,
  Trophy,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { SUBJECTS } from '@/data/catalog';
import { GRADE_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import { INITIAL_TUTORS, resolveLocalized, resolveTutorName } from '@/data/tutors';
import { getSubjectTheme, getTutorVisual } from '@/data/tutorVisuals';
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

const HERO_COPY: Record<
  Locale,
  {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    subtitle: string;
    intentTutor: string;
    intentMap: string;
    intentQuiz: string;
    allSubjects: string;
    allGrades: string;
    showResultsCta: string;
    dimBadge: string;
    trialFloat: string;
    spotlightLive: string;
    viewDossier: string;
    bookTrialShort: string;
    prevSpotlight: string;
    nextSpotlight: string;
    quickSwitchLabel: string;
    metrics: { value: string; label: string }[];
  }
> = {
  ru: {
    eyebrow: 'Баку · Онлайн · 650+ DİM',
    titleStart: 'Выбирайте репетитора по',
    titleAccent: 'реальным баллам',
    titleEnd: '',
    subtitle: 'Проверенные баллы. Живой рост учеников. Пробный урок — 0 ₼.',
    intentTutor: 'Найти репетитора',
    intentMap: 'Посмотреть на карте',
    intentQuiz: 'Пройти тест уровня',
    allSubjects: 'Все предметы',
    allGrades: 'Любой',
    showResultsCta: 'Показать репетиторов',
    dimBadge: 'DİM',
    trialFloat: '0 ₼ пробный',
    spotlightLive: 'Топ-ментор',
    viewDossier: 'Досье',
    bookTrialShort: 'Пробный · 0 ₼',
    prevSpotlight: 'Предыдущий ментор',
    nextSpotlight: 'Следующий ментор',
    quickSwitchLabel: 'Выбор ментора',
    metrics: [
      { value: '+145', label: 'рост DİM' },
      { value: '94%', label: 'в вуз мечты' },
      { value: '100%', label: 'диплом-аудит' },
    ],
  },
  az: {
    eyebrow: 'Bakı · Onlayn · 650+ DİM',
    titleStart: 'Müəllimi qəbul balı',
    titleAccent: 'və nəticəyə',
    titleEnd: 'görə seçin',
    subtitle: 'Təsdiqli ballar. Real şagird artımı. İlk sınaq — 0 ₼.',
    intentTutor: 'Müəllim tapmaq',
    intentMap: 'Xəritədə baxmaq',
    intentQuiz: 'Səviyyə testi',
    allSubjects: 'Bütün fənlər',
    allGrades: 'Hamısı',
    showResultsCta: 'Müəllimləri göstər',
    dimBadge: 'DİM',
    trialFloat: '0 ₼ sınaq',
    spotlightLive: 'Top mentor',
    viewDossier: 'Dosye',
    bookTrialShort: 'Sınaq · 0 ₼',
    prevSpotlight: 'Əvvəlki müəllim',
    nextSpotlight: 'Növbəti müəllim',
    quickSwitchLabel: 'Mentor seçimi',
    metrics: [
      { value: '+145', label: 'DİM artımı' },
      { value: '94%', label: 'hədəf VUZ' },
      { value: '100%', label: 'diplom auditi' },
    ],
  },
  en: {
    eyebrow: 'Baku · Online · 650+ DİM',
    titleStart: 'Choose a tutor by',
    titleAccent: 'verified scores',
    titleEnd: '',
    subtitle: 'Audited entrance scores. Real student gains. First class 0 ₼.',
    intentTutor: 'Find a tutor',
    intentMap: 'Map',
    intentQuiz: 'Level quiz',
    allSubjects: 'All subjects',
    allGrades: 'Any',
    showResultsCta: 'Show tutors',
    dimBadge: 'DİM',
    trialFloat: '0 ₼ trial',
    spotlightLive: 'Top mentor',
    viewDossier: 'Dossier',
    bookTrialShort: 'Trial · 0 ₼',
    prevSpotlight: 'Previous mentor',
    nextSpotlight: 'Next mentor',
    quickSwitchLabel: 'Switch mentor',
    metrics: [
      { value: '+145', label: 'DİM gain' },
      { value: '94%', label: 'target uni' },
      { value: '100%', label: 'audited' },
    ],
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
  return (
    <HeroStageInner
      locale={locale}
      selectedSubject={selectedSubject}
      selectedGrade={selectedGrade}
      resultCount={resultCount}
      spotlightTutors={spotlightTutors}
      onSubjectChange={onSubjectChange}
      onGradeChange={onGradeChange}
      onQuickApply={onQuickApply}
      onOpenMap={onOpenMap}
      onOpenQuiz={onOpenQuiz}
      onOpenTour={onOpenTour}
      onSwitchToTeacher={onSwitchToTeacher}
      onOpenCompare={onOpenCompare}
      onOpenProfile={onOpenProfile}
      onSendRequest={onSendRequest}
    />
  );
}

// Re-export exact full HeroOpening keeping optional callbacks wired cleanly
function HeroStageInner({
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
  onOpenProfile,
  onSendRequest,
}: HeroOpeningProps) {
  const hc = HERO_COPY[locale];
  const [intent, setIntent] = useState<HeroIntent>('tutor');
  const [spotlightCursor, setSpotlightCursor] = useState(0);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 2, ry: -4 });

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
  const quickSwitchPool = activePool.slice(0, 4);

  const handleIntentClick = (next: HeroIntent) => {
    setIntent(next);
    if (next === 'map') {
      onOpenMap();
    } else if (next === 'quiz') {
      onOpenQuiz();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-py * 10).toFixed(2)),
      ry: Number((px * 12).toFixed(2)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 2, ry: -4 });
  };

  return (
    <section
      aria-label="EduMatch showcase"
      className="mx-auto mb-6 w-full max-w-7xl pt-2 pb-1 sm:pt-5"
    >
      <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-12 md:gap-8 lg:gap-12">
        {/* LEFT COLUMN: Minimal Commercial Typography + Clean Controls (70% Less Text) */}
        <div className="text-center md:col-span-6 md:text-left">
          {/* 1 Tiny Eyebrow Pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--accent-ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>{hc.eyebrow}</span>
          </span>

          {/* Crisp Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: EASE_EDITORIAL }}
            className="mx-auto mt-3.5 max-w-lg break-words text-[2rem] font-bold leading-[1.06] tracking-[-0.04em] text-[var(--ink)] sm:text-[2.75rem] lg:text-[3.35rem] md:mx-0"
          >
            {hc.titleStart}{' '}
            <em className="relative inline-block font-serif-editorial font-normal italic text-[var(--accent-ink)]">
              {hc.titleAccent}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-[var(--lime)]/65 dark:bg-emerald-500/35"
              />
            </em>{' '}
            {hc.titleEnd}
          </motion.h1>

          {/* 1 Concise Line Subheadline */}
          <p className="mx-auto mt-3 max-w-md text-sm font-medium text-[var(--ink-2)] sm:text-base md:mx-0">
            {hc.subtitle}
          </p>

          {/* Single Unified Primary Action Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <motion.button
              type="button"
              onClick={onQuickApply}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-full bg-[var(--primary-btn)] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-[var(--primary-btn-ink)] shadow-[var(--shadow-float)] transition-colors hover:bg-[var(--primary-btn-hover)]"
            >
              <ChalkboardTeacher size={16} weight="bold" aria-hidden="true" />
              <span>
                {hc.showResultsCta} ({resultCount})
              </span>
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <ArrowRight size={14} weight="bold" />
              </span>
            </motion.button>

            <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/85 p-1 shadow-xs backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleIntentClick('tutor')}
                aria-pressed={intent === 'tutor'}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  intent === 'tutor'
                    ? 'bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                }`}
              >
                {hc.intentTutor}
              </button>
              <button
                type="button"
                onClick={() => handleIntentClick('map')}
                aria-pressed={intent === 'map'}
                aria-label={hc.intentMap}
                title={hc.intentMap}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]"
              >
                <MapPin size={14} weight="bold" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{hc.intentMap}</span>
              </button>
              <button
                type="button"
                onClick={() => handleIntentClick('quiz')}
                aria-pressed={intent === 'quiz'}
                aria-label={hc.intentQuiz}
                title={hc.intentQuiz}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--accent-ink)]"
              >
                <Sparkle size={14} weight="fill" className="text-[var(--accent)]" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{hc.intentQuiz}</span>
              </button>
            </div>
          </div>

          {/* Single Clean Subject Filter Strip */}
          <div
            className="mt-4 flex flex-wrap items-center justify-center gap-1.5 md:justify-start"
            role="group"
            aria-label="Subject switcher"
          >
            <button
              type="button"
              onClick={() => {
                setSpotlightCursor(0);
                onSubjectChange('');
              }}
              aria-pressed={selectedSubject === ''}
              className={`min-h-[32px] cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedSubject === ''
                  ? 'bg-[var(--ink)] text-[var(--bg)] shadow-xs'
                  : 'bg-[var(--surface)]/80 text-[var(--ink-2)] ring-1 ring-[var(--border)] hover:bg-[var(--surface)]'
              }`}
            >
              {hc.allSubjects}
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
                    setSpotlightCursor(0);
                    onSubjectChange(subj);
                  }}
                  aria-pressed={active}
                  className={`inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[var(--ink)] text-[var(--bg)] shadow-xs'
                      : `border hover:-translate-y-0.5 ${theme.pillClass}`
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
          </div>

          {/* Compact Grade Pills + Numeric Metrics in One Clean Footer Line */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[var(--border)]/70 pt-3.5 text-xs md:justify-start">
            <div className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)]/75 p-0.5 ring-1 ring-[var(--border)]">
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
                {hc.allGrades}
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

            <div className="flex flex-wrap items-center gap-3.5 text-[11px] text-[var(--muted)]">
              {hc.metrics.map((m) => (
                <span key={m.label} className="inline-flex items-baseline gap-1">
                  <strong className="font-mono-num text-xs font-bold text-[var(--ink)]">
                    {m.value}
                  </strong>
                  <span>{m.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: True Interactive 3D Perspective Product Stage */}
        <div
          className="md:col-span-6"
          style={{ perspective: '1200px' }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
            transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.7 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative mx-auto w-full max-w-[490px] py-3 md:max-w-none"
          >
            {/* 3D Backplate 1 (Z = -34px, angled Emerald Glass) */}
            <div
              aria-hidden="true"
              style={{ transform: 'translateZ(-34px) rotate(-3.5deg)' }}
              className="pointer-events-none absolute inset-x-3 inset-y-4 hidden rounded-[32px] border border-emerald-400/25 bg-gradient-to-br from-emerald-500/20 via-sky-500/15 to-transparent backdrop-blur-md sm:block"
            />

            {/* 3D Backplate 2 (Z = -18px, angled Lime Prism) */}
            <div
              aria-hidden="true"
              style={{ transform: 'translateZ(-18px) rotate(3deg)' }}
              className="pointer-events-none absolute inset-x-2 inset-y-4 hidden rounded-[32px] border border-[#C8F542]/30 bg-gradient-to-tr from-[#0F172A]/85 via-[#0F4C5C]/70 to-[#C8F542]/20 sm:block"
            />

            {/* Floating 3D DİM Crystal Badge (Z = +46px) */}
            <div
              style={{ transform: 'translateZ(46px)' }}
              className="absolute -top-1 right-2 z-30 flex items-center gap-2 rounded-2xl border border-[#C8F542]/50 bg-[#0F172A]/95 px-3.5 py-2 text-white shadow-[0_20px_40px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:-right-2"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#C8F542] to-emerald-400 text-[#0F172A] shadow-sm">
                <Trophy size={16} weight="fill" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <div className="font-mono-num text-base font-black text-[#C8F542]">
                  {activeTutor.education.admissionScore}
                  <span className="text-[11px] font-semibold text-slate-400">
                    /{activeTutor.education.maxScore}
                  </span>
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                  {hc.dimBadge}
                </div>
              </div>
            </div>

            {/* Floating 3D Trial Pill (Z = +38px) */}
            <div
              style={{ transform: 'translateZ(38px)' }}
              className="absolute -bottom-1 left-2 z-30 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0F172A]/95 px-3 py-1.5 text-xs font-bold text-white shadow-2xl backdrop-blur-xl sm:-left-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#C8F542] animate-pulse" aria-hidden="true" />
              <span>{hc.trialFloat}</span>
            </div>

            {/* Primary 3D Obsidian Card Plane (Z = +12px) */}
            <div
              style={{ transform: 'translateZ(12px)' }}
              className="relative z-10 overflow-hidden rounded-[30px] border border-slate-700/80 bg-[#0F172A] p-5 text-white shadow-[0_32px_70px_-18px_rgba(15,23,42,0.7)] sm:p-6"
            >
              {/* Subject-Reactive Glowing Aura */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-20 -right-16 h-60 w-60 rounded-full bg-gradient-to-br ${subjectTheme.barGradientClass} opacity-35 blur-3xl transition-colors duration-300`}
              />

              {/* Clean Top Row (Padded clear of 3D Crystal Badge) */}
              <div className="relative z-10 flex items-center justify-between gap-2 pr-28 sm:pr-32">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C8F542]" />
                    <span>{hc.spotlightLive}</span>
                  </span>
                  {activePrimarySubject ? (
                    <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-200 sm:inline-flex">
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
                      aria-label={hc.prevSpotlight}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/8 text-slate-200 transition-colors hover:bg-white/20"
                    >
                      <ArrowLeft size={12} weight="bold" />
                    </button>
                    <span className="font-mono-num min-w-[30px] text-center text-[11px] font-semibold text-slate-300">
                      {safeIdx + 1}/{activePool.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSpotlightCursor((c) => (c + 1) % activePool.length)}
                      aria-label={hc.nextSpotlight}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/8 text-slate-200 transition-colors hover:bg-white/20"
                    >
                      <ArrowRight size={12} weight="bold" />
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Active Mentor Identity + Minimal Badges */}
              <motion.div
                key={activeTutor.id}
                initial={{ opacity: 0.55, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
                className="relative z-10 mt-5 space-y-4 text-left"
              >
                <div className="flex items-center gap-3.5">
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

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap size={13} weight="fill" className="text-emerald-400" aria-hidden="true" />
                        <span className="font-semibold text-white">
                          {activeTutor.education.universityShort}
                        </span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-white">
                        <Star size={12} weight="fill" className="text-amber-400" aria-hidden="true" />
                        {activeTutor.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono-num font-bold text-[#C8F542]">
                        {activeTutor.price} ₼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Hero Centerpiece: 3D Glowing Score Growth Spline Curve */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-emerald-300">
                      {resolveLocalized(activeVisual.superpowerTag, locale)}
                    </span>
                    <span className="font-mono-num rounded-full bg-[#C8F542]/15 px-2.5 py-0.5 text-[11px] font-extrabold text-[#C8F542]">
                      {activeVisual.trajectory.before} → {activeVisual.trajectory.after} ({activeVisual.trajectory.delta})
                    </span>
                  </div>

                  {/* Glowing Bespoke SVG Growth Curve */}
                  <div className="mt-2.5 h-16 w-full">
                    <svg
                      viewBox="0 0 320 64"
                      className="h-full w-full overflow-visible"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id={`hero-curve-${activeTutor.id}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#C8F542" />
                        </linearGradient>
                        <linearGradient id={`hero-area-${activeTutor.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="54" x2="320" y2="54" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 4" />
                      <line x1="0" y1="28" x2="320" y2="28" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
                      <path
                        d="M 10 52 C 85 50, 145 38, 205 26 C 245 18, 280 12, 308 10 L 308 62 L 10 62 Z"
                        fill={`url(#hero-area-${activeTutor.id})`}
                      />
                      <path
                        d="M 10 52 C 85 50, 145 38, 205 26 C 245 18, 280 12, 308 10"
                        fill="none"
                        stroke={`url(#hero-curve-${activeTutor.id})`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="52" r="4" fill="#10B981" />
                      <circle cx="308" cy="10" r="6" fill="#C8F542" />
                      <circle cx="308" cy="10" r="11" fill="#C8F542" opacity="0.24" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Dock: Mini-Avatar Switcher + Primary Lime CTA */}
              <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 pt-1">
                {quickSwitchPool.length > 1 ? (
                  <div
                    className="flex items-center gap-1.5"
                    role="group"
                    aria-label={hc.quickSwitchLabel}
                  >
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
                ) : (
                  <span />
                )}

                <div className="flex flex-1 items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenProfile ? onOpenProfile(activeTutor.id) : onQuickApply()
                    }
                    className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/8 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/15"
                  >
                    {hc.viewDossier}
                  </button>

                  <motion.button
                    type="button"
                    onClick={() =>
                      onSendRequest ? onSendRequest(activeTutor.id, true) : onQuickApply()
                    }
                    whileTap={{ scale: 0.98 }}
                    className="group/spot inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-full bg-[var(--lime)] py-1 pl-4 pr-1 text-xs font-bold text-[#0F172A] shadow-md transition-colors hover:bg-[#d8fa6b]"
                  >
                    <span>{hc.bookTrialShort}</span>
                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 place-items-center rounded-full bg-[#0F172A] text-[#C8F542] transition-transform duration-200 group-hover/spot:translate-x-0.5"
                    >
                      <ArrowRight size={13} weight="bold" />
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
