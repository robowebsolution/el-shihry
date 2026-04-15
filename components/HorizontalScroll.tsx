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

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { copy, locale } = useLanguage();
  const itemCount = copy.lifestyle.items.length;
  const isArabic = locale === 'ar';

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = scrollRef.current;

      if (!section || !track || itemCount < 2) {
        return;
      }

      const items = gsap.utils.toArray<HTMLElement>('.horizontal-item', section);
      const getMaxOffset = () => Math.max(track.scrollWidth - section.clientWidth, 0);
      const getSnapPoints = () => {
        const maxOffset = getMaxOffset();

        if (maxOffset === 0) {
          return [0];
        }

        return Array.from(
          new Set(items.map((item) => Number((Math.min(item.offsetLeft, maxOffset) / maxOffset).toFixed(4))))
        );
      };

      if (getMaxOffset() === 0) {
        return;
      }

      gsap.set(track, { x: 0 });

      gsap.to(track, {
        x: () => -getMaxOffset(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap:
            items.length > 1
              ? {
                  snapTo: (progress: number) => gsap.utils.snap(getSnapPoints(), progress),
                  duration: { min: 0.12, max: 0.3 },
                  ease: 'power1.inOut',
                }
              : undefined,
          end: () => `+=${getMaxOffset()}`,
        },
      });
    },
    { scope: sectionRef, dependencies: [itemCount, locale], revertOnUpdate: true }
  );

  return (
    <section ref={sectionRef} dir="ltr" className="motion-safe relative h-screen w-full overflow-hidden bg-rich-black">
      <div className={cn('absolute top-20 z-10', isArabic ? 'right-6 text-right md:right-12' : 'left-6 text-left md:left-12')}>
        <ScrollRevealHeading
          as="h2"
          localeKey={`lifestyle-heading-${locale}`}
          className={cn(
            'text-4xl font-bold tracking-tighter md:text-6xl',
            isArabic ? 'leading-[1.2]' : 'uppercase'
          )}
          lines={[
            <span key="lifestyle-line" dir={isArabic ? 'rtl' : 'ltr'} className="block">
              {copy.lifestyle.titleFirst} <span className="text-gradient-gold">{copy.lifestyle.titleSecond}</span>
            </span>,
          ]}
        />
      </div>

      <div ref={scrollRef} className="flex h-full w-max items-center">
        {copy.lifestyle.items.map((item, index) => (
          <div
            key={`${locale}-${index}`}
            className="horizontal-item flex h-full w-screen shrink-0 items-center justify-center p-6 md:w-[50vw] md:p-12"
          >
            <div className="group relative h-[60vh] w-full overflow-hidden rounded-3xl">
              <Image
                src={siteImages.lifestyle[index]}
                alt={item}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-rich-black/40 transition-colors duration-500 group-hover:bg-rich-black/20" />
              <LocaleReveal
                localeKey={`lifestyle-card-${locale}-${index}`}
                className={cn('absolute bottom-10', isArabic ? 'right-10 text-right' : 'left-10 text-left')}
              >
                <ScrollRevealHeading
                  as="h3"
                  localeKey={`lifestyle-card-title-${locale}-${index}`}
                  start="top 92%"
                  className={cn(
                    'text-3xl font-bold text-white md:text-5xl',
                    isArabic ? 'leading-[1.35]' : 'tracking-[0.18em] uppercase'
                  )}
                  lines={[<span key={`item-${index}`} dir={isArabic ? 'rtl' : 'ltr'} className="block">{item}</span>]}
                />
              </LocaleReveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
