import type { Role, StudentTab, TeacherTab } from '@/types/edumatch';

const STUDENT_TABS: readonly StudentTab[] = ['search', 'test', 'lessons'];
const TEACHER_TABS: readonly TeacherTab[] = ['inbox', 'students', 'profile', 'studio', 'premium'];

function isStudentTab(value: string | null): value is StudentTab {
  return Boolean(value && (STUDENT_TABS as readonly string[]).includes(value));
}

function isTeacherTab(value: string | null): value is TeacherTab {
  return Boolean(value && (TEACHER_TABS as readonly string[]).includes(value));
}

export function defaultTabForRole(role: Role): StudentTab | TeacherTab {
  return role === 'teacher' ? 'inbox' : 'search';
}

let poppedToRoot = false;

export function resetUrlSyncState(): void {
  poppedToRoot = false;
}

export function readNavigationFromUrl(
  fallbackRole: Role,
  explicitSearch?: string,
): {
  role: Role;
  tab: StudentTab | TeacherTab;
  hasUrlOverride: boolean;
} {
  if (typeof window === 'undefined' && explicitSearch === undefined) {
    return { role: fallbackRole, tab: defaultTabForRole(fallbackRole), hasUrlOverride: false };
  }

  const rawSearch =
    explicitSearch !== undefined
      ? explicitSearch
      : typeof window !== 'undefined'
        ? window.location.search
        : '';
  const params = new URLSearchParams(rawSearch);
  const roleParam = params.get('role');
  const tabParam = params.get('tab');

  if (roleParam === 'student' || roleParam === 'teacher') {
    const validTab =
      roleParam === 'student'
        ? isStudentTab(tabParam)
          ? tabParam
          : 'search'
        : isTeacherTab(tabParam)
          ? tabParam
          : 'inbox';
    return { role: roleParam, tab: validTab, hasUrlOverride: true };
  }

  if (isTeacherTab(tabParam)) {
    return { role: 'teacher', tab: tabParam, hasUrlOverride: true };
  }
  if (isStudentTab(tabParam)) {
    return { role: 'student', tab: tabParam, hasUrlOverride: true };
  }

  if (!rawSearch && poppedToRoot) {
    return { role: 'student', tab: 'search', hasUrlOverride: true };
  }

  return { role: fallbackRole, tab: defaultTabForRole(fallbackRole), hasUrlOverride: false };
}

const URL_NAV_EVENT = 'edumatch:urlnav';

export function subscribeUrlSearch(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handlePopState = () => {
    poppedToRoot = window.location.search === '';
    onStoreChange();
  };
  window.addEventListener('popstate', handlePopState);
  window.addEventListener(URL_NAV_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener(URL_NAV_EVENT, onStoreChange);
  };
}

export function getUrlSearchSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return window.location.search;
}

export function writeNavigationToUrl(
  role: Role,
  tab: StudentTab | TeacherTab,
  replace = false,
): void {
  if (typeof window === 'undefined') return;
  poppedToRoot = false;
  const url = new URL(window.location.href);
  const currentRole = url.searchParams.get('role');
  const currentTab = url.searchParams.get('tab');
  if (currentRole === role && currentTab === tab) return;

  url.searchParams.set('role', role);
  url.searchParams.set('tab', tab);
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;

  if (replace) {
    window.history.replaceState({ role, tab }, '', nextUrl);
  } else {
    window.history.pushState({ role, tab }, '', nextUrl);
  }
  window.dispatchEvent(new Event(URL_NAV_EVENT));
}
