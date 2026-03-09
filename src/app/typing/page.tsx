import type { Metadata } from 'next';
import I18nClientProvider from '@/components/I18nClientProvider';
import TypingRoutePage from '@/features/typing/TypingRoutePage';
import { DEFAULT_LOCALE } from '@/locales/config';
import { getLocaleMessages } from '@/locales/get-messages';

const defaultMessages = getLocaleMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: `${defaultMessages.typing.title} | ${defaultMessages.common.brandName}`,
  description: defaultMessages.typing.subtitle,
  robots: {
    index: false,
    follow: false,
  },
};

export default function TypingRoute() {
  return (
    <I18nClientProvider locale={DEFAULT_LOCALE}>
      <TypingRoutePage />
    </I18nClientProvider>
  );
}
