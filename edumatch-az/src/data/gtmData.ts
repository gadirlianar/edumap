import type { Locale } from '@/types/edumatch';

export interface GtmFlowStep {
  step: string;
  tag: string;
  title: string;
  description: string;
  metric: string;
}

export interface GtmPhase {
  id: 'phase1' | 'phase2' | 'phase3';
  badge: string;
  window: string;
  title: string;
  focusCity: string;
  summary: string;
  channels: string[];
  tactics: string[];
  targetKpi: string;
}

export interface GtmComparisonRow {
  criterion: string;
  informal: string;
  classifieds: string;
  edumatch: string;
}

export interface GtmBundle {
  badge: string;
  title: string;
  subtitle: string;
  highlights: { label: string; value: string; hint: string }[];
  flowHeading: string;
  flowSubheading: string;
  flowSteps: GtmFlowStep[];
  roadmapHeading: string;
  roadmapSubheading: string;
  phases: GtmPhase[];
  channelsLabel: string;
  tacticsLabel: string;
  kpiLabel: string;
  moatHeading: string;
  moatSubheading: string;
  colCriterion: string;
  colInformal: string;
  colClassifieds: string;
  colEdumatch: string;
  comparisonRows: GtmComparisonRow[];
  calcHeading: string;
  calcSubheading: string;
  presetsLabel: string;
  presets: {
    id: 'launch' | 'growth' | 'scale';
    label: string;
    tutors: number;
    lessonsPerWeek: number;
    avgPrice: number;
    proShare: number;
  }[];
  sliderTutors: string;
  sliderLessons: string;
  sliderPrice: string;
  sliderProShare: string;
  outGmv: string;
  outPlatformRev: string;
  outCommissionHint: string;
  outProHint: string;
  outTutorPayout: string;
  outLtvCac: string;
  outLtvCacHint: string;
  formulaNote: string;
  ctaCatalog: string;
  ctaQuiz: string;
}

export const GTM_CONTENT: Record<Locale, GtmBundle> = {
  az: {
    badge: 'GO-TO-MARKET · BAZARA ÇIXIŞ VƏ MƏNTİQ',
    title: 'EduMatch bazara çıxış strategiyası və məhsul məntiqi',
    subtitle:
      'Azərbaycanda kor-koranə «tanışla müəllim tapmağı» şəffaf DİM göstəriciləri, pulsuz diaqnostika və ölçülə bilən nəticə bazarı ilə əvəz edirik.',
    highlights: [
      {
        label: 'Əsas Acquisition Hunisi',
        value: '0 ₼ Diaqnostika',
        hint: 'Şagird əvvəl testlə boşluğunu görür, sonra müəllim seçir',
      },
      {
        label: 'Monetizasiya Modeli',
        value: '12% + PRO 19 ₼',
        hint: 'Pulsuz sınaq dərsi dönüşümü + müəllim CRM abunəliyi',
      },
      {
        label: 'Hədəf LTV / CAC',
        value: '5.4x · 8.5 ay',
        hint: '9–11-ci sinif abituriyent dövründə yüksək qalıcılıq',
      },
    ],
    flowHeading: 'Məhsul və konversiya məntiqi',
    flowSubheading: 'Hər klik valideynin şübhəsini azaldır və sınaq dərsinə aparır',
    flowSteps: [
      {
        step: '01',
        tag: 'Etibar Filtri',
        title: 'Diplom və DİM balı auditi',
        description:
          'Hər müəllim universitet fakültəsini, DİM qəbul balını (640–695) və şagird irəliləyişlərini sənədlə təsdiqləyir.',
        metric: '100% yoxlanılmış profil',
      },
      {
        step: '02',
        tag: 'Smart Uyğunlaşdırma',
        title: 'Fənn, məqsəd və məkan uyğunluğu',
        description:
          'Qısa diaqnostika və xəritə radiusu (Bakı, Sumqayıt, Gəncə + Onlayn) 100 elan əvəzinə 3–5 ideal namizəd göstərir.',
        metric: '15 san. dəqiq seçim',
      },
      {
        step: '03',
        tag: 'Sıfır Riskli Addım',
        title: 'Müqayisə (VS) + 0 ₼ sınaq dərsi',
        description:
          'Valideyn 3 müəllimin metodikasını yan-yana müqayisə edir və ödəniş etmədən ilk canlı tanışlıq dərsini bronlaşdırır.',
        metric: '~68% sınaqdan ödənişə keçid',
      },
      {
        step: '04',
        tag: 'Böyümə Dövrü',
        title: 'Nəticə əsaslı viral tövsiyə',
        description:
          'Şagirdin +140 bal artımı profilə yazılır; razı qalan valideynlər sinif çətlarında üzvi trafik yaradır.',
        metric: 'Aşağı CAC · Yüksək etibar',
      },
    ],
    roadmapHeading: 'Azərbaycan üzrə 3 mərhələli bazara çıxış planı',
    roadmapSubheading: 'Həddən artıq reklam xərcləmədən mikro-bazardan ölkəmiqyaslı şəbəkəyə keçid',
    channelsLabel: 'Əsas kanallar',
    tacticsLabel: 'Həyata keçirmə addımları',
    kpiLabel: 'Mərhələ hədəfi',
    phases: [
      {
        id: 'phase1',
        badge: 'Mərhələ 01',
        window: 'Ay 1–2 · Bakı Elit Nüvə',
        title: 'Metro qovşaqlarında sıx təklif və etibar quruculuğu',
        focusCity: 'Bakı (Elmlər, 28 May, Gənclik, Nərimanov)',
        summary:
          'Reklamsız, əl ilə seçilmiş top 50 müəllimlə bazara giriş. Məqsəd bütün ölkəni yox, riyaziyyat/fizika/kimya üzrə ilk 300 uğurlu sınaq dərsini yaratmaqdır.',
        channels: [
          'BDU, BANM, UFAZ, ADA məzun şəbəkələri',
          'Abituriyent Telegram və WhatsApp icmaları',
          '9–11-ci sinif valideyn rekomendasiya zənciri',
        ],
        tactics: [
          'İlk 50 müəllimə sıfır komissiyalı «Founding Mentor» nişanı və foto-auditi',
          'Hər müəllimin real tələbə nəticələrinin («+150 DİM balı») profil kartına çıxarılması',
          'Bakı mərkəz xəritəsi ilə evə/metroya yaxın 15 dəqiqəlik dərs marşrutu',
        ],
        targetKpi: '50 təsdiqli mentor · 300 sınaq · 68% dönüşüm',
      },
      {
        id: 'phase2',
        badge: 'Mərhələ 02',
        window: 'Ay 3–6 · Diaqnostika Hunisi',
        title: 'Pulsuz sınaq imtahanı ilə Sumqayıt & Gəncəyə genişlənmə',
        focusCity: 'Bakı + Sumqayıt + Gəncə (Hibrid)',
        summary:
          'Bahalı klik reklamı əvəzinə pulsuz «DİM Səviyyə Testi» trafiki gətirir. Şagird zəif mövzunu görən anda uyğun müəllim təklifi çıxır.',
        channels: [
          'TikTok / Instagram Reels «10 saniyəlik DİM tələləri»',
          'Mövzu əsaslı SEO və pulsuz sınaq imtahanları',
          'Şagirdlər arası «Dostunu dəvət et» bal bonusu',
        ],
        tactics: [
          'Hər test bitimində fərdi boşluq analizi + top 3 müəllim tövsiyəsi',
          'Valideynlər üçün aylıq ödənişsiz irəliləyiş hesabatı (retention artımı)',
          'Sumqayıt və Gəncədə aparıcı lisey müəllimlərinin cəlbi',
        ],
        targetKpi: '250 müəllim · 4,000+ diaqnostika · 26K ₼ aylıq GMV',
      },
      {
        id: 'phase3',
        badge: 'Mərhələ 03',
        window: 'Ay 6–12 · Ekosistem & PRO SaaS',
        title: 'Regionların onlayn qoşulması və EduMatch PRO abunəliyi',
        focusCity: 'Bütün Azərbaycan (Onlayn + Regional mərkəzlər)',
        summary:
          'Region abituriyentləri Bakının top müəllimlərinə onlayn çıxış əldə edir; müəllimlər üçün isə təkrar gəlirli SaaS alətləri aktivləşir.',
        channels: [
          'Region məktəbləri ilə onlayn olimpiada tərəfdaşlığı',
          'Müəllimlər üçün B2B EduMatch PRO CRM & cədvəl',
          'İllik abituriyent paketləri və qrup dərsləri',
        ],
        tactics: [
          'Müəllim PRO paketi (19 ₼/ay): təlim analitikası, ödəniş xatırlatması və ön sıra',
          'Qrup hazırlığı dəstəyi ilə şagird üçün qiymətin 35% ucuzlaşması',
          'Məzun bazasının təsdiqli rəylərlə növbəti qəbul mövsümünə daşınması',
        ],
        targetKpi: '800+ aktiv cüt · 90K+ ₼ GMV · 16K+ ₼ xalis gəlir',
      },
    ],
    moatHeading: 'Rəqiblərdən strateji fərqimiz',
    moatSubheading: 'Elan saytları yalnız əlaqə nömrəsi verir; EduMatch nəticəyə görə seçim edir',
    colCriterion: 'Meyar',
    colInformal: 'Instagram / Tanış tövsiyəsi',
    colClassifieds: 'Klassik Elan Saytları',
    colEdumatch: 'EduMatch Platforması',
    comparisonRows: [
      {
        criterion: 'Müəllimin real gücü',
        informal: 'Subyektiv sözlər, yoxlama yoxdur',
        classifieds: 'Yalnız diplom şəkli və ya özünü tərif',
        edumatch: 'DİM 700 balı + universitet fakültəsi + tələbə +bal artımı',
      },
      {
        criterion: 'Uyğunlaşdırma sürəti',
        informal: '2–3 həftə zəng və sınaq itkisi',
        classifieds: 'Yüzlərlə eyni elan arasında itmək',
        edumatch: '15 saniyəlik test + ərazi və qiymət üzrə top 3 seçim',
      },
      {
        criterion: 'İlk addım riski',
        informal: 'Birbaşa ödənişli ay paketi',
        classifieds: 'Məlumat azlığı səbəbindən imtina',
        edumatch: 'Pulsuz 0 ₼ sınaq dərsi + şəffaf VS müqayisəsi',
      },
      {
        criterion: 'Məlumat və qalıcılıq',
        informal: 'Dərs cədvəli və irəliləyiş izlənmir',
        classifieds: 'Əlaqə qurulandan sonra platforma ölür',
        edumatch: 'Dərs cədvəli, çat, rəy və PRO müəllim analitikası',
      },
    ],
    calcHeading: 'Canlı Unit-Economics və Gəlir Kalkulyatoru',
    calcSubheading: 'Parametrləri dəyişərək bazar dövriyyəsini (GMV) və platforma gəlirini real vaxtda hesablayın',
    presetsLabel: 'Ssenari seç:',
    presets: [
      { id: 'launch', label: 'Başlanğıc (Ay 2)', tutors: 50, lessonsPerWeek: 8, avgPrice: 22, proShare: 15 },
      { id: 'growth', label: 'İnkişaf (Ay 6)', tutors: 180, lessonsPerWeek: 11, avgPrice: 24, proShare: 32 },
      { id: 'scale', label: 'Miqyas (Ay 12)', tutors: 520, lessonsPerWeek: 13, avgPrice: 26, proShare: 48 },
    ],
    sliderTutors: 'Aktiv müəllim sayı',
    sliderLessons: 'Müəllim / həftəlik dərs sayı',
    sliderPrice: 'Orta dərs qiyməti (₼)',
    sliderProShare: 'PRO müəllim payı (%)',
    outGmv: 'Aylıq bazar dövriyyəsi (GMV)',
    outPlatformRev: 'Platforma aylıq gəliri',
    outCommissionHint: '12% komissiya',
    outProHint: '19 ₼ PRO SaaS',
    outTutorPayout: 'Orta müəllim aylıq gəliri',
    outLtvCac: 'Təxmini LTV / CAC',
    outLtvCacHint: '6 ay orta ömür · 42 ₼ CAC əsasında',
    formulaNote:
      'Hesablama: Aylıq dərslər = müəllim × həftəlik dərs × 4.3 · Komissiya = GMV × 12% · PRO MRR = PRO müəllimlər × 19 ₼.',
    ctaCatalog: 'Müəllim kataloquna bax',
    ctaQuiz: 'Diaqnostika testini sına',
  },
  ru: {
    badge: 'GO-TO-MARKET · СТРАТЕГИЯ И ЛОГИКА',
    title: 'Стратегия выхода на рынок и логика продукта',
    subtitle:
      'Заменяем стихийный поиск репетиторов по знакомству на прозрачный рынок с проверкой баллов DİM, диагностикой и измеримым ростом учеников.',
    highlights: [
      {
        label: 'Воронка привлечения',
        value: '0 ₼ Диагностика',
        hint: 'Ученик видит пробелы за 15 сек и сразу получает релевантных менторов',
      },
      {
        label: 'Монетизация',
        value: '12% + PRO 19 ₼',
        hint: 'Комиссия после бесплатного пробного урока + SaaS-подписка репетитора',
      },
      {
        label: 'Целевой LTV / CAC',
        value: '5.4x · 8.5 мес',
        hint: 'Длинный учебный цикл 9–11 классов снижает стоимость удержания',
      },
    ],
    flowHeading: 'Продуктовая логика и воронка конверсии',
    flowSubheading: 'Каждый экран снимает главный страх родителя и ведёт к пробному уроку',
    flowSteps: [
      {
        step: '01',
        tag: 'Фильтр доверия',
        title: 'Аудит вуза и баллов DİM',
        description:
          'Каждый репетитор подтверждает факультет, личный балл при поступлении (640–695) и реальный прогресс учеников.',
        metric: '100% проверенных анкет',
      },
      {
        step: '02',
        tag: 'Умный подбор',
        title: 'Матчинг по цели, цене и району',
        description:
          'Мини-тест и карта (Баку, Сумгаит, Гянджа + Онлайн) сужают выбор со 100 анкет до 3–5 точных совпадений.',
        metric: '15 сек до короткого списка',
      },
      {
        step: '03',
        tag: 'Шаг без риска',
        title: 'Сравнение (VS) и урок за 0 ₼',
        description:
          'Семья сравнивает 3 преподавателей рядом и бронирует бесплатное пробное занятие без предоплаты.',
        metric: '~68% переход в регулярные уроки',
      },
      {
        step: '04',
        tag: 'Виральный рост',
        title: 'Рекомендации на основе результатов',
        description:
          'Подтверждённый прирост +140 баллов усиливает рейтинг ментора и приводит органический трафик из школьных чатов.',
        metric: 'Низкий CAC · Высокий Retention',
      },
    ],
    roadmapHeading: '3 фазы выхода на рынок Азербайджана',
    roadmapSubheading: 'Рост от плотного ядра в Баку к национальной сети без сжигания бюджета на рекламу',
    channelsLabel: 'Ключевые каналы',
    tacticsLabel: 'Тактические шаги',
    kpiLabel: 'Цель фазы',
    phases: [
      {
        id: 'phase1',
        badge: 'Фаза 01',
        window: 'Мес 1–2 · Ядро в Баку',
        title: 'Плотное предложение у ключевых узлов метро и топ-вузов',
        focusCity: 'Баку (Эльмляр, 28 Мая, Гянджлик, Нариманов)',
        summary:
          'Ручной онбординг первых 50 сильнейших менторов по математике, физике, химии и информатике для формирования безупречных первых кейсов.',
        channels: [
          'Выпускники БГУ, БВШН, UFAZ, ADA и АГУНП',
          'Тематические Telegram и WhatsApp каналы абитуриентов',
          'Родительские чаты ведущих бакинских школ',
        ],
        tactics: [
          'Статус Founding Mentor для первых 50 педагогов с 0% комиссией на старте',
          'Упаковка кейсов учеников («+150 баллов на DİM») прямо в карточку',
          'Карта по районам и метро для быстрых очных занятий рядом с домом',
        ],
        targetKpi: '50 менторов · 300 пробных · 68% конверсия',
      },
      {
        id: 'phase2',
        badge: 'Фаза 02',
        window: 'Мес 3–6 · Контент-воронка',
        title: 'Масштабирование через бесплатную диагностику в Сумгаит и Гянджу',
        focusCity: 'Баку + Сумгаит + Гянджа (Гибрид)',
        summary:
          'Вместо дорогой прямой рекламы — бесплатный интерактивный тест по пробелам DİM, который органически переводит ученика в каталог.',
        channels: [
          'Reels / TikTok разборы «ловушек экзамена DİM за 10 секунд»',
          'SEO по предметам и пробным тестам DİM',
          'Реферальный бонус «Приведи одноклассника»',
        ],
        tactics: [
          'После теста ученик получает карту слабых тем и топ-3 подходящих репетитора',
          'Автоматический прогресс-отчёт для родителей каждые 4 недели',
          'Подключение сильных преподавателей лицеев Сумгаита и Гянджи',
        ],
        targetKpi: '250 менторов · 4,000+ тестов · 26K ₼ GMV/мес',
      },
      {
        id: 'phase3',
        badge: 'Фаза 03',
        window: 'Мес 6–12 · Экосистема и PRO',
        title: 'Онлайн-доступ в регионы и SaaS-подписка EduMatch PRO',
        focusCity: 'Весь Азербайджан (Онлайн + региональные хабы)',
        summary:
          'Регионы получают доступ к лучшим педагогам Баку онлайн, а менторы — рабочую CRM, расписание и аналитику внутри подписки PRO.',
        channels: [
          'Олимпиадные онлайн-партнёрства со школами регионов',
          'B2B-кабинет EduMatch PRO для учёта уроков и оплат',
          'Годовые абонементы подготовки к DİM и мини-группы',
        ],
        tactics: [
          'Подписка PRO (19 ₼/мес): аналитика, напоминания об оплате и приоритет выдачи',
          'Мини-группы 2–4 человека снижают цену для семьи на 35%',
          'Накопление верифицированной базы отзывов к новому приёмному сезону',
        ],
        targetKpi: '800+ активных пар · 90K+ ₼ GMV · 16K+ ₼ выручка',
      },
    ],
    moatHeading: 'Почему побеждает EduMatch',
    moatSubheading: 'Доски объявлений продают контакт; EduMatch продаёт предсказуемый результат',
    colCriterion: 'Критерий',
    colInformal: 'Instagram / Сарафан',
    colClassifieds: 'Обычные доски объявлений',
    colEdumatch: 'Платформа EduMatch',
    comparisonRows: [
      {
        criterion: 'Доверие к педагогу',
        informal: 'Субъективные советы без цифр',
        classifieds: 'Просто фото диплома или самоописание',
        edumatch: 'Балл DİM по шкале 700 + вуз + прогресс прошлых учеников',
      },
      {
        criterion: 'Скорость подбора',
        informal: '2–3 недели на созвоны и ошибки',
        classifieds: 'Сотни однотипных карточек без фильтров целей',
        edumatch: 'Диагностика за 15 сек + 3–5 лучших совпадений',
      },
      {
        criterion: 'Риск первого урока',
        informal: 'Сразу оплата за месяц вперёд',
        classifieds: 'Нет гарантий, высокая доля отказов',
        edumatch: 'Бесплатный пробный урок 0 ₼ и сравнение VS',
      },
      {
        criterion: 'Вовлечённость',
        informal: 'Учёт уроков в блокноте и чатах',
        classifieds: 'После обмена номерами платформа не нужна',
        edumatch: 'Расписание, чат, отчёты прогресса и PRO-инструменты',
      },
    ],
    calcHeading: 'Калькулятор Unit-экономики и выручки',
    calcSubheading: 'Двигайте ползунки, чтобы смоделировать оборот рынка (GMV) и доход платформы в реальном времени',
    presetsLabel: 'Быстрый сценарий:',
    presets: [
      { id: 'launch', label: 'Запуск (Мес 2)', tutors: 50, lessonsPerWeek: 8, avgPrice: 22, proShare: 15 },
      { id: 'growth', label: 'Рост (Мес 6)', tutors: 180, lessonsPerWeek: 11, avgPrice: 24, proShare: 32 },
      { id: 'scale', label: 'Масштаб (Мес 12)', tutors: 520, lessonsPerWeek: 13, avgPrice: 26, proShare: 48 },
    ],
    sliderTutors: 'Активных репетиторов',
    sliderLessons: 'Уроков в неделю на репетитора',
    sliderPrice: 'Средний чек урока (₼)',
    sliderProShare: 'Доля тарифа PRO (%)',
    outGmv: 'Месячный оборот (GMV)',
    outPlatformRev: 'Чистая выручка платформы',
    outCommissionHint: '12% комиссия',
    outProHint: '19 ₼ PRO SaaS',
    outTutorPayout: 'Средний доход репетитора / мес',
    outLtvCac: 'Расчётный LTV / CAC',
    outLtvCacHint: 'при удержании 6 мес и CAC 42 ₼',
    formulaNote:
      'Формула: Уроки/мес = репетиторы × уроки/нед × 4.3 · Комиссия = GMV × 12% · PRO MRR = PRO-менторы × 19 ₼.',
    ctaCatalog: 'Открыть каталог репетиторов',
    ctaQuiz: 'Пройти диагностический тест',
  },
  en: {
    badge: 'GO-TO-MARKET · STRATEGY & LOGIC',
    title: 'Go-To-Market Strategy & Product Logic',
    subtitle:
      'Replacing blind word-of-mouth tutor hunting in Azerbaijan with verified DİM scores, free diagnostics, and transparent unit economics.',
    highlights: [
      {
        label: 'Primary Growth Wedge',
        value: '0 ₼ Diagnostic',
        hint: 'Students identify exam gaps first, then match with proven specialists',
      },
      {
        label: 'Revenue Engine',
        value: '12% + 19 ₼ PRO',
        hint: 'Take-rate on booked lessons paired with recurring tutor SaaS tools',
      },
      {
        label: 'Target LTV / CAC',
        value: '5.4x · 8.5 mo',
        hint: 'Multi-quarter exam prep cycle drives strong retention & referrals',
      },
    ],
    flowHeading: 'Product logic & conversion loop',
    flowSubheading: 'Every interaction removes parent uncertainty and drives risk-free trial bookings',
    flowSteps: [
      {
        step: '01',
        tag: 'Trust Gate',
        title: 'Credential & DİM score audit',
        description:
          'Every mentor verifies university faculty, 700-scale entrance score (640–695), and historical student score gains.',
        metric: '100% verified supply',
      },
      {
        step: '02',
        tag: 'Precision Match',
        title: 'Diagnostic + hyper-local filtering',
        description:
          'Quick level quiz plus metro/city radius (Baku, Sumgayit, Ganja + Online) narrows 100 profiles to top 3–5 matches.',
        metric: '15s time to shortlist',
      },
      {
        step: '03',
        tag: 'Zero-Risk Trial',
        title: 'Head-to-head VS + 0 ₼ trial class',
        description:
          'Families compare 3 mentors side by side and book a free live diagnostic session with zero upfront commitment.',
        metric: '~68% trial-to-paid conversion',
      },
      {
        step: '04',
        tag: 'Compounding Loop',
        title: 'Outcome-driven parent referrals',
        description:
          'Documented +140 score gains power social proof and organic referrals inside Azerbaijani school parent groups.',
        metric: 'Low blended CAC · High LTV',
      },
    ],
    roadmapHeading: '3-Phase Rollout Across Azerbaijan',
    roadmapSubheading: 'Sequenced expansion from a dense Baku core to nationwide coverage without burning paid ad spend',
    channelsLabel: 'Acquisition channels',
    tacticsLabel: 'Execution playbook',
    kpiLabel: 'Phase milestone',
    phases: [
      {
        id: 'phase1',
        badge: 'Phase 01',
        window: 'Month 1–2 · Baku Core',
        title: 'Hyper-dense supply around Baku metro hubs & top faculties',
        focusCity: 'Baku (Elmlar, 28 May, Ganjlik, Narimanov)',
        summary:
          'Curated launch with 50 vetted top mentors across Math, Physics, Chemistry, and CS to nail quality and early trial conversion.',
        channels: [
          'BSU, BHOS, UFAZ, ADA & ASOIU honor graduates',
          'Applicant Telegram & WhatsApp study communities',
          'Direct parent-to-parent high-school referrals',
        ],
        tactics: [
          '0% launch commission "Founding Mentor" badge for the first 50 verified tutors',
          'Result cards spotlighting real student score deltas ("+150 avg DİM gain")',
          'Interactive street map for 15-minute in-person commute matching',
        ],
        targetKpi: '50 vetted mentors · 300 trials · 68% conversion',
      },
      {
        id: 'phase2',
        badge: 'Phase 02',
        window: 'Month 3–6 · Quiz Funnel',
        title: 'Free DİM Diagnostic funnel & Sumgayit / Ganja expansion',
        focusCity: 'Baku + Sumgayit + Ganja (Hybrid)',
        summary:
          'Interactive micro-quizzes act as a zero-CAC top-of-funnel engine, turning exam anxiety straight into high-intent tutor matches.',
        channels: [
          'Reels / TikTok "10s DİM exam traps" short videos',
          'Programmatic subject & exam-prep diagnostic SEO',
          'Student referral credit for inviting classmates',
        ],
        tactics: [
          'Instant topic gap breakdown + personalized top-3 mentor shortlist post-quiz',
          'Automated monthly parent progress digest to lock in multi-month retention',
          'Onboarding leading lyceum teachers in Sumgayit and Ganja',
        ],
        targetKpi: '250 tutors · 4,000+ quizzes · 26K ₼ monthly GMV',
      },
      {
        id: 'phase3',
        badge: 'Phase 03',
        window: 'Month 6–12 · Nationwide PRO',
        title: 'Regional online access & EduMatch PRO tutor SaaS',
        focusCity: 'All Azerbaijan (Online + Regional Hubs)',
        summary:
          'Regions unlock Baku’s highest-scoring mentors online while teachers adopt EduMatch PRO CRM, scheduling, and group cohorts.',
        channels: [
          'Regional high-school Olympiad & mock-exam partnerships',
          'EduMatch PRO SaaS workspace for independent mentors',
          'Seasonal exam-prep bundles & small-group classes',
        ],
        tactics: [
          'PRO plan (19 ₼/mo): student analytics, payment reminders & boosted placement',
          '2–4 student micro-groups cut family per-lesson cost by 35%',
          'Verified alumni outcome archive compounds ahead of next admissions cycle',
        ],
        targetKpi: '800+ active pairs · 90K+ ₼ GMV · 16K+ ₼ net rev',
      },
    ],
    moatHeading: 'Competitive Positioning Matrix',
    moatSubheading: 'Classifieds sell phone numbers; EduMatch sells verified outcomes',
    colCriterion: 'Dimension',
    colInformal: 'Instagram / Word-of-Mouth',
    colClassifieds: 'Generic Classifieds',
    colEdumatch: 'EduMatch Platform',
    comparisonRows: [
      {
        criterion: 'Mentor verification',
        informal: 'Anecdotal claims, no audit',
        classifieds: 'Self-written ads or paid boosts',
        edumatch: 'Verified 700-scale DİM score, uni faculty & student delta',
      },
      {
        criterion: 'Matching efficiency',
        informal: '2–3 weeks of trial & error',
        classifieds: 'Endless unranked feed with zero fit score',
        edumatch: '15s diagnostic quiz + top 3 fit & radius matches',
      },
      {
        criterion: 'Booking risk',
        informal: 'Full month upfront with zero benchmark',
        classifieds: 'High drop-off due to opaque pricing/quality',
        edumatch: 'Free 0 ₼ live trial + side-by-side VS comparison',
      },
      {
        criterion: 'Workflow & retention',
        informal: 'Tracked manually in chats',
        classifieds: 'Platform churns after phone exchange',
        edumatch: 'Schedule, messaging, outcome proofs & PRO SaaS tools',
      },
    ],
    calcHeading: 'Live Unit Economics & Revenue Simulator',
    calcSubheading: 'Adjust marketplace sliders to inspect monthly GMV, platform revenue, and tutor take-home economics',
    presetsLabel: 'Scenario preset:',
    presets: [
      { id: 'launch', label: 'Launch (M2)', tutors: 50, lessonsPerWeek: 8, avgPrice: 22, proShare: 15 },
      { id: 'growth', label: 'Growth (M6)', tutors: 180, lessonsPerWeek: 11, avgPrice: 24, proShare: 32 },
      { id: 'scale', label: 'Scale (M12)', tutors: 520, lessonsPerWeek: 13, avgPrice: 26, proShare: 48 },
    ],
    sliderTutors: 'Active tutors on platform',
    sliderLessons: 'Paid lessons / tutor / week',
    sliderPrice: 'Avg lesson rate (₼)',
    sliderProShare: 'PRO subscriber adoption (%)',
    outGmv: 'Monthly Marketplace GMV',
    outPlatformRev: 'Monthly Platform Net Revenue',
    outCommissionHint: '12% take-rate',
    outProHint: '19 ₼ PRO SaaS',
    outTutorPayout: 'Avg Tutor Monthly Net Earnings',
    outLtvCac: 'Projected LTV / CAC',
    outLtvCacHint: 'Assuming 6-mo avg tenure & 42 ₼ blended CAC',
    formulaNote:
      'Math: Monthly Lessons = tutors × lessons/wk × 4.3 · Commission = GMV × 12% · PRO MRR = PRO tutors × 19 ₼.',
    ctaCatalog: 'Explore Tutor Catalog',
    ctaQuiz: 'Try Diagnostic Quiz',
  },
};
