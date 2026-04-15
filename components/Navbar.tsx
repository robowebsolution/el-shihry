'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';

import { useLanguage } from '@/components/LanguageProvider';
import { LocaleReveal } from '@/components/LocaleReveal';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { scrollY } = useScroll();
  const { copy, locale, toggleLocale } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={cn('fixed top-0 z-50 w-full transition-all duration-500', isScrolled ? 'py-4' : 'py-8')}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div
          className={cn(
            'flex items-center justify-between gap-4 rounded-full transition-all duration-500',
            isScrolled ? 'glass-panel px-5 py-3 md:px-8 md:py-4' : 'px-2 py-2 md:px-4'
          )}
        >
          <Link href="/" className="text-xl font-bold tracking-[0.25em] text-white uppercase">
            {copy.nav.brand}
          </Link>

          <div className="hidden md:block">
            <LocaleReveal localeKey={`nav-${locale}`} className="flex items-center gap-8">
              {copy.nav.links.map((item) => (
                <Link
                  key={item.hash}
                  href={item.href}
                  className="text-sm font-medium tracking-[0.22em] text-white/80 uppercase transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </LocaleReveal>
          </div>

          <button
            type="button"
            onClick={toggleLocale}
            dir="ltr"
            aria-label="Toggle language"
            className="relative inline-flex h-11 w-[112px] items-center rounded-full border border-gold/20 bg-white/5 p-1 backdrop-blur-xl"
          >
            <motion.span
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gold shadow-[0_12px_30px_rgba(241,213,130,0.25)]"
              initial={false}
              animate={{ x: locale === 'ar' ? 0 : 50 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            />

            <span
              className={cn(
                'relative z-10 flex-1 text-center text-xs font-bold tracking-[0.2em] uppercase transition-colors',
                locale === 'ar' ? 'text-rich-black' : 'text-white/55'
              )}
            >
              AR
            </span>
            <span
              className={cn(
                'relative z-10 flex-1 text-center text-xs font-bold tracking-[0.2em] uppercase transition-colors',
                locale === 'en' ? 'text-rich-black' : 'text-white/55'
              )}
            >
              EN
            </span>
          </button>
        </div>

        <div className="mt-4 md:hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`mobile-nav-${locale}`}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="glass-panel flex flex-wrap items-center justify-center gap-4 rounded-[2rem] px-5 py-4"
            >
              {copy.nav.links.map((item) => (
                <Link
                  key={item.hash}
                  href={item.href}
                  className="text-xs font-semibold tracking-[0.18em] text-white/75 uppercase transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
