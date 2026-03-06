'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentLocale, useI18n } from '@/locales/client';
import {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  getLocalizedPath,
  stripLocalePrefix,
} from '@/locales/config';

export default function LocaleSwitcher() {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const pathname = usePathname();
  const basePath = stripLocalePrefix(pathname);
  const currentValue = LOCALE_LABELS[currentLocale] ?? LOCALE_LABELS[DEFAULT_LOCALE];

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-4 py-2 text-sm text-[color:var(--foreground)] marker:hidden">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
          {t('common.language')}
        </span>
        <span>{currentValue}</span>
      </summary>

      <div className="absolute right-0 z-40 mt-3 min-w-52 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.96)] p-2 shadow-[0_20px_60px_rgba(41,25,18,0.14)]">
        {SUPPORTED_LOCALES.map((locale) => {
          const href = getLocalizedPath(locale, basePath);
          const isActive = locale === currentLocale;

          return (
            <Link
              key={locale}
              href={href}
              className={`flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-[rgba(161,68,49,0.10)] text-[color:var(--accent)]'
                  : 'text-[color:var(--foreground)] hover:bg-[rgba(29,22,17,0.04)]'
              }`}
            >
              <span>{LOCALE_LABELS[locale]}</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {locale}
              </span>
            </Link>
          );
        })}
      </div>
    </details>
  );
}
