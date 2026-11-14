import type React from 'react';

/**
 * Updates `--mouse-x` and `--mouse-y` CSS custom properties directly on the
 * hovered surface so `.em-spotlight-card` / `.em-bento-card` render a silky
 * cursor spotlight without triggering React re-renders.
 */
export function handleSpotlightMove(e: React.PointerEvent<HTMLElement>): void {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  el.style.setProperty('--mouse-x', `${x}px`);
  el.style.setProperty('--mouse-y', `${y}px`);
}
