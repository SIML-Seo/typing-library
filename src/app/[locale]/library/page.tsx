import type { Metadata } from 'next';
import LibraryPage from '@/features/library/LibraryPage';
import { getLocaleMessages } from '@/locales/get-messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getLocaleMessages(locale);

  return {
    title: `${messages.library.header.title} | ${messages.common.brandName}`,
    description: messages.library.catalog.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LocalizedLibraryPage() {
  return <LibraryPage />;
}
