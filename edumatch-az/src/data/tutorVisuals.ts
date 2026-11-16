import type { Locale, LocalizedText, SubjectId, TutorProfile } from '@/types/edumatch';

export interface TutorVisualMeta {
  id: string;
  photoUrl: string;
  accentHex: string;
  ringHex: string;
  superpowerTag: LocalizedText;
  shortUniversityBadge: LocalizedText;
  trajectory: {
    before: string;
    after: string;
    delta: string;
    label: LocalizedText;
    bar1Pct: number;
    bar2Pct: number;
  };
}

export const TUTOR_VISUALS: Record<string, TutorVisualMeta> = {
  t1: {
    id: 't1',
    photoUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Карта ловушек DİM за 10 сек',
      az: 'DİM tələlərini 10 san. tapır',
      en: 'Spots DİM exam traps in 10s',
    },
    shortUniversityBadge: {
      ru: 'BDU · 686/700',
      az: 'BDU · 686/700',
      en: 'BSU · 686/700',
    },
    trajectory: {
      before: '460',
      after: '648',
      delta: '+158',
      label: {
        ru: 'Рост пробника DİM (4 мес.)',
        az: 'DİM sınaq artımı (4 ay)',
        en: 'DİM mock growth (4 mo)',
      },
      bar1Pct: 94,
      bar2Pct: 91,
    },
  },
  t4: {
    id: 't4',
    photoUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Живой код + алгоритмы RFO',
      az: 'Canlı kod + RFO olimpiada',
      en: 'Live coding + Olympiad CS',
    },
    shortUniversityBadge: {
      ru: 'BHOS · 692/700',
      az: 'BANM · 692/700',
      en: 'BHOS · 692/700',
    },
    trajectory: {
      before: '510',
      after: '685',
      delta: '100%',
      label: {
        ru: 'Грант IT и медали RFO',
        az: 'IT qrantı və RFO medalları',
        en: 'IT Grant & Olympiad medals',
      },
      bar1Pct: 96,
      bar2Pct: 98,
    },
  },
  t2: {
    id: 't2',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Разговор без барьера за 3 нед.',
      az: '3 həftəyə danışıq baryerini aşır',
      en: 'Speaking fluency in 3 weeks',
    },
    shortUniversityBadge: {
      ru: 'ADA · 668/700',
      az: 'ADA · 668/700',
      en: 'ADA · 668/700',
    },
    trajectory: {
      before: '5.5',
      after: '8.0',
      delta: '+2.0',
      label: {
        ru: 'Скачок IELTS Band (12 нед.)',
        az: 'IELTS Band sıçrayışı (12 həftə)',
        en: 'IELTS Band jump (12 wks)',
      },
      bar1Pct: 92,
      bar2Pct: 89,
    },
  },
  me: {
    id: 'me',
    photoUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Поднимает слабую базу за 2 мес.',
      az: 'Zəif bazanı 2 ayda qaldırır',
      en: 'Lifts weak base in 2 months',
    },
    shortUniversityBadge: {
      ru: 'ADNSU · 648/700',
      az: 'ADNSU · 648/700',
      en: 'ASOIU · 648/700',
    },
    trajectory: {
      before: '380',
      after: '615',
      delta: '+135',
      label: {
        ru: 'С нуля до уверенной базы DİM',
        az: 'Sıfırdan güclü DİM bazasına',
        en: 'Zero to solid DİM foundation',
      },
      bar1Pct: 88,
      bar2Pct: 89,
    },
  },
  t3: {
    id: 't3',
    photoUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Органика в чётких схемах',
      az: 'Üzvi kimya aydın sxemlərlə',
      en: 'Visual reaction schemas',
    },
    shortUniversityBadge: {
      ru: 'BDU · 654/700',
      az: 'BDU · 654/700',
      en: 'BSU · 654/700',
    },
    trajectory: {
      before: '410',
      after: '630',
      delta: '+140',
      label: {
        ru: 'Подготовка IV группы (АМУ)',
        az: 'IV qrup ATU tibb hazırlığı',
        en: 'Group IV Medical Univ. track',
      },
      bar1Pct: 87,
      bar2Pct: 85,
    },
  },
  t5: {
    id: 't5',
    photoUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: '9 класс на 85+ без стресса',
      az: 'Stressiz 9-cu sinif 85+ nəticə',
      en: 'Stress-free Grade 9 85+ prep',
    },
    shortUniversityBadge: {
      ru: 'ADPU · 612/700',
      az: 'ADPU · 612/700',
      en: 'ASPU · 612/700',
    },
    trajectory: {
      before: '52',
      after: '88',
      delta: '98%',
      label: {
        ru: 'Выпускной 9 кл. и грамотность',
        az: '9-cu sinif buraxılış nəticəsi',
        en: 'Grade 9 final exam score',
      },
      bar1Pct: 90,
      bar2Pct: 95,
    },
  },
  t6: {
    id: 't6',
    photoUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'На одной волне со школьником',
      az: 'Şagirdlə eyni dildə izah',
      en: 'Peer-mentor energy & clarity',
    },
    shortUniversityBadge: {
      ru: 'ADNSU · 638/700',
      az: 'ADNSU · 638/700',
      en: 'ASOIU · 638/700',
    },
    trajectory: {
      before: '3',
      after: '5',
      delta: '98/100',
      label: {
        ru: 'Школьная база 5–9 классов',
        az: '5–9-cu sinif məktəb bazası',
        en: 'Grades 5–9 math confidence',
      },
      bar1Pct: 86,
      bar2Pct: 82,
    },
  },
  t7: {
    id: 't7',
    photoUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Физика и химия без зубрёжки',
      az: 'Fizika və kimya əzbərsiz məntiqlə',
      en: 'Visual logic for Physics & Chem',
    },
    shortUniversityBadge: {
      ru: 'UFAZ · 679/700',
      az: 'UFAZ · 679/700',
      en: 'UFAZ · 679/700',
    },
    trajectory: {
      before: '430',
      after: '635',
      delta: '+148',
      label: {
        ru: 'Подготовка I и IV групп DİM',
        az: 'I və IV qrup DİM hazırlığı',
        en: 'Group I & IV DİM score jump',
      },
      bar1Pct: 91,
      bar2Pct: 90,
    },
  },
  t8: {
    id: 't8',
    photoUrl:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Тренажёр ошибок DİM 24/7',
      az: 'Hər səhvə 5 dəq. fərdi məşq',
      en: 'Zero repeat-mistake drills',
    },
    shortUniversityBadge: {
      ru: 'ADNSU · 672/700',
      az: 'ADNSU · 672/700',
      en: 'ASOIU · 672/700',
    },
    trajectory: {
      before: '445',
      after: '640',
      delta: '+142',
      label: {
        ru: 'Рост пробников (Сумгайыт / Онл.)',
        az: 'Sınaq artımı (Sumqayıt / Onl.)',
        en: 'Mock exam growth (4 mo)',
      },
      bar1Pct: 92,
      bar2Pct: 89,
    },
  },
  t9: {
    id: 't9',
    photoUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Инженерные модели физики',
      az: 'Fizikanın mühəndis məntiqi',
      en: 'Engineering physics models',
    },
    shortUniversityBadge: {
      ru: 'BHOS · 684/700',
      az: 'BANM · 684/700',
      en: 'BHOS · 684/700',
    },
    trajectory: {
      before: '485',
      after: '665',
      delta: '97%',
      label: {
        ru: 'Точность задач части C',
        az: 'Açıq suallarda dəqiqlik',
        en: 'Full-credit problem accuracy',
      },
      bar1Pct: 95,
      bar2Pct: 94,
    },
  },
  t10: {
    id: 't10',
    photoUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Чтение DİM + речь с нуля',
      az: 'DİM mətni + canlı danışıq',
      en: 'DİM Reading + active speech',
    },
    shortUniversityBadge: {
      ru: 'ADU · 661/700',
      az: 'ADU · 661/700',
      en: 'AUL · 661/700',
    },
    trajectory: {
      before: '45',
      after: '88',
      delta: '+43',
      label: {
        ru: 'Выпускной 9–11 кл. (Гянджа / Онл.)',
        az: '9–11-ci sinif buraxılış nəticəsi',
        en: 'Grade 9–11 DİM score jump',
      },
      bar1Pct: 89,
      bar2Pct: 93,
    },
  },
  t11: {
    id: 't11',
    photoUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=640&q=85',
    accentHex: '#0F172A',
    ringHex: '#10B981',
    superpowerTag: {
      ru: 'Задачи по химии за 1 минуту',
      az: 'Kimya məsələsi 1 dəqiqəyə',
      en: '1-min stoichiometry solver',
    },
    shortUniversityBadge: {
      ru: 'BDU · 669/700',
      az: 'BDU · 669/700',
      en: 'BSU · 669/700',
    },
    trajectory: {
      before: '405',
      after: '630',
      delta: '+150',
      label: {
        ru: 'Поступление IV группа (АМУ)',
        az: 'IV qrup ATU tibb hazırlığı',
        en: 'Group IV Medical Univ. growth',
      },
      bar1Pct: 90,
      bar2Pct: 92,
    },
  },
};

const FALLBACK_VISUALS: TutorVisualMeta[] = [
  TUTOR_VISUALS.t1,
  TUTOR_VISUALS.t4,
  TUTOR_VISUALS.t2,
  TUTOR_VISUALS.me,
  TUTOR_VISUALS.t3,
  TUTOR_VISUALS.t5,
  TUTOR_VISUALS.t6,
  TUTOR_VISUALS.t7,
  TUTOR_VISUALS.t8,
  TUTOR_VISUALS.t9,
  TUTOR_VISUALS.t10,
  TUTOR_VISUALS.t11,
];

export function getTutorVisual(id?: string, index = 0): TutorVisualMeta {
  if (id && TUTOR_VISUALS[id]) {
    return TUTOR_VISUALS[id];
  }
  return FALLBACK_VISUALS[Math.abs(index) % FALLBACK_VISUALS.length];
}

export interface SubjectVisualTheme {
  pillClass: string;
  barGradientClass: string;
  topStripClass: string;
  softBoxClass: string;
  dotColorClass: string;
}

export const DEFAULT_SUBJECT_THEME: SubjectVisualTheme = {
  pillClass:
    'border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300',
  barGradientClass: 'from-emerald-500 to-teal-400',
  topStripClass: 'from-emerald-400 via-teal-400 to-[#C8F542]',
  softBoxClass:
    'border-emerald-200/60 bg-emerald-50/75 dark:border-emerald-800/50 dark:bg-emerald-950/35',
  dotColorClass: 'bg-emerald-500',
};

export const SUBJECT_THEMES: Record<SubjectId, SubjectVisualTheme> = {
  Математика: DEFAULT_SUBJECT_THEME,
  Физика: {
    pillClass:
      'border-sky-200/80 bg-sky-50 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-300',
    barGradientClass: 'from-sky-500 to-blue-500',
    topStripClass: 'from-sky-400 via-blue-500 to-cyan-300',
    softBoxClass:
      'border-sky-200/60 bg-sky-50/75 dark:border-sky-800/50 dark:bg-sky-950/35',
    dotColorClass: 'bg-sky-500',
  },
  Химия: {
    pillClass:
      'border-violet-200/80 bg-violet-50 text-violet-700 dark:border-violet-800/70 dark:bg-violet-950/60 dark:text-violet-300',
    barGradientClass: 'from-violet-500 to-fuchsia-500',
    topStripClass: 'from-violet-400 via-fuchsia-500 to-pink-400',
    softBoxClass:
      'border-violet-200/60 bg-violet-50/75 dark:border-violet-800/50 dark:bg-violet-950/35',
    dotColorClass: 'bg-violet-500',
  },
  'Английский язык': {
    pillClass:
      'border-amber-200/80 bg-amber-50 text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-300',
    barGradientClass: 'from-amber-500 to-orange-400',
    topStripClass: 'from-amber-400 via-orange-400 to-yellow-300',
    softBoxClass:
      'border-amber-200/60 bg-amber-50/75 dark:border-amber-800/50 dark:bg-amber-950/35',
    dotColorClass: 'bg-amber-500',
  },
  'Азербайджанский язык': {
    pillClass:
      'border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300',
    barGradientClass: 'from-rose-500 to-pink-500',
    topStripClass: 'from-rose-400 via-pink-500 to-orange-300',
    softBoxClass:
      'border-rose-200/60 bg-rose-50/75 dark:border-rose-800/50 dark:bg-rose-950/35',
    dotColorClass: 'bg-rose-500',
  },
  Информатика: {
    pillClass:
      'border-indigo-200/80 bg-indigo-50 text-indigo-700 dark:border-indigo-800/70 dark:bg-indigo-950/60 dark:text-indigo-300',
    barGradientClass: 'from-indigo-500 to-cyan-500',
    topStripClass: 'from-indigo-400 via-cyan-400 to-[#C8F542]',
    softBoxClass:
      'border-indigo-200/60 bg-indigo-50/75 dark:border-indigo-800/50 dark:bg-indigo-950/35',
    dotColorClass: 'bg-indigo-500',
  },
};

export function getSubjectTheme(subject?: SubjectId): SubjectVisualTheme {
  if (subject && SUBJECT_THEMES[subject]) {
    return SUBJECT_THEMES[subject];
  }
  return DEFAULT_SUBJECT_THEME;
}

export interface HeroGoalPreset {
  id: string;
  label: LocalizedText;
  subject: SubjectId;
  badge: string;
}

export const HERO_GOAL_PRESETS: HeroGoalPreset[] = [
  {
    id: 'dim600',
    label: {
      ru: 'DİM 600+ баллов',
      az: 'DİM 600+ bal',
      en: 'DİM 600+ Score',
    },
    subject: 'Математика',
    badge: '686/700',
  },
  {
    id: 'zero2mo',
    label: {
      ru: 'База с нуля за 2 мес.',
      az: 'Zəif bazanı 2 ayda',
      en: 'Weak base in 2 mo',
    },
    subject: 'Химия',
    badge: '+140',
  },
  {
    id: 'olymp',
    label: {
      ru: 'Олимпиада & IT',
      az: 'Olimpiada & IT',
      en: 'Olympiad & CS',
    },
    subject: 'Информатика',
    badge: 'BHOS',
  },
  {
    id: 'ielts',
    label: {
      ru: 'IELTS 7.5+ / ADA',
      az: 'IELTS 7.5+ / ADA',
      en: 'IELTS 7.5+ / ADA',
    },
    subject: 'Английский язык',
    badge: '8.5',
  },
];

export interface CompareCopy {
  vsButtonShort: string;
  vsButtonActive: string;
  vsHeroBtn: string;
  dockTitle: string;
  dockSub: string;
  dockCompareNow: string;
  dockClear: string;
  modalTitle: string;
  modalSubtitle: string;
  pickLeftLabel: string;
  pickRightLabel: string;
  scoreRowLabel: string;
  superpowerRowLabel: string;
  resultsRowLabel: string;
  trajectoryRowLabel: string;
  priceRowLabel: string;
  formatLangRowLabel: string;
  winnerBadge: string;
  bookTrialBtn: string;
  openDossierBtn: string;
}

export const COMPARE_COPY: Record<Locale, CompareCopy> = {
  ru: {
    vsButtonShort: 'Сравнить',
    vsButtonActive: 'В сравнении',
    vsHeroBtn: 'Сравнить менторов (VS)',
    dockTitle: 'Сравнение преподавателей (VS)',
    dockSub: 'Нажмите, чтобы сравнить баллы DİM, результаты учеников и методику бок о бок',
    dockCompareNow: 'Сравнить 1-на-1 (VS)',
    dockClear: 'Сбросить',
    modalTitle: 'Сравнение досье: 1-на-1 (VS)',
    modalSubtitle: 'Объективное сравнение баллов поступления, роста учеников и методики',
    pickLeftLabel: 'Ментор А',
    pickRightLabel: 'Ментор Б',
    scoreRowLabel: 'Вуз и балл поступления DİM',
    superpowerRowLabel: 'Ключевое отличие',
    resultsRowLabel: 'Доказанные результаты учеников',
    trajectoryRowLabel: 'Динамика роста баллов',
    priceRowLabel: 'Стоимость и совпадение',
    formatLangRowLabel: 'Формат и языки',
    winnerBadge: 'Лидер по баллу',
    bookTrialBtn: 'Пробный урок — 0 ₼',
    openDossierBtn: 'Полное досье',
  },
  az: {
    vsButtonShort: 'Müqayisə et',
    vsButtonActive: 'Müqayisədə',
    vsHeroBtn: 'Müəllimləri müqayisə et (VS)',
    dockTitle: 'Müəllim müqayisəsi (VS)',
    dockSub: 'Qəbul ballarını, şagird nəticələrini və güclü tərəfləri yan-yana müqayisə edin',
    dockCompareNow: 'Yan-yana müqayisə (VS)',
    dockClear: 'Təmizlə',
    modalTitle: 'Dosye müqayisəsi: 1-ə-1 (VS)',
    modalSubtitle: 'Qəbul balı, şagird artımı və metodikanın aydın müqayisəsi',
    pickLeftLabel: 'Müəllim A',
    pickRightLabel: 'Müəllim B',
    scoreRowLabel: 'Universitet və DİM qəbul balı',
    superpowerRowLabel: 'Əsas fərq və metodika',
    resultsRowLabel: 'Təsdiqlənmiş şagird uğurları',
    trajectoryRowLabel: 'Bal artımı dinamikası',
    priceRowLabel: 'Qiymət və uyğunluq',
    formatLangRowLabel: 'Format və dillər',
    winnerBadge: 'Yüksək bal',
    bookTrialBtn: 'Pulsuz sınaq — 0 ₼',
    openDossierBtn: 'Tam dosye',
  },
  en: {
    vsButtonShort: 'Compare',
    vsButtonActive: 'Comparing',
    vsHeroBtn: 'Compare Mentors (VS)',
    dockTitle: 'Mentor Comparison (VS)',
    dockSub: 'Compare DİM admission scores, student outcomes & methodology side by side',
    dockCompareNow: 'Compare 1-on-1 (VS)',
    dockClear: 'Clear',
    modalTitle: 'Head-to-Head Dossier Compare (VS)',
    modalSubtitle: 'Side-by-side comparison of entrance scores, student gains & methodology',
    pickLeftLabel: 'Mentor A',
    pickRightLabel: 'Mentor B',
    scoreRowLabel: 'University & DİM Entrance Score',
    superpowerRowLabel: 'Key Differentiator',
    resultsRowLabel: 'Verified Student Outcomes',
    trajectoryRowLabel: 'Score Growth Trajectory',
    priceRowLabel: 'Lesson Rate & Fit Score',
    formatLangRowLabel: 'Format & Languages',
    winnerBadge: 'Top Score',
    bookTrialBtn: 'Free Trial — 0 ₼',
    openDossierBtn: 'Full Dossier',
  },
};

export interface SmartMatchTag {
  text: string;
  toneClass: string;
}

export function getSmartMatchTag(
  tutor: TutorProfile,
  locale: Locale,
  matchScore: number,
  index = 0,
): SmartMatchTag {
  const visual = getTutorVisual(tutor.id, index);
  const score = tutor.education.admissionScore;
  const max = tutor.education.maxScore;

  if (score >= 685) {
    return {
      text:
        locale === 'az'
          ? `DİM Lideri · ${score}/${max}`
          : locale === 'en'
            ? `DİM Leader · ${score}/${max}`
            : `Лидер DİM · ${score}/${max}`,
      toneClass:
        'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300',
    };
  }

  if (visual.trajectory.delta.includes('15') || visual.trajectory.delta.includes('16')) {
    return {
      text:
        locale === 'az'
          ? `Sürətli artım · ${visual.trajectory.delta}`
          : locale === 'en'
            ? `Top gain · ${visual.trajectory.delta}`
            : `Макс. рост · ${visual.trajectory.delta}`,
      toneClass:
        'border-sky-200/80 bg-sky-50/90 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-300',
    };
  }

  return {
    text:
      locale === 'az'
        ? `Ağıllı seçim · ${matchScore}%`
        : locale === 'en'
          ? `Smart match · ${matchScore}%`
          : `Умный подбор · ${matchScore}%`,
    toneClass:
      'border-violet-200/80 bg-violet-50/90 text-violet-700 dark:border-violet-800/70 dark:bg-violet-950/60 dark:text-violet-300',
  };
}
