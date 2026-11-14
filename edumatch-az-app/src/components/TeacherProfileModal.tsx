'use client';

import React from 'react';
import {
  BookOpen,
  CalendarPlus,
  CheckCircle,
  Clock,
  FilmSlate,
  GraduationCap,
  Lightning,
  Lock,
  Play,
  ShieldCheck,
  Sparkle,
  Star,
  Target,
  TrendUp,
  Trophy,
  UploadSimple,
} from '@phosphor-icons/react';
import { LANG_TO_SECTOR } from '@/data/catalog';
import {
  COPY,
  LEVEL_LABELS,
  SUBJECT_LABELS,
  sectorLabel,
} from '@/data/i18n';
import { resolveLocalized, resolveReviewAuthor, resolveReviewText, resolveTutorName } from '@/data/tutors';
import { PWA_COPY } from '@/lib/pwaCopy';
import { Avatar } from '@/components/ui/Avatar';
import { ModalShell } from '@/components/ui/ModalShell';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { computeMatchScore, getScorePercent, tutorDistanceKm } from '@/lib/matching';
import type {
  HomeworkSubmission,
  Locale,
  LocationState,
  ProfileSheetTab,
  Role,
  SearchFilters,
  StudentState,
  TutorContent,
  TutorProfile,
} from '@/types/edumatch';

interface TeacherProfileModalProps {
  open: boolean;
  tutor: TutorProfile | null;
  content: TutorContent;
  activeTab: ProfileSheetTab;
  onTabChange: (tab: ProfileSheetTab) => void;
  onClose: () => void;
  locale: Locale;
  role: Role;
  student: StudentState;
  filters: SearchFilters;
  location: LocationState;
  radiusKm: number;
  ownedCourses: Set<string>;
  completedTests: Record<string, boolean>;
  hwSubmissions: HomeworkSubmission[];
  onSendRequest: (tutorId: string, trial: boolean) => void;
  onOpenBooking?: (tutorId: string) => void;
  onPlayVideo: (tutorId: string, videoId: string) => void;
  onBuyCourse: (tutorId: string, courseId: string) => void;
  onStartTest: (tutorId: string, testId: string) => void;
  onOpenHomeworkSubmit: (tutorId: string, hwId: string) => void;
}

export function TeacherProfileModal({
  open,
  tutor,
  content,
  activeTab,
  onTabChange,
  onClose,
  locale,
  role,
  student,
  filters,
  location,
  radiusKm,
  ownedCourses,
  completedTests,
  hwSubmissions,
  onSendRequest,
  onOpenBooking,
  onPlayVideo,
  onBuyCourse,
  onStartTest,
  onOpenHomeworkSubmit,
}: TeacherProfileModalProps) {
  const copy = COPY[locale];
  if (!tutor) return null;

  const scorePct = getScorePercent(
    tutor.education.admissionScore,
    tutor.education.maxScore,
  );
  const match = computeMatchScore(tutor, student, filters, radiusKm, location);
  const distKm = tutorDistanceKm(tutor, location);
  const sectors = Array.from(new Set(tutor.lang.map((l) => LANG_TO_SECTOR[l])));

  const isVideoUnlocked = (videoId: string, free: boolean) =>
    free ||
    (role === 'teacher' && tutor.id === 'me') ||
    content.courses.some((c) => ownedCourses.has(c.id) && c.vids.includes(videoId));

  const localizedName = resolveTutorName(tutor, locale);
  const tabs: { id: ProfileSheetTab; label: string; ariaLabel: string; count?: number }[] = [
    { id: 'overview', label: copy.profileModal.tabs.overview, ariaLabel: copy.profileModal.tabs.overview },
    { id: 'videos', label: copy.profileModal.tabs.videos, ariaLabel: copy.profileModal.tabs.videos, count: content.videos.length },
    { id: 'courses', label: copy.profileModal.tabs.courses, ariaLabel: copy.profileModal.tabs.courses, count: content.courses.length },
    { id: 'tests', label: copy.profileModal.tabs.tests, ariaLabel: copy.profileModal.tabs.tests, count: content.tests.length },
    { id: 'hw', label: copy.profileModal.tabs.hw, ariaLabel: copy.profileModal.tabs.hw, count: content.hw.length },
  ];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={localizedName}
      subtitle={`${tutor.education.universityShort} · ${tutor.education.admissionScore}/${tutor.education.maxScore} · ${tutor.price} ₼ / ${copy.tutorCard.perLesson}`}
      closeLabel={copy.profileModal.close}
      maxWidthClass="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Top Dossier Identity Banner */}
        <div className="em-card rounded-3xl p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <Avatar
                id={tutor.id}
                name={localizedName}
                index={0}
                size="lg"
                verified={tutor.education.verified}
                online
              />
              <div>
                <div className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-extrabold text-[var(--accent)]">
                  <ShieldCheck size={13} weight="fill" aria-hidden="true" />
                  <span>{copy.profileModal.verifiedAcademic}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1 font-bold text-[var(--gold)]">
                    <Star size={14} weight="fill" aria-hidden="true" />
                    {tutor.rating.toFixed(1)}
                  </span>
                  <span>
                    ({tutor.n} {copy.tutorCard.reviews})
                  </span>
                  <span>·</span>
                  <span>
                    {match}% {copy.tutorCard.match}
                  </span>
                  <span>·</span>
                  <span>
                    {distKm.toFixed(distKm < 10 ? 1 : 0)} {copy.tutorCard.km}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSendRequest(tutor.id, true)}
                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
              >
                {copy.tutorCard.freeTrial}
              </button>
              {onOpenBooking ? (
                <button
                  type="button"
                  onClick={() => onOpenBooking(tutor.id)}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[#C8F542] px-4 py-2 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
                >
                  <CalendarPlus size={14} weight="bold" aria-hidden="true" />
                  {PWA_COPY[locale].booking.scheduleBtn}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onSendRequest(tutor.id, false)}
                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-2 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]"
              >
                {copy.tutorCard.messageBtn}
              </button>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-2)]">
            {resolveLocalized(tutor.bio, locale)}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {tutor.subj.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]"
              >
                {SUBJECT_LABELS[s][locale]}
              </span>
            ))}
            {sectors.map((sec) => (
              <span
                key={sec}
                className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-ink)]"
              >
                {sectorLabel(sec, locale)}
              </span>
            ))}
          </div>
        </div>

        {/* Cinematic Editorial University & Entrance Score Highlight Card */}
        <section
          aria-label={copy.profileModal.universityTitle}
          className="relative overflow-hidden rounded-3xl border border-[var(--accent-border)] bg-[var(--surface)] p-5 shadow-xs sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent)]">
                <GraduationCap size={14} weight="fill" aria-hidden="true" />
                <span>{copy.profileModal.universityTitle}</span>
              </div>
              <h3 className="text-lg font-extrabold text-[var(--ink)] sm:text-xl">
                {resolveLocalized(tutor.education.university, locale)}
              </h3>
              <p className="text-sm font-semibold text-[var(--muted)]">
                {resolveLocalized(tutor.education.faculty, locale)}
              </p>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/80 px-4 py-3">
              <ScoreGauge
                score={tutor.education.admissionScore}
                maxScore={tutor.education.maxScore}
                size="lg"
                tone="emerald"
              />
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--muted)]">
                  {copy.profileModal.admissionScore}
                </div>
                <div className="font-mono-num mt-0.5 text-2xl font-extrabold leading-none text-[var(--ink)]">
                  {tutor.education.admissionScore}
                  <span className="text-xs font-bold text-[var(--muted)]">
                    /{tutor.education.maxScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface-subtle)]"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${scorePct}%` }}
            />
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-2xl bg-[var(--surface-subtle)] p-3">
              <div className="text-[11px] font-bold text-[var(--muted)]">
                {copy.profileModal.degree}
              </div>
              <div className="mt-0.5 text-xs font-extrabold text-[var(--ink)]">
                {resolveLocalized(tutor.education.degree, locale)}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--surface-subtle)] p-3">
              <div className="text-[11px] font-bold text-[var(--muted)]">
                {copy.profileModal.admissionYear}
              </div>
              <div className="font-mono-num mt-0.5 text-xs font-extrabold text-[var(--ink)]">
                {tutor.education.admissionYear}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--surface-subtle)] p-3">
              <div className="text-[11px] font-bold text-[var(--muted)]">
                {copy.profileModal.grant}
              </div>
              <div className="mt-0.5 text-xs font-extrabold text-[var(--accent)]">
                {resolveLocalized(tutor.education.grantType, locale)}
              </div>
            </div>
            {tutor.education.extraExam ? (
              <div className="rounded-2xl bg-[var(--surface-subtle)] p-3">
                <div className="text-[11px] font-bold text-[var(--muted)]">
                  {copy.profileModal.extraExam}
                </div>
                <div className="font-mono-num mt-0.5 text-xs font-extrabold text-[var(--ink)]">
                  {tutor.education.extraExam}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Sub-Navigation Tabs inside Profile */}
        <div
          role="tablist"
          aria-label="Tutor dossier sections"
          className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1"
        >
          {tabs.map((tb) => {
            const active = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                role="tab"
                aria-label={tb.ariaLabel}
                aria-selected={active}
                onClick={() => onTabChange(tb.id)}
                className={`inline-flex min-h-[38px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition ${
                  active
                    ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                <span>{tb.label}</span>
                {typeof tb.count === 'number' ? (
                  <span
                    aria-hidden="true"
                    className={`rounded-full px-1.5 py-0.5 font-mono-num text-[10px] font-extrabold ${
                      active
                        ? 'bg-white/20 text-[var(--primary-btn-ink)]'
                        : 'bg-[var(--surface)] text-[var(--muted)]'
                    }`}
                  >
                    {tb.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' ? (
          <div className="space-y-4">
            {/* Achievements & Student Outcomes */}
            <section className="space-y-2.5">
              <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--ink)]">
                <Trophy size={16} weight="fill" className="text-[var(--gold)]" aria-hidden="true" />
                <span>{copy.profileModal.achievementsSection}</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {tutor.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5"
                  >
                    <div className="flex items-center gap-1.5 font-mono-num text-xl font-extrabold text-[var(--accent)]">
                      <TrendUp size={18} weight="bold" aria-hidden="true" />
                      <span>{ach.metric}</span>
                    </div>
                    <div className="mt-1 text-xs font-extrabold text-[var(--ink)]">
                      {resolveLocalized(ach.label, locale)}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                      {resolveLocalized(ach.detail, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Strengths & What Sets Them Apart */}
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
              <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--ink)]">
                <Lightning size={16} weight="fill" className="text-[var(--primary)]" aria-hidden="true" />
                <span>{copy.profileModal.strengthsSection}</span>
              </h3>

              <div className="mt-3 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)]/50 p-3.5">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--primary)]">
                  {copy.profileModal.differentiatorLead}
                </div>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-[var(--ink)]">
                  {resolveLocalized(tutor.strengths.differentiator, locale)}
                </p>
              </div>

              <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                {tutor.strengths.points.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 rounded-2xl bg-[var(--surface-subtle)] p-3 text-xs font-semibold text-[var(--ink)]"
                  >
                    <CheckCircle
                      size={15}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <span>{resolveLocalized(pt, locale)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-start gap-2 rounded-2xl border border-[var(--border)] px-3.5 py-2.5 text-xs">
                <Target
                  size={16}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--gold)]"
                  aria-hidden="true"
                />
                <div>
                  <span className="font-extrabold text-[var(--ink)]">
                    {copy.profileModal.bestForLabel}:{' '}
                  </span>
                  <span className="text-[var(--muted)]">
                    {resolveLocalized(tutor.strengths.bestFor, locale)}
                  </span>
                </div>
              </div>
            </section>

            {/* Certificates & Reviews */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold">
                  <Sparkle size={15} weight="fill" className="text-[var(--accent)]" aria-hidden="true" />
                  <span>{copy.profileModal.certsTitle}</span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {tutor.certs.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface-subtle)] px-3 py-2 text-xs font-bold"
                    >
                      <span>{resolveLocalized(c.name, locale)}</span>
                      {c.ok ? (
                        <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--accent)]">
                          {copy.profileModal.verified}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold">
                  <Star size={15} weight="fill" className="text-[var(--gold)]" aria-hidden="true" />
                  <span>{copy.profileModal.reviewsTitle}</span>
                </h3>
                {tutor.rev.length > 0 ? (
                  <ul className="mt-3 space-y-2.5">
                    {tutor.rev.map((r, idx) => (
                      <li
                        key={r.id ?? idx}
                        className="rounded-xl bg-[var(--surface-subtle)] p-3 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{resolveReviewAuthor(r.author ?? 'Student', locale)}</span>
                          <span className="text-[var(--gold)]">{r.stars}.0 ★</span>
                        </div>
                        <p className="mt-1 text-[var(--muted)]">{resolveReviewText(r, locale)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    {copy.profileModal.noReviewsYet}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'videos' ? (
          <div className="space-y-2.5">
            {content.videos.length > 0 ? (
              content.videos.map((v, i) => {
                const unlocked = isVideoUnlocked(v.id, v.free);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      if (!unlocked) onTabChange('courses');
                      else onPlayVideo(tutor.id, v.id);
                    }}
                    className="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 text-left transition hover:border-[var(--primary)]"
                  >
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${
                        i % 2 === 0
                          ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                          : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                      }`}
                    >
                      {unlocked ? (
                        <Play size={18} weight="fill" aria-hidden="true" />
                      ) : (
                        <Lock size={18} weight="bold" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-[var(--ink)]">
                        {resolveLocalized(v.title, locale)}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-[var(--muted)]">
                        <Clock size={12} aria-hidden="true" />
                        <span>{v.dur}</span>
                      </div>
                    </div>
                    {v.free ? (
                      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--accent)]">
                        {copy.profileModal.free}
                      </span>
                    ) : unlocked ? null : (
                      <span className="rounded-full bg-[var(--gold-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--gold)]">
                        {copy.profileModal.inCourse}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-xs text-[var(--muted)]">
                <FilmSlate size={28} className="mx-auto mb-2 opacity-60" aria-hidden="true" />
                {copy.profileModal.noVideos}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === 'courses' ? (
          <div className="space-y-3">
            {content.courses.length > 0 ? (
              content.courses.map((k) => {
                const owned = ownedCourses.has(k.id);
                return (
                  <div
                    key={k.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold">
                        {resolveLocalized(k.title, locale)}
                      </h3>
                      <span className="font-mono-num text-lg font-extrabold text-[var(--ink)]">
                        {k.price} ₼
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                      {k.vids.length} {copy.profileModal.videosCount}
                    </p>
                    {owned ? (
                      <div className="mt-3 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-xs font-bold text-[var(--accent)]">
                        {copy.profileModal.purchasedNotice}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onBuyCourse(tutor.id, k.id)}
                        className="mt-3 inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                      >
                        {copy.profileModal.buyCourse}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-xs text-[var(--muted)]">
                {copy.profileModal.noCourses}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === 'tests' ? (
          <div className="space-y-3">
            {content.tests.length > 0 ? (
              content.tests.map((te) => (
                <div
                  key={te.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold">
                      {resolveLocalized(te.title, locale)}
                    </h3>
                    {completedTests[te.id] ? (
                      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--accent)]">
                        ✓ +20 XP
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-bold text-[var(--muted)]">
                      {te.qs.length} {copy.profileModal.questionsShort}
                    </span>
                    <span className="rounded-full bg-[var(--gold-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--gold)]">
                      {copy.profileModal.takesFromLevel}: {LEVEL_LABELS[te.thr][locale]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartTest(tutor.id, te.id)}
                    className="mt-3 inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                  >
                    <BookOpen size={14} weight="bold" aria-hidden="true" />
                    {copy.profileModal.takeTest}
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-xs text-[var(--muted)]">
                {copy.profileModal.noTests}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === 'hw' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <AcademicEmblem iconKey="write" size="md" />
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-[var(--ink)]">
                  {copy.profileModal.tabs.hw}
                </div>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {localizedName} · {resolveLocalized(tutor.education.university, locale)}
                </p>
              </div>
            </div>
            {content.hw.map((h) => {
              const submission = hwSubmissions.find((s) => s.hid === h.id);
              return (
                <div
                  key={h.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold">
                      {resolveLocalized(h.title, locale)}
                    </h3>
                    <span className="font-mono-num rounded-full bg-[var(--gold-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--gold)]">
                      +{h.pts} XP
                    </span>
                  </div>
                  {submission ? (
                    <div
                      className={`mt-3 rounded-xl px-3 py-2 text-xs font-bold ${
                        submission.st === 'ok'
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'bg-[var(--gold-soft)] text-[var(--gold)]'
                      }`}
                    >
                      {submission.st === 'ok'
                        ? copy.profileModal.submittedOk
                        : copy.profileModal.submittedPending}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenHomeworkSubmit(tutor.id, h.id)}
                      className="mt-3 inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                    >
                      <UploadSimple size={14} weight="bold" aria-hidden="true" />
                      {copy.profileModal.submitWork}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
