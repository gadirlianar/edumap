'use client';

import React from 'react';
import {
  ArrowRight,
  BellRinging,
  BookOpenText,
  CalendarCheck,
  ChatCircleDots,
  Checks,
  EnvelopeOpen,
  Sparkle,
  Trash,
  VideoCamera,
} from '@phosphor-icons/react';
import { PWA_COPY } from '@/lib/pwaCopy';
import type { AppNotification, Locale } from '@/types/edumatch';
import { ModalShell } from './ui/ModalShell';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearRead: () => void;
  onSelectNotification: (notification: AppNotification) => void;
}

const KIND_STYLES: Record<AppNotification['kind'], string> = {
  booking: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  chat: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
  homework: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  invite: 'bg-[#C8F542] text-[#0F172A]',
  quiz: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  studio: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
};

function renderKindIcon(kind: AppNotification['kind']) {
  switch (kind) {
    case 'booking':
      return <CalendarCheck size={16} weight="bold" aria-hidden="true" />;
    case 'chat':
      return <ChatCircleDots size={16} weight="bold" aria-hidden="true" />;
    case 'homework':
      return <BookOpenText size={16} weight="bold" aria-hidden="true" />;
    case 'invite':
      return <EnvelopeOpen size={16} weight="bold" aria-hidden="true" />;
    case 'quiz':
      return <Sparkle size={16} weight="bold" aria-hidden="true" />;
    case 'studio':
      return <VideoCamera size={16} weight="bold" aria-hidden="true" />;
  }
}

export function NotificationDrawer({
  open,
  onClose,
  locale,
  notifications,
  onMarkAllRead,
  onClearRead,
  onSelectNotification,
}: NotificationDrawerProps) {
  const c = PWA_COPY[locale].notifications;
  const closeLabel = locale === 'az' ? 'Bağla' : locale === 'en' ? 'Close' : 'Закрыть';
  const unreadCount = notifications.filter((item) => !item.read).length;

  const formatTime = (ts: number) => {
    try {
      return new Intl.DateTimeFormat(locale === 'az' ? 'az-AZ' : locale === 'en' ? 'en-US' : 'ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(ts));
    } catch {
      return '';
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={c.title}
      subtitle={c.subtitle}
      maxWidthClass="max-w-xl"
      closeLabel={closeLabel}
    >
      <div className="space-y-4">
        {notifications.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
              <BellRinging size={14} weight="bold" className="text-emerald-500" aria-hidden="true" />
              {unreadCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMarkAllRead}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]"
              >
                <Checks size={14} weight="bold" aria-hidden="true" />
                {c.markAllRead}
              </button>
              <button
                type="button"
                onClick={onClearRead}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--ink)]"
              >
                <Trash size={14} weight="bold" aria-hidden="true" />
                {c.clearRead}
              </button>
            </div>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-8 text-center">
            <BellRinging size={28} weight="duotone" className="mx-auto mb-2 text-[var(--muted)]" aria-hidden="true" />
            <p className="text-sm font-semibold text-[var(--ink)]">{c.emptyTitle}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{c.emptyDesc}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`flex items-start justify-between gap-3 rounded-2xl border p-3.5 transition ${
                  item.read
                    ? 'border-[var(--border)] bg-[var(--surface)]'
                    : 'border-emerald-500/35 bg-emerald-500/[0.06]'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${KIND_STYLES[item.kind]}`}
                  >
                    {renderKindIcon(item.kind)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-xs font-bold text-[var(--ink)]">{item.title}</p>
                      {!item.read && (
                        <span className="rounded-full bg-[#C8F542] px-2 py-0.5 text-[10px] font-bold text-[#0F172A]">
                          {c.unreadBadge}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-[var(--muted)]">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                      {item.body}
                    </p>
                  </div>
                </div>

                {item.target && (
                  <button
                    type="button"
                    onClick={() => onSelectNotification(item)}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[var(--primary-btn)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition hover:opacity-90"
                  >
                    <span>{c.openAction}</span>
                    <ArrowRight size={12} weight="bold" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}
