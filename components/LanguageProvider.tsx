'use client';

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Locale } from '@/lib/site-content';
import { siteContent } from '@/lib/site-content';

const LOCALE_STORAGE_KEY = 'el-shihry-locale';
const LOCALE_COOKIE_KEY = 'locale';

type LanguageContextValue = {
  copy: (typeof siteContent)[Locale];
  locale: Locale;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === 'ar' || value === 'en';
}

export function LanguageProvider({
  children,
  defaultLocale = 'en',
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const syncLocale = (nextLocale: string | null) => {
      if (!isLocale(nextLocale)) {
        return;
      }

      setLocale((currentLocale) => (currentLocale === nextLocale ? currentLocale : nextLocale));
    };

    syncLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY) {
        syncLocale(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
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
      copy: siteContent[locale],
      locale,
      toggleLocale: () => {
        startTransition(() => {
          setLocale((currentLocale) => (currentLocale === 'ar' ? 'en' : 'ar'));
        });
      },
    }),
    [locale]
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
