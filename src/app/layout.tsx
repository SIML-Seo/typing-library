import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { I18nProviderClient } from '@/locales/client'; // 이 import는 제거합니다.
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AuthButtons from "@/components/AuthButtons";
import I18nClientProvider from "@/components/I18nClientProvider"; // 새로 만든 프로바이더를 가져옵니다.
import AmplifyCredentialsManager from "@/components/AmplifyCredentialsManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typing Library",
  description: "Typing Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 현재 로케일 결정 (여기서는 'ko' 하드코딩)
  const currentLocale = 'ko';

  return (
    <html lang={currentLocale}>
      <I18nClientProvider locale={currentLocale}>
        <AuthProvider>
          <AmplifyCredentialsManager />
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
          >
            <header className="bg-gray-100 p-4 shadow-md">
              <nav className="container mx-auto flex items-center justify-between">
                <h1 className="text-xl font-bold">Typing Library</h1>
                <AuthButtons />
              </nav>
            </header>
            <main className="flex-grow p-4">
              {children}
            </main>
          </body>
        </AuthProvider>
      </I18nClientProvider>
    </html>
  );
}
