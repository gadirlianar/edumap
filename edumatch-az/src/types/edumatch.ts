export type Locale = 'ru' | 'az' | 'en';
export type Role = 'student' | 'teacher';
export type ThemeMode = 'light' | 'dark' | 'system';
export type SectorCode = 'az' | 'ru' | 'en';

export type StudentTab = 'search' | 'test' | 'lessons' | 'strategy';
export type TeacherTab = 'inbox' | 'students' | 'profile' | 'studio' | 'premium';
export type StudioTab = 'videos' | 'courses' | 'tests' | 'hw';
export type ProfileSheetTab = 'overview' | 'videos' | 'courses' | 'tests' | 'hw';

export type GradeId =
  | '1–4 класс'
  | '5–8 класс'
  | '9 класс'
  | '10 класс'
  | '11 класс'
  | '1 курс'
  | '2–4 курс';

export type LevelId = 'Начальный' | 'Средний' | 'Продвинутый';

export type SubjectId =
  | 'Математика'
  | 'Физика'
  | 'Химия'
  | 'Английский язык'
  | 'Азербайджанский язык'
  | 'Информатика';

export type TeachingStyleId =
  | 'Спокойный'
  | 'С юмором'
  | 'Строгий'
  | 'На примерах'
  | 'Мотивирует';

export type TeachingLanguageId = 'Азербайджанский' | 'Русский' | 'Английский';
export type LessonFormatId = 'Онлайн' | 'Офлайн';
export type CityId = 'Баку' | 'Сумгайыт' | 'Гянджа';

export type LocalizedText = Record<Locale, string>;

export interface TutorCertificate {
  id: string;
  name: LocalizedText | string;
  ok: boolean;
}

export interface TutorReview {
  id?: string;
  stars: number;
  text: string;
  author?: string;
  date?: string;
}

export interface TutorEducation {
  university: LocalizedText;
  universityShort: string;
  faculty: LocalizedText;
  degree: LocalizedText;
  admissionScore: number;
  maxScore: number;
  admissionYear: number;
  grantType: LocalizedText;
  extraExam?: string;
  verified: boolean;
}

export interface TutorAchievement {
  id: string;
  metric: string;
  label: LocalizedText;
  detail: LocalizedText;
}

export interface TutorStrengths {
  differentiator: LocalizedText;
  points: LocalizedText[];
  bestFor: LocalizedText;
}

export interface TutorProfile {
  id: string;
  name: string;
  subj: SubjectId[];
  cats: GradeId[];
  levels: LevelId[];
  lang: TeachingLanguageId[];
  fmt: LessonFormatId[];
  price: number;
  rating: number;
  n: number;
  sty: TeachingStyleId[];
  certs: TutorCertificate[];
  rev: TutorReview[];
  bio: LocalizedText;
  coords: [number, number];
  education: TutorEducation;
  achievements: TutorAchievement[];
  strengths: TutorStrengths;
}

export interface TutorVideo {
  id: string;
  title: LocalizedText | string;
  dur: string;
  free: boolean;
  url?: string;
}

export interface TutorCourse {
  id: string;
  title: LocalizedText | string;
  price: number;
  vids: string[];
  sold: number;
}

export interface QuizQuestion {
  prompt: LocalizedText | string;
  options: (LocalizedText | string)[];
  correctIndex: number;
}

export interface TutorTest {
  id: string;
  title: LocalizedText | string;
  thr: LevelId;
  qs: QuizQuestion[];
}

export interface TutorHomework {
  id: string;
  title: LocalizedText | string;
  pts: number;
}

export interface TutorContent {
  videos: TutorVideo[];
  courses: TutorCourse[];
  tests: TutorTest[];
  hw: TutorHomework[];
}

export interface ChatMessage {
  id: string;
  from: 's' | 't';
  text?: string;
  img?: string;
  time?: string;
}

export type RequestStatus = 'new' | 'accepted' | 'declined' | 'done';

export interface StudentRequest {
  id: number;
  tid: string;
  mine?: boolean;
  trial: boolean;
  status: RequestStatus;
  st: {
    name: string;
    cat: GradeId;
    subj: SubjectId;
    sec: SectorCode;
    level: LevelId | null;
  };
  review?: {
    stars: number;
    text: string;
  };
  msgs: ChatMessage[];
}

export interface StudentDirectoryItem {
  id: string;
  name: string;
  cat: GradeId;
  subj: SubjectId;
  level: LevelId | null;
  goal: LocalizedText | string;
  sec: SectorCode;
}

export interface HomeworkSubmission {
  id: string;
  tid: string;
  hid: string;
  title: string;
  who: string;
  text: string;
  fn: string;
  st: 'pending' | 'ok';
  pts: number;
}

export interface SearchFilters {
  cat: GradeId | '';
  subj: SubjectId | '';
  lang: TeachingLanguageId | '';
  fmt: LessonFormatId | '';
  price: number;
  sort: 'match' | 'dist' | 'rating' | 'price';
  sty: TeachingStyleId | '';
  fav: boolean;
  mode: 'feed' | 'swipe';
}

export interface InboxFilters {
  cat: GradeId | '';
  subj: SubjectId | '';
  trial: '' | '1' | '0';
  lv: LevelId | '';
  sort: 'new' | 'cat';
}

export interface DirectoryFilters {
  cat: GradeId | '';
  lv: LevelId | '';
  sec: SectorCode | '';
}

export interface LocationState {
  name: string;
  lat: number;
  lon: number;
  isCustom?: boolean;
}

export interface AccountProfile {
  name: string;
  email: string;
  premium: boolean;
  plan: string;
  promo: number;
  authenticated: boolean;
}

export interface StudentState {
  cat: GradeId;
  sec: SectorCode;
  test: {
    subj: SubjectId;
    score: number;
    level: LevelId;
  } | null;
  xp: number;
  ach: {
    test?: boolean;
    trial?: boolean;
    review?: boolean;
    streak?: boolean;
  };
}

export interface RankTier {
  xp: number;
  title: LocalizedText;
  iconKey: string;
}
