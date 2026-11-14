import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EduMatchApp } from '@/components/EduMatchApp';
import { INITIAL_TUTORS } from '@/data/tutors';

describe('EduMatch Tier-1 UI Integration', () => {
  it('renders progressive Hero, keeps City Street Map visible, and reveals tutors catalog only via button click', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Выбирайте репетитора по реальным баллам/i,
      }),
    ).toBeInTheDocument();

    // Progressive Hero 01/02 + visible City Street Map + collapsed tutors catalog + no signature badge
    const heroRegion = screen.getByRole('region', { name: /EduMatch showcase/i });
    expect(within(heroRegion).getByRole('button', { name: /Найти репетитора/i })).toBeInTheDocument();
    expect(within(heroRegion).getByRole('button', { name: /Посмотреть на карте/i })).toBeInTheDocument();
    expect(within(heroRegion).getByRole('button', { name: /Пройти тест уровня/i })).toBeInTheDocument();
    expect(within(heroRegion).getByRole('button', { name: 'Физика' })).toBeInTheDocument();
    expect(document.getElementById('tutor-catalog')).toBeNull();
    expect(document.getElementById('tutor-catalog-toggle')).toBeInTheDocument();
    expect(document.getElementById('tutor-map')).toBeInTheDocument();
    expect(screen.queryByText('by M')).not.toBeInTheDocument();

    // Selecting Физика in Hero narrows count, then clicking "Показать репетиторов" reveals #tutor-catalog cleanly (t1, t7, t9, t11)
    await user.click(within(heroRegion).getByRole('button', { name: 'Физика' }));
    await user.click(within(heroRegion).getByRole('button', { name: /Показать репетиторов/i }));
    const catalog = document.getElementById('tutor-catalog')!;
    expect(catalog).toBeInTheDocument();
    expect(within(catalog).getAllByText('Лейла Мамедова').length).toBeGreaterThan(0);
    expect(within(catalog).getAllByText('Гюнель Расулова').length).toBeGreaterThan(0);
    expect(within(catalog).getAllByRole('article')).toHaveLength(4);

    // Collapsing tutors hides #tutor-catalog back behind button while #tutor-map stays visible
    await user.click(within(catalog).getByRole('button', { name: /Свернуть репетиторов/i }));
    expect(document.getElementById('tutor-catalog')).toBeNull();
    expect(document.getElementById('tutor-map')).toBeInTheDocument();
  });

  it('opens full teacher university & admission score dossier when clicking tutor name', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);

    // Click teacher name on tutor card in catalog
    const catalogSection = document.getElementById('tutor-catalog')!;
    const leylaButtons = within(catalogSection).getAllByRole('button', {
      name: 'Лейла Мамедова',
    });
    await user.click(leylaButtons[leylaButtons.length - 1]);

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: 'Лейла Мамедова' }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Университет и балл поступления/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Бакинский государственный университет/i),
    ).toBeInTheDocument();
    expect(dialog).toHaveTextContent('686/700');
    expect(
      within(dialog).getByText(/Успехи и достижения учеников/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Сильные стороны — чем отличается от других/i),
    ).toBeInTheDocument();

    // Buy course -> auto-switches to unlocked videos, Courses tab shows owned notice
    await user.click(within(dialog).getByRole('tab', { name: /Курсы/i }));
    await user.click(within(dialog).getByRole('button', { name: /Купить курс/i }));
    expect(within(dialog).queryByText('В курсе')).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole('tab', { name: /Курсы/i }));
    expect(
      within(dialog).getByText(/Курс куплен — все видео разблокированы/i),
    ).toBeInTheDocument();
  });

  it('switches UI language (RU -> AZ -> EN) and toggles light/dark theme cleanly', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    expect(document.documentElement.lang).toBe('ru');

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'az' }));
    expect(document.documentElement.lang).toBe('az');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Müəllimi qəbul balı/i,
      }),
    ).toBeInTheDocument();

    await user.click(within(header).getByRole('button', { name: 'en' }));
    expect(document.documentElement.lang).toBe('en');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Choose a tutor by verified scores/i,
      }),
    ).toBeInTheDocument();

    // Theme toggle
    const themeBtn = within(header).getByRole('button', {
      name: /Toggle theme/i,
    });
    expect(document.documentElement.dataset.theme).toBe('light');
    await user.click(themeBtn);
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('supports catalog filtering, empty-state reset, and swipe deck progression', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);
    const catalog = document.getElementById('tutor-catalog')!;
    // Select Subject Chemistry in catalog
    const subjGroup = within(catalog).getByRole('group', { name: /Предмет/i });
    await user.click(within(subjGroup).getByRole('button', { name: 'Химия' }));
    expect(within(catalog).getAllByText('Айгюн Гусейнова').length).toBeGreaterThan(0);

    // Activate favorites with zero favorites -> empty state + clear filters restores subject results
    await user.click(within(catalog).getByRole('button', { name: /Избранное/i }));
    expect(
      within(catalog).getByText(/По этим фильтрам никого не нашлось/i),
    ).toBeInTheDocument();
    await user.click(
      within(catalog).getByRole('button', { name: /Сбросить фильтры/i }),
    );
    expect(
      within(catalog).getAllByText('Айгюн Гусейнова').length,
    ).toBeGreaterThan(0);

    // Switch back to Math (multiple tutors) and test Swipe mode progression
    await user.click(within(subjGroup).getByRole('button', { name: 'Математика' }));
    expect(
      within(catalog).getAllByText('Лейла Мамедова').length,
    ).toBeGreaterThan(0);

    // Switch to Swipe mode and advance through deck to empty reset state
    await user.click(within(catalog).getByRole('button', { name: /Свайп/i }));
    expect(
      within(catalog).getByRole('button', { name: /В избранное/i }),
    ).toBeInTheDocument();
    await user.click(within(catalog).getByRole('button', { name: /В избранное/i }));

    let safety = INITIAL_TUTORS.length + 2;
    while (
      safety-- > 0 &&
      within(catalog).queryByRole('button', { name: /Пропустить/i })
    ) {
      await user.click(within(catalog).getByRole('button', { name: /Пропустить/i }));
    }
    expect(
      within(catalog).getByText(/Вы посмотрели всех преподавателей по фильтрам/i),
    ).toBeInTheDocument();
    await user.click(
      within(catalog).getByRole('button', { name: /Смотреть сначала/i }),
    );
    expect(
      within(catalog).getByRole('button', { name: /Пропустить/i }),
    ).toBeInTheDocument();
  });

  it('completes level diagnostic quiz across 6 questions and unlocks rank/XP', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Тест' }));

    // Start Math diagnostic quiz
    const main = screen.getByRole('main');
    await user.click(within(main).getByRole('button', { name: /Математика/i }));

    // Correct answers for Math bank in catalog.ts:
    // 1: 84, 2: 5, 3: 28,26, 4: 5, 5: 2x, 6: 1/2
    const mathAnswers = ['84', '5', '28,26', '5', '2x', '1/2'];
    for (const ans of mathAnswers) {
      await user.click(screen.getByRole('button', { name: ans }));
    }

    expect(screen.getByText(/6 из 6 верно/i)).toBeInTheDocument();
    expect(screen.getByText(/Продвинутый уровень/i)).toBeInTheDocument();

    // Return to search and verify diagnostic callout shows saved level
    await user.click(
      screen.getByRole('button', { name: /Найти преподавателей/i }),
    );
    expect(screen.getByText(/Ваш уровень после теста:/i)).toBeInTheDocument();
  });

  it('books a free trial, sends chat message & sticker, and submits lesson review', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);
    const catalog = document.getElementById('tutor-catalog')!;
    const trialButtons = within(catalog).getAllByRole('button', {
      name: /Пробный урок — 0 ₼/i,
    });
    await user.click(trialButtons[0]);

    // Chat modal opens immediately
    const dialog = screen.getByRole('dialog');
    const msgInput = within(dialog).getByRole('textbox');
    await user.type(msgInput, 'Можно во вторник в 18:00?');
    await user.keyboard('{Enter}');
    expect(
      within(dialog).getByText('Можно во вторник в 18:00?'),
    ).toBeInTheDocument();

    // Open quick reactions tray and send unlocked reaction badge
    await user.click(within(dialog).getByRole('button', { name: /Быстрые реакции/i }));
    const reactionButtons = within(dialog).getAllByRole('button', { name: /Send .* reaction/i });
    await user.click(reactionButtons[0]);
    expect(within(dialog).getByText('Супер!')).toBeInTheDocument();

    // Close chat and open Lessons tab
    await user.click(within(dialog).getByRole('button', { name: /Закрыть/i }));
    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Занятия' }));

    // Wait for auto-accepted status (900ms timer) then mark lesson done & review
    const markDoneBtn = await screen.findByRole(
      'button',
      { name: /Отметить урок завершённым/i },
      { timeout: 2500 },
    );
    await user.click(markDoneBtn);

    const starBtn = screen.getByRole('button', { name: '5 stars' });
    await user.click(starBtn);
    await user.type(
      screen.getByPlaceholderText(/Что понравилось\?/i),
      'Отлично разобрали задачи DİM!',
    );
    await user.click(screen.getByRole('button', { name: /Отправить отзыв/i }));
    expect(screen.getByText(/Отлично разобрали задачи DİM!/i)).toBeInTheDocument();
  });

  it('lets teachers update university score and activate ad promo reflected in student view', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Преподаватель' }));

    // Edit teacher university & entrance score
    await user.click(within(header).getByRole('button', { name: 'Профиль' }));
    const scoreInput = screen.getByLabelText(/Балл поступления \(из 700\)/i);
    await user.clear(scoreInput);
    await user.type(scoreInput, '695');

    const uniInput = screen.getByLabelText(/Университет/i);
    await user.clear(uniInput);
    await user.type(uniInput, 'ADA University (Honors)');

    await user.click(screen.getByRole('button', { name: /Сохранить досье/i }));
    expect(screen.getByText(/Данные профиля обновлены/i)).toBeInTheDocument();

    // Activate 7-day Ad promo
    await user.click(within(header).getByRole('button', { name: 'Премиум' }));
    await user.click(screen.getByRole('button', { name: /7 дней · 9 ₼/i }));

    // Switch back to Student view, open catalog, and verify Promoted card is #1 with updated 695/700 score
    await user.click(within(header).getByRole('button', { name: 'Ученик' }));
    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);
    const catalog = document.getElementById('tutor-catalog')!;
    const cards = within(catalog).getAllByRole('article');
    expect(within(cards[0]).getByText('Реклама')).toBeInTheDocument();
    expect(cards[0]).toHaveTextContent('695/700');
    expect(cards[0]).toHaveTextContent('ADA University (Honors)');
  });

  it('validates sign-up required fields & privacy agreement and renders localized privacy policy', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Войти' }));

    const dialog = screen.getByRole('dialog');
    const submitBtn = within(dialog).getByRole('button', {
      name: 'Создать аккаунт',
    });

    // Attempt submit without name/email
    await user.click(submitBtn);
    expect(screen.getByText(/Укажите имя и email или телефон/i)).toBeInTheDocument();

    // Fill name & email, skip policy checkbox
    await user.type(within(dialog).getByLabelText(/Имя и фамилия/i), 'Нигяр Алиева');
    await user.type(
      within(dialog).getByLabelText(/Email или телефон/i),
      'nigar@example.az',
    );
    await user.click(submitBtn);
    expect(
      screen.getByText(/Примите политику конфиденциальности/i),
    ).toBeInTheDocument();

    // Accept checkbox -> completes auth and displays name in Header
    await user.click(within(dialog).getByRole('checkbox'));
    await user.click(submitBtn);
    expect(within(header).getByText('Нигяр Алиева')).toBeInTheDocument();

    // Open Privacy Policy from footer & toggle between Student and Tutor policy
    await user.click(
      screen.getByRole('button', { name: /Политика конфиденциальности/i }),
    );
    const privacyDialog = screen.getByRole('dialog');
    expect(
      within(privacyDialog).getByText(/Какие данные мы собираем/i),
    ).toBeInTheDocument();
    await user.click(
      within(privacyDialog).getByRole('button', { name: 'Преподавателям' }),
    );
    expect(
      within(privacyDialog).getByText(/Проверка дипломов и баллов/i),
    ).toBeInTheDocument();
  });

  it('navigates 3-step onboarding tour and hands off cleanly to auth modal', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Гид' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Шаг 1 \/ 3/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Далее' }));
    expect(within(dialog).getByText(/Шаг 2 \/ 3/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Далее' }));
    expect(within(dialog).getByText(/Шаг 3 \/ 3/i)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Начать подбор' }));
    expect(
      within(screen.getByRole('dialog')).getByRole('heading', {
        name: /Создайте профиль в EduMatch/i,
      }),
    ).toBeInTheDocument();
  });

  it('guards empty homework submission and accepts valid answer', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    await user.click(screen.getAllByRole('button', { name: /Показать репетиторов/i })[0]);

    // Open Leyla Mammadova dossier -> ДЗ tab
    const catalog = document.getElementById('tutor-catalog')!;
    const leylaBtns = within(catalog).getAllByRole('button', {
      name: 'Лейла Мамедова',
    });
    await user.click(leylaBtns[leylaBtns.length - 1]);

    const profileDialog = screen.getByRole('dialog');
    await user.click(within(profileDialog).getByRole('tab', { name: /ДЗ/i }));
    await user.click(
      within(profileDialog).getByRole('button', { name: /Сдать работу/i }),
    );

    const dialogs = screen.getAllByRole('dialog');
    const hwDialog = dialogs[dialogs.length - 1];
    // Submitting empty should trigger validation toast without closing modal
    await user.click(within(hwDialog).getByRole('button', { name: /Отправить/i }));
    expect(
      screen.getByText(/Добавьте текстовый ответ или прикрепите файл/i),
    ).toBeInTheDocument();

    await user.type(
      within(hwDialog).getByPlaceholderText(/Ваш ответ или решение/i),
      'sin²x + cos²x = 1',
    );
    await user.click(within(hwDialog).getByRole('button', { name: /Отправить/i }));
    expect(screen.getByText(/На проверке|Принято/i)).toBeInTheDocument();
  });

  it('switches Geo Radar city, approves new teacher certificate, and resets demo cleanly', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    // City street map is always visible; switch Баку -> Гянджа
    const mapSection = document.getElementById('tutor-map')!;
    await user.click(within(mapSection).getByRole('button', { name: 'Гянджа' }));
    expect(
      within(mapSection).getByRole('heading', { name: 'Гянджа' }),
    ).toBeInTheDocument();

    // Teacher adds & approves new certificate
    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Преподаватель' }));
    await user.click(within(header).getByRole('button', { name: 'Профиль' }));

    await user.type(
      screen.getByPlaceholderText(/IELTS 8\.0/i),
      'Сертификат RFO 2025',
    );
    await user.click(screen.getByRole('button', { name: 'Добавить' }));
    expect(screen.getByText('Сертификат RFO 2025')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Подтвердить$/i }));
    expect(
      screen.queryByRole('button', { name: /^Подтвердить$/i }),
    ).not.toBeInTheDocument();

    // Reset data returns to student role, Баку on visible map, and collapsed tutors button
    await user.click(screen.getByRole('button', { name: /Сбросить данные/i }));
    expect(screen.getByText(/Данные восстановлены/i)).toBeInTheDocument();
    expect(document.getElementById('tutor-catalog')).toBeNull();
    expect(document.getElementById('tutor-map')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Баку' }),
    ).toBeInTheDocument();
  });

  it('opens Go-To-Market Strategy & Product Logic workspace with interactive phase tabs and unit economics simulator', async () => {
    const user = userEvent.setup();
    render(<EduMatchApp />);

    // Open from Header Strategy tab
    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Стратегия' }));
    const gtmSection = document.getElementById('gtm-strategy')!;
    expect(gtmSection).toBeInTheDocument();
    expect(
      within(gtmSection).getByRole('heading', {
        level: 1,
        name: /Стратегия выхода на рынок и логика продукта/i,
      }),
    ).toBeInTheDocument();

    // Switch 3-phase rollout selector to Phase 02 & Phase 03
    await user.click(within(gtmSection).getByRole('tab', { name: 'Фаза 02' }));
    expect(
      within(gtmSection).getByText(/Сумгаит и Гянджу/i),
    ).toBeInTheDocument();

    await user.click(within(gtmSection).getByRole('tab', { name: 'Фаза 03' }));
    expect(
      within(gtmSection).getByText(/SaaS-подписка EduMatch PRO/i),
    ).toBeInTheDocument();

    // Interactive unit-economics simulator updates dynamically on preset selection
    const initialGmv = screen.getByTestId('gtm-out-gmv').textContent;
    await user.click(within(gtmSection).getByRole('button', { name: /Масштаб \(Мес 12\)/i }));
    expect(screen.getByTestId('gtm-out-gmv')).toHaveTextContent('755,768 ₼');
    expect(screen.getByTestId('gtm-out-rev')).toHaveTextContent('95,442 ₼');
    expect(screen.getByTestId('gtm-out-gmv').textContent).not.toBe(initialGmv);

    // Clicking catalog CTA returns cleanly to student Search with catalog expanded
    await user.click(
      within(gtmSection).getByRole('button', { name: /Открыть каталог репетиторов/i }),
    );
    expect(document.getElementById('tutor-catalog')).toBeInTheDocument();
  });
});
