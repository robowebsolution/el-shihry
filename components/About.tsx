'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/components/LanguageProvider';
import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const container = useRef<HTMLDivElement>(null);
  const { copy, locale, localizeHref } = useLanguage();

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1,
        },
      });

      tl.fromTo('.about-text', { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.1 });

      tl.fromTo(
        '.about-image',
        { scale: 0.8, opacity: 0, rotate: -5 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out' },
        '-=0.5'
      );
    },
    { dependencies: [locale], scope: container }
  );

  return (
    <section id="about" ref={container} className="mx-auto max-w-[1400px] overflow-hidden px-6 py-32 md:px-12">
      <div className="flex flex-col items-center gap-16 md:flex-row">
        <div className={cn('w-full md:w-1/2', locale === 'ar' ? 'text-right' : 'text-left')}>
          <ScrollRevealHeading
            as="h2"
            localeKey={`about-eyebrow-${locale}`}
            className="mb-4 text-sm font-bold tracking-[0.3em] text-gold uppercase"
            lines={[copy.about.eyebrow]}
          />
          <ScrollRevealHeading
            as="h3"
            localeKey={`about-heading-${locale}`}
            className={cn(
              'mb-8 text-4xl font-bold tracking-tighter md:text-6xl',
              locale === 'en' ? 'uppercase leading-tight' : 'leading-[1.3]'
            )}
            lines={[
              copy.about.titleLines[0],
              <span key="about-muted" className="text-white/50">
                {copy.about.titleLines[1]}
              </span>,
            ]}
          />
          <LocaleReveal localeKey={`about-copy-${locale}`}>
            <p className="about-text mb-6 text-lg font-light leading-relaxed text-white/70">{copy.about.paragraphs[0]}</p>
            <p className="about-text mb-10 text-lg font-light leading-relaxed text-white/70">{copy.about.paragraphs[1]}</p>
            <Link 
              href={localizeHref('/about') as any} 
              className="about-text inline-block glass-panel rounded-full px-8 py-4 text-sm font-bold tracking-[0.24em] uppercase hover:bg-white/10 transition-colors"
            >
              {copy.about.cta}
            </Link>
          </LocaleReveal>
        </div>

        <div className="about-image relative h-[600px] w-full overflow-hidden rounded-3xl md:w-1/2">
          <Image
            src={siteImages.about}
            alt="Visionary Architecture"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 z-10 rounded-3xl border border-gold/20" />
        </div>
      </div>
    </section>
  );
}
