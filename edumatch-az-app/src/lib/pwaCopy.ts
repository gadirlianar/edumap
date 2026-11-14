import type { Locale } from '@/types/edumatch';

export interface PwaCopyBundle {
  pwa: {
    installBtn: string;
    installBannerTitle: string;
    installBannerDesc: string;
    installNow: string;
    later: string;
    installedLabel: string;
    offlineBadge: string;
    onlineRestored: string;
    guideTitle: string;
    guideSubtitle: string;
    guideIosSteps: string[];
    guideDesktopSteps: string[];
    guideAlreadyInstalled: string;
    dismissLabel: string;
  };
  notifications: {
    bellLabel: string;
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    markAllRead: string;
    clearRead: string;
    unreadBadge: string;
    openAction: string;
  };
  accountHub: {
    title: string;
    subtitle: string;
    activeRole: string;
    studentRole: string;
    teacherRole: string;
    switchRoleHint: string;
    personasTitle: string;
    statsLessons: string;
    statsSaved: string;
    statsRank: string;
    alertsLabel: string;
    alertsDesc: string;
    appStatusTitle: string;
    appReadyLabel: string;
    installCta: string;
    signOut: string;
    resetDemo: string;
    resetDone: string;
  };
  booking: {
    modalTitle: string;
    modalSubtitle: string;
    scheduleBtn: string;
    rescheduleBtn: string;
    changeSlotBtn: string;
    typeLabel: string;
    trialOption: string;
    regularOption: string;
    dayLabel: string;
    timeLabel: string;
    formatLabel: string;
    goalLabel: string;
    goalPlaceholder: string;
    conflictWarning: string;
    confirmBtn: string;
    saveRescheduleBtn: string;
    bookedBadge: string;
    weeklyTitle: string;
    weeklyEmpty: string;
    enterClassroom: string;
    invitedTag: string;
    rescheduledToast: string;
    bookedToast: string;
  };
  classroom: {
    title: string;
    subtitle: string;
    timerLabel: string;
    startTimer: string;
    pauseTimer: string;
    resetTimer: string;
    micOn: string;
    micOff: string;
    camOn: string;
    camOff: string;
    screenOn: string;
    screenOff: string;
    boardTab: string;
    notesTab: string;
    clearBoard: string;
    undoBoard: string;
    penLabelPrefix: string;
    boardAriaLabel: string;
    sendMessageLabel: string;
    notesPlaceholder: string;
    savedAuto: string;
    templateChips: string[];
    checklistTitle: string;
    addTaskPlaceholder: string;
    addTaskBtn: string;
    chatTitle: string;
    finishBtn: string;
    hwBtn: string;
    completedToast: string;
  };
  videoPlayer: {
    chaptersTitle: string;
    playBtn: string;
    pauseBtn: string;
    speedLabel: string;
    notesTitle: string;
    notePlaceholder: string;
    addNoteBtn: string;
    deleteNoteLabel: string;
    markWatchedBtn: string;
    watchedBadge: string;
    watchedToast: string;
    boardLabel: string;
    progressLabel: string;
    keyTakeaway: string;
  };
  teacherSync: {
    gradeBtn: string;
    scoreLabel: string;
    feedbackLabel: string;
    feedbackPlaceholder: string;
    saveGradeBtn: string;
    gradedBadge: string;
    pendingBadge: string;
    hwQueueTitle: string;
    inviteModalToast: string;
    partnerTitle: string;
    partnerSubtitle: string;
    partnerHighlights: string[];
    partnerEnrollBtn: string;
    partnerEnrolledBadge: string;
    partnerEnrolledToast: string;
  };
  studentProfile: {
    defaultName: string;
    defaultGroup: string;
    currentRankLabel: string;
    favoritesLabel: string;
    lessonsLabel: string;
    myLessonsHeading: string;
    bookCta: string;
    accountCta: string;
    editProfileLabel: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    gradeLabel: string;
    groupLabel: string;
    groupPlaceholder: string;
    saveBtn: string;
    cancelBtn: string;
    savedToast: string;
  };
}

export const PWA_COPY: Record<Locale, PwaCopyBundle> = {
  ru: {
    pwa: {
      installBtn: 'Установить App',
      installBannerTitle: 'Установите EduMatch как приложение',
      installBannerDesc: 'Мгновенный доступ к расписанию, мини-классу и офлайн-материалам.',
      installNow: 'Установить',
      later: 'Позже',
      installedLabel: 'Установлено как WebApp',
      offlineBadge: 'Офлайн-режим · изменения сохраняются локально',
      onlineRestored: 'Соединение восстановлено',
      guideTitle: 'Установка EduMatch WebApp',
      guideSubtitle: 'Запускайте платформу с главного экрана как нативное приложение',
      guideIosSteps: [
        'Нажмите кнопку «Поделиться» (квадрат со стрелкой вверх) внизу или вверху Safari.',
        'Прокрутите список и выберите «На экран “Домой”».',
        'Нажмите «Добавить» — EduMatch откроется без адресной строки.',
      ],
      guideDesktopSteps: [
        'Откройте меню браузера (Значок установки в адресной строке Chrome/Edge или Safari → «Файл → Добавить на Dock»).',
        'Подтвердите установку ярлыка EduMatch.',
        'Офлайн-кеш активируется автоматически при первом открытии.',
      ],
      guideAlreadyInstalled: 'EduMatch уже работает в автономном режиме приложения.',
      dismissLabel: 'Скрыть',
    },
    notifications: {
      bellLabel: 'Уведомления',
      title: 'Центр уведомлений',
      subtitle: 'Заявки, приглашения, проверка ДЗ и прогресс по XP',
      emptyTitle: 'Пока тихо',
      emptyDesc: 'Новые отклики, сообщения и проверки ДЗ появятся здесь мгновенно.',
      markAllRead: 'Прочитать все',
      clearRead: 'Очистить прочитанные',
      unreadBadge: 'Новое',
      openAction: 'Открыть',
    },
    accountHub: {
      title: 'Профиль и кабина',
      subtitle: 'Управление ролью, быстрой демо-персоной и настройками WebApp',
      activeRole: 'Активный режим',
      studentRole: 'Ученик',
      teacherRole: 'Преподаватель',
      switchRoleHint: 'Мгновенное переключение без потери прогресса',
      personasTitle: 'Быстрая смена профиля',
      statsLessons: 'Занятия',
      statsSaved: 'Избранное',
      statsRank: 'XP рейтинг',
      alertsLabel: 'Умные уведомления',
      alertsDesc: 'Фиксировать приглашения, ответы и проверку ДЗ в колокольчике',
      appStatusTitle: 'Режим WebApp',
      appReadyLabel: 'Локальная сессия + офлайн-кеш активны',
      installCta: 'Установить на устройство',
      signOut: 'Выйти из аккаунта',
      resetDemo: 'Сбросить демо-данные',
      resetDone: 'Демо-состояние восстановлено',
    },
    booking: {
      modalTitle: 'Выбор слота и запись на урок',
      modalSubtitle: 'Закрепите удобный день, время и формат занятия',
      scheduleBtn: 'Записаться по времени',
      rescheduleBtn: 'Перенести слот',
      changeSlotBtn: 'Изменить время',
      typeLabel: 'Тип занятия',
      trialOption: 'Пробный урок (30 мин · 0 ₼)',
      regularOption: 'Обычный урок (45 мин)',
      dayLabel: 'День недели',
      timeLabel: 'Удобное время (Баку)',
      formatLabel: 'Формат',
      goalLabel: 'Цель урока (необязательно)',
      goalPlaceholder: 'Например: разбор задач на параметры из DİM или диагностика базы',
      conflictWarning: 'Внимание: на этот слот уже запланирован другой ваш урок',
      confirmBtn: 'Подтвердить запись',
      saveRescheduleBtn: 'Обновить слот',
      bookedBadge: 'Слот',
      weeklyTitle: 'Ближайшее расписание',
      weeklyEmpty: 'Выберите слот у преподавателя — урок сразу появится здесь.',
      enterClassroom: 'Войти в мини-класс',
      invitedTag: 'Приглашение',
      rescheduledToast: 'Время занятия обновлено',
      bookedToast: 'Занятие добавлено в расписание',
    },
    classroom: {
      title: 'Интерактивный мини-класс',
      subtitle: 'Живой таймер, интерактивная доска, заметки и чат',
      timerLabel: 'Таймер урока',
      startTimer: 'Старт',
      pauseTimer: 'Пауза',
      resetTimer: 'Сброс',
      micOn: 'Микрофон вкл',
      micOff: 'Микрофон выкл',
      camOn: 'Камера вкл',
      camOff: 'Камера выкл',
      screenOn: 'Экран транслируется',
      screenOff: 'Поделиться экраном',
      boardTab: 'Доска',
      notesTab: 'Заметки',
      clearBoard: 'Очистить',
      undoBoard: 'Назад',
      penLabelPrefix: 'Маркер',
      boardAriaLabel: 'Интерактивная доска урока',
      sendMessageLabel: 'Отправить сообщение',
      notesPlaceholder: 'Записывайте ключевые формулы, ошибки и план домашнего задания...',
      savedAuto: 'Сохранено автоматически',
      templateChips: ['План DİM', 'Разбор ошибок', 'Домашнее задание'],
      checklistTitle: 'Чек-лист урока',
      addTaskPlaceholder: 'Добавить пункт урока…',
      addTaskBtn: 'Добавить',
      chatTitle: 'Чат урока',
      finishBtn: 'Завершить урок (+40 XP)',
      hwBtn: 'ДЗ',
      completedToast: 'Урок завершён · +40 XP начислено!',
    },
    videoPlayer: {
      chaptersTitle: 'Главы видео-урока',
      playBtn: 'Смотреть',
      pauseBtn: 'Пауза',
      speedLabel: 'Скорость',
      notesTitle: 'Мои заметки по таймкодам',
      notePlaceholder: 'Записать мысль по текущему фрагменту…',
      addNoteBtn: 'Сохранить заметку',
      deleteNoteLabel: 'Удалить заметку',
      markWatchedBtn: 'Отметить пройденным (+15 XP)',
      watchedBadge: 'Урок пройден',
      watchedToast: 'Видео-урок отмечен пройденным · +15 XP!',
      boardLabel: 'Разбор на доске',
      progressLabel: 'Прогресс',
      keyTakeaway: 'Ключевой фокус главы',
    },
    teacherSync: {
      gradeBtn: 'Проверить ДЗ',
      scoreLabel: 'Оценка (0–100)',
      feedbackLabel: 'Комментарий ученику',
      feedbackPlaceholder: 'Отличный ход решения! Обрати внимание на проверку ОДЗ во 2-й задаче.',
      saveGradeBtn: 'Выставить оценку',
      gradedBadge: 'Проверено',
      pendingBadge: 'На проверке',
      hwQueueTitle: 'Присланные домашние задания',
      inviteModalToast: 'Приглашение отправлено и открыто во «Входящих»',
      partnerTitle: 'Программа «Современные методики преподавания»',
      partnerSubtitle: '4-недельная сертификация для репетиторов EduMatch',
      partnerHighlights: [
        'Разбор кейсов ускорения учеников до 600+ баллов DİM за 12 недель',
        'Значок «Проверенная методика» на карточке преподавателя в каталоге',
        'Доступ к библиотеке интерактивных тестов и шаблонов мини-класса',
      ],
      partnerEnrollBtn: 'Записаться на программу',
      partnerEnrolledBadge: 'Вы записаны',
      partnerEnrolledToast: 'Заявка на партнёрскую программу принята!',
    },
    studentProfile: {
      defaultName: 'Мадина Ханаева',
      defaultGroup: 'I / IV группа DİM',
      currentRankLabel: 'текущий ранг',
      favoritesLabel: 'избранных',
      lessonsLabel: 'занятий',
      myLessonsHeading: 'Мои занятия',
      bookCta: '+ Записаться',
      accountCta: 'Кабина',
      editProfileLabel: 'Изменить профиль',
      fullNameLabel: 'Имя и фамилия',
      fullNamePlaceholder: 'Например: Мадина Ханаева',
      gradeLabel: 'Класс / курс',
      groupLabel: 'Группа DİM / цель',
      groupPlaceholder: 'Например: I / IV группа DİM',
      saveBtn: 'Сохранить',
      cancelBtn: 'Отмена',
      savedToast: 'Профиль ученика обновлён',
    },
  },
  az: {
    pwa: {
      installBtn: 'App kimi yüklə',
      installBannerTitle: 'EduMatch-ı cihazınıza «App» kimi quraşdırın',
      installBannerDesc: 'Cədvəl, mini-dərs otağı və oflayn dərslərə 1 toxunuşla keçid.',
      installNow: 'Quraşdır',
      later: 'Sonra',
      installedLabel: 'WebApp kimi quraşdırılıb',
      offlineBadge: 'Oflayn rejim · dəyişikliklər yerli yaddaşda saxlanır',
      onlineRestored: 'İnternet bağlantısı bərpa olundu',
      guideTitle: 'EduMatch WebApp quraşdırılması',
      guideSubtitle: 'Platformanı əsas ekrandan tam tətbiq kimi açın',
      guideIosSteps: [
        'Safari brauzerində aşağıdakı və ya yuxarıdakı «Paylaş» (yuxarı oxlu kvadrat) düyməsinə toxunun.',
        'Menyunu sürüşdürüb «Əsas ekrana əlavə et» (Add to Home Screen) seçin.',
        '«Əlavə et» düyməsinə basın — EduMatch ünvan sətri olmadan App kimi açılacaq.',
      ],
      guideDesktopSteps: [
        'Brauzerin ünvan sətrindəki «Quraşdır» ikonuna (Chrome/Edge) və ya Safari → «File → Add to Dock» seçin.',
        'EduMatch tətbiq qısayolunu təsdiqləyin.',
        'Oflayn keş ilk açılışdan avtomatik aktiv olur.',
      ],
      guideAlreadyInstalled: 'EduMatch artıq quraşdırılmış WebApp rejimində işləyir.',
      dismissLabel: 'Bağla',
    },
    notifications: {
      bellLabel: 'Bildirişlər',
      title: 'Bildiriş mərkəzi',
      subtitle: 'Sifarişlər, dəvətlər, ev tapşırığı rəyləri və XP irəliləyişi',
      emptyTitle: 'Hələ bildiriş yoxdur',
      emptyDesc: 'Yeni cavablar, mesajlar və ev tapşırığı yoxlamaları dərhal burada görünəcək.',
      markAllRead: 'Hamısını oxunmuş et',
      clearRead: 'Oxunmuşları sil',
      unreadBadge: 'Yeni',
      openAction: 'Aç',
    },
    accountHub: {
      title: 'Hesab və profil',
      subtitle: 'Rol keçidi, demo profil seçimi və WebApp tənzimləmələri',
      activeRole: 'Aktiv rejim',
      studentRole: 'Şagird',
      teacherRole: 'Müəllim',
      switchRoleHint: 'Bütün yaddaş və dərslər qorunmaqla ani keçid',
      personasTitle: 'Sürətli profil seçimi',
      statsLessons: 'Dərslər',
      statsSaved: 'Seçilmişlər',
      statsRank: 'XP rütbəsi',
      alertsLabel: 'Ağıllı bildirişlər',
      alertsDesc: 'Dəvətlər, cavablar və tapşırıq nəticələrini zəngdə göstər',
      appStatusTitle: 'WebApp statusu',
      appReadyLabel: 'Yerli sessiya və oflayn keş aktivdir',
      installCta: 'Cihaza App kimi quraşdır',
      signOut: 'Hesabdan çıx',
      resetDemo: 'Demo məlumatları sıfırla',
      resetDone: 'Başlanğıc demo vəziyyət bərpa olundu',
    },
    booking: {
      modalTitle: 'Gün və saat seçimi ilə dərs sifarişi',
      modalSubtitle: 'Sizə uyğun vaxt slotunu və dərs formatını təsdiqləyin',
      scheduleBtn: 'Vaxt seçib yazıl',
      rescheduleBtn: 'Vaxtı dəyiş',
      changeSlotBtn: 'Slotu yenilə',
      typeLabel: 'Dərs növü',
      trialOption: 'Sınaq dərsi (30 dəq · 0 ₼)',
      regularOption: 'Əsas dərs (45 dəq)',
      dayLabel: 'Həftənin günü',
      timeLabel: 'Uyğun saat (Bakı vaxtı)',
      formatLabel: 'Format',
      goalLabel: 'Dərs məqsədi (istəyə bağlı)',
      goalPlaceholder: 'Məsələn: DİM parametr məsələləri və ya baza diaqnostikası',
      conflictWarning: 'Diqqət: Bu vaxt slotunda artıq başqa dərsiniz var',
      confirmBtn: 'Sifarişi təsdiqlə',
      saveRescheduleBtn: 'Yeni vaxtı saxla',
      bookedBadge: 'Cədvəl',
      weeklyTitle: 'Həftəlik dərs cədvəli',
      weeklyEmpty: 'Müəllimdən vaxt slotu seçin — dərs dərhal cədvəldə görünəcək.',
      enterClassroom: 'Mini-dərs otağına gir',
      invitedTag: 'Müəllim dəvəti',
      rescheduledToast: 'Dərs vaxtı yeniləndi',
      bookedToast: 'Dərs cədvələ əlavə edildi',
    },
    classroom: {
      title: 'Canlı mini-dərs otağı',
      subtitle: 'Dərs taymeri, interaktiv rəsm lövhəsi, qeydlər və çat',
      timerLabel: 'Dərs taymeri',
      startTimer: 'Başlat',
      pauseTimer: 'Fasilə',
      resetTimer: 'Sıfırla',
      micOn: 'Mikrofon açıq',
      micOff: 'Mikrofon bağlı',
      camOn: 'Kamera açıq',
      camOff: 'Kamera bağlı',
      screenOn: 'Ekran paylaşılır',
      screenOff: 'Ekranı paylaş',
      boardTab: 'Lövhə',
      notesTab: 'Qeydlər',
      clearBoard: 'Təmizlə',
      undoBoard: 'Geri al',
      penLabelPrefix: 'Qələm',
      boardAriaLabel: 'İnteraktiv dərs lövhəsi',
      sendMessageLabel: 'Mesaj göndər',
      notesPlaceholder: 'Əsas düsturları, səhvləri və ev tapşırığı planını qeyd edin...',
      savedAuto: 'Avtomatik yadda saxlandı',
      templateChips: ['DİM Planı', 'Səhv Təhlili', 'Ev Tapşırığı'],
      checklistTitle: 'Dərs planı siyahısı',
      addTaskPlaceholder: 'Yeni dərs bəndi əlavə et…',
      addTaskBtn: 'Əlavə et',
      chatTitle: 'Dərs çatı',
      finishBtn: 'Dərsi bitir (+40 XP)',
      hwBtn: 'Ev tapşırığı',
      completedToast: 'Dərs tamamlandı · +40 XP qazanıldı!',
    },
    videoPlayer: {
      chaptersTitle: 'Video-dərs bölmələri',
      playBtn: 'İzlə',
      pauseBtn: 'Fasilə',
      speedLabel: 'Sürət',
      notesTitle: 'Zaman damğalı qeydlərim',
      notePlaceholder: 'Bu hissə ilə bağlı əsas qeydi yazın…',
      addNoteBtn: 'Qeydi saxla',
      deleteNoteLabel: 'Qeydi sil',
      markWatchedBtn: 'Tamamlandı kimi işarələ (+15 XP)',
      watchedBadge: 'Dərs izlənilib',
      watchedToast: 'Video-dərs tamamlandı · +15 XP!',
      boardLabel: 'Lövhə izahı',
      progressLabel: 'İrəliləyiş',
      keyTakeaway: 'Bölmənin əsas qaydası',
    },
    teacherSync: {
      gradeBtn: 'Tapşırığı yoxla',
      scoreLabel: 'Bal (0–100)',
      feedbackLabel: 'Şagirdə rəy',
      feedbackPlaceholder: 'Həll yolu əladır! 2-ci sualda şərti bir daha yoxla.',
      saveGradeBtn: 'Qiymətləndir',
      gradedBadge: 'Yoxlanılıb',
      pendingBadge: 'Gözləyir',
      hwQueueTitle: 'Göndərilmiş ev tapşırıqları',
      inviteModalToast: 'Dəvət yaradıldı və «Sorğular» bölməsinə əlavə olundu',
      partnerTitle: '«Müasir tədris metodikaları» proqramı',
      partnerSubtitle: 'EduMatch müəllimləri üçün 4 həftəlik sertifikasiya',
      partnerHighlights: [
        'Şagirdləri 12 həftəyə 600+ DİM balına çatdırmaq üçün real metodik keyslər',
        'Kataloq kartında «Təsdiqlənmiş metodika» nişanı',
        'İnteraktiv test və mini-dərs lövhə şablonlarına tam çıxış',
      ],
      partnerEnrollBtn: 'Proqrama qoşul',
      partnerEnrolledBadge: 'Qoşulmusunuz',
      partnerEnrolledToast: 'Tərəfdaş proqramına müraciətiniz qeydə alındı!',
    },
    studentProfile: {
      defaultName: 'Mədinə Xanayeva',
      defaultGroup: 'I / IV qrup DİM',
      currentRankLabel: 'cari ranq',
      favoritesLabel: 'seçilmişlər',
      lessonsLabel: 'dərs',
      myLessonsHeading: 'Mənim dərslərim',
      bookCta: '+ Yazıl',
      accountCta: 'Kabinet',
      editProfileLabel: 'Profili redaktə et',
      fullNameLabel: 'Ad və soyad',
      fullNamePlaceholder: 'Məsələn: Mədinə Xanayeva',
      gradeLabel: 'Sinif / kurs',
      groupLabel: 'DİM qrupu / hədəf',
      groupPlaceholder: 'Məsələn: I / IV qrup DİM',
      saveBtn: 'Yadda saxla',
      cancelBtn: 'Ləğv et',
      savedToast: 'Şagird profili yeniləndi',
    },
  },
  en: {
    pwa: {
      installBtn: 'Install App',
      installBannerTitle: 'Install EduMatch as a WebApp',
      installBannerDesc: 'Instant Home Screen launch, live classroom & offline study cache.',
      installNow: 'Install',
      later: 'Later',
      installedLabel: 'Installed as WebApp',
      offlineBadge: 'Offline mode · changes saved locally',
      onlineRestored: 'Back online',
      guideTitle: 'Install EduMatch WebApp',
      guideSubtitle: 'Launch EduMatch from your Home Screen like a native app',
      guideIosSteps: [
        'Tap the Share icon (square with upward arrow) in Safari.',
        'Scroll down and choose “Add to Home Screen”.',
        'Tap “Add” — EduMatch launches full-screen without browser bars.',
      ],
      guideDesktopSteps: [
        'Click the Install icon in the Chrome/Edge address bar or choose Safari → File → Add to Dock.',
        'Confirm adding the EduMatch app shortcut.',
        'Offline shell caching activates automatically after first open.',
      ],
      guideAlreadyInstalled: 'EduMatch is already running in standalone app mode.',
      dismissLabel: 'Dismiss',
    },
    notifications: {
      bellLabel: 'Notifications',
      title: 'Notification Center',
      subtitle: 'Bookings, invites, homework grading, and XP milestones',
      emptyTitle: 'All caught up',
      emptyDesc: 'New lesson responses, invites, and homework reviews appear here.',
      markAllRead: 'Mark all read',
      clearRead: 'Clear read',
      unreadBadge: 'New',
      openAction: 'Open',
    },
    accountHub: {
      title: 'Account & Workspace',
      subtitle: 'Switch roles, test demo personas, and manage WebApp settings',
      activeRole: 'Active mode',
      studentRole: 'Student',
      teacherRole: 'Tutor',
      switchRoleHint: 'Instant switch without losing local session data',
      personasTitle: 'Quick demo persona switch',
      statsLessons: 'Lessons',
      statsSaved: 'Saved',
      statsRank: 'XP Rank',
      alertsLabel: 'In-app notifications',
      alertsDesc: 'Log invites, bookings, and grading alerts in the bell drawer',
      appStatusTitle: 'WebApp Status',
      appReadyLabel: 'Local persistence + offline shell active',
      installCta: 'Install App to Device',
      signOut: 'Sign Out',
      resetDemo: 'Reset Demo State',
      resetDone: 'Demo workspace restored',
    },
    booking: {
      modalTitle: 'Pick a Time Slot & Book Lesson',
      modalSubtitle: 'Lock in your preferred day, time, and format',
      scheduleBtn: 'Schedule Slot',
      rescheduleBtn: 'Reschedule',
      changeSlotBtn: 'Change Slot',
      typeLabel: 'Lesson Type',
      trialOption: 'Free Trial (30 min · 0 ₼)',
      regularOption: 'Regular Session (45 min)',
      dayLabel: 'Day of Week',
      timeLabel: 'Time Slot (Baku Time)',
      formatLabel: 'Format',
      goalLabel: 'Session Goal (optional)',
      goalPlaceholder: 'e.g. DİM parameter problems review or foundation check',
      conflictWarning: 'Heads up: You already have a session booked at this time slot',
      confirmBtn: 'Confirm Booking',
      saveRescheduleBtn: 'Update Time Slot',
      bookedBadge: 'Slot',
      weeklyTitle: 'Upcoming Weekly Schedule',
      weeklyEmpty: 'Pick a slot from any tutor card to build your weekly schedule.',
      enterClassroom: 'Enter Classroom',
      invitedTag: 'Tutor Invite',
      rescheduledToast: 'Lesson time slot updated',
      bookedToast: 'Lesson added to your schedule',
    },
    classroom: {
      title: 'Live Mini-Classroom',
      subtitle: 'Session timer, interactive whiteboard, shared notes & chat',
      timerLabel: 'Lesson Timer',
      startTimer: 'Start',
      pauseTimer: 'Pause',
      resetTimer: 'Reset',
      micOn: 'Mic On',
      micOff: 'Mic Off',
      camOn: 'Camera On',
      camOff: 'Camera Off',
      screenOn: 'Sharing Screen',
      screenOff: 'Share Screen',
      boardTab: 'Whiteboard',
      notesTab: 'Notes',
      clearBoard: 'Clear',
      undoBoard: 'Undo',
      penLabelPrefix: 'Pen',
      boardAriaLabel: 'Interactive lesson whiteboard',
      sendMessageLabel: 'Send message',
      notesPlaceholder: 'Capture key formulas, mistakes, and next homework plan...',
      savedAuto: 'Auto-saved',
      templateChips: ['DİM Strategy', 'Mistake Log', 'Homework Plan'],
      checklistTitle: 'Session Checklist',
      addTaskPlaceholder: 'Add lesson goal item…',
      addTaskBtn: 'Add',
      chatTitle: 'Session Chat',
      finishBtn: 'Finish Lesson (+40 XP)',
      hwBtn: 'Homework',
      completedToast: 'Lesson completed · +40 XP earned!',
    },
    videoPlayer: {
      chaptersTitle: 'Lesson Chapters',
      playBtn: 'Play',
      pauseBtn: 'Pause',
      speedLabel: 'Speed',
      notesTitle: 'Timestamped Study Notes',
      notePlaceholder: 'Write a takeaway for this timestamp…',
      addNoteBtn: 'Save Note',
      deleteNoteLabel: 'Delete note',
      markWatchedBtn: 'Mark Completed (+15 XP)',
      watchedBadge: 'Completed',
      watchedToast: 'Video lesson marked watched · +15 XP!',
      boardLabel: 'Interactive Concept Board',
      progressLabel: 'Progress',
      keyTakeaway: 'Key Chapter Takeaway',
    },
    teacherSync: {
      gradeBtn: 'Grade Homework',
      scoreLabel: 'Score (0–100)',
      feedbackLabel: 'Feedback for Student',
      feedbackPlaceholder: 'Solid method! Double-check domain constraints in problem #2.',
      saveGradeBtn: 'Submit Grade',
      gradedBadge: 'Graded',
      pendingBadge: 'Needs Review',
      hwQueueTitle: 'Submitted Homework Queue',
      inviteModalToast: 'Student invited — request & chat created in Inbox',
      partnerTitle: 'Modern Teaching Methods Certification',
      partnerSubtitle: '4-week partner program for verified EduMatch tutors',
      partnerHighlights: [
        'Proven frameworks that lift students to 600+ DİM scores within 12 weeks',
        'Verified Methodology badge featured on your catalog tutor card',
        'Full access to diagnostic test packs & interactive classroom templates',
      ],
      partnerEnrollBtn: 'Enroll in Program',
      partnerEnrolledBadge: 'Enrolled',
      partnerEnrolledToast: 'Enrolled in the partner methodology track!',
    },
    studentProfile: {
      defaultName: 'Madina Khanayeva',
      defaultGroup: 'Group I / IV DİM',
      currentRankLabel: 'current rank',
      favoritesLabel: 'saved tutors',
      lessonsLabel: 'lessons',
      myLessonsHeading: 'My Lessons',
      bookCta: '+ Book',
      accountCta: 'Account',
      editProfileLabel: 'Edit profile',
      fullNameLabel: 'Full name',
      fullNamePlaceholder: 'e.g. Madina Khanayeva',
      gradeLabel: 'Grade / Year',
      groupLabel: 'DİM Group / Goal',
      groupPlaceholder: 'e.g. Group I / IV DİM',
      saveBtn: 'Save',
      cancelBtn: 'Cancel',
      savedToast: 'Student profile updated',
    },
  },
};
