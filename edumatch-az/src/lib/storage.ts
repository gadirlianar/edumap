import { CITIES } from '@/data/catalog';
import {
  INITIAL_ACCOUNT,
  INITIAL_CONTENT,
  INITIAL_REQUESTS,
  INITIAL_TUTORS,
} from '@/data/tutors';
import type {
  AccountProfile,
  HomeworkSubmission,
  Locale,
  LocationState,
  Role,
  StudentRequest,
  StudentState,
  ThemeMode,
  TutorContent,
  TutorProfile,
} from '@/types/edumatch';

export const STORAGE_KEY = 'edumatch_state_v1';

export interface PersistedAppState {
  version: 1;
  locale: Locale;
  role: Role;
  theme: ThemeMode;
  account: AccountProfile;
  student: StudentState;
  tutors: TutorProfile[];
  requests: StudentRequest[];
  content: Record<string, TutorContent>;
  favorites: string[];
  ownedCourses: string[];
  seenVideos: string[];
  completedTests: Record<string, boolean>;
  hwSubmissions: HomeworkSubmission[];
  location: LocationState;
  radiusKm: number;
}

export const DEFAULT_PERSISTED_STATE: PersistedAppState = {
  version: 1,
  locale: 'ru',
  role: 'student',
  theme: 'light',
  account: INITIAL_ACCOUNT,
  student: {
    cat: '11 класс',
    sec: 'az',
    test: null,
    xp: 120,
    ach: { streak: true },
  },
  tutors: INITIAL_TUTORS,
  requests: INITIAL_REQUESTS,
  content: INITIAL_CONTENT,
  favorites: [],
  ownedCourses: [],
  seenVideos: [],
  completedTests: {},
  hwSubmissions: [],
  location: {
    name: 'Баку',
    lat: CITIES['Баку'][0],
    lon: CITIES['Баку'][1],
  },
  radiusKm: 51,
};

let cachedRaw: string | null | undefined;
let cachedSnapshot: PersistedAppState = DEFAULT_PERSISTED_STATE;
const listeners = new Set<() => void>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

function sanitizePersistedState(parsed: unknown): PersistedAppState {
  if (!parsed || typeof parsed !== 'object') return DEFAULT_PERSISTED_STATE;
  const p = parsed as Partial<PersistedAppState>;
  if (p.version !== 1) return DEFAULT_PERSISTED_STATE;

  const rawContent =
    p.content && typeof p.content === 'object' ? p.content : DEFAULT_PERSISTED_STATE.content;
  const sanitizedContent: Record<string, TutorContent> = { ...DEFAULT_PERSISTED_STATE.content };
  for (const [tid, tc] of Object.entries(rawContent)) {
    if (!tc || typeof tc !== 'object') continue;
    sanitizedContent[tid] = {
      videos: Array.isArray(tc.videos)
        ? tc.videos.map((v) =>
            v.url && v.url.startsWith('blob:') ? { ...v, url: undefined } : v,
          )
        : [],
      courses: Array.isArray(tc.courses) ? tc.courses : [],
      tests: Array.isArray(tc.tests) ? tc.tests : [],
      hw: Array.isArray(tc.hw) ? tc.hw : [],
    };
  }

  const baseStudent = DEFAULT_PERSISTED_STATE.student;
  const parsedStudent =
    p.student && typeof p.student === 'object' ? p.student : baseStudent;

  return {
    version: 1,
    locale: p.locale === 'az' || p.locale === 'en' || p.locale === 'ru' ? p.locale : 'ru',
    role: p.role === 'teacher' || p.role === 'student' ? p.role : 'student',
    theme: p.theme === 'dark' || p.theme === 'light' || p.theme === 'system' ? p.theme : 'light',
    account: {
      ...DEFAULT_PERSISTED_STATE.account,
      ...(p.account && typeof p.account === 'object' ? p.account : {}),
    },
    student: {
      ...baseStudent,
      ...parsedStudent,
      ach: {
        ...baseStudent.ach,
        ...(parsedStudent.ach && typeof parsedStudent.ach === 'object'
          ? parsedStudent.ach
          : {}),
      },
    },
    tutors: (() => {
      if (!Array.isArray(p.tutors) || p.tutors.length === 0) {
        return DEFAULT_PERSISTED_STATE.tutors;
      }
      const defaultsById = new Map(
        DEFAULT_PERSISTED_STATE.tutors.map((t) => [t.id, t] as const),
      );
      const existingIds = new Set<string>();
      const synced = p.tutors
        .filter((t): t is TutorProfile => Boolean(t && typeof t.id === 'string'))
        .map((t) => {
          existingIds.add(t.id);
          const def = defaultsById.get(t.id);
          if (!def) return t;
          // Refresh built-in tutors' cleaned names, coordinates, and formats cleanly without losing user profile edits
          if (t.id === 'me') {
            return {
              ...t,
              name: t.name === 'Тимур Рахимов (демо)' ? def.name : t.name,
              fmt: def.fmt,
              coords: def.coords,
            };
          }
          if (t.id === 't6' && t.name === 'Дамир Абдуллаев (студент)') {
            return { ...t, name: def.name, coords: def.coords };
          }
          if (t.id === 't2' || t.id === 't4') {
            return { ...t, fmt: def.fmt, coords: def.coords };
          }
          return t;
        });
      const missingDefaults = DEFAULT_PERSISTED_STATE.tutors.filter(
        (t) => !existingIds.has(t.id),
      );
      return missingDefaults.length > 0 ? [...synced, ...missingDefaults] : synced;
    })(),
    requests: Array.isArray(p.requests) ? p.requests : DEFAULT_PERSISTED_STATE.requests,
    content: sanitizedContent,
    favorites: Array.isArray(p.favorites) ? p.favorites : [],
    ownedCourses: Array.isArray(p.ownedCourses) ? p.ownedCourses : [],
    seenVideos: Array.isArray(p.seenVideos) ? p.seenVideos : [],
    completedTests:
      p.completedTests && typeof p.completedTests === 'object' ? p.completedTests : {},
    hwSubmissions: Array.isArray(p.hwSubmissions) ? p.hwSubmissions : [],
    location:
      p.location && typeof p.location === 'object' && typeof p.location.lat === 'number'
        ? p.location
        : DEFAULT_PERSISTED_STATE.location,
    radiusKm: typeof p.radiusKm === 'number' ? p.radiusKm : DEFAULT_PERSISTED_STATE.radiusKm,
  };
}

export function loadPersistedState(): PersistedAppState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitizePersistedState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedAppState): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedSnapshot = state;
  } catch {
    // Ignore storage quota or private mode failures gracefully.
  }
}

export function getServerPersistedSnapshot(): PersistedAppState {
  return DEFAULT_PERSISTED_STATE;
}

export function getPersistedSnapshot(): PersistedAppState {
  if (typeof window === 'undefined') return DEFAULT_PERSISTED_STATE;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedSnapshot;
  }

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;
  if (!raw) {
    cachedSnapshot = DEFAULT_PERSISTED_STATE;
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = sanitizePersistedState(JSON.parse(raw));
  } catch {
    cachedSnapshot = DEFAULT_PERSISTED_STATE;
  }
  return cachedSnapshot;
}

export function subscribePersistedState(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window === 'undefined') {
    return () => {
      listeners.delete(listener);
    };
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function updatePersistedState(
  updater: (prev: PersistedAppState) => PersistedAppState,
): void {
  const prev = getPersistedSnapshot();
  const next = updater(prev);
  savePersistedState(next);
  cachedSnapshot = next;
  emitChange();
}

export function clearPersistedState(): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors.
    }
  }
  cachedRaw = null;
  cachedSnapshot = DEFAULT_PERSISTED_STATE;
  emitChange();
}
