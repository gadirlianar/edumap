'use client';

import React from 'react';
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  CheckCircle,
  GraduationCap,
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
    'flex cursor-pointer items-center gap-1.5 rounded-sm text-left text-sm font-medium text-[var(--muted)] transition-colors duration-150 hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40';

  return (
    <footer className="mt-16 w-full border-t border-[var(--border)] bg-[var(--surface)]/85 pb-24 backdrop-blur-md transition-colors sm:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        {/* 12-Column Corporate Grid (Preply / Linear / Stripe Reference) */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand Anchor (5 Columns) */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--lime)] text-[#0F172A] shadow-xs ring-1 ring-emerald-500/20"
                  aria-hidden="true"
                >
                  <GraduationCap size={17} weight="fill" />
                </span>
                <span className="text-base font-extrabold tracking-tight text-[var(--ink)]">
                  EduMatch
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-ink)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                  {f.liveAudited}
                </span>
              </div>

              <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
                {f.brandDesc}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[var(--ink-2)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--muted)]" aria-hidden="true" />
              <span>{f.citiesLine}</span>
            </div>
          </div>

          {/* Col 1: Platform (2 Columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              {f.colPlatform}
            </h3>
            <ul className="mt-3.5 space-y-2.5">
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              {f.colBusiness}
            </h3>
            <ul className="mt-3.5 space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onNavigateStrategy}
                  aria-pressed={activeStrategy}
                  className={`inline-flex cursor-pointer items-center gap-1.5 text-left text-sm font-semibold transition-colors duration-150 ${
                    activeStrategy
                      ? 'text-[var(--accent-ink)]'
                      : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span>{copy.nav.strategy}</span>
                  <span
                    aria-hidden="true"
                    className="rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]"
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
                  className="inline-flex cursor-pointer items-center gap-1 text-left text-sm font-medium text-[var(--muted)] transition-colors duration-150 hover:text-[var(--ink)]"
                >
                  <span>{f.becomeTutor}</span>
                  <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Legal (2 Columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              {f.colLegal}
            </h3>
            <ul className="mt-3.5 space-y-2.5">
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
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)]/80 pt-5 text-xs text-[var(--muted)] sm:flex-row">
          <span>{f.copyright}</span>

          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--ink-2)]">
            <CheckCircle
              size={14}
              weight="fill"
              className="text-[var(--accent)]"
              aria-hidden="true"
            />
            <span>{f.dimBadge}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
