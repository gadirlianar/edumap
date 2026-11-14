'use client';

import React, { useId, useState } from 'react';
import { SealCheck } from '@phosphor-icons/react';
import { getTutorVisual } from '@/data/tutorVisuals';
import type { SubjectId } from '@/types/edumatch';

interface AvatarProps {
  id?: string;
  name: string;
  index?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  verified?: boolean;
  online?: boolean;
  subject?: SubjectId;
  className?: string;
}

interface PortraitPreset {
  skin: string;
  hair: string;
  coat: string;
  shirt: string;
  hairStyle: 'waves' | 'shortFade' | 'bun' | 'bob' | 'parted' | 'curly';
  glasses?: boolean;
}

const PORTRAIT_PRESETS: Record<string, PortraitPreset> = {
  t1: {
    skin: '#F3D2B8',
    hair: '#1E293B',
    coat: '#0F172A',
    shirt: '#FBFBF9',
    hairStyle: 'waves',
    glasses: true,
  },
  t4: {
    skin: '#EAC1A3',
    hair: '#0F172A',
    coat: '#1E293B',
    shirt: '#FBFBF9',
    hairStyle: 'shortFade',
    glasses: true,
  },
  t2: {
    skin: '#E6BC9A',
    hair: '#1E293B',
    coat: '#0F172A',
    shirt: '#F4F3EE',
    hairStyle: 'parted',
  },
  t3: {
    skin: '#ECC4A7',
    hair: '#1E293B',
    coat: '#334155',
    shirt: '#FBFBF9',
    hairStyle: 'bun',
    glasses: true,
  },
  me: {
    skin: '#F6DAC3',
    hair: '#334155',
    coat: '#0F172A',
    shirt: '#FBFBF9',
    hairStyle: 'shortFade',
  },
  t5: {
    skin: '#F1CDB0',
    hair: '#1E293B',
    coat: '#334155',
    shirt: '#FBFBF9',
    hairStyle: 'bob',
  },
  t6: {
    skin: '#E9BFA0',
    hair: '#0F172A',
    coat: '#1E293B',
    shirt: '#F4F3EE',
    hairStyle: 'curly',
    glasses: true,
  },
};

const FALLBACK_PRESETS: PortraitPreset[] = [
  PORTRAIT_PRESETS.t1,
  PORTRAIT_PRESETS.t4,
  PORTRAIT_PRESETS.t2,
  PORTRAIT_PRESETS.t3,
  PORTRAIT_PRESETS.t5,
  PORTRAIT_PRESETS.t6,
  PORTRAIT_PRESETS.me,
];

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
  xl: 'h-[72px] w-[72px]',
  '2xl': 'h-24 w-24',
};

const BADGE_SIZE: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-5 w-5',
  '2xl': 'h-6 w-6',
};

function hashIndex(name: string, fallbackIdx: number): number {
  let sum = fallbackIdx;
  for (let i = 0; i < name.length; i += 1) {
    sum = (sum * 31 + name.charCodeAt(i)) >>> 0;
  }
  return sum % FALLBACK_PRESETS.length;
}

/**
 * Clean studio portrait frame in pure Ivory / Slate with subtle Gold verified seal.
 * Keeps real human mentor photography crisp without rainbow borders or pulsing dots.
 */
export function Avatar({
  id,
  name,
  index = 0,
  size = 'lg',
  verified = false,
  className = '',
}: AvatarProps) {
  const uid = useId().replace(/:/g, '');
  const [imgError, setImgError] = useState(false);

  const preset =
    (id && PORTRAIT_PRESETS[id]) || FALLBACK_PRESETS[hashIndex(name, index)];
  const visual = getTutorVisual(id, hashIndex(name, index));

  const iconSize =
    size === 'sm' ? 11 : size === 'md' ? 12 : size === 'lg' ? 14 : size === 'xl' ? 15 : 17;

  return (
    <div
      className={`relative inline-flex shrink-0 select-none ${SIZE_CLASSES[size]} ${className}`}
      role="img"
      aria-label={name}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] p-0.5 shadow-2xs"
        style={{
          borderColor: verified ? 'var(--accent-border)' : 'var(--border)',
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--surface-subtle)]">
          {/* Calm monochrome studio vector base / fallback */}
          <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
            <defs>
              <clipPath id={`clip-${uid}`}>
                <circle cx="40" cy="40" r="40" />
              </clipPath>
            </defs>
            <g clipPath={`url(#clip-${uid})`}>
              <rect width="80" height="80" fill="#EFF6FC" />
              {preset.hairStyle === 'waves' || preset.hairStyle === 'bob' ? (
                <path
                  d="M20 35 C20 14 60 14 60 35 L62 60 C55 62 25 62 18 60 Z"
                  fill={preset.hair}
                />
              ) : null}
              {preset.hairStyle === 'bun' ? (
                <>
                  <circle cx="40" cy="15" r="8" fill={preset.hair} />
                  <path d="M23 35 C24 18 56 18 57 35 Z" fill={preset.hair} />
                </>
              ) : null}
              <path
                d="M12 80 C15 62 28 56 40 56 C52 56 65 62 68 80 Z"
                fill={preset.coat}
              />
              <path d="M32 56 L40 67 L48 56 Z" fill={preset.shirt} />
              <rect x="35" y="45" width="10" height="14" rx="5" fill={preset.skin} />
              <ellipse cx="40" cy="36" rx="14" ry="16" fill={preset.skin} />
              <circle cx="34.5" cy="35.5" r="1.4" fill="#0F172A" />
              <circle cx="45.5" cy="35.5" r="1.4" fill="#0F172A" />
              <path
                d="M35.5 42.5 Q40 46 44.5 42.5"
                stroke="#64748B"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              {preset.hairStyle === 'shortFade' || preset.hairStyle === 'parted' ? (
                <path
                  d="M25 32 C25 18 55 18 55 32 C50 25 32 23 25 32 Z"
                  fill={preset.hair}
                />
              ) : null}
              {preset.hairStyle === 'curly' ? (
                <path
                  d="M24 34 C22 20 32 16 40 17 C48 16 58 20 56 34 C50 25 30 25 24 34 Z"
                  fill={preset.hair}
                />
              ) : null}
            </g>
          </svg>

          {/* Real human studio photograph */}
          {!imgError && visual.photoUrl ? (
            <img
              src={visual.photoUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
      </div>

      {/* Minimalist Amber Gold Diploma Verification Seal */}
      {verified ? (
        <span
          className={`absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] shadow-2xs ${BADGE_SIZE[size]}`}
          aria-hidden="true"
        >
          <SealCheck size={iconSize} weight="fill" />
        </span>
      ) : null}
    </div>
  );
}
