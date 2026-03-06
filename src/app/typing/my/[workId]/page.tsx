import type { Metadata } from 'next';
import I18nClientProvider from '@/components/I18nClientProvider';
import TypingPage from '@/features/typing/TypingPage';
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

export default async function DefaultMyTypingRoute({
  params,
}: {
  params: Promise<{ workId: string }>;
}) {
  const { workId } = await params;

  return (
    <I18nClientProvider locale={DEFAULT_LOCALE}>
      <TypingPage workId={workId} workKind="my" />
    </I18nClientProvider>
  );
}
