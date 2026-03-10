'use client';

import Link from 'next/link';
import { useAppLocale } from '@/components/I18nClientProvider';
import { usePathname } from 'next/navigation';
import {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  getLocalizedPath,
  stripLocalePrefix,
} from '@/locales/config';

export default function LocaleSwitcher() {
  const currentLocale = useAppLocale();
  const pathname = usePathname();
  const basePath = stripLocalePrefix(pathname);
  const currentValue = LOCALE_LABELS[currentLocale] ?? LOCALE_LABELS[DEFAULT_LOCALE];

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-[color:var(--line)] px-3 py-1.5 text-sm text-[color:var(--muted)] transition hover:border-[color:var(--foreground)] hover:text-[color:var(--foreground)] marker:hidden">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{currentValue}</span>
      </summary>

      <div className="absolute right-0 z-40 mt-2 min-w-48 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-1.5 shadow-lg shadow-black/[0.06]">
        {SUPPORTED_LOCALES.map((locale) => {
          const href = getLocalizedPath(locale, basePath);
          const isActive = locale === currentLocale;

          return (
            <Link
              key={locale}
              href={href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent)]'
                  : 'text-[color:var(--foreground)] hover:bg-[color:var(--surface-sunken)]'
              }`}
            >
              <span>{LOCALE_LABELS[locale]}</span>
              <span className="text-xs text-[color:var(--muted)]">
                {locale}
              </span>
            </Link>
          );
        })}
      </div>
    </details>
  );
}
