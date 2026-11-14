'use client';

import React, { useState } from 'react';
import { CalendarCheck, Lock, PaperPlaneRight, Smiley } from '@phosphor-icons/react';
import { BASE_STICKERS, RANK_TIERS } from '@/data/catalog';
import { COPY, FORMAT_LABELS, GRADE_LABELS, LEVEL_LABELS, SUBJECT_LABELS } from '@/data/i18n';
import {
  resolveChatMessageText,
  resolvePersonName,
  resolveTutorName,
} from '@/data/tutors';
import { PWA_COPY } from '@/lib/pwaCopy';
import { ChatReactionBadge, getVisualSpec } from '@/components/ui/AcademicEmblem';
import { ModalShell } from '@/components/ui/ModalShell';
import type { Locale, Role, StudentRequest, TutorProfile } from '@/types/edumatch';

interface ChatModalProps {
  open: boolean;
  request: StudentRequest | null;
  tutor: TutorProfile | null;
  role: Role;
  locale: Locale;
  isPremium: boolean;
  xp: number;
  onClose: () => void;
  onSendMessage: (requestId: number, text: string) => void;
  onSendSticker: (requestId: number, iconKey: string) => void;
  onOpenPremium: () => void;
  onOpenBookingForRequest?: (requestId: number) => void;
}

export function ChatModal({
  open,
  request,
  tutor,
  role,
  locale,
  isPremium,
  xp,
  onClose,
  onSendMessage,
  onSendSticker,
  onOpenPremium,
  onOpenBookingForRequest,
}: ChatModalProps) {
  const copy = COPY[locale];
  const [input, setInput] = useState('');
  const [showTray, setShowTray] = useState(false);

  if (!request) return null;

  const meSide = role === 'student' ? 's' : 't';
  const partnerName =
    role === 'student'
      ? tutor
        ? resolveTutorName(tutor, locale)
        : 'Tutor'
      : resolvePersonName(request.st.name, locale);
  const unlockedRankStickers = RANK_TIERS.filter((r) => xp >= r.xp).map((r) => r.iconKey);
  const allStickers = Array.from(new Set([...BASE_STICKERS, ...unlockedRankStickers]));

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(request.id, input.trim());
    setInput('');
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={partnerName}
      closeLabel={copy.chat.close}
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-bold">
            {GRADE_LABELS[request.st.cat][locale]}
          </span>
          <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--primary)]">
            {(SUBJECT_LABELS[request.st.subj] ?? SUBJECT_LABELS['Математика'])[locale]}
          </span>
          {request.trial ? (
            <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--accent)]">
              {copy.chat.trialChip}
            </span>
          ) : null}
          {request.schedule ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-bold text-[var(--ink)]">
              <CalendarCheck size={12} weight="bold" aria-hidden="true" />
              {request.schedule.dateLabel} · {request.schedule.time} ·{' '}
              {FORMAT_LABELS[request.schedule.format][locale]}
            </span>
          ) : null}
          {role === 'student' && onOpenBookingForRequest ? (
            <button
              type="button"
              onClick={() => onOpenBookingForRequest(request.id)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#C8F542] px-2.5 py-1 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
            >
              {request.schedule
                ? PWA_COPY[locale].booking.changeSlotBtn
                : PWA_COPY[locale].booking.scheduleBtn}
            </button>
          ) : null}
          {role === 'teacher' ? (
            isPremium ? (
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-extrabold text-[var(--accent)]">
                {copy.teacher.levelPrefix}{' '}
                {request.st.level
                  ? LEVEL_LABELS[request.st.level][locale]
                  : copy.teacher.notTested}
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenPremium}
                className="em-lock-pattern inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold"
              >
                <Lock size={11} weight="bold" aria-hidden="true" />
                {copy.teacher.levelLocked}
              </button>
            )
          ) : null}
        </div>

        {/* Messages */}
        <div className="max-h-72 space-y-2.5 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
          {request.msgs.map((msg) => {
            const isMe = msg.from === meSide;
            if (msg.img) {
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <ChatReactionBadge iconKey={msg.img} locale={locale} />
                </div>
              );
            }
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm font-medium ${
                    isMe
                      ? 'rounded-br-sm bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                      : 'rounded-bl-sm border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                  }`}
                >
                  {msg.text ? resolveChatMessageText(msg.text, locale) : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Reaction Tray */}
        {showTray ? (
          <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-2.5">
            {allStickers.map((key) => {
              const spec = getVisualSpec(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onSendSticker(request.id, key);
                    setShowTray(false);
                  }}
                  aria-label={`Send ${spec.label[locale]} reaction`}
                  className="shrink-0 cursor-pointer rounded-2xl transition hover:scale-105"
                >
                  <ChatReactionBadge iconKey={key} locale={locale} compact />
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Input Row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTray((s) => !s)}
            aria-label={copy.chat.stickersAria}
            aria-pressed={showTray}
            className={`grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border transition ${
              showTray
                ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
            }`}
          >
            <Smiley size={20} weight="bold" aria-hidden="true" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={copy.chat.placeholder}
            className="h-11 min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)]"
          />

          <button
            type="button"
            onClick={handleSend}
            aria-label={copy.chat.sendAria}
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
          >
            <PaperPlaneRight size={18} weight="fill" aria-hidden="true" />
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
