'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  ChalkboardTeacher,
  ChatCircleDots,
  CheckCircle,
  Clock,
  PencilSimple,
  Plus,
  Sparkle,
  Star,
  UserCircle,
} from '@phosphor-icons/react';
import { GRADES, RANK_TIERS, REVIEW_TAGS } from '@/data/catalog';
import {
  CITY_LABELS,
  COPY,
  FORMAT_LABELS,
  GRADE_LABELS,
  STATUS_LABELS,
  SUBJECT_LABELS,
  sectorLabel,
} from '@/data/i18n';
import { resolveLocalized, resolveTutorName } from '@/data/tutors';
import { RankProgressCard } from '@/components/RankProgressCard';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { PWA_COPY } from '@/lib/pwaCopy';
import { getRankIndex } from '@/lib/matching';
import { handleSpotlightMove } from '@/lib/spotlight';
import type {
  CityId,
  GradeId,
  HomeworkSubmission,
  Locale,
  StudentRequest,
  StudentState,
  TutorContent,
  TutorProfile,
} from '@/types/edumatch';

interface LessonsWorkspaceProps {
  locale: Locale;
  xp: number;
  student?: StudentState;
  studentName?: string;
  locationName?: string;
  favoritesCount?: number;
  requests: StudentRequest[];
  tutors: TutorProfile[];
  content: Record<string, TutorContent>;
  hwSubmissions: HomeworkSubmission[];
  onOpenChat: (requestId: number) => void;
  onOpenTutorProfile: (tutorId: string, tab?: 'overview' | 'hw') => void;
  onOpenClassroom?: (requestId: number) => void;
  onRescheduleRequest?: (requestId: number) => void;
  onAcceptInvite?: (requestId: number) => void;
  onMarkLessonDone: (requestId: number) => void;
  onSubmitReview: (requestId: number, stars: number, tags: string[], comment: string) => void;
  onUpdateStudentProfile?: (patch: {
    displayName?: string;
    cat?: GradeId;
    targetGroup?: string;
  }) => void;
  onOpenAccountHub?: () => void;
  onGoToSearch: () => void;
  onSelectRank: (rankIndex: number) => void;
}

function getStudentInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0]?.[0] ?? 'M').toUpperCase();
}

const DIM_GROUP_PRESETS: Record<Locale, string[]> = {
  ru: ['I / IV группа DİM', 'I группа DİM', 'II группа DİM', 'III группа DİM', 'IV группа DİM', 'IELTS / SAT'],
  az: ['I / IV qrup DİM', 'I qrup DİM', 'II qrup DİM', 'III qrup DİM', 'IV qrup DİM', 'IELTS / SAT'],
  en: ['Group I / IV DİM', 'Group I DİM', 'Group II DİM', 'Group III DİM', 'Group IV DİM', 'IELTS / SAT'],
};

export function LessonsWorkspace({
  locale,
  xp,
  student,
  studentName,
  locationName = 'Баку',
  favoritesCount = 0,
  requests,
  tutors,
  content,
  hwSubmissions,
  onOpenChat,
  onOpenTutorProfile,
  onOpenClassroom,
  onRescheduleRequest,
  onAcceptInvite,
  onMarkLessonDone,
  onSubmitReview,
  onUpdateStudentProfile,
  onOpenAccountHub,
  onGoToSearch,
  onSelectRank,
}: LessonsWorkspaceProps) {
  const copy = COPY[locale];
  const pwaCopy = PWA_COPY[locale];
  const spCopy = pwaCopy.studentProfile;
  const myRequests = requests.filter((r) => r.mine);
  const scheduledLessons = myRequests.filter(
    (r) => (r.status === 'new' || r.status === 'accepted') && Boolean(r.schedule),
  );

  const currentRankIndex = getRankIndex(xp);
  const currentRank = RANK_TIERS[currentRankIndex] ?? RANK_TIERS[0];

  const resolvedStudentName =
    studentName?.trim() || student?.displayName?.trim() || spCopy.defaultName;
  const resolvedCity = CITY_LABELS[locationName as CityId]?.[locale] ?? locationName;
  const resolvedGradeKey: GradeId = student?.cat ?? '11 класс';
  const resolvedGradeLabel = GRADE_LABELS[resolvedGradeKey]?.[locale] ?? resolvedGradeKey;
  const resolvedGroup = student?.targetGroup?.trim() || spCopy.defaultGroup;
  const resolvedSector = student?.sec ?? 'az';
  const studentInitials = getStudentInitials(resolvedStudentName);

  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(resolvedStudentName);
  const [draftGrade, setDraftGrade] = useState<GradeId>(resolvedGradeKey);
  const [draftGroup, setDraftGroup] = useState(resolvedGroup);

  const toggleProfileEditor = () => {
    setEditingProfile((prev) => {
      if (!prev) {
        setDraftName(resolvedStudentName);
        setDraftGrade(resolvedGradeKey);
        setDraftGroup(resolvedGroup);
      }
      return !prev;
    });
  };

  const [starsMap, setStarsMap] = useState<Record<number, number>>({});
  const [tagsMap, setTagsMap] = useState<Record<number, string[]>>({});
  const [textMap, setTextMap] = useState<Record<number, string>>({});

  const allHomeworks = tutors.flatMap((tutor) =>
    (content[tutor.id]?.hw ?? []).map((hw) => ({ tutor, hw })),
  );

  const toggleTag = (requestId: number, tag: string) => {
    setTagsMap((prev) => {
      const curr = prev[requestId] ?? [];
      const exists = curr.includes(tag);
      return {
        ...prev,
        [requestId]: exists ? curr.filter((x) => x !== tag) : [...curr, tag],
      };
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStudentProfile) {
      onUpdateStudentProfile({
        displayName: draftName.trim() || spCopy.defaultName,
        cat: draftGrade,
        targetGroup: draftGroup.trim() || spCopy.defaultGroup,
      });
    }
    setEditingProfile(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Student Profile Summary Card (Madina spec · Solaris Elevation) */}
      <section
        aria-label={resolvedStudentName}
        onPointerMove={handleSpotlightMove}
        className="em-spotlight-card em-card relative overflow-hidden rounded-3xl p-5 sm:p-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#C8F542]/15 blur-2xl"
        />

        <div className="relative flex flex-wrap items-start justify-between gap-3.5 sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold tracking-tight text-white shadow-sm ring-2 ring-[var(--border)] sm:h-[60px] sm:w-[60px] sm:text-xl"
                style={{ background: 'linear-gradient(135deg, #111514 0%, #1B4332 100%)' }}
              >
                {studentInitials}
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)] bg-emerald-500"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-extrabold tracking-tight text-[var(--ink)] sm:text-xl">
                  {resolvedStudentName}
                </h1>
                {onUpdateStudentProfile ? (
                  <button
                    type="button"
                    onClick={toggleProfileEditor}
                    aria-label={spCopy.editProfileLabel}
                    title={spCopy.editProfileLabel}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
                  >
                    <PencilSimple size={12} weight="bold" aria-hidden="true" />
                    <span className="hidden sm:inline">{spCopy.editProfileLabel}</span>
                  </button>
                ) : null}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-[var(--muted)] sm:text-[13px]">
                <span>
                  {resolvedCity} · {resolvedGradeLabel} ({resolvedGroup})
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">
                  {sectorLabel(resolvedSector, locale)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="font-mono-num inline-flex items-center gap-1 rounded-full bg-[#C8F542] px-3.5 py-1.5 text-xs font-extrabold text-[#0F172A] shadow-2xs sm:text-sm">
              <Sparkle size={13} weight="fill" aria-hidden="true" />
              {xp} XP
            </span>
          </div>
        </div>

        {/* 3-Column Student Stats Row */}
        <div className="relative mt-4 grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => onSelectRank(currentRankIndex)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/80 px-2.5 py-3 text-center transition hover:border-[var(--border-strong)]"
          >
            <span className="max-w-full truncate text-sm font-extrabold text-[var(--ink)] sm:text-[15px]">
              {resolveLocalized(currentRank.title, locale)}
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-[var(--muted)]">
              {spCopy.currentRankLabel}
            </span>
          </button>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/80 px-2.5 py-3 text-center">
            <span className="font-mono-num text-sm font-extrabold text-[var(--ink)] sm:text-[15px]">
              {favoritesCount}
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-[var(--muted)]">
              {spCopy.favoritesLabel}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/80 px-2.5 py-3 text-center">
            <span className="font-mono-num text-sm font-extrabold text-[var(--ink)] sm:text-[15px]">
              {myRequests.length}
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-[var(--muted)]">
              {spCopy.lessonsLabel}
            </span>
          </div>
        </div>

        {/* Expandable Inline Student Profile Editor */}
        {editingProfile && onUpdateStudentProfile ? (
          <form
            onSubmit={handleSaveProfile}
            className="relative mt-4 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/90 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {spCopy.fullNameLabel}
                </span>
                <input
                  type="text"
                  value={draftName}
                  maxLength={80}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder={spCopy.fullNamePlaceholder}
                  className="em-input w-full rounded-xl px-3 py-2 text-sm font-semibold"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {spCopy.gradeLabel}
                </span>
                <select
                  value={draftGrade}
                  onChange={(e) => setDraftGrade(e.target.value as GradeId)}
                  className="em-input w-full rounded-xl px-3 py-2 text-sm font-semibold"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {GRADE_LABELS[g]?.[locale] ?? g}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {spCopy.groupLabel}
                </span>
                <input
                  type="text"
                  value={draftGroup}
                  maxLength={60}
                  onChange={(e) => setDraftGroup(e.target.value)}
                  placeholder={spCopy.groupPlaceholder}
                  className="em-input w-full rounded-xl px-3 py-2 text-sm font-semibold"
                />
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIM_GROUP_PRESETS[locale].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDraftGroup(preset)}
                    className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                      draftGroup === preset
                        ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--border-strong)]"
              >
                {spCopy.cancelBtn}
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:opacity-90"
              >
                {spCopy.saveBtn}
              </button>
            </div>
          </form>
        ) : null}
      </section>

      {/* Lessons Section Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-extrabold tracking-tight text-[var(--ink)]">
            {spCopy.myLessonsHeading}
          </h2>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--muted)]">
            {myRequests.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAccountHub ? (
            <button
              type="button"
              onClick={onOpenAccountHub}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--border-strong)]"
            >
              <UserCircle size={14} weight="bold" aria-hidden="true" />
              <span>{spCopy.accountCta}</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onGoToSearch}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-extrabold text-[var(--accent-ink)] shadow-2xs transition hover:brightness-95"
          >
            <Plus size={13} weight="bold" aria-hidden="true" />
            <span>{spCopy.bookCta.replace(/^\+\s*/, '')}</span>
          </button>
        </div>
      </div>

      {/* Rank Card */}
      <RankProgressCard locale={locale} xp={xp} onSelectRank={onSelectRank} />

      {/* Weekly Schedule Timeline */}
      <div className="em-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarCheck size={18} weight="bold" className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <h2 className="text-base font-extrabold text-[var(--ink)]">
              {pwaCopy.booking.weeklyTitle}
            </h2>
          </div>
          <span className="rounded-full bg-[#C8F542] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0F172A]">
            {scheduledLessons.length}
          </span>
        </div>

        {scheduledLessons.length === 0 ? (
          <p className="mt-2.5 text-xs text-[var(--muted)]">{pwaCopy.booking.weeklyEmpty}</p>
        ) : (
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {scheduledLessons.map((req) => {
              const tutor = tutors.find((t) => t.id === req.tid);
              if (!tutor || !req.schedule) return null;
              return (
                <div
                  key={`slot-${req.id}`}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/70 p-3.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {req.schedule.dateLabel} · {req.schedule.time}
                      </span>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                        {FORMAT_LABELS[req.schedule.format][locale]} · {req.schedule.durationMin}m
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-bold text-[var(--ink)]">
                      {resolveTutorName(tutor, locale)}
                    </p>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {SUBJECT_LABELS[req.st.subj][locale]}
                      {req.schedule.goal ? ` · ${req.schedule.goal}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {req.status === 'accepted' && onOpenClassroom ? (
                      <button
                        type="button"
                        onClick={() => onOpenClassroom(req.id)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#C8F542] px-3 py-1.5 text-[11px] font-bold text-[#0F172A] transition hover:brightness-95"
                      >
                        <ChalkboardTeacher size={13} weight="bold" aria-hidden="true" />
                        {pwaCopy.booking.enterClassroom}
                      </button>
                    ) : null}
                    {onRescheduleRequest ? (
                      <button
                        type="button"
                        onClick={() => onRescheduleRequest(req.id)}
                        className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-semibold text-[var(--ink)] hover:border-[var(--border-strong)]"
                      >
                        {pwaCopy.booking.rescheduleBtn}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Homework Board */}
      <div className="em-card rounded-3xl p-5">
        <h2 className="text-base font-extrabold">{copy.lessons.homeworkTitle}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {allHomeworks.map(({ tutor, hw }) => {
            const sub = hwSubmissions.find((s) => s.hid === hw.id);
            return (
              <div
                key={hw.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/60 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-extrabold text-[var(--ink)]">
                    {resolveLocalized(hw.title, locale)}
                  </div>
                  <div className="text-xs font-semibold text-[var(--muted)]">
                    <button
                      type="button"
                      onClick={() => onOpenTutorProfile(tutor.id, 'overview')}
                      className="cursor-pointer font-bold text-[var(--primary)] hover:underline"
                    >
                      {resolveTutorName(tutor, locale)}
                    </button>{' '}
                    · <span className="font-mono-num">+{hw.pts} XP</span>
                  </div>
                  {sub?.feedback ? (
                    <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      {sub.score !== undefined ? `${sub.score}/100 · ` : ''}
                      {sub.feedback}
                    </p>
                  ) : null}
                </div>
                {sub ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                      sub.st === 'ok'
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'bg-[var(--gold-soft)] text-[var(--gold)]'
                    }`}
                  >
                    {sub.st === 'ok' ? (
                      <CheckCircle size={14} weight="fill" aria-hidden="true" />
                    ) : (
                      <Clock size={14} weight="fill" aria-hidden="true" />
                    )}
                    {sub.st === 'ok'
                      ? copy.profileModal.submittedOk
                      : copy.profileModal.submittedPending}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenTutorProfile(tutor.id, 'hw')}
                    className="min-h-[38px] cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-extrabold text-[var(--ink)] hover:border-[var(--primary)]"
                  >
                    {copy.lessons.open}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Requests List */}
      {myRequests.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {myRequests.map((req) => {
            const tutor = tutors.find((t) => t.id === req.tid);
            if (!tutor) return null;
            const currentStars = starsMap[req.id] ?? 0;
            const currentTags = tagsMap[req.id] ?? [];
            const currentText = textMap[req.id] ?? '';

            return (
              <div key={req.id} className="em-card rounded-3xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenTutorProfile(tutor.id, 'overview')}
                      className="cursor-pointer text-left text-base font-extrabold text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--primary)]"
                    >
                      {resolveTutorName(tutor, locale)}
                    </button>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--muted)]">
                      <span>
                        {SUBJECT_LABELS[req.st.subj][locale]}
                        {req.trial ? ` · ${copy.lessons.trialTag}` : ''}
                      </span>
                      {req.invited ? (
                        <span className="rounded-full bg-[#C8F542]/60 px-2 py-0.5 text-[10px] font-bold text-[#0F172A]">
                          {pwaCopy.booking.invitedTag}
                        </span>
                      ) : null}
                      {req.schedule ? (
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--ink)]">
                          {req.schedule.dateLabel} · {req.schedule.time}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      req.status === 'done' || req.status === 'accepted'
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : req.status === 'declined'
                          ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
                          : 'bg-[var(--surface-subtle)] text-[var(--muted)]'
                    }`}
                  >
                    {STATUS_LABELS[req.status][locale]}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenChat(req.id)}
                    className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-extrabold text-[var(--ink)] hover:border-[var(--primary)]"
                  >
                    <ChatCircleDots size={15} weight="bold" aria-hidden="true" />
                    {copy.lessons.openChat}
                  </button>

                  {onRescheduleRequest && (req.status === 'new' || req.status === 'accepted') ? (
                    <button
                      type="button"
                      onClick={() => onRescheduleRequest(req.id)}
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--border-strong)]"
                    >
                      <CalendarCheck size={14} weight="bold" aria-hidden="true" />
                      {pwaCopy.booking.rescheduleBtn}
                    </button>
                  ) : null}

                  {req.invited && req.status === 'new' && onAcceptInvite ? (
                    <button
                      type="button"
                      onClick={() => onAcceptInvite(req.id)}
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[#C8F542] px-4 py-1.5 text-xs font-extrabold text-[#0F172A] transition hover:brightness-95"
                    >
                      <CheckCircle size={15} weight="bold" aria-hidden="true" />
                      {copy.teacher.accept}
                    </button>
                  ) : null}

                  {req.status === 'accepted' ? (
                    <>
                      {onOpenClassroom ? (
                        <button
                          type="button"
                          onClick={() => onOpenClassroom(req.id)}
                          className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[#C8F542] px-4 py-1.5 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
                        >
                          <ChalkboardTeacher size={15} weight="bold" aria-hidden="true" />
                          {pwaCopy.booking.enterClassroom}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => onMarkLessonDone(req.id)}
                        className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                      >
                        {copy.lessons.markDone}
                      </button>
                    </>
                  ) : null}
                </div>

                {req.status === 'done' ? (
                  req.review ? (
                    <div className="mt-3 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-xs font-bold text-[var(--accent)]">
                      {copy.lessons.yourReview} {req.review.stars}.0 ★ — {req.review.text}
                    </div>
                  ) : (
                    <div className="mt-4 border-t border-[var(--border)] pt-4">
                      <h3 className="text-sm font-extrabold">{copy.lessons.rateLesson}</h3>
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((val) => {
                          const active = currentStars >= val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                setStarsMap((prev) => ({ ...prev, [req.id]: val }))
                              }
                              aria-label={`${val} stars`}
                              className={`cursor-pointer rounded-lg p-1 transition ${
                                active ? 'text-[var(--accent)]' : 'text-[var(--border)]'
                              }`}
                            >
                              <Star size={24} weight="fill" aria-hidden="true" />
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {REVIEW_TAGS.map((tagObj, i) => {
                          const label = resolveLocalized(tagObj, locale);
                          const selected = currentTags.includes(label);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleTag(req.id, label)}
                              aria-pressed={selected}
                              className={`min-h-[34px] cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                selected
                                  ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                                  : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <textarea
                        rows={2}
                        value={currentText}
                        onChange={(e) =>
                          setTextMap((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        placeholder={copy.lessons.reviewPlaceholder}
                        className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          onSubmitReview(req.id, currentStars, currentTags, currentText)
                        }
                        className="mt-2.5 inline-flex min-h-[38px] cursor-pointer items-center rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                      >
                        {copy.lessons.submitReview}
                      </button>
                    </div>
                  )
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="em-card rounded-3xl p-8 text-center">
          <AcademicEmblem iconKey="curious" size="xl" className="mx-auto" />
          <h3 className="mt-4 text-lg font-extrabold">{copy.lessons.emptyTitle}</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--muted)]">
            {copy.lessons.emptySub}
          </p>
          <button
            type="button"
            onClick={onGoToSearch}
            className="mt-4 inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-5 py-2 text-sm font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
          >
            <span>{copy.lessons.searchCta}</span>
            <ArrowRight size={15} weight="bold" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
