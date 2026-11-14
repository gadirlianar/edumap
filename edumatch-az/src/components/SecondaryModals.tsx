'use client';

import React, { useState } from 'react';
import { Check, WarningCircle } from '@phosphor-icons/react';
import { LEVELS, RANK_TIERS } from '@/data/catalog';
import { COPY, LEVEL_LABELS } from '@/data/i18n';
import { resolveLocalized } from '@/data/tutors';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { ModalShell } from '@/components/ui/ModalShell';
import { getLevelFromFraction } from '@/lib/matching';
import type {
  Locale,
  TutorHomework,
  TutorTest,
  TutorVideo,
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
  onClose: () => void;
}

export function VideoPlayerModal({
  open,
  locale,
  video,
  onClose,
}: VideoPlayerModalProps) {
  const copy = COPY[locale];
  if (!video) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={resolveLocalized(video.title, locale)}
      subtitle={video.dur}
      closeLabel={copy.profileModal.back}
      maxWidthClass="max-w-xl"
    >
      {video.url ? (
        <video
          controls
          autoPlay
          playsInline
          src={video.url}
          className="w-full rounded-2xl bg-black"
        />
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--ink)] p-8 text-center text-[var(--bg)]">
          <AcademicEmblem iconKey="studio" size="xl" className="mx-auto mb-3 border-white/20 bg-white/10 text-[var(--accent)]" />
          <p className="text-sm font-semibold">{copy.profileModal.demoPlayerNote}</p>
        </div>
      )}
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
          placeholder={copy.profileModal.yourAnswer}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)]"
        />
        <input
          type="file"
          accept="image/*,.pdf"
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
  const done = idx >= total;

  const handleClose = () => {
    const passedId = done && !isDemo ? test.id : undefined;
    setIdx(0);
    setScore(0);
    onClose(passedId);
  };

  if (done) {
    const achievedLevel = getLevelFromFraction(score / total);
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
      className="animate-slide-up fixed bottom-20 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-2.5 rounded-full bg-[var(--ink)] py-2 pl-2.5 pr-4 text-xs font-extrabold text-[var(--bg)] shadow-lg lg:bottom-6"
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
