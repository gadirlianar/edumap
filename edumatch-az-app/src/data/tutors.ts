import type {
  AccountProfile,
  Locale,
  LocalizedText,
  StudentDirectoryItem,
  StudentRequest,
  TutorContent,
  TutorProfile,
} from '@/types/edumatch';
import { DEFAULT_DEMO_TEST } from './catalog';

export const INITIAL_ACCOUNT: AccountProfile = {
  name: 'Тимур Рахимов',
  email: '',
  premium: false,
  plan: '',
  promo: 0,
  authenticated: false,
};

export const INITIAL_TUTORS: TutorProfile[] = [
  {
    id: 't1',
    name: 'Лейла Мамедова',
    subj: ['Математика', 'Физика'],
    cats: ['9 класс', '10 класс', '11 класс'],
    levels: ['Начальный', 'Средний', 'Продвинутый'],
    lang: ['Азербайджанский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 25,
    rating: 4.9,
    n: 41,
    sty: ['Строгий', 'На примерах'],
    coords: [40.388, 49.815],
    certs: [
      {
        id: 'c-t1-1',
        name: {
          ru: 'Диплом БГУ (с отличием)',
          az: 'BDU diplomu (fərqlənmə ilə)',
          en: 'Baku State University Diploma (Honors)',
        },
        ok: true,
      },
      {
        id: 'c-t1-2',
        name: {
          ru: 'Сертификат DİM-подготовки',
          az: 'DİM hazırlığı sertifikatı',
          en: 'DİM Exam Prep Certificate',
        },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t1-1',
        stars: 5,
        text: 'Сын поднял пробник DİM с 160 до 275 баллов за 4 месяца!',
        author: 'Камилла А.',
        date: '2026-10',
      },
    ],
    bio: {
      ru: 'Подготовка к DİM и олимпиадам, системный разбор ошибок.',
      az: 'DİM və olimpiadalara hazırlıq, səhvlərin sistemli təhlili.',
      en: 'DİM & olympiad preparation with structured error analysis.',
    },
    education: {
      university: {
        ru: 'Бакинский государственный университет (БГУ)',
        az: 'Bakı Dövlət Universiteti (BDU)',
        en: 'Baku State University (BSU)',
      },
      universityShort: 'BDU',
      faculty: {
        ru: 'Механико-математический факультет · Прикладная математика',
        az: 'Mexanika-riyaziyyat fakültəsi · Tətbiqi riyaziyyat',
        en: 'Faculty of Mechanics & Mathematics · Applied Math',
      },
      degree: {
        ru: 'Магистр с отличием',
        az: 'Fərqlənmə magistr diplomu',
        en: 'M.Sc. with Honors',
      },
      admissionScore: 686,
      maxScore: 700,
      admissionYear: 2017,
      grantType: {
        ru: 'Госзаказ · Президентская стипендия',
        az: 'Dövlət sifarişi · Prezident təqaüdü',
        en: 'State Scholarship · Presidential Fellow',
      },
      extraExam: 'DİM Math 100/100',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t1-1',
        metric: '24',
        label: {
          ru: 'ученика 600+ баллов',
          az: 'şagird 600+ bal',
          en: 'students scored 600+',
        },
        detail: {
          ru: 'Поступили на бюджет в BDU, ADA и ADNSU за 2024–2026 гг.',
          az: '2024–2026-cı illərdə BDU, ADA və ADNSU-ya ödənişsiz qəbul oldular.',
          en: 'Admitted on state grants to BSU, ADA & ASOIU (2024–2026).',
        },
      },
      {
        id: 'a-t1-2',
        metric: '+158',
        label: {
          ru: 'средний прирост DİM',
          az: 'orta DİM artımı',
          en: 'avg DİM score gain',
        },
        detail: {
          ru: 'Средний рост по 41 ученику за 5 месяцев регулярных занятий.',
          az: '41 şagird üzrə 5 aylıq müntəzəm dərsdə orta artım.',
          en: 'Average gain across 41 students in 5 months.',
        },
      },
      {
        id: 'a-t1-3',
        metric: '96%',
        label: {
          ru: 'поступили в 1-й выбор',
          az: '1-ci seçiminə qəbul',
          en: '1st-choice admission',
        },
        detail: {
          ru: 'Сильная дисциплина и еженедельные мини-симуляции экзамена.',
          az: 'Güclü intizam və həftəlik mini-sınaq imtahanları.',
          en: 'Strong structure with weekly mini mock exams.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Разбирает каждую тему через авторскую «карту ловушек DİM» — ученики видят подвохи составителей за 10 секунд вместо зубрёжки.',
        az: 'Hər mövzunu müəllif «DİM tələləri xəritəsi» ilə izah edir — şagirdlər əzbərləmədən 10 saniyəyə hiyləni görür.',
        en: 'Teaches via an original “DİM Trap Map” — students spot exam tricks in 10 seconds instead of rote memorizing.',
      },
      points: [
        {
          ru: 'Трекер пробелов и отчёт родителям каждую пятницу',
          az: 'Boşluq izləyicisi və hər cümə valideynə hesabat',
          en: 'Gap tracker & weekly Friday parent progress digest',
        },
        {
          ru: 'Личный банк 1200+ разобранных задач I и IV групп',
          az: 'I və IV qrup üzrə 1200+ həll olunmuş məsələ bankı',
          en: 'Curated bank of 1,200+ Group I & IV solved problems',
        },
        {
          ru: 'Экспресс-тайминг: сокращает время на блок задач вдвое',
          az: 'Sürətli tayming: məsələ blokuna vaxtı 2 dəfə azaldır',
          en: 'Speed-solving drills that cut problem-block time in half',
        },
      ],
      bestFor: {
        ru: 'Абитуриентов 9–11 классов, нацеленных на 600+ баллов и топ-вузы.',
        az: '600+ bal və top universitetlər hədəfləyən 9–11-ci sinif şagirdləri üçün.',
        en: 'Grade 9–11 applicants targeting 600+ scores and top universities.',
      },
    },
  },
  {
    id: 't4',
    name: 'Эльнур Гасанов',
    subj: ['Информатика', 'Математика'],
    cats: ['10 класс', '11 класс', '1 курс', '2–4 курс'],
    levels: ['Средний', 'Продвинутый'],
    lang: ['Русский', 'Английский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 35,
    rating: 4.8,
    n: 27,
    sty: ['Мотивирует', 'С юмором'],
    coords: [40.38, 49.88],
    certs: [
      {
        id: 'c-t4-1',
        name: {
          ru: 'Сертификат Google IT & Algorithms',
          az: 'Google IT & Alqoritmlər sertifikatı',
          en: 'Google IT & Algorithms Certificate',
        },
        ok: true,
      },
      {
        id: 'c-t4-2',
        name: {
          ru: 'Диплом БВШН (BHOS)',
          az: 'BANM (BHOS) diplomu',
          en: 'BHOS Honors Diploma',
        },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t4-1',
        stars: 5,
        text: 'Прошёл республиканский тур олимпиады и поступил в BHOS на грант.',
        author: 'Расим Д.',
        date: '2026-09',
      },
    ],
    bio: {
      ru: 'Программирование, алгоритмы и олимпиадная информатика.',
      az: 'Proqramlaşdırma, alqoritmlər və olimpiada informatikası.',
      en: 'Programming, algorithms & competitive informatics.',
    },
    education: {
      university: {
        ru: 'Бакинская высшая школа нефти (БВШН / BHOS)',
        az: 'Bakı Ali Neft Məktəbi (BANM / BHOS)',
        en: 'Baku Higher Oil School (BHOS)',
      },
      universityShort: 'BHOS',
      faculty: {
        ru: 'Информационная безопасность и Computer Science',
        az: 'İnformasiya təhlükəsizliyi və Kompüter elmləri',
        en: 'Information Security & Computer Science',
      },
      degree: {
        ru: 'Бакалавр (1-е место потока)',
        az: 'Bakalavr (kurs birincisi)',
        en: 'B.Sc. (Valedictorian)',
      },
      admissionScore: 692,
      maxScore: 700,
      admissionYear: 2019,
      grantType: {
        ru: 'Президентский стипендиат · Полный грант SOCAR',
        az: 'Prezident təqaüdçüsü · Tam SOCAR qrantı',
        en: 'Presidential Scholar · Full SOCAR Grant',
      },
      extraExam: 'ICPC Regional Finalist',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t4-1',
        metric: '14',
        label: {
          ru: 'призёров олимпиад RFO',
          az: 'RFO olimpiada mükafatçısı',
          en: 'RFO Olympiad medalists',
        },
        detail: {
          ru: 'Медали по информатике и математике на республиканских турах.',
          az: 'Respublika turlarında informatika və riyaziyyat üzrə medallar.',
          en: 'National medals in competitive programming & math.',
        },
      },
      {
        id: 'a-t4-2',
        metric: '100%',
        label: {
          ru: 'поступление на IT-грант',
          az: 'IT qrantına qəbul',
          en: 'IT grant admission',
        },
        detail: {
          ru: 'Выпускники учатся в BHOS, ADA, TU Munich и EPFL.',
          az: 'Məzunlar BANM, ADA, TU Munich və EPFL-də təhsil alır.',
          en: 'Alumni studying at BHOS, ADA, TU Munich & EPFL.',
        },
      },
      {
        id: 'a-t4-3',
        metric: '3',
        label: {
          ru: 'реальных проекта в GitHub',
          az: 'real GitHub layihəsi',
          en: 'real GitHub projects',
        },
        detail: {
          ru: 'Каждый ученик собирает портфолио к концу курса.',
          az: 'Hər tələbə kurs sonunda portfel layihələri toplayır.',
          en: 'Every student ships portfolio-grade software.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Преподаёт на живом коде и визуальных графах алгоритмов без скучных слайдов — учит думать как инженер-олимпиадник.',
        az: 'Darlıxdırıcı slaydlar əvəzinə canlı kod və vizual qraflarla öyrədir — olimpiada mühəndisi kimi düşünməyi formalaşdırır.',
        en: 'Teaches with live coding & algorithm visualizers instead of static slides — builds an Olympiad engineer mindset.',
      },
      points: [
        {
          ru: 'Интерактивный код-ревью после каждого домашнего задания',
          az: 'Hər ev tapşırığından sonra interaktiv kod-revyu',
          en: 'Line-by-line code review on every homework assignment',
        },
        {
          ru: 'Связка школьной математики с Python / C++ и логикой DİM',
          az: 'Məktəb riyaziyyatını Python / C++ və DİM məntiqi ilə bağlayır',
          en: 'Bridges high-school math with Python / C++ & exam logic',
        },
        {
          ru: 'Разбор собеседований на стажировки для 1–4 курсов',
          az: '1–4-cü kurslar üçün təcrübə proqramı müsahibə hazırlığı',
          en: 'Technical internship interview prep for university students',
        },
      ],
      bestFor: {
        ru: 'Будущих программистов, олимпиадников и студентов технических вузов.',
        az: 'Gələcək proqramçılar, olimpiadaçılar və texniki ali məktəb tələbələri üçün.',
        en: 'Aspiring software engineers, olympiad competitors & CS undergrads.',
      },
    },
  },
  {
    id: 't2',
    name: 'Рауф Алиев',
    subj: ['Английский язык'],
    cats: ['5–8 класс', '9 класс', '10 класс', '11 класс', '1 курс'],
    levels: ['Средний', 'Продвинутый'],
    lang: ['Английский', 'Русский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 30,
    rating: 4.7,
    n: 35,
    sty: ['С юмором', 'Мотивирует'],
    coords: [40.425, 49.87],
    certs: [
      {
        id: 'c-t2-1',
        name: { ru: 'IELTS 8.5 Academic', az: 'IELTS 8.5 Academic', en: 'IELTS 8.5 Academic' },
        ok: true,
      },
      {
        id: 'c-t2-2',
        name: { ru: 'Cambridge CELTA', az: 'Cambridge CELTA', en: 'Cambridge CELTA' },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t2-1',
        stars: 5,
        text: 'Сдал IELTS на 7.5 с первой попытки, особенно помогли разборы Writing.',
        author: 'Сабина Н.',
        date: '2026-10',
      },
    ],
    bio: {
      ru: 'IELTS, Academic Writing и уверенная разговорная практика.',
      az: 'IELTS, Akademik Yazı və sərbəst danışıq praktikası.',
      en: 'IELTS prep, Academic Writing & confident speaking fluency.',
    },
    education: {
      university: {
        ru: 'Университет ADA (ADA University)',
        az: 'ADA Universiteti',
        en: 'ADA University',
      },
      universityShort: 'ADA',
      faculty: {
        ru: 'Международные отношения (полностью на английском)',
        az: 'Beynəlxalq münasibətlər (tam ingilis dilində)',
        en: 'International Studies (English-taught)',
      },
      degree: {
        ru: 'Бакалавр · Dean’s List',
        az: 'Bakalavr · Dekan Siyahısı',
        en: 'B.A. · Dean’s List Honors',
      },
      admissionScore: 668,
      maxScore: 700,
      admissionYear: 2018,
      grantType: {
        ru: '100% стипендия ADA (Top 5% потока)',
        az: '100% ADA təqaüdü (kursun Top 5%-i)',
        en: '100% ADA Merit Scholarship (Top 5%)',
      },
      extraExam: 'IELTS 8.5 · SAT 1490',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t2-1',
        metric: '31',
        label: {
          ru: 'ученик с IELTS 7.0–8.5',
          az: 'şagird IELTS 7.0–8.5',
          en: 'students hit IELTS 7.0–8.5',
        },
        detail: {
          ru: 'Официально подтверждённые сертификаты за последние 3 года.',
          az: 'Son 3 ildə rəsmi təsdiqlənmiş imtahan nəticələri.',
          en: 'Verified official test scorecards over the past 3 years.',
        },
      },
      {
        id: 'a-t2-2',
        metric: '+2.0',
        label: {
          ru: 'рост IELTS Band Score',
          az: 'IELTS bal artımı',
          en: 'avg Band Score jump',
        },
        detail: {
          ru: 'Средний прогресс за 12 недель интенсива (с 5.5 до 7.5).',
          az: '12 həftəlik intensivdə orta irəliləyiş (5.5-dən 7.5-ə).',
          en: 'Average 12-week jump from Band 5.5 to 7.5.',
        },
      },
      {
        id: 'a-t2-3',
        metric: '80%',
        label: {
          ru: 'живой речи на уроке',
          az: 'dərsdə canlı danışıq',
          en: 'active speaking time',
        },
        detail: {
          ru: 'Формат дебатов и ролевых кейсов с разбором акцента.',
          az: 'Debatlar və tələffüz təhlili ilə canlı dialoqlar.',
          en: 'Debates and case-study speaking with pronunciation feedback.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Снимает языковой барьер за 3 недели и оценивает эссе по реальным критериям экзаменаторов Cambridge/IELTS.',
        az: '3 həftəyə danışıq baryerini aradan qaldırır və esseləri əsl Cambridge/IELTS meyarları ilə yoxlayır.',
        en: 'Breaks speaking anxiety in 3 weeks and grades essays strictly on official Cambridge/IELTS rubrics.',
      },
      points: [
        {
          ru: 'Аудио-разбор вашей речи после каждого урока',
          az: 'Hər dərsdən sonra danışığınızın audio təhlili',
          en: 'Personalized voice-note feedback after every speaking session',
        },
        {
          ru: 'Живые шаблоны Linking Words для Writing Task 2',
          az: 'Writing Task 2 üçün təbii akademik ifadə bazası',
          en: 'Natural Band 8+ lexical templates for Writing Task 2',
        },
        {
          ru: 'Опыт обучения и стажировки в англоязычной среде ADA',
          az: 'ADA-nın tam ingilisdilli akademik mühit təcrübəsi',
          en: 'Grounded in ADA University’s English-medium academic rigor',
        },
      ],
      bestFor: {
        ru: 'Школьников и студентов, готовящихся к IELTS, SAT и поступлению за рубеж / в ADA.',
        az: 'IELTS, SAT və ADA / xarici universitetlərə hazırlaşanlar üçün.',
        en: 'Students preparing for IELTS, SAT, ADA or international admissions.',
      },
    },
  },
  {
    id: 'me',
    name: 'Тимур Рахимов',
    subj: ['Математика'],
    cats: ['9 класс', '10 класс', '11 класс'],
    levels: ['Средний', 'Продвинутый'],
    lang: ['Азербайджанский', 'Русский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 20,
    rating: 4.8,
    n: 23,
    sty: ['На примерах', 'Спокойный'],
    coords: [40.409, 49.867],
    certs: [
      {
        id: 'c-me-1',
        name: {
          ru: 'Диплом по математике, АГУНП / БГУ',
          az: 'Riyaziyyat üzrə diplom, ADNSU / BDU',
          en: 'Mathematics Diploma, ASOIU / BSU',
        },
        ok: true,
      },
    ],
    rev: [],
    bio: {
      ru: 'Готовлю к экзаменам DİM, 6 лет опыта.',
      az: 'DİM imtahanlarına hazırlıq, 6 il təcrübə.',
      en: 'Preparing students for DİM exams, 6 years experience.',
    },
    education: {
      university: {
        ru: 'Азербайджанский государственный университет нефти и промышленности (АГУНП)',
        az: 'Azərbaycan Dövlət Neft və Sənaye Universiteti (ADNSU)',
        en: 'Azerbaijan State Oil and Industry University (ASOIU)',
      },
      universityShort: 'ADNSU',
      faculty: {
        ru: 'Информационные технологии и прикладная математика',
        az: 'İnformasiya texnologiyaları və tətbiqi riyaziyyat',
        en: 'Information Technology & Applied Mathematics',
      },
      degree: {
        ru: 'Магистр прикладной математики',
        az: 'Tətbiqi riyaziyyat üzrə magistr',
        en: 'M.Sc. in Applied Mathematics',
      },
      admissionScore: 648,
      maxScore: 700,
      admissionYear: 2019,
      grantType: {
        ru: 'Госзаказ (бесплатное обучение)',
        az: 'Dövlət sifarişi (ödənişsiz təhsil)',
        en: 'State-Funded Scholarship',
      },
      extraExam: 'Магистратура 94/100',
      verified: true,
    },
    achievements: [
      {
        id: 'a-me-1',
        metric: '+135',
        label: {
          ru: 'средний рост баллов',
          az: 'orta bal artımı',
          en: 'avg score improvement',
        },
        detail: {
          ru: 'За первые 4 месяца систематической подготовки по программе DİM.',
          az: 'DİM proqramı üzrə ilk 4 ayda sistemli hazırlıq nəticəsi.',
          en: 'Within the first 4 months of structured DİM coaching.',
        },
      },
      {
        id: 'a-me-2',
        metric: '89%',
        label: {
          ru: 'сдали выше цели',
          az: 'hədəfdən yüksək nəticə',
          en: 'exceeded target score',
        },
        detail: {
          ru: 'По итогам выпускников 2024–2026 учебного года.',
          az: '2024–2026-cı tədris ilinin məzunlarının nəticələrinə əsasən.',
          en: 'Based on 2024–2026 graduating cohorts.',
        },
      },
      {
        id: 'a-me-3',
        metric: '6 лет',
        label: {
          ru: 'практики в двух секторах',
          az: 'iki sektorda təcrübə',
          en: 'bilingual teaching',
        },
        detail: {
          ru: 'Свободно ведёт уроки на русском и азербайджанском языках.',
          az: 'Həm rus, həm Azərbaycan sektorunda sərbəst dərs keçir.',
          en: 'Fluent instruction across both Russian and Azerbaijani sectors.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Начинает с 15-минутной диагностики пробелов за 7–9 классы и строит пошаговый план без стресса и перегрузки.',
        az: '7–9-cu sinif boşluqlarının 15 dəqiqəlik diaqnostikasından başlayır və stressiz addım-addım plan qurur.',
        en: 'Starts with a 15-min foundational gap audit and builds a calm, step-by-step roadmap with zero overload.',
      },
      points: [
        {
          ru: 'Интерактивная доска Miro + конспект урока в PDF',
          az: 'İnteraktiv Miro lövhəsi + PDF dərs konspekti',
          en: 'Interactive Miro whiteboard + PDF lesson recap notes',
        },
        {
          ru: 'Двуязычная терминология (AZ и RU секторы)',
          az: 'İkidilli terminologiya (AZ və RU sektorları)',
          en: 'Seamless AZ & RU mathematical terminology bridging',
        },
        {
          ru: 'Видеоразборы сложных ДЗ прямо в личном кабинете',
          az: 'Çətin ev tapşırıqlarının kabinetdə video izahı',
          en: 'On-demand video walkthroughs for tough homework tasks',
        },
      ],
      bestFor: {
        ru: 'Учеников со средним уровнем, которым нужна уверенная система к 11 классу.',
        az: '11-ci sinfə qədər möhkəm sistem qurmaq istəyən orta səviyyəli şagirdlər üçün.',
        en: 'Intermediate students needing a calm, structured path to Grade 11 exams.',
      },
    },
  },
  {
    id: 't3',
    name: 'Айгюн Гусейнова',
    subj: ['Химия'],
    cats: ['9 класс', '10 класс', '11 класс'],
    levels: ['Начальный', 'Средний'],
    lang: ['Азербайджанский', 'Русский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 18,
    rating: 4.6,
    n: 19,
    sty: ['Спокойный', 'На примерах'],
    coords: [40.589, 49.669],
    certs: [
      {
        id: 'c-t3-1',
        name: {
          ru: 'Диплом БГУ, химический факультет',
          az: 'BDU diplomu, kimya fakültəsi',
          en: 'BSU Chemistry Faculty Diploma',
        },
        ok: true,
      },
    ],
    rev: [],
    bio: {
      ru: 'Объясняю сложную органику и неорганику простыми словами.',
      az: 'Mürəkkəb üzvi və qeyri-üzvi kimyanı sadə dillə izah edirəm.',
      en: 'Making organic and inorganic chemistry intuitive and simple.',
    },
    education: {
      university: {
        ru: 'Бакинский государственный университет (БГУ)',
        az: 'Bakı Dövlət Universiteti (BDU)',
        en: 'Baku State University (BSU)',
      },
      universityShort: 'BDU',
      faculty: {
        ru: 'Химический факультет · Химия и методика преподавания',
        az: 'Kimya fakültəsi · Kimya müəllimliyi',
        en: 'Faculty of Chemistry · Chemical Education',
      },
      degree: {
        ru: 'Магистр (красный диплом)',
        az: 'Fərqlənmə magistri',
        en: 'M.Sc. with Distinction',
      },
      admissionScore: 654,
      maxScore: 700,
      admissionYear: 2018,
      grantType: {
        ru: 'Госзаказ · IV группа',
        az: 'Dövlət sifarişi · IV qrup',
        en: 'State Grant · Group IV',
      },
      extraExam: 'MIQ 58/60',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t3-1',
        metric: '18',
        label: {
          ru: 'поступили в АМУ (ATU)',
          az: 'tələbə ATU-ya qəbul',
          en: 'admitted to AMU (Med)',
        },
        detail: {
          ru: 'Абитуриенты IV группы успешно поступили на лечебное дело и фармацию.',
          az: 'IV qrup abituriyentləri müalicə işi və əczaçılığa qəbul olublar.',
          en: 'Group IV applicants admitted into Medicine & Pharmacy.',
        },
      },
      {
        id: 'a-t3-2',
        metric: '+140',
        label: {
          ru: 'средний рост баллов',
          az: 'orta bal yüksəlişi',
          en: 'average score jump',
        },
        detail: {
          ru: 'От базового нуля в уравнениях до уверенного решения задач IV группы.',
          az: 'Tənliklərdə sıfırdan IV qrup məsələlərinin sərbəst həllinə.',
          en: 'From equation basics to confident Group IV stoichiometry.',
        },
      },
      {
        id: 'a-t3-3',
        metric: '50+',
        label: {
          ru: 'визуальных схем реакций',
          az: 'vizual reaksiya sxemi',
          en: 'visual reaction maps',
        },
        detail: {
          ru: 'Авторский мини-атлас по органике и ОВР выдаётся каждому ученику.',
          az: 'Hər şagirdə üzvi kimya və OVR üzrə müəllif mini-atlası verilir.',
          en: 'Every student receives a custom organic & redox reaction atlas.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Превращает длинные органические цепочки и ОВР в понятные цветные схемы — без хаотичного заучивания.',
        az: 'Uzun üzvi reaksiya zəncirlərini və OVR-i aydın rəngli sxemlərə çevirir — əzbərçiliksiz.',
        en: 'Turns long organic chains & redox equations into visual color maps — zero blind memorization.',
      },
      points: [
        {
          ru: 'Специализация на IV группе (медицина и биохимия)',
          az: 'IV qrup üzrə ixtisaslaşma (tibb və biokimya)',
          en: 'Specialized in Group IV (Medical University prep)',
        },
        {
          ru: 'Спокойный разбор ошибок с поддержкой и терпением',
          az: 'Səhvlərin sakit və səbirli izahı',
          en: 'Patient, confidence-building pace for beginners',
        },
        {
          ru: 'Офлайн-занятия в Сумгайыте и онлайн по всему Азербайджану',
          az: 'Sumqayıtda oflayn və bütün ölkə üzrə onlayn dərslər',
          en: 'In-person in Sumgait & online nationwide',
        },
      ],
      bestFor: {
        ru: 'Абитуриентов IV группы, которым важно с нуля полюбить и понять химию.',
        az: 'Kimyanı sıfırdan sevərək öyrənmək istəyən IV qrup abituriyentləri üçün.',
        en: 'Group IV students needing to master chemistry from scratch.',
      },
    },
  },
  {
    id: 't5',
    name: 'Нигяр Керимова',
    subj: ['Азербайджанский язык'],
    cats: ['1–4 класс', '5–8 класс', '9 класс'],
    levels: ['Начальный', 'Средний'],
    lang: ['Азербайджанский'],
    fmt: ['Офлайн', 'Онлайн'],
    price: 12,
    rating: 4.5,
    n: 14,
    sty: ['Спокойный', 'Мотивирует'],
    coords: [40.683, 46.36],
    certs: [
      {
        id: 'c-t5-1',
        name: {
          ru: 'Диплом педагога-филолога, АГПУ',
          az: 'ADPU filologiya müəllimliyi diplomu',
          en: 'ADPU Philology & Pedagogy Diploma',
        },
        ok: true,
      },
    ],
    rev: [],
    bio: {
      ru: 'Грамотность, сочинения и уверенное чтение без стресса.',
      az: 'Stressiz savadlı yazı, inşa və ifadəli oxu.',
      en: 'Literacy, essay writing & confident reading without stress.',
    },
    education: {
      university: {
        ru: 'Азербайджанский государственный педагогический университет (АГПУ)',
        az: 'Azərbaycan Dövlət Pedaqoji Universiteti (ADPU)',
        en: 'Azerbaijan State Pedagogical University (ASPU)',
      },
      universityShort: 'ADPU',
      faculty: {
        ru: 'Филологический факультет · Азербайджанский язык и литература',
        az: 'Filologiya fakültəsi · Azərbaycan dili və ədəbiyyat',
        en: 'Faculty of Philology · Azerbaijani Language & Literature',
      },
      degree: {
        ru: 'Бакалавр (красный диплом)',
        az: 'Fərqlənmə bakalavr diplomu',
        en: 'B.A. with Distinction',
      },
      admissionScore: 612,
      maxScore: 700,
      admissionYear: 2016,
      grantType: {
        ru: 'Госзаказ',
        az: 'Dövlət sifarişi',
        en: 'State Scholarship',
      },
      extraExam: 'Sertifikasiya 59/60',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t5-1',
        metric: '36',
        label: {
          ru: 'учеников сдали 9 кл. на 80+',
          az: 'şagird 9-cu sinif buraxılışda 80+',
          en: 'scored 80+ on Grade 9 exam',
        },
        detail: {
          ru: 'Высокие баллы по грамматике и анализу текста в Гяндже и онлайн.',
          az: 'Gəncədə və onlayn dərslərdə mətn təhlili və qrammatikada yüksək nəticə.',
          en: 'Top scores in grammar & reading comprehension.',
        },
      },
      {
        id: 'a-t5-2',
        metric: '98%',
        label: {
          ru: 'точность диктантов',
          az: 'imla dəqiqliyi',
          en: 'orthography accuracy',
        },
        detail: {
          ru: 'Через игровые карточки и мягкую коррекцию без «красной пасты».',
          az: 'Oyun kartları və «qırmızı qələm» təzyiqi olmadan nəticə.',
          en: 'Achieved via visual flashcards and encouraging feedback.',
        },
      },
      {
        id: 'a-t5-3',
        metric: '8 лет',
        label: {
          ru: 'опыта с младшими классами',
          az: 'ibtidai və orta sinif təcrübəsi',
          en: 'years teaching youth',
        },
        detail: {
          ru: 'Умеет удерживать внимание даже самых непоседливых учеников.',
          az: 'Ən enerjili şagirdlərin belə diqqətini saxlayır.',
          en: 'Keeps even restless younger learners happily engaged.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Прививает любовь к языку без страха ошибок — использует живые рассказы, мини-игры и логику орфографии.',
        az: 'Səhv qorxusu olmadan dil sevgisi aşılayır — canlı hekayələr, mini-oyunlar və orfoqrafiya məntiqi ilə.',
        en: 'Builds love for the language without fear of mistakes — uses storytelling, mini-games & spelling logic.',
      },
      points: [
        {
          ru: 'Постановка грамотной речи для RU и AZ секторов',
          az: 'Həm AZ, həm də RU sektoru üçün səlis danışıq və yazı',
          en: 'Structured literacy for native & bilingual learners',
        },
        {
          ru: 'Подготовка к выпускным экзаменам 9 класса',
          az: '9-cu sinif buraxılış imtahanlarına tam hazırlıq',
          en: 'Complete Grade 9 graduation exam readiness',
        },
        {
          ru: 'Бережный контакт с детьми 1–8 классов',
          az: '1–8-ci sinif şagirdləri ilə isti və həvəsləndirici ünsiyyət',
          en: 'Warm, motivating rapport with Grades 1–8',
        },
      ],
      bestFor: {
        ru: 'Учеников 1–9 классов для уверенной грамотности, чтения и выпускного экзамена.',
        az: 'Savadlı yazı, oxu və 9-cu sinif buraxılış imtahanı üçün 1–9-cu siniflərə.',
        en: 'Grades 1–9 building rock-solid literacy and exam confidence.',
      },
    },
  },
  {
    id: 't6',
    name: 'Дамир Абдуллаев',
    subj: ['Математика'],
    cats: ['1–4 класс', '5–8 класс', '9 класс'],
    levels: ['Начальный', 'Средний'],
    lang: ['Русский'],
    fmt: ['Онлайн'],
    price: 10,
    rating: 4.4,
    n: 6,
    sty: ['С юмором', 'Спокойный'],
    coords: [40.418, 49.84],
    certs: [
      {
        id: 'c-t6-1',
        name: {
          ru: 'Справка о студенчестве, АГУНП (3 курс)',
          az: 'Tələbəlik arayışı, ADNSU (3-cü kurs)',
          en: 'Enrollment Verification, ASOIU (Year 3)',
        },
        ok: true,
      },
    ],
    rev: [],
    bio: {
      ru: 'Начинающий преподаватель, объясняю терпеливо и на языке ученика.',
      az: 'Gənc müəllim, səbirli və şagirdin başa düşəcəyi dildə izah edirəm.',
      en: 'Peer-style patient tutor explaining math clearly without pressure.',
    },
    education: {
      university: {
        ru: 'АГУНП (ADNSU) — 3 курс',
        az: 'ADNSU — 3-cü kurs',
        en: 'ASOIU — Year 3 Undergrad',
      },
      universityShort: 'ADNSU',
      faculty: {
        ru: 'Компьютерная инженерия',
        az: 'Kompüter mühəndisliyi',
        en: 'Computer Engineering',
      },
      degree: {
        ru: 'Студент 3-го курса (GPA 93/100)',
        az: '3-cü kurs tələbəsi (GPA 93/100)',
        en: '3rd-year Undergrad (GPA 93/100)',
      },
      admissionScore: 638,
      maxScore: 700,
      admissionYear: 2023,
      grantType: {
        ru: 'Госзаказ (бюджет)',
        az: 'Dövlət sifarişi (ödənişsiz)',
        en: 'State Scholarship',
      },
      extraExam: 'DİM Math 98/100',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t6-1',
        metric: '98/100',
        label: {
          ru: 'личный балл по математике',
          az: 'şəxsi riyaziyyat nəticəsi',
          en: 'personal DİM Math score',
        },
        detail: {
          ru: 'Сам недавно сдавал DİM и помнит каждую тонкость свежего формата.',
          az: 'Yaxınlarda DİM verdiyi üçün yeni formatın bütün detallarını bilir.',
          en: 'Recently aced DİM himself and knows the newest format.',
        },
      },
      {
        id: 'a-t6-2',
        metric: '11',
        label: {
          ru: 'школьников вышли на «5»',
          az: 'şagird «5» qiymətinə çıxdı',
          en: 'students reached A-grades',
        },
        detail: {
          ru: 'Помог ребятам 5–9 классов закрыть страх перед алгеброй и геометрией.',
          az: '5–9-cu sinif şagirdlərində cəbr və həndəsə qorxusunu aradan qaldırdı.',
          en: 'Helped Grades 5–9 overcome math anxiety and jump to top marks.',
        },
      },
      {
        id: 'a-t6-3',
        metric: '10 ₼',
        label: {
          ru: 'доступная ставка',
          az: 'əlçatan qiymət',
          en: 'accessible rate',
        },
        detail: {
          ru: 'Высокое качество базы по честной цене для регулярных занятий 2–3 раза в неделю.',
          az: 'Həftədə 2–3 dəfə müntəzəm dərs üçün münasib qiymət.',
          en: 'Affordable rate ideal for 2–3x weekly consistency.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Говорит с подростками на одном языке без строгого академического барьера — ученики не стесняются задавать «глупые» вопросы.',
        az: 'Yeniyetmələrlə rəsmi təzyiq olmadan onların dilində danışır — şagirdlər istənilən sualı verməyə çəkinmir.',
        en: 'Talks like a supportive older mentor with zero classroom intimidation — students never hesitate to ask questions.',
      },
      points: [
        {
          ru: 'Свежий опыт сдачи нового формата DİM (2023)',
          az: 'Yeni DİM formatının təzə imtahan təcrübəsi (2023)',
          en: 'Fresh first-hand experience with the latest DİM exam',
        },
        {
          ru: 'Быстрая помощь с текущей школьной программой и КСО/БСО',
          az: 'Məktəb proqramı və KSQ/BSQ-lərə operativ dəstək',
          en: 'Fast help with schoolwork and KSQ/BSQ assessments',
        },
        {
          ru: 'Дружелюбная атмосфера и юмор на сложных темах',
          az: 'Çətin mövzularda səmimi mühit və yumor',
          en: 'Upbeat, friendly vibe during tricky topics',
        },
      ],
      bestFor: {
        ru: 'Школьников 5–9 классов, которые хотят подтянуть оценки и понять базу без давления.',
        az: 'Təzyiqsiz əsasları anlayıb qiymətlərini qaldırmaq istəyən 5–9-cu siniflər üçün.',
        en: 'Grades 5–9 looking to boost school grades in a relaxed setting.',
      },
    },
  },
  {
    id: 't7',
    name: 'Гюнель Расулова',
    subj: ['Физика', 'Химия'],
    cats: ['9 класс', '10 класс', '11 класс', '1 курс'],
    levels: ['Средний', 'Продвинутый'],
    lang: ['Азербайджанский', 'Английский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 22,
    rating: 4.9,
    n: 34,
    sty: ['На примерах', 'Мотивирует'],
    coords: [40.398, 49.878],
    certs: [
      {
        id: 'c-t7-1',
        name: {
          ru: 'Диплом АГУНП (нефтегазовая инженерия)',
          az: 'ADNSU diplomu (neft-qaz mühəndisliyi)',
          en: 'ASOIU Honours Diploma (Engineering)',
        },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t7-1',
        stars: 5,
        text: 'Разобрали механику и задачи I группы за 2 месяца без зазубривания.',
        author: 'Расим Д.',
        date: '2026-10',
      },
    ],
    bio: {
      ru: 'Физика и химия через наглядные эксперименты и симуляции для I и IV групп DİM.',
      az: 'I və IV DİM qrupları üçün fizika və kimyanı vizual təcrübələrlə öyrədir.',
      en: 'Physics & chemistry via visual experiments and exam-style problem solving.',
    },
    education: {
      university: {
        ru: 'АГУНП / Французско-Азербайджанский ун-т (UFAZ)',
        az: 'ADNSU / Azərbaycan-Fransız Universiteti (UFAZ)',
        en: 'ASOIU / French-Azerbaijani Univ. (UFAZ)',
      },
      universityShort: 'UFAZ',
      faculty: {
        ru: 'Химическая и физическая инженерия',
        az: 'Kimya və fizika mühəndisliyi',
        en: 'Chemical & Physical Engineering',
      },
      degree: {
        ru: 'Двойной диплом (UFAZ & Страсбург)',
        az: 'İkili diplom (UFAZ & Strasburq)',
        en: 'Dual Degree (UFAZ & Strasbourg)',
      },
      admissionScore: 679,
      maxScore: 700,
      admissionYear: 2019,
      grantType: {
        ru: 'Полный госзаказ · UFAZ',
        az: 'Dövlət sifarişi · UFAZ təqaüdü',
        en: 'Full State Grant · UFAZ',
      },
      extraExam: 'DİM Physics 100/100',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t7-1',
        metric: '19',
        label: {
          ru: 'поступили в UFAZ и BANM',
          az: 'şagird UFAZ və BANM-a qəbul',
          en: 'admitted to UFAZ & BHOS',
        },
        detail: {
          ru: 'Ученики уверенно набирают 90%+ в блоках физики и химии I и IV групп.',
          az: 'Şagirdlər I və IV qrup fizika və kimya bloklarında 90%+ nəticə göstərir.',
          en: 'Students consistently score 90%+ in DİM Group I & IV physics/chem.',
        },
      },
      {
        id: 'a-t7-2',
        metric: '+148',
        label: {
          ru: 'средний рост балла DİM',
          az: 'orta DİM bal artımı',
          en: 'avg DİM score gain',
        },
        detail: {
          ru: 'От базовых формул к уверенному решению сложных комбинированных задач.',
          az: 'Əsas düsturlardan mürəkkəb qarışıq məsələlərin sərbəst həllinə.',
          en: 'Moves learners from basic formulas to multi-step problem mastery.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Связывает физику с химией через реальные лабораторные кейсы — формулы запоминаются логикой, а не зубрёжкой.',
        az: 'Fizika və kimyanı real laboratoriya nümunələri ilə izah edir — düsturlar əzbərsiz, məntiqlə qalır.',
        en: 'Connects physics & chemistry through real lab analogies so formulas stick logically.',
      },
      points: [
        {
          ru: 'Визуальный разбор задач механики, оптики и реакций',
          az: 'Mexanika, optika və reaksiyaların vizual sxemlə izahı',
          en: 'Visual mechanics, optics & reaction breakdowns',
        },
        {
          ru: 'Двуязычные конспекты (AZ / EN) для поступления в UFAZ',
          az: 'UFAZ imtahanına uyğun ikidilli (AZ / EN) konspektlər',
          en: 'Bilingual AZ/EN study notes tailored for UFAZ',
        },
      ],
      bestFor: {
        ru: 'Абитуриентов I и IV групп, нацеленных на технические вузы и UFAZ.',
        az: 'Texniki universitetlərə və UFAZ-a hazırlaşan I və IV qrup abituriyentləri üçün.',
        en: 'Group I & IV applicants targeting top engineering & UFAZ.',
      },
    },
  },
  {
    id: 't8',
    name: 'Фарида Мамедли',
    subj: ['Математика', 'Информатика'],
    cats: ['9 класс', '10 класс', '11 класс'],
    levels: ['Начальный', 'Средний', 'Продвинутый'],
    lang: ['Азербайджанский', 'Русский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 19,
    rating: 4.8,
    n: 29,
    sty: ['Строгий', 'На примерах'],
    coords: [40.578, 49.644],
    certs: [
      {
        id: 'c-t8-1',
        name: {
          ru: 'Диплом магистра с отличием, АГУНП',
          az: 'Fərqlənmə magistr diplomu, ADNSU',
          en: 'MSc Distinction Diploma, ASOIU',
        },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t8-1',
        stars: 5,
        text: 'Набрала 268/300 по математике на DİM, занятия проходили очень системно.',
        author: 'Лейла С.',
        date: '2026-10',
      },
    ],
    bio: {
      ru: 'Преподаю математику и информатику в Сумгайыте и онлайн. Чёткий план на каждый месяц до экзамена DİM.',
      az: 'Sumqayıtda və onlayn formatda riyaziyyat və informatika tədris edirəm. DİM imtahanına aylıq dəqiq proqram qururam.',
      en: 'Teaching Math & CS in Sumgayit and online with a structured monthly DİM roadmap.',
    },
    education: {
      university: {
        ru: 'Азербайджанский гос. ун-т нефти и промышленности (АГУНП)',
        az: 'Azərbaycan Dövlət Neft və Sənaye Universiteti (ADNSU)',
        en: 'Azerbaijan State Oil & Industry University (ASOIU)',
      },
      universityShort: 'ADNSU',
      faculty: {
        ru: 'Прикладная математика и компьютерное моделирование',
        az: 'Tətbiqi riyaziyyat və kompüter modelləşdirməsi',
        en: 'Applied Mathematics & Computer Modeling',
      },
      degree: {
        ru: 'Магистр с отличием · Преподаватель математики',
        az: 'Fərqlənmə magistrı · Riyaziyyat müəllimi',
        en: 'MSc Honors · Mathematics Mentor',
      },
      admissionScore: 672,
      maxScore: 700,
      admissionYear: 2019,
      grantType: {
        ru: 'Государственный заказ · Полный грант',
        az: 'Dövlət sifarişi · Tam təqaüd',
        en: 'State-Funded Full Scholarship',
      },
      extraExam: 'DİM Math 99/100',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t8-1',
        metric: '22',
        label: { ru: 'учеников 600+ баллов', az: 'şagird 600+ bal', en: 'students scored 600+' },
        detail: {
          ru: 'Поступили в ADA, BANM и ADNSU на бюджет.',
          az: 'ADA, BANM və ADNSU-ya dövlət sifarişi ilə daxil oldular.',
          en: 'Admitted tuition-free to ADA, BHOS & ASOIU.',
        },
      },
      {
        id: 'a-t8-2',
        metric: '+142',
        label: { ru: 'средний рост на пробниках', az: 'orta DİM sınaq artımı', en: 'avg practice exam gain' },
        detail: {
          ru: 'Еженедельные срез-тесты с разбором ошибок.',
          az: 'Həftəlik sınaq təhlili və səhv xəritəsi.',
          en: 'Weekly checkpoint tests with error diagnostics.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Каждую ошибку превращает в 5-минутный тренажёр, чтобы ученик не повторял её на реальном DİM.',
        az: 'Hər səhvi 5 dəqiqəlik məşq kartına çevirir — şagird real DİM-də eyni tələyə düşmür.',
        en: 'Turns every recurring mistake into a 5-minute drill so errors never repeat on DİM.',
      },
      points: [
        {
          ru: 'Индивидуальный трекер прогресса по 24 темам DİM',
          az: '24 DİM mövzusu üzrə fərdi inkişaf xəritəsi',
          en: 'Progress tracker across all 24 DİM syllabus topics',
        },
      ],
      bestFor: {
        ru: 'Учеников из Сумгайыта и онлайн, нацеленных на I и II группы.',
        az: 'Sumqayıtdan oflayn və ölkə üzrə onlayn I–II qrup abituriyentləri.',
        en: 'Sumgayit in-person and online Group I–II applicants.',
      },
    },
  },
  {
    id: 't9',
    name: 'Кянан Кулиев',
    subj: ['Физика', 'Математика'],
    cats: ['9 класс', '10 класс', '11 класс', '1 курс'],
    levels: ['Средний', 'Продвинутый'],
    lang: ['Азербайджанский', 'Английский'],
    fmt: ['Онлайн', 'Офлайн'],
    price: 24,
    rating: 4.9,
    n: 21,
    sty: ['Спокойный', 'На примерах'],
    coords: [40.596, 49.655],
    certs: [
      {
        id: 'c-t9-1',
        name: {
          ru: 'Сертификат инженера, БВШН / BHOS',
          az: 'Mühəndislik sertifikatı, BANM / BHOS',
          en: 'Process Engineering Certificate, BHOS',
        },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t9-1',
        stars: 5,
        text: 'Объяснил всю электродинамику за 3 недели, сдал физику на 92/100.',
        author: 'Эмиль А.',
        date: '2026-09',
      },
    ],
    bio: {
      ru: 'Выпускник BHOS с баллом 684. Готовлю к физике и математике в Сумгайыте и онлайн без сухой зубрёжки.',
      az: 'BANM (684 bal) məzunuyam. Sumqayıtda və onlayn fizika-riyaziyyatı məntiqi nümunələrlə öyrədirəm.',
      en: 'BHOS graduate (684/700) coaching Physics & Math in Sumgayit and online.',
    },
    education: {
      university: {
        ru: 'Бакинская высшая школа нефти (БВШН / BHOS)',
        az: 'Bakı Ali Neft Məktəbi (BANM / BHOS)',
        en: 'Baku Higher Oil School (BHOS)',
      },
      universityShort: 'BHOS',
      faculty: {
        ru: 'Инженерия процессов автоматизации',
        az: 'Proseslərin avtomatlaşdırılması mühəndisliyi',
        en: 'Process Automation Engineering',
      },
      degree: {
        ru: 'Бакалавр (английский сектор) · Президентский стипендиат',
        az: 'Bakalavr (ingilis sektoru) · Prezident təqaüdçüsü',
        en: 'BSc Honors (EN Track) · Presidential Scholar',
      },
      admissionScore: 684,
      maxScore: 700,
      admissionYear: 2018,
      grantType: {
        ru: 'Президентская стипендия · Госзаказ',
        az: 'Prezident təqaüdü · Dövlət sifarişi',
        en: 'Presidential Scholarship',
      },
      extraExam: 'DİM Physics 100/100',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t9-1',
        metric: '16',
        label: { ru: 'поступили в BHOS и UFAZ', az: 'şagird BANM və UFAZ-a qəbul', en: 'admitted to BHOS & UFAZ' },
        detail: {
          ru: 'Высокий результат по профильной физике I группы.',
          az: 'I qrup fizika fənni üzrə 90+ bal göstəricisi.',
          en: 'Consistent 90+ specialty Physics exam results.',
        },
      },
      {
        id: 'a-t9-2',
        metric: '97%',
        label: { ru: 'решение задач части C', az: 'açıq suallarda dəqiqlik', en: 'open-problem accuracy' },
        detail: {
          ru: 'Пошаговый алгоритм оформления развёрнутых задач.',
          az: 'Situasiya və açıq tapşırıqların sistemli həlli.',
          en: 'Structured step-by-step full-credit problem framing.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Показывает физический смысл каждой формулы через инженерные симуляции — задачи решаются в два раза быстрее.',
        az: 'Hər düsturun fiziki mənasını mühəndis modeli ilə göstərir — məsələlər 2 dəfə sürətli həll olunur.',
        en: 'Visualizes the engineering physics behind every formula so problems solve twice as fast.',
      },
      points: [
        {
          ru: 'Авторская методичка по 40 ключевым ситуациям DİM',
          az: '40 əsas DİM situasiya tapşırığı üzrə müəllif vəsaiti',
          en: 'Custom playbook covering 40 key DİM exam scenarios',
        },
      ],
      bestFor: {
        ru: 'Будущих инженеров I группы и поступающих в BHOS / UFAZ / ADA.',
        az: 'I qrup mühəndislik, BANM, UFAZ və ADA hədəfli abituriyentlər üçün.',
        en: 'Group I engineering & BHOS/UFAZ/ADA candidates.',
      },
    },
  },
  {
    id: 't10',
    name: 'Сабина Гасанли',
    subj: ['Английский язык', 'Азербайджанский язык'],
    cats: ['5–8 класс', '9 класс', '10 класс', '11 класс'],
    levels: ['Начальный', 'Средний', 'Продвинутый'],
    lang: ['Азербайджанский', 'Английский', 'Русский'],
    fmt: ['Офлайн', 'Онлайн'],
    price: 18,
    rating: 4.8,
    n: 33,
    sty: ['Спокойный', 'Мотивирует'],
    coords: [40.676, 46.348],
    certs: [
      {
        id: 'c-t10-1',
        name: {
          ru: 'TKT Cambridge · Преподавание английского',
          az: 'Cambridge TKT · İngilis dili tədrisi',
          en: 'Cambridge TKT Teaching Qualification',
        },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t10-1',
        stars: 5,
        text: 'Дочка в Гяндже за 4 месяца подняла английский с 40 до 88 баллов на выпускном.',
        author: 'Гюльнар Р.',
        date: '2026-10',
      },
    ],
    bio: {
      ru: 'Провожу занятия в центре Гянджи и онлайн. Готовлю к выпускным экзаменам DİM (9 и 11 кл.) и академическому английскому.',
      az: 'Gəncə mərkəzində və onlayn dərs keçirəm. 9–11-ci sinif DİM buraxılış və akademik ingilis dilinə hazırlaşdırıram.',
      en: 'In-person in Ganja center and online; coaching DİM finals & academic English.',
    },
    education: {
      university: {
        ru: 'Азербайджанский университет языков (АУЯ / ADU)',
        az: 'Azərbaycan Dillər Universiteti (ADU)',
        en: 'Azerbaijan University of Languages (AUL)',
      },
      universityShort: 'ADU',
      faculty: {
        ru: 'Филология и методика преподавания языков',
        az: 'Filologiya və dillərin tədrisi metodikası',
        en: 'Philology & Language Teaching Methodology',
      },
      degree: {
        ru: 'Магистр филологии · IELTS 8.0',
        az: 'Filologiya üzrə magistr · IELTS 8.0',
        en: 'MA Philology · IELTS 8.0',
      },
      admissionScore: 661,
      maxScore: 700,
      admissionYear: 2019,
      grantType: {
        ru: 'Государственный заказ · Отличница',
        az: 'Dövlət sifarişi · Fərqlənmə',
        en: 'State Scholarship · Honors',
      },
      extraExam: 'Cambridge TKT Band 4 · IELTS 8.0',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t10-1',
        metric: '42',
        label: { ru: 'учеников 85+ на DİM', az: 'şagird DİM-də 85+ bal', en: 'students scored 85+ on DİM' },
        detail: {
          ru: 'Высокие баллы по аудированию, чтению и эссе.',
          az: 'Dinləmə, oxuyub-anlama və esse üzrə sabit nəticələr.',
          en: 'Consistent scores in listening, reading & essay sections.',
        },
      },
      {
        id: 'a-t10-2',
        metric: '95%',
        label: { ru: 'точность грамматики', az: 'qrammatika dəqiqliyi', en: 'grammar test accuracy' },
        detail: {
          ru: 'Короткие карточки повторения без зубрежки правил.',
          az: 'Qaydaları əzbərsiz qavratma kartları.',
          en: 'Spaced recall cards eliminating rote rule memorization.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Объединяет разбор текстов DİM с живой речью и карточками запоминания — слова и правила остаются надолго.',
        az: 'DİM mətn təhlilini canlı danışıq və yaddaş kartları ilə birləşdirir — sözlər və qaydalar qalıcı olur.',
        en: 'Blends DİM passage strategy with active speaking and memory cards for lasting mastery.',
      },
      points: [
        {
          ru: 'Еженедельные аудио-тренажёры формата DİM Listening',
          az: 'Həftəlik DİM Listening formatında səsli məşqlər',
          en: 'Weekly DİM-format listening practice labs',
        },
      ],
      bestFor: {
        ru: 'Учеников 9–11 классов в Гяндже и онлайн для высоких баллов на выпускном экзамене.',
        az: 'Gəncədə əyani və onlayn yüksək buraxılış nəticəsi istəyən 9–11-cilər üçün.',
        en: 'Grade 9–11 students in Ganja & online targeting top exam scores.',
      },
    },
  },
  {
    id: 't11',
    name: 'Орхан Алиев',
    subj: ['Химия', 'Физика'],
    cats: ['9 класс', '10 класс', '11 класс'],
    levels: ['Начальный', 'Средний', 'Продвинутый'],
    lang: ['Азербайджанский', 'Русский'],
    fmt: ['Офлайн', 'Онлайн'],
    price: 21,
    rating: 4.8,
    n: 26,
    sty: ['На примерах', 'Строгий'],
    coords: [40.691, 46.374],
    certs: [
      {
        id: 'c-t11-1',
        name: {
          ru: 'Диплом химика-исследователя, БГУ',
          az: 'Kimyaçı-tədqiqatçı diplomu, BDU',
          en: 'Chemistry Research Diploma, BSU',
        },
        ok: true,
      },
    ],
    rev: [
      {
        id: 'rev-t11-1',
        stars: 5,
        text: 'С нуля до 90 баллов по химии, поступил в АМУ с первой попытки!',
        author: 'Кямал В.',
        date: '2026-09',
      },
    ],
    bio: {
      ru: 'Выпускник БГУ, веду очные занятия в Гяндже и онлайн по всей стране. Специализация — IV группа (химия и физика).',
      az: 'BDU məzunuyam, Gəncədə əyani və ölkə üzrə onlayn IV qrup (kimya və fizika) hazırlığı aparıram.',
      en: 'BSU graduate coaching Group IV Chemistry & Physics in Ganja and nationwide online.',
    },
    education: {
      university: {
        ru: 'Бакинский государственный университет (БГУ)',
        az: 'Bakı Dövlət Universiteti (BDU)',
        en: 'Baku State University (BSU)',
      },
      universityShort: 'BDU',
      faculty: {
        ru: 'Химический факультет · Медицинская и прикладная химия',
        az: 'Kimya fakültəsi · Tibbi və tətbiqi kimya',
        en: 'Faculty of Chemistry · Applied & Medical Track',
      },
      degree: {
        ru: 'Магистр · Специалист по химии DİM',
        az: 'Magistr · DİM kimya üzrə mütəxəssis',
        en: 'MSc Chemistry · DİM Group IV Specialist',
      },
      admissionScore: 669,
      maxScore: 700,
      admissionYear: 2017,
      grantType: {
        ru: 'Государственный заказ · Стипендиат',
        az: 'Dövlət sifarişi · Təqaüdçü',
        en: 'State Scholarship Recipient',
      },
      extraExam: 'Group IV · Chemistry 100/100',
      verified: true,
    },
    achievements: [
      {
        id: 'a-t11-1',
        metric: '20',
        label: { ru: 'поступили в Медуниверситет', az: 'şagird ATU-ya qəbul', en: 'admitted to Medical Univ.' },
        detail: {
          ru: 'Поток 2024–2026: стабильное поступление на бюджет ATU.',
          az: '2024–2026 məzunları ATU-ya dövlət sifarişi ilə daxil olub.',
          en: '2024–2026 cohorts admitted tuition-free to ATU.',
        },
      },
      {
        id: 'a-t11-2',
        metric: '+150',
        label: { ru: 'прирост по химии и физике', az: 'kimya və fizikadan artım', en: 'avg Chem & Physics gain' },
        detail: {
          ru: 'Системный расчёт реакций и задач за 16 недель.',
          az: 'Reaksiya və məsələlərin 16 həftəlik sistemli məşqi.',
          en: '16-week structured stoichiometry & physics problem drill.',
        },
      },
    ],
    strengths: {
      differentiator: {
        ru: 'Расчётные задачи по химии объясняет как простую математику — сложные мольные пропорции решаются за минуту.',
        az: 'Kimya məsələlərini sadə riyazi məntiqlə izah edir — çətin mol nisbətləri 1 dəqiqəyə həll olunur.',
        en: 'Simplifies stoichiometry calculations into intuitive math so complex problems solve in a minute.',
      },
      points: [
        {
          ru: 'Полный конспект расчётных формул и цепочек IV группы',
          az: 'IV qrup üzrə tam reaksiya zəncirləri və düstur dəftəri',
          en: 'Complete Group IV reaction chains & formula handbook',
        },
      ],
      bestFor: {
        ru: 'Абитуриентов Медуниверситета (АМУ) в Гяндже и онлайн.',
        az: 'Gəncədə əyani və onlayn Tibb Universitetinə (ATU) hazırlaşanlar üçün.',
        en: 'Medical University (AMU) applicants in Ganja & online.',
      },
    },
  },
];

export const INITIAL_STUDENTS: StudentDirectoryItem[] = [
  {
    id: 's1',
    name: 'Айсель М.',
    cat: '11 класс',
    subj: 'Математика',
    level: 'Продвинутый',
    goal: { ru: 'DİM 650+', az: 'DİM 650+', en: 'DİM 650+' },
    sec: 'az',
  },
  {
    id: 's2',
    name: 'Эмиль Р.',
    cat: '9 класс',
    subj: 'Математика',
    level: 'Начальный',
    goal: { ru: 'Подтянуть оценки', az: 'Qiymətləri qaldırmaq', en: 'Boost grades' },
    sec: 'ru',
  },
  {
    id: 's3',
    name: 'Нармин К.',
    cat: '1 курс',
    subj: 'Математика',
    level: 'Средний',
    goal: { ru: 'Сессия', az: 'Sessiya imtahanı', en: 'University exams' },
    sec: 'en',
  },
  {
    id: 's4',
    name: 'Орхан Т.',
    cat: '10 класс',
    subj: 'Математика',
    level: 'Средний',
    goal: { ru: 'Олимпиада', az: 'Olimpiada', en: 'Olympiad' },
    sec: 'az',
  },
  {
    id: 's5',
    name: 'Сабина Г.',
    cat: '11 класс',
    subj: 'Математика',
    level: null,
    goal: { ru: 'DİM', az: 'DİM', en: 'DİM' },
    sec: 'ru',
  },
];

export const INITIAL_REQUESTS: StudentRequest[] = [
  {
    id: 1,
    tid: 'me',
    trial: true,
    status: 'new',
    st: { name: 'Айсель М.', cat: '11 класс', subj: 'Математика', sec: 'ru', level: 'Продвинутый' },
    msgs: [
      {
        id: 'm1',
        from: 's',
        text: 'Здравствуйте! Хочу пробный урок по подготовке к DİM.',
      },
    ],
  },
  {
    id: 2,
    tid: 'me',
    trial: false,
    status: 'new',
    st: { name: 'Нармин К.', cat: '1 курс', subj: 'Математика', sec: 'az', level: 'Средний' },
    msgs: [
      {
        id: 'm2',
        from: 's',
        text: 'Нужна помощь с матанализом перед сессией.',
      },
    ],
  },
  {
    id: 3,
    tid: 'me',
    trial: true,
    status: 'accepted',
    st: { name: 'Эмиль Р.', cat: '9 класс', subj: 'Математика', sec: 'en', level: 'Начальный' },
    msgs: [
      { id: 'm3', from: 's', text: 'Добрый день, хочу пробный урок.' },
      { id: 'm4', from: 't', text: 'Здравствуйте! Давайте в четверг в 18:00.' },
    ],
  },
  {
    id: 4,
    tid: 'me',
    trial: false,
    status: 'new',
    st: { name: 'Сабина Г.', cat: '11 класс', subj: 'Математика', sec: 'ru', level: null },
    msgs: [
      {
        id: 'm5',
        from: 's',
        text: 'Здравствуйте! Подскажите по графику занятий.',
      },
    ],
  },
];

export const INITIAL_CONTENT: Record<string, TutorContent> = {
  me: {
    videos: [
      {
        id: 'v100',
        title: { ru: 'Дроби за 5 минут', az: '5 dəqiqəyə kəsrlər', en: 'Fractions in 5 minutes' },
        dur: '5:12',
        free: true,
      },
      {
        id: 'v101',
        title: {
          ru: 'Квадратные уравнения',
          az: 'Kvadrat tənliklər',
          en: 'Quadratic equations',
        },
        dur: '18:40',
        free: false,
      },
      {
        id: 'v102',
        title: {
          ru: 'Разбор задач DİM',
          az: 'DİM məsələlərinin izahı',
          en: 'DİM problem walkthrough',
        },
        dur: '24:05',
        free: false,
      },
    ],
    courses: [
      {
        id: 'c103',
        title: { ru: 'Математика к DİM', az: 'DİM üçün riyaziyyat', en: 'DİM Math Mastery' },
        price: 49,
        vids: ['v101', 'v102'],
        sold: 7,
      },
    ],
    tests: [],
    hw: [
      {
        id: 'h104',
        title: {
          ru: 'Проценты: 10 задач',
          az: 'Faizlər: 10 məsələ',
          en: 'Percentages: 10 problems',
        },
        pts: 30,
      },
    ],
  },
  t1: {
    videos: [
      {
        id: 'v105',
        title: {
          ru: 'Тригонометрия с нуля',
          az: 'Sıfırdan triqonometriya',
          en: 'Trigonometry from scratch',
        },
        dur: '9:30',
        free: true,
      },
      {
        id: 'v106',
        title: {
          ru: 'Логарифмы без страха',
          az: 'Qorxusuz loqarifmlər',
          en: 'Logarithms made simple',
        },
        dur: '15:10',
        free: false,
      },
      {
        id: 'v107',
        title: {
          ru: 'Разбор ошибок DİM',
          az: 'DİM səhvlərinin təhlili',
          en: 'Common DİM mistakes',
        },
        dur: '21:45',
        free: false,
      },
    ],
    courses: [
      {
        id: 'c108',
        title: { ru: 'Курс DİM-алгебра', az: 'DİM-cəbr kursu', en: 'DİM Algebra Bootcamp' },
        price: 39,
        vids: ['v106', 'v107'],
        sold: 12,
      },
    ],
    tests: [{ ...DEFAULT_DEMO_TEST, id: 'dt1' }],
    hw: [
      {
        id: 'h109',
        title: {
          ru: 'Тригонометрия: 5 примеров',
          az: 'Triqonometriya: 5 misal',
          en: 'Trigonometry: 5 exercises',
        },
        pts: 25,
      },
    ],
  },
  t2: {
    videos: [
      {
        id: 'v110',
        title: {
          ru: 'IELTS Speaking: Part 2',
          az: 'IELTS Speaking: Part 2',
          en: 'IELTS Speaking: Part 2',
        },
        dur: '12:20',
        free: true,
      },
      {
        id: 'v111',
        title: { ru: 'Phrasal verbs', az: 'Frazal feillər', en: 'Phrasal verbs' },
        dur: '16:00',
        free: false,
      },
      {
        id: 'v112',
        title: { ru: 'Writing Task 2', az: 'Writing Task 2', en: 'Writing Task 2' },
        dur: '22:30',
        free: false,
      },
    ],
    courses: [
      {
        id: 'c113',
        title: { ru: 'IELTS 7+', az: 'IELTS 7+', en: 'IELTS 7+ Accelerator' },
        price: 59,
        vids: ['v111', 'v112'],
        sold: 12,
      },
    ],
    tests: [],
    hw: [
      {
        id: 'h114',
        title: {
          ru: 'Эссе 150 слов: My city',
          az: '150 sözlük esse: My city',
          en: '150-word essay: My city',
        },
        pts: 40,
      },
    ],
  },
  t4: {
    videos: [
      {
        id: 'v115',
        title: {
          ru: 'Бинарный поиск и графы',
          az: 'İkili axtarış və qraflar',
          en: 'Binary search & graphs',
        },
        dur: '14:10',
        free: true,
      },
    ],
    courses: [],
    tests: [],
    hw: [
      {
        id: 'h116',
        title: {
          ru: 'Python: 3 задачи на списки',
          az: 'Python: siyahılar üzrə 3 məsələ',
          en: 'Python: 3 list challenges',
        },
        pts: 35,
      },
    ],
  },
  t7: {
    videos: [
      {
        id: 'v120',
        title: {
          ru: 'Законы сохранения и статика',
          az: 'Saxlanma qanunları və statika',
          en: 'Conservation laws & statics',
        },
        dur: '11:40',
        free: true,
      },
    ],
    courses: [],
    tests: [],
    hw: [
      {
        id: 'h120',
        title: {
          ru: 'Задачи DİM по динамике (5 шт.)',
          az: 'Dinamika üzrə 5 DİM məsələsi',
          en: '5 DİM dynamics problems',
        },
        pts: 30,
      },
    ],
  },
  t8: {
    videos: [
      {
        id: 'v125',
        title: {
          ru: 'Топ-10 ловушек DİM по алгебре и комбинаторике',
          az: 'Cəbr və kombinatorikada 10 əsas DİM tələsi',
          en: 'Top 10 DİM Algebra & Combinatorics Traps',
        },
        dur: '13:15',
        free: true,
      },
    ],
    courses: [],
    tests: [],
    hw: [
      {
        id: 'h125',
        title: {
          ru: 'Тренировочный вариант DİM: 12 ключевых задач',
          az: 'DİM məşq variantı: 12 əsas məsələ',
          en: 'DİM practice set: 12 core problems',
        },
        pts: 25,
      },
    ],
  },
  t9: {
    videos: [
      {
        id: 'v128',
        title: {
          ru: 'Электродинамика и цепи за 12 минут',
          az: 'Elektrodinamika və dövrələr 12 dəqiqədə',
          en: 'Electrodynamics & Circuits in 12 mins',
        },
        dur: '12:00',
        free: true,
      },
    ],
    courses: [],
    tests: [],
    hw: [],
  },
  t10: {
    videos: [
      {
        id: 'v131',
        title: {
          ru: 'Аудирование DİM 9–11 кл.: как не упустить детали',
          az: '9–11-ci sinif DİM dinləmə mətnlərində açar məqamlar',
          en: 'DİM Listening Strategy for Grades 9–11',
        },
        dur: '09:50',
        free: true,
      },
    ],
    courses: [],
    tests: [],
    hw: [],
  },
  t11: {
    videos: [
      {
        id: 'v134',
        title: {
          ru: 'Мольные соотношения и ОВР без ошибок',
          az: 'Mol nisbətləri və OVR reaksiyalarının asan həlli',
          en: 'Stoichiometry & Redox Ratios Made Simple',
        },
        dur: '10:35',
        free: true,
      },
    ],
    courses: [],
    tests: [],
    hw: [],
  },
};

export function resolveLocalized(val: LocalizedText | string, locale: Locale): string {
  if (typeof val === 'string') return val;
  return val[locale] ?? val.ru;
}

export {
  resolveTutorName,
  resolvePersonName,
  resolveReviewText,
  resolveReviewAuthor,
  resolveReviewTag,
  resolveChatMessageText,
} from '@/lib/localizeData';
