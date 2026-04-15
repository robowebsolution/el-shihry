'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLanguage } from '@/components/LanguageProvider';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function ArchitecturalExcellence() {
  const container = useRef<HTMLDivElement>(null);
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';
  const { arch } = copy;

  useGSAP(
    () => {
      gsap.fromTo(
        '.arch-reveal',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 72%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.arch-track',
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 68%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.arch-pillar',
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 58%',
            once: true,
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className={cn('motion-safe relative mx-auto max-w-[1400px] px-6 py-32 md:px-12', isArabic ? 'text-right' : 'text-left')}
    >
      <div className="absolute inset-x-8 top-20 h-44 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] px-6 py-10 md:px-10 md:py-12 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(241,213,130,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative">
          <div className={cn('mb-6 flex items-center gap-4', isArabic ? 'flex-row-reverse' : '')}>
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold/70 uppercase">{arch.eyebrow}</span>
            <span className="h-px flex-1 bg-gold/20" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-end">
            <div className="arch-reveal">
              <ScrollRevealHeading
                as="h2"
                localeKey={`arch-title-${locale}`}
                className={cn(
                  'max-w-4xl text-5xl font-bold tracking-tighter md:text-7xl',
                  isArabic ? 'leading-[1.2]' : 'uppercase leading-none'
                )}
                lines={[
                  <span key="arch-line" className="block">
                    {arch.titleFirst}{' '}
                    <span className="text-gradient-gold">{arch.titleSecond}</span>
                  </span>,
                ]}
              />

              <p
                className={cn(
                  'mt-6 max-w-2xl text-base font-light text-white/60 md:text-lg',
                  isArabic ? 'mr-auto leading-8' : 'leading-8'
                )}
              >
                {arch.description}
              </p>
            </div>

            <div className="arch-reveal relative overflow-hidden rounded-[28px] border border-gold/15 bg-rich-black-light/80 p-6 md:p-8">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,213,130,0.12),transparent_40%)]" />
              <div className="relative">
                <span className="text-[11px] tracking-[0.34em] text-white/40 uppercase">{arch.statementLabel}</span>
                <p className={cn('mt-4 text-2xl font-medium text-white md:text-3xl', isArabic ? 'leading-[1.8]' : 'leading-snug')}>
                  {arch.statement}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {arch.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5">
                      <div className="text-2xl font-semibold text-gold md:text-3xl">{metric.value}</div>
                      <div className={cn('mt-2 text-sm text-white/55', isArabic ? 'leading-7' : 'leading-6')}>{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="arch-track mt-14 h-px origin-center bg-gradient-to-r from-transparent via-white/14 to-transparent" />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {arch.pillars.map((pillar) => (
              <article
                key={pillar.step}
                className="arch-pillar group relative overflow-hidden rounded-[28px] border border-white/10 bg-rich-black-light/55 p-6 md:p-7"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(241,213,130,0.12),transparent_58%)]" />
                <div className="relative">
                  <div className={cn('mb-10 flex items-center justify-between gap-4', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="text-[11px] tracking-[0.38em] text-gold/75 uppercase">{pillar.step}</span>
                    <span className="h-px w-14 bg-gold/25 transition-all duration-300 group-hover:w-24 group-hover:bg-gold/55" />
                  </div>

                  <h3 className={cn('text-2xl font-semibold text-white md:text-[2rem]', isArabic ? 'leading-[1.5]' : 'leading-tight')}>
                    {pillar.title}
                  </h3>
                  <p className={cn('mt-4 text-sm text-white/55 md:text-base', isArabic ? 'leading-8' : 'leading-7')}>
                    {pillar.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
