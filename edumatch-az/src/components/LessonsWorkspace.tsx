'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpenText,
  ChatCircleDots,
  CheckCircle,
  Clock,
  Star,
} from '@phosphor-icons/react';
import { REVIEW_TAGS } from '@/data/catalog';
import { COPY, STATUS_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import { resolveLocalized, resolveTutorName } from '@/data/tutors';
import { RankProgressCard } from '@/components/RankProgressCard';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { handleSpotlightMove } from '@/lib/spotlight';
import type {
  HomeworkSubmission,
  Locale,
  StudentRequest,
  TutorContent,
  TutorProfile,
} from '@/types/edumatch';

interface LessonsWorkspaceProps {
  locale: Locale;
  xp: number;
  requests: StudentRequest[];
  tutors: TutorProfile[];
  content: Record<string, TutorContent>;
  hwSubmissions: HomeworkSubmission[];
  onOpenChat: (requestId: number) => void;
  onOpenTutorProfile: (tutorId: string, tab?: 'overview' | 'hw') => void;
  onMarkLessonDone: (requestId: number) => void;
  onSubmitReview: (requestId: number, stars: number, tags: string[], comment: string) => void;
  onGoToSearch: () => void;
  onSelectRank: (rankIndex: number) => void;
}

export function LessonsWorkspace({
  locale,
  xp,
  requests,
  tutors,
  content,
  hwSubmissions,
  onOpenChat,
  onOpenTutorProfile,
  onMarkLessonDone,
  onSubmitReview,
  onGoToSearch,
  onSelectRank,
}: LessonsWorkspaceProps) {
  const copy = COPY[locale];
  const myRequests = requests.filter((r) => r.mine);

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

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Banner */}
      <div className="em-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold-soft)] px-3 py-1 text-xs font-extrabold text-[var(--gold)]">
            <BookOpenText size={14} weight="fill" aria-hidden="true" />
            <span>{copy.nav.lessons}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {copy.lessons.bannerTitle}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy.lessons.bannerSub}</p>
        </div>
        <AcademicEmblem iconKey="write" size="xl" />
      </div>

      {/* Glass KPI Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div
          onPointerMove={handleSpotlightMove}
          className="em-spotlight-card rounded-3xl p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted)]">
              {copy.lessons.requestsTile}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--ink)]" aria-hidden="true" />
          </div>
          <div className="font-mono-num mt-1.5 text-2xl font-semibold text-[var(--ink)]">
            {myRequests.length}
          </div>
        </div>
        <div
          onPointerMove={handleSpotlightMove}
          className="em-spotlight-card rounded-3xl p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted)]">
              {copy.lessons.lessonsTile}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          </div>
          <div className="font-mono-num mt-1.5 text-2xl font-semibold text-[var(--accent-ink)]">
            {myRequests.filter((r) => r.status === 'done').length}
          </div>
        </div>
        <div
          onPointerMove={handleSpotlightMove}
          className="em-spotlight-card rounded-3xl p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted)]">
              {copy.lessons.xpTile}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          </div>
          <div className="font-mono-num mt-1.5 text-2xl font-semibold text-[var(--accent-ink)]">
            {xp}
          </div>
        </div>
      </div>

      {/* Rank Card */}
      <RankProgressCard locale={locale} xp={xp} onSelectRank={onSelectRank} />

      {/* Homework Board */}
      <div className="em-card rounded-3xl p-5">
        <h2 className="text-base font-extrabold">{copy.lessons.homeworkTitle}</h2>
        <div className="mt-3 space-y-2.5">
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
        <div className="space-y-3">
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
                    <div className="mt-0.5 text-xs font-semibold text-[var(--muted)]">
                      {SUBJECT_LABELS[req.st.subj][locale]}
                      {req.trial ? ` · ${copy.lessons.trialTag}` : ''}
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

                  {req.status === 'accepted' ? (
                    <button
                      type="button"
                      onClick={() => onMarkLessonDone(req.id)}
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                    >
                      {copy.lessons.markDone}
                    </button>
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
