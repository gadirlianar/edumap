'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { MotionConfig } from 'motion/react';
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
import { GtmStrategyWorkspace } from '@/components/GtmStrategyWorkspace';
import { QuizWorkspace } from '@/components/QuizWorkspace';
import { SearchWorkspace } from '@/components/SearchWorkspace';
import {
  ConfettiOverlay,
  HomeworkSubmitModal,
  PremiumModal,
  RankUpModal,
  ThresholdTestModal,
  ToastBanner,
  VideoPlayerModal,
} from '@/components/SecondaryModals';
import { TeacherInboxWorkspace } from '@/components/TeacherInboxWorkspace';
import { TeacherPremiumWorkspace } from '@/components/TeacherPremiumWorkspace';
import { TeacherProfileModal } from '@/components/TeacherProfileModal';
import { TeacherProfileWorkspace } from '@/components/TeacherProfileWorkspace';
import { TeacherStudentsWorkspace } from '@/components/TeacherStudentsWorkspace';
import { TeacherStudioWorkspace } from '@/components/TeacherStudioWorkspace';
import type {
  AccountProfile,
  CityId,
  HomeworkSubmission,
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

  const locale = persisted.locale;
  const role = persisted.role;
  const themeMode = persisted.theme;
  const account = persisted.account;
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

  const setRole = useCallback((next: SetStateAction<Role>) => {
    updatePersistedState((prev) => ({
      ...prev,
      role: applyUpdater(prev.role, next),
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

  const setRadiusKm = useCallback((next: SetStateAction<number>) => {
    updatePersistedState((prev) => ({
      ...prev,
      radiusKm: applyUpdater(prev.radiusKm, next),
    }));
  }, []);

  const [studentTab, setStudentTab] = useState<StudentTab>('search');
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('inbox');
  const [tutorsOpen, setTutorsOpen] = useState(false);

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
    () => tutors.find((t) => t.id === 'me') ?? tutors[0],
    [tutors],
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

      const created: StudentRequest = {
        id: newId,
        tid: tutorId,
        mine: true,
        trial,
        status: 'new',
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
      setRequests,
      setStudent,
      tutors,
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

  const handleApproveHomework = useCallback(
    (subId: string) => {
      const target = hwSubmissions.find((s) => s.id === subId);
      if (!target || target.st === 'ok') return;
      setHwSubmissions((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, st: 'ok' } : s)),
      );
      awardXp(target.pts);
      triggerBurst();
      notify(`+${target.pts} XP`, 'smile');
    },
    [hwSubmissions, awardXp, setHwSubmissions, triggerBurst, notify],
  );

  const handlePlayVideo = useCallback(
    (tutorId: string, videoId: string) => {
      if (!seenVideos.has(videoId)) {
        setSeenVideos((prev) => new Set(prev).add(videoId));
        awardXp(2);
      }
      setPlayingVideo({ tutorId, videoId });
    },
    [seenVideos, awardXp, setSeenVideos],
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
    setStudentTab('search');
    setTeacherTab('inbox');
    setTutorsOpen(false);
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
  const activeVideoObj = rawActiveVideo
    ? {
        ...rawActiveVideo,
        url: sessionVideoUrls[rawActiveVideo.id] ?? rawActiveVideo.url,
      }
    : null;

  const activeHwObj = hwPrompt
    ? content[hwPrompt.tutorId]?.hw.find((h) => h.id === hwPrompt.hwId) ?? null
    : null;

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
        onRoleChange={(next) => {
          setRole(next);
          setProfileSheet(null);
          setActiveChatId(null);
        }}
        studentTab={studentTab}
        onStudentTabChange={setStudentTab}
        teacherTab={teacherTab}
        onTeacherTabChange={setTeacherTab}
        authenticated={account.authenticated}
        userName={account.name}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenTour={() => setTourOpen(true)}
        copy={copy}
      />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
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
                onOpenQuizTab={() => setStudentTab('test')}
                onOpenTour={() => setTourOpen(true)}
                onSwitchToTeacher={() => setRole('teacher')}
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
                  setStudentTab('search');
                  setTutorsOpen(true);
                  window.setTimeout(() => {
                    document
                      .getElementById('tutor-catalog')
                      ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
                  }, 60);
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
                  setStudentTab('search');
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

            {studentTab === 'strategy' ? (
              <GtmStrategyWorkspace
                locale={locale}
                onExploreCatalog={() => {
                  setStudentTab('search');
                  setTutorsOpen(true);
                  window.setTimeout(() => {
                    document
                      .getElementById('tutor-catalog')
                      ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
                  }, 60);
                }}
                onStartQuiz={() => setStudentTab('test')}
              />
            ) : null}
          </>
        ) : (
          <>
            {teacherTab === 'inbox' ? (
              <TeacherInboxWorkspace
                locale={locale}
                meTutor={meTutor}
                requests={requests}
                isPremium={account.premium}
                onOpenChat={(id) => setActiveChatId(id)}
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
                }}
                onDeclineRequest={(id) => {
                  setRequests((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)),
                  );
                  notify(copy.chat.declineToast, 'paw');
                }}
                onOpenPremium={() => setPremiumModalOpen(true)}
                onNotifyAd={(msg) => notify(msg, 'mega')}
              />
            ) : null}

            {teacherTab === 'students' ? (
              <TeacherStudentsWorkspace
                locale={locale}
                students={INITIAL_STUDENTS}
                currentStudent={student}
                currentUserName={account.name}
                isPremium={account.premium}
                onInviteStudent={(name) =>
                  notify(`${copy.teacher.inviteSent} ${name}`, 'smile')
                }
                onOpenPremium={() => setPremiumModalOpen(true)}
              />
            ) : null}

            {teacherTab === 'profile' ? (
              <TeacherProfileWorkspace
                key={`${locale}-${resetNonce}`}
                locale={locale}
                meTutor={meTutor}
                onUpdateProfile={(patch) => {
                  setTutors((prev) =>
                    prev.map((t) => (t.id === 'me' ? { ...t, ...patch } : t)),
                  );
                }}
                onAddCertificate={(name) => {
                  const certId = `c-${uidRef.current++}`;
                  setTutors((prev) =>
                    prev.map((t) =>
                      t.id === 'me'
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
                      if (t.id !== 'me') return t;
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
                  content.me ?? { videos: [], courses: [], tests: [], hw: [] }
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
                    const curr = prev.me ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      me: {
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
                onPlayVideo={(videoId) => handlePlayVideo('me', videoId)}
                onCreateCourse={(title, price, vids) => {
                  const id = `c-${Date.now()}-${uidRef.current++}`;
                  setContent((prev) => {
                    const curr = prev.me ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      me: {
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
                    const curr = prev.me ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      me: {
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
                    const curr = prev.me ?? {
                      videos: [],
                      courses: [],
                      tests: [],
                      hw: [],
                    };
                    return {
                      ...prev,
                      me: {
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
              />
            ) : null}
          </>
        )}
      </main>

      {/* Clean Structured Minimalist Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Footer
          locale={locale}
          onNavigateSearch={() => {
            setRole('student');
            setStudentTab('search');
            setTutorsOpen(true);
            window.setTimeout(() => {
              document
                .getElementById('tutor-catalog')
                ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
            }, 60);
          }}
          onNavigateTest={() => {
            setRole('student');
            setStudentTab('test');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateLessons={() => {
            setRole('student');
            setStudentTab('lessons');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectSubject={(subj) => {
            setRole('student');
            setStudentTab('search');
            setFilters((prev) => ({ ...prev, subj }));
            setSwipeIndex(0);
            setTutorsOpen(true);
            window.setTimeout(() => {
              document
                .getElementById('tutor-catalog')
                ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
            }, 60);
          }}
          onOpenTour={() => setTourOpen(true)}
          onSwitchToTeacher={() => {
            setRole('teacher');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPrivacy={() => setPrivacyWho(role)}
          onResetDemo={handleResetDemo}
        />
      </div>

      <MobileNav
        role={role}
        studentTab={studentTab}
        onStudentTabChange={setStudentTab}
        teacherTab={teacherTab}
        onTeacherTabChange={setTeacherTab}
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
              setRole(payload.role);
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
        onClose={() => setPlayingVideo(null)}
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

      <ToastBanner toast={toast} />
      <ConfettiOverlay burstKey={burstKey} />
      </div>
    </MotionConfig>
  );
}
