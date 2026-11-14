'use client';

import React from 'react';
import {
  ArrowRight,
  Bell,
  ChalkboardTeacher,
  Compass,
  GraduationCap,
  Moon,
  Student,
  Sun,
  UserCircle,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { LiquidTabBar } from '@/components/ui/LiquidTabBar';
import { resolvePersonName } from '@/lib/localizeData';
import { PWA_COPY } from '@/lib/pwaCopy';
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
  onOpenAccountHub?: () => void;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
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
  onOpenAccountHub,
  unreadNotifications = 0,
  onOpenNotifications,
  onOpenTour,
  copy,
}: HeaderProps) {
  const studentTabs: { id: StudentTab; label: string }[] = [
    { id: 'search', label: copy.nav.search },
    { id: 'test', label: copy.nav.test },
    { id: 'lessons', label: copy.nav.lessons },
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
    <header className="em-liquid-header sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-1.5 px-2.5 sm:h-16 sm:gap-3 sm:px-6">
        {/* Solaris Neon-Lime Brand Mark */}
        <button
          type="button"
          aria-label="EduMatch"
          onClick={() =>
            role === 'student'
              ? onStudentTabChange('search')
              : onTeacherTabChange('inbox')
          }
          className="group flex shrink-0 cursor-pointer items-center gap-2 text-left sm:gap-2.5"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime)] text-[#0F172A] shadow-2xs transition-transform duration-200 group-hover:scale-105 sm:h-9 sm:w-9"
            aria-hidden="true"
          >
            <GraduationCap size={19} weight="fill" />
          </span>
          <span className="hidden text-[16px] font-bold tracking-tight text-[var(--ink)] min-[440px]:inline">
            EduMatch
          </span>
        </button>

        {/* Interactive iOS Liquid Glass Segmented Navigation */}
        <LiquidTabBar
          items={role === 'student' ? studentTabs : teacherTabs}
          activeId={role === 'student' ? studentTab : teacherTab}
          onChange={(id) =>
            role === 'student'
              ? onStudentTabChange(id as StudentTab)
              : onTeacherTabChange(id as TeacherTab)
          }
          ariaLabel="Primary sections"
          layoutId={`header-liquid-lens-${role}`}
          variant="header"
          className="hidden sm:flex"
        />

        {/* Clean Frosted Utilities & Solaris CTA */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <div
            className="em-liquid-pill flex items-center rounded-full p-0.5"
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
                  className={`relative min-h-[28px] cursor-pointer rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase transition-colors sm:px-2.5 sm:text-[11px] ${active
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
            className="em-liquid-pill flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[var(--ink)] transition-transform hover:scale-105 sm:h-8 sm:w-8"
          >
            {isDark ? (
              <Sun size={14} weight="bold" aria-hidden="true" />
            ) : (
              <Moon size={14} weight="bold" aria-hidden="true" />
            )}
          </button>

          {/* Notification Center Bell */}
          {onOpenNotifications ? (
            <button
              type="button"
              onClick={onOpenNotifications}
              aria-label={`${PWA_COPY[locale].notifications.bellLabel}${unreadNotifications > 0 ? ` (${unreadNotifications})` : ''}`}
              className="em-liquid-pill relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[var(--ink)] transition-transform hover:scale-105 sm:h-8 sm:w-8"
            >
              <Bell size={14} weight="bold" aria-hidden="true" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#C8F542] px-1 font-mono text-[9px] font-bold leading-none text-[#0F172A] shadow-xs ring-2 ring-[var(--surface)]">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          ) : null}

          {/* Guided Tour */}
          <button
            type="button"
            onClick={onOpenTour}
            className="em-liquid-pill hidden h-8 cursor-pointer items-center gap-1 rounded-full px-3 text-xs font-semibold text-[var(--ink)] transition-transform hover:scale-[1.02] xl:inline-flex"
          >
            <Compass size={14} weight="bold" aria-hidden="true" />
            <span>{copy.nav.tour}</span>
          </button>

          {/* Role Toggle */}
          <div
            className="em-liquid-pill flex items-center rounded-full p-0.5"
            role="group"
            aria-label="Role switch"
          >
            <button
              type="button"
              onClick={() => onRoleChange('student')}
              aria-label={copy.nav.student}
              aria-pressed={role === 'student'}
              className={`relative flex min-h-[28px] cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold transition-colors sm:px-2.5 ${role === 'student'
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
              aria-label={copy.nav.teacher}
              aria-pressed={role === 'teacher'}
              className={`relative flex min-h-[28px] cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold transition-colors sm:px-2.5 ${role === 'teacher'
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
            onClick={authenticated && displayName && onOpenAccountHub ? onOpenAccountHub : onOpenAuth}
            className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] py-1 pl-2.5 pr-1 text-[11px] font-semibold text-[var(--primary-btn-ink)] shadow-xs transition-colors hover:bg-[var(--primary-btn-hover)] sm:h-9 sm:gap-2 sm:pl-3.5 sm:pr-1.5 sm:text-xs"
          >
            {authenticated && displayName ? (
              <>
                <UserCircle size={15} weight="bold" aria-hidden="true" />
                <span className="max-w-[68px] truncate pr-1 sm:max-w-[96px] sm:pr-1.5">{displayName}</span>
              </>
            ) : (
              <>
                <span className="whitespace-nowrap">{copy.nav.signIn}</span>
                <span
                  aria-hidden="true"
                  className="grid h-5 w-5 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5 sm:h-6 sm:w-6"
                >
                  <ArrowRight size={12} weight="bold" />
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
