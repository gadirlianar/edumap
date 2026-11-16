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
    subtitleLead: string;
    subtitlePrice: string;
    intentTutor: string;
    intentMap: string;
    intentQuiz: string;
    allSubjects: string;
    allGrades: string;
    showResultsCta: string;
    dimLabel: string;
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
    subtitleLead: 'Проверенные баллы DİM · Первый урок',
    subtitlePrice: '— 0 ₼',
    intentTutor: 'Найти репетитора',
    intentMap: 'Посмотреть на карте',
    intentQuiz: 'Пройти тест уровня',
    allSubjects: 'Все предметы',
    allGrades: 'Любой',
    showResultsCta: 'Показать репетиторов',
    dimLabel: 'DİM балл',
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
    subtitleLead: 'Təsdiqli DİM balları · İlk sınaq dərsi',
    subtitlePrice: '— 0 ₼',
    intentTutor: 'Müəllim tapmaq',
    intentMap: 'Xəritədə baxmaq',
    intentQuiz: 'Səviyyə testi',
    allSubjects: 'Bütün fənlər',
    allGrades: 'Hamısı',
    showResultsCta: 'Müəllimləri göstər',
    dimLabel: 'DİM balı',
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
    subtitleLead: 'Audited scores & proven gains · First trial',
    subtitlePrice: '— 0 ₼',
    intentTutor: 'Find a tutor',
    intentMap: 'Map',
    intentQuiz: 'Level quiz',
    allSubjects: 'All subjects',
    allGrades: 'Any',
    showResultsCta: 'Show tutors',
    dimLabel: 'DİM score',
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

/** Bespoke 3D Isometric Score Bars SVG representing Before -> Mid -> After trajectory */
function IsometricScorePrism({
  before,
  after,
  delta,
}: {
  before: string;
  after: string;
  delta: string;
}) {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[#F0F9FF] via-white to-[#ECFDF5] p-3.5 dark:border-slate-700/70 dark:from-[#14233A] dark:via-[#111C2E] dark:to-[#0F2420]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono-num text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          DİM Growth
        </span>
        <span className="font-mono-num rounded-full bg-[var(--lime)] px-2 py-0.5 text-[10px] font-extrabold text-[#0F172A] shadow-2xs">
          {delta}
        </span>
      </div>

      {/* Isometric 3D Extruded Bar Columns */}
      <svg
        viewBox="0 0 180 112"
        className="my-1.5 h-24 w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="isoTopLime" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D9F99D" />
            <stop offset="100%" stopColor="#C8F542" />
          </linearGradient>
          <linearGradient id="isoFrontEmerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Subtle isometric platform shadow */}
        <ellipse cx="92" cy="102" rx="74" ry="7" fill="rgba(15, 23, 42, 0.08)" />

        {/* Bar 1 (Before) */}
        <g>
          <polygon points="26,64 42,56 58,64 42,72" fill="#CBD5E1" />
          <polygon points="26,64 42,72 42,98 26,90" fill="#94A3B8" />
          <polygon points="42,72 58,64 58,90 42,98" fill="#64748B" />
        </g>

        {/* Bar 2 (Mid Progress) */}
        <g>
          <polygon points="72,44 88,36 104,44 88,52" fill="#6EE7B7" />
          <polygon points="72,44 88,52 88,98 72,90" fill="#34D399" />
          <polygon points="88,52 104,44 104,90 88,98" fill="#059669" />
        </g>

        {/* Bar 3 (Target Peak — Emerald + Electric Lime Cap) */}
        <g>
          <polygon points="118,20 134,12 150,20 134,28" fill="url(#isoTopLime)" />
          <polygon points="118,20 134,28 134,98 118,90" fill="url(#isoFrontEmerald)" />
          <polygon points="134,28 150,20 150,90 134,98" fill="#065F46" />
          {/* Floating Peak Sparkle Ring */}
          <circle cx="134" cy="12" r="4" fill="#C8F542" />
          <circle cx="134" cy="12" r="8" fill="#C8F542" opacity="0.28" />
        </g>
      </svg>

      <div className="flex items-center justify-between font-mono-num text-[11px] font-bold text-[var(--ink)]">
        <span className="text-[var(--muted)]">{before}</span>
        <span className="text-[var(--accent-ink)]">→ {after}</span>
      </div>
    </div>
  );
}

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
  onOpenProfile,
  onSendRequest,
}: HeroOpeningProps) {
  const hc = HERO_COPY[locale];
  const [intent, setIntent] = useState<HeroIntent>('tutor');
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
  const quickSwitchPool = activePool.slice(0, 4);

  const handleIntentClick = (next: HeroIntent) => {
    setIntent(next);
    if (next === 'map') {
      onOpenMap();
    } else if (next === 'quiz') {
      onOpenQuiz();
    }
  };

  return (
    <section
      aria-label="EduMatch showcase"
      className="mx-auto mb-5 w-full max-w-7xl pt-2 pb-1 sm:pt-5"
    >
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-8 lg:gap-12">
        {/* LEFT COLUMN: Clean Minimal Editorial Copy + Single Unified Subject Dock */}
        <div className="text-center md:col-span-6 md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--accent-ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>{hc.eyebrow}</span>
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
            className="mx-auto mt-3.5 max-w-xl break-words text-[2rem] font-bold leading-[1.06] tracking-[-0.04em] text-[var(--ink)] sm:text-[2.65rem] lg:text-[3.25rem] md:mx-0"
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

          <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-[var(--ink-2)] sm:text-base md:mx-0">
            {hc.subtitleLead}{' '}
            <strong className="whitespace-nowrap font-mono-num font-bold text-[var(--ink)]">
              {hc.subtitlePrice}
            </strong>
            .
          </p>

          {/* Clean Command Bar (Primary CTA + Subtle Mode Switcher) */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
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

            <div className="inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 p-1 shadow-xs backdrop-blur-md">
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

          {/* Unified Subject Track (Clean Neutral Glass Track — No Rainbow Pill Clutter) */}
          <div className="mt-4 inline-flex w-full flex-col gap-2.5 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/85 p-3 text-left shadow-[var(--shadow-card)] backdrop-blur-xl">
            <div
              className="flex flex-wrap items-center gap-1"
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
                className={`min-h-[30px] cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  selectedSubject === ''
                    ? 'bg-[var(--ink)] text-[var(--bg)] shadow-2xs'
                    : 'text-[var(--ink-2)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]'
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
                    className={`inline-flex min-h-[30px] cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[var(--ink)] text-[var(--bg)] shadow-2xs'
                        : 'text-[var(--ink-2)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        active ? 'bg-[var(--lime)]' : theme.dotColorClass
                      }`}
                    />
                    <SubjIcon
                      size={12}
                      weight={active ? 'fill' : 'bold'}
                      aria-hidden="true"
                      className={active ? 'text-[var(--lime)]' : 'text-[var(--muted)]'}
                    />
                    <span>{SUBJECT_LABELS[subj][locale]}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)]/70 pt-2">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => onGradeChange('')}
                  aria-pressed={selectedGrade === ''}
                  className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                    selectedGrade === ''
                      ? 'bg-[var(--accent-soft)] text-[var(--accent-ink)]'
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
                          ? 'bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                          : 'text-[var(--muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {GRADE_LABELS[g][locale]}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-[var(--muted)]">
                {hc.metrics.map((m) => (
                  <span key={m.label} className="inline-flex items-baseline gap-1 whitespace-nowrap">
                    <strong className="font-mono-num text-xs font-bold text-[var(--ink)]">
                      {m.value}
                    </strong>
                    <span>{m.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Harmonious Frosted Glass 3D Isometric Product Showcase */}
        <div className="md:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE_EDITORIAL }}
            className="relative mx-auto w-full max-w-[520px] md:max-w-none"
          >
            {/* Ambient Soft Aura Halo */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -inset-2 rounded-[36px] bg-gradient-to-br ${subjectTheme.barGradientClass} opacity-20 blur-2xl transition-colors duration-300`}
            />

            {/* Crisp Un-Skewed Solaris Frosted Glass Showcase Card */}
            <div className="relative overflow-hidden rounded-[30px] border border-white/90 bg-[var(--surface)]/95 p-4 shadow-[var(--shadow-float)] backdrop-blur-2xl dark:border-slate-700/80 dark:bg-[#121D30]/95 sm:p-5">
              {/* Top Gradient Accent Bar */}
              <div
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${subjectTheme.topStripClass}`}
              />

              {/* Top Bar: Interactive Mentor Switcher + Counter */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent-ink)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{hc.spotlightLive}</span>
                  </span>
                  {activePrimarySubject ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${subjectTheme.pillClass}`}
                    >
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
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink-2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
                    >
                      <ArrowLeft size={12} weight="bold" />
                    </button>
                    <span className="font-mono-num min-w-[30px] text-center text-[11px] font-semibold text-[var(--muted)]">
                      {safeIdx + 1}/{activePool.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSpotlightCursor((c) => (c + 1) % activePool.length)}
                      aria-label={hc.nextSpotlight}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink-2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
                    >
                      <ArrowRight size={12} weight="bold" />
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Main 2-Part Showcase Body: Mentor Identity (Left) + 3D Isometric Score Prism (Right) */}
              <motion.div
                key={activeTutor.id}
                initial={{ opacity: 0.6, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
                className="mt-4 grid grid-cols-1 items-stretch gap-3.5 lg:grid-cols-12"
              >
                <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/55 p-3.5 lg:col-span-7">
                  <div className="flex items-center gap-3">
                    <Avatar
                      id={activeTutor.id}
                      name={activeTutorName}
                      index={safeIdx}
                      size="xl"
                      verified={activeTutor.education.verified}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
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
                          size={13}
                          weight="fill"
                          className="shrink-0 text-[var(--accent-ink)]"
                          aria-hidden="true"
                        />
                        <span className="truncate font-semibold text-[var(--ink-2)]">
                          {activeTutor.education.universityShort}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 font-bold text-[var(--ink)]">
                          <Star size={12} weight="fill" className="text-amber-500" aria-hidden="true" />
                          {activeTutor.rating.toFixed(1)}
                        </span>
                        <span className="text-[var(--border-strong)]">•</span>
                        <span className="font-mono-num font-bold text-[var(--ink)]">
                          {activeTutor.price} ₼
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Verified DİM Score + Superpower Summary */}
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                    <span className="truncate text-xs font-semibold text-[var(--accent-ink)]">
                      {resolveLocalized(activeVisual.superpowerTag, locale)}
                    </span>
                    <span className="shrink-0 rounded-lg bg-[var(--ink)] px-2 py-0.5 font-mono-num text-xs font-extrabold text-[var(--lime)]">
                      {activeTutor.education.admissionScore}
                    </span>
                  </div>
                </div>

                {/* Real 3D Isometric Extruded Score Graph */}
                <div className="lg:col-span-5">
                  <IsometricScorePrism
                    before={activeVisual.trajectory.before}
                    after={activeVisual.trajectory.after}
                    delta={activeVisual.trajectory.delta}
                  />
                </div>
              </motion.div>

              {/* Bottom Switcher + Clean Action Dock */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)]/70 pt-3.5">
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
                              ? 'scale-105 ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]'
                              : 'opacity-70 hover:opacity-100'
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
                    className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                  >
                    {hc.viewDossier}
                  </button>

                  <motion.button
                    type="button"
                    onClick={() =>
                      onSendRequest ? onSendRequest(activeTutor.id, true) : onQuickApply()
                    }
                    whileTap={{ scale: 0.98 }}
                    className="group/spot inline-flex min-h-[38px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[var(--primary-btn)] py-1 pl-4 pr-1 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
                  >
                    <span>{hc.bookTrialShort}</span>
                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover/spot:translate-x-0.5"
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
