'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

import { useLanguage } from '@/components/LanguageProvider';
import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { copy, locale } = useLanguage();

  useGSAP(
    () => {
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 -top-[15%] z-0 h-[130%] w-full">
        <div className="absolute inset-0 z-10 bg-rich-black/60" />
        <Image src={siteImages.hero} alt="Luxury Real Estate" fill className="object-cover" priority />
      </div>

      <div className="relative z-10 px-4 text-center" style={{ perspective: '1000px' }}>
        <ScrollRevealHeading
          as="h1"
          localeKey={`hero-heading-${locale}`}
          start="top 92%"
          className={cn(
            'mb-4 text-5xl font-bold tracking-tighter md:text-8xl',
            locale === 'en' ? 'uppercase' : 'leading-[1.15]'
          )}
          lines={[
            copy.hero.titleFirst,
            <span key="hero-gold" className="text-gradient-gold block">
              {copy.hero.titleSecond}
            </span>,
          ]}
        />

        <LocaleReveal localeKey={`hero-copy-${locale}`} className="mt-8 text-center">
          <p
            className={cn(
              'mx-auto max-w-3xl text-lg font-light text-white/80 md:text-2xl',
              locale === 'en' ? 'tracking-wide' : 'leading-9'
            )}
          >
            {copy.hero.subtitle}
          </p>
        </LocaleReveal>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <LocaleReveal localeKey={`hero-scroll-${locale}`}>
          <span className="text-xs tracking-[0.3em] text-white/50 uppercase">{copy.hero.scrollLabel}</span>
        </LocaleReveal>
        <div className="h-12 w-px overflow-hidden bg-white/20">
          <div className="h-full w-full origin-top animate-pulse bg-gold" />
        </div>
      </div>
    </section>
  );
}
