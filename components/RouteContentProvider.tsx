import { LanguageProvider } from '@/components/LanguageProvider';
import type { PartialSiteContent } from '@/lib/data/route-content';
import type { Locale, SiteCopy } from '@/lib/site-content';

export function RouteContentProvider({
  children,
  dynamicContent,
  locale,
}: {
  children: React.ReactNode;
  dynamicContent?: PartialSiteContent;
  locale: Locale;
  sectionKeys?: Array<keyof SiteCopy>;
}) {
  return (
    <LanguageProvider locale={locale} dynamicContent={dynamicContent}>
      {children}
    </LanguageProvider>
  );
}
