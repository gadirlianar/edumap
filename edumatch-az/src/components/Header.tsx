'use client';

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  ChalkboardTeacher,
  Compass,
  GraduationCap,
  MagnifyingGlass,
  Moon,
  Sparkle,
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
  // Strategy is intentionally moved to the Footer Dock so the primary header stays sleek and never wraps
  const studentTabs: {
    id: StudentTab;
    label: string;
    icon: React.ComponentType<{ size?: number; weight?: 'regular' | 'bold' | 'fill' }>;
  }[] = [
    { id: 'search', label: copy.nav.search, icon: MagnifyingGlass },
    { id: 'test', label: copy.nav.test, icon: Sparkle },
    { id: 'lessons', label: copy.nav.lessons, icon: BookOpenText },
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
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/80 bg-[var(--glass)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        {/* Solaris Neon-Lime & Electric Brand Mark */}
        <button
          type="button"
          onClick={() =>
            role === 'student'
              ? onStudentTabChange('search')
              : onTeacherTabChange('inbox')
          }
          className="group flex shrink-0 cursor-pointer items-center gap-2 text-left"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#C8F542] via-[#86EFAC] to-[#34D399] text-[#0F172A] shadow-xs ring-1 ring-emerald-500/25 transition-transform duration-200 group-hover:scale-105 sm:h-9 sm:w-9"
            aria-hidden="true"
          >
            <GraduationCap size={18} weight="fill" />
          </span>
          <span className="whitespace-nowrap text-[14px] font-extrabold tracking-tight text-[var(--ink)] sm:text-[16px]">
            EduMatch
          </span>
        </button>

        {/* Sleek Single-Line Center Navigation (Never wraps onto 2 lines) */}
        <nav
          aria-label="Primary sections"
          className="hidden items-center gap-1 rounded-full border border-[var(--border)]/85 bg-[var(--surface)]/80 p-1 shadow-2xs backdrop-blur-md sm:flex"
        >
          {role === 'student'
            ? studentTabs.map((t) => {
                const active = studentTab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onStudentTabChange(t.id)}
                    className={`relative inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors lg:px-4 lg:text-[13px] ${
                      active
                        ? 'text-[var(--primary-btn-ink)]'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="header-nav-pill-student"
                        transition={SPRING_PILL}
                        className="absolute inset-0 rounded-full bg-[var(--primary-btn)] shadow-xs"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <Icon
                        size={13}
                        weight={active ? 'fill' : 'bold'}
                      />
                      <span>{t.label}</span>
                      {active ? (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })
            : teacherTabs.map((t) => {
                const active = teacherTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => onTeacherTabChange(t.id)}
                    className={`relative inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors lg:px-3.5 lg:text-[13px] ${
                      active
                        ? 'text-[var(--primary-btn-ink)]'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="header-nav-pill-teacher"
                        transition={SPRING_PILL}
                        className="absolute inset-0 rounded-full bg-[var(--primary-btn)] shadow-xs"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}

          {/* If Strategy is active (opened from Footer), show a 1-click Back pill */}
          {role === 'student' && studentTab === 'strategy' ? (
            <button
              type="button"
              onClick={() => onStudentTabChange('search')}
              className="inline-flex min-h-[32px] cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition-colors hover:bg-indigo-500"
            >
              <ArrowLeft size={12} weight="bold" aria-hidden="true" />
              <span>{copy.nav.strategy}</span>
            </button>
          ) : null}
        </nav>

        {/* Right Utilities & Non-Clipping Sign-In CTA */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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
                  className={`relative min-h-[26px] cursor-pointer rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase transition-colors sm:min-h-[28px] sm:px-2 sm:text-[11px] ${
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
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--ink)] shadow-2xs transition-colors hover:border-[var(--border-strong)] sm:h-8 sm:w-8"
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
            className="hidden h-8 shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 text-xs font-semibold text-[var(--ink)] shadow-2xs transition-colors hover:border-[var(--border-strong)] xl:inline-flex"
          >
            <Compass size={14} weight="bold" aria-hidden="true" />
            <span>{copy.nav.tour}</span>
          </button>

          {/* Role Toggle */}
          <div
            className="flex shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-0.5 shadow-2xs"
            role="group"
            aria-label="Role switch"
          >
            <button
              type="button"
              onClick={() => onRoleChange('student')}
              aria-pressed={role === 'student'}
              className={`relative flex min-h-[26px] cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-semibold transition-colors sm:min-h-[28px] sm:px-2.5 ${
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
                <span className="hidden lg:inline">{copy.nav.student}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('teacher')}
              aria-pressed={role === 'teacher'}
              className={`relative flex min-h-[26px] cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-semibold transition-colors sm:min-h-[28px] sm:px-2.5 ${
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
                <span className="hidden lg:inline">{copy.nav.teacher}</span>
              </span>
            </button>
          </div>

          {/* Solaris Pill Account Button (Never Clips) */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="group inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--primary-btn)] py-1 pl-2.5 pr-1 text-[11px] font-semibold text-[var(--primary-btn-ink)] shadow-xs transition-colors hover:bg-[var(--primary-btn-hover)] sm:h-9 sm:gap-2 sm:pl-3.5 sm:pr-1.5 sm:text-xs"
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
