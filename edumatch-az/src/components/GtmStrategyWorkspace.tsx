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
    const revPerTutorMonthly = tutors > 0 ? platformRevenue / tutors : 0;
    const ltvCac = Number(((revPerTutorMonthly * 6) / 42).toFixed(1));
    const commissionSharePct =
      platformRevenue > 0 ? Math.round((commissionRev / platformRevenue) * 100) : 0;
    const proSharePct = Math.max(0, 100 - commissionSharePct);

    return {
      gmv,
      commissionRev,
      proTutors,
      proRev,
      platformRevenue,
      tutorNetPayout,
      ltvCac,
      commissionSharePct,
      proSharePct,
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
      {/* Top Executive Obsidian Banner with 3D Animated Orbit Accent */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-[32px] border border-slate-800/90 bg-[#0F172A] p-6 text-white shadow-[0_32px_70px_-20px_rgba(15,23,42,0.55)] sm:p-8"
      >
        {/* Top Glowing Accent Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8F542]/80 to-transparent"
        />

        {/* Animated 3D Orbiting Wireframe Sphere in Top-Right Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 opacity-25"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="h-full w-full rounded-full border-2 border-dashed border-[#C8F542]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-6 rounded-full border border-emerald-400"
          />
        </div>

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-bold tracking-wider text-[#C8F542] uppercase">
              <RocketLaunch size={13} weight="fill" aria-hidden="true" />
              {gtm.badge}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {gtm.title}
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              {gtm.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onExploreCatalog}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--lime)] px-5 py-2.5 text-xs font-bold text-[#0F172A] shadow-md transition-transform hover:-translate-y-0.5"
            >
              <span>{gtm.ctaCatalog}</span>
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onStartQuiz}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/15"
            >
              <Sparkle size={14} weight="fill" className="text-[#C8F542]" aria-hidden="true" />
              <span>{gtm.ctaQuiz}</span>
            </button>
          </div>
        </div>

        {/* 3 Frosted Dark-Glass Key Investor Highlights */}
        <div className="relative z-10 mt-7 grid gap-4 md:grid-cols-3">
          {gtm.highlights.map((item, idx) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="rounded-2xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur-md transition-colors hover:border-[#C8F542]/45"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>{item.label}</span>
                {idx === 0 ? (
                  <Funnel size={15} className="text-[#C8F542]" aria-hidden="true" />
                ) : idx === 1 ? (
                  <CurrencyCircleDollar size={15} className="text-[#C8F542]" aria-hidden="true" />
                ) : (
                  <TrendUp size={15} className="text-[#C8F542]" aria-hidden="true" />
                )}
              </div>
              <div className="font-mono-num mt-1.5 text-2xl font-black text-white">
                {item.value}
              </div>
              <p className="mt-1 text-xs leading-snug text-slate-300">{item.hint}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section 1: 4-Step Monetization & Marketplace Engine Flow */}
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
          {gtm.flowSteps.map((step, i) => (
            <motion.div
              key={step.step}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="em-card relative flex flex-col justify-between overflow-hidden rounded-[24px] p-5"
            >
              <div
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                  i === 0
                    ? 'from-sky-400 to-emerald-400'
                    : i === 1
                      ? 'from-emerald-400 to-[#C8F542]'
                      : i === 2
                        ? 'from-violet-400 to-emerald-400'
                        : 'from-[#C8F542] to-amber-400'
                }`}
              />
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono-num inline-flex h-7 items-center rounded-full bg-[var(--primary-btn)] px-2.5 text-[11px] font-bold text-[var(--primary-btn-ink)]">
                    {step.step}
                  </span>
                  <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-ink)]">
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

      {/* Section 2: Interactive 3-Phase Rollout Roadmap */}
      <div className="em-card rounded-[28px] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--ink)]">
              {gtm.roadmapHeading}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{gtm.roadmapSubheading}</p>
          </div>

          <div
            role="tablist"
            aria-label={gtm.roadmapHeading}
            className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1"
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
                      className="absolute inset-0 rounded-xl bg-[var(--primary-btn)] shadow-xs"
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
          className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/55 p-5 sm:p-6"
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
            <div className="space-y-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
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

            <div className="space-y-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
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

      {/* Section 3: Interactive Unit Economics & Obsidian Revenue Terminal */}
      <div className="em-card rounded-[28px] p-6 sm:p-8">
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
                className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent-border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Sliders */}
          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/55 p-5 lg:col-span-6">
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

          {/* High-Contrast Obsidian Revenue Terminal */}
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-[#0F172A] p-5 text-white shadow-xl lg:col-span-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>{gtm.outGmv}</span>
                  <ChartLineUp size={15} className="text-emerald-400" aria-hidden="true" />
                </div>
                <div
                  data-testid="gtm-out-gmv"
                  className="font-mono-num mt-2 text-2xl font-extrabold text-white"
                >
                  {economics.gmv.toLocaleString('en-US')} ₼
                </div>
              </div>

              <div className="rounded-2xl border border-[#C8F542]/40 bg-[#C8F542]/12 p-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#C8F542]">
                  <span>{gtm.outPlatformRev}</span>
                  <TrendUp size={15} weight="bold" aria-hidden="true" />
                </div>
                <div
                  data-testid="gtm-out-rev"
                  className="font-mono-num mt-2 text-2xl font-black text-[#C8F542]"
                >
                  {economics.platformRevenue.toLocaleString('en-US')} ₼
                </div>
                <div className="font-mono-num mt-1 text-[10px] text-emerald-200">
                  {economics.commissionRev.toLocaleString('en-US')} ₼ +{' '}
                  {economics.proRev.toLocaleString('en-US')} ₼ PRO
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>{gtm.outTutorPayout}</span>
                  <UsersThree size={15} className="text-emerald-400" aria-hidden="true" />
                </div>
                <div className="font-mono-num mt-2 text-xl font-extrabold text-white">
                  {economics.tutorNetPayout.toLocaleString('en-US')} ₼
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="text-xs font-semibold text-slate-300">{gtm.outLtvCac}</div>
                <div className="font-mono-num mt-2 text-xl font-extrabold text-emerald-300">
                  {economics.ltvCac}x
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">{gtm.outLtvCacHint}</div>
              </div>
            </div>

            {/* Live Stacked Revenue Split Bar */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>12% Escrow ({economics.commissionSharePct}%)</span>
                <span className="text-[#C8F542]">PRO SaaS ({economics.proSharePct}%)</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${economics.commissionSharePct}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-emerald-400"
                />
                <motion.div
                  animate={{ width: `${economics.proSharePct}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-[#C8F542]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Competitive Moat Table */}
      <div className="em-card overflow-hidden rounded-[28px] p-6 sm:p-8">
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
                <th className="rounded-t-2xl bg-[#0F172A] px-4 py-3 font-extrabold text-[#C8F542]">
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
                  <td className="bg-[var(--accent-soft)]/65 px-4 py-3.5 font-semibold text-[var(--ink)]">
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
