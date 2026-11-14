import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import manifest from '@/app/manifest';
import nextConfig from '../../next.config';
import { DEFAULT_PERSISTED_STATE, sanitizePersistedState } from '@/lib/storage';
import { readNavigationFromUrl, writeNavigationToUrl } from '@/lib/urlSync';
import { PwaInstallGuideModal } from '@/components/PwaManager';

describe('EduMatch PWA infrastructure', () => {
  test('manifest exports standalone installable PWA metadata and icons', () => {
    const data = manifest();

    expect(data.name).toBe('EduMatch — Smart Tutor & Learning Studio');
    expect(data.short_name).toBe('EduMatch');
    expect(data.start_url).toBe('/?source=pwa');
    expect(data.display).toBe('standalone');
    expect(data.background_color).toBe('#EBF7FE');
    expect(data.theme_color).toBe('#C7E6FF');

    const icons = data.icons ?? [];
    expect(icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        }),
        expect.objectContaining({
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        }),
        expect.objectContaining({
          src: '/icons/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        }),
      ]),
    );
  });

  test('next config serves /sw.js with no-cache headers', async () => {
    const headersList = await nextConfig.headers?.();
    const swRule = headersList?.find((rule) => rule.source === '/sw.js');
    expect(swRule).toBeDefined();
    expect(swRule?.headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        }),
        expect.objectContaining({
          key: 'Service-Worker-Allowed',
          value: '/',
        }),
      ]),
    );
  });

  test('sanitizePersistedState migrates legacy v1 payloads safely', () => {
    const legacyPayload = {
      ...DEFAULT_PERSISTED_STATE,
      notifications: undefined,
      videoNotes: undefined,
      partnerEnrolled: undefined,
    };

    const hydrated = sanitizePersistedState(legacyPayload);
    expect(hydrated.notifications).toEqual([]);
    expect(hydrated.videoNotes).toEqual({});
    expect(hydrated.partnerEnrolled).toBe(false);
    expect(hydrated.alertsEnabled).toBe(true);
    expect(hydrated.requests.length).toBeGreaterThan(0);
  });

  test('readNavigationFromUrl respects URL precedence and falls back cleanly on invalid params', () => {
    window.history.replaceState(null, '', '/?role=teacher&tab=studio');
    expect(readNavigationFromUrl('student')).toEqual({
      role: 'teacher',
      tab: 'studio',
      hasUrlOverride: true,
    });

    window.history.replaceState(null, '', '/?role=unknown&tab=hack');
    expect(readNavigationFromUrl('student')).toEqual({
      role: 'student',
      tab: 'search',
      hasUrlOverride: false,
    });

    writeNavigationToUrl('teacher', 'inbox');
    expect(window.location.search).toContain('role=teacher');
    expect(window.location.search).toContain('tab=inbox');
  });

  test('PwaInstallGuideModal renders platform install steps when native prompt is unavailable', async () => {
    const user = userEvent.setup();
    let closed = false;
    render(
      <PwaInstallGuideModal
        open={true}
        onClose={() => {
          closed = true;
        }}
        locale="az"
        isIos={true}
        isInstalled={false}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Əsas ekrana əlavə et/i)).toBeInTheDocument();
    const closeBtns = screen.getAllByRole('button', { name: /Close|Bağla|Закрыть/i });
    await user.click(closeBtns[0]);
    expect(closed).toBe(true);
  });
});
