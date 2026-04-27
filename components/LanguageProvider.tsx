'use client';

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useDeferredValue,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { subscribeToContentUpdates } from '@/lib/content-sync';
import { getAlternateLocale, localizeHref, switchLocalePathname } from '@/lib/i18n';
import type { Locale } from '@/lib/site-content';
import type { SiteCopy } from '@/lib/site-content';
import { siteContent } from '@/lib/site-content';

const LOCALE_STORAGE_KEY = 'el-shihry-locale';
const LOCALE_COOKIE_KEY = 'locale';
const LOCALE_CHANGE_EVENT = 'el-shihry-locale-change';

type DynamicLanguageContent = Partial<Record<Locale, Partial<SiteCopy>>>;

type LanguageContextValue = {
  copy: (typeof siteContent)[Locale];
  content: typeof siteContent;
  isContentHydrated: boolean;
  localizeHref: (href: string | { hash?: string; pathname: string }) => string;
  locale: Locale;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

let liveContentPromise: Promise<DynamicLanguageContent | null> | null = null;

async function fetchLiveContent() {
  if (!liveContentPromise) {
    liveContentPromise = fetch('/api/content', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to refresh live content');
        }

        return response.json() as Promise<DynamicLanguageContent>;
      })
      .catch(() => null)
      .finally(() => {
        liveContentPromise = null;
      });
  }

  return liveContentPromise;
}

export function LanguageProvider({
  children,
  dynamicContent,
  locale,
}: {
  children: ReactNode;
  dynamicContent?: DynamicLanguageContent;
  locale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dynamicOverrides, setDynamicOverrides] = useState<DynamicLanguageContent | undefined>(dynamicContent);
  const deferredOverrides = useDeferredValue(dynamicOverrides);
  const content = useMemo<typeof siteContent>(
    () => ({
      ar: { ...siteContent.ar, ...(deferredOverrides?.ar ?? {}) },
      en: { ...siteContent.en, ...(deferredOverrides?.en ?? {}) },
    }),
    [deferredOverrides]
  );
  const isContentHydrated = true;

  useEffect(() => {
    setDynamicOverrides(dynamicContent);
  }, [dynamicContent]);

  useEffect(() => {
    let isMounted = true;

    const refreshContent = async () => {
      const nextContent = await fetchLiveContent();

      if (!isMounted || !nextContent) {
        return;
      }

      startTransition(() => {
        setDynamicOverrides(nextContent);
      });
    };

    const unsubscribe = subscribeToContentUpdates(() => {
      void refreshContent();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('font-arabic', locale === 'ar');
    document.body.classList.toggle('font-sans', locale === 'en');
    document.body.dataset.locale = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new CustomEvent<Locale>(LOCALE_CHANGE_EVENT, { detail: locale }));

    // Visual bridge: trigger a small fade out/in to mask the layout shift
    document.body.classList.add('lang-switching');
    
    // Give the browser a moment to apply layout changes, then refresh GSAP and fade back in
    const timer = setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
      document.body.classList.remove('lang-switching');
    }, 400);

    return () => clearTimeout(timer);
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      copy: content[locale],
      content,
      isContentHydrated,
      localizeHref: (href) => localizeHref(locale, href),
      locale,
      toggleLocale: () => {
        const nextLocale = getAlternateLocale(locale);
        const nextPathname = switchLocalePathname(pathname ?? '/', nextLocale);
        const queryString = searchParams?.toString() ?? '';
        const hash = typeof window !== 'undefined' ? window.location.hash : '';

        startTransition(() => {
          router.push(`${nextPathname}${queryString ? `?${queryString}` : ''}${hash}` as any);
        });
      },
    }),
    [content, isContentHydrated, locale, pathname, router, searchParams]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }

  return context;
}
