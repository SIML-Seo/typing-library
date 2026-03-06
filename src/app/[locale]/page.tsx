import type { Metadata } from 'next';
import LandingPage from '@/features/landing/LandingPage';
import { getLocaleMessages } from '@/locales/get-messages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getLocaleMessages(locale);

  return {
    title: `${messages.common.brandName} | ${messages.landing.hero.title}`,
    description: messages.landing.hero.description,
  };
}

export default function LocalizedHomePage() {
  return <LandingPage />;
}
