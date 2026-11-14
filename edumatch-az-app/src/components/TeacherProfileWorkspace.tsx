'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  GraduationCap,
  IdentificationCard,
  Lightning,
  Plus,
  ShieldCheck,
  Star,
  Warning,
} from '@phosphor-icons/react';
import { GRADES, LEVELS, SUBJECTS, TEACHING_STYLES } from '@/data/catalog';
import {
  COPY,
  GRADE_LABELS,
  LEVEL_LABELS,
  STYLE_LABELS,
  SUBJECT_LABELS,
} from '@/data/i18n';
import { resolveLocalized, resolveReviewText, resolveTutorName } from '@/data/tutors';
import { isTutorApproved } from '@/lib/matching';
import type {
  GradeId,
  LevelId,
  Locale,
  SubjectId,
  TeachingStyleId,
  TutorProfile,
} from '@/types/edumatch';

interface TeacherProfileWorkspaceProps {
  locale: Locale;
  meTutor: TutorProfile;
  onUpdateProfile: (patch: Partial<TutorProfile>) => void;
  onAddCertificate: (name: string) => void;
  onApproveCertificate: (index: number) => void;
  onNotify: (msg: string) => void;
}

export function TeacherProfileWorkspace({
  locale,
  meTutor,
  onUpdateProfile,
  onAddCertificate,
  onApproveCertificate,
  onNotify,
}: TeacherProfileWorkspaceProps) {
  const copy = COPY[locale];
  const approved = isTutorApproved(meTutor);

  const [certName, setCertName] = useState('');
  const [university, setUniversity] = useState(
    resolveLocalized(meTutor.education.university, locale),
  );
  const [faculty, setFaculty] = useState(
    resolveLocalized(meTutor.education.faculty, locale),
  );
  const [score, setScore] = useState(meTutor.education.admissionScore);
  const [year, setYear] = useState(meTutor.education.admissionYear);
  const [grant, setGrant] = useState(
    resolveLocalized(meTutor.education.grantType, locale),
  );
  const [diff, setDiff] = useState(
    resolveLocalized(meTutor.strengths.differentiator, locale),
  );
  const [bio, setBio] = useState(resolveLocalized(meTutor.bio, locale));

  const toggleItem = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const handleSaveAcademic = () => {
    const rawScore = Number(score);
    const clampedScore = Number.isFinite(rawScore)
      ? Math.max(100, Math.min(700, Math.round(rawScore)))
      : meTutor.education.admissionScore;
    const rawYear = Number(year);
    const clampedYear = Number.isFinite(rawYear) && rawYear >= 1980 && rawYear <= 2030
      ? Math.round(rawYear)
      : meTutor.education.admissionYear;
    setScore(clampedScore);
    setYear(clampedYear);
    onUpdateProfile({
      education: {
        ...meTutor.education,
        university: {
          ...meTutor.education.university,
          [locale]: university.trim() || meTutor.education.university[locale],
        },
        faculty: {
          ...meTutor.education.faculty,
          [locale]: faculty.trim() || meTutor.education.faculty[locale],
        },
        admissionScore: clampedScore,
        admissionYear: clampedYear,
        grantType: {
          ...meTutor.education.grantType,
          [locale]: grant.trim() || meTutor.education.grantType[locale],
        },
      },
      strengths: {
        ...meTutor.strengths,
        differentiator: {
          ...meTutor.strengths.differentiator,
          [locale]: diff.trim() || meTutor.strengths.differentiator[locale],
        },
      },
      bio: {
        ...meTutor.bio,
        [locale]: bio.trim() || meTutor.bio[locale],
      },
    });
    onNotify(copy.teacher.savedToast);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 px-1 pt-1">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-extrabold text-[var(--primary)]">
            <IdentificationCard size={14} weight="fill" aria-hidden="true" />
            <span>{copy.nav.profile}</span>
          </div>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {copy.teacher.profileBannerTitle}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">{copy.teacher.profileBannerSub}</p>
        </div>
        <p className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--muted)]">
          <span className="text-[var(--ink)]">{resolveTutorName(meTutor, locale)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 text-[var(--gold)]">
            <Star size={13} weight="fill" aria-hidden="true" />
            {meTutor.rating.toFixed(1)} ({meTutor.n})
          </span>
        </p>
      </header>

      {/* Visibility banner */}
      <div
        className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold ${
          approved
            ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
            : 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
        }`}
      >
        {approved ? (
          <CheckCircle size={18} weight="fill" aria-hidden="true" />
        ) : (
          <Warning size={18} weight="fill" aria-hidden="true" />
        )}
        <span>{approved ? copy.teacher.visibleStatus : copy.teacher.hiddenStatus}</span>
      </div>

      {/* 2-Column Desktop Bento */}
      <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className="space-y-5 lg:col-span-7">
          {/* University & Score + Strengths Editor */}
          <div className="em-card rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap size={20} weight="fill" className="text-[var(--primary)]" aria-hidden="true" />
          <h2 className="text-base font-extrabold">{copy.teacher.academicCardTitle}</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
            <span>{copy.teacher.universityLabel}</span>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
            <span>{copy.teacher.facultyLabel}</span>
            <input
              type="text"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
            <span>{copy.teacher.admissionScoreLabel}</span>
            <input
              type="number"
              min={100}
              max={700}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
            <span>{copy.teacher.admissionYearLabel}</span>
            <input
              type="number"
              min={1990}
              max={2026}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)]"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
          <span>{copy.teacher.grantLabel}</span>
          <input
            type="text"
            value={grant}
            onChange={(e) => setGrant(e.target.value)}
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)]"
          />
        </label>

        <div className="border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-2">
            <Lightning size={18} weight="fill" className="text-[var(--primary)]" aria-hidden="true" />
            <h3 className="text-sm font-extrabold">{copy.teacher.strengthsCardTitle}</h3>
          </div>
          <label className="mt-3 flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
            <span>{copy.teacher.differentiatorLabel}</span>
            <textarea
              rows={2}
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--ink)]"
            />
          </label>
          <label className="mt-3 flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
            <span>{copy.teacher.bioLabel}</span>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--ink)]"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSaveAcademic}
          className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-5 py-2 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
        >
          {copy.teacher.saveAcademicBtn}
        </button>
      </div>

      {/* Subjects, Grades, Levels, Styles, Price */}
      <div className="em-card rounded-3xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-extrabold">{copy.teacher.subjectsLabel}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUBJECTS.map((s) => {
              const on = meTutor.subj.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    onUpdateProfile({ subj: toggleItem(meTutor.subj, s as SubjectId) })
                  }
                  aria-pressed={on}
                  className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold transition ${
                    on
                      ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                  }`}
                >
                  {SUBJECT_LABELS[s][locale]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold">{copy.teacher.gradesLabel}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {GRADES.map((g) => {
              const on = meTutor.cats.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    onUpdateProfile({ cats: toggleItem(meTutor.cats, g as GradeId) })
                  }
                  aria-pressed={on}
                  className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold transition ${
                    on
                      ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                  }`}
                >
                  {GRADE_LABELS[g][locale]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold">{copy.teacher.levelsLabel}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {LEVELS.map((l) => {
              const on = meTutor.levels.includes(l);
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() =>
                    onUpdateProfile({ levels: toggleItem(meTutor.levels, l as LevelId) })
                  }
                  aria-pressed={on}
                  className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold transition ${
                    on
                      ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                  }`}
                >
                  {LEVEL_LABELS[l][locale]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold">{copy.teacher.stylesLabel}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TEACHING_STYLES.map((st) => {
              const on = meTutor.sty.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() =>
                    onUpdateProfile({
                      sty: toggleItem(meTutor.sty, st as TeachingStyleId),
                    })
                  }
                  aria-pressed={on}
                  className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold transition ${
                    on
                      ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                      : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                  }`}
                >
                  {STYLE_LABELS[st][locale]}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex max-w-xs flex-col gap-1 text-xs font-bold text-[var(--muted)]">
          <span>{copy.teacher.priceLabel}</span>
          <input
            type="number"
            min={5}
            max={200}
            value={meTutor.price}
            onChange={(e) =>
              onUpdateProfile({ price: Math.max(5, Number(e.target.value) || 20) })
            }
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm font-bold text-[var(--ink)]"
          />
        </label>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-5">
          {/* Certificates */}
          <div className="em-card rounded-3xl p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} weight="fill" className="text-[var(--accent-ink)]" aria-hidden="true" />
              <h2 className="text-base font-bold">{copy.teacher.certsCardTitle}</h2>
            </div>

            <div className="mt-3 space-y-2">
              {meTutor.certs.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--surface-subtle)] px-3.5 py-2.5 text-sm font-bold"
                >
                  <span>{resolveLocalized(c.name, locale)}</span>
                  {c.ok ? (
                    <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent-ink)]">
                      {copy.profileModal.verified}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-bold text-[var(--muted)]">
                        {copy.teacher.certPending}
                      </span>
                      <button
                        type="button"
                        onClick={() => onApproveCertificate(idx)}
                        className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-extrabold text-[var(--ink)] hover:border-[var(--accent)]"
                      >
                        {copy.teacher.certApproveDemo}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder={copy.teacher.certPlaceholder}
                className="h-11 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!certName.trim()) return;
                  onAddCertificate(certName.trim());
                  setCertName('');
                }}
                className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
              >
                <Plus size={14} weight="bold" aria-hidden="true" />
                {copy.teacher.addBtn}
              </button>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">{copy.teacher.certNote}</p>
          </div>

          {/* Reviews */}
          <div className="em-card rounded-3xl p-5">
            <h2 className="text-base font-extrabold">{copy.profileModal.reviewsTitle}</h2>
            {meTutor.rev.length > 0 ? (
              <div className="mt-3 space-y-2">
                {meTutor.rev.map((r, i) => (
                  <div key={r.id ?? i} className="rounded-2xl bg-[var(--surface-subtle)] p-3 text-sm">
                    <span className="font-bold text-[var(--gold)]">{r.stars}.0 ★</span>{' '}
                    <span>{resolveReviewText(r, locale)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-[var(--muted)]">{copy.profileModal.noReviewsYet}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
