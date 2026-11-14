'use client';

import React from 'react';
import {
  BookOpenText,
  ChatCircleDots,
  Crown,
  FilmSlate,
  IdentificationCard,
  MagnifyingGlass,
  Sparkle,
  UsersThree,
} from '@phosphor-icons/react';
import { LiquidTabBar } from '@/components/ui/LiquidTabBar';
import type { CopyBundle } from '@/data/i18n';
import type { Role, StudentTab, TeacherTab } from '@/types/edumatch';

interface MobileNavProps {
  role: Role;
  studentTab: StudentTab;
  onStudentTabChange: (tab: StudentTab) => void;
  teacherTab: TeacherTab;
  onTeacherTabChange: (tab: TeacherTab) => void;
  copy: CopyBundle;
  unreadLessons?: number;
  unreadInbox?: number;
}

/** Floating bottom iPhone Liquid Glass dock with continuous scrub-to-switch navigation. */
export function MobileNav({
  role,
  studentTab,
  onStudentTabChange,
  teacherTab,
  onTeacherTabChange,
  copy,
  unreadLessons = 0,
  unreadInbox = 0,
}: MobileNavProps) {
  const activeId = role === 'student' ? studentTab : teacherTab;

  const items =
    role === 'student'
      ? [
          {
            id: 'search',
            label: copy.nav.search,
            icon: (
              <MagnifyingGlass
                size={16}
                weight={activeId === 'search' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: 0,
          },
          {
            id: 'test',
            label: copy.nav.test,
            icon: (
              <Sparkle
                size={16}
                weight={activeId === 'test' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: 0,
          },
          {
            id: 'lessons',
            label: copy.nav.lessons,
            icon: (
              <BookOpenText
                size={16}
                weight={activeId === 'lessons' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: unreadLessons,
          },
        ]
      : [
          {
            id: 'inbox',
            label: copy.nav.inbox,
            icon: (
              <ChatCircleDots
                size={16}
                weight={activeId === 'inbox' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: unreadInbox,
          },
          {
            id: 'students',
            label: copy.nav.students,
            icon: (
              <UsersThree
                size={16}
                weight={activeId === 'students' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: 0,
          },
          {
            id: 'profile',
            label: copy.nav.profile,
            icon: (
              <IdentificationCard
                size={16}
                weight={activeId === 'profile' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: 0,
          },
          {
            id: 'studio',
            label: copy.nav.studio,
            icon: (
              <FilmSlate
                size={16}
                weight={activeId === 'studio' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: 0,
          },
          {
            id: 'premium',
            label: copy.nav.premium,
            icon: (
              <Crown
                size={16}
                weight={activeId === 'premium' ? 'fill' : 'regular'}
                aria-hidden="true"
              />
            ),
            badge: 0,
          },
        ];

  return (
    <LiquidTabBar
      items={items}
      activeId={activeId}
      onChange={(id) => {
        if (role === 'student') onStudentTabChange(id as StudentTab);
        else onTeacherTabChange(id as TeacherTab);
      }}
      ariaLabel="Mobile navigation"
      layoutId={`mobile-nav-liquid-lens-${role}`}
      variant="dock"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-30 mx-auto flex max-w-sm sm:hidden"
    />
  );
}
