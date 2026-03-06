import type { Metadata } from 'next';
import I18nClientProvider from '@/components/I18nClientProvider';
import ResultsPage from '@/features/results/ResultsPage';
import { DEFAULT_LOCALE } from '@/locales/config';
import { getLocaleMessages } from '@/locales/get-messages';

const defaultMessages = getLocaleMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: `${defaultMessages.results.header.title} | ${defaultMessages.common.brandName}`,
  description: defaultMessages.results.header.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultsRoute() {
  return (
    <I18nClientProvider locale={DEFAULT_LOCALE}>
      <ResultsPage />
    </I18nClientProvider>
  );
}
