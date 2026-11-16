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

    // Stable per-tutor map anchors keyed by tutor.id so pins NEVER jump when radiusKm changes
    const fixedAnchors: Record<string, [number, number]> = {
      t1: [34, 68],
      t2: [68, 36],
      t3: [46, 62],
      t4: [76, 66],
      t5: [64, 48],
      t6: [57, 42],
      t7: [44, 76],
      me: [56, 64],
      t8: [73, 38],
      t9: [64, 74],
      t10: [72, 42],
      t11: [42, 70],
    };

    return activeList.map(({ tutor, dist }, idx) => {
      const fallbackAnchor: [number, number] = [
        48 + ((idx * 17) % 30),
        38 + ((idx * 23) % 36),
      ];
      const anchor = fixedAnchors[tutor.id] ?? fallbackAnchor;
      const latDelta = (baseCoords[0] - tutor.coords[0]) * 640;
      const lonDelta = (tutor.coords[1] - baseCoords[1]) * 640;
      const rawLeft = anchor[0] * 0.72 + (56 + lonDelta * 0.45) * 0.28;
      const rawTop = anchor[1] * 0.72 + (56 + latDelta * 0.45) * 0.28;
      const leftPct = Math.min(86, Math.max(22, Number(rawLeft.toFixed(2))));
      const clampedTop = Math.min(82, Math.max(28, Number(rawTop.toFixed(2))));
      // Keep top-left info card clear of pins
      const topPct = leftPct < 50 ? Math.max(60, clampedTop) : clampedTop;

      return {
        tutor,
        dist,
        within: radiusKm > 50 || dist <= radiusKm,
        leftPct,
        topPct,
      };
    });
  }, [tutors, location, radiusKm, subject]);

  const radarSvgRadius = radiusKm > 50 ? 255 : Math.max(38, Math.min(235, radiusKm * 4.4));

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
        {/* Left: Realistic Google/Apple Maps Style City Cartography */}
        <div className="relative min-h-[340px] overflow-hidden rounded-[22px] border border-[var(--border)] bg-[#F1EFE9] dark:bg-[#101B2D] sm:min-h-[395px] lg:col-span-7">
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
              className="fill-[#F3F1EB] dark:fill-[#101B2D]"
            />

            {/* Realistic Seaside / Bay Water + Boulevard Strip */}
            <path
              d="M 520 500 C 575 430, 645 405, 800 370 L 800 500 Z"
              className="fill-[#CFE4F7] dark:fill-[#16324F]"
            />
            <path
              d="M 495 500 C 555 415, 635 388, 800 352 L 800 370 C 645 405, 575 430, 520 500 Z"
              className="fill-[#D9ECD8] dark:fill-[#15362B]"
            />

            {/* Parks */}
            {!cleanLayer ? (
              <>
                <path
                  d="M 545 48 C 610 38, 705 68, 718 148 L 578 192 L 535 108 Z"
                  className="fill-[#D7EBD4] dark:fill-[#15352A]"
                />
                <path
                  d="M 18 330 C 110 318, 152 368, 138 480 L 18 480 Z"
                  className="fill-[#D7EBD4] dark:fill-[#15352A]"
                />
              </>
            ) : null}

            {/* Realistic Building Footprints (Low-contrast cartographic texture) */}
            {!cleanLayer ? (
              <g className="fill-[#E7E4DC] dark:fill-[#18273E]">
                <rect x="145" y="142" width="44" height="32" rx="3" />
                <rect x="198" y="146" width="52" height="28" rx="3" />
                <rect x="148" y="182" width="96" height="26" rx="3" />
                <rect x="304" y="142" width="38" height="34" rx="3" />
                <rect x="350" y="144" width="40" height="30" rx="3" />
                <rect x="458" y="294" width="54" height="36" rx="3" />
                <rect x="520" y="296" width="46" height="34" rx="3" />
                <rect x="462" y="340" width="88" height="28" rx="3" />
                <rect x="152" y="302" width="52" height="38" rx="3" />
                <rect x="212" y="305" width="42" height="34" rx="3" />
                <rect x="630" y="256" width="58" height="34" rx="3" />
                <rect x="696" y="258" width="48" height="32" rx="3" />
              </g>
            ) : null}

            {/* Fine Local Street Network */}
            <g className="stroke-white/95 dark:stroke-[#1E314D]" strokeWidth="4.5">
              <line x1="0" y1="78" x2="800" y2="78" />
              <line x1="0" y1="128" x2="800" y2="128" />
              <line x1="0" y1="176" x2="800" y2="176" />
              <line x1="0" y1="226" x2="800" y2="226" />
              <line x1="0" y1="358" x2="720" y2="358" />
              <line x1="0" y1="418" x2="580" y2="418" />
              <line x1="92" y1="0" x2="92" y2="500" />
              <line x1="138" y1="0" x2="138" y2="500" />
              <line x1="278" y1="0" x2="278" y2="500" />
              <line x1="342" y1="0" x2="342" y2="500" />
              <line x1="504" y1="0" x2="504" y2="460" />
              <line x1="606" y1="0" x2="606" y2="410" />
              <line x1="712" y1="0" x2="712" y2="380" />
            </g>

            {/* Secondary Collector Roads */}
            <g className="stroke-white dark:stroke-[#243A59]" strokeWidth="7.5">
              <line x1="0" y1="274" x2="800" y2="274" />
              <line x1="210" y1="0" x2="210" y2="500" />
              <line x1="564" y1="0" x2="564" y2="430" />
            </g>

            {/* Primary Arterial Avenues (Realistic Casing + Cream Highway Fill) */}
            <g fill="none" strokeLinecap="round">
              <g className="stroke-[#E3C978] dark:stroke-[#3E526E]" strokeWidth="11.5">
                <line x1="0" y1="274" x2="800" y2="274" />
                <line x1="422" y1="0" x2="422" y2="500" />
                <line x1="65" y1="468" x2="695" y2="38" />
              </g>
              <g className="stroke-[#FCE69D] dark:stroke-[#2B405E]" strokeWidth="8.5">
                <line x1="0" y1="274" x2="800" y2="274" />
                <line x1="422" y1="0" x2="422" y2="500" />
                <line x1="65" y1="468" x2="695" y2="38" />
              </g>
              {/* City Center Traffic Roundabout */}
              <circle
                cx="422"
                cy="274"
                r="14"
                className="fill-[#F3F1EB] stroke-[#E3C978] dark:fill-[#101B2D] dark:stroke-[#3E526E]"
                strokeWidth="3"
              />
              <circle
                cx="422"
                cy="274"
                r="6"
                className="fill-[#D7EBD4] dark:fill-[#15352A]"
              />
            </g>

            {/* Live Geographic Radar Radius Ring (Visualizes slider smoothly) */}
            <circle
              cx="450"
              cy="274"
              r={radarSvgRadius}
              className="fill-emerald-500/6 stroke-emerald-500/40 transition-all duration-200 dark:fill-emerald-400/8 dark:stroke-emerald-400/40"
              strokeWidth="1.5"
              strokeDasharray="6 5"
            />

            {/* Street & Park Labels */}
            <g className="fill-[#526071] text-[11px] font-semibold dark:fill-[#94A3B8]">
              <text x="582" y="118">
                {landmarks.parkTopRight}
              </text>
              <text x="48" y="404">
                {landmarks.parkBottomLeft}
              </text>
              <text x="150" y="278" className="fill-[#334155] text-[10.5px] dark:fill-[#CBD5E1]">
                {landmarks.mainRoadH}
              </text>
              <text x="585" y="278" className="fill-[#334155] text-[10.5px] dark:fill-[#CBD5E1]">
                {landmarks.mainRoadH}
              </text>
              <text
                x="235"
                y="344"
                transform="rotate(-34 235 344)"
                className="fill-[#334155] text-[10.5px] dark:fill-[#CBD5E1]"
              >
                {landmarks.diagRoad}
              </text>
            </g>

            {/* University / Landmark Badges (Positioned cleanly away from pins) */}
            <g>
              <circle cx="385" cy="452" r="4.5" fill="#10B981" />
              <text
                x="396"
                y="456"
                className="fill-[#047857] text-[11.5px] font-bold dark:fill-[#6EE7B7]"
              >
                {landmarks.campusLabel}
              </text>
              <circle cx="536" cy="212" r="4.5" fill="#2563EB" />
              <text
                x="546"
                y="216"
                className="fill-[#1D4ED8] text-[11.5px] font-bold dark:fill-[#93C5FD]"
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
                className={`group absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer transition-opacity duration-150 ${
                  pin.within ? 'opacity-100' : 'opacity-40'
                } ${isSelected ? 'z-20' : ''}`}
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
