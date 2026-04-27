import type { Metadata } from 'next';

import type { BlogPost, Locale, ProjectCard } from '@/lib/site-content';
import { defaultLocale, getAlternateLocale, withLocale } from '@/lib/i18n';
import { resolveAbsoluteUrl, siteConfig } from '@/lib/site-config';

type MetadataInput = {
  description: string;
  image?: string;
  locale: Locale;
  noIndex?: boolean;
  path: string;
  title: string;
  type?: 'article' | 'website';
};

function resolveMetadataImage(image?: string) {
  const candidate = image || siteConfig.defaultOgImage;

  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  return resolveAbsoluteUrl(candidate);
}

export function buildLocalizedMetadata({
  description,
  image,
  locale,
  noIndex = false,
  path,
  title,
  type = 'website',
}: MetadataInput): Metadata {
  const canonicalPath = withLocale(locale, path);
  const alternateLocale = getAlternateLocale(locale);
  const ogImage = resolveMetadataImage(image);

  return {
    alternates: {
      canonical: canonicalPath,
      languages: {
        ar: withLocale('ar', path),
        en: withLocale('en', path),
        'x-default': withLocale(defaultLocale, path),
      },
    },
    description,
    openGraph: {
      description,
      images: [{ alt: title, url: ogImage }],
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      siteName: siteConfig.name,
      title,
      type,
      url: canonicalPath,
    },
    robots: noIndex ? { follow: false, index: false } : { follow: true, index: true },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [ogImage],
      title,
    },
  };
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbSchema(locale: Locale, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: resolveAbsoluteUrl(withLocale(locale, item.path)),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    address: {
      '@type': 'PostalAddress',
      ...siteConfig.address,
    },
    alternateName: siteConfig.alternateName,
    contactPoint: {
      '@type': 'ContactPoint',
      areaServed: 'EG',
      availableLanguage: ['Arabic', 'English'],
      contactType: 'sales',
      email: siteConfig.email,
      telephone: siteConfig.phone,
    },
    description: 'Luxury real estate development company focused on landmark assets in New Cairo, Egypt.',
    email: siteConfig.email,
    legalName: siteConfig.legalName,
    logo: resolveAbsoluteUrl(siteConfig.logoPath),
    name: siteConfig.name,
    openingHours: siteConfig.businessHours,
    sameAs: Object.values(siteConfig.socials).filter(Boolean),
    telephone: siteConfig.phone,
    url: siteConfig.siteUrl,
    ...(siteConfig.taxId ? { taxID: siteConfig.taxId } : {}),
    ...(siteConfig.vatId ? { vatID: siteConfig.vatId } : {}),
  };
}

export function buildWebsiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    inLanguage: locale,
    name: siteConfig.name,
    publisher: {
      '@id': resolveAbsoluteUrl('/#organization'),
    },
    url: resolveAbsoluteUrl(withLocale(locale, '/')),
  };
}

export function buildWebPageSchema({
  description,
  locale,
  path,
  title,
}: {
  description: string;
  locale: Locale;
  path: string;
  title: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    description,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      url: siteConfig.siteUrl,
    },
    name: title,
    url: resolveAbsoluteUrl(withLocale(locale, path)),
  };
}

export function buildBlogPostingSchema({
  locale,
  path,
  post,
}: {
  locale: Locale;
  path: string;
  post: BlogPost;
}) {
  const publishedAt = post.published_at || post.created_at;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: post.author_name || siteConfig.founderOrChairman,
    },
    dateModified: post.updated_at || publishedAt,
    datePublished: publishedAt,
    description: post.excerpt,
    headline: post.title,
    image: resolveMetadataImage(post.cover_url),
    inLanguage: locale,
    mainEntityOfPage: resolveAbsoluteUrl(withLocale(locale, path)),
    publisher: {
      '@type': 'Organization',
      logo: {
        '@type': 'ImageObject',
        url: resolveAbsoluteUrl(siteConfig.logoPath),
      },
      name: siteConfig.name,
    },
  };
}

export function buildProjectWebPageSchema({
  locale,
  path,
  project,
}: {
  locale: Locale;
  path: string;
  project: ProjectCard;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    about: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: project.governorate || 'EG',
        addressLocality: project.city || project.location,
      },
      name: project.location,
    },
    description: project.description,
    inLanguage: locale,
    name: project.title,
    url: resolveAbsoluteUrl(withLocale(locale, path)),
  };
}
