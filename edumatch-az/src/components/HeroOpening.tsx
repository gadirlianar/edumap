'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChalkboardTeacher,
  GraduationCap,
  MapPin,
  Sparkle,
  Star,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { resolveLocalized, resolveTutorName } from '@/data/tutors';
import { getTutorVisual } from '@/data/tutorVisuals';
import { SUBJECT_LABELS } from '@/data/i18n';
import { Avatar } from '@/components/ui/Avatar';
import type { GradeId, Locale, SubjectId, TutorProfile } from '@/types/edumatch';

interface HeroOpeningProps {
  locale: Locale;
  selectedSubject: SubjectId | '';
  selectedGrade: GradeId | '';
  resultCount: number;
  spotlightTutors: TutorProfile[];
  onSubjectChange: (subj: SubjectId | '') => void;
  onGradeChange: (cat: GradeId | '') => void;
  onQuickApply: () => void;
  onOpenMap: () => void;
  onOpenQuiz: () => void;
  onOpenTour: () => void;
  onSwitchToTeacher: () => void;
  onOpenCompare: () => void;
  onOpenProfile: (id: string) => void;
  onSendRequest: (id: string, trial: boolean) => void;
}

const HERO_COPY: Record<
  Locale,
  {
    kicker: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    subtitle: string;
    primaryCta: string;
    quizCta: string;
    metrics: Array<{ value: string; label: string }>;
    spotlightLabel: string;
    dossierCta: string;
    trialCta: string;
    trajectoryTitle: string;
  }
> = {
  ru: {
    kicker: 'Баку · Сумгаит · Гянджа · Онлайн',
    titleStart: 'Выбирайте репетитора по',
    titleAccent: 'реальным баллам',
    titleEnd: '',
    subtitle:
      'Уроки 1-на-1, видеокурсы и менторы с подтверждённым поступлением в топ-вузы. Первый пробный — 0 ₼.',
    primaryCta: 'Показать репетиторов',
    quizCta: 'Пройти тест уровня',
    metrics: [
      { value: '+145', label: 'средний рост DİM' },
      { value: '94%', label: 'поступление в целевой вуз' },
      { value: '100%', label: 'проверенные баллы DİM' },
    ],
    spotlightLabel: 'Ментор в фокусе',
    dossierCta: 'Досье',
    trialCta: 'Пробный · 0 ₼',
    trajectoryTitle: 'Рост балла ученика (DİM)',
  },
  az: {
    kicker: 'Bakı · Sumqayıt · Gəncə · Onlayn',
    titleStart: 'Müəllimi qəbul balı',
    titleAccent: 'və nəticəyə',
    titleEnd: 'görə seçin',
    subtitle:
      'Yoxlanılmış top-universitet müəllimləri, video-kurslar və fərdi dərslər. İlk sınaq dərsi — 0 ₼.',
    primaryCta: 'Müəllimləri göstər',
    quizCta: 'Səviyyə testi keç',
    metrics: [
      { value: '+145', label: 'orta DİM bal artımı' },
      { value: '94%', label: 'hədəf universitetə qəbul' },
      { value: '100%', label: 'təsdiqlənmiş DİM balı' },
    ],
    spotlightLabel: 'Seçilmiş müəllim',
    dossierCta: 'Dosye',
    trialCta: 'Sınaq · 0 ₼',
    trajectoryTitle: 'Şagird bal trayektoriyası (DİM)',
  },
  en: {
    kicker: 'Bakı · Sumqayıt · Gəncə · Onlayn',
    titleStart: 'Choose a tutor by',
    titleAccent: 'verified scores',
    titleEnd: '',
    subtitle:
      '1-on-1 live tutoring, video courses & mentors with audited university scores. First trial — 0 ₼.',
    primaryCta: 'Show tutors',
    quizCta: 'Take level quiz',
    metrics: [
      { value: '+145', label: 'avg DİM score gain' },
      { value: '94%', label: 'target uni admission' },
      { value: '100%', label: 'verified DİM scores' },
    ],
    spotlightLabel: 'Mentor Spotlight',
    dossierCta: 'Dossier',
    trialCta: 'Trial · 0 ₼',
    trajectoryTitle: 'Student DİM score trajectory',
  },
};

export function HeroOpening({
  locale,
  resultCount,
  spotlightTutors,
  onQuickApply,
  onOpenQuiz,
  onOpenProfile,
  onSendRequest,
}: HeroOpeningProps) {
  const hc = HERO_COPY[locale];
  const deck = spotlightTutors.slice(0, 4);
  const [mentorIdx, setMentorIdx] = useState(0);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 2, ry: -3 });

  const activeTutor = deck[mentorIdx % Math.max(1, deck.length)] ?? deck[0];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Math.max(-6, Math.min(6, -py * 10)),
      ry: Math.max(-8, Math.min(8, px * 12)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 2, ry: -3 });
  };

  const tutorName = activeTutor ? resolveTutorName(activeTutor, locale) : 'Gunel Rasulova';
  const tutorMeta = activeTutor ? getTutorVisual(activeTutor.id, mentorIdx) : null;
  const primarySubjLabel = activeTutor?.subj[0]
    ? SUBJECT_LABELS[activeTutor.subj[0]][locale]
    : 'Physics';

  const trajBefore = tutorMeta?.trajectory.before ?? '460';
  const trajAfter = tutorMeta?.trajectory.after ?? '648';
  const trajDelta = tutorMeta?.trajectory.delta ?? '+188';
  const trajPct = Math.max(24, Math.min(96, Math.round(tutorMeta?.trajectory.bar1Pct ?? 82)));

  return (
    <section
      aria-label="EduMatch showcase"
      className="relative mb-6 pt-3 pb-2 sm:mb-8 sm:pt-6 sm:pb-4"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        {/* LEFT COLUMN: Clean Architectural Headline, 1-Sentence Subtitle, 2 CTAs, 3 Monochrome Metrics */}
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">
            <MapPin size={13} weight="bold" className="text-[var(--accent-ink)]" aria-hidden="true" />
            <span>{hc.kicker}</span>
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3.5 text-3xl leading-[1.08] font-extrabold tracking-[-0.03em] text-[var(--ink)] sm:text-5xl lg:text-[50px]"
          >
            {hc.titleStart}{' '}
            <span className="font-serif-editorial font-normal italic text-emerald-700 dark:text-emerald-400">
              {hc.titleAccent}
            </span>
            {hc.titleEnd ? ` ${hc.titleEnd}` : ''}
          </motion.h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--ink-2)] sm:text-base">
            {hc.subtitle}
          </p>

          {/* 2 Crisp CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onQuickApply}
              className="group inline-flex min-h-[46px] cursor-pointer items-center gap-2.5 rounded-full bg-[var(--primary-btn)] py-2 pl-5 pr-2 text-sm font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
            >
              <ChalkboardTeacher size={17} weight="bold" aria-hidden="true" />
              <span>
                {hc.primaryCta} ({resultCount})
              </span>
              <span
                aria-hidden="true"
                className="grid h-7 w-7 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <ArrowRight size={14} weight="bold" />
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenQuiz}
              className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]"
            >
              <Sparkle
                size={15}
                weight="bold"
                className="text-[var(--accent-ink)]"
                aria-hidden="true"
              />
              <span>{hc.quizCta}</span>
            </button>
          </div>

          {/* 3 Clean Monochrome Typographic Metrics Separated by Subtle Vertical Hairlines */}
          <div className="mt-8 grid max-w-lg grid-cols-3 divide-x divide-[var(--border)] border-t border-[var(--border)]/80 pt-5">
            {hc.metrics.map((m, idx) => (
              <div
                key={m.value}
                className={idx === 0 ? 'pr-4' : idx === 1 ? 'px-4' : 'pl-4'}
              >
                <div className="font-mono-num text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
                  {m.value}
                </div>
                <div className="mt-0.5 text-[11px] leading-snug text-[var(--muted)] sm:text-xs">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ONE Clean, Subtly 3D-Tilted Interactive Mentor Spotlight Card */}
        <div
          className="lg:col-span-6"
          style={{ perspective: '1200px' }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
            transition={{ type: 'spring', stiffness: 160, damping: 22, mass: 0.8 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative mx-auto w-full max-w-[520px] select-none lg:max-w-none"
          >
            {activeTutor ? (
              <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0F172A] p-5 text-white shadow-[0_24px_48px_-16px_rgba(15,23,42,0.45)] sm:p-6">
                {/* Top Header: Spotlight Kicker + Subject + ‹ 1/4 › Switcher */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {hc.spotlightLabel}
                    </span>
                    <span className="text-slate-600" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-xs font-medium text-emerald-300">
                      {primarySubjLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setMentorIdx((prev) => (prev - 1 + deck.length) % Math.max(1, deck.length))
                      }
                      aria-label="Previous mentor"
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors hover:border-white/30 hover:bg-white/10"
                    >
                      <ArrowLeft size={12} weight="bold" />
                    </button>
                    <span className="font-mono-num min-w-[28px] text-center text-[11px] font-semibold text-slate-300">
                      {(mentorIdx % Math.max(1, deck.length)) + 1}/{deck.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setMentorIdx((prev) => (prev + 1) % Math.max(1, deck.length))
                      }
                      aria-label="Next mentor"
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors hover:border-white/30 hover:bg-white/10"
                    >
                      <ArrowRight size={12} weight="bold" />
                    </button>
                  </div>
                </div>

                {/* Mentor Identity + Verified DİM Badge */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(activeTutor.id)}
                      className="shrink-0 cursor-pointer rounded-full ring-1 ring-white/20 transition-transform hover:scale-105"
                    >
                      <Avatar
                        id={activeTutor.id}
                        name={tutorName}
                        index={mentorIdx}
                        size="md"
                        verified={activeTutor.education.verified}
                      />
                    </button>

                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenProfile(activeTutor.id)}
                        className="cursor-pointer truncate text-left text-base font-bold tracking-tight text-white transition-colors hover:text-emerald-300 sm:text-lg"
                      >
                        {tutorName}
                      </button>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-300">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-200">
                          <GraduationCap size={13} weight="fill" className="text-emerald-400" aria-hidden="true" />
                          <span>
                            {tutorMeta
                              ? resolveLocalized(tutorMeta.shortUniversityBadge, locale)
                              : 'UFAZ'}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono-num font-semibold text-amber-300">
                          <Star size={12} weight="fill" aria-hidden="true" />
                          {activeTutor.rating.toFixed(1)}
                        </span>
                        <span className="font-mono-num font-semibold text-slate-200">
                          {activeTutor.price} ₼
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verified DİM Score Pill */}
                  <div className="shrink-0 rounded-xl border border-emerald-400/25 bg-white/5 px-3 py-2 text-right">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                      VERIFIED DİM
                    </div>
                    <div className="font-mono-num text-base font-bold text-white sm:text-lg">
                      {activeTutor.education.admissionScore}
                      <span className="text-xs font-medium text-slate-400">
                        /{activeTutor.education.maxScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Single Clean Score Growth Trajectory Bar */}
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-300">
                      {tutorMeta
                        ? resolveLocalized(tutorMeta.trajectory.label, locale)
                        : hc.trajectoryTitle}
                    </span>
                    <span className="font-mono-num font-semibold text-emerald-300">
                      {trajBefore} → {trajAfter} ({trajDelta})
                    </span>
                  </div>

                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      key={activeTutor.id}
                      initial={{ width: '28%' }}
                      animate={{ width: `${trajPct}%` }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-emerald-400"
                    />
                  </div>
                </div>

                {/* Bottom Mentor Avatar Strip + Dossier & Trial Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {deck.map((t, idx) => {
                      const isCurr = idx === mentorIdx % deck.length;
                      const tName = resolveTutorName(t, locale);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setMentorIdx(idx)}
                          title={tName}
                          className={`cursor-pointer rounded-full transition-opacity ${
                            isCurr
                              ? 'ring-2 ring-emerald-400'
                              : 'opacity-55 hover:opacity-100'
                          }`}
                        >
                          <Avatar
                            id={t.id}
                            name={tName}
                            index={idx}
                            size="sm"
                            verified={t.education.verified}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(activeTutor.id)}
                      className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/15"
                    >
                      {hc.dossierCta}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendRequest(activeTutor.id, true)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--lime)] px-3.5 py-1.5 text-xs font-bold text-[#0F172A] transition-opacity hover:opacity-90"
                    >
                      <span>{hc.trialCta}</span>
                      <ArrowRight size={12} weight="bold" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
