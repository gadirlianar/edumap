'use client';

import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  CheckCircle,
  DeviceMobile,
  DownloadSimple,
  WifiSlash,
  X,
} from '@phosphor-icons/react';
import { PWA_COPY } from '@/lib/pwaCopy';
import type { Locale } from '@/types/edumatch';
import { ModalShell } from './ui/ModalShell';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'edumatch_pwa_banner_dismissed';
const bannerListeners = new Set<() => void>();

function notifyBannerListeners() {
  bannerListeners.forEach((fn) => fn());
}

function subscribeOnline(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('online', onStoreChange);
  window.addEventListener('offline', onStoreChange);
  return () => {
    window.removeEventListener('online', onStoreChange);
    window.removeEventListener('offline', onStoreChange);
  };
}

function getOfflineSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return !window.navigator.onLine;
}

function subscribeDisplayMode(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('appinstalled', onStoreChange);
  return () => window.removeEventListener('appinstalled', onStoreChange);
}

function getStandaloneSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (window.matchMedia?.('(display-mode: standalone)').matches ?? false) ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function noopSubscribe(): () => void {
  return () => undefined;
}

function getIsIosSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
}

function subscribeBannerDismiss(onStoreChange: () => void): () => void {
  bannerListeners.add(onStoreChange);
  if (typeof window === 'undefined') return () => bannerListeners.delete(onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    bannerListeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getBannerDismissSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return true;
  }
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installedOverride, setInstalledOverride] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const standaloneSnapshot = useSyncExternalStore(
    subscribeDisplayMode,
    getStandaloneSnapshot,
    () => false,
  );
  const isIos = useSyncExternalStore(noopSubscribe, getIsIosSnapshot, () => false);
  const isOffline = useSyncExternalStore(subscribeOnline, getOfflineSnapshot, () => false);
  const bannerDismissed = useSyncExternalStore(
    subscribeBannerDismiss,
    getBannerDismissSnapshot,
    () => true,
  );

  const isInstalled = standaloneSnapshot || installedOverride;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (
      'serviceWorker' in window.navigator &&
      process.env.NODE_ENV !== 'test'
    ) {
      window.navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      try {
        window.localStorage.removeItem(DISMISS_KEY);
      } catch {
        // Ignore storage errors
      }
      notifyBannerListeners();
    };
    const handleInstalled = () => {
      setInstalledOverride(true);
      setDeferredPrompt(null);
      notifyBannerListeners();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismissBanner = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Ignore storage quota errors
    }
    notifyBannerListeners();
  }, []);

  const triggerInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledOverride(true);
        }
        setDeferredPrompt(null);
        notifyBannerListeners();
        return;
      } catch {
        // Fallback to manual platform guide below
      }
    }
    setGuideOpen(true);
  }, [deferredPrompt]);

  return {
    canNativeInstall: Boolean(deferredPrompt),
    isInstalled,
    isIos,
    isOffline,
    showBanner: !isInstalled && !bannerDismissed && (Boolean(deferredPrompt) || isIos),
    dismissBanner,
    triggerInstall,
    guideOpen,
    setGuideOpen,
  };
}

interface PwaInstallGuideModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  isIos: boolean;
  isInstalled: boolean;
}

export function PwaInstallGuideModal({
  open,
  onClose,
  locale,
  isIos,
  isInstalled,
}: PwaInstallGuideModalProps) {
  const c = PWA_COPY[locale].pwa;
  const steps = isIos ? c.guideIosSteps : c.guideDesktopSteps;
  const closeLabel = locale === 'az' ? 'Bağla' : locale === 'en' ? 'Close' : 'Закрыть';

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={c.guideTitle}
      subtitle={c.guideSubtitle}
      maxWidthClass="max-w-lg"
      closeLabel={closeLabel}
    >
      <div className="space-y-4">
        {isInstalled ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-[var(--ink)]">
            <CheckCircle size={22} weight="fill" className="shrink-0 text-emerald-500" />
            <span>{c.guideAlreadyInstalled}</span>
          </div>
        ) : (
          <ol className="space-y-2.5">
            {steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3.5 text-sm leading-relaxed text-[var(--ink)]"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-xs font-bold text-[#C8F542]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full bg-[var(--primary-btn)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-btn-ink)] transition hover:opacity-90"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

interface PwaStatusOverlayProps {
  locale: Locale;
  isOffline: boolean;
  showBanner: boolean;
  isInstalled: boolean;
  isIos: boolean;
  guideOpen: boolean;
  onCloseGuide: () => void;
  onInstall: () => void;
  onDismiss: () => void;
}

export function PwaStatusOverlay({
  locale,
  isOffline,
  showBanner,
  isInstalled,
  isIos,
  guideOpen,
  onCloseGuide,
  onInstall,
  onDismiss,
}: PwaStatusOverlayProps) {
  const c = PWA_COPY[locale].pwa;

  return (
    <>
      {isOffline && (
        <div
          role="status"
          className="em-liquid-dock fixed bottom-[calc(4.65rem+env(safe-area-inset-bottom,0px))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border-amber-500/40 px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] sm:bottom-5"
        >
          <WifiSlash size={14} weight="bold" className="text-amber-500 dark:text-[#C8F542]" aria-hidden="true" />
          <span>{c.offlineBadge}</span>
        </div>
      )}

      {showBanner && !isOffline && (
        <div className="em-liquid-dock fixed inset-x-3 bottom-[calc(4.8rem+env(safe-area-inset-bottom,0px))] z-30 rounded-[24px] p-3.5 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[340px]">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0F172A] text-[#C8F542]">
              <DeviceMobile size={20} weight="duotone" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--ink)]">{c.installBannerTitle}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--muted)]">
                {c.installBannerDesc}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onInstall}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#C8F542] px-3 py-1.5 text-[11px] font-bold text-[#0F172A] transition hover:brightness-95"
                >
                  <DownloadSimple size={13} weight="bold" aria-hidden="true" />
                  {c.installNow}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="cursor-pointer rounded-full px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  {c.later}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              aria-label={c.dismissLabel}
              className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]"
            >
              <X size={14} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <PwaInstallGuideModal
        open={guideOpen}
        onClose={onCloseGuide}
        locale={locale}
        isIos={isIos}
        isInstalled={isInstalled}
      />
    </>
  );
}
