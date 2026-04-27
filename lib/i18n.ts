import type { Locale } from '@/lib/site-content';

export const locales: Locale[] = ['ar', 'en'];
export const defaultLocale: Locale = 'ar';

export function isLocale(value: string): value is Locale {
  return value === 'ar' || value === 'en';
}

export function getLocaleDirection(locale: Locale) {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar';
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];

  return segment && isLocale(segment) ? segment : defaultLocale;
}

export function stripLocaleFromPathname(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalizedPath.split('/').filter(Boolean);

  if (segments[0] && isLocale(segments[0])) {
    const nextPath = `/${segments.slice(1).join('/')}`;
    return nextPath === '/' ? '/' : nextPath.replace(/\/+$/, '') || '/';
  }

  return normalizedPath === '/' ? '/' : normalizedPath.replace(/\/+$/, '');
}

export function withLocale(locale: Locale, pathname: string) {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const strippedPath = stripLocaleFromPathname(pathname);

  if (strippedPath === '/') {
    return `/${locale}`;
  }

  return `/${locale}${strippedPath}`;
}

export function localizeHref(
  locale: Locale,
  href: string | { hash?: string; pathname: string }
) {
  if (typeof href === 'string') {
    return withLocale(locale, href);
  }

  const localizedPath = withLocale(locale, href.pathname);
  return href.hash ? `${localizedPath}#${href.hash}` : localizedPath;
}

export function switchLocalePathname(pathname: string, locale: Locale) {
  return withLocale(locale, stripLocaleFromPathname(pathname));
}
