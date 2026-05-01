export const siteConfig = {
  address: {
    addressCountry: 'EG',
    addressLocality: 'New Cairo',
    addressRegion: 'Cairo Governorate',
    postalCode: '11835',
    streetAddress: 'Villa 472, North El Choueifat, opposite Downtown, Fifth Settlement',
  },
  alternateName: 'El Shihry',
  businessHours: ['Sa-Th 09:00-22:00'],
  defaultOgImage: '/logo.webp',
  email: 'esgroup@gmail.com',
  founderOrChairman: 'Eng. Ahmed El Shihry',
  legalName: 'El Shihry Developments',
  localizedAddress: {
    ar: 'فيلا 472 - شمال الشويفات - أمام داون تاون - التجمع الخامس - القاهرة الجديدة 11835، مصر',
    en: 'Villa 472, North El Choueifat, opposite Downtown, Fifth Settlement, New Cairo 11835, Egypt',
  },
  logoPath: '/logo.webp',
  name: 'El Shihry Developments',
  phone: '+20 10 20008256',
  phoneDisplay: '010 20008256',
  portfolioPath: '/portfolio.pdf',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://elshihry.com',
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/ElshihryDevelopments',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/elshihrydevelopments/',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/elshihrydevelopments',
  },
  taxId: process.env.NEXT_PUBLIC_TAX_ID || '',
  vatId: process.env.NEXT_PUBLIC_VAT_ID || '',
  whatsappDisplay: '+20 10 20008256',
  whatsappNumber: '201020008256',
} as const;

export type SocialPlatform = keyof typeof siteConfig.socials;

export function getSocialLinks() {
  return Object.entries(siteConfig.socials)
    .filter(([, href]) => Boolean(href))
    .map(([platform, href]) => ({
      href,
      platform: platform as SocialPlatform,
    }));
}

export function getWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${siteConfig.whatsappNumber}`;

  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

export function getPhoneHref() {
  return `tel:${siteConfig.phone.replace(/\s+/g, '')}`;
}

export function getMailtoHref() {
  return `mailto:${siteConfig.email}`;
}

export function resolveAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

export function getDefaultMetadataDescription() {
  return 'Luxury real estate developments in New Cairo by El Shihry Developments.';
}
