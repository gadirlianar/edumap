import { describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EduMatchApp } from '@/components/EduMatchApp';
import { Header } from '@/components/Header';
import { LiquidTabBar } from '@/components/ui/LiquidTabBar';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { AccountHubModal } from '@/components/AccountHubModal';
import { BookingModal, findSlotConflict } from '@/components/BookingModal';
import { ClassroomModal } from '@/components/ClassroomModal';
import { LessonsWorkspace } from '@/components/LessonsWorkspace';
import {
  PartnerCourseModal,
  ThresholdTestModal,
  VideoPlayerModal,
} from '@/components/SecondaryModals';
import { COPY } from '@/data/i18n';
import { INITIAL_CONTENT, INITIAL_REQUESTS, INITIAL_TUTORS } from '@/data/tutors';
import { clearPersistedState } from '@/lib/storage';
import { resetUrlSyncState } from '@/lib/urlSync';

describe('EduMatch WebApp workflows', () => {
  test('Header routes signed-in profile pill to AccountHub and displays unread notifications bell', async () => {
    const user = userEvent.setup();
    const onOpenAuth = vi.fn();
    const onOpenAccountHub = vi.fn();
    const onOpenNotifications = vi.fn();

    render(
      <Header
        locale="ru"
        onLocaleChange={vi.fn()}
        isDark={false}
        onToggleTheme={vi.fn()}
        role="student"
        onRoleChange={vi.fn()}
        studentTab="search"
        onStudentTabChange={vi.fn()}
        teacherTab="inbox"
        onTeacherTabChange={vi.fn()}
        authenticated={true}
        userName="Айсель М."
        onOpenAuth={onOpenAuth}
        onOpenAccountHub={onOpenAccountHub}
        unreadNotifications={3}
        onOpenNotifications={onOpenNotifications}
        onOpenTour={vi.fn()}
        copy={COPY.ru}
      />,
    );

    const bell = screen.getByRole('button', { name: /Уведомления/i });
    expect(bell).toHaveTextContent('3');
    await user.click(bell);
    expect(onOpenNotifications).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Айсель М\./i }));
    expect(onOpenAccountHub).toHaveBeenCalledTimes(1);
    expect(onOpenAuth).not.toHaveBeenCalled();
  });

  test('NotificationDrawer renders unread items, marks all read, and jumps to target action', async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn();
    const onSelectNotification = vi.fn();

    render(
      <NotificationDrawer
        open={true}
        onClose={vi.fn()}
        locale="az"
        notifications={[
          {
            id: 'n1',
            kind: 'invite',
            title: 'Yeni dəvət',
            body: 'Leyla Məmmədova sizə dərs təklif etdi',
            createdAt: 1_700_000_000_000,
            read: false,
            target: { role: 'student', tab: 'lessons', reqId: 10 },
          },
        ]}
        onMarkAllRead={onMarkAllRead}
        onClearRead={vi.fn()}
        onSelectNotification={onSelectNotification}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Hamısını oxunmuş et/i }));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Aç/i }));
    expect(onSelectNotification).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'n1' }),
    );
  });

  test('AccountHubModal supports role switch, install CTA, and sign out', async () => {
    const user = userEvent.setup();
    const onSwitchRole = vi.fn();
    const onSignOut = vi.fn();
    const onTriggerInstall = vi.fn();

    render(
      <AccountHubModal
        open={true}
        onClose={vi.fn()}
        locale="en"
        role="student"
        account={{
          name: 'Aysel M.',
          email: 'aysel@edumatch.az',
          premium: true,
          plan: 'Pro',
          promo: 0,
          authenticated: true,
        }}
        student={{
          cat: '11 класс',
          sec: 'az',
          test: null,
          xp: 180,
          ach: { streak: true },
        }}
        tutors={INITIAL_TUTORS}
        lessonsCount={4}
        savedCount={2}
        isInstalled={false}
        alertsEnabled={true}
        onSwitchRole={onSwitchRole}
        onSelectPersona={vi.fn()}
        onToggleAlerts={vi.fn()}
        onTriggerInstall={onTriggerInstall}
        onSignOut={onSignOut}
        onResetDemo={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Tutor/i }));
    expect(onSwitchRole).toHaveBeenCalledWith('teacher');

    await user.click(screen.getByRole('button', { name: /Install App to Device/i }));
    expect(onTriggerInstall).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Sign Out/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  test('findSlotConflict detects active time collisions and ignores done or excluded lessons', () => {
    const existing = [
      {
        ...INITIAL_REQUESTS[0],
        id: 501,
        mine: true,
        status: 'accepted' as const,
        schedule: {
          dayKey: 'tue',
          dateLabel: 'Вторник',
          time: '18:00',
          format: 'Онлайн' as const,
          durationMin: 45,
        },
      },
      {
        ...INITIAL_REQUESTS[0],
        id: 502,
        mine: true,
        status: 'done' as const,
        schedule: {
          dayKey: 'thu',
          dateLabel: 'Четверг',
          time: '19:30',
          format: 'Онлайн' as const,
          durationMin: 45,
        },
      },
    ];

    expect(
      findSlotConflict(existing, {
        dayKey: 'tue',
        dateLabel: 'Вторник',
        time: '18:00',
        format: 'Онлайн',
        durationMin: 45,
      })?.id,
    ).toBe(501);

    expect(
      findSlotConflict(
        existing,
        {
          dayKey: 'tue',
          dateLabel: 'Вторник',
          time: '18:00',
          format: 'Онлайн',
          durationMin: 45,
        },
        501,
      ),
    ).toBeUndefined();

    expect(
      findSlotConflict(existing, {
        dayKey: 'thu',
        dateLabel: 'Четверг',
        time: '19:30',
        format: 'Онлайн',
        durationMin: 45,
      }),
    ).toBeUndefined();
  });

  test('BookingModal selects day, time, format, goal and calls onConfirmBooking', async () => {
    const user = userEvent.setup();
    const onConfirmBooking = vi.fn();

    render(
      <BookingModal
        open={true}
        onClose={vi.fn()}
        locale="ru"
        tutor={INITIAL_TUTORS[0]}
        existingRequests={[]}
        onConfirmBooking={onConfirmBooking}
      />,
    );

    const goalInput = screen.getByPlaceholderText(/Например: разбор/i);
    await user.type(goalInput, 'Подготовка к параметрам DİM');
    await user.click(screen.getByRole('button', { name: '18:00' }));
    await user.click(screen.getByRole('button', { name: /Подтвердить запись/i }));

    expect(onConfirmBooking).toHaveBeenCalledWith(
      INITIAL_TUTORS[0].id,
      expect.objectContaining({
        trial: true,
        schedule: expect.objectContaining({
          time: '18:00',
          goal: 'Подготовка к параметрам DİM',
        }),
      }),
    );
  });

  test('LessonsWorkspace renders Weekly Schedule agenda alongside Classroom CTA and direct Mark Done', async () => {
    const user = userEvent.setup();
    const onOpenClassroom = vi.fn();
    const onMarkLessonDone = vi.fn();

    render(
      <LessonsWorkspace
        locale="ru"
        xp={120}
        requests={[
          {
            ...INITIAL_REQUESTS[0],
            id: 700,
            tid: INITIAL_TUTORS[0].id,
            mine: true,
            status: 'accepted',
            schedule: {
              dayKey: 'wed',
              dateLabel: 'Среда',
              time: '17:00',
              format: 'Онлайн',
              durationMin: 45,
            },
          },
        ]}
        tutors={INITIAL_TUTORS}
        content={INITIAL_CONTENT}
        hwSubmissions={[]}
        onOpenChat={vi.fn()}
        onOpenTutorProfile={vi.fn()}
        onOpenClassroom={onOpenClassroom}
        onRescheduleRequest={vi.fn()}
        onMarkLessonDone={onMarkLessonDone}
        onSubmitReview={vi.fn()}
        onGoToSearch={vi.fn()}
        onSelectRank={vi.fn()}
      />,
    );

    expect(screen.getByText('Ближайшее расписание')).toBeInTheDocument();
    expect(screen.getAllByText(/Среда · 17:00/i).length).toBeGreaterThanOrEqual(1);

    const classroomBtns = screen.getAllByRole('button', { name: /Войти в мини-класс/i });
    await user.click(classroomBtns[0]);
    expect(onOpenClassroom).toHaveBeenCalledWith(700);

    await user.click(screen.getByRole('button', { name: /Отметить урок завершённым/i }));
    expect(onMarkLessonDone).toHaveBeenCalledWith(700);
  });

  test('ClassroomModal supports timer toggle, notes editing, checklist add/toggle, chat, and finish CTA', async () => {
    const user = userEvent.setup();
    const onSaveNotes = vi.fn();
    const onAddChecklistItem = vi.fn();
    const onToggleChecklist = vi.fn();
    const onSendMessage = vi.fn();
    const onFinishLesson = vi.fn();

    render(
      <ClassroomModal
        open={true}
        onClose={vi.fn()}
        locale="ru"
        role="student"
        tutor={INITIAL_TUTORS[0]}
        request={{
          ...INITIAL_REQUESTS[0],
          id: 888,
          status: 'accepted',
          checklist: [{ id: 'c1', text: 'Повторить квадратные неравенства', done: false }],
          msgs: [{ id: 'm1', from: 't', text: 'Добро пожаловать на занятие!' }],
        }}
        onSaveNotes={onSaveNotes}
        onToggleChecklist={onToggleChecklist}
        onAddChecklistItem={onAddChecklistItem}
        onSendMessage={onSendMessage}
        onFinishLesson={onFinishLesson}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Старт/i }));
    expect(screen.getByRole('button', { name: /Пауза/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Заметки/i }));
    const notesArea = screen.getByPlaceholderText(/Записывайте ключевые формулы/i);
    await user.type(notesArea, 'D = b^2 - 4ac');
    expect(onSaveNotes).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Повторить квадратные неравенства'));
    expect(onToggleChecklist).toHaveBeenCalledWith(888, 'c1');

    const taskInput = screen.getByPlaceholderText(/Добавить пункт урока/i);
    await user.type(taskInput, 'Решить 3 задачи на параметры');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));
    expect(onAddChecklistItem).toHaveBeenCalledWith(888, 'Решить 3 задачи на параметры');

    const chatInput = screen.getByPlaceholderText(/Напишите сообщение/i);
    await user.type(chatInput, 'Готов к разбору!');
    await user.keyboard('{Enter}');
    expect(onSendMessage).toHaveBeenCalledWith(888, 'Готов к разбору!');

    await user.click(screen.getByRole('button', { name: /Завершить урок/i }));
    expect(onFinishLesson).toHaveBeenCalledWith(888);
  });

  test('VideoPlayerModal renders interactive chapter player, speed toggle, notes, and completion without static dead stub', async () => {
    const user = userEvent.setup();
    const onSaveNote = vi.fn();
    const onMarkWatched = vi.fn();

    render(
      <VideoPlayerModal
        open={true}
        onClose={vi.fn()}
        locale="ru"
        tutorName="Лейла Мамедова"
        video={{
          id: 'v-demo',
          title: { ru: 'Параметры без зубрежки', az: 'Parametrlər əzbərsiz', en: 'Parameters without rote' },
          dur: '08:00',
          free: true,
        }}
        watched={false}
        notes={[{ id: 'vn1', timeSec: 45, text: 'Проверить дискриминант D > 0', createdAt: 1_700_000_000_000 }]}
        onSaveNote={onSaveNote}
        onMarkWatched={onMarkWatched}
      />,
    );

    expect(screen.queryByText(/Демо-плеер/i)).not.toBeInTheDocument();
    expect(screen.getByText('Проверить дискриминант D > 0')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '1.25x' }));
    const noteInput = screen.getByPlaceholderText(/Записать мысль по текущему фрагменту/i);
    await user.type(noteInput, 'График параболы сдвигается');
    await user.click(screen.getByRole('button', { name: /Сохранить заметку/i }));
    expect(onSaveNote).toHaveBeenCalledWith('v-demo', expect.any(Number), 'График параболы сдвигается');

    await user.click(screen.getByRole('button', { name: /Отметить пройденным/i }));
    expect(onMarkWatched).toHaveBeenCalledWith('v-demo');
  });

  test('PartnerCourseModal displays curriculum highlights and supports enrollment', async () => {
    const user = userEvent.setup();
    const onEnroll = vi.fn();

    render(
      <PartnerCourseModal
        open={true}
        onClose={vi.fn()}
        locale="az"
        enrolled={false}
        onEnroll={onEnroll}
      />,
    );

    expect(screen.getByRole('heading', { name: /Müasir tədris metodikaları/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Proqrama qoşul/i }));
    expect(onEnroll).toHaveBeenCalledTimes(1);
  });
});

describe('EduMatchApp end-to-end WebApp integration (Task 8)', () => {
  test('signed-in user opens AccountHub via header pill, switches persona, and signs out', async () => {
    window.localStorage.clear();
    clearPersistedState();
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: /Войти/i }));

    const authDialog = screen.getByRole('dialog');
    await user.type(within(authDialog).getByLabelText(/Имя и фамилия/i), 'Диляра А.');
    await user.type(within(authDialog).getByLabelText(/Email или телефон/i), 'dilyara@edumatch.az');
    const consent = within(authDialog).getByRole('checkbox');
    await user.click(consent);
    await user.click(within(authDialog).getByRole('button', { name: /Создать аккаунт/i }));

    const profilePill = within(header).getByRole('button', { name: /Диляра А\./i });
    expect(profilePill).toBeInTheDocument();

    await user.click(profilePill);
    const hubDialog = screen.getByRole('dialog');
    expect(within(hubDialog).getByText(/Профиль и кабина/i)).toBeInTheDocument();

    // Switch persona inside AccountHub -> updates role to Teacher
    await user.click(within(hubDialog).getByRole('button', { name: /Преподаватель/i }));
    expect(within(header).getByRole('button', { name: 'Преподаватель' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // Sign out clears authenticated session back to Войти
    await user.click(within(hubDialog).getByRole('button', { name: /Выйти из аккаунта/i }));
    expect(within(header).getByRole('button', { name: /^Войти$/i })).toBeInTheDocument();
  });

  test('teacher invite stays in teacher role, logs notification, and syncs to Student Lessons', async () => {
    window.localStorage.clear();
    clearPersistedState();
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Преподаватель' }));
    const nav = screen.getByRole('navigation', { name: 'Primary sections' });

    await user.click(within(nav).getByRole('button', { name: 'Премиум' }));
    await user.click(screen.getAllByRole('button', { name: 'Подключить' })[0]);

    await user.click(within(nav).getByRole('button', { name: 'Ученики' }));
    await user.click(screen.getAllByRole('button', { name: 'Пригласить на занятие' })[0]);

    // Stays in Teacher role and logs bell notification
    expect(within(header).getByRole('button', { name: 'Преподаватель' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const bell = within(header).getByRole('button', { name: /Уведомления/i });
    expect(bell).toHaveTextContent('1');

    // Request appears in Teacher Inbox with "Приглашение" badge
    await user.click(within(nav).getByRole('button', { name: 'Заявки' }));
    expect(screen.getAllByText('Приглашение').length).toBeGreaterThanOrEqual(1);

    // Syncs cleanly into Student Lessons when switching back to Student
    await user.click(within(header).getByRole('button', { name: 'Ученик' }));
    await user.click(within(nav).getByRole('button', { name: 'Занятия' }));
    expect(screen.getAllByText('Приглашение').length).toBeGreaterThanOrEqual(1);
  });

  test('student books slot via BookingModal, reschedules, accepts as teacher, and completes Classroom (+40 XP)', async () => {
    window.localStorage.clear();
    clearPersistedState();
    const user = userEvent.setup();
    render(<EduMatchApp />);

    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);
    const catalog = document.getElementById('tutor-catalog')!;
    const timurCard = within(catalog)
      .getAllByRole('article')
      .find((card) => within(card).queryByText('Тимур Рахимов'));
    expect(timurCard).toBeDefined();

    await user.click(within(timurCard!).getByRole('button', { name: /Записаться по времени/i }));
    const bookingDialog = screen.getByRole('dialog');
    await user.type(
      within(bookingDialog).getByPlaceholderText(/Например: разбор/i),
      'Разобрать производные DİM',
    );
    await user.click(within(bookingDialog).getByRole('button', { name: '18:00' }));
    await user.click(within(bookingDialog).getByRole('button', { name: /Подтвердить запись/i }));

    // Go to Lessons and reschedule 18:00 -> 19:30
    const nav = screen.getByRole('navigation', { name: 'Primary sections' });
    await user.click(within(nav).getByRole('button', { name: 'Занятия' }));
    expect(screen.getByText(/Разобрать производные DİM/i)).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /Перенести слот/i })[0]);
    const reschedDialog = screen.getByRole('dialog');
    await user.click(within(reschedDialog).getByRole('button', { name: '19:30' }));
    await user.click(within(reschedDialog).getByRole('button', { name: /Обновить слот/i }));
    expect(screen.getAllByText(/19:30/).length).toBeGreaterThanOrEqual(1);

    // Switch to Teacher -> accept the newly scheduled request
    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Преподаватель' }));
    const acceptButtons = screen.getAllByRole('button', { name: 'Принять' });
    await user.click(acceptButtons[0]);

    // Return to Student -> Lessons -> Enter Mini-Classroom -> Complete Lesson (+40 XP)
    await user.click(within(header).getByRole('button', { name: 'Ученик' }));
    await user.click(within(nav).getByRole('button', { name: 'Занятия' }));
    await user.click(screen.getAllByRole('button', { name: /Войти в мини-класс/i })[0]);

    const classDialog = screen.getByRole('dialog');
    expect(within(classDialog).getByText(/Интерактивный мини-класс/i)).toBeInTheDocument();
    await user.click(within(classDialog).getByRole('button', { name: /Завершить урок/i }));

    expect(screen.getAllByText(/40 XP/i).length).toBeGreaterThanOrEqual(1);
  });

  test('student submits homework and teacher grades it with score & feedback across roles', async () => {
    window.localStorage.clear();
    clearPersistedState();
    const user = userEvent.setup();
    render(<EduMatchApp />);

    // Open Timur's dossier ("me") and submit homework
    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);
    const catalog = document.getElementById('tutor-catalog')!;
    const timurCard = within(catalog)
      .getAllByRole('article')
      .find((card) => within(card).queryByText('Тимур Рахимов'));
    await user.click(within(timurCard!).getByRole('button', { name: /Досье и баллы/i }));

    const profileDialog = screen.getByRole('dialog');
    await user.click(within(profileDialog).getByRole('tab', { name: 'ДЗ' }));
    await user.click(within(profileDialog).getAllByRole('button', { name: 'Сдать работу' })[0]);
    const dialogs = screen.getAllByRole('dialog');
    const hwDialog = dialogs[dialogs.length - 1];
    await user.type(within(hwDialog).getByRole('textbox'), 'Ответы по процентам: 1-10 решены');
    await user.click(within(hwDialog).getByRole('button', { name: /Отправить/i }));
    await user.click(within(profileDialog).getByRole('button', { name: 'Закрыть' }));

    // Teacher grades homework with score 96 and custom feedback
    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Преподаватель' }));
    expect(screen.getByText(/Присланные домашние задания/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Проверить ДЗ/i }));

    const scoreInput = screen.getByLabelText(/Оценка \(0–100\)/i);
    await user.clear(scoreInput);
    await user.type(scoreInput, '96');
    await user.type(screen.getByLabelText(/Комментарий ученику/i), 'Блестящее решение всех задач!');
    await user.click(screen.getByRole('button', { name: /Выставить оценку/i }));

    expect(screen.getAllByText(/96\/100/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Блестящее решение всех задач!/i)).toBeInTheDocument();

    // Student sees score & feedback in Lessons
    await user.click(within(header).getByRole('button', { name: 'Ученик' }));
    const nav = screen.getByRole('navigation', { name: 'Primary sections' });
    await user.click(within(nav).getByRole('button', { name: 'Занятия' }));
    expect(screen.getAllByText(/96\/100/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Блестящее решение всех задач!/i).length).toBeGreaterThanOrEqual(1);
  });

  test('syncs initial role/tab from URL query and reacts to browser popstate navigation', async () => {
    window.localStorage.clear();
    clearPersistedState();
    resetUrlSyncState();
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/?role=teacher&tab=inbox');
    render(<EduMatchApp />);

    expect(screen.getByText('Кабинет преподавателя: заявки')).toBeInTheDocument();

    act(() => {
      window.history.replaceState(null, '', '/?role=student&tab=lessons');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(await screen.findByText('Ближайшее расписание')).toBeInTheDocument();

    // Browser Back navigation to clean '/' restores landing Student Search rather than staying in Teacher/previous tab
    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Преподаватель' }));
    expect(screen.getByText('Кабинет преподавателя: заявки')).toBeInTheDocument();

    act(() => {
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(await screen.findByText('Поиск репетитора')).toBeInTheDocument();
    resetUrlSyncState();
  });

  test('BookingModal resets schedule & goal across reschedules and cross-tutor switches', async () => {
    const onConfirmBooking = vi.fn();
    const user = userEvent.setup();

    const onlineOnlyTutor = { ...INITIAL_TUTORS[0], fmt: ['Онлайн' as const] };
    const { rerender } = render(
      <BookingModal
        open={false}
        onClose={vi.fn()}
        locale="ru"
        tutor={null}
        existingRequests={[]}
        onConfirmBooking={onConfirmBooking}
      />,
    );

    const existingReq = {
      ...INITIAL_REQUESTS[0],
      id: 909,
      tid: onlineOnlyTutor.id,
      trial: false,
      schedule: {
        dayKey: 'fri',
        dateLabel: 'Пятница',
        time: '19:30',
        format: 'Офлайн' as const,
        durationMin: 45,
        goal: 'Повторить тригонометрию',
      },
    };

    rerender(
      <BookingModal
        open={true}
        onClose={vi.fn()}
        locale="ru"
        tutor={onlineOnlyTutor}
        initialRequest={existingReq}
        existingRequests={[existingReq]}
        onConfirmBooking={onConfirmBooking}
      />,
    );

    const goalField = screen.getByLabelText(/Цель урока/i) as HTMLInputElement;
    expect(goalField.value).toBe('Повторить тригонометрию');
    await user.click(screen.getByRole('button', { name: /Обновить слот/i }));
    expect(onConfirmBooking).toHaveBeenCalledWith(
      onlineOnlyTutor.id,
      expect.objectContaining({
        trial: false,
        requestId: 909,
        schedule: expect.objectContaining({
          dayKey: 'fri',
          time: '19:30',
          format: 'Онлайн',
          goal: 'Повторить тригонометрию',
        }),
      }),
    );
  });

  test('ThresholdTestModal handles empty question list without NaN and AccountHub switch has accessible name', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <>
        <ThresholdTestModal
          open={true}
          locale="ru"
          isDemo={false}
          test={{
            id: 'empty-t',
            title: { ru: 'Пустой тест', az: 'Boş test', en: 'Empty quiz' },
            thr: 'Средний',
            qs: [],
          }}
          onClose={onClose}
        />
        <AccountHubModal
          open={true}
          onClose={vi.fn()}
          locale="ru"
          role="student"
          account={{ name: 'Айсель М.', email: 'aysel@edumatch.az', premium: false, plan: '', promo: 0, authenticated: true }}
          student={{ cat: '11 класс', sec: 'az', test: null, xp: 120, ach: { streak: true } }}
          tutors={INITIAL_TUTORS}
          lessonsCount={1}
          savedCount={0}
          isInstalled={false}
          alertsEnabled={true}
          onSwitchRole={vi.fn()}
          onSelectPersona={vi.fn()}
          onToggleAlerts={vi.fn()}
          onTriggerInstall={vi.fn()}
          onSignOut={vi.fn()}
          onResetDemo={vi.fn()}
        />
      </>,
    );

    expect(screen.queryByText(/NaN/i)).not.toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /Умные уведомления/i })).toBeInTheDocument();

    const closeBtns = screen.getAllByRole('button', { name: /Готово/i });
    await user.click(closeBtns[0]);
    expect(onClose).toHaveBeenCalledWith(undefined);
  });

  test('LiquidTabBar supports horizontal pointer scrubbing and ArrowRight/ArrowLeft switching', () => {
    const onChange = vi.fn();
    render(
      <LiquidTabBar
        items={[
          { id: 'search', label: 'Find Tutors' },
          { id: 'test', label: 'Level Quiz' },
          { id: 'lessons', label: 'Lessons' },
        ]}
        activeId="search"
        onChange={onChange}
        ariaLabel="Primary sections"
        layoutId="test-liquid-lens"
        variant="header"
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'Primary sections' });
    const searchBtn = within(nav).getByRole('button', { name: 'Find Tutors' });
    const quizBtn = within(nav).getByRole('button', { name: 'Level Quiz' });
    const lessonsBtn = within(nav).getByRole('button', { name: 'Lessons' });

    vi.spyOn(nav, 'getBoundingClientRect').mockReturnValue({
      left: 0, right: 300, top: 0, bottom: 42, width: 300, height: 42, x: 0, y: 0, toJSON: () => ({}),
    });
    vi.spyOn(searchBtn, 'getBoundingClientRect').mockReturnValue({
      left: 4, right: 100, top: 4, bottom: 38, width: 96, height: 34, x: 4, y: 4, toJSON: () => ({}),
    });
    vi.spyOn(quizBtn, 'getBoundingClientRect').mockReturnValue({
      left: 102, right: 200, top: 4, bottom: 38, width: 98, height: 34, x: 102, y: 4, toJSON: () => ({}),
    });
    vi.spyOn(lessonsBtn, 'getBoundingClientRect').mockReturnValue({
      left: 202, right: 296, top: 4, bottom: 38, width: 94, height: 34, x: 202, y: 4, toJSON: () => ({}),
    });

    const dispatchPointer = (type: string, clientX: number) => {
      const ev = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(ev, 'pointerId', { value: 1 });
      Object.defineProperty(ev, 'pointerType', { value: 'mouse' });
      fireEvent(nav, ev);
    };

    dispatchPointer('pointerdown', 50);
    dispatchPointer('pointermove', 150);
    expect(onChange).toHaveBeenCalledWith('test');

    dispatchPointer('pointermove', 250);
    expect(onChange).toHaveBeenCalledWith('lessons');
    dispatchPointer('pointerup', 250);

    searchBtn.focus();
    fireEvent.keyDown(nav, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  test('EduMatchApp switches sideways between Find Tutors, Level Quiz, and Lessons on horizontal touch swipe', async () => {
    clearPersistedState();
    resetUrlSyncState();
    window.history.replaceState(null, '', '/');

    const { container } = render(<EduMatchApp />);
    const main = container.querySelector('main');
    expect(main).not.toBeNull();

    // Swipe left inside main -> Поиск (search) => Тест (test)
    fireEvent.touchStart(main!, { touches: [{ clientX: 280, clientY: 300 }] });
    fireEvent.touchEnd(main!, { changedTouches: [{ clientX: 140, clientY: 305 }] });

    const nav = screen.getByRole('navigation', { name: 'Primary sections' });
    expect(within(nav).getByRole('button', { name: 'Тест' })).toHaveAttribute('aria-current', 'page');

    // Swipe right back -> Тест (test) => Поиск (search)
    fireEvent.touchStart(main!, { touches: [{ clientX: 140, clientY: 300 }] });
    fireEvent.touchEnd(main!, { changedTouches: [{ clientX: 280, clientY: 305 }] });
    expect(within(nav).getByRole('button', { name: 'Поиск' })).toHaveAttribute('aria-current', 'page');
  });
});
