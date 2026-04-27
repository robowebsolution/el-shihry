import { LanguageProvider } from '@/components/LanguageProvider';
import { getRouteContent } from '@/lib/data/route-content';
import type { Locale, SiteCopy } from '@/lib/site-content';

export async function RouteContentProvider({
  children,
  locale,
  sectionKeys,
}: {
  children: React.ReactNode;
  locale: Locale;
  sectionKeys: Array<keyof SiteCopy>;
}) {
  const dynamicContent = await getRouteContent(sectionKeys);

  return (
    <LanguageProvider locale={locale} dynamicContent={dynamicContent}>
      {children}
    </LanguageProvider>
  );
}
