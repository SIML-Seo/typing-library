import type { Metadata } from 'next';
import MyWorksPage from '@/features/my-works/MyWorksPage';
import { getLocaleMessages } from '@/locales/get-messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getLocaleMessages(locale);

  return {
    title: `${messages.myWorks.header.title} | ${messages.common.brandName}`,
    description: messages.myWorks.header.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LocalizedMyWorksRoute() {
  return <MyWorksPage />;
}
