import type { Locale } from '@/types/edumatch';

export interface WowLocaleBundle {
  hero: {
    subjectQuickLabel: string;
    sectorQuickLabel: string;
    formatQuickLabel: string;
    allSubjects: string;
    allFormats: string;
    liveOnlineLabel: string;
    verifiedTag: string;
    entranceScoreShort: string;
    studentResultsLabel: string;
    topShowcaseBadge: string;
    openDossierBtn: string;
    nextMentorBtn: string;
    prevMentorBtn: string;
    whyDiffersKicker: string;
  };
  marquee: Array<{ code: string; title: string; metric: string }>;
  bento: {
    scanBadge: string;
    scanTitle: string;
    scanSub: string;
    scanStatus: string;
    growthBadge: string;
    growthTitle: string;
    growthSub: string;
    growthDelta: string;
    matchBadge: string;
    matchTitle: string;
    matchSub: string;
    matchLatency: string;
  };
  card: {
    entranceRingLabel: string;
    provenResultsLabel: string;
    methodLabel: string;
    latestReviewLabel: string;
    matchPercentSuffix: string;
    onlineNow: string;
  };
  inbox: {
    kpiNewLabel: string;
    kpiAcceptedLabel: string;
    kpiPriorityLabel: string;
    kpiPrioritySub: string;
  };
}

export const WOW_COPY: Record<Locale, WowLocaleBundle> = {
  az: {
    hero: {
      subjectQuickLabel: 'Fənn seçin',
      sectorQuickLabel: 'Bölmə',
      formatQuickLabel: 'Format',
      allSubjects: 'Hamısı',
      allFormats: 'İstənilən',
      liveOnlineLabel: 'Canlı qəbul mövsümü · Bakı / Onlayn',
      verifiedTag: 'Təsdiqlənmiş mentor',
      entranceScoreShort: 'Qəbul balı',
      studentResultsLabel: 'Tələbə nəticələri',
      topShowcaseBadge: 'Top Mentor Vitrini',
      openDossierBtn: 'Tam dosyeyə bax',
      nextMentorBtn: 'Növbəti müəllim',
      prevMentorBtn: 'Əvvəlki müəllim',
      whyDiffersKicker: 'EduMatch Fərqi',
    },
    marquee: [
      { code: 'ADA', title: 'ADA Universiteti', metric: '685+ bal mentorlar' },
      { code: 'BHOS', title: 'BANM / BHOS', metric: '692 / 700 rekord' },
      { code: 'BDU', title: 'Bakı Dövlət', metric: '686+ bal · Fizika' },
      { code: 'IELTS', title: 'British Council', metric: 'IELTS 8.5 Academic' },
      { code: 'DİM', title: 'I–IV Qrup DİM', metric: '94% hədəfə qəbul' },
      { code: 'ATU', title: 'Azərbaycan Tibb', metric: '675+ bal · Kimya' },
      { code: 'UNEC', title: 'İqtisad Universiteti', metric: '15+ tələbə 600+' },
      { code: 'OLİMP', title: 'Respublika Olimpiadası', metric: 'Qızıl & Gümüş medal' },
    ],
    bento: {
      scanBadge: 'DİM & Diplom Auditi',
      scanTitle: 'Real qəbul balı və universitet təsdiqi',
      scanSub: 'Adi elanlardan fərqli olaraq hər müəllimin universiteti, DİM balı (700-dən) və diplomu yoxlanılır.',
      scanStatus: 'Təsdiqləndi · 100% Orijinal',
      growthBadge: 'Ölçülən İnkişaf',
      growthTitle: 'Şagirdlərin real bal artımı dinamikası',
      growthSub: 'Orta hesabla 4 ayda DİM sınaq nəticələrində +158 bal yüksəliş və olimpiada hazırlığı.',
      growthDelta: '420 → 648 bal',
      matchBadge: 'AI Diaqnostika & Radar',
      matchTitle: 'Səviyyəyə və məsafəyə görə ağıllı seçim',
      matchSub: '3 dəqiqəlik AI test səviyyəni ölçür, geo-radar isə 1–5 km radiusda uyğun müəllimi tapır.',
      matchLatency: '96% Uyğunluq',
    },
    card: {
      entranceRingLabel: 'DİM / Qəbul balı',
      provenResultsLabel: 'Şagird uğurları',
      methodLabel: 'Fərqləndirici metodika',
      latestReviewLabel: 'Son tələbə rəyi',
      matchPercentSuffix: 'uyğun',
      onlineNow: 'Aktiv',
    },
    inbox: {
      kpiNewLabel: 'Yeni müraciətlər',
      kpiAcceptedLabel: 'Qəbul edilən dərslər',
      kpiPriorityLabel: 'Prioritet statusu',
      kpiPrioritySub: 'Top axtarış göstəricisi',
    },
  },
  ru: {
    hero: {
      subjectQuickLabel: 'Выберите предмет',
      sectorQuickLabel: 'Сектор',
      formatQuickLabel: 'Формат',
      allSubjects: 'Все',
      allFormats: 'Любой',
      liveOnlineLabel: 'Приём открыт · Баку / Онлайн',
      verifiedTag: 'Проверенный ментор',
      entranceScoreShort: 'Балл поступления',
      studentResultsLabel: 'Результаты учеников',
      topShowcaseBadge: 'Топ-ментор недели',
      openDossierBtn: 'Открыть досье',
      nextMentorBtn: 'Следующий преподаватель',
      prevMentorBtn: 'Предыдущий преподаватель',
      whyDiffersKicker: 'Почему EduMatch',
    },
    marquee: [
      { code: 'ADA', title: 'Университет ADA', metric: '685+ баллов' },
      { code: 'BHOS', title: 'БВШН / BHOS', metric: '692 / 700 рекорд' },
      { code: 'BDU', title: 'Бакинский Гос.', metric: '686+ баллов · Физика' },
      { code: 'IELTS', title: 'British Council', metric: 'IELTS 8.5 Academic' },
      { code: 'DİM', title: 'I–IV Группы DİM', metric: '94% поступление' },
      { code: 'АМУ', title: 'Медуниверситет', metric: '675+ баллов · Химия' },
      { code: 'UNEC', title: 'Экономический ун-т', metric: '15+ учеников 600+' },
      { code: 'ОЛИМП', title: 'Респ. олимпиада', metric: 'Призёры и медали' },
    ],
    bento: {
      scanBadge: 'Аудит DİM и дипломов',
      scanTitle: 'Реальный балл поступления и вуз',
      scanSub: 'В отличие от обычных объявлений, мы проверяем вуз, вступительный балл (из 700) и сертификаты каждого ментора.',
      scanStatus: 'Проверено · 100% Достоверно',
      growthBadge: 'Измеримый прогресс',
      growthTitle: 'Динамика роста баллов учеников',
      growthSub: 'Средний рост результатов пробников DİM за 4 месяца составляет +158 баллов и призовые места.',
      growthDelta: '420 → 648 баллов',
      matchBadge: 'AI-диагностика и радар',
      matchTitle: 'Точный подбор по уровню и локации',
      matchSub: '3-минутный AI-тест определяет уровень, а георадар находит преподавателя в радиусе 1–5 км или онлайн.',
      matchLatency: '96% Совпадение',
    },
    card: {
      entranceRingLabel: 'Балл поступления',
      provenResultsLabel: 'Успехи учеников',
      methodLabel: 'Сильная сторона',
      latestReviewLabel: 'Последний отзыв',
      matchPercentSuffix: 'матч',
      onlineNow: 'Онлайн',
    },
    inbox: {
      kpiNewLabel: 'Новые заявки',
      kpiAcceptedLabel: 'Принятые ученики',
      kpiPriorityLabel: 'Приоритет показа',
      kpiPrioritySub: 'Позиция в поиске',
    },
  },
  en: {
    hero: {
      subjectQuickLabel: 'Choose subject',
      sectorQuickLabel: 'Sector',
      formatQuickLabel: 'Format',
      allSubjects: 'All',
      allFormats: 'Any',
      liveOnlineLabel: 'Admissions season live · Baku / Online',
      verifiedTag: 'Verified Mentor',
      entranceScoreShort: 'Entrance score',
      studentResultsLabel: 'Student outcomes',
      topShowcaseBadge: 'Featured Mentor Deck',
      openDossierBtn: 'Open full dossier',
      nextMentorBtn: 'Next tutor',
      prevMentorBtn: 'Previous tutor',
      whyDiffersKicker: 'The EduMatch Edge',
    },
    marquee: [
      { code: 'ADA', title: 'ADA University', metric: '685+ score mentors' },
      { code: 'BHOS', title: 'BHOS / BANM', metric: '692 / 700 record' },
      { code: 'BDU', title: 'Baku State Univ.', metric: '686+ score · Physics' },
      { code: 'IELTS', title: 'British Council', metric: 'IELTS 8.5 Academic' },
      { code: 'DİM', title: 'DİM Groups I–IV', metric: '94% target hit' },
      { code: 'AMU', title: 'Medical University', metric: '675+ score · Chemistry' },
      { code: 'UNEC', title: 'State Economic Univ.', metric: '15+ students 600+' },
      { code: 'OLYMP', title: 'National Olympiad', metric: 'Gold & Silver winners' },
    ],
    bento: {
      scanBadge: 'DİM & Credential Audit',
      scanTitle: 'Verified entrance score & university',
      scanSub: 'Unlike generic classifieds, we verify every tutor’s university, DİM admission score (/700), and teaching diplomas.',
      scanStatus: 'Verified · 100% Authentic',
      growthBadge: 'Proven Score Gain',
      growthTitle: 'Tracked student mock-exam trajectory',
      growthSub: 'Average +158 pt gain on DİM practice exams within 4 months alongside national Olympiad prep.',
      growthDelta: '420 → 648 pts',
      matchBadge: 'AI Diagnostic & Radar',
      matchTitle: 'Precision matching by level & distance',
      matchSub: 'A 3-minute diagnostic test calibrates level while Geo-Radar pinpoints mentors within 1–5 km or online.',
      matchLatency: '96% Fit Score',
    },
    card: {
      entranceRingLabel: 'Admission score',
      provenResultsLabel: 'Student track record',
      methodLabel: 'Core differentiator',
      latestReviewLabel: 'Recent review',
      matchPercentSuffix: 'fit',
      onlineNow: 'Active',
    },
    inbox: {
      kpiNewLabel: 'Pending leads',
      kpiAcceptedLabel: 'Active bookings',
      kpiPriorityLabel: 'Visibility status',
      kpiPrioritySub: 'Search ranking boost',
    },
  },
};
