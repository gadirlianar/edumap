import type {
  CityId,
  GradeId,
  LessonFormatId,
  LevelId,
  Locale,
  LocalizedText,
  QuizQuestion,
  RankTier,
  SectorCode,
  SubjectId,
  TeachingLanguageId,
  TeachingStyleId,
  TutorTest,
} from '@/types/edumatch';

export const GRADES: GradeId[] = [
  '1–4 класс',
  '5–8 класс',
  '9 класс',
  '10 класс',
  '11 класс',
  '1 курс',
  '2–4 курс',
];

export const LEVELS: LevelId[] = ['Начальный', 'Средний', 'Продвинутый'];

export const SUBJECTS: SubjectId[] = [
  'Математика',
  'Физика',
  'Химия',
  'Английский язык',
  'Азербайджанский язык',
  'Информатика',
];

export const TEACHING_STYLES: TeachingStyleId[] = [
  'Спокойный',
  'С юмором',
  'Строгий',
  'На примерах',
  'Мотивирует',
];

export const TEACHING_LANGUAGES: TeachingLanguageId[] = [
  'Азербайджанский',
  'Русский',
  'Английский',
];

export const FORMATS: LessonFormatId[] = ['Онлайн', 'Офлайн'];

export const CITIES: Record<CityId, [number, number]> = {
  Баку: [40.4093, 49.8671],
  Сумгайыт: [40.589, 49.669],
  Гянджа: [40.683, 46.36],
};

export const SECTOR_TO_LANG: Record<SectorCode, TeachingLanguageId> = {
  az: 'Азербайджанский',
  ru: 'Русский',
  en: 'Английский',
};

export const LANG_TO_SECTOR: Record<TeachingLanguageId, SectorCode> = {
  Азербайджанский: 'az',
  Русский: 'ru',
  Английский: 'en',
};

export const SUBJECT_COLORS: Record<SubjectId, { hex: string; softBg: string }> = {
  Математика: { hex: 'var(--ink)', softBg: 'var(--surface-subtle)' },
  Физика: { hex: 'var(--ink)', softBg: 'var(--surface-subtle)' },
  Химия: { hex: 'var(--ink)', softBg: 'var(--surface-subtle)' },
  'Английский язык': { hex: 'var(--accent-ink)', softBg: 'var(--accent-soft)' },
  'Азербайджанский язык': { hex: 'var(--ink)', softBg: 'var(--surface-subtle)' },
  Информатика: { hex: 'var(--ink)', softBg: 'var(--surface-subtle)' },
};

export const RANK_TIERS: RankTier[] = [
  { xp: 0, title: { ru: 'Новичок', az: 'Yeni başlayan', en: 'Starter' }, iconKey: 'starter' },
  { xp: 100, title: { ru: 'Любознательный', az: 'Həvəskar', en: 'Explorer' }, iconKey: 'curious' },
  { xp: 220, title: { ru: 'Аналитик', az: 'Analitik', en: 'Analyst' }, iconKey: 'analyst' },
  { xp: 400, title: { ru: 'Прилежный', az: 'Çalışqan', en: 'Scholar' }, iconKey: 'scholar' },
  { xp: 650, title: { ru: 'Ментор', az: 'Mentor', en: 'Mentor' }, iconKey: 'mentor' },
  { xp: 950, title: { ru: 'Отличник', az: 'Əlaçı', en: 'Honors' }, iconKey: 'honors' },
  { xp: 1400, title: { ru: 'Грандмастер', az: 'Qrandmaster', en: 'Grandmaster' }, iconKey: 'grandmaster' },
];

export const BASE_STICKERS = ['thumb', 'smile', 'wow', 'target', 'write', 'zen'];

export const REVIEW_TAGS: LocalizedText[] = [
  { ru: 'Всё понятно', az: 'Hər şey aydındır', en: 'Crystal clear' },
  { ru: 'Заряжает энергией', az: 'Enerji verir', en: 'Motivating' },
  { ru: 'Объясняет на примерах', az: 'Nümunələrlə izah edir', en: 'Great examples' },
  { ru: 'Пунктуален', az: 'Dəqiqdir', en: 'Punctual' },
];

export const QUIZ_BANK: Record<SubjectId, QuizQuestion[]> = {
  Математика: [
    {
      prompt: { ru: '12 × 7 = ?', az: '12 × 7 = ?', en: '12 × 7 = ?' },
      options: ['74', '84', '86', '96'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Решите: 3x + 5 = 20. x = ?',
        az: 'Həll edin: 3x + 5 = 20. x = ?',
        en: 'Solve: 3x + 5 = 20. x = ?',
      },
      options: ['3', '5', '6', '15'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Площадь круга r = 3 (π ≈ 3,14)',
        az: 'Radiusu r = 3 olan dairənin sahəsi (π ≈ 3,14)',
        en: 'Area of a circle with r = 3 (π ≈ 3.14)',
      },
      options: ['9,42', '18,84', '28,26', '37,68'],
      correctIndex: 2,
    },
    {
      prompt: { ru: 'log₂ 32 = ?', az: 'log₂ 32 = ?', en: 'log₂ 32 = ?' },
      options: ['4', '5', '6', '16'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Производная x² равна',
        az: 'x² funksiyasının törəməsi',
        en: 'The derivative of x² is',
      },
      options: ['x', '2x', 'x²', '2'],
      correctIndex: 1,
    },
    {
      prompt: { ru: 'sin 30° = ?', az: 'sin 30° = ?', en: 'sin 30° = ?' },
      options: ['1/2', '√3/2', '1', '0'],
      correctIndex: 0,
    },
  ],
  'Английский язык': [
    {
      prompt: {
        ru: 'She ___ to school every day.',
        az: 'She ___ to school every day.',
        en: 'She ___ to school every day.',
      },
      options: ['go', 'goes', 'going', 'gone'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Синоним слова “big”',
        az: '“big” sözünün sinonimi',
        en: 'Synonym for “big”',
      },
      options: ['small', 'large', 'thin', 'quick'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'If I ___ you, I would study more.',
        az: 'If I ___ you, I would study more.',
        en: 'If I ___ you, I would study more.',
      },
      options: ['am', 'was', 'were', 'be'],
      correctIndex: 2,
    },
    {
      prompt: {
        ru: 'I have lived here ___ 2015.',
        az: 'I have lived here ___ 2015.',
        en: 'I have lived here ___ 2015.',
      },
      options: ['for', 'since', 'from', 'during'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'He suggested ___ earlier.',
        az: 'He suggested ___ earlier.',
        en: 'He suggested ___ earlier.',
      },
      options: ['to leave', 'leaving', 'leave', 'left'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'The report ___ by the team yesterday.',
        az: 'The report ___ by the team yesterday.',
        en: 'The report ___ by the team yesterday.',
      },
      options: ['finished', 'was finished', 'has finish', 'finishing'],
      correctIndex: 1,
    },
  ],
  Физика: [
    {
      prompt: {
        ru: 'Единица измерения силы в системе СИ:',
        az: 'BS sistemində qüvvənin ölçü vahidi:',
        en: 'SI unit of force:',
      },
      options: [
        { ru: 'Джоуль', az: 'Coul', en: 'Joule' },
        { ru: 'Ньютон', az: 'Nyuton', en: 'Newton' },
        { ru: 'Ватт', az: 'Vatt', en: 'Watt' },
        { ru: 'Паскаль', az: 'Paskal', en: 'Pascal' },
      ],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Второй закон Ньютона:',
        az: 'Nyutonun ikinci qanunu:',
        en: "Newton's second law:",
      },
      options: ['F = m·a', 'F = m/a', 'F = v·t', 'A = F·s'],
      correctIndex: 0,
    },
    {
      prompt: {
        ru: 'Если напряжение 12 В и сопротивление 4 Ом, сила тока равна:',
        az: 'Gərginlik 12 V, müqavimət 4 Om olarsa, cərəyan şiddəti:',
        en: 'If voltage is 12 V and resistance is 4 Ω, current is:',
      },
      options: ['48 A', '8 A', '3 A', '0.33 A'],
      correctIndex: 2,
    },
    {
      prompt: {
        ru: 'Ускорение свободного падения у поверхности Земли (≈):',
        az: 'Yer səthində sərbəstdüşmə təcili (≈):',
        en: 'Gravitational acceleration near Earth surface (≈):',
      },
      options: ['9.8 м/с²', '3.14 м/с²', '1.6 м/с²', '98 м/с²'],
      correctIndex: 0,
    },
    {
      prompt: {
        ru: 'Кинетическая энергия тела вычисляется по формуле:',
        az: 'Cismin kinetik enerjisi hansı düsturla hesablanır?',
        en: 'Kinetic energy formula:',
      },
      options: ['m·g·h', 'm·v² / 2', 'F·t', 'p·V'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Скорость света в вакууме (≈):',
        az: 'İşığın vakuumda yayılma sürəti (≈):',
        en: 'Speed of light in vacuum (≈):',
      },
      options: ['3×10⁸ м/с', '3×10⁵ м/с', '340 м/с', '1.5×10⁸ м/с'],
      correctIndex: 0,
    },
  ],
  Химия: [
    {
      prompt: {
        ru: 'Химическая формула серной кислоты:',
        az: 'Sulfat turşusunun kimyəvi formulu:',
        en: 'Chemical formula of sulfuric acid:',
      },
      options: ['HCl', 'H₂SO₄', 'HNO₃', 'H₂CO₃'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Какое значение pH имеет нейтральная среда (вода)?',
        az: 'Neytral mühitin (suyun) pH göstəricisi neçədir?',
        en: 'What is the pH of a neutral solution?',
      },
      options: ['0', '5', '7', '14'],
      correctIndex: 2,
    },
    {
      prompt: {
        ru: 'Атомный номер углерода (C) в таблице Менделеева:',
        az: 'Dövri cədvəldə karbonun (C) sıra nömrəsi:',
        en: 'Atomic number of Carbon (C):',
      },
      options: ['4', '6', '8', '12'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Общая формула алканов:',
        az: 'Alkanların ümumi formulu:',
        en: 'General formula of alkanes:',
      },
      options: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Молярная масса воды (H₂O) равна:',
        az: 'Suyun (H₂O) molyar kütləsi:',
        en: 'Molar mass of water (H₂O):',
      },
      options: ['16 г/моль', '18 г/моль', '20 г/моль', '34 г/моль'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Какой газ занимает ~78% атмосферы Земли?',
        az: 'Yer atmosferinin təxminən 78%-ni hansı qaz təşkil edir?',
        en: 'Which gas makes up ~78% of Earth’s atmosphere?',
      },
      options: [
        { ru: 'Кислород (O₂)', az: 'Oksigen (O₂)', en: 'Oxygen (O₂)' },
        { ru: 'Азот (N₂)', az: 'Azot (N₂)', en: 'Nitrogen (N₂)' },
        { ru: 'Углекислый газ (CO₂)', az: 'Karbon qazı (CO₂)', en: 'Carbon dioxide (CO₂)' },
        { ru: 'Аргон (Ar)', az: 'Arqon (Ar)', en: 'Argon (Ar)' },
      ],
      correctIndex: 1,
    },
  ],
  Информатика: [
    {
      prompt: {
        ru: 'Переведите двоичное число 1010₂ в десятичную систему:',
        az: '1010₂ ikilik ədədini onluq say sisteminə çevirin:',
        en: 'Convert binary 1010₂ to decimal:',
      },
      options: ['8', '10', '12', '14'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Временная сложность бинарного поиска (Binary Search):',
        az: 'İkili axtarışın (Binary Search) zaman mürəkkəbliyi:',
        en: 'Time complexity of Binary Search:',
      },
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Сколько бит в 1 байте?',
        az: '1 bayt neçə bitdir?',
        en: 'How many bits are in 1 byte?',
      },
      options: ['4', '8', '16', '32'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Какая структура данных работает по принципу LIFO?',
        az: 'Hansı verilənlər strukturu LIFO prinsipi ilə işləyir?',
        en: 'Which data structure follows LIFO?',
      },
      options: [
        { ru: 'Очередь (Queue)', az: 'Növbə (Queue)', en: 'Queue' },
        { ru: 'Стек (Stack)', az: 'Stek (Stack)', en: 'Stack' },
        { ru: 'Граф', az: 'Qraf', en: 'Graph' },
        { ru: 'Хэш-таблица', az: 'Heş cədvəli', en: 'Hash Table' },
      ],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Что выведет Python: print(len("EduMatch"))?',
        az: 'Python kodu nəticəsi nə olacaq: print(len("EduMatch"))?',
        en: 'What does Python output: print(len("EduMatch"))?',
      },
      options: ['7', '8', '9', '10'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Логическое выражение (True and False) or True равно:',
        az: '(True and False) or True məntiqi ifadəsinin nəticəsi:',
        en: 'Boolean expression (True and False) or True evaluates to:',
      },
      options: ['True', 'False', 'None', 'Error'],
      correctIndex: 0,
    },
  ],
  'Азербайджанский язык': [
    {
      prompt: {
        ru: 'Сколько букв в современном азербайджанском алфавите?',
        az: 'Müasir Azərbaycan əlifbasında neçə hərf var?',
        en: 'How many letters are in the modern Azerbaijani alphabet?',
      },
      options: ['29', '32', '33', '34'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Выберите ряд только с тонкими гласными (incə saitlər):',
        az: 'Yalnız incə saitlərdən ibarət sıranı seçin:',
        en: 'Pick the row with front vowels (incə saitlər) only:',
      },
      options: ['a, ı, o, u', 'e, ə, i, ö, ü', 'a, e, i, o', 'ı, ü, u, ö'],
      correctIndex: 1,
    },
    {
      prompt: {
        ru: 'Сколько падежей (hal) в азербайджанском языке?',
        az: 'Azərbaycan dilində ismin neçə halı var?',
        en: 'How many grammatical cases (hal) are in Azerbaijani?',
      },
      options: ['4', '5', '6', '7'],
      correctIndex: 2,
    },
    {
      prompt: {
        ru: 'Антоним слова “yaxın” (близкий):',
        az: '“yaxın” sözünün antonimi:',
        en: 'Antonym of “yaxın” (near):',
      },
      options: ['uzaq', 'qısa', 'geniş', 'yeni'],
      correctIndex: 0,
    },
    {
      prompt: {
        ru: 'В каком слове буква “q” читается как [k’] (глухой звук)?',
        az: 'Hansı sözdə “q” hərfi kar [k’] kimi tələffüz olunur?',
        en: 'In which word is “q” pronounced voicelessly [k’]?',
      },
      options: ['qələm', 'otaq', 'yarpaq (в конце)', 'dağ'],
      correctIndex: 2,
    },
    {
      prompt: {
        ru: 'Укажите слово, обозначающее действие (feil):',
        az: 'Hərəkət bildirən sözü (feili) seçin:',
        en: 'Select the verb (feil):',
      },
      options: ['kitab', 'yaşıl', 'oxumaq', 'sürətli'],
      correctIndex: 2,
    },
  ],
};

export const DEFAULT_DEMO_TEST: TutorTest = {
  id: 'dt',
  title: {
    ru: 'Входной тест: алгебра',
    az: 'Giriş testi: cəbr',
    en: 'Entry quiz: Algebra',
  },
  thr: 'Средний',
  qs: [
    {
      prompt: { ru: '2x + 6 = 14. x = ?', az: '2x + 6 = 14. x = ?', en: '2x + 6 = 14. x = ?' },
      options: ['2', '4', '6', '8'],
      correctIndex: 1,
    },
    {
      prompt: { ru: '(a+b)² = ?', az: '(a+b)² = ?', en: '(a+b)² = ?' },
      options: ['a²+b²', 'a²+2ab+b²', '2ab', 'a²−b²'],
      correctIndex: 1,
    },
    {
      prompt: { ru: '√144 = ?', az: '√144 = ?', en: '√144 = ?' },
      options: ['10', '11', '12', '14'],
      correctIndex: 2,
    },
    {
      prompt: {
        ru: 'x² − 5x + 6 = 0, меньший корень',
        az: 'x² − 5x + 6 = 0, kiçik kök',
        en: 'x² − 5x + 6 = 0, smaller root',
      },
      options: ['1', '2', '3', '6'],
      correctIndex: 1,
    },
  ],
};

export interface PolicySection {
  title: string;
  body: string;
}

export const PRIVACY_POLICIES: Record<Locale, Record<'student' | 'teacher', PolicySection[]>> = {
  ru: {
    student: [
      {
        title: 'Какие данные мы собираем',
        body: 'Имя, контакт, класс или курс, сектор обучения (AZ/RU/EN), результаты теста, переписку, отзывы и — с вашего разрешения — местоположение.',
      },
      {
        title: 'Местоположение',
        body: 'Нужно только для расчёта расстояния. Преподаватель видит примерное расстояние, но не точный адрес. Можно выбрать город вручную или отключить доступ в настройках телефона.',
      },
      {
        title: 'Кто видит ваши данные',
        body: 'Преподаватель видит имя, класс, сектор и цель после вашей заявки. Уровень по тесту видят только преподаватели с Премиумом. Телефон и почта скрыты.',
      },
      {
        title: 'Несовершеннолетние',
        body: 'Пользователям младше 16 лет нужно согласие родителя или законного представителя. Родитель может запросить просмотр или удаление данных.',
      },
      {
        title: 'Реклама и третьи лица',
        body: 'Мы не продаём данные. Реклама помечена «Реклама» и не использует вашу переписку.',
      },
      {
        title: 'Ваши права',
        body: 'Доступ, исправление, удаление аккаунта и отзыв согласия — в профиле или через support@edumatch.az. Данные хранятся, пока аккаунт активен.',
      },
    ],
    teacher: [
      {
        title: 'Какие данные мы собираем',
        body: 'Имя, контакт, предметы, языки и секторы, цена, город или район, вуз и балл поступления, дипломы и сертификаты, отзывы и рейтинг.',
      },
      {
        title: 'Проверка дипломов и баллов',
        body: 'Документы видит только команда проверки EduMatch. Другим пользователям показывается название, вуз, балл поступления и статус «Подтверждён». Файлы удаляются после проверки.',
      },
      {
        title: 'Местоположение',
        body: 'Для офлайн-занятий ученики видят район и примерное расстояние, но не домашний адрес.',
      },
      {
        title: 'Публичный профиль',
        body: 'Имя, предметы, вуз, достижения, сильные стороны, цена, рейтинг, отзывы и сектор видны ученикам. Без подтверждённого сертификата профиль скрыт.',
      },
      {
        title: 'Данные учеников',
        body: 'Используйте их только для организации занятий. Нельзя передавать третьим лицам, пересылать переписку или переводить общение с детьми за пределы платформы без согласия родителей.',
      },
      {
        title: 'Оплата, реклама и права',
        body: 'Премиум и реклама — на отдельных условиях, платежи обрабатывает платёжный провайдер. Вы можете запросить доступ, исправление или удаление профиля.',
      },
    ],
  },
  az: {
    student: [
      {
        title: 'Hansı məlumatları toplayırıq',
        body: 'Ad, əlaqə, sinif və ya kurs, təhsil sektoru (AZ/RU/EN), test nəticələri, yazışma, rəylər və icazənizlə məkan.',
      },
      {
        title: 'Məkan',
        body: 'Yalnız məsafəni hesablamaq üçün. Müəllim təxmini məsafəni görür, dəqiq ünvanı yox. Şəhəri əl ilə seçə və ya icazəni telefon ayarlarından söndürə bilərsiniz.',
      },
      {
        title: 'Məlumatlarınızı kim görür',
        body: 'Müəllim sorğunuzdan sonra adı, sinfi, sektoru və məqsədi görür. Test səviyyəsini yalnız Premium müəllimlər görür. Telefon və e-poçt gizlidir.',
      },
      {
        title: 'Yetkinlik yaşına çatmayanlar',
        body: '16 yaşdan kiçik istifadəçilər üçün valideyn və ya qanuni nümayəndənin razılığı lazımdır. Valideyn məlumatlara baxışı və ya silinməsini tələb edə bilər.',
      },
      {
        title: 'Reklam və üçüncü tərəflər',
        body: 'Məlumatları satmırıq. Reklam “Reklam” kimi qeyd olunur və yazışmanızdan istifadə etmir.',
      },
      {
        title: 'Hüquqlarınız',
        body: 'Giriş, düzəliş, hesabın silinməsi və razılığın geri çəkilməsi — profildə və ya support@edumatch.az vasitəsilə. Məlumat hesab aktiv olduğu müddətdə saxlanılır.',
      },
    ],
    teacher: [
      {
        title: 'Hansı məlumatları toplayırıq',
        body: 'Ad, əlaqə, fənlər, dillər və sektorlar, qiymət, şəhər və ya rayon, universitet və qəbul balı, diplom və sertifikatlar, rəylər və reytinq.',
      },
      {
        title: 'Diplom və qəbul balının yoxlanması',
        body: 'Sənədləri yalnız EduMatch yoxlama komandası görür. Digər istifadəçilərə ad, universitet, qəbul balı və “Təsdiqlənib” statusu göstərilir. Fayllar yoxlamadan sonra silinir.',
      },
      {
        title: 'Məkan',
        body: 'Oflayn dərslər üçün şagirdlər rayonu və təxmini məsafəni görür, ev ünvanını yox.',
      },
      {
        title: 'Açıq profil',
        body: 'Ad, fənlər, universitet, nailiyyətlər, güclü tərəflər, qiymət, reytinq, rəylər və sektor şagirdlərə görünür. Təsdiqlənmiş sertifikat olmadan profil gizlidir.',
      },
      {
        title: 'Şagird məlumatları',
        body: 'Yalnız dərsləri təşkil etmək üçün istifadə edin. Üçüncü tərəfə ötürmək, yazışmanı göndərmək və ya valideyn razılığı olmadan uşaqlarla ünsiyyəti platformadan kənara çıxarmaq olmaz.',
      },
      {
        title: 'Ödəniş, reklam və hüquqlar',
        body: 'Premium və reklam ayrıca şərtlərlədir, ödənişləri ödəniş provayderi emal edir. Profilə giriş, düzəliş və ya silinməsini tələb edə bilərsiniz.',
      },
    ],
  },
  en: {
    student: [
      {
        title: 'What we collect',
        body: 'Name, contact, grade or year, school sector (AZ/RU/EN), quiz results, messages, reviews and, with your permission, location.',
      },
      {
        title: 'Location',
        body: 'Used only to calculate distance. Tutors see an approximate distance, never your exact address. You can pick a city manually or turn off access in your device settings.',
      },
      {
        title: 'Who sees your data',
        body: 'After you send a request, a tutor sees your name, grade, sector and goal. Quiz level is visible only to Premium tutors. Phone and email stay hidden.',
      },
      {
        title: 'Minors',
        body: 'Users under 16 need consent from a parent or legal guardian. A parent can ask to view or delete the data.',
      },
      {
        title: 'Ads and third parties',
        body: 'We do not sell data. Ads are clearly labelled “Ad” and never use your messages.',
      },
      {
        title: 'Your rights',
        body: 'Access, correction, account deletion and withdrawal of consent: in your profile or at support@edumatch.az. Data is kept while your account is active.',
      },
    ],
    teacher: [
      {
        title: 'What we collect',
        body: 'Name, contact, subjects, languages and sectors, price, city or district, university and entrance score, diplomas and certificates, reviews and rating.',
      },
      {
        title: 'Diploma & score verification',
        body: 'Only the EduMatch review team sees documents. Others see the title, university, entrance score and a “Verified” status. Files are deleted after review.',
      },
      {
        title: 'Location',
        body: 'For in-person lessons, students see your district and approximate distance, not your home address.',
      },
      {
        title: 'Public profile',
        body: 'Name, subjects, university, achievements, strengths, price, rating, reviews and sector are visible to students. Without a verified certificate your profile stays hidden.',
      },
      {
        title: 'Student data',
        body: 'Use it only to organise lessons. Do not share it, forward chats, or move conversations with children off the platform without parental consent.',
      },
      {
        title: 'Payments, ads and rights',
        body: 'Premium and ads have separate terms; a payment provider processes payments. You can request access, correction or deletion of your profile.',
      },
    ],
  },
};
