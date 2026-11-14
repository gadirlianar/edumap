'use client';

import React from 'react';
import { Check, Crown, Megaphone } from '@phosphor-icons/react';
import { COPY } from '@/data/i18n';
import { AcademicEmblem } from '@/components/ui/AcademicEmblem';
import type { Locale } from '@/types/edumatch';

interface TeacherPremiumWorkspaceProps {
  locale: Locale;
  isPremium: boolean;
  planName: string;
  promoDays: number;
  onActivatePremium: (plan: string) => void;
  onSetPromo: (days: number) => void;
  onNotifyAd: (msg: string) => void;
  onOpenPartnerModal?: () => void;
}

export function TeacherPremiumWorkspace({
  locale,
  isPremium,
  planName,
  promoDays,
  onActivatePremium,
  onSetPromo,
  onNotifyAd,
  onOpenPartnerModal,
}: TeacherPremiumWorkspaceProps) {
  const copy = COPY[locale];

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="em-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-extrabold text-[var(--accent-ink)]">
            <Crown size={14} weight="fill" aria-hidden="true" />
            <span>{copy.nav.premium}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {copy.teacher.premiumBannerTitle}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{copy.teacher.premiumBannerSub}</p>
        </div>
        <AcademicEmblem iconKey="money" size="xl" />
      </div>

      {/* Premium Card */}
      <div className="em-card rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold">
            {copy.teacher.premiumHeading}
            {isPremium ? ` · ${copy.teacher.activeStatus}` : ''}
          </h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-extrabold ${
              isPremium
                ? 'border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                : 'border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
            }`}
          >
            {isPremium ? planName : copy.teacher.forTutors}
          </span>
        </div>

        <ul className="mt-4 space-y-2.5 text-sm font-medium">
          {copy.teacher.premiumPerks.map((perk) => (
            <li key={perk} className="flex items-start gap-2">
              <Check
                size={16}
                weight="bold"
                className="mt-0.5 shrink-0 text-[var(--accent)]"
                aria-hidden="true"
              />
              <span>{perk}</span>
            </li>
          ))}
        </ul>

        {!isPremium ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {copy.teacher.plans.map((p, idx) => {
              const featured = idx === 1;
              return (
                <div
                  key={p.label}
                  className={`flex flex-col justify-between rounded-2xl border p-5 text-center transition-colors ${
                    featured
                      ? 'border-[var(--accent)] bg-[var(--surface)] shadow-[var(--shadow-card)]'
                      : 'border-[var(--border)] bg-[var(--surface-subtle)]'
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--accent-ink)]">
                    {p.label}
                  </div>
                  <div className="font-mono-num my-3 text-2xl font-semibold text-[var(--ink)]">
                    {p.price}
                  </div>
                  <button
                    type="button"
                    onClick={() => onActivatePremium(p.label)}
                    className={`min-h-[38px] cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      featured
                        ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)] hover:bg-[var(--primary-btn-hover)]'
                        : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]'
                    }`}
                  >
                    {copy.teacher.buyBtn}
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Search Boost */}
      <div className="em-card rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-[var(--ink)]">{copy.teacher.promoHeading}</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase text-[var(--accent-ink)]">
            <Megaphone size={12} weight="fill" aria-hidden="true" />
            {copy.teacher.adPartnerTag}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{copy.teacher.promoDesc}</p>

        {promoDays > 0 ? (
          <div className="mt-3 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-2.5 text-xs font-semibold text-[var(--accent-ink)]">
            {copy.teacher.promoActive} {promoDays} {copy.teacher.daysUnit}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSetPromo(7)}
            className="min-h-[38px] cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)]"
          >
            {copy.teacher.promo7}
          </button>
          <button
            type="button"
            onClick={() => onSetPromo(30)}
            className="min-h-[38px] cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--ink)]"
          >
            {copy.teacher.promo30}
          </button>
          {promoDays > 0 ? (
            <button
              type="button"
              onClick={() => onSetPromo(0)}
              className="min-h-[38px] cursor-pointer rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--accent-ink)]"
            >
              {copy.teacher.promoOff}
            </button>
          ) : null}
        </div>
      </div>

      {/* Sleek Partner Capsule */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-[var(--accent-border)]/70 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)] to-[var(--accent-soft)]/35 p-5 shadow-[var(--shadow-card)]">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--accent-ink)]">
            {copy.teacher.adPartnerTag}
          </span>
          <h3 className="mt-1.5 text-sm font-semibold text-[var(--ink)]">{copy.teacher.adPartnerTitle}</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{copy.teacher.adPartnerDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <AcademicEmblem iconKey="mega" size="md" />
          <button
            type="button"
            onClick={() => (onOpenPartnerModal ? onOpenPartnerModal() : onNotifyAd(copy.teacher.adPartnerToast))}
            className="min-h-[38px] shrink-0 cursor-pointer rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-semibold text-[var(--primary-btn-ink)] transition-all duration-150 hover:bg-[var(--primary-btn-hover)] active:scale-[0.97]"
          >
            {copy.teacher.adPartnerCta}
          </button>
        </div>
      </div>
    </div>
  );
}
