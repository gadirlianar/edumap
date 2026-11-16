import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EduMatchApp } from '@/components/EduMatchApp';
import { clearPersistedState } from '@/lib/storage';

function switchToTeacher(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole('button', { name: 'Преподаватель' }));
}

describe('EduMatch Teacher Workflows, Modal Hygiene, and Normal UI Guarantees', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearPersistedState();
  });

  it('renders clean academic vector badges with zero cat image assets or cat stickers', () => {
    const { container } = render(<EduMatchApp />);

    const catImages = container.querySelectorAll('img[src*="/cats/"]');
    expect(catImages).toHaveLength(0);
    expect(screen.queryByAltText(/Sticker/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Онлайн-кот|Тетрадный кот/i)).not.toBeInTheDocument();
  });

  it('supports progressive Hero intent/category selection and expandable catalog Filters drawer', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const showcase = screen.getByRole('region', { name: /EduMatch showcase/i });

    // Progressive Hero: pick Математика + 9 класс, then click "Показать репетиторов" -> reveals catalog with Damir + regional math mentors
    await user.click(within(showcase).getByRole('button', { name: 'Математика' }));
    await user.click(within(showcase).getByRole('button', { name: '9 класс' }));
    await user.click(within(showcase).getByRole('button', { name: /Показать репетиторов/i }));
    const catalog = document.getElementById('tutor-catalog')!;
    expect(within(catalog).getByText('Дамир Абдуллаев')).toBeInTheDocument();

    // Extra filters (Style, Language, Max price) stay collapsed until "Фильтры" is toggled
    expect(within(catalog).queryByText(/Стиль преподавания/i)).not.toBeInTheDocument();
    await user.click(within(catalog).getByRole('button', { name: /Фильтры/i }));
    expect(within(catalog).getByText(/Стиль преподавания/i)).toBeInTheDocument();
  });

  it('resets modal draft/step state when OnboardingTourModal, ChatModal, or HomeworkSubmitModal closes', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    // Open onboarding tour -> advance to step 2 -> close -> reopen -> must reset to step 1
    await user.click(screen.getAllByRole('button', { name: /Как работает/i })[0]);
    let dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Шаг 1 / 3')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Далее' }));
    expect(within(dialog).getByText('Шаг 2 / 3')).toBeInTheDocument();
    await user.click(within(dialog).getAllByRole('button', { name: 'Закрыть' })[0]);

    await user.click(screen.getAllByRole('button', { name: /Как работает/i })[0]);
    dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Шаг 1 / 3')).toBeInTheDocument();
    await user.click(within(dialog).getAllByRole('button', { name: 'Закрыть' })[0]);

    // Reveal catalog, book trial -> ChatModal opens -> type unsent draft -> close -> reopen from Lessons -> draft cleared
    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);
    await user.click(screen.getAllByRole('button', { name: 'Пробный урок — 0 ₼' })[0]);
    dialog = screen.getByRole('dialog');
    const msgInput = within(dialog).getByPlaceholderText('Напишите сообщение…');
    await user.type(msgInput, 'Черновик сообщения');
    expect(msgInput).toHaveValue('Черновик сообщения');
    await user.click(within(dialog).getByRole('button', { name: 'Закрыть' }));

    const nav = screen.getByRole('navigation', { name: 'Primary sections' });
    await user.click(within(nav).getByRole('button', { name: 'Занятия' }));
    await user.click(screen.getAllByRole('button', { name: 'Открыть чат' })[0]);
    dialog = screen.getByRole('dialog');
    expect(within(dialog).getByPlaceholderText('Напишите сообщение…')).toHaveValue('');
    await user.click(within(dialog).getByRole('button', { name: 'Закрыть' }));

    // Open tutor profile -> DЗ tab -> Submit work -> type unsent answer -> close -> reopen -> cleared
    await user.click(within(nav).getByRole('button', { name: 'Поиск' }));
    await user.click(screen.getAllByRole('button', { name: 'Досье и баллы' })[0]);
    const profileDialog = screen.getByRole('dialog');
    await user.click(within(profileDialog).getByRole('tab', { name: 'ДЗ' }));
    await user.click(within(profileDialog).getAllByRole('button', { name: 'Сдать работу' })[0]);
    const dialogs = screen.getAllByRole('dialog');
    const hwDialog = dialogs[dialogs.length - 1];
    const hwTextarea = within(hwDialog).getByRole('textbox');
    await user.type(hwTextarea, 'Неотправленный черновик ДЗ');
    expect(hwTextarea).toHaveValue('Неотправленный черновик ДЗ');
    await user.click(within(hwDialog).getByRole('button', { name: 'Назад' }));

    await user.click(within(profileDialog).getAllByRole('button', { name: 'Сдать работу' })[0]);
    const reopenedDialogs = screen.getAllByRole('dialog');
    const reopenedHwDialog = reopenedDialogs[reopenedDialogs.length - 1];
    expect(within(reopenedHwDialog).getByRole('textbox')).toHaveValue('');
  });

  it('handles Teacher Inbox filtering, accepting/declining requests, and opening chat', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    await switchToTeacher(user);
    expect(screen.getByText('Кабинет преподавателя: заявки')).toBeInTheDocument();

    // Filter to regular requests only -> accept one
    const typeGroup = screen.getByRole('group', { name: 'Тип заявки' });
    await user.click(within(typeGroup).getByRole('button', { name: 'Обычные' }));
    const acceptButtonsBefore = screen.getAllByRole('button', { name: 'Принять' });
    expect(acceptButtonsBefore.length).toBeGreaterThan(0);

    await user.click(screen.getAllByRole('button', { name: 'Принять' })[0]);

    // After accepting, chat auto-reply should exist when opening chat for that request
    const chatBtns = screen.getAllByRole('button', { name: 'Открыть чат' });
    await user.click(chatBtns[0]);
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText('Здравствуйте! Заявка принята, предлагаю обсудить расписание.'),
    ).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Закрыть' }));

    // Reset filter and decline another pending request if present
    await user.click(within(typeGroup).getByRole('button', { name: 'Все' }));
    const declineBtns = screen.queryAllByRole('button', { name: 'Отклонить' });
    if (declineBtns.length > 0) {
      await user.click(declineBtns[0]);
    }
  });

  it('edits Teacher academic dossier (clamping score to <= 700), approves certificate, activates Premium, invites students, and publishes Studio content without persisting blob URLs', async () => {
    const user = userEvent.setup();
    const createObjectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-session-video-1');

    try {
      render(<EduMatchApp />);
      await switchToTeacher(user);
      const nav = screen.getByRole('navigation', { name: 'Primary sections' });

      // 1. Edit profile & clamp score 999 -> 700
      await user.click(within(nav).getByRole('button', { name: 'Профиль' }));
      const uniInput = screen.getByLabelText('Университет');
      await user.clear(uniInput);
      await user.type(uniInput, 'ADA University Honors');

      const scoreInput = screen.getByLabelText(/Балл поступления/i);
      await user.clear(scoreInput);
      await user.type(scoreInput, '999');

      const diffInput = screen.getByLabelText(/Чем вы отличаетесь/i);
      await user.clear(diffInput);
      await user.type(diffInput, 'Персональный разбор каждого варианта DİM за 3 дня');

      await user.click(screen.getByRole('button', { name: 'Сохранить досье' }));
      expect(screen.getByLabelText(/Балл поступления/i)).toHaveValue(700);

      // Add pending certificate and approve it
      await user.type(
        screen.getByPlaceholderText(/IELTS 8.0/i),
        'SAT Math 800/800',
      );
      await user.click(screen.getByRole('button', { name: 'Добавить' }));
      expect(screen.getByText('SAT Math 800/800')).toBeInTheDocument();
      const approveDemoBtns = screen.getAllByRole('button', { name: 'Подтвердить' });
      await user.click(approveDemoBtns[approveDemoBtns.length - 1]);

      // 2. Activate Premium in Premium tab to unlock student invites & test builder
      await user.click(within(nav).getByRole('button', { name: 'Премиум' }));
      await user.click(screen.getAllByRole('button', { name: 'Подключить' })[0]);

      // 3. Teacher Students tab: filter sector AZ and invite student
      await user.click(within(nav).getByRole('button', { name: 'Ученики' }));
      const sectorGroup = screen.getByRole('group', { name: 'Сектор' });
      await user.click(within(sectorGroup).getByRole('button', { name: 'AZ' }));
      const inviteButtons = screen.getAllByRole('button', { name: 'Пригласить на занятие' });
      expect(inviteButtons.length).toBeGreaterThan(0);
      await user.click(inviteButtons[0]);

      // 4. Studio tab: add video with File -> verify blob URL not written to localStorage
      await user.click(within(nav).getByRole('button', { name: 'Студия' }));
      await user.type(screen.getByPlaceholderText('Название урока'), 'Разбор логарифмов 2026');
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const videoFile = new File(['mock-video'], 'lesson.mp4', { type: 'video/mp4' });
      await user.upload(fileInput, videoFile);
      await user.click(screen.getByRole('button', { name: 'Добавить видео' }));

      expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Разбор логарифмов 2026')).toBeInTheDocument();

      // Verify blob: URL is NOT persisted in localStorage
      const storageKey = window.localStorage.key(0) as string;
      const rawPersisted = window.localStorage.getItem(storageKey) ?? '';
      expect(rawPersisted).not.toContain('blob:mock-session-video-1');

      // Bundle into course
      await user.click(screen.getByRole('tab', { name: 'Курсы' }));
      await user.type(screen.getByPlaceholderText('Название курса'), 'Экспресс DİM 2026');
      await user.type(screen.getByPlaceholderText('Цена, ₼'), '85');
      await user.click(screen.getByRole('button', { name: 'Разбор логарифмов 2026' }));
      await user.click(screen.getByRole('button', { name: 'Создать курс' }));
      expect(screen.getByText('Экспресс DİM 2026')).toBeInTheDocument();

      // Publish custom threshold test (unlocked via Premium)
      await user.click(screen.getByRole('tab', { name: 'Тесты' }));
      await user.type(screen.getByPlaceholderText('Название теста'), 'Входной срез по алгебре');
      await user.type(screen.getByPlaceholderText('Текст вопроса'), 'Чему равен log2(8)?');
      await user.type(screen.getByPlaceholderText('Вариант 1'), '2');
      await user.type(screen.getByPlaceholderText('Вариант 2'), '3');
      await user.type(screen.getByPlaceholderText('Вариант 3'), '4');
      await user.type(screen.getByPlaceholderText('Вариант 4'), '8');
      await user.selectOptions(screen.getByLabelText('Номер верного варианта'), '1');
      await user.click(screen.getByRole('button', { name: 'Добавить вопрос' }));
      await user.click(screen.getByRole('button', { name: 'Опубликовать тест' }));
      expect(screen.getByText('Входной срез по алгебре')).toBeInTheDocument();

      // Publish homework (verify clean distinct CTA label)
      await user.click(screen.getByRole('tab', { name: 'ДЗ' }));
      await user.type(screen.getByPlaceholderText('Описание задания'), 'Вариант 14: задачи 1-10');
      await user.click(screen.getByRole('button', { name: 'Опубликовать задание' }));
      expect(screen.getByText('Вариант 14: задачи 1-10')).toBeInTheDocument();
    } finally {
      createObjectUrlSpy.mockRestore();
    }
  });

  it('fully localizes tutor names and reviews in AZ locale and supports interactive hero pill filtering with animated gauges and vector portraits', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'az' }));

    const showcase = screen.getByRole('region', { name: /EduMatch showcase/i });
    const azFindBtn = within(showcase).getByRole('button', { name: /Müəllimləri göstər/i });
    expect(azFindBtn).toBeInTheDocument();
    await user.click(azFindBtn);

    // Localized superpower tag, university, admission gauge, avatar, and achievement appear cleanly in TutorCard without Cyrillic leakage
    const catalog = document.getElementById('tutor-catalog')!;
    expect(within(catalog).getAllByText('Leyla Məmmədova').length).toBeGreaterThan(0);
    expect(within(catalog).queryByText('Лейла Мамедова')).not.toBeInTheDocument();
    expect(within(catalog).getByRole('img', { name: '686/700' })).toBeInTheDocument();
    expect(within(catalog).getAllByRole('img', { name: 'Leyla Məmmədova' }).length).toBeGreaterThan(0);
    expect(within(catalog).getByText(/DİM tələlərini 10 san. tapır/i)).toBeInTheDocument();
    expect(within(catalog).getAllByText(/Bakı Dövlət Universiteti/i).length).toBeGreaterThan(0);
    expect(within(catalog).getAllByText(/şagird 600\+ bal/i).length).toBeGreaterThan(0);

    // Open Leyla Məmmədova dossier -> verify localized review without Cyrillic leakage
    const leylaBtns = within(catalog).getAllByRole('button', { name: 'Leyla Məmmədova' });
    await user.click(leylaBtns[0]);
    const azDialog = screen.getByRole('dialog');
    expect(
      within(azDialog).getByText(/Oğlum 4 aya DİM sınaq balını 160-dan 275-ə qaldırdı!/i),
    ).toBeInTheDocument();
    await user.click(within(azDialog).getByRole('button', { name: 'Bağla' }));

    // Interactive subject pill switches active catalog subject without <select> inside hero
    await user.click(within(showcase).getByRole('button', { name: 'Kimya' }));
    expect(within(catalog).getAllByText('Aygün Hüseynova').length).toBeGreaterThan(0);
    expect(within(catalog).queryByText('Айгюн Гусейнова')).not.toBeInTheDocument();
  });

  it('supports Hero Subject switcher, Superpower tags, real tutor portraits, and Side-by-Side VS Tutor Comparison modal', async () => {
    const user = userEvent.setup();
    const { container } = render(<EduMatchApp />);

    // Open catalog from progressive Hero
    const showcase = screen.getByRole('region', { name: /EduMatch showcase/i });
    await user.click(within(showcase).getByRole('button', { name: /Показать репетиторов/i }));

    // Real human studio portrait <img> is rendered inside Avatar
    const portraitImgs = container.querySelectorAll('img[src*="images.unsplash.com"]');
    expect(portraitImgs.length).toBeGreaterThan(0);

    // Superpower badge is visible on TutorCard
    expect(
      screen.getAllByText(/Карта ловушек DİM за 10 сек/i).length,
    ).toBeGreaterThan(0);

    // Switch subject to Информатика in Hero showcase -> filters catalog to Эльнур Гасанов
    await user.click(within(showcase).getByRole('button', { name: 'Информатика' }));
    const catalog = document.getElementById('tutor-catalog')!;
    expect(within(catalog).getAllByText('Эльнур Гасанов').length).toBeGreaterThan(0);

    // Switch back to Математика so multiple tutors are in catalog
    await user.click(within(showcase).getByRole('button', { name: 'Математика' }));

    // Click "Сравнить" on first tutor card -> Floating VS Compare Dock appears
    const compareBtns = within(catalog).getAllByRole('button', {
      name: /^Сравнить$/i,
    });
    expect(compareBtns.length).toBeGreaterThanOrEqual(2);
    await user.click(compareBtns[0]);

    const vsDock = screen.getByRole('region', {
      name: /Сравнение преподавателей \(VS\)/i,
    });
    expect(vsDock).toBeInTheDocument();

    // Click "Сравнить" on second tutor card -> auto-opens TutorCompareModal (VS)
    const updatedCompareBtns = within(catalog).getAllByRole('button', {
      name: /^Сравнить$/i,
    });
    await user.click(updatedCompareBtns[0]);

    const vsDialog = screen.getByRole('dialog');
    expect(
      within(vsDialog).getByRole('heading', {
        name: /Сравнение досье: 1-на-1 \(VS\)/i,
      }),
    ).toBeInTheDocument();
    expect(within(vsDialog).getByText(/Лидер по баллу/i)).toBeInTheDocument();

    // Close modal and clear floating VS dock
    await user.click(within(vsDialog).getByRole('button', { name: 'Закрыть' }));
    await user.click(within(vsDock).getByRole('button', { name: 'Сбросить' }));
    await waitFor(() => {
      expect(
        screen.queryByRole('region', { name: /Сравнение преподавателей \(VS\)/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('updates live Hero Spotlight tutor card by subject and carousel while keeping catalog collapsed initially', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    // Catalog remains collapsed initially per product constraint
    expect(document.getElementById('tutor-catalog')).toBeNull();
    expect(document.getElementById('tutor-catalog-toggle')).toBeInTheDocument();

    const showcase = screen.getByRole('region', { name: /EduMatch showcase/i });

    // Switch subject in Hero selector -> right-hand live spotlight card updates immediately
    await user.click(within(showcase).getByRole('button', { name: 'Информатика' }));
    expect(
      within(showcase).getByRole('heading', { level: 2, name: 'Эльнур Гасанов' }),
    ).toBeInTheDocument();

    // Switch back to all subjects and step to next spotlight tutor via carousel control
    await user.click(within(showcase).getByRole('button', { name: 'Все предметы' }));
    const firstSpotlightName = within(showcase).getByRole('heading', { level: 2 }).textContent;
    await user.click(within(showcase).getByRole('button', { name: 'Следующий ментор' }));
    const nextSpotlightName = within(showcase).getByRole('heading', { level: 2 }).textContent;
    expect(nextSpotlightName).not.toBe(firstSpotlightName);

    // Clickable VS Bento card opens Compare modal directly
    await user.click(screen.getByRole('button', { name: /1v1 VS/i }));
    expect(
      within(screen.getByRole('dialog')).getByRole('heading', {
        name: /Сравнение досье: 1-на-1 \(VS\)/i,
      }),
    ).toBeInTheDocument();
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Закрыть' }));
  });

  it('supports 3D Hero showcase switching via subject pills & mini-avatars, collapsed toggle portraits, and compact 2-tier Footer', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    // 1. Selecting Informatics in Hero updates 3D showcase mentor while keeping catalog collapsed
    const showcase = screen.getByRole('region', { name: /EduMatch showcase/i });
    await user.click(within(showcase).getByRole('button', { name: 'Информатика' }));
    expect(
      within(showcase).getByRole('heading', { level: 2, name: 'Эльнур Гасанов' }),
    ).toBeInTheDocument();
    expect(document.getElementById('tutor-catalog')).toBeNull();

    // 2. Quick-switch mini-avatar group switches active mentor in 3D Hero showcase
    await user.click(within(showcase).getByRole('button', { name: 'Все предметы' }));
    const switcher = within(showcase).getByRole('group', { name: /Выбор ментора/i });
    const avatarButtons = within(switcher).getAllByRole('button');
    expect(avatarButtons.length).toBeGreaterThanOrEqual(2);
    await user.click(avatarButtons[1]);
    expect(avatarButtons[1]).toHaveAttribute('aria-pressed', 'true');

    // 3. Collapsed catalog toggle contains clickable preview mentor avatar buttons that open dossier
    const toggleBar = document.getElementById('tutor-catalog-toggle')!;
    const previewAvatars = within(toggleBar).getAllByRole('button', { name: /\/700\)/i });
    expect(previewAvatars.length).toBeGreaterThanOrEqual(2);
    await user.click(previewAvatars[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Закрыть' }));

    // 4. Compact 2-tier Footer preserves privacy & teacher switch actions
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(/Аудит дипломов и баллов DİM/i)).toBeInTheDocument();
    await user.click(within(footer).getByRole('button', { name: /Политика конфиденциальности/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
