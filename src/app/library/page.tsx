import type { Metadata } from 'next';
import I18nClientProvider from '@/components/I18nClientProvider';
import LibraryPage from '@/features/library/LibraryPage';
import { DEFAULT_LOCALE } from '@/locales/config';
import { getLocaleMessages } from '@/locales/get-messages';

const defaultMessages = getLocaleMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: `${defaultMessages.library.header.title} | ${defaultMessages.common.brandName}`,
  description: defaultMessages.library.catalog.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function LibraryRoute() {
  return (
    <I18nClientProvider locale={DEFAULT_LOCALE}>
      <LibraryPage />
    </I18nClientProvider>
  );
}
