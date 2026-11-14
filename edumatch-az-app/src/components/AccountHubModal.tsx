'use client';

import React from 'react';
import {
  ArrowCounterClockwise,
  Bell,
  ChalkboardTeacher,
  CheckCircle,
  DeviceMobile,
  DownloadSimple,
  SignOut,
  Student,
  UserSwitch,
} from '@phosphor-icons/react';
import { RANK_TIERS } from '@/data/catalog';
import { resolvePersonName } from '@/lib/localizeData';
import { getRankIndex } from '@/lib/matching';
import { PWA_COPY } from '@/lib/pwaCopy';
import type {
  AccountProfile,
  Locale,
  Role,
  StudentState,
  TutorProfile,
} from '@/types/edumatch';
import { Avatar } from './ui/Avatar';
import { ModalShell } from './ui/ModalShell';

interface PersonaOption {
  name: string;
  email: string;
  role: Role;
  badge: string;
  tutorId?: string;
}

interface AccountHubModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  role: Role;
  account: AccountProfile;
  student: StudentState;
  tutors: TutorProfile[];
  lessonsCount: number;
  savedCount: number;
  isInstalled: boolean;
  alertsEnabled: boolean;
  onSwitchRole: (next: Role) => void;
  onSelectPersona: (persona: {
    name: string;
    email: string;
    role: Role;
    tutorId?: string;
  }) => void;
  onToggleAlerts: () => void;
  onTriggerInstall: () => void;
  onSignOut: () => void;
  onResetDemo: () => void;
}

export function AccountHubModal({
  open,
  onClose,
  locale,
  role,
  account,
  student,
  tutors,
  lessonsCount,
  savedCount,
  isInstalled,
  alertsEnabled,
  onSwitchRole,
  onSelectPersona,
  onToggleAlerts,
  onTriggerInstall,
  onSignOut,
  onResetDemo,
}: AccountHubModalProps) {
  const c = PWA_COPY[locale].accountHub;
  const closeLabel = locale === 'az' ? 'Bağla' : locale === 'en' ? 'Close' : 'Закрыть';

  const currentRank = RANK_TIERS[getRankIndex(student.xp)] ?? RANK_TIERS[0];

  const orderedTeacherTutors = [
    ...tutors.filter((t) => t.id === 'me'),
    ...tutors.filter((t) => t.id !== 'me'),
  ].slice(0, 2);

  const personas: PersonaOption[] = [
    {
      name: resolvePersonName('Айсель М.', locale),
      email: 'aysel@edumatch.az',
      role: 'student',
      badge: c.studentRole,
    },
    ...orderedTeacherTutors.map((tutor) => ({
      name: resolvePersonName(tutor.name, locale),
      email: `${tutor.id}@edumatch.az`,
      role: 'teacher' as const,
      badge: tutor.education.universityShort,
      tutorId: tutor.id,
    })),
  ];

  const resolvedDisplayName = resolvePersonName(account.name || 'Айсель М.', locale);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={c.title}
      subtitle={c.subtitle}
      maxWidthClass="max-w-xl"
      closeLabel={closeLabel}
    >
      <div className="space-y-5">
        {/* Profile Summary Card */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={resolvedDisplayName} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-[var(--ink)]">
                  {resolvedDisplayName}
                </p>
                <p className="truncate text-xs text-[var(--muted)]">{account.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8F542] px-3 py-1 text-xs font-bold text-[#0F172A]">
              {role === 'student' ? c.studentRole : c.teacherRole}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center">
              <p className="font-mono text-base font-bold text-[var(--ink)]">{lessonsCount}</p>
              <p className="text-[11px] font-medium text-[var(--muted)]">{c.statsLessons}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center">
              <p className="font-mono text-base font-bold text-[var(--ink)]">{savedCount}</p>
              <p className="text-[11px] font-medium text-[var(--muted)]">{c.statsSaved}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center">
              <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                {student.xp} XP
              </p>
              <p className="truncate text-[11px] font-medium text-[var(--muted)]">
                {currentRank.title[locale]}
              </p>
            </div>
          </div>
        </div>

        {/* Instant Role Switch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {c.activeRole}
            </p>
            <span className="text-[11px] text-[var(--muted)]">{c.switchRoleHint}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSwitchRole('student')}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                role === 'student'
                  ? 'border-transparent bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--border-strong)]'
              }`}
            >
              <Student size={18} weight="duotone" aria-hidden="true" />
              <span>{c.studentRole}</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('teacher')}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                role === 'teacher'
                  ? 'border-transparent bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--border-strong)]'
              }`}
            >
              <ChalkboardTeacher size={18} weight="duotone" aria-hidden="true" />
              <span>{c.teacherRole}</span>
            </button>
          </div>
        </div>

        {/* Quick Persona Switch */}
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <UserSwitch size={14} weight="bold" aria-hidden="true" />
            {c.personasTitle}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {personas.map((persona) => (
              <button
                key={persona.email}
                type="button"
                onClick={() =>
                  onSelectPersona({
                    name: persona.name,
                    email: persona.email,
                    role: persona.role,
                    tutorId: persona.tutorId,
                  })
                }
                className="flex cursor-pointer flex-col items-start rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-left transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]"
              >
                <span className="max-w-full truncate text-xs font-bold text-[var(--ink)]">
                  {persona.name}
                </span>
                <span className="mt-1 rounded-full bg-[var(--surface-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                  {persona.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preferences & PWA App Install */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Bell size={18} weight="duotone" className="shrink-0 text-emerald-500" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--ink)]">{c.alertsLabel}</p>
                <p className="text-[11px] text-[var(--muted)]">{c.alertsDesc}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={alertsEnabled}
              aria-label={c.alertsLabel}
              onClick={onToggleAlerts}
              className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${
                alertsEnabled ? 'bg-emerald-500' : 'bg-[var(--border-strong)]'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition ${
                  alertsEnabled ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <DeviceMobile size={18} weight="duotone" className="shrink-0 text-[var(--ink)]" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--ink)]">{c.appStatusTitle}</p>
                <p className="text-[11px] text-[var(--muted)]">{c.appReadyLabel}</p>
              </div>
            </div>
            {isInstalled ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                <CheckCircle size={14} weight="fill" aria-hidden="true" />
                {PWA_COPY[locale].pwa.installedLabel}
              </span>
            ) : (
              <button
                type="button"
                onClick={onTriggerInstall}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#C8F542] px-3.5 py-1.5 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
              >
                <DownloadSimple size={14} weight="bold" aria-hidden="true" />
                {c.installCta}
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
          >
            <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />
            {c.resetDemo}
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/15 dark:text-rose-300"
          >
            <SignOut size={14} weight="bold" aria-hidden="true" />
            {c.signOut}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
