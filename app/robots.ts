import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.siteUrl,
    rules: [
      {
        allow: '/',
        userAgent: '*',
      },
      {
        allow: '/',
        userAgent: 'Googlebot',
      },
      {
        allow: '/',
        userAgent: 'OAI-SearchBot',
      },
      {
        allow: '/',
        userAgent: 'GPTBot',
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
