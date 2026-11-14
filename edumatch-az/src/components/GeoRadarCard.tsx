'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowSquareOut,
  ArrowUpRight,
  Compass,
  Crosshair,
  GraduationCap,
  MapPin,
  NavigationArrow,
  Stack,
  Star,
} from '@phosphor-icons/react';
import { CITIES } from '@/data/catalog';
import { CITY_LABELS, COPY } from '@/data/i18n';
import { resolveLocalized, resolveTutorName } from '@/data/tutors';
import { Avatar } from '@/components/ui/Avatar';
import { isTutorApproved, tutorDistanceKm } from '@/lib/matching';
import type {
  CityId,
  Locale,
  LocationState,
  SubjectId,
  TutorProfile,
} from '@/types/edumatch';

interface GeoRadarCardProps {
  locale: Locale;
  location: LocationState;
  radiusKm: number;
  subject: SubjectId | '';
  tutors: TutorProfile[];
  onSelectCity: (city: CityId) => void;
  onLocateMe: () => void;
  onRadiusChange: (km: number) => void;
  onOpenTutorProfile: (tutorId: string) => void;
  getMatchScore: (tutor: TutorProfile) => number;
}

const MAP_COPY: Record<
  Locale,
  {
    mapBadge: string;
    availableNow: string;
    mapAttribution: string;
    switchLayerLabel: string;
    offlineNearbyTitle: string;
    noOfflineFallback: string;
  }
> = {
  ru: {
    mapBadge: 'Карта преподавателей',
    availableNow: 'Открыт для уроков',
    mapAttribution: 'Интерактивная карта · 2026',
    switchLayerLabel: 'Сменить вид карты',
    offlineNearbyTitle: 'Менторы на карте рядом',
    noOfflineFallback: 'Для выбранного предмета уроки доступны онлайн по всей стране.',
  },
  az: {
    mapBadge: 'Müəllim xəritəsi',
    availableNow: 'Dərsə açıqdır',
    mapAttribution: 'İnteraktiv şəhər xəritəsi · 2026',
    switchLayerLabel: 'Xəritə görünüşünü dəyiş',
    offlineNearbyTitle: 'Xəritədə yaxın müəllimlər',
    noOfflineFallback: 'Seçilən fənn üzrə dərslər ölkə üzrə onlayn keçirilir.',
  },
  en: {
    mapBadge: 'Tutor Street Map',
    availableNow: 'Open Now',
    mapAttribution: 'Interactive street map · 2026',
    switchLayerLabel: 'Switch map layer',
    offlineNearbyTitle: 'Mentors nearby on map',
    noOfflineFallback: 'Selected subject lessons are currently open online across Azerbaijan.',
  },
};

const CITY_LANDMARKS: Record<
  string,
  {
    mainRoadH: string;
    mainRoadV: string;
    diagRoad: string;
    parkTopRight: string;
    parkBottomLeft: string;
    campusLabel: string;
    hubLabel: string;
  }
> = {
  Баку: {
    mainRoadH: 'Heydər Əliyev pr.',
    mainRoadV: 'Z. Xəlilov küç.',
    diagRoad: 'Nizami küç. · 28 May',
    parkTopRight: 'Nərimanov parkı',
    parkBottomLeft: 'H. Cavid bağı',
    campusLabel: 'Bakı Dövlət Univ.',
    hubLabel: 'ADNSU / ADA mərkəzi',
  },
  Сумгайыт: {
    mainRoadH: 'Sülh küçəsi',
    mainRoadV: 'Azərbaycan pr.',
    diagRoad: 'Nərimanov küç.',
    parkTopRight: 'Nəsimi parkı',
    parkBottomLeft: 'Gənclər bağı',
    campusLabel: 'Sumqayıt Dövlət Univ.',
    hubLabel: 'Şəhər mərkəzi',
  },
  Гянджа: {
    mainRoadH: 'Atatürk pr.',
    mainRoadV: 'H. Əliyev pr.',
    diagRoad: 'Cavadxan küç.',
    parkTopRight: 'Xan bağı',
    parkBottomLeft: 'Nizami parkı',
    campusLabel: 'Gəncə Dövlət Univ.',
    hubLabel: 'Mərkəz meydanı',
  },
};

const TUTOR_DISTRICTS: Record<string, Record<Locale, string>> = {
  t1: { ru: 'Ясамал · м. Эльмляр', az: 'Yasamal · Elmlər m.', en: 'Yasamal · Elmlar' },
  t2: { ru: 'Нариманов · центр', az: 'Nərimanov m.', en: 'Narimanov' },
  t3: { ru: 'Сумгаит · Центр', az: 'Sumqayıt · Mərkəz', en: 'Sumgait · Center' },
  t4: { ru: 'Хатаи · м. Хатаи', az: 'Xətai m.', en: 'Khatai' },
  t5: { ru: 'Гянджа · ГДУ', az: 'Gəncə · GDU yanı', en: 'Ganja · GSU area' },
  t6: { ru: 'Насими · 28 Май', az: 'Nəsimi · 28 May', en: 'Nasimi · 28 May' },
  t7: { ru: 'Сабаил · Ичери Шехер', az: 'Səbail · İçərişəhər', en: 'Sabail · Old City' },
  me: { ru: 'Насими · Центр', az: 'Nəsimi · Mərkəz', en: 'Nasimi · Center' },
  t8: { ru: 'Сумгаит · 6-й мкр', az: 'Sumqayıt · 6-cı mkr', en: 'Sumgait · 6th Microdistrict' },
  t9: { ru: 'Сумгаит · 1-й мкр', az: 'Sumqayıt · 1-ci mkr', en: 'Sumgait · 1st Microdistrict' },
  t10: { ru: 'Гянджа · пр. Ататюрка', az: 'Gəncə · Atatürk pr.', en: 'Ganja · Ataturk Ave' },
  t11: { ru: 'Гянджа · пр. Г. Алиева', az: 'Gəncə · H. Əliyev pr.', en: 'Ganja · H. Aliyev Ave' },
};

export function GeoRadarCard({
  locale,
  location,
  radiusKm,
  subject,
  tutors,
  onSelectCity,
  onLocateMe,
  onRadiusChange,
  onOpenTutorProfile,
  getMatchScore,
}: GeoRadarCardProps) {
  const copy = COPY[locale];
  const mc = MAP_COPY[locale];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cleanLayer, setCleanLayer] = useState(false);

  const mapPins = useMemo(() => {
    const baseCoords: [number, number] = [location.lat, location.lon];
    const offlineOrFiltered = tutors
      .filter((t) => isTutorApproved(t))
      .filter((t) => !subject || t.subj.includes(subject))
      .filter((t) => t.fmt.includes('Офлайн') || tutors.length <= 4);

    // Scope pins accurately to the active city metro radius (<= 25 km), falling back to nearest
    // mentors only when a custom GPS coordinate sits outside all seeded city hubs.
    const withDist = offlineOrFiltered
      .map((tutor) => ({
        tutor,
        dist: tutorDistanceKm(tutor, location),
      }))
      .sort((a, b) => a.dist - b.dist);

    const cityScoped = withDist.filter((item) => item.dist <= 20);
    const activeList = cityScoped.length > 0 ? cityScoped : withDist.slice(0, 4);

    // Deterministic clean scatter anchors kept outside the top-left info card and landmark label
    const anchorPositions: Array<[number, number]> = [
      [48, 63],
      [75, 36],
      [68, 74],
      [28, 69],
      [83, 60],
      [58, 34],
    ];

    return activeList.map(({ tutor, dist }, idx) => {
      const anchor = anchorPositions[idx % anchorPositions.length];
      const latDelta = (baseCoords[0] - tutor.coords[0]) * 780;
      const lonDelta = (tutor.coords[1] - baseCoords[1]) * 780;
      const rawLeft = 58 + lonDelta * 0.68 + (anchor[0] - 58) * 0.35;
      const rawTop = 54 + latDelta * 0.68 + (anchor[1] - 54) * 0.35;
      const leftPct = Math.min(86, Math.max(20, rawLeft));
      const clampedTop = Math.min(82, Math.max(26, rawTop));
      // Prevent any pin (or its hover/active label pill) from colliding with the top-left info card
      const topPct = leftPct < 52 ? Math.max(58, clampedTop) : clampedTop;

      return {
        tutor,
        dist,
        within: radiusKm > 50 || dist <= radiusKm,
        leftPct,
        topPct,
      };
    });
  }, [tutors, location, radiusKm, subject]);

  const inRangeCount = mapPins.filter((d) => d.within).length;
  const activePin =
    mapPins.find((d) => d.tutor.id === selectedId) ?? mapPins[0] ?? null;

  const displayCity =
    location.name in CITY_LABELS
      ? CITY_LABELS[location.name as CityId][locale]
      : location.name;

  const landmarks = CITY_LANDMARKS[location.name] ?? CITY_LANDMARKS['Баку'];

  return (
    <section
      id="tutor-map"
      aria-label={mc.mapBadge}
      className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-6"
    >
      <div className="grid items-stretch gap-5 lg:grid-cols-12">
        {/* Left: Crisp Google-Maps-Style Street Canvas */}
        <div className="relative min-h-[340px] overflow-hidden rounded-[22px] border border-[var(--border)] bg-[#F3F2EC] dark:bg-[#132033] sm:min-h-[390px] lg:col-span-7">
          {/* Vector Street Grid SVG */}
          <svg
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            {/* Base Land */}
            <rect
              width="800"
              height="500"
              className="fill-[#F4F3EE] dark:fill-[#132033]"
            />

            {/* Parks */}
            {!cleanLayer ? (
              <>
                <path
                  d="M 520 55 C 585 45, 690 70, 705 160 L 555 215 L 510 120 Z"
                  className="fill-[#D4ECD2] dark:fill-[#16382C]"
                />
                <path
                  d="M 18 320 C 115 305, 165 360, 145 480 L 18 480 Z"
                  className="fill-[#D4ECD2] dark:fill-[#16382C]"
                />
              </>
            ) : null}

            {/* Caspian / River Curve */}
            <path
              d="M 110 215 C 245 190, 390 255, 530 240 C 635 230, 725 270, 800 315"
              fill="none"
              strokeWidth="20"
              className="stroke-[#D0E4FB] dark:stroke-[#1B3A5C]"
            />

            {/* Urban City Blocks */}
            {!cleanLayer ? (
              <g className="fill-[#EAE8E0] dark:fill-[#1A2B45]">
                <rect x="135" y="135" width="120" height="85" rx="8" />
                <rect x="295" y="140" width="95" height="75" rx="8" />
                <rect x="445" y="295" width="135" height="105" rx="8" />
                <rect x="130" y="300" width="115" height="115" rx="8" />
                <rect x="615" y="280" width="115" height="90" rx="8" />
              </g>
            ) : null}

            {/* Minor White Streets */}
            <g className="stroke-white dark:stroke-[#233754]" strokeWidth="10">
              <line x1="0" y1="115" x2="800" y2="115" />
              <line x1="0" y1="225" x2="800" y2="225" />
              <line x1="0" y1="395" x2="800" y2="395" />
              <line x1="120" y1="0" x2="120" y2="500" />
              <line x1="275" y1="0" x2="275" y2="500" />
              <line x1="600" y1="0" x2="600" y2="500" />
              <line x1="720" y1="0" x2="720" y2="500" />
            </g>

            {/* Primary Pastel-Amber Avenues (casing + fill) */}
            <g fill="none" strokeLinecap="round">
              {/* Avenue Outer Border */}
              <g className="stroke-[#E3B84E] dark:stroke-[#465770]" strokeWidth="19">
                <line x1="0" y1="305" x2="800" y2="305" />
                <line x1="418" y1="0" x2="418" y2="500" />
                <line x1="45" y1="475" x2="685" y2="35" />
              </g>
              {/* Avenue Inner Fill */}
              <g className="stroke-[#FCE192] dark:stroke-[#2E4466]" strokeWidth="14">
                <line x1="0" y1="305" x2="800" y2="305" />
                <line x1="418" y1="0" x2="418" y2="500" />
                <line x1="45" y1="475" x2="685" y2="35" />
              </g>
            </g>

            {/* Street & University Labels */}
            <g className="fill-[#475569] text-[12px] font-semibold dark:fill-[#94A3B8]">
              <text x="565" y="138">
                {landmarks.parkTopRight}
              </text>
              <text x="72" y="405">
                {landmarks.parkBottomLeft}
              </text>
              <text x="145" y="309" className="fill-[#334155] dark:fill-[#CBD5E1]">
                {landmarks.mainRoadH}
              </text>
              <text x="550" y="309" className="fill-[#334155] dark:fill-[#CBD5E1]">
                {landmarks.mainRoadH}
              </text>
              <text
                x="230"
                y="348"
                transform="rotate(-35 230 348)"
                className="fill-[#334155] dark:fill-[#CBD5E1]"
              >
                {landmarks.diagRoad}
              </text>
            </g>

            {/* University / Landmark Dots */}
            <g>
              <circle cx="430" cy="448" r="5" fill="#10B981" />
              <text
                x="442"
                y="452"
                className="fill-[#047857] text-[13px] font-bold dark:fill-[#6EE7B7]"
              >
                {landmarks.campusLabel}
              </text>
              <circle cx="485" cy="248" r="5" fill="#2563EB" />
              <text
                x="496"
                y="252"
                className="fill-[#1D4ED8] text-[12px] font-bold dark:fill-[#93C5FD]"
              >
                {landmarks.hubLabel}
              </text>
            </g>
          </svg>

          {/* Top-Left Floating Map Place Card (Google-Maps-style overlay) */}
          {activePin ? (
            <div className="relative z-30 m-3 max-w-[270px] rounded-2xl border border-[var(--border)] bg-[var(--surface)]/96 p-3.5 shadow-[var(--shadow-float)] backdrop-blur-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#10B981]" />
                    <span className="truncate text-[13px] font-bold text-[var(--ink)]">
                      {resolveTutorName(activePin.tutor, locale)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                    {TUTOR_DISTRICTS[activePin.tutor.id]?.[locale] ?? displayCity} ·{' '}
                    {activePin.tutor.education.admissionScore}/
                    {activePin.tutor.education.maxScore} · {activePin.dist.toFixed(1)}{' '}
                    {copy.tutorCard.km}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenTutorProfile(activePin.tutor.id)}
                    aria-label={copy.radar.openProfile}
                    title={copy.radar.openProfile}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
                  >
                    <ArrowSquareOut size={13} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenTutorProfile(activePin.tutor.id)}
                    aria-label={displayCity}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
                  >
                    <NavigationArrow size={13} weight="fill" />
                  </button>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--ink)]">
                  <span>{activePin.tutor.rating.toFixed(1)}</span>
                  <Star size={12} weight="fill" className="text-amber-500" aria-hidden="true" />
                  <span className="font-normal text-[var(--muted)]">
                    ({activePin.tutor.n})
                  </span>
                </span>

                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-ink)]">
                  {mc.availableNow}
                </span>
              </div>
            </div>
          ) : null}

          {/* Interactive Google-Style Map Pins */}
          {mapPins.map((pin) => {
            const localizedName = resolveTutorName(pin.tutor, locale);
            const isSelected = activePin?.tutor.id === pin.tutor.id;
            return (
              <button
                key={pin.tutor.id}
                type="button"
                onClick={() => setSelectedId(pin.tutor.id)}
                aria-label={`${localizedName} (${pin.dist.toFixed(1)} ${copy.tutorCard.km})`}
                style={{ left: `${pin.leftPct}%`, top: `${pin.topPct}%` }}
                className={`group absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer transition-transform ${
                  pin.within ? 'opacity-100' : 'opacity-45'
                } ${isSelected ? 'z-20 scale-110' : 'hover:scale-105'}`}
              >
                {isSelected ? (
                  <span className="mb-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--ink)] shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)] ring-1 ring-[var(--accent)]" />
                    <span>{localizedName.split(' ')[0]}</span>
                    <span className="font-mono-num text-[var(--accent-ink)]">
                      {pin.tutor.education.admissionScore}
                    </span>
                  </span>
                ) : null}
                <div className="flex flex-col items-center">
                  <MapPin
                    size={isSelected ? 34 : 26}
                    weight="fill"
                    className={
                      isSelected
                        ? 'text-[#EA4335] drop-shadow-md'
                        : 'text-[#0F172A] opacity-85 drop-shadow-sm dark:text-[#C8F542]'
                    }
                  />
                </div>
              </button>
            );
          })}

          {/* Bottom Attribution + Map Action Controls */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-end justify-between">
            <span className="rounded-md bg-[var(--surface)]/85 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)] backdrop-blur-xs">
              {mc.mapAttribution}
            </span>

            <div className="pointer-events-auto flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setCleanLayer((prev) => !prev)}
                aria-label={mc.switchLayerLabel}
                title={mc.switchLayerLabel}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-sm transition-colors hover:border-[var(--ink)]"
              >
                <Stack size={15} weight="bold" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onLocateMe}
                aria-label={copy.radar.locateMe}
                title={copy.radar.locateMe}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-sm transition-colors hover:border-[var(--ink)]"
              >
                <Crosshair size={15} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: City Filter Controls & Selected Mentor Quick Card */}
        <div className="flex flex-col justify-between gap-4 lg:col-span-5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-ink)]">
                  <Compass size={13} weight="fill" aria-hidden="true" />
                  <span>{mc.mapBadge}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--ink)]">
                  {displayCity}
                </h3>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{copy.radar.hint}</p>
              </div>

              <button
                type="button"
                onClick={onLocateMe}
                className="inline-flex min-h-[34px] shrink-0 cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              >
                <Crosshair size={13} weight="bold" aria-hidden="true" />
                <span>{copy.radar.locateMe}</span>
              </button>
            </div>

            {/* City Switcher Pills */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(Object.keys(CITIES) as CityId[]).map((city) => {
                const active = !location.isCustom && location.name === city;
                return (
                  <button
                    key={city}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedId(null);
                      onSelectCity(city);
                    }}
                    className={`min-h-[32px] cursor-pointer rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-xs'
                        : 'bg-[var(--surface-subtle)] text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {CITY_LABELS[city][locale]}
                  </button>
                );
              })}
            </div>

            {/* Radius Slider */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--muted)]">{copy.radar.radiusLabel}</span>
                <span className="font-mono-num text-[var(--accent-ink)]">
                  {radiusKm > 50
                    ? locale === 'az'
                      ? 'Hamısı'
                      : locale === 'ru'
                        ? 'Все'
                        : 'All'
                    : `${radiusKm} ${copy.tutorCard.km}`}{' '}
                  · {inRangeCount}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={51}
                step={1}
                value={radiusKm}
                aria-label={copy.radar.radiusLabel}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-[var(--accent)]"
              />
            </div>

            {/* Nearby Mentors Selector */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {mc.offlineNearbyTitle}
              </div>

              {mapPins.length > 0 ? (
                <div className="grid max-h-[220px] grid-cols-1 gap-1.5 overflow-y-auto pr-0.5">
                  {mapPins.slice(0, 6).map((pin, idx) => {
                    const name = resolveTutorName(pin.tutor, locale);
                    const isSelected = activePin?.tutor.id === pin.tutor.id;
                    const district = TUTOR_DISTRICTS[pin.tutor.id]?.[locale];
                    return (
                      <button
                        key={pin.tutor.id}
                        type="button"
                        onClick={() => setSelectedId(pin.tutor.id)}
                        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border p-2.5 text-left transition-all duration-150 ${
                          isSelected
                            ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]/55'
                            : 'border-[var(--border)] bg-[var(--surface-subtle)]/50 hover:border-[var(--border-strong)]'
                        } ${pin.within ? 'opacity-100' : 'opacity-60'}`}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <Avatar
                            id={pin.tutor.id}
                            name={name}
                            index={idx}
                            size="sm"
                            verified={pin.tutor.education.verified}
                          />
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold text-[var(--ink)]">
                              {name}
                            </div>
                            <div className="flex items-center gap-1 truncate text-[11px] text-[var(--muted)]">
                              <GraduationCap size={11} weight="fill" aria-hidden="true" />
                              <span className="truncate">
                                {district ?? resolveLocalized(pin.tutor.education.university, locale)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="font-mono-num text-[11px] font-bold text-[var(--accent-ink)]">
                            {pin.tutor.education.admissionScore}/{pin.tutor.education.maxScore}
                          </div>
                          <div className="font-mono-num text-[10px] text-[var(--muted)]">
                            {pin.dist.toFixed(1)} {copy.tutorCard.km}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/60 p-3 text-xs text-[var(--muted)]">
                  {mc.noOfflineFallback}
                </p>
              )}
            </div>
          </div>

          {activePin ? (
            <button
              type="button"
              onClick={() => onOpenTutorProfile(activePin.tutor.id)}
              className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-between gap-2 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-semibold text-[var(--primary-btn-ink)] transition-colors hover:bg-[var(--primary-btn-hover)]"
            >
              <span>
                {copy.radar.openProfile} · {getMatchScore(activePin.tutor)}%
              </span>
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
