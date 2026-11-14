'use client';

import React, { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Clock,
  Laptop,
  MapPin,
  WarningCircle,
} from '@phosphor-icons/react';
import { FORMAT_LABELS } from '@/data/i18n';
import { resolveTutorName } from '@/data/tutors';
import { PWA_COPY } from '@/lib/pwaCopy';
import type {
  LessonFormatId,
  LessonSchedule,
  Locale,
  StudentRequest,
  TutorProfile,
} from '@/types/edumatch';
import { ModalShell } from './ui/ModalShell';

const DAY_OPTIONS: Array<{ key: string; labels: Record<Locale, string> }> = [
  { key: 'mon', labels: { ru: 'Понедельник', az: 'Bazar ertəsi', en: 'Monday' } },
  { key: 'tue', labels: { ru: 'Вторник', az: 'Çərşənbə axşamı', en: 'Tuesday' } },
  { key: 'wed', labels: { ru: 'Среда', az: 'Çərşənbə', en: 'Wednesday' } },
  { key: 'thu', labels: { ru: 'Четверг', az: 'Cümə axşamı', en: 'Thursday' } },
  { key: 'fri', labels: { ru: 'Пятница', az: 'Cümə', en: 'Friday' } },
  { key: 'sat', labels: { ru: 'Суббота', az: 'Şənbə', en: 'Saturday' } },
];

const TIME_SLOTS = ['10:00', '12:00', '15:00', '16:30', '18:00', '19:30'];

export function getDayLabel(dayKey: string, locale: Locale): string {
  return DAY_OPTIONS.find((d) => d.key === dayKey)?.labels[locale] ?? DAY_OPTIONS[1].labels[locale];
}

export function defaultScheduleForTutor(
  tutor: TutorProfile | null,
  locale: Locale,
  trial = true,
): LessonSchedule {
  const format: LessonFormatId = tutor?.fmt[0] ?? 'Онлайн';
  return {
    dayKey: 'tue',
    dateLabel: getDayLabel('tue', locale),
    time: '18:00',
    format,
    durationMin: trial ? 30 : 45,
  };
}

export function findSlotConflict(
  requests: StudentRequest[],
  schedule: LessonSchedule,
  excludeReqId?: number,
): StudentRequest | undefined {
  return requests.find((req) => {
    if (!req.mine || !req.schedule) return false;
    if (excludeReqId !== undefined && req.id === excludeReqId) return false;
    if (req.status === 'done' || req.status === 'declined') return false;
    return req.schedule.dayKey === schedule.dayKey && req.schedule.time === schedule.time;
  });
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  tutor: TutorProfile | null;
  initialRequest?: StudentRequest | null;
  existingRequests: StudentRequest[];
  onConfirmBooking: (
    tutorId: string,
    payload: { trial: boolean; schedule: LessonSchedule; msg: string; requestId?: number },
  ) => void;
}

export function BookingModal({
  open,
  onClose,
  locale,
  tutor,
  initialRequest = null,
  existingRequests,
  onConfirmBooking,
}: BookingModalProps) {
  if (!open || !tutor) return null;

  return (
    <BookingModalContent
      key={`${tutor.id}-${initialRequest?.id ?? 'new'}`}
      open={open}
      onClose={onClose}
      locale={locale}
      tutor={tutor}
      initialRequest={initialRequest}
      existingRequests={existingRequests}
      onConfirmBooking={onConfirmBooking}
    />
  );
}

interface BookingModalContentProps extends Omit<BookingModalProps, 'tutor'> {
  tutor: TutorProfile;
}

function BookingModalContent({
  open,
  onClose,
  locale,
  tutor,
  initialRequest = null,
  existingRequests,
  onConfirmBooking,
}: BookingModalContentProps) {
  const c = PWA_COPY[locale].booking;
  const closeLabel = locale === 'az' ? 'Bağla' : locale === 'en' ? 'Close' : 'Закрыть';

  const availableFormats: LessonFormatId[] =
    tutor.fmt.length > 0 ? tutor.fmt : ['Онлайн', 'Офлайн'];

  const initialTrial = initialRequest ? initialRequest.trial : true;
  const requestedFormat = initialRequest?.schedule?.format;
  const initialFormat: LessonFormatId =
    requestedFormat && availableFormats.includes(requestedFormat)
      ? requestedFormat
      : availableFormats[0];

  const [trial, setTrial] = useState<boolean>(initialTrial);
  const [dayKey, setDayKey] = useState<string>(initialRequest?.schedule?.dayKey ?? 'tue');
  const [time, setTime] = useState<string>(initialRequest?.schedule?.time ?? '16:30');
  const [format, setFormat] = useState<LessonFormatId>(initialFormat);
  const [goal, setGoal] = useState<string>(initialRequest?.schedule?.goal ?? '');

  const currentSchedule: LessonSchedule = useMemo(
    () => ({
      dayKey,
      dateLabel: getDayLabel(dayKey, locale),
      time,
      format,
      durationMin: trial ? 30 : 45,
      ...(goal.trim() ? { goal: goal.trim() } : {}),
    }),
    [dayKey, format, goal, locale, time, trial],
  );

  const conflict = useMemo(
    () => findSlotConflict(existingRequests, currentSchedule, initialRequest?.id),
    [currentSchedule, existingRequests, initialRequest?.id],
  );

  const tutorName = resolveTutorName(tutor, locale);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBooking(tutor.id, {
      trial,
      schedule: currentSchedule,
      msg: currentSchedule.goal || `${currentSchedule.dateLabel} · ${currentSchedule.time}`,
      requestId: initialRequest?.id,
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={c.modalTitle}
      subtitle={`${tutorName} · ${c.modalSubtitle}`}
      maxWidthClass="max-w-xl"
      closeLabel={closeLabel}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!initialRequest && (
          <div className="space-y-1.5">
            <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {c.typeLabel}
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTrial(true)}
                className={`cursor-pointer rounded-2xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  trial
                    ? 'border-transparent bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
                }`}
              >
                {c.trialOption}
              </button>
              <button
                type="button"
                onClick={() => setTrial(false)}
                className={`cursor-pointer rounded-2xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  !trial
                    ? 'border-transparent bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
                }`}
              >
                {c.regularOption} · {tutor.price} ₼
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <CalendarCheck size={14} weight="bold" aria-hidden="true" />
            {c.dayLabel}
          </span>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {DAY_OPTIONS.map((d) => {
              const active = d.key === dayKey;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDayKey(d.key)}
                  className={`cursor-pointer rounded-xl border px-2 py-2 text-center text-xs font-semibold transition ${
                    active
                      ? 'border-transparent bg-[#C8F542] text-[#0F172A]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {d.labels[locale].slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            <Clock size={14} weight="bold" aria-hidden="true" />
            {c.timeLabel}
          </span>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {TIME_SLOTS.map((slot) => {
              const active = slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`cursor-pointer rounded-xl border px-2.5 py-2 font-mono text-xs font-bold transition ${
                    active
                      ? 'border-transparent bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            {c.formatLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {availableFormats.map((fmt) => {
              const active = fmt === format;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? 'border-transparent bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
                  }`}
                >
                  {fmt === 'Онлайн' ? (
                    <Laptop size={14} weight="bold" aria-hidden="true" />
                  ) : (
                    <MapPin size={14} weight="bold" aria-hidden="true" />
                  )}
                  {FORMAT_LABELS[fmt][locale]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="booking-goal-input"
            className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
          >
            {c.goalLabel}
          </label>
          <input
            id="booking-goal-input"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={c.goalPlaceholder}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--border-strong)]"
          />
        </div>

        {conflict && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-semibold text-amber-800 dark:text-amber-200">
            <WarningCircle size={18} weight="fill" className="shrink-0 text-amber-500" aria-hidden="true" />
            <span>
              {c.conflictWarning} ({conflict.schedule?.dateLabel} · {conflict.schedule?.time})
            </span>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--ink)]"
          >
            {closeLabel}
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#C8F542] px-5 py-2.5 text-xs font-bold text-[#0F172A] shadow-xs transition hover:brightness-95"
          >
            {initialRequest ? c.saveRescheduleBtn : c.confirmBtn}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
