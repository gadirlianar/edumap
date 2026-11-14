import { REVIEW_TAGS } from '@/data/catalog';
import type { Locale, LocalizedText, TutorProfile, TutorReview } from '@/types/edumatch';

const TUTOR_NAME_BY_ID: Record<string, LocalizedText> = {
  t1: { ru: 'Лейла Мамедова', az: 'Leyla Məmmədova', en: 'Leyla Mammadova' },
  t4: { ru: 'Эльнур Гасанов', az: 'Elnur Həsənov', en: 'Elnur Hasanov' },
  t2: { ru: 'Рауф Алиев', az: 'Rauf Əliyev', en: 'Rauf Aliyev' },
  me: { ru: 'Тимур Рахимов', az: 'Timur Rəhimov', en: 'Timur Rahimov' },
  t3: { ru: 'Айгюн Гусейнова', az: 'Aygün Hüseynova', en: 'Aygun Huseynova' },
  t5: { ru: 'Нигяр Керимова', az: 'Nigar Kərimova', en: 'Nigar Karimova' },
  t6: { ru: 'Дамир Абдуллаев', az: 'Damir Abdullayev', en: 'Damir Abdullayev' },
  t7: { ru: 'Гюнель Расулова', az: 'Günel Rəsulova', en: 'Gunel Rasulova' },
  t8: { ru: 'Фарида Мамедли', az: 'Fəridə Məmmədli', en: 'Farida Mammadli' },
  t9: { ru: 'Кянан Кулиев', az: 'Kənan Quliyev', en: 'Kanan Guliyev' },
  t10: { ru: 'Сабина Гасанли', az: 'Səbinə Həsənli', en: 'Sabina Hasanli' },
  t11: { ru: 'Орхан Алиев', az: 'Orxan Əliyev', en: 'Orkhan Aliyev' },
};

const PERSON_NAME_MAP: Record<string, LocalizedText> = {
  'Лейла Мамедова': TUTOR_NAME_BY_ID.t1,
  'Эльнур Гасанов': TUTOR_NAME_BY_ID.t4,
  'Рауф Алиев': TUTOR_NAME_BY_ID.t2,
  'Тимур Рахимов': TUTOR_NAME_BY_ID.me,
  'Тимур Рахимов (демо)': TUTOR_NAME_BY_ID.me,
  'Айгюн Гусейнова': TUTOR_NAME_BY_ID.t3,
  'Нигяр Керимова': TUTOR_NAME_BY_ID.t5,
  'Дамир Абдуллаев': TUTOR_NAME_BY_ID.t6,
  'Дамир Абдуллаев (студент)': TUTOR_NAME_BY_ID.t6,
  'Гюнель Расулова': TUTOR_NAME_BY_ID.t7,
  'Фарида Мамедли': TUTOR_NAME_BY_ID.t8,
  'Кянан Кулиев': TUTOR_NAME_BY_ID.t9,
  'Сабина Гасанли': TUTOR_NAME_BY_ID.t10,
  'Орхан Алиев': TUTOR_NAME_BY_ID.t11,
  'Айсель М.': { ru: 'Айсель М.', az: 'Aysel M.', en: 'Aysel M.' },
  'Эмиль Р.': { ru: 'Эмиль Р.', az: 'Emil R.', en: 'Emil R.' },
  'Нармин К.': { ru: 'Нармин К.', az: 'Nərmin K.', en: 'Narmin K.' },
  'Орхан Т.': { ru: 'Орхан Т.', az: 'Orxan T.', en: 'Orkhan T.' },
  'Сабина Г.': { ru: 'Сабина Г.', az: 'Səbinə Q.', en: 'Sabina G.' },
  'Камилла А.': { ru: 'Камилла А.', az: 'Kamilla A.', en: 'Kamilla A.' },
  'Расим Д.': { ru: 'Расим Д.', az: 'Rasim D.', en: 'Rasim D.' },
  'Сабина Н.': { ru: 'Сабина Н.', az: 'Səbinə N.', en: 'Sabina N.' },
  'Лейла С.': { ru: 'Лейла С.', az: 'Leyla S.', en: 'Leyla S.' },
  'Эмиль А.': { ru: 'Эмиль А.', az: 'Emil A.', en: 'Emil A.' },
  'Гюльнар Р.': { ru: 'Гюльнар Р.', az: 'Gülnar R.', en: 'Gulnar R.' },
  'Кямал В.': { ru: 'Кямал В.', az: 'Kamal V.', en: 'Kamal V.' },
};

const REVIEW_BY_ID: Record<string, LocalizedText> = {
  'rev-t1-1': {
    ru: 'Сын поднял пробник DİM с 160 до 275 баллов за 4 месяца!',
    az: 'Oğlum 4 aya DİM sınaq balını 160-dan 275-ə qaldırdı!',
    en: 'My son raised his DİM mock score from 160 to 275 in 4 months!',
  },
  'rev-t4-1': {
    ru: 'Прошёл республиканский тур олимпиады и поступил в BHOS на грант.',
    az: 'Respublika olimpiadasının mərhələsini keçdim və BANM-a (BHOS) dövlət sifarişi ilə qəbul oldum.',
    en: 'Passed the national Olympiad stage and earned a full grant at BHOS.',
  },
  'rev-t2-1': {
    ru: 'Сдал IELTS на 7.5 с первой попытки, особенно помогли разборы Writing.',
    az: 'IELTS imtahanından ilk cəhddə 7.5 yığdım, xüsusilə Writing təhlilləri çox kömək etdi.',
    en: 'Scored IELTS 7.5 on my first attempt — the Writing breakdowns helped hugely.',
  },
  'rev-t7-1': {
    ru: 'Разобрали механику и задачи I группы за 2 месяца без зазубривания.',
    az: 'Mexanika və I qrup məsələlərini əzbərsiz 2 aya tam mənimsədik.',
    en: 'Mastered mechanics and Group I exam tasks in 2 months with logic.',
  },
  'rev-t8-1': {
    ru: 'Набрала 268/300 по математике на DİM, занятия проходили очень системно.',
    az: 'DİM riyaziyyatdan 268/300 bal topladım, dərslər çox sistemli keçdi.',
    en: 'Scored 268/300 in DİM Mathematics with a super structured monthly plan.',
  },
  'rev-t9-1': {
    ru: 'Объяснил всю электродинамику за 3 недели, сдал физику на 92/100.',
    az: 'Bütün elektrodinamikanı 3 həftəyə mənimsədik, fizikadan 92/100 yazdım.',
    en: 'Covered all of electrodynamics in 3 weeks and scored 92/100 in Physics.',
  },
  'rev-t10-1': {
    ru: 'Дочка в Гяндже за 4 месяца подняла английский с 40 до 88 баллов на выпускном.',
    az: 'Qızım Gəncədə 4 aya buraxılış ingilis dilini 40-dan 88 bala qaldırdı.',
    en: 'My daughter in Ganja raised her English final score from 40 to 88 in 4 months.',
  },
  'rev-t11-1': {
    ru: 'С нуля до 90 баллов по химии, поступил в АМУ с первой попытки!',
    az: 'Sıfırdan kimyadan 90 bala çatdım və ilk cəhddə ATU-ya qəbul oldum!',
    en: 'Went from zero to 90 in Chemistry and got into Medical University first try!',
  },
};

const MESSAGE_TEXT_MAP: Record<string, LocalizedText> = {
  'Здравствуйте! Хочу пробный урок по подготовке к DİM.': {
    ru: 'Здравствуйте! Хочу пробный урок по подготовке к DİM.',
    az: 'Salam! DİM hazırlığı üçün sınaq dərsi istəyirəm.',
    en: 'Hello! I would like a trial lesson for DİM prep.',
  },
  'Нужна помощь с матанализом перед сессией.': {
    ru: 'Нужна помощь с матанализом перед сессией.',
    az: 'Sessiya öncəsi riyazi analizlə bağlı köməyə ehtiyacım var.',
    en: 'I need help with calculus before my university finals.',
  },
  'Добрый день, хочу пробный урок.': {
    ru: 'Добрый день, хочу пробный урок.',
    az: 'Sabahınız xeyir, sınaq dərsi götürmək istəyirəm.',
    en: 'Good afternoon, I would like to book a trial lesson.',
  },
  'Здравствуйте! Давайте в четверг в 18:00.': {
    ru: 'Здравствуйте! Давайте в четверг в 18:00.',
    az: 'Salam! Cümə axşamı saat 18:00-da uyğundurmu?',
    en: 'Hello! Let’s schedule for Thursday at 18:00.',
  },
  'Здравствуйте! Подскажите по графику занятий.': {
    ru: 'Здравствуйте! Подскажите по графику занятий.',
    az: 'Salam! Dərs cədvəli haqqında məlumat verə bilərsinizmi?',
    en: 'Hello! Could you share your available lesson schedule?',
  },
};

export function resolveTutorName(
  tutorOrId: Pick<TutorProfile, 'id' | 'name'> | string,
  locale: Locale,
): string {
  if (typeof tutorOrId === 'string') {
    const byId = TUTOR_NAME_BY_ID[tutorOrId];
    if (byId) return byId[locale] ?? byId.ru;
    const byName = PERSON_NAME_MAP[tutorOrId];
    if (byName) return byName[locale] ?? byName.ru;
    return tutorOrId;
  }
  const byId = TUTOR_NAME_BY_ID[tutorOrId.id];
  // If user edited their tutor name in profile editor, preserve custom string in all locales
  if (
    tutorOrId.id === 'me' &&
    tutorOrId.name !== 'Тимур Рахимов' &&
    tutorOrId.name !== 'Тимур Рахимов (демо)'
  ) {
    return tutorOrId.name;
  }
  if (byId) return byId[locale] ?? byId.ru;
  const byName = PERSON_NAME_MAP[tutorOrId.name];
  if (byName) return byName[locale] ?? byName.ru;
  return tutorOrId.name;
}

export function resolvePersonName(name: string, locale: Locale): string {
  const mapped = PERSON_NAME_MAP[name];
  if (mapped) return mapped[locale] ?? mapped.ru;
  return name;
}

export function resolveReviewText(review: TutorReview, locale: Locale): string {
  const mapped = review.id ? REVIEW_BY_ID[review.id] : undefined;
  if (mapped) return mapped[locale] ?? mapped.ru;
  return review.text;
}

export function resolveReviewAuthor(author: string, locale: Locale): string {
  return resolvePersonName(author, locale);
}

export function resolveReviewTag(tag: string, locale: Locale): string {
  const match = REVIEW_TAGS.find(
    (entry) => entry.ru === tag || entry.az === tag || entry.en === tag,
  );
  return match ? match[locale] : tag;
}

export function resolveChatMessageText(text: string, locale: Locale): string {
  const mapped = MESSAGE_TEXT_MAP[text];
  if (mapped) return mapped[locale] ?? mapped.ru;
  return text;
}
