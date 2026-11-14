import type {
  CityId,
  GradeId,
  LessonFormatId,
  LevelId,
  Locale,
  RequestStatus,
  SectorCode,
  SubjectId,
  TeachingLanguageId,
  TeachingStyleId,
} from '@/types/edumatch';

export const SUBJECT_LABELS: Record<SubjectId, Record<Locale, string>> = {
  Математика: { ru: 'Математика', az: 'Riyaziyyat', en: 'Mathematics' },
  Физика: { ru: 'Физика', az: 'Fizika', en: 'Physics' },
  Химия: { ru: 'Химия', az: 'Kimya', en: 'Chemistry' },
  'Английский язык': { ru: 'Английский язык', az: 'İngilis dili', en: 'English' },
  'Азербайджанский язык': {
    ru: 'Азербайджанский язык',
    az: 'Azərbaycan dili',
    en: 'Azerbaijani',
  },
  Информатика: { ru: 'Информатика', az: 'İnformatika', en: 'Computer Science' },
};

export const GRADE_LABELS: Record<GradeId, Record<Locale, string>> = {
  '1–4 класс': { ru: '1–4 класс', az: '1–4 sinif', en: 'Grades 1–4' },
  '5–8 класс': { ru: '5–8 класс', az: '5–8 sinif', en: 'Grades 5–8' },
  '9 класс': { ru: '9 класс', az: '9 sinif', en: 'Grade 9' },
  '10 класс': { ru: '10 класс', az: '10 sinif', en: 'Grade 10' },
  '11 класс': { ru: '11 класс', az: '11 sinif', en: 'Grade 11' },
  '1 курс': { ru: '1 курс', az: '1 kurs', en: 'Year 1' },
  '2–4 курс': { ru: '2–4 курс', az: '2–4 kurs', en: 'Years 2–4' },
};

export const LEVEL_LABELS: Record<LevelId, Record<Locale, string>> = {
  Начальный: { ru: 'Начальный', az: 'Başlanğıc', en: 'Beginner' },
  Средний: { ru: 'Средний', az: 'Orta', en: 'Intermediate' },
  Продвинутый: { ru: 'Продвинутый', az: 'Qabaqcıl', en: 'Advanced' },
};

export const STYLE_LABELS: Record<TeachingStyleId, Record<Locale, string>> = {
  Спокойный: { ru: 'Спокойный', az: 'Sakit', en: 'Calm' },
  'С юмором': { ru: 'С юмором', az: 'Yumorlu', en: 'Humorous' },
  Строгий: { ru: 'Строгий', az: 'Ciddi', en: 'Structured' },
  'На примерах': { ru: 'На примерах', az: 'Nümunələrlə', en: 'By Examples' },
  Мотивирует: { ru: 'Мотивирует', az: 'Motivasiya verir', en: 'Motivating' },
};

export const LANG_LABELS: Record<TeachingLanguageId, Record<Locale, string>> = {
  Азербайджанский: { ru: 'Азербайджанский', az: 'Azərbaycan', en: 'Azerbaijani' },
  Русский: { ru: 'Русский', az: 'Rus', en: 'Russian' },
  Английский: { ru: 'Английский', az: 'İngilis', en: 'English' },
};

export const FORMAT_LABELS: Record<LessonFormatId, Record<Locale, string>> = {
  Онлайн: { ru: 'Онлайн', az: 'Onlayn', en: 'Online' },
  Офлайн: { ru: 'Офлайн', az: 'Oflayn', en: 'In-person' },
};

export const CITY_LABELS: Record<CityId, Record<Locale, string>> = {
  Баку: { ru: 'Баку', az: 'Bakı', en: 'Baku' },
  Сумгайыт: { ru: 'Сумгайыт', az: 'Sumqayıt', en: 'Sumgait' },
  Гянджа: { ru: 'Гянджа', az: 'Gəncə', en: 'Ganja' },
};

export const STATUS_LABELS: Record<RequestStatus, Record<Locale, string>> = {
  new: { ru: 'Ожидает ответа', az: 'Cavab gözləyir', en: 'Awaiting reply' },
  accepted: { ru: 'Принято', az: 'Qəbul edildi', en: 'Accepted' },
  declined: { ru: 'Отклонено', az: 'Rədd edildi', en: 'Declined' },
  done: { ru: 'Урок проведён', az: 'Dərs keçirildi', en: 'Lesson completed' },
};

export function sectorLabel(sec: SectorCode, locale: Locale): string {
  const map: Record<Locale, string> = {
    ru: `${sec.toUpperCase()} сектор`,
    az: `${sec.toUpperCase()} sektor`,
    en: `${sec.toUpperCase()} sector`,
  };
  return map[locale];
}

export interface CopyBundle {
  brandTagline: string;
  nav: {
    student: string;
    teacher: string;
    search: string;
    test: string;
    lessons: string;
    inbox: string;
    students: string;
    profile: string;
    studio: string;
    premium: string;
    signIn: string;
    account: string;
    tour: string;
    themeToggle: string;
    langToggle: string;
    privacy: string;
    resetDemo: string;
    resetDone: string;
    footerLead: string;
  };
  hero: {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    subtitle: string;
    quickSubject: string;
    quickSector: string;
    quickFormat: string;
    ctaFind: string;
    ctaQuiz: string;
    ctaTour: string;
    ctaTeacher: string;
    metrics: { label: string; value: string }[];
    spotlightLabel: string;
    spotlightHint: string;
    admissionScoreLabel: string;
    strengthPrefix: string;
    inspectProfileCta: string;
    prevSlide: string;
    nextSlide: string;
    pauseAuto: string;
    resumeAuto: string;
    uspHeading: string;
    pillars: { title: string; desc: string }[];
  };
  search: {
    title: string;
    subtitle: string;
    filtersBtn: string;
    levelBannerDone: string;
    levelBannerPremiumHint: string;
    levelBannerPrompt: string;
    takeQuiz: string;
    modeFeed: string;
    modeSwipe: string;
    favorites: string;
    teachingStyle: string;
    allStyles: string;
    subject: string;
    grade: string;
    language: string;
    format: string;
    maxPrice: string;
    sort: string;
    any: string;
    sortMatch: string;
    sortDist: string;
    sortRating: string;
    sortPrice: string;
    found: string;
    leftCount: string;
    swipeEmptyTitle: string;
    swipeEmptySub: string;
    swipeReset: string;
    feedEmptyTitle: string;
    feedEmptySub: string;
    clearFilters: string;
    skip: string;
    like: string;
    trialShort: string;
  };
  tutorCard: {
    adBadge: string;
    reviews: string;
    certsVerified: string;
    fitsLevel: string;
    takesLevels: string;
    match: string;
    km: string;
    online: string;
    langPrefix: string;
    perLesson: string;
    freeTrial: string;
    profileBtn: string;
    messageBtn: string;
    universityScoreBadge: string;
    achievementsTitle: string;
    strengthTitle: string;
    clickNameHint: string;
  };
  profileModal: {
    close: string;
    verifiedAcademic: string;
    universityTitle: string;
    admissionScore: string;
    outOf: string;
    admissionYear: string;
    faculty: string;
    degree: string;
    grant: string;
    extraExam: string;
    achievementsSection: string;
    strengthsSection: string;
    differentiatorLead: string;
    bestForLabel: string;
    percentileLabel: string;
    tabs: {
      overview: string;
      videos: string;
      courses: string;
      tests: string;
      hw: string;
    };
    certsTitle: string;
    verified: string;
    reviewsTitle: string;
    noReviewsYet: string;
    free: string;
    inCourse: string;
    videosCount: string;
    purchasedNotice: string;
    buyCourse: string;
    noVideos: string;
    noCourses: string;
    noTests: string;
    questionsShort: string;
    takesFromLevel: string;
    takeTest: string;
    submittedOk: string;
    submittedPending: string;
    submitWork: string;
    yourAnswer: string;
    send: string;
    needAnswerOrFile: string;
    sentForReview: string;
    courseBoughtToast: string;
    demoPlayerNote: string;
    back: string;
  };
  radar: {
    locateMe: string;
    myLocation: string;
    radiusLabel: string;
    hint: string;
    geoUnavailable: string;
    geoUpdated: string;
    geoBlocked: string;
    selectedPreview: string;
    openProfile: string;
  };
  quiz: {
    bannerTitle: string;
    bannerSub: string;
    levelLabel: string;
    lastResult: string;
    chooseSubject: string;
    subjectHint: string;
    allSubjectsReady: string;
    questionOf: string;
    correct: string;
    wrong: string;
    resultTitle: string;
    scoreOutOf: string;
    savedNote: string;
    findTutors: string;
    retake: string;
    yourRank: string;
    nextRank: string;
    newRankTitle: string;
    stickerUnlocked: string;
    ok: string;
    achievements: {
      test: string;
      trial: string;
      review: string;
      streak: string;
    };
    thresholdTestTitle: string;
    thresholdLabel: string;
    passThreshold: string;
    belowThreshold: string;
    done: string;
    demoTag: string;
  };
  lessons: {
    bannerTitle: string;
    bannerSub: string;
    requestsTile: string;
    lessonsTile: string;
    xpTile: string;
    homeworkTitle: string;
    open: string;
    trialTag: string;
    openChat: string;
    markDone: string;
    yourReview: string;
    rateLesson: string;
    reviewPlaceholder: string;
    submitReview: string;
    emptyTitle: string;
    emptySub: string;
    searchCta: string;
    needStars: string;
    thanksReview: string;
    lessonDoneToast: string;
  };
  teacher: {
    inboxBannerTitle: string;
    inboxBannerSub: string;
    newTile: string;
    trialTile: string;
    fitTile: string;
    hiddenWarning: string;
    all: string;
    subject: string;
    type: string;
    typeTrial: string;
    typeRegular: string;
    level: string;
    sort: string;
    sortNew: string;
    sortCat: string;
    newBadge: string;
    stickerMsg: string;
    levelLocked: string;
    levelPrefix: string;
    notTested: string;
    matchesCriteria: string;
    accept: string;
    decline: string;
    noRequestsTitle: string;
    noRequestsSub: string;
    adPartnerTag: string;
    adPartnerTitle: string;
    adPartnerDesc: string;
    adPartnerCta: string;
    adPartnerToast: string;
    studentsBannerTitle: string;
    studentsBannerSub: string;
    studentsPremWarn: string;
    learnMore: string;
    sector: string;
    goal: string;
    inviteBtn: string;
    inviteLockedBtn: string;
    inviteSent: string;
    youDemoStudent: string;
    profileBannerTitle: string;
    profileBannerSub: string;
    visibleStatus: string;
    hiddenStatus: string;
    academicCardTitle: string;
    universityLabel: string;
    facultyLabel: string;
    admissionScoreLabel: string;
    admissionYearLabel: string;
    grantLabel: string;
    strengthsCardTitle: string;
    differentiatorLabel: string;
    bioLabel: string;
    saveAcademicBtn: string;
    savedToast: string;
    certsCardTitle: string;
    certPending: string;
    certApproveDemo: string;
    certPlaceholder: string;
    addBtn: string;
    certNote: string;
    subjectsLabel: string;
    gradesLabel: string;
    levelsLabel: string;
    stylesLabel: string;
    priceLabel: string;
    studioBannerTitle: string;
    studioBannerSub: string;
    addVideo: string;
    videoTitlePh: string;
    freeForAll: string;
    uploadBtn: string;
    needTitle: string;
    videoAdded: string;
    uploadedLabel: string;
    newCourse: string;
    courseTitlePh: string;
    coursePricePh: string;
    pickVideos: string;
    createCourse: string;
    needCourseFields: string;
    courseCreated: string;
    soldLabel: string;
    newTest: string;
    testTitlePh: string;
    acceptFromLevel: string;
    questionPh: string;
    optionPh: string;
    correctOption: string;
    addQuestion: string;
    publish: string;
    needQuestionFields: string;
    needTestFields: string;
    testPublished: string;
    thresholdTestsTitle: string;
    thresholdTestsDesc: string;
    demoTestBtn: string;
    unlockBuilderBtn: string;
    newHw: string;
    hwTitlePh: string;
    hwPtsPh: string;
    publishHw: string;
    needHwTitle: string;
    hwPublished: string;
    submittedWork: string;
    acceptXp: string;
    premiumBannerTitle: string;
    premiumBannerSub: string;
    premiumHeading: string;
    activeStatus: string;
    forTutors: string;
    premiumPerks: string[];
    plans: { label: string; price: string }[];
    buyBtn: string;
    promoHeading: string;
    promoDesc: string;
    promoActive: string;
    daysUnit: string;
    promo7: string;
    promo30: string;
    promoOff: string;
    premiumActivated: string;
    promoOnToast: string;
    promoOffToast: string;
  };
  chat: {
    close: string;
    trialChip: string;
    stickersAria: string;
    placeholder: string;
    sendAria: string;
    requestSentTrial: string;
    requestSentRegular: string;
    requestAlreadySent: string;
    autoReply: string;
    acceptAutoReply: string;
    declineToast: string;
    acceptToast: string;
  };
  modals: {
    premiumTitle: string;
    premiumLater: string;
    premiumDemoNote: string;
    privacyTitle: string;
    forStudents: string;
    forTutors: string;
    privacyDraftNote: string;
    tourStepLabel: string;
    tourSkip: string;
    tourNext: string;
    tourStart: string;
    tourSlides: { title: string; desc: string; iconKey: string }[];
    authCreateTitle: string;
    authLoginTitle: string;
    authGuest: string;
    authStudent: string;
    authTutor: string;
    authName: string;
    authContact: string;
    authPassword: string;
    authWhere: string;
    authDetect: string;
    authSector: string;
    authGrade: string;
    authTeachLangs: string;
    authAccept: string;
    authPrivacyLink: string;
    authMinorNote: string;
    authSubmitCreate: string;
    authSubmitLogin: string;
    authHasAccount: string;
    authNewHere: string;
    authToLogin: string;
    authToSignUp: string;
    authErrContact: string;
    authErrPolicy: string;
    welcomeToast: string;
  };
}

export const COPY: Record<Locale, CopyBundle> = {
  ru: {
    brandTagline: 'Образовательный маркетплейс',
    nav: {
      student: 'Ученик',
      teacher: 'Преподаватель',
      search: 'Поиск',
      test: 'Тест',
      lessons: 'Занятия',
      inbox: 'Заявки',
      students: 'Ученики',
      profile: 'Профиль',
      studio: 'Студия',
      premium: 'Премиум',
      signIn: 'Войти',
      account: 'Аккаунт',
      tour: 'Гид',
      themeToggle: 'Переключить тему',
      langToggle: 'Язык интерфейса',
      privacy: 'Политика конфиденциальности',
      resetDemo: 'Сбросить данные',
      resetDone: 'Данные восстановлены',
      footerLead: 'Прозрачный академический отбор репетиторов в Азербайджане.',
    },
    hero: {
      eyebrow: 'Азербайджан · Баку, Сумгайыт, Гянджа · Секторы AZ / RU / EN',
      titleStart: 'Выбирайте репетитора по ',
      titleAccent: 'реальным баллам',
      titleEnd: ', вузу и результатам учеников',
      subtitle:
        'Нажмите на имя любого преподавателя, чтобы увидеть его университет, балл поступления на DİM, сильные стороны и подтверждённые достижения учеников.',
      quickSubject: 'Предмет',
      quickSector: 'Сектор / язык',
      quickFormat: 'Формат',
      ctaFind: 'Подобрать репетитора',
      ctaQuiz: 'Пройти тест уровня',
      ctaTour: 'Как работает',
      ctaTeacher: 'Я преподаватель',
      metrics: [
        { value: '+145', label: 'средний прирост баллов учеников' },
        { value: '94%', label: 'учеников поступают в целевой вуз' },
        { value: '100%', label: 'дипломы и баллы проверены' },
      ],
      spotlightLabel: 'Топ-преподаватель недели',
      spotlightHint: 'Кликните на имя для полной карты вуза и баллов',
      admissionScoreLabel: 'Балл поступления',
      strengthPrefix: 'Чем отличается',
      inspectProfileCta: 'Открыть досье',
      prevSlide: 'Предыдущий преподаватель',
      nextSlide: 'Следующий преподаватель',
      pauseAuto: 'Пауза',
      resumeAuto: 'Автопоказ',
      uspHeading: 'Почему EduMatch — не доска объявлений',
      pillars: [
        {
          title: 'Вуз и балл поступления',
          desc: 'Открытая академическая история: университет, факультет, грант и точный балл поступления.',
        },
        {
          title: 'Успехи и кейсы учеников',
          desc: 'Измеримые результаты: сколько учеников набрали 600+, сдали IELTS или выиграли олимпиаду.',
        },
        {
          title: 'Сильные стороны и отличие',
          desc: 'Чёткое понимание методики: чем преподаватель отличается от других и кому подходит быстрее.',
        },
      ],
    },
    search: {
      title: 'Поиск репетитора',
      subtitle: 'Проверенные преподаватели. Пробный урок — бесплатно.',
      filtersBtn: 'Фильтры',
      levelBannerDone: 'Ваш уровень после теста:',
      levelBannerPremiumHint: 'Преподаватели с Премиумом видят его автоматически.',
      levelBannerPrompt: 'Пройдите короткий тест уровня — мы точнее подберём преподавателя и покажем % совпадения.',
      takeQuiz: 'Пройти тест',
      modeFeed: 'Лента',
      modeSwipe: 'Свайп',
      favorites: 'Избранное',
      teachingStyle: 'Стиль преподавания',
      allStyles: 'Любой стиль',
      subject: 'Предмет',
      grade: 'Класс / курс',
      language: 'Язык обучения',
      format: 'Формат',
      maxPrice: 'Цена до, ₼',
      sort: 'Сортировка',
      any: 'Любой',
      sortMatch: 'Лучшее совпадение',
      sortDist: 'Ближе ко мне',
      sortRating: 'По рейтингу',
      sortPrice: 'По цене',
      found: 'Найдено преподавателей:',
      leftCount: 'Осталось в подборке:',
      swipeEmptyTitle: 'Вы посмотрели всех преподавателей по фильтрам',
      swipeEmptySub: 'Загляните в избранное или расширьте параметры поиска.',
      swipeReset: 'Смотреть сначала',
      feedEmptyTitle: 'По этим фильтрам никого не нашлось',
      feedEmptySub: 'Попробуйте увеличить максимальную цену, радиус или сменить стиль.',
      clearFilters: 'Сбросить фильтры',
      skip: 'Пропустить',
      like: 'В избранное',
      trialShort: 'Пробный урок',
    },
    tutorCard: {
      adBadge: 'Реклама',
      reviews: 'отзывов',
      certsVerified: 'Сертификатов:',
      fitsLevel: 'Подходит вашему уровню',
      takesLevels: 'Уровни:',
      match: 'совпадение',
      km: 'км',
      online: 'Онлайн',
      langPrefix: 'Языки:',
      perLesson: 'за урок',
      freeTrial: 'Пробный урок — 0 ₼',
      profileBtn: 'Досье и баллы',
      messageBtn: 'Написать',
      universityScoreBadge: 'балл',
      achievementsTitle: 'Успехи',
      strengthTitle: 'Сильная сторона и отличие',
      clickNameHint: 'Нажмите, чтобы увидеть вуз и балл поступления',
    },
    profileModal: {
      close: 'Закрыть',
      verifiedAcademic: 'Профиль и диплом проверены',
      universityTitle: 'Университет и балл поступления',
      admissionScore: 'Балл поступления',
      outOf: 'из',
      admissionYear: 'Год поступления',
      faculty: 'Факультет / программа',
      degree: 'Степень / статус',
      grant: 'Стипендия / форма',
      extraExam: 'Доп. результат',
      achievementsSection: 'Успехи и достижения учеников',
      strengthsSection: 'Сильные стороны — чем отличается от других',
      differentiatorLead: 'Ключевое отличие',
      bestForLabel: 'Кому подходит лучше всего',
      percentileLabel: 'Процентиль поступления',
      tabs: {
        overview: 'Вуз, успехи и отзывы',
        videos: 'Видео',
        courses: 'Курсы',
        tests: 'Тесты',
        hw: 'ДЗ',
      },
      certsTitle: 'Дипломы и сертификаты',
      verified: 'Подтверждён',
      reviewsTitle: 'Отзывы учеников',
      noReviewsYet: 'Отзывы появятся после первых проведённых уроков.',
      free: 'Бесплатно',
      inCourse: 'В курсе',
      videosCount: 'видео',
      purchasedNotice: 'Курс куплен — все видео разблокированы во вкладке «Видео»',
      buyCourse: 'Купить курс',
      noVideos: 'Видео пока нет',
      noCourses: 'Курсов пока нет',
      noTests: 'Тестов пока нет',
      questionsShort: 'вопр.',
      takesFromLevel: 'Берёт от уровня',
      takeTest: 'Пройти тест',
      submittedOk: 'Принято, баллы начислены',
      submittedPending: 'На проверке',
      submitWork: 'Сдать работу',
      yourAnswer: 'Ваш ответ или решение',
      send: 'Отправить',
      needAnswerOrFile: 'Добавьте текстовый ответ или прикрепите файл',
      sentForReview: 'Отправлено на проверку',
      courseBoughtToast: 'Курс добавлен в библиотеку',
      demoPlayerNote: 'Встроенный HD-плеер для открытых и авторских уроков преподавателя',
      back: 'Назад',
    },
    radar: {
      locateMe: 'Определить меня',
      myLocation: 'Моё местоположение',
      radiusLabel: 'Радиус поиска',
      hint: 'Нажмите на метку на карте, чтобы увидеть преподавателя. Для онлайн-формата расстояние не ограничивает выбор.',
      geoUnavailable: 'Геолокация недоступна — выберите город',
      geoUpdated: 'Местоположение обновлено',
      geoBlocked: 'Нет доступа к геолокации — выберите город',
      selectedPreview: 'Выбран на карте',
      openProfile: 'Открыть досье',
    },
    quiz: {
      bannerTitle: 'Диагностика уровня',
      bannerSub: '6 вопросов по предмету · около 3 минут · влияет на % совпадения',
      levelLabel: 'Уровень',
      lastResult: 'Последний результат:',
      chooseSubject: 'Выберите предмет для проверки',
      subjectHint: 'Результат сохраняется и повышает точность подбора преподавателей.',
      allSubjectsReady: 'Доступны тесты по всем 6 предметам программы.',
      questionOf: 'Вопрос',
      correct: 'Верно! +10 XP',
      wrong: 'Не страшно, идём дальше',
      resultTitle: 'уровень',
      scoreOutOf: 'из 6 верно',
      savedNote: 'Результат сохранён и помогает подбирать репетиторов под ваш темп.',
      findTutors: 'Найти преподавателей',
      retake: 'Пройти снова',
      yourRank: 'Ваш ранг',
      nextRank: 'До следующего ранга',
      newRankTitle: 'Новый ранг!',
      stickerUnlocked: 'В чате разблокирован новый значок реакции',
      ok: 'Отлично',
      achievements: {
        test: 'Первый тест',
        trial: 'Пробный урок',
        review: 'Первый отзыв',
        streak: 'Серия 3 дня',
      },
      thresholdTestTitle: 'Входной тест преподавателя',
      thresholdLabel: 'Порог',
      passThreshold: 'Вы проходите порог преподавателя',
      belowThreshold: 'Преподаватель берёт учеников с уровня',
      done: 'Готово',
      demoTag: 'Проверка',
    },
    lessons: {
      bannerTitle: 'Мои занятия и прогресс',
      bannerSub: 'Активные заявки, чаты, домашние задания и отзывы',
      requestsTile: 'заявок',
      lessonsTile: 'уроков',
      xpTile: 'XP',
      homeworkTitle: 'Домашние задания от репетиторов',
      open: 'Открыть',
      trialTag: 'пробный урок (бесплатно)',
      openChat: 'Открыть чат',
      markDone: 'Отметить урок завершённым',
      yourReview: 'Ваш отзыв:',
      rateLesson: 'Оцените урок',
      reviewPlaceholder: 'Что понравилось? Как преподаватель объяснял материал?',
      submitReview: 'Отправить отзыв',
      emptyTitle: 'Пока нет активных заявок',
      emptySub: 'Найдите преподавателя, изучите его балл и успехи и запишитесь на бесплатный пробный урок.',
      searchCta: 'Перейти к поиску',
      needStars: 'Поставьте оценку звёздами',
      thanksReview: 'Спасибо за отзыв! +15 XP',
      lessonDoneToast: 'Урок отмечен как проведённый',
    },
    teacher: {
      inboxBannerTitle: 'Кабинет преподавателя: заявки',
      inboxBannerSub: 'Сортируйте входящие запросы по классу, предмету и формату',
      newTile: 'новых',
      trialTile: 'пробных',
      fitTile: 'подходят',
      hiddenWarning:
        'Профиль скрыт из поиска: нужен хотя бы один подтверждённый диплом или сертификат в разделе «Профиль».',
      all: 'Все',
      subject: 'Предмет',
      type: 'Тип заявки',
      typeTrial: 'Пробный урок',
      typeRegular: 'Обычные',
      level: 'Уровень',
      sort: 'Сортировка',
      sortNew: 'Сначала новые',
      sortCat: 'По классу / курсу',
      newBadge: 'Новая',
      stickerMsg: 'Отправлена реакция',
      levelLocked: 'Уровень — Премиум',
      levelPrefix: 'Уровень:',
      notTested: 'тест не пройден',
      matchesCriteria: 'Подходит под ваши критерии',
      accept: 'Принять',
      decline: 'Отклонить',
      noRequestsTitle: 'Заявок по фильтрам нет',
      noRequestsSub: 'Попробуйте сбросить фильтры сверху.',
      adPartnerTag: 'Партнёр',
      adPartnerTitle: 'Курс «Современные методики преподавания»',
      adPartnerDesc: '4-недельная онлайн-программа повышения квалификации для преподавателей.',
      adPartnerCta: 'Подробнее',
      adPartnerToast: 'Программа доступна на странице партнёра курса',
      studentsBannerTitle: 'Каталог учеников',
      studentsBannerSub: 'Выбирайте учеников по сектору, классу и результату диагностики',
      studentsPremWarn: 'Уровни после тестирования и прямые приглашения доступны с Премиумом.',
      learnMore: 'Подробнее',
      sector: 'Сектор',
      goal: 'Цель:',
      inviteBtn: 'Пригласить на занятие',
      inviteLockedBtn: 'Приглашение — Премиум',
      inviteSent: 'Приглашение отправлено:',
      youDemoStudent: 'Ваш профиль ученика',
      profileBannerTitle: 'Публичное досье преподавателя',
      profileBannerSub: 'Управляйте вузом, баллом поступления, отличиями и сертификатами',
      visibleStatus: 'Профиль открыт в поиске: сертификаты подтверждены.',
      hiddenStatus: 'Профиль скрыт: добавьте и подтвердите хотя бы один сертификат или диплом.',
      academicCardTitle: 'Образование и балл поступления',
      universityLabel: 'Университет',
      facultyLabel: 'Факультет / специальность',
      admissionScoreLabel: 'Балл поступления (из 700)',
      admissionYearLabel: 'Год поступления',
      grantLabel: 'Грант / стипендия',
      strengthsCardTitle: 'Сильные стороны и отличие от других',
      differentiatorLabel: 'Чем вы отличаетесь (видят ученики в карточке)',
      bioLabel: 'Кратко о себе',
      saveAcademicBtn: 'Сохранить досье',
      savedToast: 'Данные профиля обновлены',
      certsCardTitle: 'Сертификаты и дипломы',
      certPending: 'На проверке',
      certApproveDemo: 'Подтвердить',
      certPlaceholder: 'Например, «IELTS 8.0» или «Олимпиада RFO»',
      addBtn: 'Добавить',
      certNote: 'Проверка оригиналов документов командой EduMatch происходит в продакшен-версии.',
      subjectsLabel: 'Предметы',
      gradesLabel: 'Классы и курсы',
      levelsLabel: 'Уровни учеников',
      stylesLabel: 'Стиль преподавания',
      priceLabel: 'Цена за урок, ₼',
      studioBannerTitle: 'Студия контента',
      studioBannerSub: 'Видеоуроки, авторские курсы, тесты с порогом и проверка ДЗ',
      addVideo: 'Добавить видеоурок',
      videoTitlePh: 'Название урока',
      freeForAll: 'Бесплатный открытый урок (виден до оплаты)',
      uploadBtn: 'Добавить видео',
      needTitle: 'Введите название урока',
      videoAdded: 'Видео добавлено в библиотеку',
      uploadedLabel: 'файл загружен',
      newCourse: 'Собрать курс из видео',
      courseTitlePh: 'Название курса',
      coursePricePh: 'Цена, ₼',
      pickVideos: 'Выберите уроки для курса',
      createCourse: 'Создать курс',
      needCourseFields: 'Укажите название, цену и хотя бы одно видео',
      courseCreated: 'Курс опубликован',
      soldLabel: 'покупок',
      newTest: 'Конструктор входного теста',
      testTitlePh: 'Название теста',
      acceptFromLevel: 'Принимать учеников от уровня',
      questionPh: 'Текст вопроса',
      optionPh: 'Вариант',
      correctOption: 'Номер верного варианта',
      addQuestion: 'Добавить вопрос',
      publish: 'Опубликовать тест',
      needQuestionFields: 'Заполните вопрос и все 4 варианта ответа',
      needTestFields: 'Укажите название теста и минимум 1 вопрос',
      testPublished: 'Тест опубликован в вашем досье',
      thresholdTestsTitle: 'Тесты с порогом уровня',
      thresholdTestsDesc:
        'Создавайте собственные тесты и задавайте минимальный уровень, с которого берёте учеников. Проверьте тест глазами ученика:',
      demoTestBtn: 'Предпросмотр теста',
      unlockBuilderBtn: 'Открыть конструктор (Премиум)',
      newHw: 'Новое домашнее задание',
      hwTitlePh: 'Описание задания',
      hwPtsPh: 'Награда в XP',
      publishHw: 'Опубликовать задание',
      needHwTitle: 'Введите текст задания',
      hwPublished: 'Домашнее задание опубликовано',
      submittedWork: 'Сданные работы учеников',
      acceptXp: 'Принять',
      premiumBannerTitle: 'Премиум и продвижение',
      premiumBannerSub: 'Расширенная аналитика уровня учеников и приоритет в выдаче',
      premiumHeading: 'Премиум для преподавателей',
      activeStatus: 'активен',
      forTutors: 'Pro-инструменты',
      premiumPerks: [
        'Видите точный уровень ученика после прохождения теста',
        'Фильтр входящих заявок по уровню знаний',
        'Доступ к каталогу учеников и прямые приглашения',
        'Подсветка заявок, идеально подходящих под ваши критерии',
        'Конструктор собственных тестов с порогом уровня',
      ],
      plans: [
        { label: '1 месяц', price: '19 ₼' },
        { label: '3 месяца', price: '49 ₼' },
        { label: '12 месяцев', price: '149 ₼' },
      ],
      buyBtn: 'Подключить',
      promoHeading: 'Продвижение профиля',
      promoDesc: 'Ваша карточка поднимется на верхние позиции поиска с прозрачной пометкой «Реклама».',
      promoActive: 'Продвижение активно: осталось',
      daysUnit: 'дн.',
      promo7: '7 дней · 9 ₼',
      promo30: '30 дней · 29 ₼',
      promoOff: 'Отключить',
      premiumActivated: 'Премиум активирован',
      promoOnToast: 'Продвижение включено',
      promoOffToast: 'Продвижение отключено',
    },
    chat: {
      close: 'Закрыть',
      trialChip: 'Пробный урок',
      stickersAria: 'Быстрые реакции',
      placeholder: 'Напишите сообщение…',
      sendAria: 'Отправить',
      requestSentTrial: 'Запрос на пробный урок отправлен',
      requestSentRegular: 'Заявка отправлена преподавателю',
      requestAlreadySent: 'Диалог с преподавателем уже открыт',
      autoReply: 'Здравствуйте! Спасибо за заявку — давайте согласуем удобное время.',
      acceptAutoReply: 'Здравствуйте! Заявка принята, предлагаю обсудить расписание.',
      declineToast: 'Заявка отклонена',
      acceptToast: 'Заявка принята',
    },
    modals: {
      premiumTitle: 'Премиум для преподавателей',
      premiumLater: 'Позже',
      premiumDemoNote: 'Активируйте тариф в один клик — оплата через карту доступна при подключении.',
      privacyTitle: 'Политика конфиденциальности',
      forStudents: 'Ученикам',
      forTutors: 'Преподавателям',
      privacyDraftNote: 'Персональные настройки и сохранённые фильтры хранятся локально в вашем браузере.',
      tourStepLabel: 'Шаг',
      tourSkip: 'Закрыть',
      tourNext: 'Далее',
      tourStart: 'Начать подбор',
      tourSlides: [
        {
          title: 'Вуз, балл поступления и успехи — на виду',
          desc: 'Нажмите на имя любого репетитора, чтобы увидеть его университет, балл поступления (из 700), сильные стороны и реальные кейсы учеников.',
          iconKey: 'glasses',
        },
        {
          title: 'Радар рядом с вами + онлайн',
          desc: 'Ищите преподавателей в радиусе от 1 км в Баку, Сумгайыте или Гяндже, либо занимайтесь онлайн с лучшими баллами по всей стране.',
          iconKey: 'lens',
        },
        {
          title: 'Тест уровня, % совпадения и ваш сектор',
          desc: 'Секторы AZ, RU и EN, проверка документов, пробные уроки за 0 ₼ и диагностика уровня за 3 минуты.',
          iconKey: 'thumb',
        },
      ],
      authCreateTitle: 'Создайте профиль в EduMatch',
      authLoginTitle: 'С возвращением',
      authGuest: 'Продолжить гостем',
      authStudent: 'Я ученик',
      authTutor: 'Я преподаватель',
      authName: 'Имя и фамилия',
      authContact: 'Email или телефон',
      authPassword: 'Пароль',
      authWhere: 'Ваш город',
      authDetect: 'Определить',
      authSector: 'Сектор обучения',
      authGrade: 'Класс / курс',
      authTeachLangs: 'Языки преподавания (сектор)',
      authAccept: 'Я принимаю',
      authPrivacyLink: 'Политику конфиденциальности',
      authMinorNote: 'мне 16+ лет или есть согласие родителей',
      authSubmitCreate: 'Создать аккаунт',
      authSubmitLogin: 'Войти',
      authHasAccount: 'Уже есть аккаунт?',
      authNewHere: 'Впервые на платформе?',
      authToLogin: 'Войти',
      authToSignUp: 'Регистрация',
      authErrContact: 'Укажите имя и email или телефон',
      authErrPolicy: 'Примите политику конфиденциальности',
      welcomeToast: 'Добро пожаловать в EduMatch!',
    },
  },
  az: {
    brandTagline: 'Təhsil platforması',
    nav: {
      student: 'Şagird',
      teacher: 'Müəllim',
      search: 'Axtarış',
      test: 'Test',
      lessons: 'Dərslər',
      inbox: 'Sorğular',
      students: 'Şagirdlər',
      profile: 'Profil',
      studio: 'Studiya',
      premium: 'Premium',
      signIn: 'Daxil ol',
      account: 'Hesab',
      tour: 'Bələdçi',
      themeToggle: 'Tema dəyiş',
      langToggle: 'İnterfeys dili',
      privacy: 'Məxfilik siyasəti',
      resetDemo: 'Məlumatları sıfırla',
      resetDone: 'Məlumatlar yeniləndi',
      footerLead: 'Azərbaycanda müəllimlərin şəffaf akademik seçimi.',
    },
    hero: {
      eyebrow: 'Azərbaycan · Bakı, Sumqayıt, Gəncə · AZ / RU / EN sektorları',
      titleStart: 'Müəllimi ',
      titleAccent: 'qəbul balı',
      titleEnd: ', universiteti və şagird uğurlarına görə seçin',
      subtitle:
        'İstənilən müəllimin adına toxunun — hansı universitetə neçə balla qəbul olduğunu, güclü tərəflərini və şagird nəticələrini dərhal görün.',
      quickSubject: 'Fənn',
      quickSector: 'Sektor / dil',
      quickFormat: 'Format',
      ctaFind: 'Müəllim tap',
      ctaQuiz: 'Səviyyə testindən keç',
      ctaTour: 'Necə işləyir',
      ctaTeacher: 'Mən müəlliməm',
      metrics: [
        { value: '+145', label: 'şagirdlərin orta bal artımı' },
        { value: '94%', label: 'hədəf universitetə qəbul nəticəsi' },
        { value: '100%', label: 'diplom və ballar yoxlanılır' },
      ],
      spotlightLabel: 'Həftənin seçilən müəllimi',
      spotlightHint: 'Universitet və bal dosyesi üçün ada toxunun',
      admissionScoreLabel: 'Qəbul balı',
      strengthPrefix: 'Əsas fərqi',
      inspectProfileCta: 'Dosyeyə bax',
      prevSlide: 'Əvvəlki müəllim',
      nextSlide: 'Növbəti müəllim',
      pauseAuto: 'Dayandır',
      resumeAuto: 'Davam et',
      uspHeading: 'Niyə EduMatch adi elan saytı deyil',
      pillars: [
        {
          title: 'Universitet və qəbul balı',
          desc: 'Şəffaf akademik keçmiş: hansı universitetə, fakültəyə və neçə balla daxil olduğu görünür.',
        },
        {
          title: 'Şagird uğurları və nəticələr',
          desc: 'Ölçülən uğurlar: neçə şagird 600+ bal toplayıb, IELTS verib və ya olimpiada qazanıb.',
        },
        {
          title: 'Güclü tərəflər və fərqi',
          desc: 'Müəllimin başqalarından nə ilə fərqləndiyi və hansı şagirdlərə daha tez nəticə verdiyi.',
        },
      ],
    },
    search: {
      title: 'Repetitor axtarışı',
      subtitle: 'Yoxlanılmış müəllimlər. İlk sınaq dərsi pulsuzdur.',
      filtersBtn: 'Filtrlər',
      levelBannerDone: 'Testdən sonra səviyyəniz:',
      levelBannerPremiumHint: 'Premium müəllimlər bunu avtomatik görür.',
      levelBannerPrompt: 'Qısa səviyyə testindən keçin — sizə ən uyğun müəllimi və uyğunluq %-ni dəqiq hesablayacağıq.',
      takeQuiz: 'Testdən keç',
      modeFeed: 'Siyahı',
      modeSwipe: 'Svayp',
      favorites: 'Seçilmişlər',
      teachingStyle: 'Tədris üslubu',
      allStyles: 'İstənilən üslub',
      subject: 'Fənn',
      grade: 'Sinif / kurs',
      language: 'Tədris dili',
      format: 'Format',
      maxPrice: 'Maks. qiymət, ₼',
      sort: 'Sıralama',
      any: 'İstənilən',
      sortMatch: 'Ən yaxşı uyğunluq',
      sortDist: 'Mənə yaxın',
      sortRating: 'Reytinqə görə',
      sortPrice: 'Qiymətə görə',
      found: 'Tapılan müəllimlər:',
      leftCount: 'Siyahıda qalıb:',
      swipeEmptyTitle: 'Filtrlərə uyğun bütün müəllimlərə baxdınız',
      swipeEmptySub: 'Seçilmişlərə keçin və ya filtrləri genişləndirin.',
      swipeReset: 'Əvvəldən bax',
      feedEmptyTitle: 'Bu filtrlərlə heç kim tapılmadı',
      feedEmptySub: 'Maksimum qiyməti, radiusu artırın və ya üslubu dəyişin.',
      clearFilters: 'Filtrləri sıfırla',
      skip: 'Keç',
      like: 'Seçilmişlərə',
      trialShort: 'Sınaq dərsi',
    },
    tutorCard: {
      adBadge: 'Reklam',
      reviews: 'rəy',
      certsVerified: 'Sertifikatlar:',
      fitsLevel: 'Səviyyənizə uyğundur',
      takesLevels: 'Səviyyələr:',
      match: 'uyğunluq',
      km: 'km',
      online: 'Onlayn',
      langPrefix: 'Dillər:',
      perLesson: 'dərs',
      freeTrial: 'Sınaq dərsi — 0 ₼',
      profileBtn: 'Universitet və bal',
      messageBtn: 'Yaz',
      universityScoreBadge: 'bal',
      achievementsTitle: 'Uğurlar',
      strengthTitle: 'Güclü tərəfi və fərqi',
      clickNameHint: 'Universitet və qəbul balını görmək üçün toxunun',
    },
    profileModal: {
      close: 'Bağla',
      verifiedAcademic: 'Profil və diplom təsdiqlənib',
      universityTitle: 'Universitet və qəbul balı',
      admissionScore: 'Qəbul balı',
      outOf: 'baldan',
      admissionYear: 'Qəbul ili',
      faculty: 'Fakültə / ixtisas',
      degree: 'Dərəcə / status',
      grant: 'Təqaüd / təhsil forması',
      extraExam: 'Əlavə nəticə',
      achievementsSection: 'Uğurlar və şagird nəticələri',
      strengthsSection: 'Güclü tərəfləri — başqalarından fərqi',
      differentiatorLead: 'Əsas üstünlüyü',
      bestForLabel: 'Kimlər üçün idealdır',
      percentileLabel: 'Qəbul faizi',
      tabs: {
        overview: 'Universitet, uğur və rəylər',
        videos: 'Videolar',
        courses: 'Kurslar',
        tests: 'Testlər',
        hw: 'Ev tapş.',
      },
      certsTitle: 'Diplom və sertifikatlar',
      verified: 'Təsdiqlənib',
      reviewsTitle: 'Şagird rəyləri',
      noReviewsYet: 'İlk dərslərdən sonra rəylər burada görünəcək.',
      free: 'Pulsuz',
      inCourse: 'Kursdadır',
      videosCount: 'video',
      purchasedNotice: 'Kurs alındı — bütün videolar «Videolar» bölməsində açıldı',
      buyCourse: 'Kursu al',
      noVideos: 'Hələ video yoxdur',
      noCourses: 'Hələ kurs yoxdur',
      noTests: 'Hələ test yoxdur',
      questionsShort: 'sual',
      takesFromLevel: 'Qəbul həddi',
      takeTest: 'Testi keç',
      submittedOk: 'Qəbul edildi, xallar verildi',
      submittedPending: 'Yoxlanılır',
      submitWork: 'İşi təhvil ver',
      yourAnswer: 'Cavabınız və ya həlliniz',
      send: 'Göndər',
      needAnswerOrFile: 'Mətn cavabı yazın və ya fayl əlavə edin',
      sentForReview: 'Yoxlamaya göndərildi',
      courseBoughtToast: 'Kurs kitabxanaya əlavə edildi',
      demoPlayerNote: 'Müəllimin açıq və kurs videoları üçün daxili HD pleyer',
      back: 'Geri',
    },
    radar: {
      locateMe: 'Məni tap',
      myLocation: 'Mənim məkanım',
      radiusLabel: 'Axtarış radiusu',
      hint: 'Müəllimi görmək üçün xəritədəki nişana toxunun. Onlayn dərslərdə məsafə məhdudiyyəti yoxdur.',
      geoUnavailable: 'Geolokasiya əlçatan deyil — şəhər seçin',
      geoUpdated: 'Məkan yeniləndi',
      geoBlocked: 'Geolokasiyaya icazə verilmədi — şəhər seçin',
      selectedPreview: 'Xəritədə seçildi',
      openProfile: 'Dosyeni aç',
    },
    quiz: {
      bannerTitle: 'Səviyyə diaqnostikası',
      bannerSub: 'Fənn üzrə 6 sual · təxminən 3 dəqiqə · uyğunluq %-ni dəqiqləşdirir',
      levelLabel: 'Səviyyə',
      lastResult: 'Son nəticə:',
      chooseSubject: 'Yoxlamaq üçün fənn seçin',
      subjectHint: 'Nəticəniz yadda saxlanır və müəllim seçimini daha dəqiq edir.',
      allSubjectsReady: 'Bütün 6 fənn üzrə diaqnostika testləri aktivdir.',
      questionOf: 'Sual',
      correct: 'Düzdür! +10 XP',
      wrong: 'Zərər yoxdur, davam edək',
      resultTitle: 'səviyyə',
      scoreOutOf: '6 sualdan düzdür',
      savedNote: 'Nəticə yadda saxlandı və tempinizə uyğun müəllim tapmağa kömək edir.',
      findTutors: 'Müəllim tap',
      retake: 'Yenidən keç',
      yourRank: 'Rankınız',
      nextRank: 'Növbəti ranka',
      newRankTitle: 'Yeni rank!',
      stickerUnlocked: 'Çatda yeni reaksiya nişanı açıldı',
      ok: 'Əla',
      achievements: {
        test: 'İlk test',
        trial: 'Sınaq dərsi',
        review: 'İlk rəy',
        streak: '3 günlük seriya',
      },
      thresholdTestTitle: 'Müəllimin giriş testi',
      thresholdLabel: 'Hədd',
      passThreshold: 'Müəllimin tələb etdiyi həddi keçirsiniz',
      belowThreshold: 'Müəllim şagirdləri bu səviyyədən götürür:',
      done: 'Hazır',
      demoTag: 'Yoxlama',
    },
    lessons: {
      bannerTitle: 'Dərslərim və irəliləyiş',
      bannerSub: 'Aktiv sorğular, çatlar, ev tapşırıqları və rəylər',
      requestsTile: 'sorğu',
      lessonsTile: 'dərs',
      xpTile: 'XP',
      homeworkTitle: 'Müəllimlərin ev tapşırıqları',
      open: 'Aç',
      trialTag: 'sınaq dərsi (pulsuz)',
      openChat: 'Çatı aç',
      markDone: 'Dərsi tamamla',
      yourReview: 'Rəyiniz:',
      rateLesson: 'Dərsi qiymətləndirin',
      reviewPlaceholder: 'Nə xoşunuza gəldi? Müəllim mövzunu necə izah etdi?',
      submitReview: 'Rəyi göndər',
      emptyTitle: 'Hələ aktiv sorğu yoxdur',
      emptySub: 'Müəllim tapın, onun qəbul balı və uğurları ilə tanış olun, pulsuz sınaq dərsinə yazılın.',
      searchCta: 'Axtarışa keç',
      needStars: 'Ulduzlarla qiymət verin',
      thanksReview: 'Rəyiniz üçün təşəkkürlər! +15 XP',
      lessonDoneToast: 'Dərs keçirilmiş kimi qeyd edildi',
    },
    teacher: {
      inboxBannerTitle: 'Müəllim kabineti: sorğular',
      inboxBannerSub: 'Gələn müraciətləri sinif, fənn və format üzrə filtrləyin',
      newTile: 'yeni',
      trialTile: 'sınaq',
      fitTile: 'uyğun',
      hiddenWarning:
        'Profil axtarışda gizlidir: «Profil» bölməsində ən azı bir təsdiqlənmiş diplom və ya sertifikat olmalıdır.',
      all: 'Hamısı',
      subject: 'Fənn',
      type: 'Sorğu növü',
      typeTrial: 'Sınaq dərsi',
      typeRegular: 'Adi dərslər',
      level: 'Səviyyə',
      sort: 'Sıralama',
      sortNew: 'Əvvəlcə yenilər',
      sortCat: 'Sinif / kurs üzrə',
      newBadge: 'Yeni',
      stickerMsg: 'Reaksiya göndərildi',
      levelLocked: 'Səviyyə — Premium',
      levelPrefix: 'Səviyyə:',
      notTested: 'test keçilməyib',
      matchesCriteria: 'Meyarlarınıza uyğundur',
      accept: 'Qəbul et',
      decline: 'Rədd et',
      noRequestsTitle: 'Filtrlərə uyğun sorğu yoxdur',
      noRequestsSub: 'Yuxarıdakı filtrləri sıfırlamağı sınayın.',
      adPartnerTag: 'Tərəfdaş',
      adPartnerTitle: '«Müasir tədris metodikaları» kursu',
      adPartnerDesc: 'Repetitorlar üçün 4 həftəlik onlayn ixtisasartırma proqramı.',
      adPartnerCta: 'Ətraflı',
      adPartnerToast: 'Proqram tərəfdaş səhifəsində təqdim olunur',
      studentsBannerTitle: 'Şagird kataloqu',
      studentsBannerSub: 'Şagirdləri sektor, sinif və diaqnostika nəticəsinə görə seçin',
      studentsPremWarn: 'Test səviyyələri və birbaşa dəvətlər Premium ilə aktivdir.',
      learnMore: 'Ətraflı',
      sector: 'Sektor',
      goal: 'Məqsəd:',
      inviteBtn: 'Dərsə dəvət et',
      inviteLockedBtn: 'Dəvət — Premium',
      inviteSent: 'Dəvət göndərildi:',
      youDemoStudent: 'Sizin şagird profiliniz',
      profileBannerTitle: 'Müəllimin açıq dosyesi',
      profileBannerSub: 'Universitet, qəbul balı, fərqlənmə tərəfləri və sertifikatları idarə edin',
      visibleStatus: 'Profil axtarışda açıqdır: sertifikatlar təsdiqlənib.',
      hiddenStatus: 'Profil gizlidir: ən azı bir sertifikat və ya diplom əlavə edib təsdiqləyin.',
      academicCardTitle: 'Təhsil və qəbul balı',
      universityLabel: 'Universitet',
      facultyLabel: 'Fakültə / ixtisas',
      admissionScoreLabel: 'Qəbul balı (700 üzərindən)',
      admissionYearLabel: 'Qəbul ili',
      grantLabel: 'Təqaüd / təhsil forması',
      strengthsCardTitle: 'Güclü tərəflər və başqalarından fərqiniz',
      differentiatorLabel: 'Sizi fərqləndirən cəhət (kartda şagirdlərə görünür)',
      bioLabel: 'Qısa məlumat',
      saveAcademicBtn: 'Dosyeni yadda saxla',
      savedToast: 'Profil məlumatları yeniləndi',
      certsCardTitle: 'Sertifikat və diplomlar',
      certPending: 'Yoxlamadadır',
      certApproveDemo: 'Təsdiqlə',
      certPlaceholder: 'Məsələn, «IELTS 8.0» və ya «RFO sertifikatı»',
      addBtn: 'Əlavə et',
      certNote: 'Sənədlərin EduMatch komandası tərəfindən real yoxlanması istehsal versiyasında işləyir.',
      subjectsLabel: 'Fənlər',
      gradesLabel: 'Siniflər və kurslar',
      levelsLabel: 'Şagird səviyyələri',
      stylesLabel: 'Tədris üslubu',
      priceLabel: 'Dərs qiyməti, ₼',
      studioBannerTitle: 'Kontent studiyası',
      studioBannerSub: 'Video dərslər, müəllif kursları, həddli testlər və ev tapşırıqları',
      addVideo: 'Video dərs əlavə et',
      videoTitlePh: 'Dərsin adı',
      freeForAll: 'Hamı üçün pulsuz sınaq videosu',
      uploadBtn: 'Video əlavə et',
      needTitle: 'Dərsin adını yazın',
      videoAdded: 'Video kitabxanaya əlavə edildi',
      uploadedLabel: 'fayl yükləndi',
      newCourse: 'Videolardan kurs yarat',
      courseTitlePh: 'Kursun adı',
      coursePricePh: 'Qiymət, ₼',
      pickVideos: 'Kurs üçün videolar seçin',
      createCourse: 'Kurs yarat',
      needCourseFields: 'Ad, qiymət və ən azı bir video seçin',
      courseCreated: 'Kurs dərc olundu',
      soldLabel: 'satış',
      newTest: 'Giriş testi konstruktoru',
      testTitlePh: 'Testin adı',
      acceptFromLevel: 'Şagirdləri bu səviyyədən qəbul et',
      questionPh: 'Sual mətni',
      optionPh: 'Variant',
      correctOption: 'Düzgün variantın nömrəsi',
      addQuestion: 'Sual əlavə et',
      publish: 'Testi dərc et',
      needQuestionFields: 'Sualı və bütün 4 variantı doldurun',
      needTestFields: 'Test adı və ən azı 1 sual əlavə edin',
      testPublished: 'Test dosyenizdə dərc olundu',
      thresholdTestsTitle: 'Səviyyə həddli testlər',
      thresholdTestsDesc:
        'Öz testlərinizi yaradın və şagirdləri hansı səviyyədən götürdüyünüzü təyin edin. Şagirdin gözü ilə testə ön-baxış:',
      demoTestBtn: 'Testə ön-baxış',
      unlockBuilderBtn: 'Konstruktoru aç (Premium)',
      newHw: 'Yeni ev tapşırığı',
      hwTitlePh: 'Tapşırığın mətni',
      hwPtsPh: 'XP mükafatı',
      publishHw: 'Tapşırığı dərc et',
      needHwTitle: 'Tapşırığı yazın',
      hwPublished: 'Ev tapşırığı dərc olundu',
      submittedWork: 'Təhvil verilən işlər',
      acceptXp: 'Qəbul et',
      premiumBannerTitle: 'Premium və irəlilətmə',
      premiumBannerSub: 'Genişləndirilmiş səviyyə analitikası və axtarışda üstünlük',
      premiumHeading: 'Müəllimlər üçün Premium',
      activeStatus: 'aktivdir',
      forTutors: 'Pro alətlər',
      premiumPerks: [
        'Testdən sonra şagirdin dəqiq səviyyəsini görürsünüz',
        'Sorğuları bilik səviyyəsinə görə filtrləmə',
        'Şagird kataloquna giriş və birbaşa dəvətlər',
        'Meyarlarınıza tam uyğun sorğuların seçilməsi',
        'Səviyyə həddli şəxsi test konstruktoru',
      ],
      plans: [
        { label: '1 ay', price: '19 ₼' },
        { label: '3 ay', price: '49 ₼' },
        { label: '12 ay', price: '149 ₼' },
      ],
      buyBtn: 'Aktiv et',
      promoHeading: 'Profil reklamı',
      promoDesc: 'Kartınız axtarışda yuxarı qalxacaq və şəffaf «Reklam» nişanı ilə göstəriləcək.',
      promoActive: 'Reklam aktivdir: qalıb',
      daysUnit: 'gün',
      promo7: '7 gün · 9 ₼',
      promo30: '30 gün · 29 ₼',
      promoOff: 'Söndür',
      premiumActivated: 'Premium aktiv edildi',
      promoOnToast: 'Profil reklamı işə salındı',
      promoOffToast: 'Reklam söndürüldü',
    },
    chat: {
      close: 'Bağla',
      trialChip: 'Sınaq dərsi',
      stickersAria: 'Sürətli reaksiyalar',
      placeholder: 'Mesaj yazın…',
      sendAria: 'Göndər',
      requestSentTrial: 'Sınaq dərsi sorğusu göndərildi',
      requestSentRegular: 'Sorğu müəllimə göndərildi',
      requestAlreadySent: 'Bu müəllimlə çat artıq açıqdır',
      autoReply: 'Salam! Sorğunuz üçün təşəkkürlər — uyğun vaxtı razılaşdıraq.',
      acceptAutoReply: 'Salam! Sorğunuz qəbul edildi, dərs cədvəlini danışaq.',
      declineToast: 'Sorğu rədd edildi',
      acceptToast: 'Sorğu qəbul edildi',
    },
    modals: {
      premiumTitle: 'Müəllimlər üçün Premium',
      premiumLater: 'Sonra',
      premiumDemoNote: 'Tarifi bir kliklə aktiv edin — ödəniş kartla dərhal təsdiqlənir.',
      privacyTitle: 'Məxfilik siyasəti',
      forStudents: 'Şagirdlər üçün',
      forTutors: 'Müəllimlər üçün',
      privacyDraftNote: 'Seçimləriniz və yadda saxlanmış filtrlər yalnız sizin brauzerinizdə saxlanılır.',
      tourStepLabel: 'Addım',
      tourSkip: 'Bağla',
      tourNext: 'Növbəti',
      tourStart: 'Axtarışa başla',
      tourSlides: [
        {
          title: 'Universitet, qəbul balı və uğurlar ön planda',
          desc: 'İstənilən müəllimin adına klikləyərək onun hansı universitetə neçə balla girdiyini, güclü tərəflərini və şagird nəticələrini görün.',
          iconKey: 'glasses',
        },
        {
          title: 'Yaxınlıqdakı radar + onlayn dərslər',
          desc: 'Bakı, Sumqayıt və Gəncədə 1 km radiusdan müəllim tapın və ya ölkə üzrə onlayn qoşulun.',
          iconKey: 'lens',
        },
        {
          title: 'Səviyyə testi, uyğunluq % və sektorunuz',
          desc: 'AZ, RU və EN sektorları, təsdiqlənmiş diplomlar, 0 ₼ sınaq dərsi və 3 dəqiqəlik diaqnostika.',
          iconKey: 'thumb',
        },
      ],
      authCreateTitle: 'EduMatch profili yaradın',
      authLoginTitle: 'Yenidən xoş gəldiniz',
      authGuest: 'Qonaq kimi davam et',
      authStudent: 'Mən şagirdəm',
      authTutor: 'Mən müəlliməm',
      authName: 'Ad və soyad',
      authContact: 'E-poçt və ya telefon',
      authPassword: 'Parol',
      authWhere: 'Şəhəriniz',
      authDetect: 'Təyin et',
      authSector: 'Təhsil sektoru',
      authGrade: 'Sinif / kurs',
      authTeachLangs: 'Tədris dilləri (sektor)',
      authAccept: 'Qəbul edirəm:',
      authPrivacyLink: 'Məxfilik siyasəti',
      authMinorNote: '16+ yaşım var və ya valideyn razılığı var',
      authSubmitCreate: 'Hesab yarat',
      authSubmitLogin: 'Daxil ol',
      authHasAccount: 'Artıq hesabınız var?',
      authNewHere: 'Platformada yenisiniz?',
      authToLogin: 'Daxil ol',
      authToSignUp: 'Qeydiyyat',
      authErrContact: 'Ad və e-poçt və ya telefon yazın',
      authErrPolicy: 'Məxfilik siyasətini qəbul edin',
      welcomeToast: 'EduMatch-a xoş gəlmisiniz!',
    },
  },
  en: {
    brandTagline: 'Tutoring Marketplace',
    nav: {
      student: 'Student',
      teacher: 'Tutor',
      search: 'Find Tutors',
      test: 'Level Quiz',
      lessons: 'Lessons',
      inbox: 'Requests',
      students: 'Students',
      profile: 'Profile',
      studio: 'Studio',
      premium: 'Premium',
      signIn: 'Sign in',
      account: 'Account',
      tour: 'Tour',
      themeToggle: 'Toggle theme',
      langToggle: 'Switch language',
      privacy: 'Privacy policy',
      resetDemo: 'Reset data',
      resetDone: 'Preferences restored',
      footerLead: 'Transparent, outcome-verified tutor matching across Azerbaijan.',
    },
    hero: {
      eyebrow: 'Azerbaijan · Baku, Sumgait, Ganja · AZ / RU / EN Sectors',
      titleStart: 'Choose a tutor by ',
      titleAccent: 'verified scores',
      titleEnd: ', university & student outcomes',
      subtitle:
        'Click any tutor’s name to inspect which university they entered, their exact entrance exam score, key strengths, and proven student results.',
      quickSubject: 'Subject',
      quickSector: 'Sector / Language',
      quickFormat: 'Format',
      ctaFind: 'Find a tutor',
      ctaQuiz: 'Take level quiz',
      ctaTour: 'How it works',
      ctaTeacher: 'I’m a tutor',
      metrics: [
        { value: '+145', label: 'avg student score gain' },
        { value: '94%', label: 'students hit target university' },
        { value: '100%', label: 'diploma & score verified' },
      ],
      spotlightLabel: 'Featured Verified Tutor',
      spotlightHint: 'Click tutor name to inspect university & entrance score',
      admissionScoreLabel: 'Admission score',
      strengthPrefix: 'What sets them apart',
      inspectProfileCta: 'Open dossier',
      prevSlide: 'Previous tutor',
      nextSlide: 'Next tutor',
      pauseAuto: 'Pause',
      resumeAuto: 'Auto-rotate',
      uspHeading: 'Why EduMatch isn’t a generic tutor board',
      pillars: [
        {
          title: 'University & Entrance Score',
          desc: 'Transparent academic track record: exact university, major, grant tier, and DİM admission score.',
        },
        {
          title: 'Proven Student Achievements',
          desc: 'Real outcomes: how many students scored 600+, hit IELTS 7.5+, or won national olympiads.',
        },
        {
          title: 'Strengths & Differentiation',
          desc: 'Clear methodology comparison showing how each tutor stands out and who learns fastest with them.',
        },
      ],
    },
    search: {
      title: 'Find your tutor',
      subtitle: 'Verified tutors across AZ, RU & EN sectors. First trial lesson is free.',
      filtersBtn: 'Filters',
      levelBannerDone: 'Your quiz level:',
      levelBannerPremiumHint: 'Premium tutors can see it automatically.',
      levelBannerPrompt: 'Take a 3-minute level quiz so we can calculate your exact tutor match percentage.',
      takeQuiz: 'Take the quiz',
      modeFeed: 'Feed',
      modeSwipe: 'Swipe',
      favorites: 'Favorites',
      teachingStyle: 'Teaching style',
      allStyles: 'Any style',
      subject: 'Subject',
      grade: 'Grade / year',
      language: 'Teaching language',
      format: 'Format',
      maxPrice: 'Max price, ₼',
      sort: 'Sort by',
      any: 'Any',
      sortMatch: 'Best match',
      sortDist: 'Closest to me',
      sortRating: 'By rating',
      sortPrice: 'By price',
      found: 'Tutors found:',
      leftCount: 'Remaining in deck:',
      swipeEmptyTitle: 'You have viewed every tutor matching these filters',
      swipeEmptySub: 'Check your favorites or broaden your filter selection.',
      swipeReset: 'Start over',
      feedEmptyTitle: 'No tutors match these filters',
      feedEmptySub: 'Try increasing your max price, expanding the radius, or clearing style filters.',
      clearFilters: 'Clear filters',
      skip: 'Skip',
      like: 'Save to favorites',
      trialShort: 'Trial lesson',
    },
    tutorCard: {
      adBadge: 'Promoted',
      reviews: 'reviews',
      certsVerified: 'Certificates:',
      fitsLevel: 'Fits your level',
      takesLevels: 'Levels:',
      match: 'match',
      km: 'km',
      online: 'Online',
      langPrefix: 'Languages:',
      perLesson: 'per lesson',
      freeTrial: 'Free trial — 0 ₼',
      profileBtn: 'Uni & scores',
      messageBtn: 'Message',
      universityScoreBadge: 'score',
      achievementsTitle: 'Achievements',
      strengthTitle: 'Strength & Edge',
      clickNameHint: 'Click name to inspect university & admission score',
    },
    profileModal: {
      close: 'Close',
      verifiedAcademic: 'Profile & diploma verified',
      universityTitle: 'University & Admission Score',
      admissionScore: 'Entrance score',
      outOf: 'out of',
      admissionYear: 'Admission year',
      faculty: 'Faculty / Major',
      degree: 'Degree / Status',
      grant: 'Scholarship / Grant',
      extraExam: 'Extra credential',
      achievementsSection: 'Achievements & Student Outcomes',
      strengthsSection: 'Strengths — What Sets This Tutor Apart',
      differentiatorLead: 'Signature approach',
      bestForLabel: 'Best suited for',
      percentileLabel: 'Entrance percentile',
      tabs: {
        overview: 'Uni, Results & Reviews',
        videos: 'Videos',
        courses: 'Courses',
        tests: 'Tests',
        hw: 'Homework',
      },
      certsTitle: 'Diplomas & Certificates',
      verified: 'Verified',
      reviewsTitle: 'Student Reviews',
      noReviewsYet: 'Student reviews will appear after completed lessons.',
      free: 'Free',
      inCourse: 'In course',
      videosCount: 'videos',
      purchasedNotice: 'Course purchased — all videos unlocked in the Videos tab',
      buyCourse: 'Buy course',
      noVideos: 'No videos yet',
      noCourses: 'No courses yet',
      noTests: 'No tests yet',
      questionsShort: 'qs',
      takesFromLevel: 'Minimum level',
      takeTest: 'Take test',
      submittedOk: 'Accepted, XP awarded',
      submittedPending: 'Under review',
      submitWork: 'Submit work',
      yourAnswer: 'Your answer or solution',
      send: 'Send',
      needAnswerOrFile: 'Add a written answer or attach a file',
      sentForReview: 'Sent for review',
      courseBoughtToast: 'Course added to library',
      demoPlayerNote: 'Built-in HD lesson player for free previews and enrolled courses',
      back: 'Back',
    },
    radar: {
      locateMe: 'Locate me',
      myLocation: 'My location',
      radiusLabel: 'Search radius',
      hint: 'Tap any pin on the map to preview the tutor. Online lessons ignore physical distance.',
      geoUnavailable: 'Geolocation unavailable — pick a city',
      geoUpdated: 'Location updated',
      geoBlocked: 'Location access denied — pick a city',
      selectedPreview: 'Selected on map',
      openProfile: 'Open dossier',
    },
    quiz: {
      bannerTitle: 'Level Diagnostic Quiz',
      bannerSub: '6 subject questions · ~3 minutes · powers tutor match %',
      levelLabel: 'Level',
      lastResult: 'Latest result:',
      chooseSubject: 'Choose a subject to assess',
      subjectHint: 'Your result is saved locally and sharpens tutor recommendations.',
      allSubjectsReady: 'Diagnostic quizzes are ready for all 6 subjects.',
      questionOf: 'Question',
      correct: 'Correct! +10 XP',
      wrong: 'Good try — keep going',
      resultTitle: 'level',
      scoreOutOf: 'of 6 correct',
      savedNote: 'Saved to your profile to match tutors to your pace.',
      findTutors: 'Find tutors',
      retake: 'Retake',
      yourRank: 'Your rank',
      nextRank: 'Next rank',
      newRankTitle: 'Rank Up!',
      stickerUnlocked: 'New reaction badge unlocked in chat',
      ok: 'Awesome',
      achievements: {
        test: 'First Quiz',
        trial: 'Trial Lesson',
        review: 'First Review',
        streak: '3-Day Streak',
      },
      thresholdTestTitle: 'Tutor Entry Test',
      thresholdLabel: 'Threshold',
      passThreshold: 'You meet this tutor’s entry threshold',
      belowThreshold: 'This tutor accepts students from level',
      done: 'Done',
      demoTag: 'Preview',
    },
    lessons: {
      bannerTitle: 'My Lessons & Progress',
      bannerSub: 'Active requests, chat threads, homework and lesson reviews',
      requestsTile: 'requests',
      lessonsTile: 'lessons',
      xpTile: 'XP',
      homeworkTitle: 'Assigned Homework',
      open: 'Open',
      trialTag: 'free trial lesson',
      openChat: 'Open chat',
      markDone: 'Complete lesson',
      yourReview: 'Your review:',
      rateLesson: 'Rate this lesson',
      reviewPlaceholder: 'What stood out? How clear were the explanations?',
      submitReview: 'Submit review',
      emptyTitle: 'No requests yet',
      emptySub: 'Explore tutors, inspect their admission scores and student results, and book a free trial.',
      searchCta: 'Browse tutors',
      needStars: 'Select a star rating first',
      thanksReview: 'Thanks for your review! +15 XP',
      lessonDoneToast: 'Lesson marked as completed',
    },
    teacher: {
      inboxBannerTitle: 'Tutor Workspace: Requests',
      inboxBannerSub: 'Filter incoming student leads by grade, subject and format',
      newTile: 'new',
      trialTile: 'trials',
      fitTile: 'best fit',
      hiddenWarning:
        'Profile hidden from search: add and verify at least one diploma or certificate in Profile.',
      all: 'All',
      subject: 'Subject',
      type: 'Type',
      typeTrial: 'Trial lesson',
      typeRegular: 'Regular',
      level: 'Level',
      sort: 'Sort by',
      sortNew: 'Newest first',
      sortCat: 'By grade / year',
      newBadge: 'New',
      stickerMsg: 'Reaction sent',
      levelLocked: 'Level — Premium',
      levelPrefix: 'Level:',
      notTested: 'quiz not taken',
      matchesCriteria: 'Matches your criteria',
      accept: 'Accept',
      decline: 'Decline',
      noRequestsTitle: 'No requests match filters',
      noRequestsSub: 'Try clearing the active filters above.',
      adPartnerTag: 'Partner',
      adPartnerTitle: 'Course: Modern Teaching Methodologies',
      adPartnerDesc: '4-week online teaching upskilling program tailored for independent tutors.',
      adPartnerCta: 'Learn more',
      adPartnerToast: 'Program overview opens on partner portal',
      studentsBannerTitle: 'Student Directory',
      studentsBannerSub: 'Discover prospective students by sector, grade and quiz level',
      studentsPremWarn: 'Diagnostic levels and direct invitations unlock with Tutor Premium.',
      learnMore: 'Learn more',
      sector: 'Sector',
      goal: 'Goal:',
      inviteBtn: 'Invite to lesson',
      inviteLockedBtn: 'Invite — Premium',
      inviteSent: 'Invitation sent to:',
      youDemoStudent: 'Your student profile',
      profileBannerTitle: 'Public Tutor Dossier',
      profileBannerSub: 'Edit your university, entrance score, strengths and certificates',
      visibleStatus: 'Profile visible in search: certificates verified.',
      hiddenStatus: 'Profile hidden: add and verify at least one diploma or certificate.',
      academicCardTitle: 'University & Admission Score',
      universityLabel: 'University',
      facultyLabel: 'Faculty / Major',
      admissionScoreLabel: 'Admission score (out of 700)',
      admissionYearLabel: 'Admission year',
      grantLabel: 'Scholarship / Grant',
      strengthsCardTitle: 'Strengths & Differentiation',
      differentiatorLabel: 'How you stand out (shown on search cards)',
      bioLabel: 'Short bio',
      saveAcademicBtn: 'Save dossier',
      savedToast: 'Tutor profile saved',
      certsCardTitle: 'Certificates & Diplomas',
      certPending: 'Pending review',
      certApproveDemo: 'Verify',
      certPlaceholder: 'e.g. “IELTS 8.0” or “RFO Diploma”',
      addBtn: 'Add',
      certNote: 'Manual document verification by the EduMatch team runs in production.',
      subjectsLabel: 'Subjects',
      gradesLabel: 'Grades & years',
      levelsLabel: 'Student levels accepted',
      stylesLabel: 'Teaching style',
      priceLabel: 'Lesson rate, ₼',
      studioBannerTitle: 'Creator Studio',
      studioBannerSub: 'Video lessons, course bundles, threshold tests and homework',
      addVideo: 'Add a video lesson',
      videoTitlePh: 'Lesson title',
      freeForAll: 'Free preview lesson for all students',
      uploadBtn: 'Add video',
      needTitle: 'Enter a video title',
      videoAdded: 'Video added to library',
      uploadedLabel: 'file uploaded',
      newCourse: 'Bundle videos into a course',
      courseTitlePh: 'Course title',
      coursePricePh: 'Price, ₼',
      pickVideos: 'Pick videos for this course',
      createCourse: 'Create course',
      needCourseFields: 'Provide title, price and at least 1 video',
      courseCreated: 'Course published',
      soldLabel: 'sold',
      newTest: 'Threshold Test Builder',
      testTitlePh: 'Test title',
      acceptFromLevel: 'Accept students from level',
      questionPh: 'Question text',
      optionPh: 'Option',
      correctOption: 'Correct option number',
      addQuestion: 'Add question',
      publish: 'Publish test',
      needQuestionFields: 'Fill in the question and all 4 options',
      needTestFields: 'Add a test title and at least 1 question',
      testPublished: 'Test published to your dossier',
      thresholdTestsTitle: 'Level-Gated Entry Tests',
      thresholdTestsDesc:
        'Create custom entry quizzes and define the minimum student level you accept. Preview the student flow:',
      demoTestBtn: 'Preview test',
      unlockBuilderBtn: 'Unlock builder (Premium)',
      newHw: 'New homework assignment',
      hwTitlePh: 'Assignment prompt',
      hwPtsPh: 'XP reward',
      publishHw: 'Publish assignment',
      needHwTitle: 'Enter an assignment description',
      hwPublished: 'Homework published',
      submittedWork: 'Student submissions',
      acceptXp: 'Accept',
      premiumBannerTitle: 'Premium & Boost',
      premiumBannerSub: 'Unlock student diagnostic levels and priority discovery placement',
      premiumHeading: 'Tutor Premium',
      activeStatus: 'active',
      forTutors: 'Pro toolkit',
      premiumPerks: [
        'View verified student quiz levels immediately',
        'Filter incoming leads by academic level',
        'Browse student directory & send direct invitations',
        'Highlight requests matching your exact criteria',
        'Custom entry test builder with minimum level threshold',
      ],
      plans: [
        { label: '1 month', price: '19 ₼' },
        { label: '3 months', price: '49 ₼' },
        { label: '12 months', price: '149 ₼' },
      ],
      buyBtn: 'Activate',
      promoHeading: 'Search Boost',
      promoDesc: 'Pin your card to the top of search results with a clear “Promoted” badge.',
      promoActive: 'Promotion active:',
      daysUnit: 'd.',
      promo7: '7 days · 9 ₼',
      promo30: '30 days · 29 ₼',
      promoOff: 'Turn off',
      premiumActivated: 'Premium activated',
      promoOnToast: 'Search boost enabled',
      promoOffToast: 'Search boost turned off',
    },
    chat: {
      close: 'Close',
      trialChip: 'Trial lesson',
      stickersAria: 'Quick reactions',
      placeholder: 'Write a message…',
      sendAria: 'Send',
      requestSentTrial: 'Trial lesson request sent',
      requestSentRegular: 'Request sent to tutor',
      requestAlreadySent: 'Chat thread already open',
      autoReply: 'Hello! Thanks for reaching out — let’s pick a convenient time.',
      acceptAutoReply: 'Hello! Your request is accepted — let’s schedule our first lesson.',
      declineToast: 'Request declined',
      acceptToast: 'Request accepted',
    },
    modals: {
      premiumTitle: 'Tutor Premium',
      premiumLater: 'Later',
      premiumDemoNote: 'Activate instantly — card billing connects when publishing your live profile.',
      privacyTitle: 'Privacy Policy',
      forStudents: 'For Students',
      forTutors: 'For Tutors',
      privacyDraftNote: 'Preferences and saved filters are stored locally in your browser session.',
      tourStepLabel: 'Step',
      tourSkip: 'Close',
      tourNext: 'Next',
      tourStart: 'Start exploring',
      tourSlides: [
        {
          title: 'University, entrance score & student results up front',
          desc: 'Click any tutor’s name to inspect which university they entered, their DİM score (out of 700), key strengths and real outcomes.',
          iconKey: 'glasses',
        },
        {
          title: 'Nearby geo-radar + online tutoring',
          desc: 'Find tutors within 1 km in Baku, Sumgait or Ganja, or learn online with top performers nationwide.',
          iconKey: 'lens',
        },
        {
          title: 'Level quiz, match % & your school sector',
          desc: 'AZ, RU & EN school sectors, verified diplomas, free 0 ₼ trial lessons, and a 3-minute diagnostic quiz.',
          iconKey: 'thumb',
        },
      ],
      authCreateTitle: 'Create your EduMatch profile',
      authLoginTitle: 'Welcome back',
      authGuest: 'Continue as guest',
      authStudent: 'I’m a student',
      authTutor: 'I’m a tutor',
      authName: 'Full name',
      authContact: 'Email or phone',
      authPassword: 'Password',
      authWhere: 'Your city',
      authDetect: 'Detect',
      authSector: 'School sector',
      authGrade: 'Grade / year',
      authTeachLangs: 'Teaching languages (sector)',
      authAccept: 'I accept the',
      authPrivacyLink: 'Privacy Policy',
      authMinorNote: 'I am 16+ or have parental consent',
      authSubmitCreate: 'Create account',
      authSubmitLogin: 'Log in',
      authHasAccount: 'Already have an account?',
      authNewHere: 'New to EduMatch?',
      authToLogin: 'Log in',
      authToSignUp: 'Sign up',
      authErrContact: 'Enter your name and email or phone',
      authErrPolicy: 'Please accept the Privacy Policy',
      welcomeToast: 'Welcome to EduMatch!',
    },
  },
};
