'use client';

import React, { useState } from 'react';
import { Lock, PaperPlaneTilt, SlidersHorizontal, UsersThree } from '@phosphor-icons/react';
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
  const [studentFiltersOpen, setStudentFiltersOpen] = useState(false);
  const extraFilterCount = (filters.cat ? 1 : 0) + (filters.lv ? 1 : 0);

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
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="px-1 pt-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-extrabold text-[var(--accent)]">
          <UsersThree size={14} weight="fill" aria-hidden="true" />
          <span>{copy.nav.students}</span>
        </div>
        <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {copy.teacher.studentsBannerTitle}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">{copy.teacher.studentsBannerSub}</p>
      </header>

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

      {/* Compact Sector Bar + Collapsible Grade & Level Drawer */}
      <div className="em-card space-y-3 rounded-[28px] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
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

          <button
            type="button"
            aria-expanded={studentFiltersOpen}
            onClick={() => setStudentFiltersOpen((v) => !v)}
            className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all duration-150 ${
              studentFiltersOpen || extraFilterCount > 0
                ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                : 'bg-[var(--surface-subtle)] text-[var(--ink)] hover:bg-[var(--accent-soft)]/50'
            }`}
          >
            <SlidersHorizontal size={13} weight="bold" aria-hidden="true" />
            <span>
              {copy.search.filtersBtn}
              {extraFilterCount > 0 ? ` (${extraFilterCount})` : ''}
            </span>
          </button>
        </div>

        {studentFiltersOpen ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-[var(--border)]/70 pt-3">
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
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, idx) => {
          const studentName = resolvePersonName(s.name, locale);
          return (
          <div key={s.id} className="em-spotlight-card flex flex-col justify-between rounded-[28px] p-5">
            <div>
              <div className="flex items-center gap-3">
                <Avatar name={studentName} index={idx + 2} size="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-extrabold">{studentName}</h3>
                  <p className="truncate text-xs font-medium text-[var(--muted)]">
                    {sectorLabel(s.sec, locale)} · {GRADE_LABELS[s.cat][locale]} ·{' '}
                    {SUBJECT_LABELS[s.subj][locale]}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[var(--ink-2)]">
                <span className="font-semibold text-[var(--muted)]">{copy.teacher.goal} </span>
                {resolveLocalized(s.goal, locale)}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {isPremium ? (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--ink-2)]">
                    {copy.teacher.levelPrefix}{' '}
                    {s.level ? LEVEL_LABELS[s.level][locale] : copy.teacher.notTested}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenPremium}
                    className="em-lock-pattern inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold text-[var(--ink)]"
                  >
                    <Lock size={10} weight="bold" aria-hidden="true" />
                    {copy.teacher.levelLocked}
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => (isPremium ? onInviteStudent(studentName) : onOpenPremium())}
              className={`mt-4 inline-flex min-h-[38px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                isPremium
                  ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] hover:bg-[var(--primary-btn-hover)]'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)]'
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
