import { RANK_TIERS, SECTOR_TO_LANG } from '@/data/catalog';
import type {
  LessonFormatId,
  LevelId,
  LocationState,
  SearchFilters,
  StudentState,
  TutorProfile,
} from '@/types/edumatch';

export function haversineKm(a: [number, number], b: [number, number]): number {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLon = (b[1] - a[1]) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export function tutorDistanceKm(tutor: TutorProfile, location: LocationState): number {
  return haversineKm([location.lat, location.lon], tutor.coords);
}

export function hasOfflineFormat(tutor: TutorProfile): boolean {
  return tutor.fmt.includes('Офлайн');
}

export function isTutorApproved(tutor: TutorProfile): boolean {
  return tutor.certs.some((cert) => cert.ok);
}

export function isTutorWithinRadius(
  tutor: TutorProfile,
  formatFilter: LessonFormatId | '',
  radiusKm: number,
  location: LocationState,
): boolean {
  if (formatFilter === 'Онлайн' || radiusKm > 50) return true;
  return tutorDistanceKm(tutor, location) <= radiusKm;
}

export function computeMatchScore(
  tutor: TutorProfile,
  student: StudentState,
  filters: SearchFilters,
  radiusKm: number,
  location: LocationState,
): number {
  const level = student.test?.level ?? null;
  const levelScore = level ? (tutor.levels.includes(level) ? 12 : 0) : 6;
  const sectorScore = tutor.lang.includes(SECTOR_TO_LANG[student.sec]) ? 18 : 0;
  const distKm = tutorDistanceKm(tutor, location);
  const near = isTutorWithinRadius(tutor, filters.fmt, radiusKm, location);
  const proximityScore = near ? Math.max(0, 12 - distKm / 4) : 0;
  const ratingScore = (tutor.rating - 4) * 10;
  const styleScore = filters.sty && tutor.sty.includes(filters.sty) ? 4 : 0;

  return Math.min(
    99,
    Math.round(45 + levelScore + sectorScore + proximityScore + ratingScore + styleScore),
  );
}

export function filterAndSortTutors(
  tutors: TutorProfile[],
  filters: SearchFilters,
  student: StudentState,
  promoDays: number,
  favorites: Set<string>,
  location: LocationState,
  radiusKm: number,
): TutorProfile[] {
  const filtered = tutors.filter(
    (tutor) =>
      isTutorApproved(tutor) &&
      (!filters.subj || tutor.subj.includes(filters.subj)) &&
      (!filters.cat || tutor.cats.includes(filters.cat)) &&
      (!filters.lang || tutor.lang.includes(filters.lang)) &&
      (!filters.fmt || tutor.fmt.includes(filters.fmt)) &&
      tutor.price <= filters.price &&
      (!filters.sty || tutor.sty.includes(filters.sty)) &&
      (!filters.fav || favorites.has(tutor.id)) &&
      isTutorWithinRadius(tutor, filters.fmt, radiusKm, location),
  );

  return filtered.sort((a, b) => {
    const aPromo = a.id === 'me' && promoDays > 0 ? 1 : 0;
    const bPromo = b.id === 'me' && promoDays > 0 ? 1 : 0;
    if (bPromo !== aPromo) return bPromo - aPromo;

    if (filters.sort === 'price') return a.price - b.price;
    if (filters.sort === 'dist') {
      return tutorDistanceKm(a, location) - tutorDistanceKm(b, location);
    }
    if (filters.sort === 'match') {
      return (
        computeMatchScore(b, student, filters, radiusKm, location) -
        computeMatchScore(a, student, filters, radiusKm, location)
      );
    }
    return b.rating - a.rating;
  });
}

export function getRankIndex(xp: number): number {
  let rank = 0;
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (xp >= RANK_TIERS[i].xp) {
      rank = i;
    }
  }
  return rank;
}

export function getLevelNumber(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getLevelFromFraction(fraction: number): LevelId {
  if (fraction >= 0.83) return 'Продвинутый';
  if (fraction >= 0.5) return 'Средний';
  return 'Начальный';
}

export function getScorePercent(admissionScore: number, maxScore = 700): number {
  if (maxScore <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((admissionScore / maxScore) * 100)));
}
