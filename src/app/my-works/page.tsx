import type { Metadata } from 'next';
import I18nClientProvider from '@/components/I18nClientProvider';
import MyWorksPage from '@/features/my-works/MyWorksPage';
import { DEFAULT_LOCALE } from '@/locales/config';
import { getLocaleMessages } from '@/locales/get-messages';

const defaultMessages = getLocaleMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: `${defaultMessages.myWorks.header.title} | ${defaultMessages.common.brandName}`,
  description: defaultMessages.myWorks.header.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyWorksRoute() {
  return (
    <I18nClientProvider locale={DEFAULT_LOCALE}>
      <MyWorksPage />
    </I18nClientProvider>
  );
}
