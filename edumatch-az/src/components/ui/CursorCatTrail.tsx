'use client';

import React, { useEffect, useRef } from 'react';

const CHAIN_LEN = 8;
const CAT_NODE_INDICES = [0, 2, 4] as const;

/**
 * Ultra-thin, velocity-elongated minimalist cat-tail cursor flourish.
 * Uses pure inline SVG stroke paths + requestAnimationFrame transforms with zero
 * bitmap assets or React re-renders per pointer event. Automatically disables on
 * coarse touch pointers and prefers-reduced-motion environments.
 */
export function CursorCatTrail() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const catRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    let active = false;
    let rafId = 0;
    let targetX = -100;
    let targetY = -100;
    let prevTargetX = -100;
    let prevTargetY = -100;
    let smoothedSpeed = 0;
    let lastMoveTs = 0;

    const pts = Array.from({ length: CHAIN_LEN }, () => ({ x: -100, y: -100 }));
    const angles = Array.from({ length: CHAIN_LEN }, () => 0);

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        return;
      }
      const nextX = e.clientX + 10;
      const nextY = e.clientY + 12;

      if (!active) {
        for (let i = 0; i < CHAIN_LEN; i += 1) {
          pts[i].x = nextX;
          pts[i].y = nextY;
        }
        prevTargetX = nextX;
        prevTargetY = nextY;
        active = true;
      }

      targetX = nextX;
      targetY = nextY;
      lastMoveTs = performance.now();
    };

    const onPointerLeave = () => {
      active = false;
      if (svgRef.current) svgRef.current.style.opacity = '0';
    };

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (!active || !svgRef.current) return;

      const dxTarget = targetX - prevTargetX;
      const dyTarget = targetY - prevTargetY;
      const instSpeed = Math.hypot(dxTarget, dyTarget);
      prevTargetX = targetX;
      prevTargetY = targetY;

      smoothedSpeed = smoothedSpeed * 0.82 + instSpeed * 0.18;

      // Tail spacing stretches proportionally to pointer velocity and relaxes when still
      const segSpacing = 3.2 + Math.min(9.2, smoothedSpeed * 0.36);

      pts[0].x += (targetX - pts[0].x) * 0.42;
      pts[0].y += (targetY - pts[0].y) * 0.42;

      for (let i = 1; i < CHAIN_LEN; i += 1) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const desiredX = prev.x + (dx / dist) * segSpacing;
        const desiredY = prev.y + (dy / dist) * segSpacing;
        const stiffness = 0.44 - i * 0.025;
        curr.x += (desiredX - curr.x) * stiffness;
        curr.y += (desiredY - curr.y) * stiffness;

        const tiltRad = Math.atan2(prev.y - curr.y, prev.x - curr.x);
        const tiltDeg = Math.max(-16, Math.min(16, (Math.cos(tiltRad) * smoothedSpeed * 0.85)));
        angles[i] += (tiltDeg - angles[i]) * 0.25;
      }

      angles[0] += (Math.max(-14, Math.min(14, dxTarget * 0.55)) - angles[0]) * 0.3;

      const idleMs = now - lastMoveTs;
      const restOpacity = idleMs > 750 ? Math.max(0.16, 0.88 - (idleMs - 750) * 0.0009) : 0.88;
      svgRef.current.style.opacity = restOpacity.toFixed(2);

      // Update thin curved tail spline connecting the chain
      if (pathRef.current) {
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < CHAIN_LEN - 1; i += 1) {
          const xc = ((pts[i].x + pts[i + 1].x) * 0.5).toFixed(1);
          const yc = ((pts[i].y + pts[i + 1].y) * 0.5).toFixed(1);
          d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${xc} ${yc}`;
        }
        const last = pts[CHAIN_LEN - 1];
        d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
        pathRef.current.setAttribute('d', d);
      }

      // Position tiny minimalist cat heads along the elongated tail
      CAT_NODE_INDICES.forEach((chainIdx, k) => {
        const node = catRefs.current[k];
        if (!node) return;
        const p = pts[chainIdx];
        const scale = k === 0 ? 1 : k === 1 ? 0.72 : 0.52;
        node.setAttribute(
          'transform',
          `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angles[chainIdx].toFixed(1)}) scale(${scale})`,
        );
      });

      if (dotRef.current) {
        const tailTip = pts[CHAIN_LEN - 1];
        dotRef.current.setAttribute('cx', tailTip.x.toFixed(1));
        dotRef.current.setAttribute('cy', tailTip.y.toFixed(1));
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full text-[var(--ink)] transition-opacity duration-300"
      style={{ opacity: 0 }}
    >
      {/* Ultra-thin delicate tail ribbon */}
      <path
        ref={pathRef}
        d=""
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.32}
        strokeWidth={1.05}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tail tip amber gold accent bead */}
      <circle
        ref={dotRef}
        cx={-100}
        cy={-100}
        r={1.35}
        fill="var(--accent)"
        fillOpacity={0.78}
      />

      {/* Three scaled ultra-thin cat silhouette heads forming the tail */}
      {CAT_NODE_INDICES.map((chainIdx, k) => (
        <g
          key={chainIdx}
          ref={(el) => {
            catRefs.current[k] = el;
          }}
          transform="translate(-100 -100)"
          opacity={k === 0 ? 0.85 : k === 1 ? 0.55 : 0.34}
        >
          <path
            d="M-4.6,-0.8 L-3.7,-5.2 L-1.1,-2.5 Q0,-2.9 1.1,-2.5 L3.7,-5.2 L4.6,-0.8 C5,1.9 2.9,3.9 0,3.9 C-2.9,3.9 -5,1.9 -4.6,-0.8 Z"
            fill="var(--bg)"
            fillOpacity={0.82}
            stroke="currentColor"
            strokeWidth={1.05}
            strokeLinejoin="round"
          />
          {k === 0 ? (
            <>
              <circle cx={-1.55} cy={0.15} r={0.55} fill="currentColor" />
              <circle cx={1.55} cy={0.15} r={0.55} fill="currentColor" />
              <circle cx={0} cy={1.35} r={0.65} fill="var(--accent)" />
            </>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
