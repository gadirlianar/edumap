'use client';

import React from 'react';
import {
  BookOpenText,
  ChatCircleDots,
  Crown,
  FilmSlate,
  IdentificationCard,
  MagnifyingGlass,
  RocketLaunch,
  Sparkle,
  UsersThree,
} from '@phosphor-icons/react';
import type { CopyBundle } from '@/data/i18n';
import type { Role, StudentTab, TeacherTab } from '@/types/edumatch';

interface MobileNavProps {
  role: Role;
  studentTab: StudentTab;
  onStudentTabChange: (tab: StudentTab) => void;
  teacherTab: TeacherTab;
  onTeacherTabChange: (tab: TeacherTab) => void;
  copy: CopyBundle;
}

export function MobileNav({
  role,
  studentTab,
  onStudentTabChange,
  teacherTab,
  onTeacherTabChange,
  copy,
}: MobileNavProps) {
  const items =
    role === 'student'
      ? [
          { id: 'search', label: copy.nav.search, icon: MagnifyingGlass },
          { id: 'test', label: copy.nav.test, icon: Sparkle },
          { id: 'lessons', label: copy.nav.lessons, icon: BookOpenText },
          { id: 'strategy', label: copy.nav.strategy, icon: RocketLaunch },
        ]
      : [
          { id: 'inbox', label: copy.nav.inbox, icon: ChatCircleDots },
          { id: 'students', label: copy.nav.students, icon: UsersThree },
          { id: 'profile', label: copy.nav.profile, icon: IdentificationCard },
          { id: 'studio', label: copy.nav.studio, icon: FilmSlate },
          { id: 'premium', label: copy.nav.premium, icon: Crown },
        ];

  const activeId = role === 'student' ? studentTab : teacherTab;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-sm items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/95 p-1 shadow-[var(--shadow-float)] backdrop-blur-lg sm:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (role === 'student') onStudentTabChange(item.id as StudentTab);
              else onTeacherTabChange(item.id as TeacherTab);
            }}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-[40px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1 text-[10px] font-semibold transition ${
              active
                ? 'bg-[var(--primary-btn)] text-[var(--primary-btn-ink)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Icon size={16} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
            <span className="max-w-full truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
