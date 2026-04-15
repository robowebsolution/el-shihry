'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLanguage } from '@/components/LanguageProvider';

gsap.registerPlugin(ScrollTrigger);

export function Marquee() {
  const container = useRef<HTMLDivElement>(null);
  const text1 = useRef<HTMLDivElement>(null);
  const text2 = useRef<HTMLDivElement>(null);
  const { copy, locale } = useLanguage();

  useGSAP(
    () => {
      gsap.to(text1.current, {
        xPercent: locale === 'ar' ? 50 : -50,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(text2.current, {
        xPercent: locale === 'ar' ? -50 : 50,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    { scope: container, dependencies: [locale], revertOnUpdate: true }
  );

  return (
    <section className="my-20 flex scale-110 rotate-[-2deg] flex-col gap-4 overflow-hidden bg-gold py-32 text-rich-black" ref={container}>
      <div ref={text1} className="whitespace-nowrap text-6xl font-black tracking-tighter uppercase md:text-[6rem]">
        {copy.marquee.first}
      </div>
      <div ref={text2} className="-ml-[100%] whitespace-nowrap text-6xl font-black tracking-tighter uppercase md:text-[6rem]">
        {copy.marquee.second}
      </div>
    </section>
  );
}
