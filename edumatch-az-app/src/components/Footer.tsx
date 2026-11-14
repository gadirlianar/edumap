'use client';

import React from 'react';
import {
  ArrowCounterClockwise,
  ArrowUpRight,
  DownloadSimple,
  GraduationCap,
  Lock,
  MapPin,
  ShieldCheck,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { SUBJECT_LABELS, COPY } from '@/data/i18n';
import type { Locale, SubjectId } from '@/types/edumatch';
import { PWA_COPY } from '@/lib/pwaCopy';

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
  onInstallApp?: () => void;
}

const FOOTER_LABELS: Record<
  Locale,
  {
    platformCol: string;
    subjectsCol: string;
    trustCol: string;
    howItWorks: string;
    allSubjects: string;
    becomeTutor: string;
    verifiedBadge: string;
    citiesLine: string;
    copyright: string;
    mapLabel: string;
  }
> = {
  ru: {
    platformCol: 'Платформа',
    subjectsCol: 'Предметы',
    trustCol: 'Отбор и города',
    howItWorks: 'Как работает',
    allSubjects: 'Все предметы',
    becomeTutor: 'Я преподаватель',
    verifiedBadge: 'Аудит дипломов и баллов DİM',
    citiesLine: 'Баку · Сумгайыт · Гянджа · Онлайн',
    copyright: '© 2026 EduMatch Azerbaijan',
    mapLabel: 'Карта преподавателей',
  },
  az: {
    platformCol: 'Platforma',
    subjectsCol: 'Fənlər',
    trustCol: 'Seçim və şəhərlər',
    howItWorks: 'Necə işləyir',
    allSubjects: 'Bütün fənlər',
    becomeTutor: 'Mən müəlliməm',
    verifiedBadge: 'Diplom və DİM balı auditi',
    citiesLine: 'Bakı · Sumqayıt · Gəncə · Onlayn',
    copyright: '© 2026 EduMatch Azerbaijan',
    mapLabel: 'Müəllim xəritəsi',
  },
  en: {
    platformCol: 'Platform',
    subjectsCol: 'Subjects',
    trustCol: 'Trust & Cities',
    howItWorks: 'How it works',
    allSubjects: 'All subjects',
    becomeTutor: 'For tutors',
    verifiedBadge: 'Diplomas & DİM scores verified',
    citiesLine: 'Baku · Sumgayit · Ganja · Online',
    copyright: '© 2026 EduMatch Azerbaijan',
    mapLabel: 'Tutor map',
  },
};

const QUICK_SUBJECTS: SubjectId[] = [
  'Математика',
  'Физика',
  'Химия',
  'Английский язык',
  'Информатика',
];

export function Footer({
  locale,
  onNavigateSearch,
  onNavigateTest,
  onNavigateLessons,
  onSelectSubject,
  onOpenTour,
  onSwitchToTeacher,
  onOpenPrivacy,
  onResetDemo,
  onInstallApp,
}: FooterProps) {
  const copy = COPY[locale];
  const f = FOOTER_LABELS[locale];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group/footer relative mt-16 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/95 px-6 py-8 shadow-[var(--shadow-card)] transition-colors duration-200 hover:border-[var(--border-strong)] sm:px-9 sm:py-10"
    >
      {/* Subtle Ambient Top Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-60 transition-opacity duration-300 group-hover/footer:opacity-100"
      />

      <div className="grid gap-8 md:grid-cols-12">
        {/* Brand & Mission */}
        <div className="space-y-3 md:col-span-4">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime)] text-[#0F172A] shadow-xs transition-transform duration-200 group-hover/footer:scale-105"
              aria-hidden="true"
            >
              <GraduationCap size={17} weight="fill" />
            </span>
            <div>
              <div className="text-sm font-bold tracking-tight text-[var(--ink)]">
                EduMatch
              </div>
              <div className="text-[11px] text-[var(--muted)]">
                {copy.brandTagline}
              </div>
            </div>
          </div>

          <p className="max-w-sm text-xs leading-relaxed text-[var(--ink-2)]">
            {copy.nav.footerLead}
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 text-[11px] font-medium text-[var(--ink-2)] transition-colors duration-150 hover:border-[var(--accent-border)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden="true" />
            <MapPin size={12} weight="fill" className="text-[var(--accent-ink)]" aria-hidden="true" />
            <span>{f.citiesLine}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-2.5 md:col-span-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {f.platformCol}
          </div>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button
                type="button"
                onClick={onNavigateSearch}
                className="group/link inline-flex cursor-pointer items-center gap-1 rounded-lg py-0.5 font-medium text-[var(--ink-2)] transition-all duration-150 hover:translate-x-0.5 hover:text-[var(--ink)]"
              >
                <span>{copy.nav.search}</span>
                <ArrowUpRight size={11} className="opacity-0 transition-opacity duration-150 group-hover/link:opacity-100" aria-hidden="true" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateTest}
                className="group/link inline-flex cursor-pointer items-center gap-1 rounded-lg py-0.5 font-medium text-[var(--ink-2)] transition-all duration-150 hover:translate-x-0.5 hover:text-[var(--ink)]"
              >
                <span>{copy.nav.test}</span>
                <ArrowUpRight size={11} className="opacity-0 transition-opacity duration-150 group-hover/link:opacity-100" aria-hidden="true" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNavigateLessons}
                className="group/link inline-flex cursor-pointer items-center gap-1 rounded-lg py-0.5 font-medium text-[var(--ink-2)] transition-all duration-150 hover:translate-x-0.5 hover:text-[var(--ink)]"
              >
                <span>{copy.nav.lessons}</span>
                <ArrowUpRight size={11} className="opacity-0 transition-opacity duration-150 group-hover/link:opacity-100" aria-hidden="true" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenTour}
                className="group/link inline-flex cursor-pointer items-center gap-1 rounded-lg py-0.5 font-medium text-[var(--ink-2)] transition-all duration-150 hover:translate-x-0.5 hover:text-[var(--ink)]"
              >
                <span>{f.howItWorks}</span>
                <ArrowUpRight size={11} className="opacity-0 transition-opacity duration-150 group-hover/link:opacity-100" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>

        {/* Subjects */}
        <div className="space-y-2.5 md:col-span-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {f.subjectsCol}
          </div>
          <ul className="grid grid-cols-2 gap-1.5 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectSubject('')}
                className="cursor-pointer rounded-full px-2 py-0.5 font-medium text-[var(--ink-2)] transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]"
              >
                {f.allSubjects}
              </button>
            </li>
            {QUICK_SUBJECTS.map((subj) => (
              <li key={subj}>
                <button
                  type="button"
                  onClick={() => onSelectSubject(subj)}
                  className="max-w-full cursor-pointer truncate rounded-full px-2 py-0.5 font-medium text-[var(--ink-2)] transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]"
                >
                  {SUBJECT_LABELS[subj][locale]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust & Teacher CTA */}
        <div className="space-y-2.5 md:col-span-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {f.trustCol}
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-1.5 text-[var(--ink-2)]">
              <ShieldCheck
                size={15}
                weight="fill"
                className="mt-0.5 shrink-0 text-[var(--accent)]"
                aria-hidden="true"
              />
              <span>{f.verifiedBadge}</span>
            </div>
            <button
              type="button"
              onClick={onSwitchToTeacher}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)] active:scale-[0.98]"
            >
              <span>{f.becomeTutor}</span>
              <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)]">
        <span>{f.copyright}</span>

        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
          {onInstallApp ? (
            <button
              type="button"
              onClick={onInstallApp}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 font-semibold text-[var(--accent-ink)] transition-colors duration-150 hover:brightness-95"
            >
              <DownloadSimple size={13} weight="bold" aria-hidden="true" />
              <span>{PWA_COPY[locale].pwa.installBtn}</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-semibold text-[var(--ink-2)] transition-colors duration-150 hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]"
          >
            <Lock size={13} weight="fill" aria-hidden="true" />
            <span>{copy.nav.privacy}</span>
          </button>

          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 font-semibold text-[var(--ink-2)] transition-colors duration-150 hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]"
          >
            <ArrowCounterClockwise size={13} weight="bold" aria-hidden="true" />
            <span>{copy.nav.resetDemo}</span>
          </button>
        </div>
      </div>
    </motion.footer>
  );
}
