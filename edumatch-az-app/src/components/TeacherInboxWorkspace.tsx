'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  ChatCircleDots,
  Check,
  CheckCircle,
  Lock,
  Megaphone,
  Warning,
  X,
} from '@phosphor-icons/react';
import { GRADES, LEVELS, SUBJECTS } from '@/data/catalog';
import {
  COPY,
  GRADE_LABELS,
  LEVEL_LABELS,
  STATUS_LABELS,
  SUBJECT_LABELS,
  sectorLabel,
} from '@/data/i18n';
import { resolveChatMessageText, resolvePersonName } from '@/data/tutors';
import { PWA_COPY } from '@/lib/pwaCopy';
import { Avatar } from '@/components/ui/Avatar';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { handleSpotlightMove } from '@/lib/spotlight';
import { isTutorApproved } from '@/lib/matching';
import type {
  GradeId,
  HomeworkSubmission,
  InboxFilters,
  Locale,
  StudentRequest,
  TutorProfile,
} from '@/types/edumatch';

interface TeacherInboxWorkspaceProps {
  locale: Locale;
  meTutor: TutorProfile;
  activeTeacherId?: string;
  requests: StudentRequest[];
  isPremium: boolean;
  hwSubmissions?: HomeworkSubmission[];
  onOpenChat: (requestId: number) => void;
  onAcceptRequest: (requestId: number) => void;
  onDeclineRequest: (requestId: number) => void;
  onOpenClassroom?: (requestId: number) => void;
  onGradeHomework?: (subId: string, score: number, feedback: string) => void;
  onOpenPartnerModal?: () => void;
  onOpenPremium: () => void;
  onNotifyAd: (msg: string) => void;
}

export function TeacherInboxWorkspace({
  locale,
  meTutor,
  activeTeacherId,
  requests,
  isPremium,
  hwSubmissions = [],
  onOpenChat,
  onAcceptRequest,
  onDeclineRequest,
  onOpenClassroom,
  onGradeHomework,
  onOpenPartnerModal,
  onOpenPremium,
  onNotifyAd,
}: TeacherInboxWorkspaceProps) {
  const copy = COPY[locale];
  const ts = PWA_COPY[locale].teacherSync;
  const bk = PWA_COPY[locale].booking;
  const teacherKey = activeTeacherId ?? meTutor.id;
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState('95');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const mySubmissions = hwSubmissions.filter((s) => s.tid === teacherKey);
  const [filters, setFilters] = useState<InboxFilters>({
    cat: '',
    subj: '',
    trial: '',
    lv: '',
    sort: 'new',
  });

  const mine = requests.filter((r) => r.tid === teacherKey);
  const approved = isTutorApproved(meTutor);

  const fitsMe = (r: StudentRequest) =>
    meTutor.cats.includes(r.st.cat) &&
    meTutor.subj.includes(r.st.subj) &&
    (!isPremium || !r.st.level || meTutor.levels.includes(r.st.level));

  const filtered = mine
    .filter(
      (r) =>
        (!filters.cat || r.st.cat === filters.cat) &&
        (!filters.subj || r.st.subj === filters.subj) &&
        (!filters.trial || (filters.trial === '1') === r.trial) &&
        (!filters.lv || r.st.level === filters.lv),
    )
    .sort((a, b) =>
      filters.sort === 'cat'
        ? GRADES.indexOf(a.st.cat) - GRADES.indexOf(b.st.cat)
        : b.id - a.id,
    );

  const countByGrade = (g: GradeId) => mine.filter((r) => r.st.cat === g).length;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="em-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-extrabold text-[var(--accent-ink)]">
            <ChatCircleDots size={14} weight="fill" aria-hidden="true" />
            <span>{copy.nav.inbox}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {copy.teacher.inboxBannerTitle}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy.teacher.inboxBannerSub}</p>
        </div>
        <AcademicEmblem iconKey="mentor" size="xl" />
      </div>

      {/* Frosted Glass KPI Stat Cards (Replaced Flat Gradient Rectangles) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          onPointerMove={handleSpotlightMove}
          className="em-spotlight-card rounded-3xl p-4 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)]">
              {copy.teacher.newTile}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--ink)]" aria-hidden="true" />
          </div>
          <div className="font-mono-num mt-2 text-2xl font-extrabold text-[var(--ink)]">
            {mine.filter((r) => r.status === 'new').length}
          </div>
        </div>

        <div
          onPointerMove={handleSpotlightMove}
          className="em-spotlight-card rounded-3xl p-4 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)]">
              {copy.teacher.trialTile}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          </div>
          <div className="font-mono-num mt-2 text-2xl font-extrabold text-[var(--accent)]">
            {mine.filter((r) => r.trial).length}
          </div>
        </div>

        <div
          onPointerMove={handleSpotlightMove}
          className="em-spotlight-card rounded-3xl p-4 sm:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)]">
              {copy.teacher.fitTile}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          </div>
          <div className="font-mono-num mt-2 text-2xl font-extrabold text-[var(--accent-ink)]">
            {mine.filter(fitsMe).length}
          </div>
        </div>
      </div>

      {!approved ? (
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-bold text-[var(--accent-ink)]">
          <Warning size={18} weight="fill" aria-hidden="true" />
          <span>{copy.teacher.hiddenWarning}</span>
        </div>
      ) : null}

      {/* Grade Filter Chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setFilters((p) => ({ ...p, cat: '' }))}
          aria-pressed={!filters.cat}
          className={`min-h-[38px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-extrabold transition ${
            !filters.cat
              ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
          }`}
        >
          {copy.teacher.all} ({mine.length})
        </button>
        {GRADES.filter((g) => countByGrade(g) > 0).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setFilters((p) => ({ ...p, cat: g }))}
            aria-pressed={filters.cat === g}
            className={`min-h-[38px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-extrabold transition ${
              filters.cat === g
                ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
            }`}
          >
            {GRADE_LABELS[g][locale]} · {countByGrade(g)}
          </button>
        ))}
      </div>

      {/* Instant 1-Click Pill Filters (Non-Boxy, Zero-Lag) */}
      <div className="em-card space-y-3 rounded-[28px] p-4 sm:p-5">
        <div
          role="group"
          aria-label={copy.teacher.subject}
          className="flex flex-wrap items-center gap-1.5"
        >
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            {copy.teacher.subject}
          </span>
          <button
            type="button"
            aria-pressed={filters.subj === ''}
            onClick={() => setFilters((p) => ({ ...p, subj: '' }))}
            className={`min-h-[30px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
              filters.subj === ''
                ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                : 'bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:bg-[var(--accent-soft)]/55'
            }`}
          >
            {copy.teacher.all}
          </button>
          {SUBJECTS.map((s) => {
            const active = filters.subj === s;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => setFilters((p) => ({ ...p, subj: active ? '' : s }))}
                className={`min-h-[30px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                  active
                    ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:bg-[var(--accent-soft)]/55'
                }`}
              >
                {SUBJECT_LABELS[s][locale]}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-[var(--border)]/70 pt-3">
          {/* Request Type */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              {copy.teacher.type}
            </span>
            <div
              role="group"
              aria-label={copy.teacher.type}
              className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
            >
              {(
                [
                  ['', copy.teacher.all],
                  ['1', copy.teacher.typeTrial],
                  ['0', copy.teacher.typeRegular],
                ] as Array<[InboxFilters['trial'], string]>
              ).map(([val, label]) => {
                const active = filters.trial === val;
                return (
                  <button
                    key={val || 'all'}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters((p) => ({ ...p, trial: val }))}
                    className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Level (Premium) */}
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

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              {copy.teacher.sort}
            </span>
            <div
              role="group"
              aria-label={copy.teacher.sort}
              className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
            >
              {(
                [
                  ['new', copy.teacher.sortNew],
                  ['cat', copy.teacher.sortCat],
                ] as Array<[InboxFilters['sort'], string]>
              ).map(([val, label]) => {
                const active = filters.sort === val;
                return (
                  <button
                    key={val}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters((p) => ({ ...p, sort: val }))}
                    className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Partner Capsule */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[var(--accent-border)]/70 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)] to-[var(--accent-soft)]/35 px-5 py-4 shadow-[var(--shadow-card)]">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-ink)]">
            <Megaphone size={11} weight="fill" aria-hidden="true" />
            {copy.teacher.adPartnerTag}
          </span>
          <h3 className="mt-1.5 text-sm font-bold text-[var(--ink)]">
            {copy.teacher.adPartnerTitle}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{copy.teacher.adPartnerDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <AcademicEmblem iconKey="mega" size="md" />
          <button
            type="button"
            onClick={() => (onOpenPartnerModal ? onOpenPartnerModal() : onNotifyAd(copy.teacher.adPartnerToast))}
            className="inline-flex min-h-[38px] shrink-0 cursor-pointer items-center rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition-all duration-150 hover:bg-[var(--primary-btn-hover)] active:scale-[0.97]"
          >
            {copy.teacher.adPartnerCta}
          </button>
        </div>
      </div>

      {/* Request Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((r, i) => {
            const lastMsg = r.msgs[r.msgs.length - 1];
            const studentName = resolvePersonName(r.st.name, locale);
            return (
              <div
                key={r.id}
                onPointerMove={handleSpotlightMove}
                className="em-spotlight-card rounded-3xl p-4 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={studentName} index={i} size="md" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-extrabold">{studentName}</h3>
                    <p className="truncate text-xs text-[var(--muted)]">
                      {lastMsg?.img
                        ? copy.teacher.stickerMsg
                        : lastMsg?.text
                          ? resolveChatMessageText(lastMsg.text, locale)
                          : ''}
                    </p>
                  </div>
                  {r.status === 'new' ? (
                    <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
                      {copy.teacher.newBadge}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
                    {sectorLabel(r.st.sec, locale)}
                  </span>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
                    {GRADE_LABELS[r.st.cat][locale]}
                  </span>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
                    {SUBJECT_LABELS[r.st.subj][locale]}
                  </span>
                  {r.trial ? (
                    <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
                      {copy.teacher.typeTrial}
                    </span>
                  ) : null}
                  {r.invited ? (
                    <span className="rounded-full border border-[var(--accent-border)] bg-[var(--lime)]/25 px-2.5 py-1 text-xs font-extrabold text-[var(--ink)]">
                      {bk.invitedTag}
                    </span>
                  ) : null}
                  {r.schedule ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-2)]">
                      <CalendarCheck size={12} weight="bold" aria-hidden="true" />
                      {r.schedule.dateLabel} · {r.schedule.time}
                    </span>
                  ) : null}
                  {isPremium ? (
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-2)]">
                      {copy.teacher.levelPrefix}{' '}
                      {r.st.level
                        ? LEVEL_LABELS[r.st.level][locale]
                        : copy.teacher.notTested}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenPremium}
                      className="em-lock-pattern inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-[var(--ink)]"
                    >
                      <Lock size={11} weight="bold" aria-hidden="true" />
                      {copy.teacher.levelLocked}
                    </button>
                  )}
                  {fitsMe(r) ? (
                    <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
                      {copy.teacher.matchesCriteria}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenChat(r.id)}
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                  >
                    <ChatCircleDots size={14} weight="bold" aria-hidden="true" />
                    {copy.lessons.openChat}
                  </button>
                  {r.status === 'accepted' && onOpenClassroom ? (
                    <button
                      type="button"
                      onClick={() => onOpenClassroom(r.id)}
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-bold text-[var(--accent-ink)] transition hover:brightness-95"
                    >
                      <CalendarCheck size={14} weight="bold" aria-hidden="true" />
                      {bk.enterClassroom}
                    </button>
                  ) : null}
                  {r.status === 'new' && !r.invited ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onAcceptRequest(r.id)}
                        className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-bold text-[var(--ink)] hover:border-[var(--accent)]"
                      >
                        <Check size={14} weight="bold" aria-hidden="true" />
                        {copy.teacher.accept}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeclineRequest(r.id)}
                        className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-bold text-[var(--ink)] hover:border-[var(--danger)]"
                      >
                        <X size={14} weight="bold" aria-hidden="true" />
                        {copy.teacher.decline}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-[var(--muted)]">
                      {STATUS_LABELS[r.status][locale]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="em-card rounded-3xl p-8 text-center">
          <AcademicEmblem iconKey="lens" size="xl" className="mx-auto" />
          <h3 className="mt-4 text-base font-extrabold">{copy.teacher.noRequestsTitle}</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">{copy.teacher.noRequestsSub}</p>
        </div>
      )}

      {mySubmissions.length > 0 ? (
        <section className="em-card space-y-3 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-[var(--ink)]">{ts.hwQueueTitle}</h2>
            <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--accent-ink)]">
              {mySubmissions.filter((s) => s.st === 'pending').length}
            </span>
          </div>
          <div className="space-y-3">
            {mySubmissions.map((s) => {
              const isGrading = gradingId === s.id;
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/55 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold text-[var(--ink)]">{s.who}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            s.st === 'ok'
                              ? 'border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                              : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
                          }`}
                        >
                          {s.st === 'ok' ? ts.gradedBadge : ts.pendingBadge}
                        </span>
                        {s.st === 'ok' && s.score !== undefined ? (
                          <span className="font-mono text-xs font-extrabold text-[var(--accent-ink)]">
                            {s.score}/100
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs font-semibold text-[var(--muted)]">
                        {s.title}
                        {s.fn ? ` · ${s.fn}` : ''}
                      </p>
                      {s.text ? (
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-2)]">
                          {s.text}
                        </p>
                      ) : null}
                      {s.feedback ? (
                        <p className="mt-2 rounded-xl border border-[var(--accent-border)]/70 bg-[var(--accent-soft)]/50 px-3 py-1.5 text-xs font-medium text-[var(--ink)]">
                          {s.feedback}
                        </p>
                      ) : null}
                    </div>

                    {s.st === 'pending' && !isGrading ? (
                      <button
                        type="button"
                        onClick={() => {
                          setGradingId(s.id);
                          setGradeScore('95');
                          setGradeFeedback('');
                        }}
                        className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                      >
                        <CheckCircle size={14} weight="bold" aria-hidden="true" />
                        <span>{ts.gradeBtn}</span>
                      </button>
                    ) : null}
                  </div>

                  {isGrading ? (
                    <div className="mt-3 space-y-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                        <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
                          <span>{ts.scoreLabel}</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={gradeScore}
                            onChange={(e) => setGradeScore(e.target.value)}
                            className="h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-mono text-sm font-semibold text-[var(--ink)]"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
                          <span>{ts.feedbackLabel}</span>
                          <textarea
                            rows={2}
                            value={gradeFeedback}
                            onChange={(e) => setGradeFeedback(e.target.value)}
                            placeholder={ts.feedbackPlaceholder}
                            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--ink)]"
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = Number.parseInt(gradeScore, 10);
                            const clamped = Number.isNaN(parsed)
                              ? 90
                              : Math.max(0, Math.min(100, parsed));
                            onGradeHomework?.(
                              s.id,
                              clamped,
                              gradeFeedback.trim(),
                            );
                            setGradingId(null);
                          }}
                          className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--lime)] px-4 py-1.5 text-xs font-extrabold text-[#0F172A] transition hover:brightness-95"
                        >
                          <Check size={14} weight="bold" aria-hidden="true" />
                          <span>
                            {ts.saveGradeBtn} (+{s.pts} XP)
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGradingId(null)}
                          className="inline-flex min-h-[36px] cursor-pointer items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
                        >
                          {copy.chat.close}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
