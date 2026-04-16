'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLanguage } from '@/components/LanguageProvider';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

function ROICounter({ target, isArabic }: { target: number; isArabic: boolean }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toString();
            },
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span className={cn('font-heading-en tabular-nums', isArabic ? 'font-heading-ar' : '')}>
      <span ref={numRef}>0</span>
      <span className="text-gold">%</span>
    </span>
  );
}

const RoiIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 24L12 14L18 19L28 8" stroke="#f1d582" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 8H28V14" stroke="#f1d582" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 28H28" stroke="rgba(241,213,130,0.3)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const PartnerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="10" r="4" stroke="#f1d582" strokeWidth="1.5" />
    <circle cx="21" cy="10" r="4" stroke="#f1d582" strokeWidth="1.5" />
    <path d="M3 26C3 21.582 6.582 18 11 18" stroke="#f1d582" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 18C25.418 18 29 21.582 29 26" stroke="#f1d582" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 22C14 20.343 15.343 19 17 19" stroke="rgba(241,213,130,0.5)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const TimelineIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="16" r="2.5" stroke="#f1d582" strokeWidth="1.5" />
    <circle cx="16" cy="10" r="2.5" stroke="#f1d582" strokeWidth="1.5" />
    <circle cx="24" cy="16" r="2.5" stroke="#f1d582" strokeWidth="1.5" />
    <path d="M10.5 16H13.5" stroke="rgba(241,213,130,0.4)" strokeWidth="1" strokeLinecap="round" />
    <path d="M18.5 16H21.5" stroke="rgba(241,213,130,0.4)" strokeWidth="1" strokeLinecap="round" />
    <path d="M13.77 11.9L10.23 14.1" stroke="rgba(241,213,130,0.4)" strokeWidth="1" strokeLinecap="round" />
    <path d="M18.23 11.9L21.77 14.1" stroke="rgba(241,213,130,0.4)" strokeWidth="1" strokeLinecap="round" />
    <path d="M8 19V24" stroke="#f1d582" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 13V24" stroke="#f1d582" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 19V24" stroke="#f1d582" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ICONS = [RoiIcon, PartnerIcon, TimelineIcon];

export function WhyInvest() {
  const container = useRef<HTMLDivElement>(null);
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';
  const { whyInvest } = copy;

  useGSAP(
    () => {
      gsap.fromTo(
        '.why-divider',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: container.current, start: 'top 75%', once: true },
        }
      );

      gsap.fromTo(
        '.why-card',
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.why-grid', start: 'top 80%', once: true },
        }
      );

      gsap.fromTo(
        '.why-col-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.why-grid', start: 'top 75%', once: true },
        }
      );
    },
    { dependencies: [locale], scope: container }
  );

  return (
    <section
      ref={container}
      id="why-invest"
      className={cn('motion-safe mx-auto max-w-[1400px] px-6 py-32 md:px-12', isArabic ? 'text-right' : 'text-left')}
    >
      <div className={cn('mb-6 flex items-center gap-4', isArabic ? 'flex-row-reverse' : '')}>
        <span className="text-[10px] font-bold tracking-[0.4em] text-gold/70 uppercase">{whyInvest.eyebrow}</span>
        <span className="h-px flex-1 bg-gold/20" />
      </div>

      <div className={cn('mb-4', isArabic ? 'text-right' : '')}>
        <ScrollRevealHeading
          as="h2"
          localeKey={`why-invest-title-${locale}`}
          className={cn(
            'text-5xl font-bold tracking-tighter md:text-7xl',
            isArabic ? 'leading-[1.2]' : 'uppercase leading-none'
          )}
          lines={[
            <span key="why-line" className="block">
              {whyInvest.titleFirst}{' '}
              <span className="text-gradient-gold">{whyInvest.titleSecond}</span>
            </span>,
          ]}
        />
      </div>

      <p className={cn('mb-20 max-w-xl text-base font-light text-white/50', isArabic ? 'mr-0 ml-auto md:ml-0' : '')}>
        {whyInvest.description}
      </p>

      <div className="why-divider mb-20 h-px origin-left bg-gradient-to-r from-gold/40 via-gold/10 to-transparent" />

      <div className="why-grid grid grid-cols-1 gap-0 md:grid-cols-3">
        {whyInvest.cols.map((col, i) => {
          const Icon = ICONS[i];
          const isRoi = i === 0;
          const isLast = i === whyInvest.cols.length - 1;

          return (
            <div
              key={i}
              className={cn(
                'why-card relative px-8 py-10',
                !isLast && 'border-b border-gold/10 md:border-b-0',
                i > 0 && (isArabic ? 'md:border-r md:border-gold/10' : 'md:border-l md:border-gold/10')
              )}
            >
              <div
                className={cn(
                  'why-col-line absolute top-0 hidden origin-top md:block',
                  isArabic ? 'right-0' : 'left-0',
                  i === 0 ? 'opacity-0' : ''
                )}
                style={{ width: '1px', height: '100%', background: 'linear-gradient(to bottom, rgba(241,213,130,0.25), transparent)' }}
              />

              <div className={cn('mb-8 flex items-start gap-4', isArabic ? 'flex-row-reverse' : '')}>
                <div className="flex-shrink-0 opacity-90">
                  <Icon />
                </div>
                <div
                  className={cn(
                    'h-px flex-1 self-center bg-gold/15',
                    isArabic ? 'bg-gradient-to-l from-gold/20 to-transparent' : 'bg-gradient-to-r from-gold/20 to-transparent'
                  )}
                />
              </div>

              <div className={cn('mb-3 text-[10px] font-bold tracking-[0.35em] text-gold/60 uppercase', isArabic ? 'tracking-normal' : '')}>
                {col.title}
              </div>

              <div className={cn('mb-6 font-bold leading-none text-white', isRoi ? 'text-6xl md:text-7xl' : 'text-4xl md:text-5xl')}>
                {isRoi ? (
                  <ROICounter target={parseInt(col.value)} isArabic={isArabic} />
                ) : (
                  <span className={cn(isArabic ? 'font-heading-ar' : '')}>{col.value}</span>
                )}
              </div>

              <p className="text-sm font-light leading-relaxed text-white/40">{col.desc}</p>

              <div className={cn('mt-8 h-px bg-gradient-to-r from-gold/20 to-transparent', isArabic ? 'bg-gradient-to-l' : '')} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
