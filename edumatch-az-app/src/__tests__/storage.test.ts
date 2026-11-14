import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearPersistedState,
  getPersistedSnapshot,
  getServerPersistedSnapshot,
  subscribePersistedState,
  updatePersistedState,
} from '@/lib/storage';

describe('EduMatch localStorage external store & state sanitizer', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearPersistedState();
  });

  it('defaults to light theme and ru locale to avoid SSR hydration flash', () => {
    const snap = getPersistedSnapshot();
    const serverSnap = getServerPersistedSnapshot();

    expect(snap.theme).toBe('light');
    expect(snap.locale).toBe('ru');
    expect(serverSnap.theme).toBe('light');
    expect(serverSnap.locale).toBe('ru');
  });

  it('persists updates to localStorage and notifies subscribers', () => {
    const listener = vi.fn();
    const unsub = subscribePersistedState(listener);

    updatePersistedState((prev) => ({
      ...prev,
      locale: 'az',
      theme: 'dark',
    }));

    expect(listener).toHaveBeenCalledTimes(1);
    const snap = getPersistedSnapshot();
    expect(snap.locale).toBe('az');
    expect(snap.theme).toBe('dark');
    expect(window.localStorage.length).toBe(1);

    unsub();
  });

  it('recovers gracefully from corrupt JSON in localStorage', () => {
    updatePersistedState((prev) => ({ ...prev, locale: 'en' }));
    const storageKey = window.localStorage.key(0);
    expect(storageKey).toBeTruthy();

    window.localStorage.setItem(storageKey as string, '{not-valid-json');
    const recovered = getPersistedSnapshot();

    expect(recovered.locale).toBe('ru');
    expect(recovered.theme).toBe('light');
    expect(Array.isArray(recovered.tutors)).toBe(true);
    expect(recovered.tutors.length).toBeGreaterThan(0);
  });

  it('sanitizes partial objects, invalid theme/role enums, and dead blob video URLs', () => {
    updatePersistedState((prev) => ({ ...prev }));
    const storageKey = window.localStorage.key(0) as string;

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        locale: 'az',
        theme: 'bogus-theme',
        role: 'admin',
        student: {
          xp: 140,
        },
        account: {
          name: 'Aysel',
        },
        tutors: 'corrupted-not-an-array',
        content: {
          me: {
            videos: [
              {
                id: 'v-blob',
                title: { ru: 'Blob video', az: 'Blob', en: 'Blob' },
                dur: '04:00',
                free: true,
                url: 'blob:https://edumatch.vercel.app/dead-object-url',
              },
            ],
            courses: [],
            tests: [],
            hw: [],
          },
        },
      }),
    );

    const sanitized = getPersistedSnapshot();
    expect(sanitized.locale).toBe('az');
    expect(sanitized.theme).toBe('light');
    expect(sanitized.role).toBe('student');
    expect(sanitized.student.xp).toBe(140);
    expect(sanitized.student.ach).toBeDefined();
    expect(sanitized.account.name).toBe('Aysel');
    expect(sanitized.account.premium).toBe(false);
    expect(Array.isArray(sanitized.tutors)).toBe(true);
    expect(sanitized.tutors.length).toBeGreaterThan(0);
    expect(sanitized.content.me.videos[0].url).toBeUndefined();

    // Unsupported version resets safely to default v1 state
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 99, locale: 'en' }),
    );
    expect(getPersistedSnapshot().locale).toBe('ru');
  });

  it('blocks prototype pollution, unsafe javascript/data video URLs, and malformed shapes', () => {
    updatePersistedState((prev) => ({ ...prev }));
    const storageKey = window.localStorage.key(0) as string;

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        account: ['not-an-object'],
        student: { xp: Number.NaN, ach: ['bad'] },
        completedTests: { __proto__: { polluted: true }, t1: true, bad: 123 },
        videoNotes: {
          v1: [{ id: 'n1', timeSec: 12, text: 'Ok', createdAt: 1000 }, { bad: true }],
          vCorrupt: 'not-an-array',
          __proto__: [{ id: 'x', timeSec: 0, text: 'p', createdAt: 1 }],
        },
        location: { name: 'Bad', lat: null, lon: 49.8 },
        radiusKm: -5,
        requests: [{ id: 1, tid: 'me', trial: true, status: 'new', st: null, msgs: 'bad' }],
        content: {
          __proto__: { videos: [] },
          me: {
            videos: [
              null,
              {
                id: 'v-xss',
                title: 'Unsafe',
                dur: '03:00',
                free: true,
                url: 'javascript:alert(1)',
              },
              {
                id: 'v-data',
                title: 'Data',
                dur: '03:00',
                free: true,
                url: 'data:text/html,<script>alert(1)</script>',
              },
              {
                id: 'v-ok',
                title: 'Safe',
                dur: '05:00',
                free: true,
                url: 'https://cdn.example.com/lesson.mp4',
              },
            ],
            courses: [],
            tests: [],
            hw: [],
          },
        },
      }),
    );

    const sanitized = getPersistedSnapshot();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(sanitized.content, '__proto__')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(sanitized.videoNotes, '__proto__')).toBe(false);
    expect(Array.isArray(sanitized.videoNotes.v1)).toBe(true);
    expect(sanitized.videoNotes.v1).toHaveLength(1);
    expect(sanitized.videoNotes.vCorrupt).toBeUndefined();
    expect(sanitized.completedTests).toEqual({ t1: true });
    expect(sanitized.student.xp).toBe(120);
    expect(sanitized.location.name).toBe('Баку');
    expect(sanitized.radiusKm).toBe(51);
    expect(sanitized.requests).toEqual([]);

    const meVideos = sanitized.content.me.videos;
    expect(meVideos.map((v) => v.id)).toEqual(['v-xss', 'v-data', 'v-ok']);
    expect(meVideos.find((v) => v.id === 'v-xss')?.url).toBeUndefined();
    expect(meVideos.find((v) => v.id === 'v-data')?.url).toBeUndefined();
    expect(meVideos.find((v) => v.id === 'v-ok')?.url).toBe('https://cdn.example.com/lesson.mp4');
  });
});
