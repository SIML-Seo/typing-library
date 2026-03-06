import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Gowun_Batang } from 'next/font/google';
import Ga4Scripts from '@/shared/analytics/Ga4Scripts';
import './globals.css';

const bodyFont = Geist({
  variable: '--font-body',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const displayFont = Gowun_Batang({
  variable: '--font-display',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Typing Library | 저작권 만료 문학을 그대로 타이핑하는 필사',
  description:
    '저작권이 만료된 문학 작품을 고스트 텍스트 위에서 그대로 타이핑하는 필사형 웹앱. 비로그인, 로컬 저장, 무료 운영을 전제로 설계합니다.',
  keywords: [
    '필사',
    '타이핑',
    '타자 연습',
    '문학 필사',
    '저작권 만료 문학',
    'typing library',
  ],
  openGraph: {
    title: 'Typing Library',
    description: '저작권이 만료된 문학 작품을 그대로 타이핑하는 필사형 웹앱',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${bodyFont.variable} ${geistMono.variable} ${displayFont.variable} min-h-screen antialiased`}
      >
        <Ga4Scripts />
        {children}
      </body>
    </html>
  );
}
