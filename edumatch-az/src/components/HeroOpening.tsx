'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ChalkboardTeacher,
  GraduationCap,
  SealCheck,
  Sparkle,
  TrendUp,
  Trophy,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import type { GradeId, Locale, SubjectId, TutorProfile } from '@/types/edumatch';

interface HeroOpeningProps {
  locale: Locale;
  selectedSubject?: SubjectId | '';
  selectedGrade?: GradeId | '';
  resultCount: number;
  spotlightTutors?: TutorProfile[];
  onSubjectChange?: (subj: SubjectId | '') => void;
  onGradeChange?: (cat: GradeId | '') => void;
  onQuickApply: () => void;
  onOpenMap?: () => void;
  onOpenQuiz: () => void;
  onOpenTour?: () => void;
  onSwitchToTeacher?: () => void;
  onOpenCompare?: () => void;
  onOpenProfile?: (tutorId: string) => void;
  onSendRequest?: (tutorId: string, trial: boolean) => void;
}

interface SimulatorStageTier {
  id: 'tier1' | 'tier2' | 'tier3';
  tabLabel: string;
  startScore: number;
  endScore: number;
  delta: string;
  months: Record<Locale, string>;
  universities: string[];
  heights: [number, number, number];
}

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

const SIMULATOR_TIERS: SimulatorStageTier[] = [
  {
    id: 'tier1',
    tabLabel: '450 → 600+',
    startScore: 450,
    endScore: 605,
    delta: '+155 DİM',
    months: { ru: '3 мес.', az: '3 ay', en: '3 mo' },
    universities: ['BDU', 'ADNSU', 'UNEC'],
    heights: [42, 74, 108],
  },
  {
    id: 'tier2',
    tabLabel: '500 → 650+',
    startScore: 500,
    endScore: 658,
    delta: '+158 DİM',
    months: { ru: '4 мес.', az: '4 ay', en: '4 mo' },
    universities: ['ADA', 'UFAZ', 'BDU'],
    heights: [52, 92, 132],
  },
  {
    id: 'tier3',
    tabLabel: '540 → 690+',
    startScore: 540,
    endScore: 692,
    delta: '+152 DİM',
    months: { ru: '5 мес.', az: '5 ay', en: '5 mo' },
    universities: ['BANM', 'ADA', 'UFAZ'],
    heights: [62, 104, 148],
  },
];

const HERO_COPY: Record<
  Locale,
  {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    subtitleLead: string;
    subtitlePrice: string;
    primaryCta: string;
    quizCta: string;
    stageLabel: string;
    stageTitle: string;
    baselineLabel: string;
    targetLabel: string;
    metrics: { value: string; label: string }[];
  }
> = {
  ru: {
    eyebrow: 'Баку · Онлайн · Аудит 650+ DİM',
    titleStart: 'Выбирайте репетитора по',
    titleAccent: 'реальным баллам',
    titleEnd: '',
    subtitleLead: 'Проверенные дипломы и измеримый рост. Первый пробный',
    subtitlePrice: '— 0 ₼',
    primaryCta: 'Показать репетиторов',
    quizCta: 'Пройти тест уровня',
    stageLabel: '3D-траектория результата',
    stageTitle: 'Прогноз роста DİM',
    baselineLabel: 'Старт',
    targetLabel: 'Цель',
    metrics: [
      { value: '+145', label: 'рост DİM' },
      { value: '94%', label: 'в вуз мечты' },
      { value: '100%', label: 'аудит баллов' },
    ],
  },
  az: {
    eyebrow: 'Bakı · Onlayn · 650+ DİM Auditi',
    titleStart: 'Müəllimi qəbul balı',
    titleAccent: 'və nəticəyə',
    titleEnd: 'görə seçin',
    subtitleLead: 'Təsdiqli diplomlar və real bal artımı. İlk sınaq',
    subtitlePrice: '— 0 ₼',
    primaryCta: 'Müəllimləri göstər',
    quizCta: 'Səviyyə testi keç',
    stageLabel: '3D Nəticə Modeli',
    stageTitle: 'DİM Bal Artımı',
    baselineLabel: 'Başlanğıc',
    targetLabel: 'Hədəf',
    metrics: [
      { value: '+145', label: 'DİM artımı' },
      { value: '94%', label: 'hədəf VUZ' },
      { value: '100%', label: 'bal auditi' },
    ],
  },
  en: {
    eyebrow: 'Baku · Online · Audited 650+ DİM',
    titleStart: 'Choose a tutor by',
    titleAccent: 'verified scores',
    titleEnd: '',
    subtitleLead: 'Audited university scores & measurable gains. First trial',
    subtitlePrice: '— 0 ₼',
    primaryCta: 'Show tutors',
    quizCta: 'Take level quiz',
    stageLabel: '3D Outcome Engine',
    stageTitle: 'DİM Score Projection',
    baselineLabel: 'Baseline',
    targetLabel: 'Target',
    metrics: [
      { value: '+145', label: 'DİM gain' },
      { value: '94%', label: 'target uni' },
      { value: '100%', label: 'verified' },
    ],
  },
};

function IsometricBar({
  x,
  height,
  palette,
}: {
  x: number;
  height: number;
  palette: 'slate' | 'emerald' | 'lime';
}) {
  const baseY = 178;
  const topY = baseY - height;
  const halfW = 24;
  const depth = 13;

  const colors =
    palette === 'slate'
      ? { top: '#CBD5E1', left: '#94A3B8', right: '#64748B' }
      : palette === 'emerald'
        ? { top: '#6EE7B7', left: '#10B981', right: '#047857' }
        : { top: '#D9F99D', left: '#10B981', right: '#065F46' };

  return (
    <g>
      <motion.polygon
        initial={false}
        animate={{
          points: `${x - halfW},${topY} ${x},${topY - depth} ${x + halfW},${topY} ${x},${topY + depth}`,
        }}
        transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
        fill={colors.top}
      />
      <motion.polygon
        initial={false}
        animate={{
          points: `${x - halfW},${topY} ${x},${topY + depth} ${x},${baseY} ${x - halfW},${baseY - depth}`,
        }}
        transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
        fill={colors.left}
      />
      <motion.polygon
        initial={false}
        animate={{
          points: `${x},${topY + depth} ${x + halfW},${topY} ${x + halfW},${baseY - depth} ${x},${baseY}`,
        }}
        transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
        fill={colors.right}
      />
    </g>
  );
}

export function HeroOpening({
  locale,
  resultCount,
  onQuickApply,
  onOpenQuiz,
}: HeroOpeningProps) {
  const hc = HERO_COPY[locale];
  const [tierIdx, setTierIdx] = useState(1);
  const activeTier = SIMULATOR_TIERS[tierIdx] ?? SIMULATOR_TIERS[1];

  return (
    <section
      aria-label="EduMatch showcase"
      className="mx-auto mb-6 w-full max-w-7xl pt-4 pb-2 sm:pt-8"
    >
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
        {/* LEFT COLUMN: Clean Flagship Copy & Two Primary Actions (Zero Redundant Filters) */}
        <div className="text-center md:col-span-6 md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--accent-ink)]">
            <SealCheck size={13} weight="fill" aria-hidden="true" />
            <span>{hc.eyebrow}</span>
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: EASE_EDITORIAL }}
            className="mx-auto mt-4 max-w-xl break-words text-[2.15rem] font-bold leading-[1.06] tracking-[-0.04em] text-[var(--ink)] sm:text-[2.85rem] lg:text-[3.45rem] md:mx-0"
          >
            {hc.titleStart}{' '}
            <em className="relative inline-block font-serif-editorial font-normal italic text-[var(--accent-ink)]">
              {hc.titleAccent}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-[var(--lime)]/70 dark:bg-emerald-500/35"
              />
            </em>{' '}
            {hc.titleEnd}
          </motion.h1>

          <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-relaxed text-[var(--ink-2)] sm:text-base md:mx-0">
            {hc.subtitleLead}{' '}
            <strong className="whitespace-nowrap font-mono-num font-bold text-[var(--ink)]">
              {hc.subtitlePrice}
            </strong>
            .
          </p>

          {/* Two Bold Clean Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <motion.button
              type="button"
              onClick={onQuickApply}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex min-h-[48px] cursor-pointer items-center gap-3 rounded-full bg-[var(--primary-btn)] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-[var(--primary-btn-ink)] shadow-[var(--shadow-float)] transition-colors hover:bg-[var(--primary-btn-hover)]"
            >
              <ChalkboardTeacher size={17} weight="bold" aria-hidden="true" />
              <span>
                {hc.primaryCta} ({resultCount})
              </span>
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <ArrowRight size={15} weight="bold" />
              </span>
            </motion.button>

            <button
              type="button"
              onClick={onOpenQuiz}
              className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-5 text-sm font-semibold text-[var(--ink)] shadow-xs backdrop-blur-md transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <Sparkle size={16} weight="fill" className="text-[var(--accent)]" aria-hidden="true" />
              <span>{hc.quizCta}</span>
            </button>
          </div>

          {/* Minimalist 3-Metric Proof Line */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-t border-[var(--border)]/70 pt-5 text-xs text-[var(--muted)] md:justify-start">
            {hc.metrics.map((m) => (
              <div key={m.label} className="flex items-baseline gap-1.5">
                <strong className="font-mono-num text-lg font-extrabold tracking-tight text-[var(--ink)]">
                  {m.value}
                </strong>
                <span className="font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Pure Interactive 3D Isometric Outcome Engine (No Duplicate Tutor List) */}
        <div className="md:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.1, ease: EASE_EDITORIAL }}
            className="relative mx-auto w-full max-w-[500px] md:max-w-none"
          >
            {/* Ambient Emerald & Sky Halo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 rounded-[40px] bg-gradient-to-br from-emerald-400/20 via-sky-400/20 to-[#C8F542]/25 blur-2xl"
            />

            {/* Architectural Frosted Glass 3D Stage */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/95 bg-[var(--surface)]/92 p-5 shadow-[var(--shadow-float)] backdrop-blur-2xl dark:border-slate-700/80 dark:bg-[#121D30]/95 sm:p-6">
              {/* Header + Interactive Tier Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--accent-ink)]">
                  <TrendUp size={13} weight="bold" aria-hidden="true" />
                  <span>{hc.stageLabel}</span>
                </span>

                <div
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-subtle)] p-1"
                  role="group"
                  aria-label={hc.stageTitle}
                >
                  {SIMULATOR_TIERS.map((tier, idx) => {
                    const active = tierIdx === idx;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setTierIdx(idx)}
                        aria-pressed={active}
                        className={`cursor-pointer rounded-full px-2.5 py-1 font-mono-num text-[11px] font-bold transition-all ${
                          active
                            ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-2xs'
                            : 'text-[var(--muted)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {tier.tabLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3D Isometric Extruded Pillar Visualization Canvas */}
              <div className="relative mt-4 overflow-hidden rounded-[24px] border border-[var(--border)] bg-gradient-to-br from-[#F0F9FF] via-white to-[#ECFDF5] p-4 dark:from-[#16273E] dark:via-[#121E33] dark:to-[#102822]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      {hc.stageTitle}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono-num text-3xl font-black tracking-tight text-[var(--ink)]">
                        {activeTier.endScore}
                      </span>
                      <span className="font-mono-num text-xs font-semibold text-[var(--muted)]">
                        / 700
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl bg-[#0F172A] px-3 py-2 text-white shadow-md">
                    <Trophy size={15} weight="fill" className="text-[#C8F542]" aria-hidden="true" />
                    <span className="font-mono-num text-xs font-extrabold text-[#C8F542]">
                      {activeTier.delta}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300">
                      · {activeTier.months[locale]}
                    </span>
                  </div>
                </div>

                {/* Large Tactile 3D Isometric Steps SVG */}
                <svg
                  viewBox="0 0 320 198"
                  className="mx-auto mt-1 h-44 w-full max-w-[340px] overflow-visible"
                  aria-hidden="true"
                >
                  {/* Isometric Ground Platform */}
                  <ellipse cx="160" cy="182" rx="135" ry="12" fill="rgba(15, 23, 42, 0.07)" />
                  <ellipse cx="160" cy="182" rx="95" ry="7" fill="rgba(16, 185, 129, 0.08)" />

                  {/* 3 Rising Isometric 3D Pillars */}
                  <IsometricBar x={82} height={activeTier.heights[0]} palette="slate" />
                  <IsometricBar x={160} height={activeTier.heights[1]} palette="emerald" />
                  <IsometricBar x={238} height={activeTier.heights[2]} palette="lime" />

                  {/* Floating Translucent Score Nodes */}
                  <g>
                    <rect
                      x="54"
                      y={178 - activeTier.heights[0] - 42}
                      width="56"
                      height="22"
                      rx="11"
                      className="fill-white/95 stroke-slate-200 dark:fill-slate-800 dark:stroke-slate-600"
                      strokeWidth="1"
                    />
                    <text
                      x="82"
                      y={178 - activeTier.heights[0] - 27}
                      textAnchor="middle"
                      className="fill-slate-600 font-mono text-[10px] font-bold dark:fill-slate-200"
                    >
                      {activeTier.startScore}
                    </text>
                  </g>

                  <g>
                    <circle
                      cx="238"
                      cy={178 - activeTier.heights[2] - 26}
                      r="5"
                      fill="#C8F542"
                    />
                    <circle
                      cx="238"
                      cy={178 - activeTier.heights[2] - 26}
                      r="11"
                      fill="#C8F542"
                      opacity="0.25"
                    />
                  </g>
                </svg>

                {/* Baseline -> Target Readout */}
                <div className="mt-1 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[var(--muted)]">
                    {hc.baselineLabel}: <strong className="font-mono-num text-[var(--ink)]">{activeTier.startScore}</strong>
                  </span>
                  <span className="text-[var(--accent-ink)]">
                    {hc.targetLabel}: <strong className="font-mono-num">{activeTier.endScore} / 700</strong>
                  </span>
                </div>
              </div>

              {/* Target University Orbit Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={15} weight="fill" className="text-[var(--accent-ink)]" aria-hidden="true" />
                  {activeTier.universities.map((uni) => (
                    <span
                      key={uni}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-0.5 font-mono-num text-[11px] font-bold text-[var(--ink)]"
                    >
                      {uni}
                    </span>
                  ))}
                </div>

                <span className="text-[11px] font-semibold text-[var(--accent-ink)]">
                  650+ · UFAZ / BANM / ADA
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
