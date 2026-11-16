'use client';

import React from 'react';
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  CheckCircle,
  Lock,
  ShieldCheck,
} from '@phosphor-icons/react';
import { COPY } from '@/data/i18n';
import type { Locale, SubjectId } from '@/types/edumatch';

interface FooterProps {
  locale: Locale;
  activeStrategy?: boolean;
  onNavigateSearch: () => void;
  onNavigateTest: () => void;
  onNavigateLessons: () => void;
  onNavigateStrategy?: () => void;
  onSelectSubject?: (subj: SubjectId | '') => void;
  onOpenTour: () => void;
  onSwitchToTeacher: () => void;
  onOpenPrivacy: () => void;
  onResetDemo: () => void;
}

const FOOTER_STRINGS: Record<
  Locale,
  {
    brandDesc: string;
    liveAudited: string;
    colPlatform: string;
    colBusiness: string;
    colLegal: string;
    howItWorks: string;
    gtmRoadmap: string;
    unitEconomics: string;
    becomeTutor: string;
    verifiedAudit: string;
    dimBadge: string;
    citiesLine: string;
    copyright: string;
    badgeLive: string;
  }
> = {
  az: {
    brandDesc:
      'Təsdiqlənmiş DİM qəbul balı, dövlət diplomu və ölçülə bilən şagird nəticələrinə əsaslanan müəllim platforması.',
    liveAudited: 'DİM Auditi',
    colPlatform: 'Platforma',
    colBusiness: 'Biznes və Strategiya',
    colLegal: 'Güvən və Təhlükəsizlik',
    howItWorks: 'Platforma bələdçisi',
    gtmRoadmap: 'GTM Yol Xəritəsi',
    unitEconomics: 'Unit-ekonomika kalkulyatoru',
    becomeTutor: 'Müəllimlər üçün',
    verifiedAudit: 'Diplom və DİM balı auditi',
    dimBadge: '100% Yoxlanılmış Müəllimlər',
    citiesLine: 'Bakı · Sumqayıt · Gəncə · Onlayn',
    copyright: '© 2026 EduMatch. Bütün hüquqlar qorunur.',
    badgeLive: 'GTM v1.2',
  },
  ru: {
    brandDesc:
      'Маркетплейс репетиторов с верификацией баллов DİM, университетских дипломов и подтверждённой успеваемости.',
    liveAudited: 'DİM Аудит',
    colPlatform: 'Платформа',
    colBusiness: 'Бизнес и стратегия',
    colLegal: 'Доверие и аудит',
    howItWorks: 'Как работает',
    gtmRoadmap: 'План выхода GTM',
    unitEconomics: 'Unit-экономика и выручка',
    becomeTutor: 'Для преподавателей',
    verifiedAudit: 'Аудит дипломов и баллов DİM',
    dimBadge: '100% проверенные преподаватели',
    citiesLine: 'Баку · Сумгайыт · Гянджа · Онлайн',
    copyright: '© 2026 EduMatch. Все права защищены.',
    badgeLive: 'GTM v1.2',
  },
  en: {
    brandDesc:
      'Audited tutor marketplace built around verified DİM entrance scores, accredited degrees, and measurable student gains.',
    liveAudited: 'Live Audited',
    colPlatform: 'Platform',
    colBusiness: 'Business & Strategy',
    colLegal: 'Trust & Governance',
    howItWorks: 'How it works',
    gtmRoadmap: 'GTM Rollout Roadmap',
    unitEconomics: 'Unit Economics Simulator',
    becomeTutor: 'For tutors',
    verifiedAudit: 'Diplomas & DİM verified',
    dimBadge: '100% Audited Tutors',
    citiesLine: 'Baku · Sumgayit · Ganja · Online',
    copyright: '© 2026 EduMatch. All rights reserved.',
    badgeLive: 'GTM v1.2',
  },
};

export function Footer({
  locale,
  activeStrategy = false,
  onNavigateSearch,
  onNavigateTest,
  onNavigateLessons,
  onNavigateStrategy,
  onOpenTour,
  onSwitchToTeacher,
  onOpenPrivacy,
  onResetDemo,
}: FooterProps) {
  const copy = COPY[locale];
  const f = FOOTER_STRINGS[locale];

  const linkBtnClass =
    'group inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 -ml-1 text-left text-sm font-medium text-[var(--muted)] transition-colors duration-150 hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40';

  return (
    <footer className="relative mt-12 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/92 px-6 py-9 pb-24 shadow-[var(--shadow-card)] backdrop-blur-xl transition-colors sm:px-9 sm:py-10 sm:pb-8">
      {/* Subtle Top Emerald-Lime Accent Shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent)]/55 to-[var(--lime)]/80"
      />

      {/* 12-Column Corporate Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        {/* Brand Anchor (5 Columns) */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C8F542] shadow-xs ring-1 ring-[#0F172A]/10"
                aria-hidden="true"
              >
                <svg viewBox="0 0 64 64" fill="none" className="h-7 w-7">
                  <path d="M32 16L12 26L32 36L52 26L32 16Z" fill="#0F172A" />
                  <path
                    d="M20 31V41C20 44.5 25.4 48 32 48C38.6 48 44 44.5 44 41V31L32 37L20 31Z"
                    fill="#0F172A"
                    opacity="0.88"
                  />
                  <path
                    d="M50 28V40"
                    stroke="#047857"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="42" r="2.75" fill="#047857" />
                </svg>
              </span>
              <span className="text-base font-extrabold tracking-tight text-[var(--ink)]">
                EduMatch
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-ink)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                {f.liveAudited}
              </span>
            </div>

            <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {f.brandDesc}
            </p>
          </div>

          <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)]/70 px-3 py-1 text-xs font-medium text-[var(--ink-2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <span>{f.citiesLine}</span>
          </div>
        </div>

        {/* Col 1: Platform (2 Columns) */}
        <div className="lg:col-span-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]">
            {f.colPlatform}
          </h3>
          <ul className="mt-3.5 space-y-2">
            <li>
              <button type="button" onClick={onNavigateSearch} className={linkBtnClass}>
                {copy.nav.search}
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateTest} className={linkBtnClass}>
                {copy.nav.test}
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateLessons} className={linkBtnClass}>
                {copy.nav.lessons}
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenTour} className={linkBtnClass}>
                {f.howItWorks}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 2: Business & Strategy (3 Columns) */}
        <div className="lg:col-span-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]">
            {f.colBusiness}
          </h3>
          <ul className="mt-3.5 space-y-2.5">
            <li>
              <button
                type="button"
                onClick={onNavigateStrategy}
                aria-pressed={activeStrategy}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-left text-xs font-bold transition-all duration-150 ${
                  activeStrategy
                    ? 'border-[var(--ink)] bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]'
                }`}
              >
                <span>{copy.nav.strategy}</span>
                <span
                  aria-hidden="true"
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeStrategy
                      ? 'bg-[var(--lime)] text-[#0F172A]'
                      : 'bg-[var(--surface)] text-[var(--accent-ink)]'
                  }`}
                >
                  {f.badgeLive}
                </span>
                <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateStrategy} className={linkBtnClass}>
                {f.gtmRoadmap}
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateStrategy} className={linkBtnClass}>
                {f.unitEconomics}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onSwitchToTeacher}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[var(--lime)] px-3 py-1 text-left text-xs font-bold text-[#0F172A] shadow-2xs transition-transform duration-150 hover:-translate-y-0.5"
              >
                <span>{f.becomeTutor}</span>
                <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Trust & Legal (2 Columns) */}
        <div className="lg:col-span-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]">
            {f.colLegal}
          </h3>
          <ul className="mt-3.5 space-y-2">
            <li>
              <button type="button" onClick={onOpenPrivacy} className={linkBtnClass}>
                <ShieldCheck
                  size={14}
                  weight="fill"
                  className="shrink-0 text-[var(--accent)]"
                  aria-hidden="true"
                />
                <span>{f.verifiedAudit}</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenPrivacy} className={linkBtnClass}>
                <Lock size={13} className="shrink-0" aria-hidden="true" />
                <span>{copy.nav.privacy}</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={onResetDemo} className={linkBtnClass}>
                <ArrowCounterClockwise size={13} className="shrink-0" aria-hidden="true" />
                <span>{copy.nav.resetDemo}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Single-Line Bottom Utility Strip */}
      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)]/80 pt-5 text-xs text-[var(--muted)] sm:flex-row">
        <span>{f.copyright}</span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)]/70 px-3 py-1 font-semibold text-[var(--accent-ink)]">
          <CheckCircle
            size={14}
            weight="fill"
            className="text-[var(--accent)]"
            aria-hidden="true"
          />
          <span>{f.dimBadge}</span>
        </span>
      </div>
    </footer>
  );
}
