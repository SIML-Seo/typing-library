import type { Metadata } from 'next';
import ResultsPage from '@/features/results/ResultsPage';
import { getLocaleMessages } from '@/locales/get-messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getLocaleMessages(locale);

  return {
    title: `${messages.results.header.title} | ${messages.common.brandName}`,
    description: messages.results.header.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LocalizedResultsRoute() {
  return <ResultsPage />;
}
