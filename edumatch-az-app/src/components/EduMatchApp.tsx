'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { motion, MotionConfig } from 'motion/react';
import { CursorCatTrail } from '@/components/ui/CursorCatTrail';
import { Footer } from '@/components/Footer';
import {
  CITIES,
  DEFAULT_DEMO_TEST,
  RANK_TIERS,
  SECTOR_TO_LANG,
} from '@/data/catalog';
import { COPY } from '@/data/i18n';
import {
  INITIAL_STUDENTS,
  resolveLocalized,
  resolveTutorName,
} from '@/data/tutors';
import {
  filterAndSortTutors,
  getRankIndex,
} from '@/lib/matching';
import {
  clearPersistedState,
  getPersistedSnapshot,
  getServerPersistedSnapshot,
  subscribePersistedState,
  updatePersistedState,
} from '@/lib/storage';
import { ChatModal } from '@/components/ChatModal';
import { Header } from '@/components/Header';
import { LessonsWorkspace } from '@/components/LessonsWorkspace';
import { MobileNav } from '@/components/MobileNav';
import {
  AuthModal,
  OnboardingTourModal,
  PrivacyModal,
} from '@/components/OnboardingAndAuthModals';
import { QuizWorkspace } from '@/components/QuizWorkspace';
import { SearchWorkspace } from '@/components/SearchWorkspace';
import {
  ConfettiOverlay,
  HomeworkSubmitModal,
  PremiumModal,
  RankUpModal,
  ThresholdTestModal,
  ToastBanner,
  PartnerCourseModal,
  VideoPlayerModal,
} from '@/components/SecondaryModals';
import { AccountHubModal } from '@/components/AccountHubModal';
import { BookingModal, defaultScheduleForTutor } from '@/components/BookingModal';
import { ClassroomModal } from '@/components/ClassroomModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { PwaStatusOverlay, usePwaInstall } from '@/components/PwaManager';
import { PWA_COPY } from '@/lib/pwaCopy';
import {
  getUrlSearchSnapshot,
  readNavigationFromUrl,
  resetUrlSyncState,
  subscribeUrlSearch,
  writeNavigationToUrl,
} from '@/lib/urlSync';
import { TeacherInboxWorkspace } from '@/components/TeacherInboxWorkspace';
import { TeacherPremiumWorkspace } from '@/components/TeacherPremiumWorkspace';
import { TeacherProfileModal } from '@/components/TeacherProfileModal';
import { TeacherProfileWorkspace } from '@/components/TeacherProfileWorkspace';
import { TeacherStudentsWorkspace } from '@/components/TeacherStudentsWorkspace';
import { TeacherStudioWorkspace } from '@/components/TeacherStudioWorkspace';
import type {
  AccountProfile,
  AppNotification,
  CityId,
  HomeworkSubmission,
  LessonSchedule,
  LevelId,
  Locale,
  LocationState,
  ProfileSheetTab,
  Role,
  SearchFilters,
  StudentRequest,
  StudentState,
  StudentTab,
  SubjectId,
  TeacherTab,
  ThemeMode,
  TutorContent,
  TutorProfile,
  TutorTest,
  VideoNoteItem,
  WhiteboardStroke,
} from '@/types/edumatch';

type SetStateAction<T> = T | ((prev: T) => T);

function applyUpdater<T>(current: T, action: SetStateAction<T>): T {
  return typeof action === 'function'
    ? (action as (prev: T) => T)(current)
    : action;
}

function subscribeSystemDark(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getSystemDarkSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const STUDENT_TAB_ORDER: StudentTab[] = ['search', 'test', 'lessons'];
const TEACHER_TAB_ORDER: TeacherTab[] = ['inbox', 'students', 'profile', 'studio', 'premium'];

export function EduMatchApp() {
  const persisted = useSyncExternalStore(
    subscribePersistedState,
    getPersistedSnapshot,
    getServerPersistedSnapshot,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    getSystemDarkSnapshot,
    () => false,
  );

  const urlSearch = useSyncExternalStore(
    subscribeUrlSearch,
    getUrlSearchSnapshot,
    () => '',
  );
  const urlNav = useMemo(
    () => readNavigationFromUrl(persisted.role, urlSearch),
    [persisted.role, urlSearch],
  );

  const locale = persisted.locale;
  const role = urlNav.hasUrlOverride ? urlNav.role : persisted.role;
  const themeMode = persisted.theme;
  const account = persisted.account;
  const activeTeacherId = persisted.activeTeacherId;
  const student = persisted.student;
  const tutors = persisted.tutors;
  const requests = persisted.requests;
  const content = persisted.content;
  const completedTests = persisted.completedTests;
  const hwSubmissions = persisted.hwSubmissions;
  const location = persisted.location;
  const radiusKm = persisted.radiusKm;

  const favorites = useMemo(() => new Set(persisted.favorites), [persisted.favorites]);
  const ownedCourses = useMemo(
    () => new Set(persisted.ownedCourses),
    [persisted.ownedCourses],
  );
  const seenVideos = useMemo(
    () => new Set(persisted.seenVideos),
    [persisted.seenVideos],
  );

  const setLocale = useCallback((next: SetStateAction<Locale>) => {
    updatePersistedState((prev) => ({
      ...prev,
      locale: applyUpdater(prev.locale, next),
    }));
  }, []);

  const setThemeMode = useCallback((next: SetStateAction<ThemeMode>) => {
    updatePersistedState((prev) => ({
      ...prev,
      theme: applyUpdater(prev.theme, next),
    }));
  }, []);

  const setAccount = useCallback((next: SetStateAction<AccountProfile>) => {
    updatePersistedState((prev) => ({
      ...prev,
      account: applyUpdater(prev.account, next),
    }));
  }, []);

  const setStudent = useCallback((next: SetStateAction<StudentState>) => {
    updatePersistedState((prev) => ({
      ...prev,
      student: applyUpdater(prev.student, next),
    }));
  }, []);

  const setTutors = useCallback((next: SetStateAction<TutorProfile[]>) => {
    updatePersistedState((prev) => ({
      ...prev,
      tutors: applyUpdater(prev.tutors, next),
    }));
  }, []);

  const setRequests = useCallback((next: SetStateAction<StudentRequest[]>) => {
    updatePersistedState((prev) => ({
      ...prev,
      requests: applyUpdater(prev.requests, next),
    }));
  }, []);

  const setContent = useCallback(
    (next: SetStateAction<Record<string, TutorContent>>) => {
      updatePersistedState((prev) => ({
        ...prev,
        content: applyUpdater(prev.content, next),
      }));
    },
    [],
  );

  const setFavorites = useCallback((next: SetStateAction<Set<string>>) => {
    updatePersistedState((prev) => ({
      ...prev,
      favorites: Array.from(applyUpdater(new Set(prev.favorites), next)),
    }));
  }, []);

  const setOwnedCourses = useCallback((next: SetStateAction<Set<string>>) => {
    updatePersistedState((prev) => ({
      ...prev,
      ownedCourses: Array.from(applyUpdater(new Set(prev.ownedCourses), next)),
    }));
  }, []);

  const setSeenVideos = useCallback((next: SetStateAction<Set<string>>) => {
    updatePersistedState((prev) => ({
      ...prev,
      seenVideos: Array.from(applyUpdater(new Set(prev.seenVideos), next)),
    }));
  }, []);

  const setCompletedTests = useCallback(
    (next: SetStateAction<Record<string, boolean>>) => {
      updatePersistedState((prev) => ({
        ...prev,
        completedTests: applyUpdater(prev.completedTests, next),
      }));
    },
    [],
  );

  const setHwSubmissions = useCallback(
    (next: SetStateAction<HomeworkSubmission[]>) => {
      updatePersistedState((prev) => ({
        ...prev,
        hwSubmissions: applyUpdater(prev.hwSubmissions, next),
      }));
    },
    [],
  );

  const setLocation = useCallback((next: SetStateAction<LocationState>) => {
    updatePersistedState((prev) => ({
      ...prev,
      location: applyUpdater(prev.location, next),
    }));
  }, []);

  const notifications = persisted.notifications;
  const videoNotes = persisted.videoNotes;
  const partnerEnrolled = persisted.partnerEnrolled;
  const alertsEnabled = persisted.alertsEnabled;

  const setNotifications = useCallback(
    (next: SetStateAction<AppNotification[]>) => {
      updatePersistedState((prev) => ({
        ...prev,
        notifications: applyUpdater(prev.notifications, next),
      }));
    },
    [],
  );

  const setVideoNotes = useCallback(
    (next: SetStateAction<Record<string, VideoNoteItem[]>>) => {
      updatePersistedState((prev) => ({
        ...prev,
        videoNotes: applyUpdater(prev.videoNotes, next),
      }));
    },
    [],
  );

  const setPartnerEnrolled = useCallback((next: SetStateAction<boolean>) => {
    updatePersistedState((prev) => ({
      ...prev,
      partnerEnrolled: applyUpdater(prev.partnerEnrolled, next),
    }));
  }, []);

  const setAlertsEnabled = useCallback((next: SetStateAction<boolean>) => {
    updatePersistedState((prev) => ({
      ...prev,
      alertsEnabled: applyUpdater(prev.alertsEnabled, next),
    }));
  }, []);

  const setRadiusKm = useCallback((next: SetStateAction<number>) => {
    updatePersistedState((prev) => ({
      ...prev,
      radiusKm: applyUpdater(prev.radiusKm, next),
    }));
  }, []);

  const [stateStudentTab, setStudentTab] = useState<StudentTab>('search');
  const [stateTeacherTab, setTeacherTab] = useState<TeacherTab>('inbox');
  const studentTab: StudentTab =
    urlNav.hasUrlOverride && urlNav.role === 'student'
      ? (urlNav.tab as StudentTab)
      : stateStudentTab;
  const teacherTab: TeacherTab =
    urlNav.hasUrlOverride && urlNav.role === 'teacher'
      ? (urlNav.tab as TeacherTab)
      : stateTeacherTab;
  const [tutorsOpen, setTutorsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountHubOpen, setAccountHubOpen] = useState(false);
  const [partnerCourseOpen, setPartnerCourseOpen] = useState(false);
  const [classroomReqId, setClassroomReqId] = useState<number | null>(null);
  const [bookingModalTarget, setBookingModalTarget] = useState<{
    tutorId: string;
    requestId?: number;
  } | null>(null);

  const pwa = usePwaInstall();

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const [filters, setFilters] = useState<SearchFilters>({
    cat: '',
    subj: '',
    lang: '',
    fmt: '',
    price: 60,
    sort: 'match',
    sty: '',
    fav: false,
    mode: 'feed',
  });
  const [swipeIndex, setSwipeIndex] = useState(0);

  // Modals & transient overlays
  const [profileSheet, setProfileSheet] = useState<{
    tutorId: string;
    tab: ProfileSheetTab;
  } | null>(null);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [privacyWho, setPrivacyWho] = useState<Role | null>(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<{
    tutorId: string;
    videoId: string;
  } | null>(null);
  const [hwPrompt, setHwPrompt] = useState<{
    tutorId: string;
    hwId: string;
  } | null>(null);
  const [runningTest, setRunningTest] = useState<{
    tutorId?: string;
    test: TutorTest;
    isDemo: boolean;
  } | null>(null);
  const [rankUpIndex, setRankUpIndex] = useState<number | null>(null);

  const [toast, setToast] = useState<{ message: string; iconKey: string } | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);
  const [sessionVideoUrls, setSessionVideoUrls] = useState<Record<string, string>>({});

  const uidRef = useRef(200);
  const toastTimerRef = useRef<number | null>(null);
  const asyncTimersRef = useRef<number[]>([]);
  const sessionVideoUrlsRef = useRef<Record<string, string>>({});

  const copy = COPY[locale];
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark);

  const notify = useCallback((message: string, iconKey = 'smile') => {
    setToast({ message, iconKey });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const triggerBurst = useCallback(() => {
    setBurstKey((k) => k + 1);
  }, []);

  const awardXp = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      setStudent((prev) => {
        const beforeRank = getRankIndex(prev.xp);
        const nextXp = prev.xp + amount;
        const afterRank = getRankIndex(nextXp);
        if (afterRank > beforeRank) {
          const timer = window.setTimeout(() => {
            setRankUpIndex(afterRank);
            setBurstKey((k) => k + 1);
          }, 350);
          asyncTimersRef.current.push(timer);
        }
        return { ...prev, xp: nextXp };
      });
    },
    [setStudent],
  );

  // Cleanup pending timers and session blob URLs on unmount
  useEffect(() => {
    const timers = asyncTimersRef.current;
    const videoUrls = sessionVideoUrlsRef.current;
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      timers.forEach((id) => window.clearTimeout(id));
      Object.values(videoUrls).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // Ignore revoke failure in non-DOM test envs
        }
      });
    };
  }, []);

  // Sync <html lang> and data-theme with external DOM
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [locale, isDark]);

  const pushNotification = useCallback(
    (entry: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
      updatePersistedState((prev) => {
        if (!prev.alertsEnabled) return prev;
        const nextNotif: AppNotification = {
          ...entry,
          id: `n-${Date.now()}-${uidRef.current++}`,
          createdAt: Date.now(),
          read: false,
        };
        return {
          ...prev,
          notifications: [nextNotif, ...prev.notifications].slice(0, 30),
        };
      });
    },
    [],
  );

  const filteredTutors = useMemo(
    () =>
      filterAndSortTutors(
        tutors,
        filters,
        student,
        account.promo,
        favorites,
        location,
        radiusKm,
      ),
    [tutors, filters, student, account.promo, favorites, location, radiusKm],
  );

  const featuredTutors = useMemo(
    () => tutors.filter((t) => ['t1', 't4', 't2'].includes(t.id)),
    [tutors],
  );

  const meTutor = useMemo(
    () =>
      tutors.find((t) => t.id === activeTeacherId) ??
      tutors.find((t) => t.id === 'me') ??
      tutors[0],
    [tutors, activeTeacherId],
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [setFavorites],
  );

  const handleOpenProfile = useCallback(
    (tutorId: string, tab: ProfileSheetTab = 'overview') => {
      setProfileSheet({ tutorId, tab });
    },
    [],
  );

  const handleSendRequest = useCallback(
    (tutorId: string, trial: boolean) => {
      const existing = requests.find(
        (r) =>
          r.mine &&
          r.tid === tutorId &&
          r.trial === trial &&
          r.status !== 'declined' &&
          r.status !== 'done',
      );
      if (existing) {
        notify(copy.chat.requestAlreadySent, 'thumb');
        setProfileSheet(null);
        setActiveChatId(existing.id);
        return;
      }

      const maxPersistedReqId = requests.reduce(
        (max, r) => (r.id > max ? r.id : max),
        199,
      );
      if (uidRef.current <= maxPersistedReqId) {
        uidRef.current = maxPersistedReqId + 1;
      }
      const newId = uidRef.current++;
      const initialText = trial
        ? locale === 'az'
          ? 'Salam! Pulsuz sınaq dərsinə yazılmaq istəyirəm.'
          : locale === 'en'
            ? 'Hello! I would like to book a free trial lesson.'
            : 'Здравствуйте! Хочу записаться на бесплатный пробный урок.'
        : locale === 'az'
          ? 'Salam! Dərslər və cədvəl haqqında məlumat almaq istəyirəm.'
          : locale === 'en'
            ? 'Hello! I would like to ask about your lesson schedule.'
            : 'Здравствуйте! Хочу заниматься, подскажите по расписанию.';

      const targetTutor = tutors.find((t) => t.id === tutorId);
      const resolvedSubject: SubjectId =
        filters.subj || targetTutor?.subj[0] || 'Математика';
      const schedule = defaultScheduleForTutor(targetTutor ?? null, locale, trial);
      const tutorLabel = targetTutor ? resolveTutorName(targetTutor, locale) : 'EduMatch';

      const created: StudentRequest = {
        id: newId,
        tid: tutorId,
        mine: true,
        trial,
        status: 'new',
        schedule,
        st: {
          name: account.authenticated && account.name ? account.name : copy.teacher.youDemoStudent,
          cat: filters.cat || student.cat,
          subj: resolvedSubject,
          sec: student.sec,
          level: student.test?.level ?? null,
        },
        msgs: [{ id: `m-${newId}-1`, from: 's', text: initialText }],
      };

      setRequests((prev) => [created, ...prev]);

      if (trial && !student.ach.trial) {
        setStudent((prev) => ({
          ...prev,
          ach: { ...prev.ach, trial: true },
        }));
        awardXp(20);
      }

      if (tutorId !== 'me') {
        const timer = window.setTimeout(() => {
          setRequests((prev) =>
            prev.map((req) =>
              req.id === newId
                ? {
                    ...req,
                    status: 'accepted',
                    msgs: [
                      ...req.msgs,
                      {
                        id: `m-${newId}-reply`,
                        from: 't',
                        text: copy.chat.autoReply,
                      },
                    ],
                  }
                : req,
            ),
          );
        }, 900);
        asyncTimersRef.current.push(timer);
      }

      pushNotification({
        kind: 'booking',
        title: trial ? copy.chat.requestSentTrial : copy.chat.requestSentRegular,
        body: `${tutorLabel} · ${schedule.dateLabel} ${schedule.time}`,
        target: { role: 'student', tab: 'lessons', reqId: newId },
      });

      notify(
        trial ? copy.chat.requestSentTrial : copy.chat.requestSentRegular,
        'thumb',
      );
      setProfileSheet(null);
      setActiveChatId(newId);
    },
    [
      requests,
      locale,
      account.authenticated,
      account.name,
      copy,
      filters.cat,
      filters.subj,
      student.cat,
      student.sec,
      student.test,
      student.ach.trial,
      awardXp,
      notify,
      pushNotification,
      setRequests,
      setStudent,
      tutors,
    ],
  );

  const handleConfirmBooking = useCallback(
    (
      tutorId: string,
      payload: {
        trial: boolean;
        schedule: LessonSchedule;
        msg: string;
        requestId?: number;
      },
    ) => {
      const bkCopy = PWA_COPY[locale].booking;
      const targetTutor = tutors.find((t) => t.id === tutorId);
      const tutorLabel = targetTutor ? resolveTutorName(targetTutor, locale) : 'EduMatch';

      if (payload.requestId !== undefined) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === payload.requestId
              ? {
                  ...r,
                  trial: payload.trial,
                  schedule: payload.schedule,
                  msgs: payload.msg.trim()
                    ? [
                        ...r.msgs,
                        {
                          id: `m-resch-${Date.now()}-${uidRef.current++}`,
                          from: 's',
                          text: `${payload.schedule.dateLabel} · ${payload.schedule.time} — ${payload.msg.trim()}`,
                        },
                      ]
                    : r.msgs,
                }
              : r,
          ),
        );
        pushNotification({
          kind: 'booking',
          title: bkCopy.rescheduledToast,
          body: `${tutorLabel} · ${payload.schedule.dateLabel} ${payload.schedule.time}`,
          target: { role: 'student', tab: 'lessons', reqId: payload.requestId },
        });
        setBookingModalTarget(null);
        notify(bkCopy.rescheduledToast, 'thumb');
        return;
      }

      const maxPersistedReqId = requests.reduce(
        (max, r) => (r.id > max ? r.id : max),
        199,
      );
      if (uidRef.current <= maxPersistedReqId) {
        uidRef.current = maxPersistedReqId + 1;
      }
      const newId = uidRef.current++;
      const resolvedSubject: SubjectId =
        filters.subj || targetTutor?.subj[0] || 'Математика';
      const goalLine = payload.msg.trim();
      const introMsg = goalLine
        ? `${payload.schedule.dateLabel}, ${payload.schedule.time} (${payload.schedule.format}) — ${goalLine}`
        : `${payload.schedule.dateLabel}, ${payload.schedule.time} (${payload.schedule.format})`;

      const created: StudentRequest = {
        id: newId,
        tid: tutorId,
        mine: true,
        trial: payload.trial,
        status: 'new',
        schedule: payload.schedule,
        st: {
          name:
            account.authenticated && account.name
              ? account.name
              : copy.teacher.youDemoStudent,
          cat: filters.cat || student.cat,
          subj: resolvedSubject,
          sec: student.sec,
          level: student.test?.level ?? null,
        },
        msgs: [{ id: `m-${newId}-1`, from: 's', text: introMsg }],
      };

      setRequests((prev) => [created, ...prev]);

      if (payload.trial && !student.ach.trial) {
        setStudent((prev) => ({
          ...prev,
          ach: { ...prev.ach, trial: true },
        }));
        awardXp(20);
      }

      if (tutorId !== 'me') {
        const timer = window.setTimeout(() => {
          setRequests((prev) =>
            prev.map((req) =>
              req.id === newId
                ? {
                    ...req,
                    status: 'accepted',
                    msgs: [
                      ...req.msgs,
                      {
                        id: `m-${newId}-reply`,
                        from: 't',
                        text: copy.chat.autoReply,
                      },
                    ],
                  }
                : req,
            ),
          );
        }, 900);
        asyncTimersRef.current.push(timer);
      }

      pushNotification({
        kind: 'booking',
        title: bkCopy.bookedToast,
        body: `${tutorLabel} · ${payload.schedule.dateLabel} ${payload.schedule.time}`,
        target: { role: 'student', tab: 'lessons', reqId: newId },
      });

      setBookingModalTarget(null);
      setProfileSheet(null);
      notify(bkCopy.bookedToast, 'thumb');
    },
    [
      locale,
      tutors,
      requests,
      filters.subj,
      filters.cat,
      account.authenticated,
      account.name,
      copy.teacher.youDemoStudent,
      copy.chat.autoReply,
      student.cat,
      student.sec,
      student.test,
      student.ach.trial,
      awardXp,
      notify,
      pushNotification,
      setRequests,
      setStudent,
    ],
  );

  const handleInviteStudent = useCallback(
    (studentName: string) => {
      const maxPersistedReqId = requests.reduce(
        (max, r) => (r.id > max ? r.id : max),
        199,
      );
      if (uidRef.current <= maxPersistedReqId) {
        uidRef.current = maxPersistedReqId + 1;
      }
      const newId = uidRef.current++;
      const defaultSched = defaultScheduleForTutor(meTutor, locale, true);
      const inviteGreeting =
        locale === 'az'
          ? `Salam, ${studentName}! Sizi ${defaultSched.dateLabel} günü saat ${defaultSched.time}-da dərsə dəvət edirəm.`
          : locale === 'en'
            ? `Hi ${studentName}! I would like to invite you to a lesson on ${defaultSched.dateLabel} at ${defaultSched.time}.`
            : `Здравствуйте, ${studentName}! Приглашаю вас на урок в ${defaultSched.dateLabel} в ${defaultSched.time}.`;

      const createdInvite: StudentRequest = {
        id: newId,
        tid: meTutor.id,
        mine: true,
        invited: true,
        trial: true,
        status: 'new',
        schedule: defaultSched,
        st: {
          name: studentName,
          cat: student.cat,
          subj: meTutor.subj[0] ?? 'Математика',
          sec: student.sec,
          level: student.test?.level ?? null,
        },
        msgs: [{ id: `m-inv-${newId}`, from: 't', text: inviteGreeting }],
      };

      setRequests((prev) => [createdInvite, ...prev]);
      pushNotification({
        kind: 'invite',
        title: `${copy.teacher.inviteSent} ${studentName}`,
        body: `${resolveTutorName(meTutor, locale)} · ${defaultSched.dateLabel} ${defaultSched.time}`,
        target: { role: 'student', tab: 'lessons', reqId: newId },
      });
      notify(`${copy.teacher.inviteSent} ${studentName}`, 'smile');
    },
    [
      requests,
      meTutor,
      locale,
      student.cat,
      student.sec,
      student.test,
      copy.teacher.inviteSent,
      pushNotification,
      setRequests,
      notify,
    ],
  );

  const handleSelectCity = useCallback(
    (city: CityId) => {
      setLocation({
        name: city,
        lat: CITIES[city][0],
        lon: CITIES[city][1],
        isCustom: false,
      });
      setSwipeIndex(0);
    },
    [setLocation],
  );

  const handleLocateMe = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      notify(copy.radar.geoUnavailable, 'wow');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          name: copy.radar.myLocation,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          isCustom: true,
        });
        setSwipeIndex(0);
        notify(copy.radar.geoUpdated, 'thumb');
      },
      () => notify(copy.radar.geoBlocked, 'wow'),
      { timeout: 8000 },
    );
  }, [copy.radar, notify, setLocation]);

  const handleCompleteQuiz = useCallback(
    (subj: SubjectId, score: number, level: LevelId, gainXp: number) => {
      setStudent((prev) => ({
        ...prev,
        test: { subj, score, level },
        ach: { ...prev.ach, test: true },
      }));
      awardXp(gainXp);
      if (score >= 3) triggerBurst();
    },
    [awardXp, setStudent, triggerBurst],
  );

  const handleGradeHomework = useCallback(
    (subId: string, score: number, feedback: string) => {
      const target = hwSubmissions.find((s) => s.id === subId);
      if (!target) return;
      setHwSubmissions((prev) =>
        prev.map((s) =>
          s.id === subId
            ? {
                ...s,
                st: 'ok',
                score,
                feedback,
                gradedAt: Date.now(),
              }
            : s,
        ),
      );
      if (target.st !== 'ok') {
        awardXp(target.pts);
        triggerBurst();
      }
      pushNotification({
        kind: 'homework',
        title: `${PWA_COPY[locale].teacherSync.gradedBadge}: ${target.title}`,
        body: feedback ? `${score}/100 · ${feedback}` : `${score}/100`,
        target: { role: 'student', tab: 'lessons' },
      });
      notify(`${score}/100 · +${target.pts} XP`, 'smile');
    },
    [
      hwSubmissions,
      awardXp,
      setHwSubmissions,
      triggerBurst,
      pushNotification,
      locale,
      notify,
    ],
  );

  const handleApproveHomework = useCallback(
    (subId: string) => {
      handleGradeHomework(subId, 100, PWA_COPY[locale].teacherSync.gradedBadge);
    },
    [handleGradeHomework, locale],
  );

  const handlePlayVideo = useCallback(
    (tutorId: string, videoId: string) => {
      setPlayingVideo({ tutorId, videoId });
    },
    [],
  );

  const handleBuyCourse = useCallback(
    (tutorId: string, courseId: string) => {
      setOwnedCourses((prev) => new Set(prev).add(courseId));
      setContent((prev) => {
        const curr = prev[tutorId];
        if (!curr) return prev;
        return {
          ...prev,
          [tutorId]: {
            ...curr,
            courses: curr.courses.map((c) =>
              c.id === courseId ? { ...c, sold: c.sold + 1 } : c,
            ),
          },
        };
      });
      awardXp(10);
      triggerBurst();
      notify(copy.profileModal.courseBoughtToast, 'smile');
      setProfileSheet((prev) =>
        prev ? { ...prev, tab: 'videos' } : { tutorId, tab: 'videos' },
      );
    },
    [
      awardXp,
      triggerBurst,
      notify,
      copy.profileModal.courseBoughtToast,
      setContent,
      setOwnedCourses,
    ],
  );

  const handleResetDemo = useCallback(() => {
    asyncTimersRef.current.forEach((id) => window.clearTimeout(id));
    asyncTimersRef.current = [];
    Object.keys(sessionVideoUrlsRef.current).forEach((k) => {
      try {
        URL.revokeObjectURL(sessionVideoUrlsRef.current[k]);
      } catch {
        // Ignore revoke failure
      }
      delete sessionVideoUrlsRef.current[k];
    });
    setSessionVideoUrls({});
    clearPersistedState();
    resetUrlSyncState();
    setNotificationsOpen(false);
    setAccountHubOpen(false);
    setPartnerCourseOpen(false);
    setClassroomReqId(null);
    setBookingModalTarget(null);
    setStudentTab('search');
    setTeacherTab('inbox');
    setTutorsOpen(false);
    writeNavigationToUrl('student', 'search', true);
    setFilters({
      cat: '',
      subj: '',
      lang: '',
      fmt: '',
      price: 60,
      sort: 'match',
      sty: '',
      fav: false,
      mode: 'feed',
    });
    setSwipeIndex(0);
    setProfileSheet(null);
    setActiveChatId(null);
    setPlayingVideo(null);
    setHwPrompt(null);
    setRunningTest(null);
    setRankUpIndex(null);
    setResetNonce((n) => n + 1);
    notify(copy.nav.resetDone, 'smile');
  }, [copy.nav.resetDone, notify]);

  const profileTutor = profileSheet
    ? tutors.find((t) => t.id === profileSheet.tutorId) ?? null
    : null;
  const profileContent: TutorContent = profileSheet
    ? content[profileSheet.tutorId] ?? { videos: [], courses: [], tests: [], hw: [] }
    : { videos: [], courses: [], tests: [], hw: [] };

  const activeChatReq =
    activeChatId !== null ? requests.find((r) => r.id === activeChatId) ?? null : null;
  const activeChatTutor = activeChatReq
    ? tutors.find((t) => t.id === activeChatReq.tid) ?? null
    : null;

  const rawActiveVideo = playingVideo
    ? content[playingVideo.tutorId]?.videos.find((v) => v.id === playingVideo.videoId) ??
      null
    : null;
  const activeVideoSessionUrl = rawActiveVideo ? sessionVideoUrls[rawActiveVideo.id] : undefined;
  const activeVideoObj = useMemo(
    () =>
      rawActiveVideo
        ? {
            ...rawActiveVideo,
            url: activeVideoSessionUrl ?? rawActiveVideo.url,
          }
        : null,
    [rawActiveVideo, activeVideoSessionUrl],
  );

  const handleMarkVideoWatched = useCallback(
    (videoId: string) => {
      if (!seenVideos.has(videoId)) {
        setSeenVideos((prev) => new Set(prev).add(videoId));
        awardXp(15);
        triggerBurst();
      }
      notify(PWA_COPY[locale].videoPlayer.watchedToast, 'smile');
    },
    [seenVideos, setSeenVideos, awardXp, triggerBurst, notify, locale],
  );

  const activeHwObj = hwPrompt
    ? content[hwPrompt.tutorId]?.hw.find((h) => h.id === hwPrompt.hwId) ?? null
    : null;

  const bookingInitialRequest = bookingModalTarget?.requestId
    ? requests.find((r) => r.id === bookingModalTarget.requestId) ?? null
    : null;
  const bookingTutor = bookingModalTarget
    ? tutors.find((t) => t.id === bookingModalTarget.tutorId) ?? null
    : null;

  const classroomReq =
    classroomReqId !== null ? requests.find((r) => r.id === classroomReqId) ?? null : null;
  const classroomTutor = classroomReq
    ? tutors.find((t) => t.id === classroomReq.tid) ?? null
    : null;

  const activeVideoTutor = playingVideo
    ? tutors.find((t) => t.id === playingVideo.tutorId) ?? null
    : null;

  const [tabDirection, setTabDirection] = useState<1 | -1>(1);
  const swipeTouchRef = useRef<{ x: number; y: number } | null>(null);

  const navigateWithUrl = useCallback(
    (nextRole: Role, nextTab: StudentTab | TeacherTab) => {
      if (nextRole === role) {
        if (nextRole === 'student') {
          const prevIdx = STUDENT_TAB_ORDER.indexOf(studentTab);
          const nextIdx = STUDENT_TAB_ORDER.indexOf(nextTab as StudentTab);
          if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
            setTabDirection(nextIdx > prevIdx ? 1 : -1);
          }
        } else {
          const prevIdx = TEACHER_TAB_ORDER.indexOf(teacherTab);
          const nextIdx = TEACHER_TAB_ORDER.indexOf(nextTab as TeacherTab);
          if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
            setTabDirection(nextIdx > prevIdx ? 1 : -1);
          }
        }
      } else {
        setTabDirection(1);
      }

      if (typeof window !== 'undefined' && !window.location.search) {
        writeNavigationToUrl(
          role,
          role === 'student' ? studentTab : teacherTab,
          true,
        );
      }
      updatePersistedState((prev) =>
        prev.role === nextRole ? prev : { ...prev, role: nextRole },
      );
      if (nextRole === 'student') {
        setStudentTab(nextTab as StudentTab);
      } else {
        setTeacherTab(nextTab as TeacherTab);
      }
      setProfileSheet(null);
      setActiveChatId(null);
      setClassroomReqId(null);
      setBookingModalTarget(null);
      writeNavigationToUrl(nextRole, nextTab);
    },
    [role, studentTab, teacherTab],
  );

  const handleMainTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1) {
      swipeTouchRef.current = null;
      return;
    }
    if (typeof document !== 'undefined' && document.querySelector('dialog[open]')) {
      swipeTouchRef.current = null;
      return;
    }
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'input, textarea, select, canvas, [role="tablist"], [data-no-tab-swipe], .overflow-x-auto',
      )
    ) {
      swipeTouchRef.current = null;
      return;
    }
    const touch = e.touches[0];
    swipeTouchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleMainTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      const start = swipeTouchRef.current;
      swipeTouchRef.current = null;
      if (!start || e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) < 60 || Math.abs(dx) <= Math.abs(dy) * 1.4) return;

      const delta = dx < 0 ? 1 : -1;
      if (role === 'student') {
        const curIdx = STUDENT_TAB_ORDER.indexOf(studentTab);
        const nextIdx = Math.max(0, Math.min(STUDENT_TAB_ORDER.length - 1, curIdx + delta));
        if (nextIdx !== curIdx) {
          navigateWithUrl('student', STUDENT_TAB_ORDER[nextIdx]);
        }
      } else {
        const curIdx = TEACHER_TAB_ORDER.indexOf(teacherTab);
        const nextIdx = Math.max(0, Math.min(TEACHER_TAB_ORDER.length - 1, curIdx + delta));
        if (nextIdx !== curIdx) {
          navigateWithUrl('teacher', TEACHER_TAB_ORDER[nextIdx]);
        }
      }
    },
    [navigateWithUrl, role, studentTab, teacherTab],
  );

  const scheduleCatalogScroll = useCallback(() => {
    const timer = window.setTimeout(() => {
      document
        .getElementById('tutor-catalog')
        ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    }, 60);
    asyncTimersRef.current.push(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="em-solaris-canvas min-h-screen pb-20 sm:pb-12">
        <CursorCatTrail />
      <Header
        locale={locale}
        onLocaleChange={setLocale}
        isDark={isDark}
        onToggleTheme={() => setThemeMode(isDark ? 'light' : 'dark')}
        role={role}
        onRoleChange={(next) =>
          navigateWithUrl(next, next === 'student' ? studentTab : teacherTab)
        }
        studentTab={studentTab}
        onStudentTabChange={(next) => navigateWithUrl('student', next)}
        teacherTab={teacherTab}
        onTeacherTabChange={(next) => navigateWithUrl('teacher', next)}
        authenticated={account.authenticated}
        userName={account.name}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenAccountHub={() => setAccountHubOpen(true)}
        unreadNotifications={unreadNotifications}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenTour={() => setTourOpen(true)}
        copy={copy}
      />

      <main
        onTouchStart={handleMainTouchStart}
        onTouchEnd={handleMainTouchEnd}
        className="mx-auto max-w-7xl px-4 pt-6 sm:px-6"
      >
        <motion.div
          key={`${role}-${role === 'student' ? studentTab : teacherTab}`}
          initial={{ opacity: 0.72, x: tabDirection * 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
        {role === 'student' ? (
          <>
            {studentTab === 'search' ? (
              <SearchWorkspace
                locale={locale}
                tutors={tutors}
                filteredTutors={filteredTutors}
                featuredTutors={featuredTutors}
                filters={filters}
                onFiltersChange={(patch) => {
                  setFilters((prev) => ({ ...prev, ...patch }));
                  setSwipeIndex(0);
                }}
                student={student}
                favorites={favorites}
                promoDays={account.promo}
                location={location}
                radiusKm={radiusKm}
                swipeIndex={swipeIndex}
                onSwipeSkip={() => setSwipeIndex((i) => i + 1)}
                onSwipeLike={(id) => {
                  setFavorites((prev) => new Set(prev).add(id));
                  setSwipeIndex((i) => i + 1);
                  notify(copy.search.like, 'smile');
                }}
                onSwipeReset={() => setSwipeIndex(0)}
                onToggleFavorite={handleToggleFavorite}
                onOpenProfile={(id) => handleOpenProfile(id, 'overview')}
                onSendRequest={handleSendRequest}
                onOpenBooking={(tutorId) => setBookingModalTarget({ tutorId })}
                onOpenQuizTab={() => navigateWithUrl('student', 'test')}
                onOpenTour={() => setTourOpen(true)}
                onSwitchToTeacher={() => navigateWithUrl('teacher', teacherTab)}
                onSelectCity={handleSelectCity}
                onLocateMe={handleLocateMe}
                onRadiusChange={(km) => {
                  setRadiusKm(km);
                  setSwipeIndex(0);
                }}
                tutorsOpen={tutorsOpen}
                onTutorsOpenChange={setTutorsOpen}
              />
            ) : null}

            {studentTab === 'test' ? (
              <QuizWorkspace
                locale={locale}
                student={student}
                onCompleteQuiz={handleCompleteQuiz}
                onGoToSearch={(subj) => {
                  if (subj) setFilters((p) => ({ ...p, subj }));
                  navigateWithUrl('student', 'search');
                  setTutorsOpen(true);
                  scheduleCatalogScroll();
                }}
                onSelectRank={(idx) => {
                  const tier = RANK_TIERS[idx];
                  if (!tier) return;
                  notify(
                    student.xp >= tier.xp
                      ? resolveLocalized(tier.title, locale)
                      : `${tier.xp} XP`,
                    tier.iconKey,
                  );
                }}
              />
            ) : null}

            {studentTab === 'lessons' ? (
              <LessonsWorkspace
                locale={locale}
                xp={student.xp}
                requests={requests}
                tutors={tutors}
                content={content}
                hwSubmissions={hwSubmissions}
                onOpenChat={(reqId) => setActiveChatId(reqId)}
                onOpenTutorProfile={(tid, tab = 'overview') =>
                  handleOpenProfile(tid, tab)
                }
                onOpenClassroom={(reqId) => setClassroomReqId(reqId)}
                onRescheduleRequest={(reqId) => {
                  const target = requests.find((r) => r.id === reqId);
                  if (!target) return;
                  setBookingModalTarget({ tutorId: target.tid, requestId: target.id });
                }}
                onAcceptInvite={(reqId) => {
                  setRequests((prev) =>
                    prev.map((r) =>
                      r.id === reqId
                        ? {
                            ...r,
                            status: 'accepted',
                            msgs: [
                              ...r.msgs,
                              {
                                id: `m-acc-${Date.now()}-${r.msgs.length}`,
                                from: 's',
                                text: copy.chat.acceptAutoReply,
                              },
                            ],
                          }
                        : r,
                    ),
                  );
                  notify(copy.chat.acceptToast, 'thumb');
                }}
                onMarkLessonDone={(reqId) => {
                  setRequests((prev) =>
                    prev.map((r) => (r.id === reqId ? { ...r, status: 'done' } : r)),
                  );
                  notify(copy.lessons.lessonDoneToast, 'write');
                }}
                onSubmitReview={(reqId, stars, tags, comment) => {
                  if (!stars) {
                    notify(copy.lessons.needStars, 'wow');
                    return;
                  }
                  const targetReq = requests.find((r) => r.id === reqId);
                  if (!targetReq) return;
                  const fullText = [...tags, comment.trim()].filter(Boolean).join(' · ');

                  setRequests((prev) =>
                    prev.map((r) =>
                      r.id === reqId
                        ? { ...r, review: { stars, text: fullText } }
                        : r,
                    ),
                  );
                  setTutors((prev) =>
                    prev.map((t) => {
                      if (t.id !== targetReq.tid) return t;
                      const nextCount = t.n + 1;
                      const nextRating = (t.rating * t.n + stars) / nextCount;
                      return {
                        ...t,
                        n: nextCount,
                        rating: nextRating,
                        rev: [
                          ...t.rev,
                          {
                            id: `rev-${Date.now()}-${t.rev.length}`,
                            stars,
                            text: fullText,
                            author: account.name || 'Student',
                          },
                        ],
                      };
                    }),
                  );

                  if (!student.ach.review) {
                    setStudent((prev) => ({
                      ...prev,
                      ach: { ...prev.ach, review: true },
                    }));
                    awardXp(15);
                  }
                  triggerBurst();
                  notify(copy.lessons.thanksReview, 'thumb');
                }}
                onGoToSearch={() => {
                  navigateWithUrl('student', 'search');
                  setTutorsOpen(true);
                }}
                onSelectRank={(idx) => {
                  const tier = RANK_TIERS[idx];
                  if (!tier) return;
                  notify(
                    student.xp >= tier.xp
                      ? resolveLocalized(tier.title, locale)
                      : `${tier.xp} XP`,
                    tier.iconKey,
                  );
                }}
              />
            ) : null}
          </>
        ) : (
          <>
            {teacherTab === 'inbox' ? (
              <TeacherInboxWorkspace
                locale={locale}
                meTutor={meTutor}
                activeTeacherId={meTutor.id}
                requests={requests}
                isPremium={account.premium}
                hwSubmissions={hwSubmissions}
                onOpenChat={(id) => setActiveChatId(id)}
                onOpenClassroom={(id) => setClassroomReqId(id)}
                onGradeHomework={handleGradeHomework}
                onAcceptRequest={(id) => {
                  setRequests((prev) =>
                    prev.map((r) =>
                      r.id === id
                        ? {
                            ...r,
                            status: 'accepted',
                            msgs: [
                              ...r.msgs,
                              {
                                id: `m-acc-${Date.now()}-${r.msgs.length}`,
                                from: 't',
                                text: copy.chat.acceptAutoReply,
                              },
                            ],
                          }
                        : r,
                    ),
                  );
                  notify(copy.chat.acceptToast, 'thumb');
                  pushNotification({
                    kind: 'booking',
                    title: copy.chat.acceptToast,
                    body: resolveTutorName(meTutor, locale),
                    target: { role: 'student', tab: 'lessons', reqId: id },
                  });
                }}
                onDeclineRequest={(id) => {
                  setRequests((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)),
                  );
                  notify(copy.chat.declineToast, 'paw');
                  pushNotification({
                    kind: 'booking',
                    title: copy.chat.declineToast,
                    body: resolveTutorName(meTutor, locale),
                    target: { role: 'student', tab: 'lessons', reqId: id },
                  });
                }}
                onOpenPremium={() => setPremiumModalOpen(true)}
                onNotifyAd={(msg) => notify(msg, 'mega')}
                onOpenPartnerModal={() => setPartnerCourseOpen(true)}
              />
            ) : null}

            {teacherTab === 'students' ? (
              <TeacherStudentsWorkspace
                locale={locale}
                students={INITIAL_STUDENTS}
                currentStudent={student}
                currentUserName={account.name}
                isPremium={account.premium}
                onInviteStudent={handleInviteStudent}
                onOpenPremium={() => setPremiumModalOpen(true)}
              />
            ) : null}

            {teacherTab === 'profile' ? (
              <TeacherProfileWorkspace
                key={`${meTutor.id}-${locale}-${resetNonce}`}
                locale={locale}
                meTutor={meTutor}
                onUpdateProfile={(patch) => {
                  setTutors((prev) =>
                    prev.map((t) => (t.id === meTutor.id ? { ...t, ...patch } : t)),
                  );
                }}
                onAddCertificate={(name) => {
                  const certId = `c-${Date.now()}-${uidRef.current++}`;
                  setTutors((prev) =>
                    prev.map((t) =>
                      t.id === meTutor.id
                        ? {
                            ...t,
                            certs: [
                              ...t.certs,
                              { id: certId, name, ok: false },
                            ],
                          }
                        : t,
                    ),
                  );
                }}
                onApproveCertificate={(idx) => {
                  setTutors((prev) =>
                    prev.map((t) => {
                      if (t.id !== meTutor.id) return t;
                      return {
                        ...t,
                        certs: t.certs.map((c, i) =>
                          i === idx ? { ...c, ok: true } : c,
                        ),
                      };
                    }),
                  );
                  notify(copy.profileModal.verified, 'thumb');
                }}
                onNotify={(msg) => notify(msg, 'smile')}
              />
            ) : null}

            {teacherTab === 'studio' ? (
              <TeacherStudioWorkspace
                locale={locale}
                content={
                  content[meTutor.id] ?? { videos: [], courses: [], tests: [], hw: [] }
                }
                isPremium={account.premium}
                hwSubmissions={hwSubmissions}
                onAddVideo={(title, free, file) => {
                  const id = `v-${Date.now()}-${uidRef.current++}`;
                  if (file) {
                    const blobUrl = URL.createObjectURL(file);
                    sessionVideoUrlsRef.current[id] = blobUrl;
                    setSessionVideoUrls((prev) => ({ ...prev, [id]: blobUrl }));
                  }
                  setContent((prev) => {
                    const curr = prev[meTutor.id] ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      [meTutor.id]: {
                        ...curr,
                        videos: [
                          {
                            id,
                            title,
                            dur: file ? copy.teacher.uploadedLabel : '08:00',
                            free,
                          },
                          ...curr.videos,
                        ],
                      },
                    };
                  });
                  notify(copy.teacher.videoAdded, 'smile');
                }}
                onPlayVideo={(videoId) => handlePlayVideo(meTutor.id, videoId)}
                onCreateCourse={(title, price, vids) => {
                  const id = `c-${Date.now()}-${uidRef.current++}`;
                  setContent((prev) => {
                    const curr = prev[meTutor.id] ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      [meTutor.id]: {
                        ...curr,
                        courses: [
                          { id, title, price, vids, sold: 0 },
                          ...curr.courses,
                        ],
                      },
                    };
                  });
                  triggerBurst();
                  notify(copy.teacher.courseCreated, 'smile');
                }}
                onPublishTest={(test) => {
                  const id = `ts-${Date.now()}-${uidRef.current++}`;
                  setContent((prev) => {
                    const curr = prev[meTutor.id] ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      [meTutor.id]: {
                        ...curr,
                        tests: [...curr.tests, { ...test, id }],
                      },
                    };
                  });
                  triggerBurst();
                  notify(copy.teacher.testPublished, 'thumb');
                }}
                onRunDemoTest={(threshold) => {
                  setRunningTest({
                    test: { ...DEFAULT_DEMO_TEST, thr: threshold },
                    isDemo: true,
                  });
                }}
                onAddHomework={(title, pts) => {
                  const id = `h-${Date.now()}-${uidRef.current++}`;
                  setContent((prev) => {
                    const curr = prev[meTutor.id] ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      [meTutor.id]: {
                        ...curr,
                        hw: [{ id, title, pts }, ...curr.hw],
                      },
                    };
                  });
                  notify(copy.teacher.hwPublished, 'smile');
                }}
                onApproveHomework={handleApproveHomework}
                onOpenPremium={() => setPremiumModalOpen(true)}
                onNotify={notify}
              />
            ) : null}

            {teacherTab === 'premium' ? (
              <TeacherPremiumWorkspace
                locale={locale}
                isPremium={account.premium}
                planName={account.plan}
                promoDays={account.promo}
                onActivatePremium={(plan) => {
                  setAccount((prev) => ({ ...prev, premium: true, plan }));
                  triggerBurst();
                  notify(copy.teacher.premiumActivated, 'smile');
                }}
                onSetPromo={(days) => {
                  setAccount((prev) => ({ ...prev, promo: days }));
                  notify(
                    days > 0
                      ? copy.teacher.promoOnToast
                      : copy.teacher.promoOffToast,
                    'smile',
                  );
                }}
                onNotifyAd={(msg) => notify(msg, 'mega')}
                onOpenPartnerModal={() => setPartnerCourseOpen(true)}
              />
            ) : null}
          </>
        )}
        </motion.div>
      </main>

      {/* Clean Structured Minimalist Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Footer
          locale={locale}
          onNavigateSearch={() => {
            navigateWithUrl('student', 'search');
            setTutorsOpen(true);
            scheduleCatalogScroll();
          }}
          onNavigateTest={() => {
            navigateWithUrl('student', 'test');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateLessons={() => {
            navigateWithUrl('student', 'lessons');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectSubject={(subj) => {
            navigateWithUrl('student', 'search');
            setFilters((prev) => ({ ...prev, subj }));
            setSwipeIndex(0);
            setTutorsOpen(true);
            scheduleCatalogScroll();
          }}
          onOpenTour={() => setTourOpen(true)}
          onSwitchToTeacher={() => {
            navigateWithUrl('teacher', teacherTab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPrivacy={() => setPrivacyWho(role)}
          onResetDemo={handleResetDemo}
          onInstallApp={() => {
            void pwa.triggerInstall();
          }}
        />
      </div>

      <MobileNav
        role={role}
        studentTab={studentTab}
        onStudentTabChange={(next) => navigateWithUrl('student', next)}
        teacherTab={teacherTab}
        onTeacherTabChange={(next) => navigateWithUrl('teacher', next)}
        unreadLessons={
          requests.filter(
            (r) => r.mine && r.status !== 'done' && r.status !== 'declined',
          ).length
        }
        unreadInbox={
          requests.filter(
            (r) => r.tid === meTutor.id && r.status === 'new' && !r.invited,
          ).length
        }
        copy={copy}
      />

      {/* Modals & Drawers */}
      <TeacherProfileModal
        open={profileSheet !== null && profileTutor !== null}
        tutor={profileTutor}
        content={profileContent}
        activeTab={profileSheet?.tab ?? 'overview'}
        onTabChange={(tab) =>
          setProfileSheet((prev) => (prev ? { ...prev, tab } : null))
        }
        onClose={() => setProfileSheet(null)}
        locale={locale}
        role={role}
        student={student}
        filters={filters}
        location={location}
        radiusKm={radiusKm}
        ownedCourses={ownedCourses}
        completedTests={completedTests}
        hwSubmissions={hwSubmissions}
        onSendRequest={handleSendRequest}
        onOpenBooking={(tutorId) => {
          setProfileSheet(null);
          setBookingModalTarget({ tutorId });
        }}
        onPlayVideo={handlePlayVideo}
        onBuyCourse={handleBuyCourse}
        onStartTest={(tid, testId) => {
          const found = content[tid]?.tests.find((te) => te.id === testId);
          if (found) setRunningTest({ tutorId: tid, test: found, isDemo: false });
        }}
        onOpenHomeworkSubmit={(tid, hwId) => setHwPrompt({ tutorId: tid, hwId })}
      />

      {activeChatReq ? (
        <ChatModal
          key={activeChatReq.id}
          open={true}
          request={activeChatReq}
          tutor={activeChatTutor}
          role={role}
          locale={locale}
          isPremium={account.premium}
          xp={student.xp}
          onClose={() => setActiveChatId(null)}
          onSendMessage={(reqId, text) => {
            const msgId = `msg-${Date.now()}-${uidRef.current++}`;
            setRequests((prev) =>
              prev.map((r) =>
                r.id === reqId
                  ? {
                      ...r,
                      msgs: [
                        ...r.msgs,
                        {
                          id: msgId,
                          from: role === 'student' ? 's' : 't',
                          text,
                        },
                      ],
                    }
                  : r,
              ),
            );
          }}
          onSendSticker={(reqId, iconKey) => {
            const stkId = `stk-${Date.now()}-${uidRef.current++}`;
            setRequests((prev) =>
              prev.map((r) =>
                r.id === reqId
                  ? {
                      ...r,
                      msgs: [
                        ...r.msgs,
                        {
                          id: stkId,
                          from: role === 'student' ? 's' : 't',
                          img: iconKey,
                        },
                      ],
                    }
                  : r,
              ),
            );
          }}
          onOpenBookingForRequest={(reqId) => {
            const target = requests.find((r) => r.id === reqId);
            if (!target) return;
            setActiveChatId(null);
            setBookingModalTarget({ tutorId: target.tid, requestId: reqId });
          }}
          onOpenPremium={() => setPremiumModalOpen(true)}
        />
      ) : null}

      {tourOpen ? (
        <OnboardingTourModal
          open={true}
          locale={locale}
          onLocaleChange={setLocale}
          onClose={() => setTourOpen(false)}
          onFinishToAuth={() => {
            setTourOpen(false);
            setAuthOpen(true);
          }}
        />
      ) : null}

      {authOpen ? (
        <AuthModal
          open={true}
          locale={locale}
          onLocaleChange={setLocale}
          initialRole={role}
          initialCity={(location.name in CITIES ? location.name : 'Баку') as CityId}
          initialGrade={student.cat}
          initialSector={student.sec}
          onClose={() => setAuthOpen(false)}
          onLocateMe={handleLocateMe}
          onOpenPrivacy={(who) => setPrivacyWho(who)}
          onNotify={notify}
          onSubmitAuth={(payload) => {
            if (payload.mode === 'up') {
              setAccount((prev) => ({
                ...prev,
                name: payload.name,
                email: payload.email,
                authenticated: true,
              }));
              navigateWithUrl(
                payload.role,
                payload.role === 'teacher' ? teacherTab : studentTab,
              );
              setStudent((prev) => ({
                ...prev,
                sec: payload.sector,
                cat: payload.grade,
              }));
              setFilters((prev) => ({
                ...prev,
                cat: payload.grade,
                lang: SECTOR_TO_LANG[payload.sector],
              }));
              handleSelectCity(payload.city);
              if (payload.role === 'teacher') {
                setTutors((prev) =>
                  prev.map((t) =>
                    t.id === 'me'
                      ? {
                          ...t,
                          name: payload.name,
                          lang:
                            payload.teachLangs.length > 0
                              ? payload.teachLangs
                              : t.lang,
                          coords: CITIES[payload.city],
                        }
                      : t,
                  ),
                );
              }
            } else {
              setAccount((prev) => ({
                ...prev,
                email: payload.email,
                authenticated: true,
              }));
            }
            setAuthOpen(false);
            triggerBurst();
            notify(copy.modals.welcomeToast, 'smile');
          }}
        />
      ) : null}

      {privacyWho !== null ? (
        <PrivacyModal
          open={true}
          locale={locale}
          who={privacyWho}
          onSwitchWho={setPrivacyWho}
          onClose={() => setPrivacyWho(null)}
        />
      ) : null}

      <PremiumModal
        open={premiumModalOpen}
        locale={locale}
        onClose={() => setPremiumModalOpen(false)}
        onActivate={(plan) => {
          setAccount((prev) => ({ ...prev, premium: true, plan }));
          setPremiumModalOpen(false);
          triggerBurst();
          notify(copy.teacher.premiumActivated, 'smile');
        }}
      />

      <VideoPlayerModal
        open={playingVideo !== null}
        locale={locale}
        video={activeVideoObj}
        tutorName={
          activeVideoTutor ? resolveTutorName(activeVideoTutor, locale) : undefined
        }
        watched={activeVideoObj ? seenVideos.has(activeVideoObj.id) : false}
        notes={activeVideoObj ? (videoNotes[activeVideoObj.id] ?? []) : []}
        onClose={() => setPlayingVideo(null)}
        onMarkWatched={handleMarkVideoWatched}
        onSaveNote={(videoId, timeSec, text) => {
          const item: VideoNoteItem = {
            id: `vn-${Date.now()}-${uidRef.current++}`,
            timeSec,
            text,
            createdAt: Date.now(),
          };
          setVideoNotes((prev) => ({
            ...prev,
            [videoId]: [...(prev[videoId] ?? []), item],
          }));
        }}
        onDeleteNote={(videoId, noteId) => {
          setVideoNotes((prev) => ({
            ...prev,
            [videoId]: (prev[videoId] ?? []).filter((n) => n.id !== noteId),
          }));
        }}
      />

      <BookingModal
        open={bookingModalTarget !== null && bookingTutor !== null}
        onClose={() => setBookingModalTarget(null)}
        locale={locale}
        tutor={bookingTutor}
        initialRequest={bookingInitialRequest}
        existingRequests={requests}
        onConfirmBooking={handleConfirmBooking}
      />

      <ClassroomModal
        open={classroomReq !== null}
        onClose={() => setClassroomReqId(null)}
        locale={locale}
        role={role}
        request={classroomReq}
        tutor={classroomTutor}
        onSaveNotes={(reqId, notes) => {
          setRequests((prev) =>
            prev.map((r) => (r.id === reqId ? { ...r, classroomNotes: notes } : r)),
          );
        }}
        onSaveWhiteboard={(reqId, strokes: WhiteboardStroke[]) => {
          setRequests((prev) =>
            prev.map((r) =>
              r.id === reqId ? { ...r, whiteboardStrokes: strokes } : r,
            ),
          );
        }}
        onToggleChecklist={(reqId, itemId) => {
          setRequests((prev) =>
            prev.map((r) => {
              if (r.id !== reqId) return r;
              const items = r.checklist ?? [];
              return {
                ...r,
                checklist: items.map((c) =>
                  c.id === itemId ? { ...c, done: !c.done } : c,
                ),
              };
            }),
          );
        }}
        onAddChecklistItem={(reqId, text) => {
          const itemId = `chk-${Date.now()}-${uidRef.current++}`;
          setRequests((prev) =>
            prev.map((r) =>
              r.id === reqId
                ? {
                    ...r,
                    checklist: [
                      ...(r.checklist ?? []),
                      { id: itemId, text, done: false },
                    ],
                  }
                : r,
            ),
          );
        }}
        onSendMessage={(reqId, text) => {
          const msgId = `cm-${Date.now()}-${uidRef.current++}`;
          setRequests((prev) =>
            prev.map((r) =>
              r.id === reqId
                ? {
                    ...r,
                    msgs: [
                      ...r.msgs,
                      {
                        id: msgId,
                        from: role === 'student' ? 's' : 't',
                        text,
                      },
                    ],
                  }
                : r,
            ),
          );
        }}
        onFinishLesson={(reqId) => {
          const target = requests.find((r) => r.id === reqId);
          setRequests((prev) =>
            prev.map((r) => (r.id === reqId ? { ...r, status: 'done' } : r)),
          );
          if (target && target.status !== 'done') {
            awardXp(40);
            triggerBurst();
          }
          pushNotification({
            kind: 'booking',
            title: PWA_COPY[locale].classroom.completedToast,
            body: classroomTutor ? resolveTutorName(classroomTutor, locale) : 'EduMatch',
            target: { role: 'student', tab: 'lessons' },
          });
          setClassroomReqId(null);
          notify(PWA_COPY[locale].classroom.completedToast, 'smile');
        }}
        onOpenHomework={
          classroomTutor
            ? () => {
                setClassroomReqId(null);
                handleOpenProfile(classroomTutor.id, 'hw');
              }
            : undefined
        }
      />

      <NotificationDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        locale={locale}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearRead={() =>
          setNotifications((prev) => prev.filter((n) => !n.read))
        }
        onSelectNotification={(n) => {
          setNotifications((prev) =>
            prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
          );
          setNotificationsOpen(false);
          if (n.target) {
            navigateWithUrl(n.target.role, n.target.tab);
            if (n.target.reqId !== undefined) {
              setActiveChatId(n.target.reqId);
            }
          }
        }}
      />

      <AccountHubModal
        open={accountHubOpen}
        onClose={() => setAccountHubOpen(false)}
        locale={locale}
        role={role}
        account={account}
        student={student}
        tutors={tutors}
        lessonsCount={requests.filter((r) => r.mine).length}
        savedCount={favorites.size}
        isInstalled={pwa.isInstalled}
        alertsEnabled={alertsEnabled}
        onSwitchRole={(nextRole) => {
          navigateWithUrl(nextRole, nextRole === 'student' ? studentTab : teacherTab);
        }}
        onSelectPersona={(persona) => {
          updatePersistedState((prev) => ({
            ...prev,
            account: {
              ...prev.account,
              name: persona.name,
              email: persona.email,
              authenticated: true,
            },
            activeTeacherId:
              persona.role === 'teacher' && persona.tutorId ? persona.tutorId : 'me',
          }));
          navigateWithUrl(persona.role, persona.role === 'student' ? 'lessons' : 'inbox');
          setAccountHubOpen(false);
          notify(copy.modals.welcomeToast, 'smile');
        }}
        onToggleAlerts={() => setAlertsEnabled((prev) => !prev)}
        onTriggerInstall={() => {
          setAccountHubOpen(false);
          void pwa.triggerInstall();
        }}
        onSignOut={() => {
          updatePersistedState((prev) => ({
            ...prev,
            activeTeacherId: 'me',
            account: {
              ...prev.account,
              name: '',
              email: '',
              authenticated: false,
            },
          }));
          setAccountHubOpen(false);
        }}
        onResetDemo={() => {
          handleResetDemo();
          setAccountHubOpen(false);
        }}
      />

      <PartnerCourseModal
        open={partnerCourseOpen}
        onClose={() => setPartnerCourseOpen(false)}
        locale={locale}
        enrolled={partnerEnrolled}
        onEnroll={() => {
          setPartnerEnrolled(true);
          setTutors((prev) =>
            prev.map((t) =>
              t.id === meTutor.id && !t.certs.some((c) => c.id === 'c-partner')
                ? {
                    ...t,
                    certs: [
                      ...t.certs,
                      {
                        id: 'c-partner',
                        name: PWA_COPY[locale].teacherSync.partnerTitle,
                        ok: true,
                      },
                    ],
                  }
                : t,
            ),
          );
          triggerBurst();
          notify(PWA_COPY[locale].teacherSync.partnerEnrolledToast, 'smile');
        }}
      />

      {hwPrompt !== null && activeHwObj !== null ? (
        <HomeworkSubmitModal
          key={`${hwPrompt.tutorId}-${activeHwObj.id}`}
          open={true}
          locale={locale}
          hw={activeHwObj}
          onClose={() => setHwPrompt(null)}
          onNotify={notify}
          onSubmit={(text, fileName) => {
            const subId = `sub-${Date.now()}-${uidRef.current++}`;
            const hwPts = activeHwObj.pts;
            const newSub: HomeworkSubmission = {
              id: subId,
              tid: hwPrompt.tutorId,
              hid: activeHwObj.id,
              title: resolveLocalized(activeHwObj.title, locale),
              who: account.name || copy.teacher.youDemoStudent,
              text,
              fn: fileName,
              st: 'pending',
              pts: hwPts,
            };
            setHwSubmissions((prev) => [...prev, newSub]);
            setHwPrompt(null);
            notify(copy.profileModal.sentForReview, 'write');

            if (hwPrompt.tutorId !== 'me') {
              const timer = window.setTimeout(() => {
                setHwSubmissions((prev) =>
                  prev.map((s) => (s.id === subId ? { ...s, st: 'ok' } : s)),
                );
                awardXp(hwPts);
                triggerBurst();
                notify(`+${hwPts} XP`, 'smile');
              }, 1400);
              asyncTimersRef.current.push(timer);
            }
          }}
        />
      ) : null}

      {runningTest !== null ? (
        <ThresholdTestModal
          key={`${runningTest.test.id}-${runningTest.isDemo ? 'demo' : 'real'}`}
          open={true}
          locale={locale}
          test={runningTest.test}
          isDemo={runningTest.isDemo}
          onClose={(passedId) => {
            if (passedId && !completedTests[passedId]) {
              setCompletedTests((prev) => ({ ...prev, [passedId]: true }));
              awardXp(20);
            }
            setRunningTest(null);
          }}
        />
      ) : null}

      <RankUpModal
        rankIndex={rankUpIndex}
        locale={locale}
        onClose={() => setRankUpIndex(null)}
      />

      <PwaStatusOverlay
        locale={locale}
        isOffline={pwa.isOffline}
        showBanner={pwa.showBanner}
        isInstalled={pwa.isInstalled}
        isIos={pwa.isIos}
        guideOpen={pwa.guideOpen}
        onCloseGuide={() => pwa.setGuideOpen(false)}
        onInstall={() => {
          void pwa.triggerInstall();
        }}
        onDismiss={pwa.dismissBanner}
      />

      <ToastBanner toast={toast} />
      <ConfettiOverlay burstKey={burstKey} />
      </div>
    </MotionConfig>
  );
}
