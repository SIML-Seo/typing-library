'use client';

import Link from 'next/link';
import { useAppLocale } from '@/components/I18nClientProvider';
import { useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import LocaleSwitcher from './LocaleSwitcher';

export default function PageNav({
  current,
}: {
  current?: 'landing' | 'library' | 'my-works' | 'results' | 'typing';
}) {
  const t = useI18n();
  const locale = useAppLocale();

  const links = [
    { key: 'library' as const, label: t('landing.nav.library'), path: '/library' },
    { key: 'my-works' as const, label: t('myWorks.navLabel'), path: '/my-works' },
    { key: 'results' as const, label: t('results.navLabel'), path: '/results' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:rgba(250,249,247,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link
          href={getLocalizedPath(locale, '/')}
          className="flex items-center gap-2 text-[color:var(--foreground)]"
        >
          <span className="text-base font-semibold tracking-tight">
            {t('common.brandName')}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              href={getLocalizedPath(locale, link.path)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                current === link.key
                  ? 'bg-[color:var(--surface-sunken)] text-[color:var(--foreground)] font-medium'
                  : 'text-[color:var(--muted)] hover:text-[color:var(--foreground)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <LocaleSwitcher />
      </div>
    </header>
  );
}
