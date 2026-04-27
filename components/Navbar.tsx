'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import Image from 'next/image';

import { useLanguage } from '@/components/LanguageProvider';
import { LocaleReveal } from '@/components/LocaleReveal';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { scrollY } = useScroll();
  const { copy, locale, localizeHref, toggleLocale } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsOpen(false);
    } else {
      setHidden(false);
    }

    setIsScrolled(latest > 50);
  });

  // Close menu on scroll if open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 z-[60] w-full transition-all duration-500',
          isScrolled ? 'py-4' : 'py-8'
        )}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div
            className={cn(
              'flex items-center justify-between gap-4 rounded-full transition-all duration-500',
              isScrolled || isOpen ? 'glass-panel px-5 py-3 md:px-8 md:py-4' : 'px-2 py-2 md:px-4'
            )}
          >
            <Link href={localizeHref('/') as any} className="flex items-center" aria-label="El Shihry Home">
              <Image
                src="/logo.webp"
                alt="El Shihry Logo"
                width={150}
                height={60}
                sizes="150px"
                loading="eager"
                className="h-12 w-auto object-contain md:h-18"
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:block">
              <LocaleReveal localeKey={`nav-${locale}`} className="flex items-center gap-8">
                {copy.nav.links.map((item) => (
                  <Link
                    key={item.hash}
                    href={localizeHref(item.href) as any}
                    className="text-sm font-medium tracking-[0.22em] text-white/80 uppercase transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
              </LocaleReveal>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              {/* Language Switcher - Always Visible */}
              <button
                type="button"
                onClick={toggleLocale}
                dir="ltr"
                aria-label="AR EN toggle language"
                className="relative inline-flex h-9 w-[84px] items-center rounded-full border border-gold/20 bg-white/5 p-1 backdrop-blur-xl md:h-11 md:w-[112px]"
              >
                <motion.span
                  className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gold shadow-[0_8px_20px_rgba(241,213,130,0.2)] md:shadow-[0_12px_30px_rgba(241,213,130,0.25)]"
                  initial={false}
                  animate={{ x: locale === 'ar' ? '0%' : '100%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />

                <span
                  className={cn(
                    'relative z-10 flex-1 text-center text-[10px] font-bold tracking-[0.15em] uppercase transition-colors md:text-xs md:tracking-[0.2em]',
                    locale === 'ar' ? 'text-rich-black' : 'text-white/55'
                  )}
                >
                  AR
                </span>
                <span
                  className={cn(
                    'relative z-10 flex-1 text-center text-[10px] font-bold tracking-[0.15em] uppercase transition-colors md:text-xs md:tracking-[0.2em]',
                    locale === 'en' ? 'text-rich-black' : 'text-white/55'
                  )}
                >
                  EN
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-gold/30 hover:bg-white/10 md:hidden"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-rich-black/90 pt-32 pb-12 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center gap-8 px-6 text-center">
              {copy.nav.links.map((item, index) => (
                <motion.div
                  key={item.hash}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={localizeHref(item.href) as any}
                    onClick={() => setIsOpen(false)}
                    className="group relative block text-2xl font-bold tracking-[0.3em] text-white uppercase transition-colors hover:text-gold"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <motion.span 
                      className="absolute -bottom-2 left-0 h-0.5 w-0 bg-gold transition-all group-hover:w-full"
                      layoutId="underline"
                    />
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col items-center gap-4"
              >
                <div className="h-px w-24 bg-gold/20" />
                <p className="text-[10px] font-medium tracking-[0.4em] text-gold/60 uppercase">
                  {copy.nav.brand} Premium Estates
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
