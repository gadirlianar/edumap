'use client';

import React from 'react';
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  GraduationCap,
  Lock,
  MapPin,
  ShieldCheck,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { COPY } from '@/data/i18n';
import type { Locale, SubjectId } from '@/types/edumatch';

interface FooterProps {
  locale: Locale;
  onNavigateSearch: () => void;
  onNavigateTest: () => void;
  onNavigateLessons: () => void;
  onSelectSubject: (subj: SubjectId | '') => void;
  onOpenTour: () => void;
  onSwitchToTeacher: () => void;
  onOpenPrivacy: () => void;
  onResetDemo: () => void;
}

const FOOTER_LABELS: Record<
  Locale,
  {
    howItWorks: string;
    becomeTutor: string;
    verifiedBadge: string;
    citiesLine: string;
    copyright: string;
  }
> = {
  ru: {
    howItWorks: 'Как работает',
    becomeTutor: 'Я преподаватель',
    verifiedBadge: 'Аудит дипломов и баллов DİM',
    citiesLine: 'Баку · Сумгайыт · Гянджа · Онлайн',
    copyright: '© 2026 EduMatch',
  },
  az: {
    howItWorks: 'Necə işləyir',
    becomeTutor: 'Mən müəlliməm',
    verifiedBadge: 'Diplom və DİM balı auditi',
    citiesLine: 'Bakı · Sumqayıt · Gəncə · Onlayn',
    copyright: '© 2026 EduMatch',
  },
  en: {
    howItWorks: 'How it works',
    becomeTutor: 'For tutors',
    verifiedBadge: 'Diplomas & DİM verified',
    citiesLine: 'Baku · Sumgayit · Ganja · Online',
    copyright: '© 2026 EduMatch',
  },
};

export function Footer({
  locale,
  onNavigateSearch,
  onNavigateTest,
  onNavigateLessons,
  onOpenTour,
  onSwitchToTeacher,
  onOpenPrivacy,
  onResetDemo,
}: FooterProps) {
  const copy = COPY[locale];
  const f = FOOTER_LABELS[locale];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="group/footer relative mt-10 overflow-hidden rounded-[26px] border border-white/10 bg-[#0F172A] px-5 py-5 text-white shadow-[var(--shadow-float)] dark:border-slate-700/60 dark:bg-[#0D1729] sm:px-7 sm:py-6"
    >
      {/* Subtle Top Emerald-Lime Accent Shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8F542]/75 to-transparent"
      />

      {/* Tier 1: Compact Identity + Quick Navigation & Teacher CTA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--lime)] text-[#0F172A] shadow-xs transition-transform duration-200 group-hover/footer:scale-105"
              aria-hidden="true"
            >
              <GraduationCap size={17} weight="fill" />
            </span>
            <div>
              <div className="text-sm font-bold tracking-tight text-white">
                EduMatch
              </div>
              <div className="text-[11px] text-slate-300">
                {copy.brandTagline}
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-medium text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" aria-hidden="true" />
            <MapPin size={12} weight="fill" className="text-[#C8F542]" aria-hidden="true" />
            <span>{f.citiesLine}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onNavigateSearch}
            className="cursor-pointer rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/12 hover:text-white"
          >
            {copy.nav.search}
          </button>
          <button
            type="button"
            onClick={onNavigateTest}
            className="cursor-pointer rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/12 hover:text-white"
          >
            {copy.nav.test}
          </button>
          <button
            type="button"
            onClick={onNavigateLessons}
            className="cursor-pointer rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/12 hover:text-white"
          >
            {copy.nav.lessons}
          </button>
          <button
            type="button"
            onClick={onOpenTour}
            className="cursor-pointer rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/12 hover:text-white"
          >
            {f.howItWorks}
          </button>
          <button
            type="button"
            onClick={onSwitchToTeacher}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--lime)] px-3.5 py-1.5 text-xs font-bold text-[#0F172A] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>{f.becomeTutor}</span>
            <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Tier 2: Crisp Audit & Legal Utility Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3.5 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-white/90">{f.copyright}</span>
          <span aria-hidden="true" className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300">
            <ShieldCheck size={14} weight="fill" className="text-[#10B981]" aria-hidden="true" />
            <span>{f.verifiedBadge}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Lock size={12} weight="fill" aria-hidden="true" />
            <span>{copy.nav.privacy}</span>
          </button>

          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowCounterClockwise size={12} weight="bold" aria-hidden="true" />
            <span>{copy.nav.resetDemo}</span>
          </button>
        </div>
      </div>
    </motion.footer>
  );
}
