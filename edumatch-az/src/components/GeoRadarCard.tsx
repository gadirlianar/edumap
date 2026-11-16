'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const TILE_SIZE = 256;
const MIN_ZOOM = 10;
const MAX_ZOOM = 16;

function latLonToWorldPx(lat: number, lon: number, zoom: number): [number, number] {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const latRad = (clampedLat * Math.PI) / 180;
  const x = ((lon + 180) / 360) * scale;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;
  return [x, y];
}

function metersPerPixel(lat: number, zoom: number): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
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
    mapAttribution: '© OpenStreetMap · CARTO',
    switchLayerLabel: 'Сменить слой карты',
    zoomInLabel: 'Приблизить',
    zoomOutLabel: 'Отдалить',
    offlineNearbyTitle: 'Менторы на карте рядом',
    noOfflineFallback: 'Для выбранного предмета уроки доступны онлайн по всей стране.',
  },
  az: {
    mapBadge: 'Müəllim xəritəsi',
    availableNow: 'Dərsə açıqdır',
    mapAttribution: '© OpenStreetMap · CARTO',
    switchLayerLabel: 'Xəritə qatını dəyiş',
    zoomInLabel: 'Yaxınlaşdır',
    zoomOutLabel: 'Uzaqlaşdır',
    offlineNearbyTitle: 'Xəritədə yaxın müəllimlər',
    noOfflineFallback: 'Seçilən fənn üzrə dərslər ölkə üzrə onlayn keçirilir.',
  },
  en: {
    mapBadge: 'Live Tutor Map',
    availableNow: 'Open Now',
    mapAttribution: '© OpenStreetMap · CARTO',
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

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({
    w: 680,
    h: 400,
  });
  const [zoom, setZoom] = useState<number>(12);
  const [panOffset, setPanOffset] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [osmStandardLayer, setOsmStandardLayer] = useState(false);

  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    baseDx: number;
    baseDy: number;
  }>({ active: false, startX: 0, startY: 0, baseDx: 0, baseDy: 0 });

  // Measure real map canvas size for accurate Mercator tile tiling
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    updateSize();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      return () => ro.disconnect();
    }
    return undefined;
  }, []);

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

    return activeList.map(({ tutor, dist }) => ({
      tutor,
      dist,
      within: radiusKm > 50 || dist <= radiusKm,
    }));
  }, [tutors, location, radiusKm, subject]);

  const inRangeCount = mapPins.filter((d) => d.within).length;
  const activePin =
    mapPins.find((d) => d.tutor.id === selectedId) ?? mapPins[0] ?? null;

  const displayCity =
    location.name in CITY_LABELS
      ? CITY_LABELS[location.name as CityId][locale]
      : location.name;

  // Real Mercator center world pixels
  const [cityCenterX, cityCenterY] = latLonToWorldPx(location.lat, location.lon, zoom);
  const centerWorldX = cityCenterX - panOffset.dx;
  const centerWorldY = cityCenterY - panOffset.dy;

  const halfW = viewportSize.w / 2;
  const halfH = viewportSize.h / 2;
  const topLeftX = centerWorldX - halfW;
  const topLeftY = centerWorldY - halfH;

  // Compute visible 256px Mercator tiles
  const minTileX = Math.floor(topLeftX / TILE_SIZE);
  const maxTileX = Math.floor((topLeftX + viewportSize.w) / TILE_SIZE);
  const minTileY = Math.floor(topLeftY / TILE_SIZE);
  const maxTileY = Math.floor((topLeftY + viewportSize.h) / TILE_SIZE);
  const maxTileIdx = Math.pow(2, zoom);

  const tiles: {
    key: string;
    src: string;
    left: number;
    top: number;
  }[] = [];

  for (let ty = minTileY; ty <= maxTileY; ty++) {
    if (ty < 0 || ty >= maxTileIdx) continue;
    for (let tx = minTileX; tx <= maxTileX; tx++) {
      const wrappedX = ((tx % maxTileIdx) + maxTileIdx) % maxTileIdx;
      const src = osmStandardLayer
        ? `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${ty}.png`
        : `https://basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${wrappedX}/${ty}@2x.png`;
      tiles.push({
        key: `${osmStandardLayer ? 'osm' : 'carto'}-${zoom}-${tx}-${ty}`,
        src,
        left: tx * TILE_SIZE - topLeftX,
        top: ty * TILE_SIZE - topLeftY,
      });
    }
  }

  // Real geographic radius ring in screen pixels
  const mpp = metersPerPixel(location.lat, zoom);
  const cityCenterScreenX = cityCenterX - topLeftX;
  const cityCenterScreenY = cityCenterY - topLeftY;
  const radarRadiusPx =
    radiusKm > 50 ? 0 : Math.max(24, (radiusKm * 1000) / mpp);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseDx: panOffset.dx,
      baseDy: panOffset.dy,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    setPanOffset({
      dx: dragRef.current.baseDx + (e.clientX - dragRef.current.startX),
      dy: dragRef.current.baseDy + (e.clientY - dragRef.current.startY),
    });
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  return (
    <section
      id="tutor-map"
      aria-label={mc.mapBadge}
      className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:p-6"
    >
      <div className="grid items-stretch gap-5 lg:grid-cols-12">
        {/* Left: Real Interactive OpenStreetMap / CARTO Mercator Map */}
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative min-h-[360px] cursor-grab overflow-hidden rounded-[22px] border border-[var(--border)] bg-[#EBF1F6] select-none active:cursor-grabbing dark:bg-[#101B2D] sm:min-h-[420px] lg:col-span-7"
        >
          {/* Real Mercator Raster Map Tiles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden dark:brightness-90 dark:contrast-110"
          >
            {tiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.src}
                alt=""
                draggable={false}
                style={{
                  left: `${tile.left}px`,
                  top: `${tile.top}px`,
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                }}
                className="absolute max-w-none select-none"
              />
            ))}
          </div>

          {/* Accurate Geographic Radar Circle Overlay */}
          {radarRadiusPx > 0 ? (
            <div
              aria-hidden="true"
              style={{
                left: `${cityCenterScreenX}px`,
                top: `${cityCenterScreenY}px`,
                width: `${radarRadiusPx * 2}px`,
                height: `${radarRadiusPx * 2}px`,
              }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-emerald-600/55 bg-emerald-500/10 transition-all duration-200"
            />
          ) : null}

          {/* User / City Center Pulse Dot */}
          <div
            aria-hidden="true"
            style={{
              left: `${cityCenterScreenX}px`,
              top: `${cityCenterScreenY}px`,
            }}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute -inset-2.5 rounded-full bg-indigo-500/25 animate-ping" />
            <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600 shadow-md" />
          </div>

          {/* Top-Left Floating Map Place Card (Google-Maps-style overlay) */}
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

          {/* Exact Geographic Lat/Lon Map Pins */}
          {mapPins.map((pin) => {
            const [wx, wy] = latLonToWorldPx(pin.tutor.coords[0], pin.tutor.coords[1], zoom);
            const screenX = wx - topLeftX;
            const screenY = wy - topLeftY;
            const localizedName = resolveTutorName(pin.tutor, locale);
            const isSelected = activePin?.tutor.id === pin.tutor.id;

            return (
              <button
                key={pin.tutor.id}
                type="button"
                onClick={() => setSelectedId(pin.tutor.id)}
                aria-label={`${localizedName} (${pin.dist.toFixed(1)} ${copy.tutorCard.km})`}
                style={{ left: `${screenX}px`, top: `${screenY}px` }}
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
                        : 'text-[#0F172A] opacity-90 drop-shadow-sm'
                    }
                  />
                </div>
              </button>
            );
          })}

          {/* Bottom Attribution + Real Zoom (+ / -), Layer Switch & Center Controls */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-end justify-between">
            <span className="rounded-md bg-[var(--surface)]/88 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)] backdrop-blur-xs">
              {mc.mapAttribution} · z{zoom}
            </span>

            <div className="pointer-events-auto flex flex-col gap-1.5">
              <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 1))}
                  disabled={zoom >= MAX_ZOOM}
                  aria-label={mc.zoomInLabel}
                  title={mc.zoomInLabel}
                  className="grid h-8 w-8 cursor-pointer place-items-center border-b border-[var(--border)] text-[var(--ink)] transition-colors hover:bg-[var(--surface-subtle)] disabled:opacity-40"
                >
                  <Plus size={14} weight="bold" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 1))}
                  disabled={zoom <= MIN_ZOOM}
                  aria-label={mc.zoomOutLabel}
                  title={mc.zoomOutLabel}
                  className="grid h-8 w-8 cursor-pointer place-items-center text-[var(--ink)] transition-colors hover:bg-[var(--surface-subtle)] disabled:opacity-40"
                >
                  <Minus size={14} weight="bold" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setOsmStandardLayer((prev) => !prev)}
                aria-label={mc.switchLayerLabel}
                title={mc.switchLayerLabel}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-sm transition-colors hover:border-[var(--ink)]"
              >
                <Stack size={15} weight="bold" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPanOffset({ dx: 0, dy: 0 });
                  setZoom(12);
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
                  setPanOffset({ dx: 0, dy: 0 });
                  setZoom(12);
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
                      setPanOffset({ dx: 0, dy: 0 });
                      setZoom(12);
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
                          setPanOffset({ dx: 0, dy: 0 });
                          setZoom(13);
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
