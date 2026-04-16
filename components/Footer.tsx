'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer';
import { useLanguage } from '@/components/LanguageProvider';
import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { cn } from '@/lib/utils';

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Globe, label: 'Website', href: '#' },
];

export function Footer() {
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';

  const contactInfo = [
    {
      icon: Mail,
      text: 'info@elshihry.com',
      href: 'mailto:info@elshihry.com',
    },
    {
      icon: Phone,
      text: '+20 100 123 4567',
      href: 'tel:+201001234567',
    },
    {
      icon: MapPin,
      text: copy.footer.location,
    },
  ];

  const quickLinksTitle = isArabic ? 'استكشف' : 'Explore';
  const policyTitle = isArabic ? 'السياسات' : 'Policies';
  const followTitle = isArabic ? 'تابعنا' : 'Follow';
  const companySuffix = isArabic ? 'للتطوير العقاري' : 'Developments';
  const companyName = isArabic ? 'الشهري للتطوير العقاري' : 'El Shihry Developments';

  return (
    <footer id="contact" className="relative mx-4 my-8 overflow-hidden rounded-[32px] border border-white/10 bg-rich-black-light/80 md:mx-8">
      <FooterBackgroundGradient />

      <div className="relative z-10 px-6 py-12 md:px-10 md:py-14 lg:px-14">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.15fr_0.75fr_0.75fr_1fr]">
          <div className={cn('max-w-md', isArabic ? 'text-right' : 'text-left')}>
            <LocaleReveal localeKey={`footer-brand-${locale}`}>
              <Link href="/" aria-label="El Shihry Home" className="mb-6 inline-block">
                <Image
                  src="/logo.webp"
                  alt="El Shihry Logo"
                  width={180}
                  height={72}
                  className="h-16 w-auto object-contain md:h-20"
                />
              </Link>

              <ScrollRevealHeading
                as="h2"
                localeKey={`footer-brand-title-${locale}`}
                className={cn('text-4xl font-bold tracking-tighter md:text-6xl', isArabic ? 'leading-[1.25]' : 'uppercase leading-none')}
                lines={[
                  copy.nav.brand,
                  <span key="footer-gold" className="text-gradient-gold">
                    {companySuffix}
                  </span>,
                ]}
              />

              <p className={cn('mt-6 text-sm text-white/65 md:text-base', isArabic ? 'leading-8' : 'leading-7')}>
                {copy.footer.description}
              </p>
            </LocaleReveal>
          </div>

          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <h4 className="mb-6 text-sm font-semibold tracking-[0.28em] text-gold uppercase">{quickLinksTitle}</h4>
            <ul className="space-y-4 text-sm text-white/65 md:text-base">
              {copy.footer.links.map((item) => (
                <li key={item.hash}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <h4 className="mb-6 text-sm font-semibold tracking-[0.28em] text-gold uppercase">{policyTitle}</h4>
            <ul className="space-y-4 text-sm text-white/65 md:text-base">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  {copy.footer.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  {copy.footer.terms}
                </a>
              </li>
              <li className="text-white/40">{copy.footer.location}</li>
            </ul>
          </div>

          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <h4 className="mb-6 text-sm font-semibold tracking-[0.28em] text-gold uppercase">{copy.footer.contactTitle}</h4>
            <ul className="space-y-4 text-sm text-white/65 md:text-base">
              {contactInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.text} className={cn('flex items-center gap-3', isArabic ? 'flex-row-reverse' : '')}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-white/[0.03] text-gold">
                      <Icon size={18} />
                    </span>

                    {item.href ? (
                      <a href={item.href} className="transition-colors hover:text-white">
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className={cn('flex flex-col gap-6 py-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between', isArabic ? 'md:flex-row-reverse' : '')}>
          <div className={cn('flex items-center gap-3', isArabic ? 'md:flex-row-reverse' : '')}>
            <span className="text-[10px] tracking-[0.32em] text-gold/75 uppercase">{followTitle}</span>
            <div className="h-px w-12 bg-gold/20" />
            <div className={cn('flex items-center gap-3', isArabic ? 'flex-row-reverse' : '')}>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <LocaleReveal localeKey={`footer-bottom-${locale}`}>
            <p className={cn(isArabic ? 'text-right' : 'text-left')}>
              &copy; {new Date().getFullYear()} {companyName}. {copy.footer.rights}
            </p>
          </LocaleReveal>
        </div>

        <div className="hidden h-[16rem] items-center justify-center border-t border-white/8 pt-4 lg:flex">
          <TextHoverEffect text={isArabic ? 'الشهري' : 'El Shihry'} className="h-full w-full max-w-6xl" />
        </div>
      </div>
    </footer>
  );
}
