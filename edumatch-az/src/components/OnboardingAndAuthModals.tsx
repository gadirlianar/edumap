'use client';

import React, { useState } from 'react';
import { ArrowRight, Crosshair, Lock } from '@phosphor-icons/react';
import {
  CITIES,
  GRADES,
  PRIVACY_POLICIES,
  TEACHING_LANGUAGES,
} from '@/data/catalog';
import { CITY_LABELS, COPY, GRADE_LABELS, LANG_LABELS } from '@/data/i18n';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import { ModalShell } from '@/components/ui/ModalShell';
import type {
  CityId,
  GradeId,
  Locale,
  Role,
  SectorCode,
  TeachingLanguageId,
} from '@/types/edumatch';

interface TourModalProps {
  open: boolean;
  locale: Locale;
  onLocaleChange: (next: Locale) => void;
  onClose: () => void;
  onFinishToAuth: () => void;
}

export function OnboardingTourModal({
  open,
  locale,
  onLocaleChange,
  onClose,
  onFinishToAuth,
}: TourModalProps) {
  const copy = COPY[locale];
  const [slide, setSlide] = useState(0);

  const slides = copy.modals.tourSlides;
  const current = slides[slide] ?? slides[0];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="EduMatch"
      subtitle={`${copy.modals.tourStepLabel} ${slide + 1} / ${slides.length}`}
      closeLabel={copy.modals.tourSkip}
      maxWidthClass="max-w-lg"
    >
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div
            role="group"
            aria-label={copy.nav.langToggle}
            className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] p-0.5"
          >
            {(['ru', 'az', 'en'] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLocaleChange(l)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                  locale === l
                    ? 'bg-[var(--ink)] text-[var(--bg)]'
                    : 'text-[var(--muted)]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[var(--primary-soft)]/50 p-6">
          <AcademicEmblem
            iconKey={current.iconKey}
            size="xl"
            className="animate-float mx-auto"
          />
          <h3 className="mt-4 text-xl font-extrabold text-[var(--ink)]">
            {current.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {current.desc}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${copy.modals.tourStepLabel} ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-2 cursor-pointer rounded-full transition-all ${
                  i === slide ? 'w-6 bg-[var(--primary)]' : 'w-2 bg-[var(--border)]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] cursor-pointer rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-bold"
            >
              {copy.modals.tourSkip}
            </button>
            <button
              type="button"
              onClick={() => {
                if (slide < slides.length - 1) setSlide((s) => s + 1);
                else {
                  setSlide(0);
                  onFinishToAuth();
                }
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-5 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
            >
              <span>
                {slide === slides.length - 1
                  ? copy.modals.tourStart
                  : copy.modals.tourNext}
              </span>
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

interface AuthModalProps {
  open: boolean;
  locale: Locale;
  onLocaleChange: (next: Locale) => void;
  initialRole: Role;
  initialCity: CityId;
  initialGrade: GradeId;
  initialSector: SectorCode;
  onClose: () => void;
  onLocateMe: () => void;
  onOpenPrivacy: (who: Role) => void;
  onNotify: (msg: string, cat?: string) => void;
  onSubmitAuth: (payload: {
    mode: 'up' | 'in';
    role: Role;
    name: string;
    email: string;
    city: CityId;
    grade: GradeId;
    sector: SectorCode;
    teachLangs: TeachingLanguageId[];
  }) => void;
}

export function AuthModal({
  open,
  locale,
  onLocaleChange,
  initialRole,
  initialCity,
  initialGrade,
  initialSector,
  onClose,
  onLocateMe,
  onOpenPrivacy,
  onNotify,
  onSubmitAuth,
}: AuthModalProps) {
  const copy = COPY[locale];
  const [mode, setMode] = useState<'up' | 'in'>('up');
  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState<CityId>(initialCity);
  const [sector, setSector] = useState<SectorCode>(initialSector);
  const [grade, setGrade] = useState<GradeId>(initialGrade);
  const [teachLangs, setTeachLangs] = useState<TeachingLanguageId[]>(['Азербайджанский']);
  const [accepted, setAccepted] = useState(false);

  const toggleLang = (lang: TeachingLanguageId) => {
    setTeachLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'up') {
      if (!name.trim() || !email.trim()) {
        onNotify(copy.modals.authErrContact, 'wow');
        return;
      }
      if (!accepted) {
        onNotify(copy.modals.authErrPolicy, 'wow');
        return;
      }
    }
    onSubmitAuth({
      mode,
      role,
      name: name.trim(),
      email: email.trim(),
      city,
      grade,
      sector,
      teachLangs,
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'up' ? copy.modals.authCreateTitle : copy.modals.authLoginTitle}
      closeLabel={copy.chat.close}
      maxWidthClass="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] p-0.5">
            {(['ru', 'az', 'en'] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLocaleChange(l)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                  locale === l
                    ? 'bg-[var(--ink)] text-[var(--bg)]'
                    : 'text-[var(--muted)]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            {copy.modals.authGuest}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <AcademicEmblem iconKey="mentor" size="lg" />
        </div>

        {mode === 'up' ? (
          <div className="grid grid-cols-2 gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] p-1">
            {(['student', 'teacher'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`min-h-[38px] cursor-pointer rounded-full text-xs font-extrabold transition ${
                  role === r
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                    : 'text-[var(--muted)]'
                }`}
              >
                {r === 'student' ? copy.modals.authStudent : copy.modals.authTutor}
              </button>
            ))}
          </div>
        ) : null}

        {mode === 'up' ? (
          <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
            <span>{copy.modals.authName}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)]"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
          <span>{copy.modals.authContact}</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)]"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
          <span>{copy.modals.authPassword}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)]"
          />
        </label>

        {mode === 'up' ? (
          <>
            <div>
              <div className="text-xs font-bold text-[var(--muted)]">
                {copy.modals.authWhere}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(Object.keys(CITIES) as CityId[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold ${
                      city === c
                        ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                        : 'border-[var(--border)] bg-[var(--surface-subtle)]'
                    }`}
                  >
                    {CITY_LABELS[c][locale]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onLocateMe}
                  className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1 text-xs font-bold"
                >
                  <Crosshair size={13} weight="bold" aria-hidden="true" />
                  {copy.modals.authDetect}
                </button>
              </div>
            </div>

            {role === 'student' ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-bold text-[var(--muted)]">
                    {copy.modals.authSector}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {(
                      [
                        ['az', 'AZ · Azərbaycan'],
                        ['ru', 'RU · Русский'],
                        ['en', 'EN · English'],
                      ] as [SectorCode, string][]
                    ).map(([code, label]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSector(code)}
                        className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold ${
                          sector === code
                            ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                            : 'border-[var(--border)] bg-[var(--surface-subtle)]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-1 text-xs font-bold text-[var(--muted)]">
                  <span>{copy.modals.authGrade}</span>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeId)}
                    className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)]"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {GRADE_LABELS[g][locale]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-[var(--muted)]">
                  {copy.modals.authTeachLangs}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {TEACHING_LANGUAGES.map((l) => {
                    const active = teachLangs.includes(l);
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => toggleLang(l)}
                        className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold ${
                          active
                            ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                            : 'border-[var(--border)] bg-[var(--surface-subtle)]'
                        }`}
                      >
                        {LANG_LABELS[l][locale]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <label className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--muted)]">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                {copy.modals.authAccept}{' '}
                <button
                  type="button"
                  onClick={() => onOpenPrivacy(role)}
                  className="cursor-pointer font-bold text-[var(--accent-ink)] underline"
                >
                  {copy.modals.authPrivacyLink}
                </button>
                {role === 'student' ? ` · ${copy.modals.authMinorNote}` : ''}
              </span>
            </label>
          </>
        ) : null}

        <button
          type="submit"
          className="min-h-[46px] w-full cursor-pointer rounded-full bg-[var(--primary-btn)] px-5 py-2.5 text-sm font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
        >
          {mode === 'up' ? copy.modals.authSubmitCreate : copy.modals.authSubmitLogin}
        </button>

        <p className="text-center text-xs text-[var(--muted)]">
          {mode === 'up' ? copy.modals.authHasAccount : copy.modals.authNewHere}{' '}
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'up' ? 'in' : 'up'))}
            className="cursor-pointer font-bold text-[var(--accent-ink)] hover:underline"
          >
            {mode === 'up' ? copy.modals.authToLogin : copy.modals.authToSignUp}
          </button>
        </p>
      </form>
    </ModalShell>
  );
}

interface PrivacyModalProps {
  open: boolean;
  locale: Locale;
  who: Role;
  onSwitchWho: (who: Role) => void;
  onClose: () => void;
}

export function PrivacyModal({
  open,
  locale,
  who,
  onSwitchWho,
  onClose,
}: PrivacyModalProps) {
  const copy = COPY[locale];
  const sections = PRIVACY_POLICIES[locale][who];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={copy.modals.privacyTitle}
      closeLabel={copy.chat.close}
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] p-1">
          {(['student', 'teacher'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onSwitchWho(r)}
              className={`min-h-[38px] cursor-pointer rounded-full text-xs font-extrabold transition ${
                who === r
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                  : 'text-[var(--muted)]'
              }`}
            >
              {r === 'student' ? copy.modals.forStudents : copy.modals.forTutors}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {sections.map((sec) => (
            <div
              key={sec.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--ink)]">
                <Lock size={14} weight="fill" className="text-[var(--accent)]" aria-hidden="true" />
                <span>{sec.title}</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{sec.body}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--muted)]">{copy.modals.privacyDraftNote}</p>
      </div>
    </ModalShell>
  );
}
