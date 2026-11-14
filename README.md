<div align="center">

# 🎓 EduMatch — EdTech Marketplace & Learning Studio

**Verified University Mentors, Exam Preparation (DIM / SAT / IELTS / Olympiads), and Interactive Learning Ecosystem**

[![Website Live](https://img.shields.io/badge/🌐_Website-edumatch--az.vercel.app-D97706?style=for-the-badge)](https://edumatch-az.vercel.app/)
[![WebApp Live](https://img.shields.io/badge/📱_WebApp_(PWA)-edumatch--az--app.vercel.app-0F172A?style=for-the-badge)](https://edumatch-az-app.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-149ECA?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🚀 Live Deployments

This monorepo contains both production applications of the **EduMatch** platform deployed on Vercel:

| Project | Directory | Live URL | Overview |
| :--- | :--- | :--- | :--- |
| **🌐 EduMatch Website** | [`./edumatch-az`](./edumatch-az) | **[edumatch-az.vercel.app](https://edumatch-az.vercel.app/)** | Main web platform featuring mentor discovery, verified university admission portfolios, 1-on-1 comparison, interactive geo-map, and GTM analytics workspace. |
| **📱 EduMatch WebApp (PWA)** | [`./edumatch-az-app`](./edumatch-az-app) | **[edumatch-az-app.vercel.app](https://edumatch-az-app.vercel.app/)** | Installable Progressive Web App (PWA) with Liquid Glass navigation, live interactive classroom & whiteboard, lesson booking engine, and student/tutor account hub. |

---

## 📂 Repository Structure

```text
edumap/
├── edumatch-az/          # 🌐 EduMatch Website (https://edumatch-az.vercel.app/)
│   ├── src/
│   │   ├── app/          # Next.js App Router & global styles
│   │   ├── components/   # HeroOpening, SearchWorkspace, TutorCompareModal, GtmStrategyWorkspace, etc.
│   │   ├── data/         # Verified mentor catalog, subjects, quizzes, and trilingual (EN/AZ/RU) localization
│   │   └── lib/          # Tutor matching algorithm and client persistence layer
│   └── package.json
│
└── edumatch-az-app/      # 📱 EduMatch WebApp & PWA (https://edumatch-az-app.vercel.app/)
    ├── public/           # Service Worker (sw.js) and PWA icons (192x192, 512x512, maskable)
    ├── src/
    │   ├── app/          # Next.js App Router, Web App Manifest (manifest.ts) & theme styles
    │   ├── components/   # LiquidTabBar, ClassroomModal, BookingModal, AccountHubModal, NotificationDrawer
    │   ├── data/         # Mentor profiles, lessons, homework, and trilingual (EN/AZ/RU) copy
    │   └── lib/          # URL state sync, PWA installation manager, and matching engine
    └── package.json
```

---

## ✨ Key Capabilities

### 1. 🌐 EduMatch Website (`edumatch-az`)
- **Verified Mentor Portfolios:** Displays each mentor's university (ADA, BHOS, BSU, UNEC, AMU), verified entrance exam score (`692 / 700`), core teaching differentiator, and average student score gain.
- **1-on-1 Mentor Comparison (`TutorCompareModal`):** Side-by-side comparison of entrance scores, teaching methodology, hourly rates, and student outcomes.
- **Interactive Geo-Map & Diagnostic Quiz:** City/district proximity filtering and adaptive subject-level assessment that calculates exact mentor match percentages.
- **GTM Strategy Workspace:** Market sizing, unit-economics simulator, and growth roadmap dashboard.

### 2. 📱 EduMatch WebApp & PWA (`edumatch-az-app`)
- **Liquid Glass Navigation:** Responsive spring-animated navigation bar with `⌘K` quick command search.
- **Live Classroom (`ClassroomModal`):** Interactive digital whiteboard, live session timer, chapter notes, and homework submission workflow.
- **End-to-End Lesson Booking (`BookingModal`):** Slot selection, online/in-person format toggle, payment method selection, and calendar export.
- **Student & Tutor Studios (`AccountHubModal`, `TeacherStudioWorkspace`):** Role-based dashboards for lesson management, student requests, XP rank progression, and notifications.
- **Installable PWA:** Full `manifest.webmanifest` and Service Worker (`sw.js`) support for iOS, Android, and desktop installation.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19 + TypeScript 5.9
- **Styling:** Tailwind CSS v4 + CSS Custom Properties (Light & Dark Modes)
- **Internationalization:** Full trilingual support (`EN` / `AZ` / `RU`)
- **Testing:** Vitest + React Testing Library + JSDOM
- **Deployment:** Vercel

---

## ⚡ Quick Start

### Run the Website (`edumatch-az`)
```bash
cd edumatch-az
npm install
npm run dev
```

### Run the WebApp / PWA (`edumatch-az-app`)
```bash
cd edumatch-az-app
npm install
npm run dev
```

### Run Tests & Checks
```bash
npm test          # Run Vitest unit & integration test suites
npm run lint      # Run ESLint verification
npm run build     # Build for production
```
