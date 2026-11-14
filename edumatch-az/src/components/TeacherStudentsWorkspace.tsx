'use client';

import React, { useState } from 'react';
import { Lock, PaperPlaneTilt, UsersThree } from '@phosphor-icons/react';
import { GRADES, LEVELS } from '@/data/catalog';
import {
  COPY,
  GRADE_LABELS,
  LEVEL_LABELS,
  SUBJECT_LABELS,
  sectorLabel,
} from '@/data/i18n';
import { resolveLocalized, resolvePersonName } from '@/data/tutors';
import { Avatar } from '@/components/ui/Avatar';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import type {
  DirectoryFilters,
  Locale,
  SectorCode,
  StudentDirectoryItem,
  StudentState,
} from '@/types/edumatch';

interface TeacherStudentsWorkspaceProps {
  locale: Locale;
  students: StudentDirectoryItem[];
  currentStudent: StudentState;
  currentUserName: string;
  isPremium: boolean;
  onInviteStudent: (name: string) => void;
  onOpenPremium: () => void;
}

export function TeacherStudentsWorkspace({
  locale,
  students,
  currentStudent,
  currentUserName,
  isPremium,
  onInviteStudent,
  onOpenPremium,
}: TeacherStudentsWorkspaceProps) {
  const copy = COPY[locale];
  const [filters, setFilters] = useState<DirectoryFilters>({
    cat: '',
    lv: '',
    sec: '',
  });

  const combinedStudents: StudentDirectoryItem[] = [...students];
  if (currentStudent.test) {
    combinedStudents.push({
      id: 'you',
      name: currentUserName || copy.teacher.youDemoStudent,
      cat: currentStudent.cat,
      subj: currentStudent.test.subj,
      level: currentStudent.test.level,
      goal: '—',
      sec: currentStudent.sec,
    });
  }

  const filtered = combinedStudents.filter(
    (s) =>
      (!filters.cat || s.cat === filters.cat) &&
      (!filters.lv || s.level === filters.lv) &&
      (!filters.sec || s.sec === filters.sec),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="em-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-extrabold text-[var(--accent)]">
            <UsersThree size={14} weight="fill" aria-hidden="true" />
            <span>{copy.nav.students}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {copy.teacher.studentsBannerTitle}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy.teacher.studentsBannerSub}</p>
        </div>
        <AcademicEmblem iconKey="students" size="xl" />
      </div>

      {!isPremium ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-bold text-[var(--accent-ink)]">
          <span>{copy.teacher.studentsPremWarn}</span>
          <button
            type="button"
            onClick={onOpenPremium}
            className="cursor-pointer rounded-full bg-[var(--ink)] px-3.5 py-1.5 text-xs font-extrabold text-[var(--bg)]"
          >
            {copy.teacher.learnMore}
          </button>
        </div>
      ) : null}

      {/* Instant 1-Click Pill Filters */}
      <div className="em-card flex flex-wrap items-center gap-x-5 gap-y-2.5 rounded-[28px] p-4 sm:p-5">
        {/* Sector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {copy.teacher.sector}
          </span>
          <div
            role="group"
            aria-label={copy.teacher.sector}
            className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
          >
            <button
              type="button"
              aria-pressed={filters.sec === ''}
              onClick={() => setFilters((p) => ({ ...p, sec: '' }))}
              className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                filters.sec === ''
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {copy.search.any}
            </button>
            {(['az', 'ru', 'en'] as SectorCode[]).map((sec) => {
              const active = filters.sec === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilters((p) => ({ ...p, sec: active ? '' : sec }))}
                  className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {sec.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {copy.search.grade}
          </span>
          <div
            role="group"
            aria-label={copy.search.grade}
            className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
          >
            <button
              type="button"
              aria-pressed={filters.cat === ''}
              onClick={() => setFilters((p) => ({ ...p, cat: '' }))}
              className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                filters.cat === ''
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {copy.search.any}
            </button>
            {GRADES.map((g) => {
              const active = filters.cat === g;
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilters((p) => ({ ...p, cat: active ? '' : g }))}
                  className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {GRADE_LABELS[g][locale]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {copy.teacher.level}
            {!isPremium ? <Lock size={11} aria-hidden="true" /> : null}
          </span>
          <div
            role="group"
            aria-label={copy.teacher.level}
            className={`inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1 ${
              !isPremium ? 'opacity-55' : ''
            }`}
          >
            <button
              type="button"
              disabled={!isPremium}
              aria-pressed={filters.lv === ''}
              onClick={() => setFilters((p) => ({ ...p, lv: '' }))}
              className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 disabled:cursor-not-allowed ${
                filters.lv === ''
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {copy.search.any}
            </button>
            {LEVELS.map((l) => {
              const active = filters.lv === l;
              return (
                <button
                  key={l}
                  type="button"
                  disabled={!isPremium}
                  aria-pressed={active}
                  onClick={() => setFilters((p) => ({ ...p, lv: active ? '' : l }))}
                  className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 disabled:cursor-not-allowed ${
                    active
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {LEVEL_LABELS[l][locale]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        {filtered.map((s, idx) => {
          const studentName = resolvePersonName(s.name, locale);
          return (
          <div key={s.id} className="em-spotlight-card rounded-[28px] p-5">
            <div className="flex items-center gap-3">
              <Avatar name={studentName} index={idx + 2} size="md" />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold">{studentName}</h3>
                <p className="text-xs font-semibold text-[var(--muted)]">
                  {copy.teacher.goal} {resolveLocalized(s.goal, locale)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
                {sectorLabel(s.sec, locale)}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
                {GRADE_LABELS[s.cat][locale]}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
                {SUBJECT_LABELS[s.subj][locale]}
              </span>
              {isPremium ? (
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-2)]">
                  {copy.teacher.levelPrefix}{' '}
                  {s.level ? LEVEL_LABELS[s.level][locale] : copy.teacher.notTested}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenPremium}
                  className="em-lock-pattern inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold text-[var(--ink)]"
                >
                  <Lock size={11} weight="bold" aria-hidden="true" />
                  {copy.teacher.levelLocked}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => (isPremium ? onInviteStudent(studentName) : onOpenPremium())}
              className={`mt-4 inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                isPremium
                  ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] hover:bg-[var(--primary-btn-hover)]'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--primary)]'
              }`}
            >
              {isPremium ? (
                <PaperPlaneTilt size={14} weight="bold" aria-hidden="true" />
              ) : (
                <Lock size={14} weight="bold" aria-hidden="true" />
              )}
              <span>
                {isPremium ? copy.teacher.inviteBtn : copy.teacher.inviteLockedBtn}
              </span>
            </button>
          </div>
        );
        })}
      </div>
    </div>
  );
}
