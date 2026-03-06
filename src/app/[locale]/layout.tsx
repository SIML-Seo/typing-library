import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import I18nClientProvider from '@/components/I18nClientProvider';
import { SUPPORTED_LOCALES, isSupportedLocale, type AppLocale } from '@/locales/config';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <I18nClientProvider locale={locale as AppLocale}>{children}</I18nClientProvider>;
}
