export const siteConfig = {
  address: {
    addressCountry: 'EG',
    addressLocality: 'New Cairo',
    addressRegion: 'Cairo Governorate',
    streetAddress: 'North 90 Street, New Cairo',
  },
  alternateName: 'El Shihry',
  businessHours: ['Sa-Th 09:00-22:00'],
  defaultOgImage: '/logo.webp',
  email: 'info@elshihry.com',
  founderOrChairman: 'Eng. Ahmed El Shihry',
  legalName: 'El Shihry Developments',
  logoPath: '/logo.webp',
  name: 'El Shihry Developments',
  phone: '+20 100 123 4567',
  portfolioPath: '/portfolio.pdf',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://elshihry.com',
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  },
  taxId: process.env.NEXT_PUBLIC_TAX_ID || '',
  vatId: process.env.NEXT_PUBLIC_VAT_ID || '',
  whatsappNumber: '201001234567',
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
