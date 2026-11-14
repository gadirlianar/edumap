import { describe, expect, it } from 'vitest';
import { CITIES, RANK_TIERS } from '@/data/catalog';
import { INITIAL_TUTORS } from '@/data/tutors';
import {
  computeMatchScore,
  filterAndSortTutors,
  getLevelFromFraction,
  getLevelNumber,
  getRankIndex,
  getScorePercent,
  hasOfflineFormat,
  haversineKm,
  isTutorApproved,
  isTutorWithinRadius,
} from '@/lib/matching';
import type { LocationState, SearchFilters, StudentState, TutorProfile } from '@/types/edumatch';

const BAKU_LOC: LocationState = {
  name: 'Баку',
  lat: CITIES['Баку'][0],
  lon: CITIES['Баку'][1],
};

const BASE_STUDENT: StudentState = {
  cat: '11 класс',
  sec: 'az',
  test: null,
  xp: 120,
  ach: { streak: true },
};

const BASE_FILTERS: SearchFilters = {
  subj: 'Математика',
  cat: '',
  lang: '',
  fmt: '',
  price: 100,
  sty: '',
  sort: 'match',
  fav: false,
  mode: 'feed',
};

describe('geo and approval helpers', () => {
  it('computes realistic haversine distance between Azerbaijani cities', () => {
    expect(haversineKm(CITIES['Баку'], CITIES['Баку'])).toBe(0);

    const bakuSumgait = haversineKm(CITIES['Баку'], CITIES['Сумгайыт']);
    expect(bakuSumgait).toBeGreaterThan(20);
    expect(bakuSumgait).toBeLessThan(35);

    const bakuGanja = haversineKm(CITIES['Баку'], CITIES['Гянджа']);
    expect(bakuGanja).toBeGreaterThan(280);
    expect(bakuGanja).toBeLessThan(320);
  });

  it('requires at least one approved certificate for tutor visibility', () => {
    const approvedTutor = INITIAL_TUTORS[0];
    expect(isTutorApproved(approvedTutor)).toBe(true);

    const pendingOnly: TutorProfile = {
      ...approvedTutor,
      id: 'pending-only',
      certs: [{ id: 'c1', name: 'Pending Diploma', ok: false }],
    };
    const noCerts: TutorProfile = {
      ...approvedTutor,
      id: 'no-certs',
      certs: [],
    };

    expect(isTutorApproved(pendingOnly)).toBe(false);
    expect(isTutorApproved(noCerts)).toBe(false);
  });

  it('detects offline availability and honors online override or >50km unlimited radius', () => {
    const onlineOnly: TutorProfile = {
      ...INITIAL_TUTORS[0],
      fmt: ['Онлайн'],
      coords: CITIES['Гянджа'],
    };
    const offlineGanja: TutorProfile = {
      ...INITIAL_TUTORS[0],
      fmt: ['Онлайн', 'Офлайн'],
      coords: CITIES['Гянджа'],
    };

    expect(hasOfflineFormat(onlineOnly)).toBe(false);
    expect(hasOfflineFormat(offlineGanja)).toBe(true);

    // Tight Baku radius excludes Ganja when viewing offline/all
    expect(isTutorWithinRadius(offlineGanja, '', 20, BAKU_LOC)).toBe(false);
    expect(isTutorWithinRadius(offlineGanja, 'Офлайн', 20, BAKU_LOC)).toBe(false);
    // Online filter bypasses geo radius
    expect(isTutorWithinRadius(offlineGanja, 'Онлайн', 5, BAKU_LOC)).toBe(true);
    // >50 km slider means anywhere in country
    expect(isTutorWithinRadius(offlineGanja, '', 55, BAKU_LOC)).toBe(true);
  });
});

describe('computeMatchScore', () => {
  it('rewards sector alignment, verified tested level, style match, and proximity up to 99 max', () => {
    const azMathTutor = INITIAL_TUTORS.find((t) => t.id === 't1')!;
    const ruOnlyTutor: TutorProfile = {
      ...azMathTutor,
      id: 'ru-only',
      lang: ['Русский'],
      levels: ['Начальный'],
      sty: ['Спокойный'],
    };

    const testedStudent: StudentState = {
      ...BASE_STUDENT,
      sec: 'az',
      test: { subj: 'Математика', score: 6, level: 'Продвинутый' },
    };

    const strictFilters: SearchFilters = { ...BASE_FILTERS, sty: 'Строгий' };

    const azScore = computeMatchScore(azMathTutor, testedStudent, strictFilters, 25, BAKU_LOC);
    const ruScore = computeMatchScore(ruOnlyTutor, testedStudent, strictFilters, 25, BAKU_LOC);

    expect(azScore).toBeLessThanOrEqual(99);
    expect(azScore).toBeGreaterThan(ruScore);
    // +18 sector + 12 level + 4 style + proximity
    expect(azScore - ruScore).toBeGreaterThanOrEqual(30);
  });
});

describe('filterAndSortTutors', () => {
  it('excludes unapproved tutors and enforces price boundary & favorite filters', () => {
    const unapproved: TutorProfile = {
      ...INITIAL_TUTORS[0],
      id: 'unapproved-math',
      certs: [{ id: 'c-un', name: 'Draft', ok: false }],
    };

    const list = [...INITIAL_TUTORS, unapproved];
    const mathUnder25 = filterAndSortTutors(
      list,
      { ...BASE_FILTERS, price: 25, sort: 'price' },
      BASE_STUDENT,
      0,
      new Set(),
      BAKU_LOC,
      60,
    );

    expect(mathUnder25.some((t) => t.id === 'unapproved-math')).toBe(false);
    expect(mathUnder25.every((t) => t.price <= 25 && t.subj.includes('Математика'))).toBe(true);
    for (let i = 1; i < mathUnder25.length; i++) {
      expect(mathUnder25[i].price).toBeGreaterThanOrEqual(mathUnder25[i - 1].price);
    }

    const favOnly = filterAndSortTutors(
      list,
      { ...BASE_FILTERS, fav: true },
      BASE_STUDENT,
      0,
      new Set(['t1']),
      BAKU_LOC,
      60,
    );
    expect(favOnly.map((t) => t.id)).toEqual(['t1']);
  });

  it('pins promoted me profile first when promoDays > 0 and sorts naturally when promoDays === 0', () => {
    const unpromotedPriceSorted = filterAndSortTutors(
      INITIAL_TUTORS,
      { ...BASE_FILTERS, price: 100, sort: 'price' },
      BASE_STUDENT,
      0,
      new Set(),
      BAKU_LOC,
      60,
    );
    const firstUnpromoted = unpromotedPriceSorted[0];
    expect(firstUnpromoted.price).toBeLessThan(28);

    const promotedPriceSorted = filterAndSortTutors(
      INITIAL_TUTORS,
      { ...BASE_FILTERS, price: 100, sort: 'price' },
      BASE_STUDENT,
      7,
      new Set(),
      BAKU_LOC,
      60,
    );
    expect(promotedPriceSorted[0].id).toBe('me');
  });

  it('sorts by distance from selected city when sort === dist', () => {
    const sortedFromGanja = filterAndSortTutors(
      INITIAL_TUTORS,
      { ...BASE_FILTERS, subj: 'Математика', sort: 'dist' },
      BASE_STUDENT,
      0,
      new Set(),
      { name: 'Гянджа', lat: CITIES['Гянджа'][0], lon: CITIES['Гянджа'][1] },
      60,
    );
    expect(sortedFromGanja.length).toBeGreaterThan(1);
    const ganjaDist = haversineKm(CITIES['Гянджа'], sortedFromGanja[0].coords);
    const lastDist = haversineKm(
      CITIES['Гянджа'],
      sortedFromGanja[sortedFromGanja.length - 1].coords,
    );
    expect(ganjaDist).toBeLessThanOrEqual(lastDist);
  });
});

describe('rank, level, and admission score helpers', () => {
  it('resolves rank tier index and XP level accurately across boundaries', () => {
    expect(getRankIndex(0)).toBe(0);
    expect(getRankIndex(99)).toBe(0);
    expect(getRankIndex(100)).toBe(1);
    expect(getRankIndex(219)).toBe(1);
    expect(getRankIndex(220)).toBe(2);
    expect(getRankIndex(1400)).toBe(RANK_TIERS.length - 1);
    expect(getRankIndex(5000)).toBe(RANK_TIERS.length - 1);

    expect(getLevelNumber(0)).toBe(1);
    expect(getLevelNumber(99)).toBe(1);
    expect(getLevelNumber(100)).toBe(2);
    expect(getLevelNumber(350)).toBe(4);
  });

  it('maps quiz score fractions to Начальный / Средний / Продвинутый', () => {
    expect(getLevelFromFraction(1)).toBe('Продвинутый');
    expect(getLevelFromFraction(5 / 6)).toBe('Продвинутый');
    expect(getLevelFromFraction(0.83)).toBe('Продвинутый');
    expect(getLevelFromFraction(4 / 6)).toBe('Средний');
    expect(getLevelFromFraction(0.5)).toBe('Средний');
    expect(getLevelFromFraction(2 / 6)).toBe('Начальный');
    expect(getLevelFromFraction(0)).toBe('Начальный');
  });

  it('computes bounded admission score percentages safely', () => {
    expect(getScorePercent(686, 700)).toBe(98);
    expect(getScorePercent(750, 700)).toBe(100);
    expect(getScorePercent(-20, 700)).toBe(0);
    expect(getScorePercent(500, 0)).toBe(0);
  });
});
