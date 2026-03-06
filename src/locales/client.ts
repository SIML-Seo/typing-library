import { createI18nClient } from 'next-international/client';

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } =
  createI18nClient({
    ko: () => import('./ko'),
    en: () => import('./en'),
    ja: () => import('./ja'),
    'zh-CN': () => import('./zh-CN'),
    'zh-TW': () => import('./zh-TW'),
    es: () => import('./es'),
    fr: () => import('./fr'),
    de: () => import('./de'),
    'pt-BR': () => import('./pt-BR'),
    id: () => import('./id'),
  });
