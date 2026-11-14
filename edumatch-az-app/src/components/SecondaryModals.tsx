'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CheckCircle,
  GraduationCap,
  NotePencil,
  Pause,
  Play,
  Sparkle,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react';
import { LEVELS, RANK_TIERS } from '@/data/catalog';
import { COPY, LEVEL_LABELS } from '@/data/i18n';
import { resolveLocalized } from '@/data/tutors';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { ModalShell } from '@/components/ui/ModalShell';
import { getLevelFromFraction } from '@/lib/matching';
import { PWA_COPY } from '@/lib/pwaCopy';
import type {
  Locale,
  TutorHomework,
  TutorTest,
  TutorVideo,
  VideoNoteItem,
} from '@/types/edumatch';

interface PremiumModalProps {
  open: boolean;
  locale: Locale;
  onClose: () => void;
  onActivate: (plan: string) => void;
}

export function PremiumModal({
  open,
  locale,
  onClose,
  onActivate,
}: PremiumModalProps) {
  const copy = COPY[locale];
  const recommended = copy.teacher.plans[1] ?? copy.teacher.plans[0];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={copy.modals.premiumTitle}
      closeLabel={copy.chat.close}
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4">
        <AcademicEmblem iconKey="money" size="xl" className="mx-auto" />
        <ul className="space-y-2 text-sm font-medium">
          {copy.teacher.premiumPerks.slice(0, 3).map((p) => (
            <li key={p} className="flex items-start gap-2">
              <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onActivate(recommended.label)}
            className="min-h-[40px] flex-1 cursor-pointer rounded-full bg-[var(--primary-btn)] px-5 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
          >
            {recommended.label} · {recommended.price}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] cursor-pointer rounded-full border border-[var(--border)] px-5 py-2 text-xs font-bold"
          >
            {copy.modals.premiumLater}
          </button>
        </div>

        <p className="text-xs text-[var(--muted)]">{copy.modals.premiumDemoNote}</p>
      </div>
    </ModalShell>
  );
}

interface VideoPlayerModalProps {
  open: boolean;
  locale: Locale;
  video: TutorVideo | null;
  tutorName?: string;
  watched?: boolean;
  notes?: VideoNoteItem[];
  onClose: () => void;
  onMarkWatched?: (videoId: string) => void;
  onSaveNote?: (videoId: string, timeSec: number, text: string) => void;
  onDeleteNote?: (videoId: string, noteId: string) => void;
}

function parseDurationSec(dur: string): number {
  const parts = dur.split(':').map((n) => Number.parseInt(n, 10));
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return Math.max(60, parts[0] * 60 + parts[1]);
  }
  return 360;
}

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function VideoPlayerModal({
  open,
  locale,
  video,
  tutorName,
  watched = false,
  notes = [],
  onClose,
  onMarkWatched,
  onSaveNote,
  onDeleteNote,
}: VideoPlayerModalProps) {
  if (!open || !video) return null;

  return (
    <VideoPlayerModalContent
      key={video.id}
      open={open}
      locale={locale}
      video={video}
      tutorName={tutorName}
      watched={watched}
      notes={notes}
      onClose={onClose}
      onMarkWatched={onMarkWatched}
      onSaveNote={onSaveNote}
      onDeleteNote={onDeleteNote}
    />
  );
}

interface VideoPlayerModalContentProps extends Omit<VideoPlayerModalProps, 'video'> {
  video: NonNullable<VideoPlayerModalProps['video']>;
}

function VideoPlayerModalContent({
  open,
  locale,
  video,
  tutorName,
  watched = false,
  notes = [],
  onClose,
  onMarkWatched,
  onSaveNote,
  onDeleteNote,
}: VideoPlayerModalContentProps) {
  const copy = COPY[locale];
  const vc = PWA_COPY[locale].videoPlayer;
  const parsedSec = useMemo(() => parseDurationSec(video.dur), [video.dur]);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setMediaDuration] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const autoMarkedRef = useRef<string | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const timeRef = useRef(0);
  const speedRef = useRef(speed);
  const watchedRef = useRef(watched);
  const onMarkWatchedRef = useRef(onMarkWatched);

  useEffect(() => {
    speedRef.current = speed;
    watchedRef.current = watched;
    onMarkWatchedRef.current = onMarkWatched;
  });

  const totalSec = mediaDuration ?? parsedSec;

  const maybeAutoMarkWatched = useCallback(
    (timeSec: number, durationSec: number) => {
      if (
        durationSec > 0 &&
        timeSec / durationSec >= 0.8 &&
        !watchedRef.current &&
        autoMarkedRef.current !== video.id
      ) {
        autoMarkedRef.current = video.id;
        onMarkWatchedRef.current?.(video.id);
      }
    },
    [video.id],
  );

  useEffect(() => {
    if (!open || !playing || video.url) return;
    const id = window.setInterval(() => {
      const next = Math.min(totalSec, timeRef.current + speedRef.current);
      timeRef.current = next;
      setCurrentTime(next);
      maybeAutoMarkWatched(next, totalSec);
      if (next >= totalSec) {
        setPlaying(false);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [maybeAutoMarkWatched, open, playing, totalSec, video.url]);

  const seekToTime = (nextSec: number) => {
    const clamped = Math.max(0, Math.min(totalSec, nextSec));
    timeRef.current = clamped;
    setCurrentTime(clamped);
    if (videoElRef.current) {
      videoElRef.current.currentTime = clamped;
    }
    maybeAutoMarkWatched(clamped, totalSec);
  };

  const title = resolveLocalized(video.title, locale);
  const pct = totalSec > 0 ? Math.min(100, Math.round((currentTime / totalSec) * 100)) : 0;

  const chapters = [
    {
      idx: 0,
      startSec: 0,
      label:
        locale === 'az'
          ? '1. Baza anlayışlar və DİM strukturu'
          : locale === 'en'
            ? '1. Core Concept & Exam Pattern'
            : '1. Базовая логика и модель DİM',
      boardHint:
        locale === 'az'
          ? `${title}: əsas şərtləri yazın, səhv tələlərini əvvəldən işarələyin.`
          : locale === 'en'
            ? `${title}: isolate constraints first and map the common exam trap.`
            : `${title}: сначала фиксируем ограничения и типовые ловушки варианта.`,
    },
    {
      idx: 1,
      startSec: Math.round(totalSec * 0.35),
      label:
        locale === 'az'
          ? '2. Addım-addım real məsələ həlli'
          : locale === 'en'
            ? '2. Live Guided Problem Walkthrough'
            : '2. Пошаговый разбор экзаменационной задачи',
      boardHint:
        locale === 'az'
          ? 'Addım 1: Məchulları qruplaşdırın -> Addım 2: İxtisar və ya əvəzləmə aparın.'
          : locale === 'en'
            ? 'Step 1: Group invariants -> Step 2: Simplify edge boundaries cleanly.'
            : 'Шаг 1: Выделяем ключевой инвариант -> Шаг 2: Проверяем граничные случаи.',
    },
    {
      idx: 2,
      startSec: Math.round(totalSec * 0.72),
      label:
        locale === 'az'
          ? '3. Yekun xülasə və yoxlama texnikası'
          : locale === 'en'
            ? '3. 15-Second Answer Sanity Check'
            : '3. Быстрая самопроверка и чек-лист ответа',
      boardHint:
        locale === 'az'
          ? 'Cavabı əks yoxlama ilə 15 saniyədə test edin və vahidləri unutmayın.'
          : locale === 'en'
            ? 'Sanity-check boundary values in 15 seconds before locking your answer.'
            : 'Быстро подставьте контрольное значение, чтобы исключить вычислительную ошибку.',
    },
  ];

  const activeChapter =
    [...chapters].reverse().find((ch) => currentTime >= ch.startSec) ?? chapters[0];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !onSaveNote) return;
    onSaveNote(video.id, Math.round(currentTime), noteInput.trim());
    setNoteInput('');
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={title}
      subtitle={`${tutorName ? `${tutorName} · ` : ''}${video.dur}`}
      closeLabel={copy.profileModal.back}
      maxWidthClass="max-w-3xl"
    >
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-3">
          {video.url ? (
            <video
              ref={videoElRef}
              controls
              autoPlay
              playsInline
              src={video.url}
              onLoadedMetadata={(e) => {
                const dur = Math.round(e.currentTarget.duration);
                if (Number.isFinite(dur) && dur > 0) {
                  setMediaDuration(dur);
                }
              }}
              onTimeUpdate={(e) => {
                const t = Math.floor(e.currentTarget.currentTime);
                timeRef.current = t;
                setCurrentTime(t);
                const d =
                  Number.isFinite(e.currentTarget.duration) && e.currentTarget.duration > 0
                    ? e.currentTarget.duration
                    : totalSec;
                maybeAutoMarkWatched(t, d);
              }}
              className="w-full rounded-2xl bg-black"
            />
          ) : (
            <div className="rounded-3xl border border-[var(--border)] bg-[#0F172A] p-5 text-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-semibold text-[#C8F542]">
                  <Sparkle size={12} weight="fill" aria-hidden="true" />
                  {vc.boardLabel}
                </span>
                <span className="font-mono text-white/75">
                  {formatClock(currentTime)} / {formatClock(totalSec)} ({pct}%)
                </span>
              </div>

              <div className="my-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                  {activeChapter.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/95">
                  {activeChapter.boardHint}
                </p>
              </div>

              <input
                type="range"
                min={0}
                max={totalSec}
                value={currentTime}
                aria-label={vc.progressLabel}
                onChange={(e) => seekToTime(Number(e.target.value))}
                className="w-full accent-[#C8F542]"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#C8F542] px-4 py-1.5 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
                >
                  {playing ? (
                    <>
                      <Pause size={13} weight="bold" aria-hidden="true" />
                      {vc.pauseBtn}
                    </>
                  ) : (
                    <>
                      <Play size={13} weight="fill" aria-hidden="true" />
                      {vc.playBtn}
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  {([1, 1.25, 1.5] as const).map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSpeed(rate)}
                      className={`cursor-pointer rounded-full px-2.5 py-1 font-mono text-[11px] font-bold transition ${
                        speed === rate
                          ? 'bg-white text-[#0F172A]'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chapters List */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {vc.chaptersTitle}
            </p>
            <div className="mt-2 space-y-1.5">
              {chapters.map((ch) => {
                const isActive = ch.idx === activeChapter.idx;
                return (
                  <button
                    key={ch.idx}
                    type="button"
                    onClick={() => {
                      seekToTime(ch.startSec);
                      if (videoElRef.current) {
                        void videoElRef.current.play().catch(() => undefined);
                      } else {
                        setPlaying(true);
                      }
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                      isActive
                        ? 'border-transparent bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <span className="truncate">{ch.label}</span>
                    <span className="font-mono text-[11px] opacity-80">
                      {formatClock(ch.startSec)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Study Notes & Completion Sidebar */}
        <div className="flex flex-col justify-between gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <NotePencil size={14} weight="bold" aria-hidden="true" />
                {vc.notesTitle}
              </p>
              {watched && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle size={12} weight="fill" aria-hidden="true" />
                  {vc.watchedBadge}
                </span>
              )}
            </div>

            {onSaveNote && (
              <form onSubmit={handleSaveNote} className="space-y-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder={vc.notePlaceholder}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-xs text-[var(--ink)] outline-none"
                />
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-full bg-[var(--primary-btn)] px-3 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:opacity-90"
                >
                  {vc.addNoteBtn}
                </button>
              </form>
            )}

            <div className="max-h-48 space-y-1.5 overflow-y-auto">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]/70 p-2.5 text-xs"
                >
                  <div>
                    <span className="mr-1.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      [{formatClock(n.timeSec)}]
                    </span>
                    <span className="text-[var(--ink)]">{n.text}</span>
                  </div>
                  {onDeleteNote && (
                    <button
                      type="button"
                      onClick={() => onDeleteNote(video.id, n.id)}
                      aria-label={vc.deleteNoteLabel}
                      className="shrink-0 cursor-pointer text-[var(--muted)] hover:text-rose-500"
                    >
                      <Trash size={13} weight="bold" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {onMarkWatched && !watched && (
            <button
              type="button"
              onClick={() => onMarkWatched(video.id)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#C8F542] px-4 py-2.5 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
            >
              <CheckCircle size={15} weight="bold" aria-hidden="true" />
              {vc.markWatchedBtn}
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

interface PartnerCourseModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  enrolled: boolean;
  onEnroll: () => void;
}

export function PartnerCourseModal({
  open,
  onClose,
  locale,
  enrolled,
  onEnroll,
}: PartnerCourseModalProps) {
  const c = PWA_COPY[locale].teacherSync;
  const closeLabel = locale === 'az' ? 'Bağla' : locale === 'en' ? 'Close' : 'Закрыть';

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={c.partnerTitle}
      subtitle={c.partnerSubtitle}
      maxWidthClass="max-w-lg"
      closeLabel={closeLabel}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0F172A] text-[#C8F542]">
            <GraduationCap size={22} weight="duotone" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--ink)]">{c.partnerTitle}</p>
            <p className="text-xs text-[var(--muted)]">{c.partnerSubtitle}</p>
          </div>
        </div>

        <ul className="space-y-2">
          {c.partnerHighlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-medium text-[var(--ink)]"
            >
              <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-emerald-500" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--ink)]"
          >
            {closeLabel}
          </button>
          {enrolled ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle size={15} weight="fill" aria-hidden="true" />
              {c.partnerEnrolledBadge}
            </span>
          ) : (
            <button
              type="button"
              onClick={onEnroll}
              className="cursor-pointer rounded-full bg-[#C8F542] px-5 py-2 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
            >
              {c.partnerEnrollBtn}
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

interface HomeworkSubmitModalProps {
  open: boolean;
  locale: Locale;
  hw: TutorHomework | null;
  onClose: () => void;
  onSubmit: (text: string, fileName: string) => void;
  onNotify: (msg: string, cat?: string) => void;
}

export function HomeworkSubmitModal({
  open,
  locale,
  hw,
  onClose,
  onSubmit,
  onNotify,
}: HomeworkSubmitModalProps) {
  const copy = COPY[locale];
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  if (!hw) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={resolveLocalized(hw.title, locale)}
      subtitle={`+${hw.pts} XP`}
      closeLabel={copy.profileModal.back}
      maxWidthClass="max-w-lg"
    >
      <div className="space-y-3">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label={copy.profileModal.yourAnswer}
          placeholder={copy.profileModal.yourAnswer}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)]"
        />
        <input
          type="file"
          accept="image/*,.pdf"
          aria-label={copy.profileModal.submitWork}
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          className="block w-full text-xs text-[var(--muted)]"
        />
        <button
          type="button"
          onClick={() => {
            if (!text.trim() && !fileName) {
              onNotify(copy.profileModal.needAnswerOrFile, 'wow');
              return;
            }
            onSubmit(text.trim(), fileName);
            setText('');
            setFileName('');
          }}
          className="min-h-[40px] cursor-pointer rounded-full bg-[var(--primary-btn)] px-5 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
        >
          {copy.profileModal.send} (+{hw.pts} XP)
        </button>
      </div>
    </ModalShell>
  );
}

interface ThresholdTestModalProps {
  open: boolean;
  locale: Locale;
  test: TutorTest | null;
  isDemo: boolean;
  onClose: (passedTestId?: string) => void;
}

export function ThresholdTestModal({
  open,
  locale,
  test,
  isDemo,
  onClose,
}: ThresholdTestModalProps) {
  const copy = COPY[locale];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  if (!test) return null;

  const total = test.qs.length;
  const done = total === 0 || idx >= total;

  const handleClose = () => {
    const passedId = done && total > 0 && !isDemo ? test.id : undefined;
    setIdx(0);
    setScore(0);
    onClose(passedId);
  };

  if (done) {
    const achievedLevel = getLevelFromFraction(total > 0 ? score / total : 0);
    const passes = LEVELS.indexOf(achievedLevel) >= LEVELS.indexOf(test.thr);
    return (
      <ModalShell
        open={open}
        onClose={handleClose}
        title={resolveLocalized(test.title, locale)}
        closeLabel={copy.quiz.done}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4 text-center">
          <AcademicEmblem
            iconKey={passes ? 'honors' : 'curious'}
            size="xl"
            className="mx-auto"
          />
          <h3 className="text-xl font-extrabold">
            {copy.quiz.levelLabel}: {LEVEL_LABELS[achievedLevel][locale]}
          </h3>
          <p className="font-mono-num text-sm font-bold text-[var(--muted)]">
            {score}/{total}
            {isDemo ? '' : ' · +20 XP'}
          </p>
          <div
            className={`flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-extrabold ${
              passes
                ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'bg-[var(--gold-soft)] text-[var(--gold)]'
            }`}
          >
            {passes ? (
              <span>{copy.quiz.passThreshold}</span>
            ) : (
              <>
                <WarningCircle size={16} weight="fill" aria-hidden="true" />
                <span>
                  {copy.quiz.belowThreshold} {LEVEL_LABELS[test.thr][locale]}
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[40px] cursor-pointer rounded-full bg-[var(--primary-btn)] px-6 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
          >
            {copy.quiz.done}
          </button>
        </div>
      </ModalShell>
    );
  }

  const q = test.qs[idx];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title={resolveLocalized(test.title, locale)}
      subtitle={`${copy.quiz.questionOf} ${idx + 1}/${total} · ${copy.quiz.thresholdLabel}: ${LEVEL_LABELS[test.thr][locale]}`}
      closeLabel={copy.chat.close}
      maxWidthClass="max-w-lg"
    >
      <div className="space-y-4">
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${(idx / total) * 100}%` }}
          />
        </div>
        <h3 className="text-lg font-extrabold">{resolveLocalized(q.prompt, locale)}</h3>
        <div className="space-y-2">
          {q.options.map((opt, k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === q.correctIndex) setScore((s) => s + 1);
                setIdx((i) => i + 1);
              }}
              className="flex min-h-[46px] w-full cursor-pointer items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-left text-sm font-bold hover:border-[var(--primary)]"
            >
              {resolveLocalized(opt, locale)}
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

interface RankUpModalProps {
  rankIndex: number | null;
  locale: Locale;
  onClose: () => void;
}

export function RankUpModal({ rankIndex, locale, onClose }: RankUpModalProps) {
  const copy = COPY[locale];
  if (rankIndex === null) return null;
  const tier = RANK_TIERS[rankIndex];
  if (!tier) return null;

  return (
    <ModalShell
      open={true}
      onClose={onClose}
      title={copy.quiz.newRankTitle}
      closeLabel={copy.quiz.ok}
      maxWidthClass="max-w-sm"
    >
      <div className="space-y-3 text-center">
        <AcademicEmblem iconKey={tier.iconKey} size="xl" className="mx-auto" />
        <h3 className="text-2xl font-extrabold text-[var(--accent)]">
          {resolveLocalized(tier.title, locale)}
        </h3>
        <p className="text-xs text-[var(--muted)]">{copy.quiz.stickerUnlocked}</p>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] cursor-pointer rounded-full bg-[var(--primary-btn)] px-6 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
        >
          {copy.quiz.ok}
        </button>
      </div>
    </ModalShell>
  );
}

export function ToastBanner({
  toast,
}: {
  toast: { message: string; iconKey: string } | null;
}) {
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="em-liquid-dock animate-slide-up fixed bottom-[calc(7.6rem+env(safe-area-inset-bottom,0px))] left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4 text-xs font-extrabold text-[var(--ink)] lg:bottom-16"
    >
      <AcademicEmblem iconKey={toast.iconKey} size="xs" />
      <span>{toast.message}</span>
    </div>
  );
}

export function ConfettiOverlay({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  const shapes = ['#C8F542', '#10B981', '#38BDF8', '#0F172A', '#34D399'];
  return (
    <div key={burstKey} aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece h-2.5 w-2.5 rounded-sm"
          style={{
            left: `${(i * 5.4 + (i % 3) * 2) % 96}vw`,
            backgroundColor: shapes[i % shapes.length],
            animationDelay: `${(i % 5) * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}
