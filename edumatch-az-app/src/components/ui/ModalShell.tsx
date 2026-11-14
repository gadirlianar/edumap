'use client';

import React, { useEffect, useId, useRef } from 'react';
import { X } from '@phosphor-icons/react';
import { motion } from 'motion/react';

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  closeLabel?: string;
  children: React.ReactNode;
}

export function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  maxWidthClass = 'max-w-2xl',
  closeLabel = 'Close',
  children,
}: ModalShellProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    if (!dialog.open) {
      if (typeof dialog.showModal === 'function') {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute('open', '');
        }
      } else {
        dialog.setAttribute('open', '');
      }
    }

    return () => {
      if (dialog.open) {
        if (typeof dialog.close === 'function') {
          try {
            dialog.close();
          } catch {
            dialog.removeAttribute('open');
          }
        } else {
          dialog.removeAttribute('open');
        }
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (e.key === 'Escape' && dialog) {
        // Fallback when showModal isn't supported (e.g. jsdom) — only close top-most open dialog
        const openDialogs = Array.from(document.querySelectorAll('dialog[open]'));
        if (openDialogs[openDialogs.length - 1] === dialog && typeof dialog.showModal !== 'function') {
          e.preventDefault();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const isOutsidePanel = (clientX: number, clientY: number) => {
    const panel = panelRef.current;
    if (!panel) return false;
    const rect = panel.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    return (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    );
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isOutsidePanel(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isOutsidePanel(e.clientX, e.clientY)) {
          onClose();
        }
        pressedOutsideRef.current = false;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 m-auto flex max-h-none max-w-none items-end justify-center border-0 bg-transparent p-0 text-inherit sm:items-center sm:p-4"
    >
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className={`em-liquid-sheet relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-[28px] text-[var(--ink)] sm:w-[calc(100vw-2rem)] sm:rounded-[28px] ${maxWidthClass}`}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-[var(--muted)]/35 sm:hidden"
        />
        <div className="flex items-start justify-between gap-4 border-b border-[var(--glass-border)] bg-white/35 px-5 py-3.5 dark:bg-white/[0.04] sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-lg font-semibold tracking-tight text-[var(--ink)]">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </motion.div>
    </dialog>
  );
}
