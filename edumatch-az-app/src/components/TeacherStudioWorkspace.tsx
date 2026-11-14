'use client';

import React, { useState } from 'react';
import {
  Check,
  FilmSlate,
  Lock,
  Play,
  Plus,
} from '@phosphor-icons/react';
import { LEVELS } from '@/data/catalog';
import { COPY, LEVEL_LABELS } from '@/data/i18n';
import { resolveLocalized } from '@/data/tutors';
import type {
  HomeworkSubmission,
  LevelId,
  Locale,
  QuizQuestion,
  StudioTab,
  TutorContent,
  TutorTest,
} from '@/types/edumatch';

interface TeacherStudioWorkspaceProps {
  locale: Locale;
  content: TutorContent;
  isPremium: boolean;
  hwSubmissions: HomeworkSubmission[];
  onAddVideo: (title: string, free: boolean, file?: File | null) => void;
  onPlayVideo: (videoId: string) => void;
  onCreateCourse: (title: string, price: number, videoIds: string[]) => void;
  onPublishTest: (test: Omit<TutorTest, 'id'>) => void;
  onRunDemoTest: (threshold: LevelId) => void;
  onAddHomework: (title: string, pts: number) => void;
  onApproveHomework: (subId: string) => void;
  onOpenPremium: () => void;
  onNotify: (msg: string, cat?: string) => void;
}

export function TeacherStudioWorkspace({
  locale,
  content,
  isPremium,
  hwSubmissions,
  onAddVideo,
  onPlayVideo,
  onCreateCourse,
  onPublishTest,
  onRunDemoTest,
  onAddHomework,
  onApproveHomework,
  onOpenPremium,
  onNotify,
}: TeacherStudioWorkspaceProps) {
  const copy = COPY[locale];
  const [tab, setTab] = useState<StudioTab>('videos');

  // Videos
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFree, setVideoFree] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Courses
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [selectedVids, setSelectedVids] = useState<string[]>([]);

  // Tests
  const [demoThreshold, setDemoThreshold] = useState<LevelId>('Средний');
  const [testTitle, setTestTitle] = useState('');
  const [testThreshold, setTestThreshold] = useState<LevelId>('Средний');
  const [draftQs, setDraftQs] = useState<QuizQuestion[]>([]);
  const [qPrompt, setQPrompt] = useState('');
  const [qOpts, setQOpts] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);

  // Homework
  const [hwTitle, setHwTitle] = useState('');
  const [hwPts, setHwPts] = useState('20');

  const subTabs: { id: StudioTab; label: string }[] = [
    { id: 'videos', label: copy.profileModal.tabs.videos },
    { id: 'courses', label: copy.profileModal.tabs.courses },
    { id: 'tests', label: copy.profileModal.tabs.tests },
    { id: 'hw', label: copy.profileModal.tabs.hw },
  ];

  const mySubmissions = hwSubmissions.filter((s) => s.tid === 'me');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="px-1 pt-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-extrabold text-[var(--primary)]">
          <FilmSlate size={14} weight="fill" aria-hidden="true" />
          <span>{copy.nav.studio}</span>
        </div>
        <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {copy.teacher.studioBannerTitle}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">{copy.teacher.studioBannerSub}</p>
      </header>

      {/* Sub Tabs */}
      <div
        role="tablist"
        className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1"
      >
        {subTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[40px] flex-1 cursor-pointer whitespace-nowrap rounded-xl px-4 py-1.5 text-xs font-extrabold transition ${
              tab === t.id
                ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Videos Tab */}
      {tab === 'videos' ? (
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="em-card space-y-3 rounded-3xl p-5 lg:col-span-5">
            <h2 className="text-base font-extrabold">{copy.teacher.addVideo}</h2>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder={copy.teacher.videoTitlePh}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)]"
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-[var(--muted)]"
            />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={videoFree}
                onChange={(e) => setVideoFree(e.target.checked)}
              />
              <span>{copy.teacher.freeForAll}</span>
            </label>
            <button
              type="button"
              onClick={() => {
                if (!videoTitle.trim()) {
                  onNotify(copy.teacher.needTitle, 'wow');
                  return;
                }
                onAddVideo(videoTitle.trim(), videoFree, videoFile);
                setVideoTitle('');
                setVideoFile(null);
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
            >
              <Plus size={14} weight="bold" aria-hidden="true" />
              {copy.teacher.uploadBtn}
            </button>
          </div>

          <div className="space-y-2.5 lg:col-span-7">
            {content.videos.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onPlayVideo(v.id)}
                className="em-card flex w-full cursor-pointer items-center gap-3.5 rounded-2xl p-4 text-left hover:border-[var(--ink)]"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--ink)] text-[var(--bg)]">
                  <Play size={18} weight="fill" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-extrabold">
                    {resolveLocalized(v.title, locale)}
                  </div>
                  <div className="text-xs text-[var(--muted)]">{v.dur}</div>
                </div>
                {v.free ? (
                  <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
                    {copy.profileModal.free}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Courses Tab */}
      {tab === 'courses' ? (
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="em-card space-y-3 rounded-3xl p-5 lg:col-span-7">
            <h2 className="text-base font-extrabold">{copy.teacher.newCourse}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder={copy.teacher.courseTitlePh}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)]"
              />
              <input
                type="number"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                placeholder={copy.teacher.coursePricePh}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--ink)]"
              />
            </div>

            <div className="text-xs font-bold text-[var(--muted)]">
              {copy.teacher.pickVideos}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {content.videos.map((v) => {
                const picked = selectedVids.includes(v.id);
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={picked}
                    onClick={() =>
                      setSelectedVids((prev) =>
                        picked ? prev.filter((id) => id !== v.id) : [...prev, v.id],
                      )
                    }
                    className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold ${
                      picked
                        ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                        : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                    }`}
                  >
                    {resolveLocalized(v.title, locale)}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                const priceNum = Number(coursePrice);
                if (!courseTitle.trim() || !priceNum || selectedVids.length === 0) {
                  onNotify(copy.teacher.needCourseFields, 'wow');
                  return;
                }
                onCreateCourse(courseTitle.trim(), priceNum, selectedVids);
                setCourseTitle('');
                setCoursePrice('');
                setSelectedVids([]);
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-2 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
            >
              {copy.teacher.createCourse}
            </button>
          </div>

          <div className="space-y-2.5 lg:col-span-5">
            {content.courses.map((c) => (
              <div key={c.id} className="em-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold">
                    {resolveLocalized(c.title, locale)}
                  </h3>
                  <span className="font-mono-num text-lg font-extrabold">{c.price} ₼</span>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {c.vids.length} {copy.profileModal.videosCount} · {c.sold}{' '}
                  {copy.teacher.soldLabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Tests Tab */}
      {tab === 'tests' ? (
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            {isPremium ? (
              <div className="em-card space-y-3 rounded-3xl p-5">
              <h2 className="text-base font-extrabold">{copy.teacher.newTest}</h2>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder={copy.teacher.testTitlePh}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm"
              />
              <div>
                <div className="text-xs font-bold text-[var(--muted)]">
                  {copy.teacher.acceptFromLevel}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setTestThreshold(l)}
                      aria-pressed={testThreshold === l}
                      className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold ${
                        testThreshold === l
                          ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                          : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                      }`}
                    >
                      {LEVEL_LABELS[l][locale]}
                    </button>
                  ))}
                </div>
              </div>

              {draftQs.length > 0 ? (
                <div className="space-y-1 rounded-2xl bg-[var(--surface-subtle)] p-3 text-xs">
                  {draftQs.map((q, idx) => (
                    <div key={idx}>
                      {idx + 1}. {resolveLocalized(q.prompt, locale)} ✓{' '}
                      <strong>{resolveLocalized(q.options[q.correctIndex], locale)}</strong>
                    </div>
                  ))}
                </div>
              ) : null}

              <input
                type="text"
                value={qPrompt}
                onChange={(e) => setQPrompt(e.target.value)}
                placeholder={copy.teacher.questionPh}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                {qOpts.map((val, i) => (
                  <input
                    key={i}
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const next = [...qOpts];
                      next[i] = e.target.value;
                      setQOpts(next);
                    }}
                    placeholder={`${copy.teacher.optionPh} ${i + 1}`}
                    className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                  />
                ))}
              </div>

              <label className="flex max-w-xs flex-col gap-1 text-xs font-bold text-[var(--muted)]">
                <span>{copy.teacher.correctOption}</span>
                <select
                  value={qCorrect}
                  onChange={(e) => setQCorrect(Number(e.target.value))}
                  className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--ink)]"
                >
                  {[0, 1, 2, 3].map((idx) => (
                    <option key={idx} value={idx}>
                      {idx + 1}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!qPrompt.trim() || qOpts.some((o) => !o.trim())) {
                      onNotify(copy.teacher.needQuestionFields, 'wow');
                      return;
                    }
                    setDraftQs((prev) => [
                      ...prev,
                      {
                        prompt: qPrompt.trim(),
                        options: qOpts.map((o) => o.trim()),
                        correctIndex: qCorrect,
                      },
                    ]);
                    setQPrompt('');
                    setQOpts(['', '', '', '']);
                  }}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-extrabold"
                >
                  <Plus size={14} weight="bold" aria-hidden="true" />
                  {copy.teacher.addQuestion}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!testTitle.trim() || draftQs.length === 0) {
                      onNotify(copy.teacher.needTestFields, 'wow');
                      return;
                    }
                    onPublishTest({
                      title: testTitle.trim(),
                      thr: testThreshold,
                      qs: draftQs,
                    });
                    setTestTitle('');
                    setDraftQs([]);
                  }}
                  className="inline-flex min-h-[40px] cursor-pointer items-center rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                >
                  {copy.teacher.publish}
                </button>
              </div>
            </div>
          ) : (
            <div className="em-card rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold">{copy.teacher.thresholdTestsTitle}</h2>
                <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent-ink)]">
                  {copy.nav.premium}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)]">{copy.teacher.thresholdTestsDesc}</p>
              <div className="flex flex-wrap gap-1.5">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setDemoThreshold(l)}
                    aria-pressed={demoThreshold === l}
                    className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1 text-xs font-bold ${
                      demoThreshold === l
                        ? 'border-transparent bg-[var(--ink)] text-[var(--bg)]'
                        : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)]'
                    }`}
                  >
                    {LEVEL_LABELS[l][locale]}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onRunDemoTest(demoThreshold)}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-1.5 text-xs font-bold text-[var(--bg)] transition hover:opacity-90"
                >
                  <Play size={14} weight="fill" aria-hidden="true" />
                  {copy.teacher.demoTestBtn}
                </button>
                <button
                  type="button"
                  onClick={onOpenPremium}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                >
                  <Lock size={14} weight="bold" aria-hidden="true" />
                  {copy.teacher.unlockBuilderBtn}
                </button>
              </div>
            </div>
          )}
          </div>

          <div className="space-y-2.5 lg:col-span-5">
            {content.tests.map((te) => (
              <div key={te.id} className="em-card rounded-2xl p-4">
                <h3 className="text-base font-extrabold">
                  {resolveLocalized(te.title, locale)}
                </h3>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {te.qs.length} {copy.profileModal.questionsShort} · {LEVEL_LABELS[te.thr][locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Homework Tab */}
      {tab === 'hw' ? (
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          <div className="em-card space-y-3 rounded-3xl p-5 lg:col-span-5">
            <h2 className="text-base font-extrabold">{copy.teacher.newHw}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={hwTitle}
                onChange={(e) => setHwTitle(e.target.value)}
                placeholder={copy.teacher.hwTitlePh}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm sm:col-span-2"
              />
              <input
                type="number"
                value={hwPts}
                onChange={(e) => setHwPts(e.target.value)}
                placeholder={copy.teacher.hwPtsPh}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!hwTitle.trim()) {
                  onNotify(copy.teacher.needHwTitle, 'wow');
                  return;
                }
                onAddHomework(hwTitle.trim(), Number(hwPts) || 20);
                setHwTitle('');
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
            >
              <Plus size={14} weight="bold" aria-hidden="true" />
              {copy.teacher.publishHw}
            </button>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="space-y-2.5">
              {content.hw.map((h) => (
                <div
                  key={h.id}
                  className="em-card flex items-center justify-between rounded-2xl p-4"
                >
                  <h3 className="text-sm font-extrabold">
                    {resolveLocalized(h.title, locale)}
                  </h3>
                  <span className="font-mono-num rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)]">
                    +{h.pts} XP
                  </span>
                </div>
              ))}
            </div>

            {mySubmissions.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                <h3 className="text-base font-extrabold">{copy.teacher.submittedWork}</h3>
                {mySubmissions.map((s) => (
                  <div
                    key={s.id}
                    className="em-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4"
                  >
                    <div>
                      <div className="text-sm font-extrabold">{s.who}</div>
                      <div className="text-xs text-[var(--muted)]">
                        {s.title}
                        {s.fn ? ` · ${s.fn}` : ''}
                      </div>
                      {s.text ? <p className="mt-1 text-xs">{s.text}</p> : null}
                    </div>
                    {s.st === 'ok' ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--accent-ink)]">
                        <Check size={14} weight="bold" aria-hidden="true" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onApproveHomework(s.id)}
                        className="min-h-[38px] cursor-pointer rounded-full bg-[var(--primary-btn)] px-4 py-1.5 text-xs font-bold text-[var(--primary-btn-ink)] transition hover:bg-[var(--primary-btn-hover)]"
                      >
                        {copy.teacher.acceptXp} +{s.pts}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
