'use client';

import React from 'react';
import {
  BookOpenText,
  Certificate,
  CheckCircle,
  Compass,
  Crown,
  FilmSlate,
  GraduationCap,
  Laptop,
  Lightbulb,
  MagnifyingGlass,
  Medal,
  Megaphone,
  NotePencil,
  RocketLaunch,
  Sparkle,
  Target,
  ThumbsUp,
  Trophy,
  UsersThree,
  Wallet,
  WarningCircle,
} from '@phosphor-icons/react';
import type { Locale, LocalizedText } from '@/types/edumatch';

interface VisualSpec {
  icon: React.ComponentType<{
    size?: number;
    weight?: 'regular' | 'bold' | 'fill' | 'duotone';
    className?: string;
    'aria-hidden'?: boolean;
  }>;
  bg: string;
  fg: string;
  ring: string;
  label: LocalizedText;
}

const SLATE_SURFACE = {
  bg: 'bg-[var(--surface-subtle)]',
  fg: 'text-[var(--ink)]',
  ring: 'border-[var(--border)]',
} as const;

const GOLD_ACCENT = {
  bg: 'bg-[var(--accent-soft)]',
  fg: 'text-[var(--accent-ink)]',
  ring: 'border-[var(--accent-border)]',
} as const;

const DEFAULT_SPEC: VisualSpec = {
  icon: Sparkle,
  ...GOLD_ACCENT,
  label: { ru: 'Отлично!', az: 'Əla!', en: 'Great!' },
};

const VISUAL_SPECS: Record<string, VisualSpec> = {
  // Rank tiers (Slate progression culminating in Amber Gold honors & crown)
  starter: {
    icon: Compass,
    ...SLATE_SURFACE,
    label: { ru: 'Старт пути', az: 'Başlanğıc', en: 'Starter' },
  },
  curious: {
    icon: BookOpenText,
    ...SLATE_SURFACE,
    label: { ru: 'Любознательный', az: 'Həvəskar', en: 'Explorer' },
  },
  analyst: {
    icon: Laptop,
    ...SLATE_SURFACE,
    label: { ru: 'Аналитик', az: 'Analitik', en: 'Analyst' },
  },
  scholar: {
    icon: NotePencil,
    ...SLATE_SURFACE,
    label: { ru: 'Прилежный', az: 'Çalışqan', en: 'Scholar' },
  },
  mentor: {
    icon: GraduationCap,
    ...GOLD_ACCENT,
    label: { ru: 'Ментор', az: 'Mentor', en: 'Mentor' },
  },
  honors: {
    icon: Medal,
    ...GOLD_ACCENT,
    label: { ru: 'Отличник', az: 'Əlaçı', en: 'Honors' },
  },
  grandmaster: {
    icon: Crown,
    ...GOLD_ACCENT,
    label: { ru: 'Грандмастер', az: 'Qrandmaster', en: 'Grandmaster' },
  },

  // Reactions & semantic UI icons
  thumb: {
    icon: ThumbsUp,
    ...GOLD_ACCENT,
    label: { ru: 'Супер!', az: 'Super!', en: 'Thumbs up!' },
  },
  smile: {
    icon: CheckCircle,
    ...GOLD_ACCENT,
    label: { ru: 'Договорились', az: 'Razılaşdıq', en: 'Sounds good' },
  },
  wow: {
    icon: Sparkle,
    ...GOLD_ACCENT,
    label: { ru: 'Впечатляет!', az: 'Əla nəticə!', en: 'Impressive!' },
  },
  target: {
    icon: Target,
    ...SLATE_SURFACE,
    label: { ru: 'Цель 600+', az: 'Hədəf 600+', en: 'Target 600+' },
  },
  write: {
    icon: NotePencil,
    ...SLATE_SURFACE,
    label: { ru: 'Записал конспект', az: 'Qeyd etdim', en: 'Noted' },
  },
  zen: {
    icon: Lightbulb,
    ...GOLD_ACCENT,
    label: { ru: 'Понял тему', az: 'Mövzunu anladım', en: 'Got it!' },
  },
  rocket: {
    icon: RocketLaunch,
    ...GOLD_ACCENT,
    label: { ru: 'Вперёд к баллу!', az: 'İrəli!', en: 'Let’s go!' },
  },

  // Tour / banner / modal visuals
  glasses: {
    icon: Certificate,
    ...GOLD_ACCENT,
    label: { ru: 'Вуз и балл', az: 'Universitet və bal', en: 'University & score' },
  },
  lens: {
    icon: MagnifyingGlass,
    ...SLATE_SURFACE,
    label: { ru: 'Точный подбор', az: 'Dəqiq seçim', en: 'Smart match' },
  },
  money: {
    icon: Wallet,
    ...GOLD_ACCENT,
    label: { ru: 'Премиум', az: 'Premium', en: 'Premium' },
  },
  mega: {
    icon: Megaphone,
    ...GOLD_ACCENT,
    label: { ru: 'Продвижение', az: 'Təşviqat', en: 'Boost' },
  },
  studio: {
    icon: FilmSlate,
    ...SLATE_SURFACE,
    label: { ru: 'Контент', az: 'Kontent', en: 'Content' },
  },
  students: {
    icon: UsersThree,
    ...SLATE_SURFACE,
    label: { ru: 'Ученики', az: 'Şagirdlər', en: 'Students' },
  },
  trophy: {
    icon: Trophy,
    ...GOLD_ACCENT,
    label: { ru: 'Достижение', az: 'Uğur', en: 'Achievement' },
  },
  alert: {
    icon: WarningCircle,
    ...GOLD_ACCENT,
    label: { ru: 'Внимание', az: 'Diqqət', en: 'Notice' },
  },

  // Graceful fallback mappings for legacy localStorage keys
  paw: {
    icon: Target,
    ...SLATE_SURFACE,
    label: { ru: 'Цель 600+', az: 'Hədəf 600+', en: 'Target 600+' },
  },
  sleepc: {
    icon: Compass,
    ...SLATE_SURFACE,
    label: { ru: 'Старт пути', az: 'Başlanğıc', en: 'Starter' },
  },
  bookc: {
    icon: BookOpenText,
    ...SLATE_SURFACE,
    label: { ru: 'Любознательный', az: 'Həvəskar', en: 'Explorer' },
  },
  lap: {
    icon: Laptop,
    ...SLATE_SURFACE,
    label: { ru: 'Аналитик', az: 'Analitik', en: 'Analyst' },
  },
  note: {
    icon: NotePencil,
    ...SLATE_SURFACE,
    label: { ru: 'Прилежный', az: 'Çalışqan', en: 'Scholar' },
  },
  read3: {
    icon: GraduationCap,
    ...GOLD_ACCENT,
    label: { ru: 'Ментор', az: 'Mentor', en: 'Mentor' },
  },
  mega3: {
    icon: Crown,
    ...GOLD_ACCENT,
    label: { ru: 'Грандмастер', az: 'Qrandmaster', en: 'Grandmaster' },
  },
};

export function getVisualSpec(key: string): VisualSpec {
  return VISUAL_SPECS[key] ?? DEFAULT_SPEC;
}

export function AcademicEmblem({
  iconKey,
  size = 'md',
  locked = false,
  className = '',
}: {
  iconKey: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  locked?: boolean;
  className?: string;
}) {
  const spec = getVisualSpec(iconKey);
  const Icon = spec.icon;

  const boxSizes: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', { box: string; icon: number }> = {
    xs: { box: 'h-7 w-7 rounded-lg', icon: 14 },
    sm: { box: 'h-10 w-10 rounded-xl', icon: 19 },
    md: { box: 'h-13 w-13 rounded-2xl', icon: 25 },
    lg: { box: 'h-18 w-18 rounded-2xl', icon: 36 },
    xl: { box: 'h-22 w-22 rounded-3xl', icon: 42 },
  };
  const cfg = boxSizes[size];

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center border ${cfg.box} ${
        locked
          ? 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted)] opacity-50'
          : `${spec.ring} ${spec.bg} ${spec.fg}`
      } ${className}`}
    >
      <Icon size={cfg.icon} weight="duotone" aria-hidden={true} />
    </span>
  );
}

export function ChatReactionBadge({
  iconKey,
  locale,
  compact = false,
}: {
  iconKey: string;
  locale: Locale;
  compact?: boolean;
}) {
  const spec = getVisualSpec(iconKey);
  const Icon = spec.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl border ${spec.ring} ${spec.bg} ${spec.fg} ${
        compact ? 'px-3 py-1.5 text-xs font-semibold' : 'px-3.5 py-2 text-xs font-semibold'
      }`}
    >
      <Icon size={compact ? 15 : 18} weight="fill" aria-hidden={true} />
      <span>{spec.label[locale]}</span>
    </span>
  );
}
