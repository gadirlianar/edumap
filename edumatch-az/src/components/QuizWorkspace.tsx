'use client';

import React, { useState } from 'react';
import {
  ArrowCounterClockwise,
  ArrowRight,
  Brain,
  CheckCircle,
  Flame,
  Sparkle,
  Star,
  Ticket,
  WarningCircle,
} from '@phosphor-icons/react';
import { QUIZ_BANK, SUBJECTS } from '@/data/catalog';
import { COPY, LEVEL_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import { resolveLocalized } from '@/data/tutors';
import { RankProgressCard } from '@/components/RankProgressCard';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { getLevelNumber } from '@/lib/matching';
import type { LevelId, Locale, StudentState, SubjectId } from '@/types/edumatch';

interface QuizWorkspaceProps {
  locale: Locale;
  student: StudentState;
  onCompleteQuiz: (subj: SubjectId, score: number, level: LevelId, gainXp: number) => void;
  onGoToSearch: (subj?: SubjectId) => void;
  onSelectRank: (rankIndex: number) => void;
}

interface ActiveQuiz {
  subj: SubjectId;
  index: number;
  score: number;
  done: boolean;
  lastCorrect: boolean | null;
  gain: number;
}

export function QuizWorkspace({
  locale,
  student,
  onCompleteQuiz,
  onGoToSearch,
  onSelectRank,
}: QuizWorkspaceProps) {
  const copy = COPY[locale];
  const [session, setSession] = useState<ActiveQuiz | null>(null);

  const playerLevel = getLevelNumber(student.xp);
  const achievements = [
    { id: 'test' as const, label: copy.quiz.achievements.test, icon: Brain },
    { id: 'trial' as const, label: copy.quiz.achievements.trial, icon: Ticket },
    { id: 'review' as const, label: copy.quiz.achievements.review, icon: Star },
    { id: 'streak' as const, label: copy.quiz.achievements.streak, icon: Flame },
  ];

  const startQuiz = (subj: SubjectId) => {
    setSession({
      subj,
      index: 0,
      score: 0,
      done: false,
      lastCorrect: null,
      gain: 0,
    });
  };

  const handleAnswer = (optionIdx: number) => {
    if (!session || session.done) return;
    const questions = QUIZ_BANK[session.subj];
    const currentQ = questions[session.index];
    const isCorrect = optionIdx === currentQ.correctIndex;
    const nextScore = session.score + (isCorrect ? 1 : 0);
    const nextIndex = session.index + 1;

    if (nextIndex >= questions.length) {
      const gain = nextScore * 10 + 30;
      const computedLevel: LevelId =
        nextScore >= 5 ? 'Продвинутый' : nextScore >= 3 ? 'Средний' : 'Начальный';
      setSession({
        ...session,
        index: nextIndex,
        score: nextScore,
        done: true,
        lastCorrect: isCorrect,
        gain,
      });
      onCompleteQuiz(session.subj, nextScore, computedLevel, gain);
    } else {
      setSession({
        ...session,
        index: nextIndex,
        score: nextScore,
        lastCorrect: isCorrect,
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Header Banner */}
      <div className="em-card relative overflow-hidden rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-extrabold text-[var(--primary)]">
              <Sparkle size={14} weight="fill" aria-hidden="true" />
              <span>{copy.nav.test}</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {copy.quiz.bannerTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{copy.quiz.bannerSub}</p>
          </div>
          <AcademicEmblem iconKey="target" size="xl" />
        </div>
      </div>

      {/* Rank Card */}
      <RankProgressCard locale={locale} xp={student.xp} onSelectRank={onSelectRank} />

      {/* Level & Achievements Card */}
      <div className="em-card rounded-3xl p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold">
            {copy.quiz.levelLabel} {playerLevel}
          </h2>
          <span className="font-mono-num rounded-full bg-[var(--gold-soft)] px-3 py-1 text-xs font-extrabold text-[var(--gold)]">
            {student.xp} XP
          </span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${student.xp % 100}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {achievements.map((a) => {
            const Icon = a.icon;
            const unlocked = Boolean(student.ach[a.id]);
            return (
              <span
                key={a.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                  unlocked
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'bg-[var(--surface-subtle)] text-[var(--muted)] opacity-60'
                }`}
              >
                <Icon size={14} weight={unlocked ? 'fill' : 'regular'} aria-hidden="true" />
                {a.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Quiz Body */}
      {!session ? (
        <div className="space-y-4">
          {student.test ? (
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3 text-sm font-bold text-[var(--accent)]">
              <CheckCircle size={18} weight="fill" aria-hidden="true" />
              <span>
                {copy.quiz.lastResult} {SUBJECT_LABELS[student.test.subj][locale]} —{' '}
                {LEVEL_LABELS[student.test.level][locale]} ({student.test.score}/6)
              </span>
            </div>
          ) : null}

          <div className="em-card rounded-3xl p-5">
            <h2 className="text-lg font-extrabold">{copy.quiz.chooseSubject}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{copy.quiz.subjectHint}</p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
              {SUBJECTS.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => startQuiz(subj)}
                  className="flex min-h-[52px] cursor-pointer items-center justify-between gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/60 px-4 py-3 text-left text-sm font-extrabold text-[var(--ink)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/50"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 rounded-full bg-[var(--accent)]"
                      aria-hidden="true"
                    />
                    {SUBJECT_LABELS[subj][locale]}
                  </span>
                  <ArrowRight size={15} weight="bold" className="text-[var(--ink)]" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold text-[var(--accent)]">
              {copy.quiz.allSubjectsReady}
            </p>
          </div>
        </div>
      ) : session.done && student.test ? (
        <div className="em-card rounded-3xl p-7 text-center">
          <AcademicEmblem
            iconKey={
              student.test.level === 'Начальный'
                ? 'curious'
                : student.test.level === 'Средний'
                  ? 'analyst'
                  : 'grandmaster'
            }
            size="xl"
            className="mx-auto"
          />
          <h2 className="mt-4 text-2xl font-extrabold">
            {LEVEL_LABELS[student.test.level][locale]} {copy.quiz.resultTitle}
          </h2>
          <p className="font-mono-num mt-1 text-sm font-bold text-[var(--muted)]">
            {SUBJECT_LABELS[session.subj][locale]}: {session.score} {copy.quiz.scoreOutOf} · +
            {session.gain} XP
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            {copy.quiz.savedNote}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={() => onGoToSearch(session.subj)}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-[var(--primary-btn)] px-5 py-2 text-sm font-semibold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
            >
              <span>{copy.quiz.findTutors}</span>
              <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setSession(null)}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-bold text-[var(--ink)]"
            >
              <ArrowCounterClockwise size={15} weight="bold" aria-hidden="true" />
              <span>{copy.quiz.retake}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="em-card rounded-3xl p-6">
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${(session.index / 6) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-bold text-[var(--muted)]">
            <span>
              {copy.quiz.questionOf} {session.index + 1} / 6 ·{' '}
              {SUBJECT_LABELS[session.subj][locale]}
            </span>
            <span className="font-mono-num font-extrabold text-[var(--primary)]">
              {session.score * 10} XP
            </span>
          </div>

          {session.lastCorrect === true ? (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[var(--accent-soft)] px-4 py-2 text-sm font-extrabold text-[var(--accent)]">
              <CheckCircle size={20} weight="fill" aria-hidden="true" />
              <span>{copy.quiz.correct}</span>
            </div>
          ) : session.lastCorrect === false ? (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[var(--danger-soft)] px-4 py-2 text-sm font-extrabold text-[var(--danger)]">
              <WarningCircle size={20} weight="fill" aria-hidden="true" />
              <span>{copy.quiz.wrong}</span>
            </div>
          ) : null}

          {(() => {
            const q = QUIZ_BANK[session.subj][session.index];
            return (
              <div className="mt-5">
                <h3 className="text-xl font-extrabold text-[var(--ink)]">
                  {resolveLocalized(q.prompt, locale)}
                </h3>
                <div className="mt-4 grid gap-2.5">
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswer(idx)}
                      className="flex min-h-[48px] w-full cursor-pointer items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/50 px-4 py-3 text-left text-sm font-extrabold text-[var(--ink)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/50"
                    >
                      <span>{resolveLocalized(opt, locale)}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
