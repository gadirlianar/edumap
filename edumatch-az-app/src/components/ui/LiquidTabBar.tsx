'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

export interface LiquidTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface LiquidTabBarProps {
  items: LiquidTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  layoutId: string;
  variant: 'header' | 'dock';
  className?: string;
}

interface ScrubLensBox {
  left: number;
  width: number;
}

const SPRING_LENS = {
  type: 'spring',
  stiffness: 460,
  damping: 34,
  mass: 0.85,
} as const;

/**
 * Interactive iOS 26 Liquid Glass tab bar supporting click/tap, continuous
 * horizontal pointer/touch scrubbing across items, and ArrowLeft/ArrowRight navigation.
 */
export function LiquidTabBar({
  items,
  activeId,
  onChange,
  ariaLabel,
  layoutId,
  variant,
  className = '',
}: LiquidTabBarProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dragSessionRef = useRef<{
    pointerId: number;
    startX: number;
    isScrubbing: boolean;
    lastSelectedId: string;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [scrubLens, setScrubLens] = useState<ScrubLensBox | null>(null);

  const resolveHitTabId = (clientX: number): string | null => {
    let closestId: string | null = null;
    let minDistance = Number.POSITIVE_INFINITY;

    for (const item of items) {
      const btn = buttonRefs.current[item.id];
      if (!btn) continue;
      const rect = btn.getBoundingClientRect();
      if (rect.width <= 0) continue;
      if (clientX >= rect.left && clientX <= rect.right) {
        return item.id;
      }
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - center);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = item.id;
      }
    }
    return closestId;
  };

  const computeLensBox = (clientX: number, targetId: string): ScrubLensBox | null => {
    const track = trackRef.current;
    const btn = buttonRefs.current[targetId];
    if (!track || !btn) return null;
    const trackRect = track.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    if (trackRect.width <= 0 || btnRect.width <= 0) return null;

    const padding = 4;
    const rawLeft = clientX - trackRect.left - btnRect.width / 2;
    const clampedLeft = Math.max(
      padding,
      Math.min(rawLeft, trackRect.width - btnRect.width - padding),
    );
    return { left: clampedLeft, width: btnRect.width };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    suppressClickRef.current = false;
    dragSessionRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      isScrubbing: false,
      lastSelectedId: activeId,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    if (!session.isScrubbing) {
      if (Math.abs(e.clientX - session.startX) < 6) return;
      session.isScrubbing = true;
      suppressClickRef.current = true;
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable (e.g., synthetic jsdom events)
      }
    }

    const hitId = resolveHitTabId(e.clientX) ?? session.lastSelectedId;
    if (hitId !== session.lastSelectedId) {
      session.lastSelectedId = hitId;
      onChange(hitId);
    }
    const nextLens = computeLensBox(e.clientX, hitId);
    if (nextLens) {
      setScrubLens(nextLens);
    }
  };

  const endScrub = (e: React.PointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    if (session.isScrubbing) {
      try {
        if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore capture release errors
      }
      setScrubLens(null);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 60);
    }
    dragSessionRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (items.length === 0) return;
    const idx = items.findIndex((i) => i.id === activeId);
    if (idx === -1) return;

    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = items.length - 1;

    if (nextIdx === null) return;
    e.preventDefault();
    const nextItem = items[nextIdx];
    onChange(nextItem.id);
    buttonRefs.current[nextItem.id]?.focus();
  };

  const isDock = variant === 'dock';

  return (
    <nav
      ref={trackRef}
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endScrub}
      onPointerCancel={endScrub}
      onKeyDown={handleKeyDown}
      className={`${
        isDock ? 'em-liquid-dock fixed p-1.5' : 'em-liquid-track relative p-1'
      } touch-none select-none items-center gap-0.5 rounded-full ${className}`}
    >
      {/* Floating magnified droplet shown while continuously scrubbing */}
      {scrubLens ? (
        <span
          aria-hidden="true"
          style={{
            left: `${scrubLens.left}px`,
            width: `${scrubLens.width}px`,
          }}
          className={`em-liquid-lens em-liquid-lens--scrubbing pointer-events-none absolute ${
            isDock ? 'inset-y-1.5' : 'inset-y-1'
          } z-0 rounded-full transition-[width] duration-75`}
        />
      ) : null}

      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            ref={(el) => {
              buttonRefs.current[item.id] = el;
            }}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }
              onChange(item.id);
            }}
            className={`relative z-10 cursor-pointer transition-colors ${
              isDock
                ? 'flex min-h-[44px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1 text-[10px]'
                : 'inline-flex min-h-[34px] items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] lg:px-4 lg:text-[13px]'
            } ${
              active
                ? 'font-semibold text-[var(--ink)]'
                : 'font-medium text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {active && !scrubLens ? (
              <motion.span
                layoutId={layoutId}
                transition={SPRING_LENS}
                className="em-liquid-lens pointer-events-none absolute inset-0 rounded-full"
                aria-hidden="true"
              />
            ) : null}

            {isDock ? (
              <>
                <span className="relative z-10 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="relative z-10 max-w-full truncate">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute right-2 top-1 z-20 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[var(--surface)]" />
                ) : null}
              </>
            ) : (
              <>
                <span className="relative z-10">{item.label}</span>
                {active ? (
                  <span
                    className="relative z-10 h-1.5 w-1.5 rounded-full bg-[var(--accent)] ring-2 ring-[var(--lime)]/70"
                    aria-hidden="true"
                  />
                ) : null}
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}
