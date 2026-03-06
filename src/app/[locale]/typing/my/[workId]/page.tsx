import type { Metadata } from 'next';
import TypingPage from '@/features/typing/TypingPage';
import { getLocaleMessages } from '@/locales/get-messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; workId: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getLocaleMessages(locale);

  return {
    title: `${messages.typing.title} | ${messages.common.brandName}`,
    description: messages.typing.subtitle,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function LocalizedMyTypingRoute({
  params,
}: {
  params: Promise<{ locale: string; workId: string }>;
}) {
  const { workId } = await params;

  return <TypingPage workId={workId} workKind="my" />;
}
