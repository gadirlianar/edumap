import { CITIES } from '@/data/catalog';
import {
  INITIAL_ACCOUNT,
  INITIAL_CONTENT,
  INITIAL_REQUESTS,
  INITIAL_TUTORS,
} from '@/data/tutors';
import type {
  AccountProfile,
  AppNotification,
  HomeworkSubmission,
  Locale,
  LocationState,
  Role,
  StudentRequest,
  StudentState,
  ThemeMode,
  TutorContent,
  TutorProfile,
  VideoNoteItem,
} from '@/types/edumatch';

export const STORAGE_KEY = 'edumatch_state_v1';

export interface PersistedAppState {
  version: 1;
  locale: Locale;
  role: Role;
  theme: ThemeMode;
  account: AccountProfile;
  activeTeacherId: string;
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
  notifications: AppNotification[];
  videoNotes: Record<string, VideoNoteItem[]>;
  partnerEnrolled: boolean;
  alertsEnabled: boolean;
}

export const DEFAULT_PERSISTED_STATE: PersistedAppState = {
  version: 1,
  locale: 'ru',
  role: 'student',
  theme: 'light',
  account: INITIAL_ACCOUNT,
  activeTeacherId: 'me',
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
  notifications: [],
  videoNotes: {},
  partnerEnrolled: false,
  alertsEnabled: true,
};

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isPlainRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function isSafeMediaUrl(val: unknown): val is string {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (!trimmed || trimmed.startsWith('blob:')) return false;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function sanitizeVideoNotesRecord(raw: unknown): Record<string, VideoNoteItem[]> {
  if (!isPlainRecord(raw)) return {};
  const result = Object.create(null) as Record<string, VideoNoteItem[]>;
  for (const [videoId, list] of Object.entries(raw)) {
    if (DANGEROUS_KEYS.has(videoId) || !Array.isArray(list)) continue;
    const validNotes = list.filter(
      (item): item is VideoNoteItem =>
        isPlainRecord(item) &&
        typeof item.id === 'string' &&
        typeof item.text === 'string' &&
        typeof item.timeSec === 'number' &&
        Number.isFinite(item.timeSec) &&
        typeof item.createdAt === 'number' &&
        Number.isFinite(item.createdAt),
    );
    if (validNotes.length > 0) {
      result[videoId] = validNotes.slice(0, 60);
    }
  }
  return Object.assign({}, result);
}

function sanitizeCompletedTestsRecord(raw: unknown): Record<string, boolean> {
  if (!isPlainRecord(raw)) return {};
  const result: Record<string, boolean> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (DANGEROUS_KEYS.has(key) || typeof val !== 'boolean') continue;
    result[key] = val;
  }
  return result;
}

function sanitizeStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === 'string');
}

function isValidTutor(t: unknown): t is TutorProfile {
  if (!isPlainRecord(t)) return false;
  if (typeof t.id !== 'string' || typeof t.name !== 'string') return false;
  if (!Array.isArray(t.fmt) || !Array.isArray(t.subj) || !Array.isArray(t.cats)) return false;
  if (!isPlainRecord(t.education) || !isPlainRecord(t.strengths)) return false;
  if (!Array.isArray(t.certs) || !Array.isArray(t.rev)) return false;
  if (
    !Array.isArray(t.coords) ||
    t.coords.length < 2 ||
    typeof t.coords[0] !== 'number' ||
    !Number.isFinite(t.coords[0]) ||
    typeof t.coords[1] !== 'number' ||
    !Number.isFinite(t.coords[1])
  ) {
    return false;
  }
  return typeof t.price === 'number' && Number.isFinite(t.price);
}

function isValidRequest(r: unknown): r is StudentRequest {
  if (!isPlainRecord(r)) return false;
  if (typeof r.id !== 'number' || !Number.isFinite(r.id)) return false;
  if (typeof r.tid !== 'string' || typeof r.trial !== 'boolean') return false;
  if (
    r.status !== 'new' &&
    r.status !== 'accepted' &&
    r.status !== 'declined' &&
    r.status !== 'done'
  ) {
    return false;
  }
  if (!isPlainRecord(r.st) || typeof r.st.name !== 'string') return false;
  if (!Array.isArray(r.msgs)) return false;
  const validMsgs = r.msgs.every(
    (m) =>
      isPlainRecord(m) &&
      typeof m.id === 'string' &&
      (m.from === 's' || m.from === 't'),
  );
  if (!validMsgs) return false;
  if (r.whiteboardStrokes !== undefined) {
    if (!Array.isArray(r.whiteboardStrokes)) return false;
    const validStrokes = r.whiteboardStrokes.every(
      (s) =>
        isPlainRecord(s) &&
        typeof s.color === 'string' &&
        Array.isArray(s.points) &&
        s.points.every(
          (pt) =>
            isPlainRecord(pt) &&
            typeof pt.x === 'number' &&
            Number.isFinite(pt.x) &&
            typeof pt.y === 'number' &&
            Number.isFinite(pt.y),
        ),
    );
    if (!validStrokes) return false;
  }
  return true;
}

let cachedRaw: string | null | undefined;
let cachedSnapshot: PersistedAppState = DEFAULT_PERSISTED_STATE;
const listeners = new Set<() => void>();

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

export function sanitizePersistedState(parsed: unknown): PersistedAppState {
  if (!isPlainRecord(parsed)) return DEFAULT_PERSISTED_STATE;
  const p = parsed as Partial<PersistedAppState>;
  if (p.version !== 1) return DEFAULT_PERSISTED_STATE;

  const rawContent = isPlainRecord(p.content) ? p.content : DEFAULT_PERSISTED_STATE.content;
  const sanitizedContent: Record<string, TutorContent> = { ...DEFAULT_PERSISTED_STATE.content };
  for (const [tid, tc] of Object.entries(rawContent)) {
    if (DANGEROUS_KEYS.has(tid) || !isPlainRecord(tc)) continue;
    sanitizedContent[tid] = {
      videos: Array.isArray(tc.videos)
        ? tc.videos
            .filter(
              (v): v is TutorContent['videos'][number] =>
                isPlainRecord(v) && typeof v.id === 'string' && typeof v.dur === 'string',
            )
            .map((v) => ({
              ...v,
              url: isSafeMediaUrl(v.url) ? v.url : undefined,
            }))
        : [],
      courses: Array.isArray(tc.courses)
        ? tc.courses.filter((c) => isPlainRecord(c) && typeof c.id === 'string')
        : [],
      tests: Array.isArray(tc.tests)
        ? tc.tests.filter(
            (te) => isPlainRecord(te) && typeof te.id === 'string' && Array.isArray(te.qs),
          )
        : [],
      hw: Array.isArray(tc.hw)
        ? tc.hw.filter(
            (h) =>
              isPlainRecord(h) &&
              typeof h.id === 'string' &&
              typeof h.pts === 'number' &&
              Number.isFinite(h.pts),
          )
        : [],
    };
  }

  const baseStudent = DEFAULT_PERSISTED_STATE.student;
  const rawStudent = isPlainRecord(p.student) ? p.student : null;
  const rawAccount = isPlainRecord(p.account) ? p.account : null;

  const sanitizedTutors = (() => {
    if (!Array.isArray(p.tutors) || p.tutors.length === 0) {
      return DEFAULT_PERSISTED_STATE.tutors;
    }
    const defaultsById = new Map(
      DEFAULT_PERSISTED_STATE.tutors.map((t) => [t.id, t] as const),
    );
    const existingIds = new Set<string>();
    const synced = p.tutors.filter(isValidTutor).map((t) => {
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
    if (synced.length === 0) return DEFAULT_PERSISTED_STATE.tutors;
    const missingDefaults = DEFAULT_PERSISTED_STATE.tutors.filter(
      (t) => !existingIds.has(t.id),
    );
    return missingDefaults.length > 0 ? [...synced, ...missingDefaults] : synced;
  })();

  const activeTeacherId =
    typeof p.activeTeacherId === 'string' &&
    !DANGEROUS_KEYS.has(p.activeTeacherId) &&
    sanitizedTutors.some((t) => t.id === p.activeTeacherId)
      ? p.activeTeacherId
      : 'me';

  const sanitizedRequests = Array.isArray(p.requests)
    ? p.requests.filter(isValidRequest)
    : DEFAULT_PERSISTED_STATE.requests;

  return {
    version: 1,
    locale: p.locale === 'az' || p.locale === 'en' || p.locale === 'ru' ? p.locale : 'ru',
    role: p.role === 'teacher' || p.role === 'student' ? p.role : 'student',
    theme: p.theme === 'dark' || p.theme === 'light' || p.theme === 'system' ? p.theme : 'light',
    account: {
      name:
        rawAccount && typeof rawAccount.name === 'string'
          ? rawAccount.name
          : DEFAULT_PERSISTED_STATE.account.name,
      email:
        rawAccount && typeof rawAccount.email === 'string'
          ? rawAccount.email
          : DEFAULT_PERSISTED_STATE.account.email,
      premium:
        rawAccount && typeof rawAccount.premium === 'boolean'
          ? rawAccount.premium
          : DEFAULT_PERSISTED_STATE.account.premium,
      plan:
        rawAccount && typeof rawAccount.plan === 'string'
          ? rawAccount.plan
          : DEFAULT_PERSISTED_STATE.account.plan,
      promo:
        rawAccount && typeof rawAccount.promo === 'number' && Number.isFinite(rawAccount.promo)
          ? rawAccount.promo
          : DEFAULT_PERSISTED_STATE.account.promo,
      authenticated:
        rawAccount && typeof rawAccount.authenticated === 'boolean'
          ? rawAccount.authenticated
          : DEFAULT_PERSISTED_STATE.account.authenticated,
    },
    activeTeacherId,
    student: {
      displayName:
        rawStudent && typeof rawStudent.displayName === 'string' && rawStudent.displayName.trim()
          ? rawStudent.displayName.trim().slice(0, 80)
          : baseStudent.displayName,
      targetGroup:
        rawStudent && typeof rawStudent.targetGroup === 'string' && rawStudent.targetGroup.trim()
          ? rawStudent.targetGroup.trim().slice(0, 60)
          : baseStudent.targetGroup,
      cat:
        rawStudent && typeof rawStudent.cat === 'string'
          ? (rawStudent.cat as StudentState['cat'])
          : baseStudent.cat,
      sec:
        rawStudent &&
        (rawStudent.sec === 'az' || rawStudent.sec === 'ru' || rawStudent.sec === 'en')
          ? rawStudent.sec
          : baseStudent.sec,
      test:
        rawStudent &&
        isPlainRecord(rawStudent.test) &&
        typeof rawStudent.test.subj === 'string' &&
        typeof rawStudent.test.level === 'string' &&
        typeof rawStudent.test.score === 'number' &&
        Number.isFinite(rawStudent.test.score)
          ? (rawStudent.test as StudentState['test'])
          : baseStudent.test,
      xp:
        rawStudent && typeof rawStudent.xp === 'number' && Number.isFinite(rawStudent.xp)
          ? Math.max(0, rawStudent.xp)
          : baseStudent.xp,
      ach:
        rawStudent && isPlainRecord(rawStudent.ach)
          ? {
              test: typeof rawStudent.ach.test === 'boolean' ? rawStudent.ach.test : undefined,
              trial: typeof rawStudent.ach.trial === 'boolean' ? rawStudent.ach.trial : undefined,
              review: typeof rawStudent.ach.review === 'boolean' ? rawStudent.ach.review : undefined,
              streak:
                typeof rawStudent.ach.streak === 'boolean'
                  ? rawStudent.ach.streak
                  : baseStudent.ach.streak,
            }
          : { ...baseStudent.ach },
    },
    tutors: sanitizedTutors,
    requests: sanitizedRequests,
    content: sanitizedContent,
    favorites: sanitizeStringArray(p.favorites),
    ownedCourses: sanitizeStringArray(p.ownedCourses),
    seenVideos: sanitizeStringArray(p.seenVideos),
    completedTests: sanitizeCompletedTestsRecord(p.completedTests),
    hwSubmissions: Array.isArray(p.hwSubmissions)
      ? p.hwSubmissions.filter(
          (s): s is HomeworkSubmission =>
            isPlainRecord(s) &&
            typeof s.id === 'string' &&
            typeof s.tid === 'string' &&
            typeof s.hid === 'string' &&
            typeof s.title === 'string' &&
            typeof s.who === 'string' &&
            (s.st === 'pending' || s.st === 'ok') &&
            typeof s.pts === 'number' &&
            Number.isFinite(s.pts),
        )
      : [],
    location:
      isPlainRecord(p.location) &&
      typeof p.location.name === 'string' &&
      typeof p.location.lat === 'number' &&
      Number.isFinite(p.location.lat) &&
      typeof p.location.lon === 'number' &&
      Number.isFinite(p.location.lon)
        ? {
            name: p.location.name,
            lat: p.location.lat,
            lon: p.location.lon,
            ...(typeof p.location.isCustom === 'boolean'
              ? { isCustom: p.location.isCustom }
              : {}),
          }
        : DEFAULT_PERSISTED_STATE.location,
    radiusKm:
      typeof p.radiusKm === 'number' && Number.isFinite(p.radiusKm) && p.radiusKm > 0
        ? p.radiusKm
        : DEFAULT_PERSISTED_STATE.radiusKm,
    notifications: Array.isArray(p.notifications)
      ? p.notifications
          .filter(
            (n): n is AppNotification =>
              isPlainRecord(n) &&
              typeof n.id === 'string' &&
              typeof n.title === 'string' &&
              typeof n.body === 'string' &&
              typeof n.read === 'boolean' &&
              typeof n.createdAt === 'number' &&
              Number.isFinite(n.createdAt),
          )
          .slice(0, 40)
      : [],
    videoNotes: sanitizeVideoNotesRecord(p.videoNotes),
    partnerEnrolled: Boolean(p.partnerEnrolled),
    alertsEnabled: typeof p.alertsEnabled === 'boolean' ? p.alertsEnabled : true,
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
