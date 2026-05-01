import { notFound } from 'next/navigation';

import { LanguageProvider } from '@/components/LanguageProvider';
import { RootContentWrapper } from '@/components/RootContentWrapper';
import { ScrollToTopOnRouteChange } from '@/components/ScrollToTopOnRouteChange';
import { SmoothScroll } from '@/components/SmoothScroll';
import { locales, isLocale } from '@/lib/i18n';
import { getRouteContent } from '@/lib/data/route-content';
import type { Locale } from '@/lib/site-content';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dynamicContent = await getRouteContent(['nav', 'footer']);

  return (
    <LanguageProvider locale={locale as Locale} dynamicContent={dynamicContent}>
      <SmoothScroll>
        <ScrollToTopOnRouteChange />
        <RootContentWrapper>{children}</RootContentWrapper>
      </SmoothScroll>
    </LanguageProvider>
  );
}
