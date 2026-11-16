'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowSquareOut,
  ArrowUpRight,
  Compass,
  Crosshair,
  GraduationCap,
  MapPin,
  Minus,
  NavigationArrow,
  Plus,
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
    zoomInLabel: string;
    zoomOutLabel: string;
    offlineNearbyTitle: string;
    noOfflineFallback: string;
  }
> = {
  ru: {
    mapBadge: 'Карта преподавателей',
    availableNow: 'Открыт для уроков',
    mapAttribution: 'Топографическая карта · 2026',
    switchLayerLabel: 'Сменить вид карты',
    zoomInLabel: 'Приблизить',
    zoomOutLabel: 'Отдалить',
    offlineNearbyTitle: 'Менторы на карте рядом',
    noOfflineFallback: 'Для выбранного предмета уроки доступны онлайн по всей стране.',
  },
  az: {
    mapBadge: 'Müəllim xəritəsi',
    availableNow: 'Dərsə açıqdır',
    mapAttribution: 'Şəhər xəritəsi · 2026',
    switchLayerLabel: 'Xəritə görünüşünü dəyiş',
    zoomInLabel: 'Yaxınlaşdır',
    zoomOutLabel: 'Uzaqlaşdır',
    offlineNearbyTitle: 'Xəritədə yaxın müəllimlər',
    noOfflineFallback: 'Seçilən fənn üzrə dərslər ölkə üzrə onlayn keçirilir.',
  },
  en: {
    mapBadge: 'Interactive City Map',
    availableNow: 'Open Now',
    mapAttribution: 'Vector city map · 2026',
    switchLayerLabel: 'Switch map layer',
    zoomInLabel: 'Zoom in',
    zoomOutLabel: 'Zoom out',
    offlineNearbyTitle: 'Mentors nearby on map',
    noOfflineFallback: 'Selected subject lessons are currently open online across Azerbaijan.',
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

// Realistic fixed SVG coordinates (in 800x500 space) per tutor so pins match landmarks and never jump on radius change
const TUTOR_MAP_COORDS: Record<string, [number, number]> = {
  // Baku tutors around Elmlar/BDU, 28 May, Narimanov, Khatai, Old City
  t1: [305, 322],
  t2: [525, 178],
  t4: [628, 255],
  t6: [485, 248],
  t7: [392, 378],
  me: [445, 224],
  // Sumgayit tutors
  t3: [432, 265],
  t8: [575, 238],
  t9: [338, 295],
  // Ganja tutors
  t5: [438, 260],
  t10: [555, 218],
  t11: [345, 315],
};

interface CityMapProfile {
  waterPath: string;
  boulevardPath?: string;
  parks: string[];
  arterials: string[];
  highways: string[];
  localStreets: [number, number, number, number][];
  roundabouts: [number, number, number][];
  metros: { x: number; y: number; label: string }[];
  roadLabels: { x: number; y: number; text: string; rotate?: number }[];
  waterLabel?: { x: number; y: number; text: string };
}

const CITY_MAPS: Record<string, CityMapProfile> = {
  Баку: {
    waterPath:
      'M 210 500 C 260 448, 340 430, 425 415 C 505 400, 565 360, 625 322 C 685 284, 745 278, 800 288 L 800 500 Z',
    boulevardPath:
      'M 235 488 C 285 438, 355 422, 432 406 C 510 390, 570 350, 632 312 C 688 276, 745 268, 800 278 L 800 292 C 745 282, 688 288, 628 326 C 565 364, 505 404, 425 418 C 342 434, 264 452, 214 500 Z',
    parks: [
      'M 548 52 C 618 42, 702 72, 712 142 L 584 185 L 538 106 Z',
      'M 272 288 C 306 276, 338 290, 344 334 L 284 348 Z',
      'M 122 332 C 178 322, 206 355, 198 430 L 122 438 Z',
    ],
    highways: [
      'M 0 182 Q 360 198 800 132',
      'M 188 0 Q 285 215 385 415',
      'M 428 0 Q 465 185 492 385',
      'M 95 452 Q 395 292 758 68',
    ],
    arterials: [
      'M 0 264 Q 380 278 730 232',
      'M 0 335 Q 290 342 560 315',
      'M 272 68 L 284 440',
      'M 578 40 L 635 335',
    ],
    localStreets: [
      [0, 96, 800, 96],
      [0, 140, 800, 140],
      [0, 224, 780, 224],
      [0, 388, 520, 388],
      [96, 0, 96, 500],
      [148, 0, 148, 500],
      [345, 0, 345, 440],
      [525, 0, 525, 370],
      [678, 0, 678, 300],
    ],
    roundabouts: [
      [458, 256, 13],
      [278, 268, 10],
      [526, 174, 10],
    ],
    metros: [
      { x: 304, y: 312, label: 'Elmlər' },
      { x: 486, y: 242, label: '28 May' },
      { x: 526, y: 164, label: 'Nərimanov' },
      { x: 630, y: 250, label: 'Xətai' },
    ],
    roadLabels: [
      { x: 118, y: 192, text: 'Heydər Əliyev pr.' },
      { x: 545, y: 158, text: 'Heydər Əliyev pr.' },
      { x: 332, y: 294, text: 'Nizami küç.', rotate: -26 },
      { x: 405, y: 406, text: 'Dənizkənarı Bulvar' },
    ],
    waterLabel: { x: 635, y: 448, text: 'Xəzər dənizi · Bakı buxtası' },
  },
  Сумгайыт: {
    waterPath: 'M 0 0 L 800 0 L 800 92 C 560 118, 280 86, 0 112 Z',
    boulevardPath:
      'M 0 112 C 280 86, 560 118, 800 92 L 800 118 C 560 144, 280 112, 0 136 Z',
    parks: [
      'M 210 138 L 365 138 L 352 198 L 210 198 Z',
      'M 548 258 L 680 258 L 668 355 L 548 355 Z',
    ],
    highways: [
      'M 0 252 L 800 252',
      'M 426 115 L 426 500',
      'M 0 368 Q 380 340 800 315',
    ],
    arterials: [
      'M 0 185 L 800 175',
      'M 235 122 L 235 500',
      'M 610 110 L 610 500',
    ],
    localStreets: [
      [0, 310, 800, 310],
      [0, 428, 800, 428],
      [125, 130, 125, 500],
      [330, 125, 330, 500],
      [518, 125, 518, 500],
      [710, 115, 710, 500],
    ],
    roundabouts: [
      [426, 252, 13],
      [235, 252, 9],
    ],
    metros: [
      { x: 426, y: 236, label: 'Mərkəz' },
      { x: 575, y: 238, label: '6-cı mkr' },
    ],
    roadLabels: [
      { x: 165, y: 256, text: 'Sülh küçəsi' },
      { x: 465, y: 256, text: 'Azərbaycan pr.' },
    ],
    waterLabel: { x: 350, y: 55, text: 'Xəzər dənizi' },
  },
  Гянджа: {
    waterPath: 'M 472 0 C 455 155, 508 310, 488 500 L 516 500 C 536 310, 483 155, 500 0 Z',
    parks: [
      'M 342 188 L 435 188 L 435 268 L 342 268 Z',
      'M 555 292 L 668 292 L 668 388 L 555 388 Z',
    ],
    highways: [
      'M 0 264 L 800 248',
      'M 412 0 L 412 500',
      'M 80 465 L 710 65',
    ],
    arterials: [
      'M 0 164 L 800 164',
      'M 0 368 L 800 368',
      'M 225 0 L 225 500',
      'M 615 0 L 615 500',
    ],
    localStreets: [
      [0, 95, 800, 95],
      [0, 315, 800, 315],
      [0, 432, 800, 432],
      [130, 0, 130, 500],
      [318, 0, 318, 500],
      [705, 0, 705, 500],
    ],
    roundabouts: [
      [412, 256, 13],
      [225, 260, 9],
    ],
    metros: [
      { x: 438, y: 256, label: 'GDU' },
      { x: 555, y: 218, label: 'Xan bağı' },
    ],
    roadLabels: [
      { x: 120, y: 268, text: 'H. Əliyev pr.' },
      { x: 555, y: 254, text: 'Atatürk pr.' },
    ],
    waterLabel: { x: 492, y: 425, text: 'Gəncəçay' },
  },
};

// Building footprint blocks for realistic urban density
const URBAN_BLOCKS: [number, number, number, number][] = [
  [105, 105, 34, 24],
  [158, 106, 42, 24],
  [215, 104, 38, 26],
  [292, 104, 44, 26],
  [355, 104, 48, 25],
  [104, 150, 36, 26],
  [156, 150, 44, 24],
  [292, 148, 42, 26],
  [354, 148, 52, 24],
  [158, 232, 42, 24],
  [216, 232, 46, 24],
  [356, 230, 52, 26],
  [158, 276, 42, 26],
  [216, 276, 44, 26],
  [356, 276, 54, 26],
  [358, 344, 48, 32],
  [426, 314, 52, 30],
  [486, 308, 44, 28],
  [548, 240, 44, 26],
  [615, 198, 48, 28],
];

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

  const [zoom, setZoom] = useState<number>(1.08);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cleanLayer, setCleanLayer] = useState(false);

  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  }>({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const mapPins = useMemo(() => {
    const offlineOrFiltered = tutors
      .filter((t) => isTutorApproved(t))
      .filter((t) => !subject || t.subj.includes(subject))
      .filter((t) => t.fmt.includes('Офлайн') || tutors.length <= 4);

    const withDist = offlineOrFiltered
      .map((tutor) => ({
        tutor,
        dist: tutorDistanceKm(tutor, location),
      }))
      .sort((a, b) => a.dist - b.dist);

    const cityScoped = withDist.filter((item) => item.dist <= 25);
    const activeList = cityScoped.length > 0 ? cityScoped : withDist.slice(0, 5);

    return activeList.map(({ tutor, dist }, idx) => {
      const fallback: [number, number] = [
        340 + ((idx * 75) % 240),
        195 + ((idx * 55) % 140),
      ];
      const [svgX, svgY] = TUTOR_MAP_COORDS[tutor.id] ?? fallback;

      return {
        tutor,
        dist,
        within: radiusKm > 50 || dist <= radiusKm,
        svgX,
        svgY,
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

  const cityProfile = CITY_MAPS[location.name] ?? CITY_MAPS['Баку'];
  const radarSvgRadius = radiusKm > 50 ? 0 : Math.max(38, Math.min(245, radiusKm * 4.5));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: pan.x,
      baseY: pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = Math.max(-220, Math.min(220, dragRef.current.baseX + (e.clientX - dragRef.current.startX)));
    const dy = Math.max(-140, Math.min(140, dragRef.current.baseY + (e.clientY - dragRef.current.startY)));
    setPan({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  // Convert SVG (800x500) coords into zoom+pan transformed viewport percentages
  const projectPoint = (svgX: number, svgY: number): { leftPct: number; topPct: number } => {
    const cx = 400;
    const cy = 250;
    const tx = cx + (svgX - cx) * zoom + pan.x;
    const ty = cy + (svgY - cy) * zoom + pan.y;
    return {
      leftPct: (tx / 800) * 100,
      topPct: (ty / 500) * 100,
    };
  };

  return (
    <section
      id="tutor-map"
      aria-label={mc.mapBadge}
      className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-6"
    >
      <div className="grid items-stretch gap-5 lg:grid-cols-12">
        {/* Left: 100% Self-Contained Interactive Zoomable & Pannable Apple/Google Maps Cartography */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative min-h-[360px] cursor-grab overflow-hidden rounded-[22px] border border-[var(--border)] bg-[#F2EFE8] select-none active:cursor-grabbing dark:bg-[#0F192B] sm:min-h-[420px] lg:col-span-7"
        >
          {/* Zoom + Pan Transformed Cartographic Layer */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            className="pointer-events-none absolute inset-0 transition-transform duration-150 ease-out"
          >
            <svg
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              className="h-full w-full"
            >
              {/* Warm Editorial Terrain */}
              <rect
                width="800"
                height="500"
                className="fill-[#F3F0E8] dark:fill-[#0F192B]"
              />

              {/* Parks & Greenbelts */}
              {!cleanLayer
                ? cityProfile.parks.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      className="fill-[#D4EAD2] dark:fill-[#133528]"
                    />
                  ))
                : null}

              {/* Caspian Sea / River */}
              <path
                d={cityProfile.waterPath}
                className="fill-[#C8E1FA] dark:fill-[#132E4D]"
              />
              {cityProfile.boulevardPath ? (
                <path
                  d={cityProfile.boulevardPath}
                  className="fill-[#DCEFD9] dark:fill-[#15392C]"
                />
              ) : null}

              {/* Urban Building Footprints */}
              {!cleanLayer ? (
                <g className="fill-[#E7E3D9] stroke-[#DCD7CC] dark:fill-[#17263D] dark:stroke-[#1E314E]" strokeWidth="0.6">
                  {URBAN_BLOCKS.map(([x, y, w, h], i) => (
                    <rect key={i} x={x} y={y} width={w} height={h} rx="2.5" />
                  ))}
                </g>
              ) : null}

              {/* Fine Local Streets */}
              <g className="stroke-white/95 dark:stroke-[#1C2E4A]" strokeWidth="4">
                {cityProfile.localStreets.map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                ))}
              </g>

              {/* Secondary Collector Roads */}
              <g fill="none" strokeLinecap="round">
                <g className="stroke-[#E2DFD6] dark:stroke-[#233757]" strokeWidth="7.5">
                  {cityProfile.arterials.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
                <g className="stroke-white dark:stroke-[#2A4166]" strokeWidth="5.5">
                  {cityProfile.arterials.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              </g>

              {/* Primary Arterial Highways */}
              <g fill="none" strokeLinecap="round">
                <g className="stroke-[#E3C66E] dark:stroke-[#415675]" strokeWidth="10.5">
                  {cityProfile.highways.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
                <g className="stroke-[#FDE89F] dark:stroke-[#2F4668]" strokeWidth="7.5">
                  {cityProfile.highways.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              </g>

              {/* Traffic Roundabouts */}
              {cityProfile.roundabouts.map(([cx, cy, r], i) => (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    className="fill-[#F3F0E8] stroke-[#E3C66E] dark:fill-[#0F192B] dark:stroke-[#415675]"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r * 0.45}
                    className="fill-[#D4EAD2] dark:fill-[#133528]"
                  />
                </g>
              ))}

              {/* Metro / Transit Hub Badges */}
              {cityProfile.metros.map((m, i) => (
                <g key={i}>
                  <circle cx={m.x} cy={m.y} r="4.5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text
                    x={m.x + 8}
                    y={m.y + 3.5}
                    className="fill-[#065F46] text-[10px] font-bold dark:fill-[#6EE7B7]"
                  >
                    {m.label}
                  </text>
                </g>
              ))}

              {/* Street & Water Labels */}
              {cityProfile.roadLabels.map((lbl, i) => (
                <text
                  key={i}
                  x={lbl.x}
                  y={lbl.y}
                  transform={lbl.rotate ? `rotate(${lbl.rotate} ${lbl.x} ${lbl.y})` : undefined}
                  className="fill-[#475569] text-[10px] font-semibold dark:fill-[#94A3B8]"
                >
                  {lbl.text}
                </text>
              ))}
              {cityProfile.waterLabel ? (
                <text
                  x={cityProfile.waterLabel.x}
                  y={cityProfile.waterLabel.y}
                  className="fill-[#2563EB]/75 text-[11px] font-semibold italic dark:fill-[#60A5FA]/80"
                >
                  {cityProfile.waterLabel.text}
                </text>
              ) : null}

              {/* Live Geographic Radar Circle */}
              {radarSvgRadius > 0 ? (
                <circle
                  cx="440"
                  cy="252"
                  r={radarSvgRadius}
                  className="fill-emerald-500/8 stroke-emerald-600/50 transition-all duration-200 dark:fill-emerald-400/10 dark:stroke-emerald-400/45"
                  strokeWidth="1.8"
                  strokeDasharray="6 5"
                />
              ) : null}

              {/* Center Location Pulse */}
              <circle cx="440" cy="252" r="5.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>

          {/* Top-Left Floating Map Place Card */}
          {activePin ? (
            <div className="relative z-30 m-3 max-w-[270px] rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-3.5 shadow-[var(--shadow-float)] backdrop-blur-md">
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

          {/* Zoom+Pan Projected Fixed Tutor Pins (Never jump when radiusKm changes) */}
          {mapPins.map((pin) => {
            const { leftPct, topPct } = projectPoint(pin.svgX, pin.svgY);
            const localizedName = resolveTutorName(pin.tutor, locale);
            const isSelected = activePin?.tutor.id === pin.tutor.id;

            return (
              <button
                key={pin.tutor.id}
                type="button"
                onClick={() => setSelectedId(pin.tutor.id)}
                aria-label={`${localizedName} (${pin.dist.toFixed(1)} ${copy.tutorCard.km})`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
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
                        : 'text-[#0F172A] opacity-90 drop-shadow-sm dark:text-[#C8F542]'
                    }
                  />
                </div>
              </button>
            );
          })}

          {/* Bottom Attribution + Real Zoom (+ / -), Layer Switch & Reset Center Controls */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-end justify-between">
            <span className="rounded-md bg-[var(--surface)]/88 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)] backdrop-blur-xs">
              {mc.mapAttribution} · {Math.round(zoom * 100)}%
            </span>

            <div className="pointer-events-auto flex flex-col gap-1.5">
              <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.2).toFixed(2))))}
                  disabled={zoom >= 2.2}
                  aria-label={mc.zoomInLabel}
                  title={mc.zoomInLabel}
                  className="grid h-8 w-8 cursor-pointer place-items-center border-b border-[var(--border)] text-[var(--ink)] transition-colors hover:bg-[var(--surface-subtle)] disabled:opacity-40"
                >
                  <Plus size={14} weight="bold" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.85, Number((z - 0.2).toFixed(2))))}
                  disabled={zoom <= 0.85}
                  aria-label={mc.zoomOutLabel}
                  title={mc.zoomOutLabel}
                  className="grid h-8 w-8 cursor-pointer place-items-center text-[var(--ink)] transition-colors hover:bg-[var(--surface-subtle)] disabled:opacity-40"
                >
                  <Minus size={14} weight="bold" aria-hidden="true" />
                </button>
              </div>

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
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  setZoom(1.08);
                  onLocateMe();
                }}
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
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  setZoom(1.08);
                  onLocateMe();
                }}
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
                      setPan({ x: 0, y: 0 });
                      setZoom(1.08);
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
                        onClick={() => {
                          setSelectedId(pin.tutor.id);
                          setZoom(1.32);
                        }}
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
