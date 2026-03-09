import type { Metadata } from 'next';
import TypingRoutePage from '@/features/typing/TypingRoutePage';
import { getLocaleMessages } from '@/locales/get-messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
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

export default function LocalizedTypingRoute() {
  return <TypingRoutePage />;
}
