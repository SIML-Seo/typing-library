export const SUPPORTED_LOCALES = [
  'ko',
  'en',
  'ja',
  'zh-CN',
  'zh-TW',
  'es',
  'fr',
  'de',
  'pt-BR',
  'id',
] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'ko';

export const LOCALE_LABELS: Record<AppLocale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  'pt-BR': 'Português (Brasil)',
  id: 'Bahasa Indonesia',
};

export function isSupportedLocale(locale: string): locale is AppLocale {
  return SUPPORTED_LOCALES.includes(locale as AppLocale);
}

export function stripLocalePrefix(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '/';
  }

  if (isSupportedLocale(segments[0])) {
    const nextPath = `/${segments.slice(1).join('/')}`;
    return nextPath === '/' ? '/' : nextPath.replace(/\/$/, '') || '/';
  }

  return pathname === '' ? '/' : pathname;
}

export function getLocalizedPath(locale: AppLocale, pathname: string = '/') {
  const normalizedPath = stripLocalePrefix(pathname);

  if (locale === DEFAULT_LOCALE) {
    return normalizedPath;
  }

  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}
