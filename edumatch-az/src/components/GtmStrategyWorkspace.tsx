'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChartLineUp,
  CheckCircle,
  Compass,
  CurrencyCircleDollar,
  Funnel,
  Lightning,
  MapPin,
  RocketLaunch,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  TrendUp,
  UsersThree,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { GTM_CONTENT } from '@/data/gtmData';
import type { Locale } from '@/types/edumatch';

interface GtmStrategyWorkspaceProps {
  locale: Locale;
  onExploreCatalog: () => void;
  onStartQuiz: () => void;
}

const SPRING_TAB = { type: 'spring' as const, stiffness: 380, damping: 32 };

export function GtmStrategyWorkspace({
  locale,
  onExploreCatalog,
  onStartQuiz,
}: GtmStrategyWorkspaceProps) {
  const gtm = GTM_CONTENT[locale];
  const [activePhaseId, setActivePhaseId] = useState<'phase1' | 'phase2' | 'phase3'>('phase1');

  // Unit economics simulator state (defaults to realistic Growth trajectory)
  const [tutors, setTutors] = useState(120);
  const [lessonsPerWeek, setLessonsPerWeek] = useState(10);
  const [avgPrice, setAvgPrice] = useState(24);
  const [proShare, setProShare] = useState(30);

  const activePhase = useMemo(
    () => gtm.phases.find((p) => p.id === activePhaseId) ?? gtm.phases[0],
    [gtm.phases, activePhaseId]
  );

  const economics = useMemo(() => {
    const monthlyLessonsPerTutor = lessonsPerWeek * 4.3;
    const totalMonthlyLessons = tutors * monthlyLessonsPerTutor;
    const gmv = Math.round(totalMonthlyLessons * avgPrice);
    const commissionRev = Math.round(gmv * 0.12);
    const proTutors = Math.round((tutors * proShare) / 100);
    const proRev = proTutors * 19;
    const platformRevenue = commissionRev + proRev;
    const tutorNetPayout = Math.round(monthlyLessonsPerTutor * avgPrice * 0.88);

    // 6-month average student-tutor retention / ~42 AZN blended CAC
    const revPerTutorMonthly = tutors > 0 ? platformRevenue / tutors : 0;
    const ltvCac = Number(((revPerTutorMonthly * 6) / 42).toFixed(1));

    return {
      gmv,
      commissionRev,
      proTutors,
      proRev,
      platformRevenue,
      tutorNetPayout,
      ltvCac,
    };
  }, [tutors, lessonsPerWeek, avgPrice, proShare]);

  const applyPreset = (preset: {
    tutors: number;
    lessonsPerWeek: number;
    avgPrice: number;
    proShare: number;
  }) => {
    setTutors(preset.tutors);
    setLessonsPerWeek(preset.lessonsPerWeek);
    setAvgPrice(preset.avgPrice);
    setProShare(preset.proShare);
  };

  return (
    <section
      id="gtm-strategy"
      aria-label={gtm.title}
      className="mx-auto max-w-6xl space-y-8 px-4 pt-6 pb-16 sm:px-6"
    >
      {/* Top Strategic Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="em-card relative overflow-hidden p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--accent-ink)] uppercase">
              <RocketLaunch size={13} weight="fill" aria-hidden="true" />
              {gtm.badge}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
              {gtm.title}
            </h1>
            <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {gtm.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onExploreCatalog}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--primary-btn)] px-4 py-2.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
            >
              <span>{gtm.ctaCatalog}</span>
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onStartQuiz}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--border-strong)]"
            >
              <Sparkle size={14} weight="fill" className="text-[var(--accent-ink)]" aria-hidden="true" />
              <span>{gtm.ctaQuiz}</span>
            </button>
          </div>
        </div>

        {/* 3 Key Highlights */}
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {gtm.highlights.map((item, idx) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 p-4 transition-colors hover:border-[var(--accent-border)]"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--muted)]">
                <span>{item.label}</span>
                {idx === 0 ? (
                  <Funnel size={14} className="text-[var(--accent-ink)]" aria-hidden="true" />
                ) : idx === 1 ? (
                  <CurrencyCircleDollar size={14} className="text-[var(--accent-ink)]" aria-hidden="true" />
                ) : (
                  <TrendUp size={14} className="text-[var(--accent-ink)]" aria-hidden="true" />
                )}
              </div>
              <div className="font-mono-num mt-1.5 text-xl font-extrabold text-[var(--ink)]">
                {item.value}
              </div>
              <p className="mt-1 text-xs leading-snug text-[var(--muted)]">{item.hint}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 1: 4-Step Marketplace Logic Flow */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--ink)]">
              {gtm.flowHeading}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{gtm.flowSubheading}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gtm.flowSteps.map((step) => (
            <motion.div
              key={step.step}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="em-card flex flex-col justify-between p-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-num inline-flex h-7 items-center rounded-full bg-[var(--primary-btn)] px-2.5 text-[11px] font-bold text-[var(--primary-btn-ink)]">
                    {step.step}
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--accent-ink)]">
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-snug text-[var(--ink)]">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--muted)]">{step.description}</p>
              </div>

              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--ink)]">
                  <Lightning size={12} weight="fill" className="text-[var(--accent)]" aria-hidden="true" />
                  {step.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section 2: Interactive 3-Phase Azerbaijan Launch Roadmap */}
      <div className="em-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--ink)]">
              {gtm.roadmapHeading}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{gtm.roadmapSubheading}</p>
          </div>

          {/* Interactive Phase Switcher */}
          <div
            role="tablist"
            aria-label={gtm.roadmapHeading}
            className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-1"
          >
            {gtm.phases.map((phase) => {
              const selected = phase.id === activePhase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActivePhaseId(phase.id)}
                  className={`relative cursor-pointer rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                    selected
                      ? 'text-[var(--primary-btn-ink)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="gtm-phase-pill"
                      transition={SPRING_TAB}
                      className="absolute inset-0 rounded-xl bg-[var(--primary-btn)]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10">{phase.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={activePhase.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/55 p-5 sm:p-6"
        >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--accent-ink)]">
                  <span>{activePhase.window}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} weight="fill" aria-hidden="true" />
                    {activePhase.focusCity}
                  </span>
                </div>
                <h3 className="mt-1.5 text-lg font-extrabold text-[var(--ink)]">
                  {activePhase.title}
                </h3>
              </div>

              <div className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3.5 py-1.5 text-xs font-bold text-[var(--accent-ink)]">
                {gtm.kpiLabel}: {activePhase.targetKpi}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              {activePhase.summary}
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  <Compass size={14} className="text-[var(--accent-ink)]" aria-hidden="true" />
                  <span>{gtm.channelsLabel}</span>
                </div>
                <ul className="space-y-2 text-xs leading-relaxed text-[var(--ink)]">
                  {activePhase.channels.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <CheckCircle
                        size={14}
                        weight="fill"
                        className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
                        aria-hidden="true"
                      />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  <ShieldCheck size={14} className="text-[var(--accent-ink)]" aria-hidden="true" />
                  <span>{gtm.tacticsLabel}</span>
                </div>
                <ul className="space-y-2 text-xs leading-relaxed text-[var(--ink)]">
                  {activePhase.tactics.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle
                        size={14}
                        weight="fill"
                        className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
                        aria-hidden="true"
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        </motion.div>
      </div>

      {/* Section 3: Interactive Unit Economics & Revenue Calculator */}
      <div className="em-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-ink)]">
              <SlidersHorizontal size={14} weight="bold" aria-hidden="true" />
              <span>UNIT ECONOMICS SIMULATOR</span>
            </div>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--ink)]">
              {gtm.calcHeading}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{gtm.calcSubheading}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-semibold text-[var(--muted)]">
              {gtm.presetsLabel}
            </span>
            {gtm.presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Sliders */}
          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/55 p-5">
            <label className="block space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--ink)]">{gtm.sliderTutors}</span>
                <span className="font-mono-num font-bold text-[var(--accent-ink)]">{tutors}</span>
              </div>
              <input
                type="range"
                min={20}
                max={700}
                step={10}
                value={tutors}
                aria-label={gtm.sliderTutors}
                onChange={(e) => setTutors(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-[var(--accent)]"
              />
            </label>

            <label className="block space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--ink)]">{gtm.sliderLessons}</span>
                <span className="font-mono-num font-bold text-[var(--accent-ink)]">
                  {lessonsPerWeek}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={25}
                step={1}
                value={lessonsPerWeek}
                aria-label={gtm.sliderLessons}
                onChange={(e) => setLessonsPerWeek(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-[var(--accent)]"
              />
            </label>

            <label className="block space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--ink)]">{gtm.sliderPrice}</span>
                <span className="font-mono-num font-bold text-[var(--accent-ink)]">
                  {avgPrice} ₼
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={55}
                step={1}
                value={avgPrice}
                aria-label={gtm.sliderPrice}
                onChange={(e) => setAvgPrice(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-[var(--accent)]"
              />
            </label>

            <label className="block space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--ink)]">{gtm.sliderProShare}</span>
                <span className="font-mono-num font-bold text-[var(--accent-ink)]">
                  {proShare}% ({economics.proTutors})
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={proShare}
                aria-label={gtm.sliderProShare}
                onChange={(e) => setProShare(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-[var(--accent)]"
              />
            </label>

            <p className="pt-1 text-[11px] leading-relaxed text-[var(--muted)]">
              {gtm.formulaNote}
            </p>
          </div>

          {/* Calculated Outputs */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
                <span>{gtm.outGmv}</span>
                <ChartLineUp size={15} className="text-[var(--accent-ink)]" aria-hidden="true" />
              </div>
              <div
                data-testid="gtm-out-gmv"
                className="font-mono-num mt-2 text-2xl font-extrabold text-[var(--ink)]"
              >
                {economics.gmv.toLocaleString('en-US')} ₼
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--accent-ink)]">
                <span>{gtm.outPlatformRev}</span>
                <TrendUp size={15} weight="bold" aria-hidden="true" />
              </div>
              <div
                data-testid="gtm-out-rev"
                className="font-mono-num mt-2 text-2xl font-extrabold text-[var(--ink)]"
              >
                {economics.platformRevenue.toLocaleString('en-US')} ₼
              </div>
              <div className="font-mono-num mt-1 text-[11px] text-[var(--accent-ink)]">
                {economics.commissionRev.toLocaleString('en-US')} ₼ ({gtm.outCommissionHint}) +{' '}
                {economics.proRev.toLocaleString('en-US')} ₼ ({gtm.outProHint})
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
                <span>{gtm.outTutorPayout}</span>
                <UsersThree size={15} className="text-[var(--accent-ink)]" aria-hidden="true" />
              </div>
              <div className="font-mono-num mt-2 text-2xl font-extrabold text-[var(--ink)]">
                {economics.tutorNetPayout.toLocaleString('en-US')} ₼
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="text-xs font-semibold text-[var(--muted)]">{gtm.outLtvCac}</div>
              <div className="font-mono-num mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[var(--accent-ink)]">
                  {economics.ltvCac}x
                </span>
              </div>
              <div className="mt-1 text-[11px] text-[var(--muted)]">{gtm.outLtvCacHint}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Competitive Moat Table */}
      <div className="em-card overflow-hidden p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--ink)]">
            {gtm.moatHeading}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--muted)]">{gtm.moatSubheading}</p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="py-3 pr-4 font-bold">{gtm.colCriterion}</th>
                <th className="px-4 py-3 font-semibold">{gtm.colInformal}</th>
                <th className="px-4 py-3 font-semibold">{gtm.colClassifieds}</th>
                <th className="rounded-t-xl bg-[var(--accent-soft)] px-4 py-3 font-extrabold text-[var(--accent-ink)]">
                  {gtm.colEdumatch}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {gtm.comparisonRows.map((row) => (
                <tr key={row.criterion}>
                  <td className="py-3.5 pr-4 font-bold text-[var(--ink)]">{row.criterion}</td>
                  <td className="px-4 py-3.5 text-[var(--muted)]">{row.informal}</td>
                  <td className="px-4 py-3.5 text-[var(--muted)]">{row.classifieds}</td>
                  <td className="bg-[var(--accent-soft)]/55 px-4 py-3.5 font-semibold text-[var(--ink)]">
                    {row.edumatch}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
