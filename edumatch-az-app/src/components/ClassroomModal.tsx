'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowCounterClockwise,
  CheckCircle,
  Desktop,
  Eraser,
  Microphone,
  MicrophoneSlash,
  NotePencil,
  PaperPlaneRight,
  Pause,
  PencilLine,
  Play,
  Timer,
  VideoCamera,
  VideoCameraSlash,
} from '@phosphor-icons/react';
import { COPY, SUBJECT_LABELS } from '@/data/i18n';
import {
  resolveChatMessageText,
  resolvePersonName,
  resolveTutorName,
} from '@/data/tutors';
import { PWA_COPY } from '@/lib/pwaCopy';
import type {
  Locale,
  Role,
  StudentRequest,
  TutorProfile,
  WhiteboardStroke,
} from '@/types/edumatch';
import { ModalShell } from './ui/ModalShell';

interface ClassroomModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  role: Role;
  request: StudentRequest | null;
  tutor: TutorProfile | null;
  onSaveNotes: (requestId: number, notes: string) => void;
  onSaveWhiteboard?: (requestId: number, strokes: WhiteboardStroke[]) => void;
  onToggleChecklist: (requestId: number, itemId: string) => void;
  onAddChecklistItem: (requestId: number, text: string) => void;
  onSendMessage: (requestId: number, text: string) => void;
  onFinishLesson: (requestId: number) => void;
  onOpenHomework?: () => void;
}

const PEN_COLORS = ['#0F172A', '#10B981', '#4F46E5'];

function formatTimer(secondsLeft: number): string {
  const safe = Math.max(0, secondsLeft);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function ClassroomModal({
  open,
  onClose,
  locale,
  role,
  request,
  tutor,
  onSaveNotes,
  onSaveWhiteboard,
  onToggleChecklist,
  onAddChecklistItem,
  onSendMessage,
  onFinishLesson,
  onOpenHomework,
}: ClassroomModalProps) {
  if (!open || !request) return null;

  return (
    <ClassroomSessionContent
      key={request.id}
      open={open}
      onClose={onClose}
      locale={locale}
      role={role}
      request={request}
      tutor={tutor}
      onSaveNotes={onSaveNotes}
      onSaveWhiteboard={onSaveWhiteboard}
      onToggleChecklist={onToggleChecklist}
      onAddChecklistItem={onAddChecklistItem}
      onSendMessage={onSendMessage}
      onFinishLesson={onFinishLesson}
      onOpenHomework={onOpenHomework}
    />
  );
}

interface ClassroomSessionContentProps extends Omit<ClassroomModalProps, 'request'> {
  request: StudentRequest;
}

function ClassroomSessionContent({
  open,
  onClose,
  locale,
  role,
  request,
  tutor,
  onSaveNotes,
  onSaveWhiteboard,
  onToggleChecklist,
  onAddChecklistItem,
  onSendMessage,
  onFinishLesson,
  onOpenHomework,
}: ClassroomSessionContentProps) {
  const c = PWA_COPY[locale].classroom;
  const chatCopy = COPY[locale].chat;
  const closeLabel = locale === 'az' ? 'Bağla' : locale === 'en' ? 'Close' : 'Закрыть';

  const initialSeconds = (request.schedule?.durationMin ?? (request.trial ? 30 : 45)) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<'board' | 'notes'>('board');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [penColor, setPenColor] = useState(PEN_COLORS[0]);
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>(
    () => request.whiteboardStrokes ?? [],
  );
  const [newTaskText, setNewTaskText] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [notesDraft, setNotesDraft] = useState(request.classroomNotes ?? '');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingStrokeRef = useRef<WhiteboardStroke | null>(null);

  useEffect(() => {
    if (!open || !timerRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, timerRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle geometric grid
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 24; x < canvas.width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 24; y < canvas.height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, activeStage, open]);

  const partnerName =
    role === 'student'
      ? tutor
        ? resolveTutorName(tutor, locale)
        : 'Tutor'
      : resolvePersonName(request.st.name, locale);

  const handleCanvasDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Synthetic pointer events in jsdom may not support pointer capture
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const pt = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
    const nextStroke: WhiteboardStroke = { color: penColor, points: [pt] };
    drawingStrokeRef.current = nextStroke;
    setStrokes((prev) => [...prev, nextStroke]);
  };

  const handleCanvasMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingStrokeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const pt = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
    const active = drawingStrokeRef.current;
    active.points = [...active.points, pt];
    setStrokes((prev) => [...prev.slice(0, -1), { ...active }]);
  };

  const handleCanvasUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingStrokeRef.current) return;
    drawingStrokeRef.current = null;
    try {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      }
    } catch {
      // Ignore synthetic pointer event cleanup
    }
    onSaveWhiteboard?.(request.id, strokes);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddChecklistItem(request.id, newTaskText.trim());
    setNewTaskText('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(request.id, chatInput.trim());
    setChatInput('');
  };

  const checklist = request.checklist ?? [];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`${c.title} · ${partnerName}`}
      subtitle={`${SUBJECT_LABELS[request.st.subj][locale]}${request.schedule ? ` · ${request.schedule.dateLabel} ${request.schedule.time}` : ''}`}
      maxWidthClass="max-w-4xl"
      closeLabel={closeLabel}
    >
      <div className="space-y-4">
        {/* Classroom Control Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3.5 py-1.5 font-mono text-xs font-bold text-[#C8F542]">
              <Timer size={14} weight="bold" aria-hidden="true" />
              {formatTimer(secondsLeft)}
            </span>
            <button
              type="button"
              onClick={() => setTimerRunning((prev) => !prev)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--border-strong)]"
            >
              {timerRunning ? (
                <>
                  <Pause size={13} weight="bold" aria-hidden="true" />
                  {c.pauseTimer}
                </>
              ) : (
                <>
                  <Play size={13} weight="bold" aria-hidden="true" />
                  {c.startTimer}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setSecondsLeft(initialSeconds);
              }}
              aria-label={c.resetTimer}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <ArrowCounterClockwise size={13} weight="bold" aria-hidden="true" />
              {c.resetTimer}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMicOn((prev) => !prev)}
              aria-label={micOn ? c.micOn : c.micOff}
              aria-pressed={micOn}
              className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full border transition ${
                micOn
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-600'
              }`}
            >
              {micOn ? (
                <Microphone size={15} weight="bold" aria-hidden="true" />
              ) : (
                <MicrophoneSlash size={15} weight="bold" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setCamOn((prev) => !prev)}
              aria-label={camOn ? c.camOn : c.camOff}
              aria-pressed={camOn}
              className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full border transition ${
                camOn
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-600'
              }`}
            >
              {camOn ? (
                <VideoCamera size={15} weight="bold" aria-hidden="true" />
              ) : (
                <VideoCameraSlash size={15} weight="bold" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setScreenOn((prev) => !prev)}
              aria-label={screenOn ? c.screenOn : c.screenOff}
              aria-pressed={screenOn}
              className={`inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition ${
                screenOn
                  ? 'border-transparent bg-[#C8F542] text-[#0F172A]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
              }`}
            >
              <Desktop size={14} weight="bold" aria-hidden="true" />
              <span className="hidden sm:inline">{screenOn ? c.screenOn : c.screenOff}</span>
            </button>

            {onOpenHomework ? (
              <button
                type="button"
                onClick={onOpenHomework}
                className="inline-flex h-8 cursor-pointer items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--ink)]"
              >
                {c.hwBtn}
              </button>
            ) : null}

            {request.status !== 'done' && (
              <button
                type="button"
                onClick={() => onFinishLesson(request.id)}
                className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-full bg-[#C8F542] px-3.5 text-xs font-bold text-[#0F172A] transition hover:brightness-95"
              >
                <CheckCircle size={14} weight="bold" aria-hidden="true" />
                {c.finishBtn}
              </button>
            )}
          </div>
        </div>

        {/* Main Classroom Grid */}
        <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
          {/* Stage: Interactive Whiteboard or Notes */}
          <div className="space-y-2.5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveStage('board')}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeStage === 'board'
                      ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  <PencilLine size={13} weight="bold" aria-hidden="true" />
                  {c.boardTab}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage('notes')}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeStage === 'notes'
                      ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  <NotePencil size={13} weight="bold" aria-hidden="true" />
                  {c.notesTab}
                </button>
              </div>

              {activeStage === 'board' ? (
                <div className="flex items-center gap-1.5">
                  {PEN_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPenColor(color)}
                      aria-label={`${c.penLabelPrefix} ${color}`}
                      style={{ backgroundColor: color }}
                      className={`h-5 w-5 cursor-pointer rounded-full border-2 transition ${
                        penColor === color ? 'scale-110 border-[#C8F542]' : 'border-transparent'
                      }`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const next = strokes.slice(0, -1);
                      setStrokes(next);
                      onSaveWhiteboard?.(request.id, next);
                    }}
                    className="cursor-pointer rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    {c.undoBoard}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStrokes([]);
                      onSaveWhiteboard?.(request.id, []);
                    }}
                    aria-label={c.clearBoard}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    <Eraser size={12} weight="bold" aria-hidden="true" />
                    {c.clearBoard}
                  </button>
                </div>
              ) : (
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  {c.savedAuto}
                </span>
              )}
            </div>

            {activeStage === 'board' ? (
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={c.boardAriaLabel}
                width={640}
                height={340}
                onPointerDown={handleCanvasDown}
                onPointerMove={handleCanvasMove}
                onPointerUp={handleCanvasUp}
                onPointerCancel={handleCanvasUp}
                className="h-[240px] w-full touch-none rounded-2xl border border-[var(--border)] bg-white sm:h-[290px]"
              />
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {c.templateChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const next = notesDraft ? `${notesDraft}\n• ${chip}: ` : `• ${chip}: `;
                        setNotesDraft(next);
                        onSaveNotes(request.id, next);
                      }}
                      className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] hover:border-[var(--border-strong)]"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={8}
                  value={notesDraft}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNotesDraft(val);
                    onSaveNotes(request.id, val);
                  }}
                  placeholder={c.notesPlaceholder}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--border-strong)]"
                />
              </div>
            )}
          </div>

          {/* Right Panel: Checklist & Live Micro Chat */}
          <div className="flex flex-col gap-3">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {c.checklistTitle}
              </p>
              <div className="mt-2 max-h-32 space-y-1.5 overflow-y-auto">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]/70 px-2.5 py-1.5 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => onToggleChecklist(request.id, item.id)}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span
                      className={`min-w-0 break-words ${
                        item.done ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)]'
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
              <form onSubmit={handleAddChecklist} className="mt-2 flex gap-1.5">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder={c.addTaskPlaceholder}
                  className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-xs text-[var(--ink)] outline-none"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[var(--primary-btn)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-btn-ink)]"
                >
                  {c.addTaskBtn}
                </button>
              </form>
            </div>

            <div className="flex flex-1 flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {c.chatTitle}
              </p>
              <div className="mt-2 max-h-36 flex-1 space-y-1.5 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)]/50 p-2.5">
                {request.msgs.map((msg) => {
                  const isMe = (role === 'student' ? 's' : 't') === msg.from;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-xs ${
                          isMe
                            ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                            : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]'
                        }`}
                      >
                        {msg.text ? resolveChatMessageText(msg.text, locale) : '✨'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSendChat} className="mt-2 flex gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={chatCopy.placeholder}
                  className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-xs text-[var(--ink)] outline-none"
                />
                <button
                  type="submit"
                  aria-label={c.sendMessageLabel}
                  className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full bg-[#C8F542] text-[#0F172A]"
                >
                  <PaperPlaneRight size={14} weight="bold" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
