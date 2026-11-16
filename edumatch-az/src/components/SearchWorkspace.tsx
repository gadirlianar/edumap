'use client';

import React, { useRef, useState } from 'react';
import {
  ArrowCounterClockwise,
  ArrowRight,
  ChalkboardTeacher,
  GraduationCap,
  Heart,
  MapPin,
  PaperPlaneTilt,
  Scales,
  SlidersHorizontal,
  Sparkle,
  Star,
  TrendUp,
  X,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import {
  FORMATS,
  GRADES,
  SUBJECTS,
  TEACHING_LANGUAGES,
  TEACHING_STYLES,
} from '@/data/catalog';
import {
  COPY,
  FORMAT_LABELS,
  GRADE_LABELS,
  LANG_LABELS,
  LEVEL_LABELS,
  STYLE_LABELS,
  SUBJECT_LABELS,
} from '@/data/i18n';
import { resolveLocalized, resolveTutorName } from '@/data/tutors';
import { COMPARE_COPY } from '@/data/tutorVisuals';
import { GeoRadarCard } from '@/components/GeoRadarCard';
import { HeroOpening } from '@/components/HeroOpening';
import { TutorCard } from '@/components/TutorCard';
import { TutorCompareModal } from '@/components/TutorCompareModal';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { Avatar } from '@/components/ui/Avatar';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import {
  computeMatchScore,
  hasOfflineFormat,
  tutorDistanceKm,
} from '@/lib/matching';
import type {
  CityId,
  Locale,
  LocationState,
  SearchFilters,
  StudentState,
  TutorProfile,
} from '@/types/edumatch';

interface SearchWorkspaceProps {
  locale: Locale;
  tutors: TutorProfile[];
  filteredTutors: TutorProfile[];
  featuredTutors: TutorProfile[];
  filters: SearchFilters;
  onFiltersChange: (patch: Partial<SearchFilters>) => void;
  student: StudentState;
  favorites: Set<string>;
  promoDays: number;
  location: LocationState;
  radiusKm: number;
  swipeIndex: number;
  onSwipeSkip: () => void;
  onSwipeLike: (id: string) => void;
  onSwipeReset: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenProfile: (id: string) => void;
  onSendRequest: (id: string, trial: boolean) => void;
  onOpenQuizTab: () => void;
  onOpenTour: () => void;
  onSwitchToTeacher: () => void;
  onSelectCity: (city: CityId) => void;
  onLocateMe: () => void;
  onRadiusChange: (km: number) => void;
  tutorsOpen: boolean;
  onTutorsOpenChange: (open: boolean) => void;
}

export function SearchWorkspace({
  locale,
  tutors,
  filteredTutors,
  featuredTutors,
  filters,
  onFiltersChange,
  student,
  favorites,
  promoDays,
  location,
  radiusKm,
  swipeIndex,
  onSwipeSkip,
  onSwipeLike,
  onSwipeReset,
  onToggleFavorite,
  onOpenProfile,
  onSendRequest,
  onOpenQuizTab,
  onOpenTour,
  onSwitchToTeacher,
  onSelectCity,
  onLocateMe,
  onRadiusChange,
  tutorsOpen,
  onTutorsOpenChange,
}: SearchWorkspaceProps) {
  const copy = COPY[locale];
  const cmp = COMPARE_COPY[locale];
  const catalogRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [extraFiltersOpen, setExtraFiltersOpen] = useState(false);

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const getMatchScore = (tutor: TutorProfile) =>
    computeMatchScore(tutor, student, filters, radiusKm, location);

  const getDistance = (tutor: TutorProfile) =>
    hasOfflineFormat(tutor) ? tutorDistanceKm(tutor, location) : null;

  const openCatalog = () => {
    onTutorsOpenChange(true);
    window.setTimeout(() => {
      const el = catalogRef.current ?? document.getElementById('tutor-catalog');
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const scrollToMap = () => {
    const mapEl = mapRef.current ?? document.getElementById('tutor-map');
    if (mapEl && typeof mapEl.scrollIntoView === 'function') {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleCompare = (tutorId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(tutorId)) {
        return prev.filter((id) => id !== tutorId);
      }
      if (prev.length === 0) {
        return [tutorId];
      }
      if (prev.length === 1) {
        setCompareModalOpen(true);
        return [prev[0], tutorId];
      }
      setCompareModalOpen(true);
      return [prev[1], tutorId];
    });
  };

  const handleOpenCompareNow = () => {
    if (compareIds.length === 0) {
      const defA = featuredTutors[0]?.id ?? tutors[0]?.id ?? 't1';
      const defB =
        featuredTutors[1]?.id ??
        tutors.find((t) => t.id !== defA)?.id ??
        't4';
      setCompareIds([defA, defB]);
    } else if (compareIds.length === 1) {
      const firstId = compareIds[0];
      const secondId =
        filteredTutors.find((t) => t.id !== firstId)?.id ??
        tutors.find((t) => t.id !== firstId)?.id ??
        firstId;
      setCompareIds([firstId, secondId]);
    }
    setCompareModalOpen(true);
  };

  const handleSelectCompareSlot = (slotIdx: 0 | 1, tutorId: string) => {
    setCompareIds((prev) => {
      const a = prev[0] ?? tutors[0]?.id ?? 't1';
      const b =
        prev[1] ?? tutors.find((t) => t.id !== a)?.id ?? tutors[0]?.id ?? 't4';
      if (slotIdx === 0) {
        const nextB = b === tutorId ? a : b;
        return [tutorId, nextB];
      }
      const nextA = a === tutorId ? b : a;
      return [nextA, tutorId];
    });
  };

  const currentSwipeTutor =
    filters.mode === 'swipe' && swipeIndex < filteredTutors.length
      ? filteredTutors[swipeIndex]
      : null;

  const extraFilterCount =
    (filters.lang ? 1 : 0) + (filters.sty ? 1 : 0) + (filters.price < 60 ? 1 : 0);

  const stackedPreviewTutors = (
    filteredTutors.length > 0 ? filteredTutors : tutors
  ).slice(0, 4);

  return (
    <div>
      {/* 2-Column Solaris Split-Hero with Live Top-Mentor Showcase */}
      <HeroOpening
        locale={locale}
        selectedSubject={filters.subj}
        selectedGrade={filters.cat}
        resultCount={filteredTutors.length}
        spotlightTutors={filteredTutors.length > 0 ? filteredTutors : tutors}
        onSubjectChange={(subj) => onFiltersChange({ subj })}
        onGradeChange={(cat) => onFiltersChange({ cat })}
        onQuickApply={openCatalog}
        onOpenMap={scrollToMap}
        onOpenQuiz={onOpenQuizTab}
        onOpenTour={onOpenTour}
        onSwitchToTeacher={onSwitchToTeacher}
        onOpenCompare={handleOpenCompareNow}
        onOpenProfile={onOpenProfile}
        onSendRequest={onSendRequest}
      />

      {/* Unified Sleek Catalog & 1v1 VS Dock (No Redundant 4-Box Bento Clutter Above It) */}
      {!tutorsOpen ? (
        <div
          id="tutor-catalog-toggle"
          className="em-card flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-[var(--border)] bg-[var(--surface)]/95 p-4 shadow-[var(--shadow-card)] sm:px-6 sm:py-4"
        >
          <div className="flex min-w-0 items-center gap-3.5">
            {/* Clickable Stacked Studio Portraits */}
            <div className="hidden -space-x-2 hover:space-x-1 transition-all duration-200 sm:flex">
              {stackedPreviewTutors.map((t, i) => {
                const previewName = resolveTutorName(t, locale);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onOpenProfile(t.id)}
                    aria-label={`${previewName} (${t.education.admissionScore}/${t.education.maxScore})`}
                    title={`${previewName} · ${t.education.admissionScore}/${t.education.maxScore} DİM`}
                    className="cursor-pointer rounded-full ring-2 ring-[var(--surface)] transition-transform duration-150 hover:z-10 hover:-translate-y-0.5 hover:scale-105"
                  >
                    <Avatar
                      id={t.id}
                      name={previewName}
                      index={i}
                      size="sm"
                      verified={t.education.verified}
                    />
                  </button>
                );
              })}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-[var(--ink)] sm:text-lg">
                  {copy.search.title}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 font-mono-num text-xs font-semibold text-[var(--accent-ink)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {filteredTutors.length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCompareNow}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-4 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <Scales size={14} weight="bold" className="text-[var(--accent-ink)]" aria-hidden="true" />
              <span>1v1 VS</span>
            </button>

            <button
              type="button"
              onClick={openCatalog}
              aria-expanded={false}
              className="group inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-2.5 rounded-full bg-[var(--primary-btn)] py-1.5 pl-4 pr-1.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)] sm:text-sm"
            >
              <ChalkboardTeacher size={16} weight="bold" aria-hidden="true" />
              <span>
                {locale === 'az'
                  ? `Müəllimləri göstər (${filteredTutors.length})`
                  : locale === 'en'
                    ? `Show tutors (${filteredTutors.length})`
                    : `Показать репетиторов (${filteredTutors.length})`}
              </span>
              <span
                aria-hidden="true"
                className="grid h-7 w-7 place-items-center rounded-full bg-[var(--lime)] text-[#0F172A] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <ArrowRight size={14} weight="bold" />
              </span>
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          key="panel-catalog"
          ref={catalogRef}
          id="tutor-catalog"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
        {/* Completed Diagnostic Status Strip (shown cleanly once user has a test result) */}
        {student.test ? (
          <div className="em-card flex flex-wrap items-center justify-between gap-3 rounded-[22px] px-5 py-3">
            <div className="flex items-center gap-2.5 text-sm">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-ink)]">
                <Sparkle size={15} weight="fill" aria-hidden="true" />
              </span>
              <span>
                <strong className="font-semibold text-[var(--ink)]">
                  {copy.search.levelBannerDone}{' '}
                  {LEVEL_LABELS[student.test.level][locale]}
                </strong>{' '}
                <span className="text-[var(--muted)]">
                  ({student.test.score}/5,{' '}
                  {SUBJECT_LABELS[student.test.subj][locale]}).{' '}
                  {copy.search.levelBannerPremiumHint}
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenQuizTab}
              className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
            >
              {copy.search.takeQuiz}
            </button>
          </div>
        ) : null}

        {/* Pill-First Anti-Boxy Toolbar & Instant Filters */}
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/95 p-4 shadow-[var(--shadow-card)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-xl">
                {copy.search.title}
              </h2>
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 font-mono-num text-xs font-semibold text-[var(--accent-ink)]">
                {filteredTutors.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={scrollToMap}
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--surface-subtle)] px-3.5 text-xs font-semibold text-[var(--ink-2)] transition-all duration-150 hover:bg-[var(--accent-soft)]/60 hover:text-[var(--ink)] active:scale-[0.97]"
              >
                <MapPin size={13} weight="bold" aria-hidden="true" />
                <span>{locale === 'az' ? 'Xəritə' : locale === 'en' ? 'Map' : 'На карте'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCompareNow}
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--surface-subtle)] px-3.5 text-xs font-semibold text-[var(--ink)] transition-all duration-150 hover:bg-[var(--accent-soft)]/60 active:scale-[0.97]"
              >
                <Scales size={14} weight="bold" aria-hidden="true" />
                <span>
                  {cmp.vsButtonShort}
                  {compareIds.length > 0 ? ` (${compareIds.length})` : ''}
                </span>
              </button>

              <div
                className="flex rounded-full bg-[var(--surface-subtle)] p-0.5"
                role="group"
                aria-label="View mode"
              >
                <button
                  type="button"
                  aria-pressed={filters.mode === 'feed'}
                  onClick={() => onFiltersChange({ mode: 'feed' })}
                  className={`min-h-[30px] cursor-pointer rounded-full px-3.5 text-xs font-semibold transition-all duration-150 ${
                    filters.mode === 'feed'
                      ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {copy.search.modeFeed}
                </button>
                <button
                  type="button"
                  aria-pressed={filters.mode === 'swipe'}
                  onClick={() => onFiltersChange({ mode: 'swipe' })}
                  className={`min-h-[30px] cursor-pointer rounded-full px-3.5 text-xs font-semibold transition-all duration-150 ${
                    filters.mode === 'swipe'
                      ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                      : 'text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {copy.search.modeSwipe}
                </button>
              </div>

              <button
                type="button"
                aria-pressed={filters.fav}
                onClick={() => onFiltersChange({ fav: !filters.fav })}
                className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                  filters.fav
                    ? 'bg-[var(--accent-soft)] text-[var(--accent-ink)] ring-1 ring-[var(--accent)]/40'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] hover:bg-[var(--accent-soft)]/50'
                }`}
              >
                <Heart
                  size={13}
                  weight={filters.fav ? 'fill' : 'bold'}
                  aria-hidden="true"
                />
                <span>
                  {copy.search.favorites} · {favorites.size}
                </span>
              </button>

              <button
                type="button"
                aria-expanded={extraFiltersOpen}
                onClick={() => setExtraFiltersOpen((v) => !v)}
                className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                  extraFiltersOpen || extraFilterCount > 0
                    ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink)] hover:bg-[var(--accent-soft)]/50'
                }`}
              >
                <SlidersHorizontal size={13} weight="bold" aria-hidden="true" />
                <span>
                  {copy.search.filtersBtn}
                  {extraFilterCount > 0 ? ` (${extraFilterCount})` : ''}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onTutorsOpenChange(false)}
                aria-expanded={true}
                aria-label={
                  locale === 'az' ? 'Müəllimləri gizlət' : locale === 'en' ? 'Hide tutors' : 'Свернуть репетиторов'
                }
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
              >
                <X size={13} weight="bold" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {locale === 'az' ? 'Gizlət' : locale === 'en' ? 'Hide' : 'Свернуть'}
                </span>
              </button>
            </div>
          </div>

          {/* Instant 1-Click Pill Filters (Zero Lag, Non-Boxy) */}
          <div className="mt-4 space-y-3 border-t border-[var(--border)]/70 pt-3.5">
            {/* Subject Row */}
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={copy.search.subject}>
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {copy.search.subject}
              </span>
              <button
                type="button"
                aria-pressed={filters.subj === ''}
                onClick={() => onFiltersChange({ subj: '' })}
                className={`min-h-[32px] cursor-pointer rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                  filters.subj === ''
                    ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:bg-[var(--accent-soft)]/55 hover:text-[var(--ink)]'
                }`}
              >
                {copy.search.any}
              </button>
              {SUBJECTS.map((s) => {
                const active = filters.subj === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onFiltersChange({ subj: active ? '' : s })}
                    className={`min-h-[32px] cursor-pointer rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                      active
                        ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                        : 'bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:bg-[var(--accent-soft)]/55 hover:text-[var(--ink)]'
                    }`}
                  >
                    {SUBJECT_LABELS[s][locale]}
                  </button>
                );
              })}
            </div>

            {/* Format + Grade + Sort Segmented Tracks */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
              {/* Format */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {copy.search.format}
                </span>
                <div
                  role="group"
                  aria-label={copy.search.format}
                  className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
                >
                  <button
                    type="button"
                    aria-pressed={filters.fmt === ''}
                    onClick={() => onFiltersChange({ fmt: '' })}
                    className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                      filters.fmt === ''
                        ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {copy.search.any}
                  </button>
                  {FORMATS.map((f) => {
                    const active = filters.fmt === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onFiltersChange({ fmt: active ? '' : f })}
                        className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                          active
                            ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                            : 'text-[var(--muted)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {FORMAT_LABELS[f][locale]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grade */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {copy.search.grade}
                </span>
                <div
                  role="group"
                  aria-label={copy.search.grade}
                  className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
                >
                  <button
                    type="button"
                    aria-pressed={filters.cat === ''}
                    onClick={() => onFiltersChange({ cat: '' })}
                    className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                      filters.cat === ''
                        ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {copy.search.any}
                  </button>
                  {GRADES.map((g) => {
                    const active = filters.cat === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onFiltersChange({ cat: active ? '' : g })}
                        className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                          active
                            ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                            : 'text-[var(--muted)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {GRADE_LABELS[g][locale]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {copy.search.sort}
                </span>
                <div
                  role="group"
                  aria-label={copy.search.sort}
                  className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
                >
                  {(
                    [
                      ['match', copy.search.sortMatch],
                      ['dist', copy.search.sortDist],
                      ['rating', copy.search.sortRating],
                      ['price', copy.search.sortPrice],
                    ] as Array<[SearchFilters['sort'], string]>
                  ).map(([val, label]) => {
                    const active = filters.sort === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onFiltersChange({ sort: val })}
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

          {/* Progressive Extra Filters Drawer (Language, Max Price, Teaching Style) */}
          <AnimatePresence initial={false}>
            {extraFiltersOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.14 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3 border-t border-[var(--border)]/70 pt-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                        {copy.search.language}
                      </span>
                      <div
                        role="group"
                        aria-label={copy.search.language}
                        className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[var(--surface-subtle)] p-1"
                      >
                        <button
                          type="button"
                          aria-pressed={filters.lang === ''}
                          onClick={() => onFiltersChange({ lang: '' })}
                          className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                            filters.lang === ''
                              ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                              : 'text-[var(--muted)] hover:text-[var(--ink)]'
                          }`}
                        >
                          {copy.search.any}
                        </button>
                        {TEACHING_LANGUAGES.map((l) => {
                          const active = filters.lang === l;
                          return (
                            <button
                              key={l}
                              type="button"
                              aria-pressed={active}
                              onClick={() => onFiltersChange({ lang: active ? '' : l })}
                              className={`min-h-[28px] cursor-pointer rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                                active
                                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
                              }`}
                            >
                              {LANG_LABELS[l][locale]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="flex min-w-[210px] flex-1 items-center gap-3 rounded-full bg-[var(--surface-subtle)] px-4 py-2 text-xs font-medium text-[var(--muted)] sm:max-w-xs">
                      <span className="shrink-0">
                        {copy.search.maxPrice}:{' '}
                        <strong className="font-mono-num text-[var(--ink)]">
                          {filters.price} ₼
                        </strong>
                      </span>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        step={5}
                        value={filters.price}
                        aria-label={copy.search.maxPrice}
                        onChange={(e) =>
                          onFiltersChange({ price: Number(e.target.value) })
                        }
                        className="w-full cursor-pointer accent-[var(--accent)]"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      {copy.search.teachingStyle}
                    </span>
                    <button
                      type="button"
                      onClick={() => onFiltersChange({ sty: '' })}
                      className={`min-h-[30px] cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                        filters.sty === ''
                          ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                          : 'bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:bg-[var(--accent-soft)]/55'
                      }`}
                    >
                      {copy.search.allStyles}
                    </button>
                    {TEACHING_STYLES.map((st) => {
                      const active = filters.sty === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => onFiltersChange({ sty: active ? '' : st })}
                          className={`min-h-[30px] cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.97] ${
                            active
                              ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                              : 'bg-[var(--surface-subtle)] text-[var(--ink-2)] hover:bg-[var(--accent-soft)]/55'
                          }`}
                        >
                          {STYLE_LABELS[st][locale]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Feed / Swipe Results Area (Full-Width Balanced Grid — No Narrow Squeezed 3-Card Orphans) */}
        {filteredTutors.length > 0 ? (
          filters.mode === 'feed' ? (
            <div className="grid min-w-0 gap-5 md:grid-cols-2">
              {filteredTutors.map((tutor, idx) => (
                <div
                  key={tutor.id}
                  className={
                    filteredTutors.length === 1
                      ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-xl'
                      : 'min-w-0'
                  }
                >
                  <TutorCard
                    tutor={tutor}
                    index={idx}
                    locale={locale}
                    isPromoted={tutor.id === 'me' && promoDays > 0}
                    isFavorite={favorites.has(tutor.id)}
                    isCompared={compareIds.includes(tutor.id)}
                    matchScore={getMatchScore(tutor)}
                    distanceKm={getDistance(tutor)}
                    studentLevel={student.test ? student.test.level : null}
                    onToggleFavorite={onToggleFavorite}
                    onToggleCompare={handleToggleCompare}
                    onOpenProfile={onOpenProfile}
                    onSendRequest={onSendRequest}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Tactile Single-Card Editorial Swipe Deck */
            <div className="mx-auto max-w-lg py-2">
              {currentSwipeTutor ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSwipeTutor.id}
                    initial={{ opacity: 0, y: 12, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -24, scale: 0.98 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-float)] sm:p-7"
                  >
                    <div className="flex justify-center">
                      <Avatar
                        id={currentSwipeTutor.id}
                        name={resolveTutorName(currentSwipeTutor, locale)}
                        index={swipeIndex}
                        size="xl"
                        verified={currentSwipeTutor.education.verified}
                      />
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--ink)]">
                      <button
                        type="button"
                        onClick={() => onOpenProfile(currentSwipeTutor.id)}
                        className="cursor-pointer underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--accent-ink)]"
                      >
                        {resolveTutorName(currentSwipeTutor, locale)}
                      </button>
                    </h3>

                    <div className="mt-1.5 flex items-center justify-center gap-2 text-xs font-medium text-[var(--muted)]">
                      <span className="inline-flex items-center gap-1 font-semibold text-[var(--ink)]">
                        <Star
                          size={13}
                          weight="fill"
                          className="text-[var(--accent)]"
                          aria-hidden="true"
                        />
                        {currentSwipeTutor.rating.toFixed(1)}
                      </span>
                      <span>·</span>
                      <span className="font-mono-num text-[var(--ink)]">
                        {currentSwipeTutor.price} ₼
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-[var(--accent-ink)]">
                        {getMatchScore(currentSwipeTutor)}% {copy.tutorCard.match}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-4 border-y border-[var(--border)] py-4 text-left">
                      <ScoreGauge
                        score={currentSwipeTutor.education.admissionScore}
                        maxScore={currentSwipeTutor.education.maxScore}
                        size="sm"
                        tone="emerald"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-ink)]">
                          <GraduationCap size={13} weight="fill" aria-hidden="true" />
                          <span>
                            {currentSwipeTutor.education.admissionScore}/
                            {currentSwipeTutor.education.maxScore}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[var(--ink)]">
                          {resolveLocalized(
                            currentSwipeTutor.education.university,
                            locale,
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 divide-x divide-[var(--border)] text-left">
                      {currentSwipeTutor.achievements.slice(0, 2).map((ach, i) => (
                        <div key={ach.id} className={i === 0 ? 'pr-3' : 'pl-3'}>
                          <div className="flex items-center gap-1 font-mono-num text-xs font-semibold text-[var(--accent-ink)]">
                            <TrendUp size={12} weight="bold" aria-hidden="true" />
                            <span>{ach.metric}</span>
                          </div>
                          <div className="mt-0.5 line-clamp-2 text-[11px] text-[var(--muted)]">
                            {resolveLocalized(ach.label, locale)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-[var(--ink-2)]">
                      {resolveLocalized(
                        currentSwipeTutor.strengths.differentiator,
                        locale,
                      )}
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {currentSwipeTutor.subj.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 text-xs font-medium text-[var(--ink)]"
                        >
                          {SUBJECT_LABELS[s][locale]}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={onSwipeSkip}
                        aria-label={copy.search.skip}
                        title={copy.search.skip}
                        className="flex h-13 w-13 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                      >
                        <X size={20} weight="bold" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSwipeLike(currentSwipeTutor.id)}
                        aria-label={copy.search.like}
                        title={copy.search.like}
                        className="flex h-13 w-13 cursor-pointer items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)] transition-colors hover:bg-[var(--primary-btn)] hover:text-[var(--primary-btn-ink)]"
                      >
                        <Heart size={20} weight="fill" aria-hidden="true" />
                      </button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSendRequest(currentSwipeTutor.id, true)}
                        aria-label={copy.search.trialShort}
                        title={copy.search.trialShort}
                        className="flex h-13 w-13 cursor-pointer items-center justify-center rounded-full bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
                      >
                        <PaperPlaneTilt size={20} weight="fill" aria-hidden="true" />
                      </motion.button>
                    </div>

                    <p className="mt-3 text-xs font-medium text-[var(--muted)]">
                      {copy.search.leftCount}{' '}
                      <span className="font-mono-num">
                        {filteredTutors.length - swipeIndex}
                      </span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="em-card rounded-3xl p-8 text-center">
                  <AcademicEmblem iconKey="finish" size="xl" className="mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">
                    {copy.search.swipeEmptyTitle}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {copy.search.swipeEmptySub}
                  </p>
                  <button
                    type="button"
                    onClick={onSwipeReset}
                    className="mt-4 inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-5 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
                  >
                    <ArrowCounterClockwise size={15} weight="bold" aria-hidden="true" />
                    {copy.search.swipeReset}
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="em-card rounded-3xl p-8 text-center">
            <AcademicEmblem iconKey="empty" size="xl" className="mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">
              {copy.search.feedEmptyTitle}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{copy.search.feedEmptySub}</p>
            <button
              type="button"
              onClick={() => {
                onFiltersChange({
                  cat: '',
                  lang: '',
                  fmt: '',
                  price: 60,
                  sty: '',
                  fav: false,
                });
                onRadiusChange(51);
              }}
              className="mt-4 inline-flex min-h-[40px] cursor-pointer items-center rounded-full bg-[var(--primary-btn)] px-5 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
            >
              {copy.search.clearFilters}
            </button>
          </div>
        )}
        </motion.div>
      )}

      {/* Full-Width Clean Google-Maps-Style City Street Map Section (always visible) */}
      <div ref={mapRef} id="tutor-map" className="mt-6">
        <GeoRadarCard
          locale={locale}
          location={location}
          radiusKm={radiusKm}
          subject={filters.subj}
          tutors={tutors}
          onSelectCity={onSelectCity}
          onLocateMe={onLocateMe}
          onRadiusChange={onRadiusChange}
          onOpenTutorProfile={onOpenProfile}
          getMatchScore={getMatchScore}
        />
      </div>

      {/* Floating Side-by-Side VS Compare Dock */}
      <AnimatePresence>
        {compareIds.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="region"
            aria-label={cmp.dockTitle}
            className="fixed bottom-16 left-1/2 z-40 w-[94vw] max-w-2xl -translate-x-1/2 sm:bottom-5"
          >
            <div className="em-glass flex flex-wrap items-center justify-between gap-3 rounded-full border border-[var(--border-strong)] px-4 py-2 shadow-[var(--shadow-float)]">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] font-mono-num text-[11px] font-bold text-[var(--bg)]">
                  VS
                </span>
                <div className="flex items-center gap-1.5">
                  {compareIds.map((cid, idx) => {
                    const ct = tutors.find((t) => t.id === cid);
                    if (!ct) return null;
                    const cName = resolveTutorName(ct, locale);
                    return (
                      <span
                        key={cid}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] py-0.5 pl-1 pr-2.5 text-xs font-semibold text-[var(--ink)]"
                      >
                        <Avatar id={ct.id} name={cName} index={idx} size="sm" />
                        <span className="max-w-[90px] truncate">{cName.split(' ')[0]}</span>
                        <span className="font-mono-num text-[10px] font-semibold text-[var(--accent-ink)]">
                          {ct.education.admissionScore}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenCompareNow}
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
                >
                  <Scales size={13} weight="bold" aria-hidden="true" />
                  <span>{cmp.dockCompareNow}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCompareIds([])}
                  className="inline-flex min-h-[34px] cursor-pointer items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  {cmp.dockClear}
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Side-by-Side VS Tutor Compare Modal */}
      <TutorCompareModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        locale={locale}
        tutors={tutors}
        compareIds={compareIds}
        onSelectSlot={handleSelectCompareSlot}
        onOpenProfile={onOpenProfile}
        onSendRequest={onSendRequest}
        getMatchScore={getMatchScore}
      />
    </div>
  );
}
