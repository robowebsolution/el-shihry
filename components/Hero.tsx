'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { useLanguage } from '@/components/LanguageProvider';
import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const { copy, locale } = useLanguage();
  const isRTL = locale === 'ar';

    useGSAP(
    () => {
      gsap.to(videoRef.current, {
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
    { dependencies: [locale], scope: container }
  );

  return (
    <section
      ref={container}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative flex h-screen w-full items-center overflow-hidden"
    >
      {/* ─── Video Background ─── */}
      <div ref={videoRef} className="absolute inset-0 -top-[15%] z-0 h-[130%] w-full">
        {/* gradient overlay: darker on the content side */}
        <div 
          className={cn(
            "absolute inset-0 z-10 bg-gradient-to-r from-rich-black/85 via-rich-black/50 to-rich-black/20",
            isRTL && "bg-gradient-to-l"
          )} 
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={siteImages.hero.src}
          className="h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 md:px-16">
        <div className={cn("max-w-3xl", isRTL && " text-right")}>

          {/* Badge */}
          <LocaleReveal localeKey={`hero-badge-${locale}`} className="mb-6">
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-[0.25em] text-white/60 uppercase backdrop-blur-sm'
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              {copy.hero.badge}
            </span>
          </LocaleReveal>

          {/* Heading */}
          <ScrollRevealHeading
            as="h1"
            localeKey={`hero-heading-${locale}`}
            start="top 92%"
            className={cn(
              'mb-6 font-bold tracking-tighter text-white',
              'text-4xl leading-[1.05] md:text-5xl lg:text-6xl',
              locale === 'en' ? 'uppercase' : 'leading-[1.15]'
            )}
            lines={[
              copy.hero.titleFirst,
              <span key="hero-gold" className="text-gradient-gold block">
                {copy.hero.titleSecond}
              </span>,
            ]}
          />

          {/* Subtitle */}
          <LocaleReveal localeKey={`hero-copy-${locale}`} className="mb-10">
            <p
              className={cn(
                'max-w-xl text-sm font-light text-white/60 md:text-base',
                locale === 'ar' ? 'leading-8' : 'tracking-wide leading-relaxed'
              )}
            >
              {copy.hero.subtitle}
            </p>
          </LocaleReveal>

          {/* Buttons */}
          <LocaleReveal localeKey={`hero-btns-${locale}`}>
            <div className={cn('flex flex-wrap gap-4')}>

              {/* Primary — Download Portfolio */}
              <a
                href="/portfolio.pdf"
                download
                className={cn(
                  'group inline-flex items-center gap-3 rounded-full px-7 py-3.5',
                  'bg-white text-rich-black text-sm font-semibold tracking-wide',
                  'transition-all duration-300 hover:bg-gold hover:text-rich-black',
                  'shadow-[0_0_30px_rgba(255,255,255,0.08)]'
                )}
              >
                {!isRTL && <span>{copy.hero.btnDownload}</span>}
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full bg-rich-black/10',
                    'transition-transform duration-300',
                    isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                  )}
                >
                  {isRTL ? (
                    <ArrowLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </span>
                {isRTL && <span>{copy.hero.btnDownload}</span>}
              </a>

              {/* Secondary — See Our Projects */}
              <Link
                href={{ pathname: '/projects' }}
                className={cn(
                  'group inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5',
                  'text-sm font-medium text-white/80 tracking-wide',
                  'transition-all duration-300 hover:border-gold/60 hover:text-white backdrop-blur-sm'
                )}
              >
                {!isRTL && <span>{copy.hero.btnProjects}</span>}
                {isRTL ? (
                  <ArrowUpLeft
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      'group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 group-hover:text-gold'
                    )}
                  />
                ) : (
                  <ArrowUpRight
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold'
                    )}
                  />
                )}
                {isRTL && <span>{copy.hero.btnProjects}</span>}
              </Link>

            </div>
          </LocaleReveal>
        </div>
      </div>

    </section>
  );
}
