import type { Metadata, Viewport } from 'next';
import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  style: ['normal', 'italic'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const cormorantSignature = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-signature',
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: 'EduMatch',
  title: 'EduMatch — Репетиторы по баллам, вузу и результатам | AZ / RU / EN',
  description:
    'Образовательная платформа в Азербайджане: выбирайте репетитора по университету, баллу поступления DİM, достижениям учеников и сильным сторонам. Бесплатный пробный урок.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EduMatch',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#C7E6FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${cormorantSignature.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
