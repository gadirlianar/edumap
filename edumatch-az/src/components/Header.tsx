'use client';

import React from 'react';
import {
  ArrowRight,
  ChalkboardTeacher,
  Compass,
  GraduationCap,
  Moon,
  Student,
  Sun,
  UserCircle,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { resolvePersonName } from '@/lib/localizeData';
import type { CopyBundle } from '@/data/i18n';
import type { Locale, Role, StudentTab, TeacherTab } from '@/types/edumatch';

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (next: Locale) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  role: Role;
  onRoleChange: (next: Role) => void;
  studentTab: StudentTab;
  onStudentTabChange: (tab: StudentTab) => void;
  teacherTab: TeacherTab;
  onTeacherTabChange: (tab: TeacherTab) => void;
  authenticated: boolean;
  userName: string;
  onOpenAuth: () => void;
  onOpenTour: () => void;
  copy: CopyBundle;
}

const SPRING_PILL = {
  type: 'spring',
  stiffness: 440,
  damping: 34,
} as const;

export function Header({
  locale,
  onLocaleChange,
  isDark,
  onToggleTheme,
  role,
  onRoleChange,
  studentTab,
  onStudentTabChange,
  teacherTab,
  onTeacherTabChange,
  authenticated,
  userName,
  onOpenAuth,
  onOpenTour,
  copy,
}: HeaderProps) {
  const studentTabs: { id: StudentTab; label: string }[] = [
    { id: 'search', label: copy.nav.search },
    { id: 'test', label: copy.nav.test },
    { id: 'lessons', label: copy.nav.lessons },
    { id: 'strategy', label: copy.nav.strategy },
  ];

  const teacherTabs: { id: TeacherTab; label: string }[] = [
    { id: 'inbox', label: copy.nav.inbox },
    { id: 'students', label: copy.nav.students },
    { id: 'profile', label: copy.nav.profile },
    { id: 'studio', label: copy.nav.studio },
    { id: 'premium', label: copy.nav.premium },
  ];

  const displayName = userName ? resolvePersonName(userName, locale) : '';

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--glass)] backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-1.5 px-3 sm:h-16 sm:gap-3 sm:px-6">
        {/* Solaris Neon-Lime Brand Mark */}
        <button
          type="button"
          onClick={() =>
            role === 'student'
              ? onStudentTabChange('search')
              : onTeacherTabChange('inbox')
          }
          className="group flex shrink-0 cursor-pointer items-center gap-1.5 text-left sm:gap-2.5"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime)] text-[#0F172A] shadow-2xs transition-transform duration-200 group-hover:scale-105 sm:h-9 sm:w-9"
            aria-hidden="true"
          >
            <GraduationCap size={18} weight="fill" />
          </span>
          <span className="text-[14px] font-bold tracking-tight text-[var(--ink)] sm:text-[16px]">
            EduMatch
          </span>
        </button>

        {/* Clean Borderless Center Navigation with Active Dot */}
        <nav
          aria-label="Primary sections"
          className="hidden items-center gap-6 sm:flex"
        >
          {(role === 'student' ? studentTabs : teacherTabs).map((t) => {
            const active =
              role === 'student' ? studentTab === t.id : teacherTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() =>
                  role === 'student'
                    ? onStudentTabChange(t.id as StudentTab)
                    : onTeacherTabChange(t.id as TeacherTab)
                }
                className={`relative inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 text-[13px] transition-colors ${
                  active
                    ? 'font-semibold text-[var(--ink)]'
                    : 'font-medium text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span>{t.label}</span>
                {active ? (
                  <motion.span
                    layoutId={`header-nav-dot-${role}`}
                    transition={SPRING_PILL}
                    className="h-2 w-2 rounded-full bg-[var(--lime)] ring-1 ring-[var(--accent)]"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Clean Frosted Utilities & Solaris CTA */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <div
            className="flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-0.5 shadow-2xs"
            role="group"
            aria-label={copy.nav.langToggle}
          >
            {(['ru', 'az', 'en'] as const).map((l) => {
              const active = locale === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => onLocaleChange(l)}
                  aria-pressed={active}
                  className={`relative min-h-[26px] cursor-pointer rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase transition-colors sm:min-h-[28px] sm:px-2.5 sm:text-[11px] ${
                    active
                      ? 'text-[var(--primary-btn-ink)]'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="header-locale-pill"
                      transition={SPRING_PILL}
                      className="absolute inset-0 rounded-full bg-[var(--primary-btn)]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10">{l}</span>
                </button>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={copy.nav.themeToggle}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--ink)] shadow-2xs transition-colors hover:border-[var(--border-strong)] sm:h-8 sm:w-8"
          >
            {isDark ? (
              <Sun size={14} weight="bold" aria-hidden="true" />
            ) : (
              <Moon size={14} weight="bold" aria-hidden="true" />
            )}
          </button>

          {/* Guided Tour */}
          <button
            type="button"
            onClick={onOpenTour}
            className="hidden h-8 cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 text-xs font-semibold text-[var(--ink)] shadow-2xs transition-colors hover:border-[var(--border-strong)] xl:inline-flex"
          >
            <Compass size={14} weight="bold" aria-hidden="true" />
            <span>{copy.nav.tour}</span>
          </button>

          {/* Role Toggle */}
          <div
            className="flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-0.5 shadow-2xs"
            role="group"
            aria-label="Role switch"
          >
            <button
              type="button"
              onClick={() => onRoleChange('student')}
              aria-pressed={role === 'student'}
              className={`relative flex min-h-[26px] cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold transition-colors sm:min-h-[28px] sm:px-2.5 ${
                role === 'student'
                  ? 'text-[var(--primary-btn-ink)]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {role === 'student' ? (
                <motion.span
                  layoutId="header-role-pill"
                  transition={SPRING_PILL}
                  className="absolute inset-0 rounded-full bg-[var(--primary-btn)]"
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-1">
                <Student size={13} weight="bold" aria-hidden="true" />
                <span className="hidden md:inline">{copy.nav.student}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('teacher')}
              aria-pressed={role === 'teacher'}
              className={`relative flex min-h-[26px] cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold transition-colors sm:min-h-[28px] sm:px-2.5 ${
                role === 'teacher'
                  ? 'text-[var(--primary-btn-ink)]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {role === 'teacher' ? (
                <motion.span
                  layoutId="header-role-pill"
                  transition={SPRING_PILL}
                  className="absolute inset-0 rounded-full bg-[var(--primary-btn)]"
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-1">
                <ChalkboardTeacher size={13} weight="bold" aria-hidden="true" />
                <span className="hidden md:inline">{copy.nav.teacher}</span>
              </span>
            </button>
          </div>

          {/* Solaris Pill Account Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] py-1 pl-2.5 pr-1 text-[11px] font-semibold text-[var(--primary-btn-ink)] shadow-xs transition-colors hover:bg-[var(--primary-btn-hover)] sm:h-9 sm:gap-2 sm:pl-3.5 sm:pr-1.5 sm:text-xs"
          >
            {authenticated && displayName ? (
              <>
                <UserCircle size={15} weight="bold" aria-hidden="true" />
                <span className="max-w-[76px] truncate pr-1.5 sm:max-w-[96px]">
                  {displayName}
                </span>
              </>
            ) : (
              <>
                <span>{copy.nav.signIn}</span>
                <span
                  aria-hidden="true"
                  className="grid h-5 w-5 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5 sm:h-6 sm:w-6"
                >
                  <ArrowRight size={11} weight="bold" />
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
