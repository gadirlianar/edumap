'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Crown,
  CurrencyCircleDollar,
  FilmSlate,
  RocketLaunch,
  ShieldCheck,
  Sparkle,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import type { GradeId, Locale, SubjectId, TutorProfile } from '@/types/edumatch';

interface HeroOpeningProps {
  locale: Locale;
  selectedSubject?: SubjectId | '';
  selectedGrade?: GradeId | '';
  resultCount: number;
  spotlightTutors?: TutorProfile[];
  onSubjectChange?: (subj: SubjectId | '') => void;
  onGradeChange?: (cat: GradeId | '') => void;
  onQuickApply: () => void;
  onOpenMap?: () => void;
  onOpenQuiz: () => void;
  onOpenTour?: () => void;
  onSwitchToTeacher?: () => void;
  onOpenCompare?: () => void;
  onOpenProfile?: (tutorId: string) => void;
  onSendRequest?: (tutorId: string, trial: boolean) => void;
}

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

const HERO_COPY: Record<
  Locale,
  {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    subtitleLead: string;
    subtitlePrice: string;
    primaryCta: string;
    quizCta: string;
    metrics: { value: string; label: string }[];
    orbCenterTop: string;
    orbCenterSub: string;
    cardTrialLabel: string;
    cardTrialValue: string;
    cardTrialSub: string;
    cardEscrowLabel: string;
    cardEscrowValue: string;
    cardEscrowSub: string;
    cardSaasLabel: string;
    cardSaasValue: string;
    cardSaasSub: string;
    cardStudioLabel: string;
    cardStudioValue: string;
  }
> = {
  ru: {
    eyebrow: 'EdTech Маркетплейс · 0 ₼ старт · Видеокурсы и PRO',
    titleStart: 'Выбирайте репетитора по',
    titleAccent: 'реальным баллам',
    titleEnd: '',
    subtitleLead: 'Единая платформа уроков, курсов и проверенных менторов. Первый пробный',
    subtitlePrice: '— 0 ₼',
    primaryCta: 'Показать репетиторов',
    quizCta: 'Пройти тест уровня',
    metrics: [
      { value: '+145', label: 'рост DİM' },
      { value: '12%', label: 'безопасная сделка' },
      { value: '19 ₼', label: 'PRO для репетиторов' },
    ],
    orbCenterTop: 'EDUMATCH',
    orbCenterSub: 'LIVE ENGINE',
    cardTrialLabel: 'Вход ученика',
    cardTrialValue: '0 ₼ → 25 ₼',
    cardTrialSub: 'Пробный → регулярные уроки',
    cardEscrowLabel: 'Модель дохода',
    cardEscrowValue: '12% Escrow',
    cardEscrowSub: 'Комиссия с каждого урока',
    cardSaasLabel: 'SaaS-подписка',
    cardSaasValue: 'PRO · 19 ₼/мес',
    cardSaasSub: 'Повторяемый MRR доход',
    cardStudioLabel: 'Видео и курсы',
    cardStudioValue: '39–69 ₼',
  },
  az: {
    eyebrow: 'EdTech Platforma · Dərs, Kurs və PRO Abunə',
    titleStart: 'Müəllimi qəbul balı',
    titleAccent: 'və nəticəyə',
    titleEnd: 'görə seçin',
    subtitleLead: 'Yoxlanılmış müəllimlər, video-kurslar və canlı dərslər. İlk sınaq',
    subtitlePrice: '— 0 ₼',
    primaryCta: 'Müəllimləri göstər',
    quizCta: 'Səviyyə testi keç',
    metrics: [
      { value: '+145', label: 'DİM artımı' },
      { value: '12%', label: 'platforma komissiyası' },
      { value: '19 ₼', label: 'müəllim PRO' },
    ],
    orbCenterTop: 'EDUMATCH',
    orbCenterSub: 'LIVE ENGINE',
    cardTrialLabel: 'Şagird axını',
    cardTrialValue: '0 ₼ → 25 ₼',
    cardTrialSub: 'Pulsuz sınaqdan daimi dərsə',
    cardEscrowLabel: 'Gəlir modeli',
    cardEscrowValue: '12% Escrow',
    cardEscrowSub: 'Hər ödənişli dərsdən komissiya',
    cardSaasLabel: 'SaaS Gəlir',
    cardSaasValue: 'PRO · 19 ₼/ay',
    cardSaasSub: 'Müəllim abunəliyi (MRR)',
    cardStudioLabel: 'Kurs satışı',
    cardStudioValue: '39–69 ₼',
  },
  en: {
    eyebrow: 'EdTech Marketplace · Lessons, Courses & PRO SaaS',
    titleStart: 'Choose a tutor by',
    titleAccent: 'verified scores',
    titleEnd: '',
    subtitleLead: 'Live tutoring, video courses & verified mentors in one place. First trial',
    subtitlePrice: '— 0 ₼',
    primaryCta: 'Show tutors',
    quizCta: 'Take level quiz',
    metrics: [
      { value: '+145', label: 'avg DİM gain' },
      { value: '12%', label: 'escrow take-rate' },
      { value: '19 ₼', label: 'tutor PRO MRR' },
    ],
    orbCenterTop: 'EDUMATCH',
    orbCenterSub: 'LIVE ENGINE',
    cardTrialLabel: 'Student Funnel',
    cardTrialValue: '0 ₼ → 25 ₼',
    cardTrialSub: 'Free trial to recurring lessons',
    cardEscrowLabel: 'Take-Rate Engine',
    cardEscrowValue: '12% Escrow',
    cardEscrowSub: 'Protected per-lesson fee',
    cardSaasLabel: 'Recurring SaaS',
    cardSaasValue: 'PRO · 19 ₼/mo',
    cardSaasSub: 'Tutor boost & studio plan',
    cardStudioLabel: 'Digital Courses',
    cardStudioValue: '39–69 ₼',
  },
};

export function HeroOpening({
  locale,
  onQuickApply,
  onOpenQuiz,
  onOpenTour,
  onSwitchToTeacher,
}: HeroOpeningProps) {
  const hc = HERO_COPY[locale];
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 4, ry: -6 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-py * 16).toFixed(2)),
      ry: Number((px * 20).toFixed(2)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 4, ry: -6 });
  };

  return (
    <section
      aria-label="EduMatch showcase"
      className="mx-auto mb-6 w-full max-w-7xl pt-5 pb-3 sm:pt-9"
    >
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-8 lg:gap-12">
        {/* LEFT COLUMN: Clean Commercial Positioning & Primary Level Quiz CTA */}
        <div className="text-center md:col-span-6 md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-[var(--accent-ink)] shadow-2xs backdrop-blur-md dark:border-emerald-400/25 dark:bg-[#121D30]/85">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <RocketLaunch size={13} weight="fill" aria-hidden="true" />
            <span>{hc.eyebrow}</span>
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: EASE_EDITORIAL }}
            className="mx-auto mt-4 max-w-xl break-words text-[2.2rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-[var(--ink)] sm:text-[2.95rem] lg:text-[3.5rem] md:mx-0"
          >
            {hc.titleStart}{' '}
            <em className="relative inline-block font-serif-editorial font-normal italic text-[var(--accent-ink)]">
              {hc.titleAccent}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 -z-10 h-2.5 rounded-full bg-[var(--lime)]/75 dark:bg-emerald-500/35"
              />
            </em>
            {hc.titleEnd ? ` ${hc.titleEnd}` : ''}
          </motion.h1>

          <p className="mx-auto mt-4 max-w-lg text-[15px] font-medium leading-relaxed text-[var(--ink-2)] sm:text-[17px] md:mx-0">
            {hc.subtitleLead}{' '}
            <strong className="whitespace-nowrap rounded-md bg-[var(--lime-soft)] px-1.5 py-0.5 font-mono-num font-bold text-[#0F172A] dark:bg-emerald-500/20 dark:text-[var(--lime)]">
              {hc.subtitlePrice}
            </strong>
            .
          </p>

          {/* Single Primary CTA (Take Level Quiz — no duplicate Show Tutors button above toggle bar) */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <motion.button
              type="button"
              onClick={onOpenQuiz}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex min-h-[52px] cursor-pointer items-center gap-3.5 rounded-full bg-[var(--primary-btn)] py-2 pl-6 pr-2 text-sm font-bold text-[var(--primary-btn-ink)] shadow-[var(--shadow-float)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[var(--primary-btn-hover)] sm:text-[15px]"
            >
              <Sparkle size={18} weight="fill" className="text-[var(--lime)] dark:text-[#0F172A]" aria-hidden="true" />
              <span>{hc.quizCta}</span>
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <ArrowRight size={15} weight="bold" />
              </span>
            </motion.button>

            <button
              type="button"
              onClick={onOpenTour}
              className="inline-flex min-h-[52px] cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/92 px-5 text-sm font-semibold text-[var(--ink)] shadow-2xs backdrop-blur-md transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            >
              <span>
                {locale === 'az'
                  ? 'Necə işləyir'
                  : locale === 'en'
                    ? 'How it works'
                    : 'Как работает'}
              </span>
            </button>
          </div>

          {/* Startup Business & Performance Strip */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-t border-[var(--border)]/70 pt-5 text-xs text-[var(--muted)] md:justify-start">
            {hc.metrics.map((m) => (
              <div key={m.label} className="flex items-baseline gap-1.5">
                <strong className="font-mono-num text-lg font-extrabold tracking-tight text-[var(--ink)]">
                  {m.value}
                </strong>
                <span className="font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Continuous 3D Interactive Monetization & Ecosystem Orbit Stage */}
        <div
          className="md:col-span-6"
          style={{ perspective: '1100px' }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
            transition={{ type: 'spring', stiffness: 150, damping: 18, mass: 0.8 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative mx-auto flex h-[390px] w-full max-w-[520px] items-center justify-center select-none sm:h-[430px] md:max-w-none"
          >
            {/* Ambient Radial Emerald-Cyan Backdrop Glow */}
            <div
              aria-hidden="true"
              style={{ transform: 'translateZ(-40px)' }}
              className="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-tr from-emerald-400/25 via-sky-400/20 to-[#C8F542]/30 blur-3xl"
            />

            {/* 3D Animated Tilted Orbit Ring 1 */}
            <div
              aria-hidden="true"
              style={{
                transform: 'translateZ(-12px) rotateX(70deg) rotateY(-18deg)',
                transformStyle: 'preserve-3d',
              }}
              className="pointer-events-none absolute h-[300px] w-[300px] sm:h-[346px] sm:w-[346px]"
            >
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="h-full w-full rounded-full border-2 border-dashed border-emerald-500/50 shadow-[0_0_32px_rgba(16,185,129,0.25)]"
              >
                <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#C8F542] shadow-[0_0_18px_#C8F542]" />
              </motion.div>
            </div>

            {/* 3D Animated Tilted Orbit Ring 2 (Counter-rotating) */}
            <div
              aria-hidden="true"
              style={{
                transform: 'translateZ(8px) rotateX(60deg) rotateY(24deg)',
                transformStyle: 'preserve-3d',
              }}
              className="pointer-events-none absolute h-[242px] w-[242px] sm:h-[280px] sm:w-[280px]"
            >
              <motion.div
                animate={{ rotateZ: -360 }}
                transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
                className="h-full w-full rounded-full border border-sky-400/55 dark:border-[#C8F542]/45"
              >
                <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_16px_#10B981]" />
              </motion.div>
            </div>

            {/* 3D Animated Vertical Gyroscope Ring 3 */}
            <div
              aria-hidden="true"
              style={{
                transform: 'translateZ(14px) rotateY(72deg) rotateX(18deg)',
                transformStyle: 'preserve-3d',
              }}
              className="pointer-events-none absolute h-[215px] w-[215px] sm:h-[248px] sm:w-[248px]"
            >
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="h-full w-full rounded-full border border-[#C8F542]/45 shadow-[0_0_24px_rgba(200,245,66,0.2)]"
              >
                <span className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_14px_#38BDF8]" />
              </motion.div>
            </div>

            {/* Central True 6-Face 3D Holographic Glass Cube + Glowing Core (Z = +26px) */}
            <motion.div
              animate={{ y: [-7, 7, -7] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(26px)', transformStyle: 'preserve-3d' }}
              className="relative z-10 flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40"
            >
              {/* Ambient Sphere Core */}
              <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-white/45 bg-gradient-to-br from-[#0F172A] via-[#0F4C5C] to-[#10B981] text-white shadow-[0_28px_64px_-10px_rgba(16,185,129,0.58),inset_0_4px_14px_rgba(255,255,255,0.45)]">
                {/* Specular Reflection */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2.5 left-4 h-12 w-20 -rotate-20 rounded-full bg-gradient-to-b from-white/45 to-transparent blur-[2px]"
                />

                {/* Real 3D Rotating 6-Face Wireframe Cube Inside Core */}
                <motion.div
                  aria-hidden="true"
                  animate={{ rotateX: [18, 378], rotateY: [24, 384] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="pointer-events-none absolute h-[74px] w-[74px]"
                >
                  {[
                    'translateZ(37px)',
                    'rotateY(180deg) translateZ(37px)',
                    'rotateY(90deg) translateZ(37px)',
                    'rotateY(-90deg) translateZ(37px)',
                    'rotateX(90deg) translateZ(37px)',
                    'rotateX(-90deg) translateZ(37px)',
                  ].map((faceTransform, i) => (
                    <span
                      key={i}
                      style={{ transform: faceTransform }}
                      className="absolute inset-0 rounded-lg border border-[#C8F542]/45 bg-emerald-400/5"
                    />
                  ))}
                </motion.div>

                <span className="font-mono-num relative z-10 text-xs font-black tracking-[0.22em] text-[#C8F542] drop-shadow-xs">
                  {hc.orbCenterTop}
                </span>
                <span className="relative z-10 mt-0.5 font-mono-num text-[10px] font-semibold tracking-wider text-emerald-100/95">
                  {hc.orbCenterSub}
                </span>
              </div>
            </motion.div>

            {/* Floating 3D Card 1 — Student Trial Funnel (Top Left, Z = +50px) */}
            <motion.button
              type="button"
              onClick={onQuickApply}
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(50px)' }}
              className="em-glass group absolute top-1 left-0 z-20 flex max-w-[168px] cursor-pointer items-center gap-2 rounded-2xl border border-white/90 bg-[var(--surface)]/92 p-2.5 text-left shadow-[0_24px_48px_-14px_rgba(15,23,42,0.22)] transition-transform hover:scale-105 dark:border-emerald-500/30 dark:bg-[#132033]/92 sm:top-6 sm:left-2 sm:max-w-[245px] sm:gap-2.5 sm:p-3"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-[var(--accent-ink)] sm:h-9 sm:w-9">
                <CurrencyCircleDollar size={18} weight="fill" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] sm:text-[10px]">
                  {hc.cardTrialLabel}
                </div>
                <div className="font-mono-num text-xs font-extrabold text-[var(--ink)] sm:text-sm">
                  {hc.cardTrialValue}
                </div>
                <div className="hidden truncate text-[10px] text-[var(--muted)] sm:block">
                  {hc.cardTrialSub}
                </div>
              </div>
            </motion.button>

            {/* Floating 3D Card 2 — 12% Commission Escrow (Top Right, Z = +62px) */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(62px)' }}
              className="absolute top-14 right-0 z-20 flex max-w-[168px] items-center gap-2 rounded-2xl border border-emerald-400/35 bg-[#0F172A]/95 p-2.5 text-white shadow-[0_28px_54px_-12px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:top-10 sm:right-2 sm:max-w-[235px] sm:gap-2.5 sm:p-3"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--lime)] text-[#0F172A] sm:h-9 sm:w-9">
                <ShieldCheck size={18} weight="fill" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 sm:text-[10px]">
                  {hc.cardEscrowLabel}
                </div>
                <div className="font-mono-num text-xs font-black text-[#C8F542] sm:text-sm">
                  {hc.cardEscrowValue}
                </div>
                <div className="hidden truncate text-[10px] text-slate-300 sm:block">
                  {hc.cardEscrowSub}
                </div>
              </div>
            </motion.div>

            {/* Floating 3D Card 3 — PRO SaaS MRR (Bottom Left, Z = +45px) */}
            <motion.button
              type="button"
              onClick={onSwitchToTeacher}
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(45px)' }}
              className="em-glass absolute bottom-14 left-0 z-20 flex max-w-[172px] cursor-pointer items-center gap-2 rounded-2xl border border-white/90 bg-[var(--surface)]/92 p-2.5 text-left shadow-[0_22px_45px_-12px_rgba(14,116,144,0.22)] transition-transform hover:scale-105 dark:border-amber-400/30 dark:bg-[#132033]/92 sm:bottom-8 sm:left-4 sm:max-w-[235px] sm:gap-2.5 sm:p-3"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-300 sm:h-9 sm:w-9">
                <Crown size={18} weight="fill" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] sm:text-[10px]">
                  {hc.cardSaasLabel}
                </div>
                <div className="font-mono-num text-xs font-extrabold text-[var(--ink)] sm:text-sm">
                  {hc.cardSaasValue}
                </div>
                <div className="hidden truncate text-[10px] text-[var(--muted)] sm:block">
                  {hc.cardSaasSub}
                </div>
              </div>
            </motion.button>

            {/* Floating 3D Card 4 — Course Storefront (Bottom Right, Z = +56px) */}
            <motion.div
              animate={{ y: [-5, 7, -5] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(56px)' }}
              className="em-glass absolute right-0 bottom-2 z-20 flex max-w-[162px] items-center gap-2 rounded-2xl border border-white/90 bg-[var(--surface)]/92 px-3 py-2 shadow-[0_22px_45px_-12px_rgba(15,23,42,0.18)] dark:border-sky-400/30 dark:bg-[#132033]/92 sm:right-5 sm:bottom-7 sm:max-w-[210px] sm:gap-2.5 sm:px-3.5 sm:py-2.5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-300">
                <FilmSlate size={17} weight="fill" aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {hc.cardStudioLabel}
                </div>
                <div className="font-mono-num text-xs font-extrabold text-[var(--ink)]">
                  {hc.cardStudioValue}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
