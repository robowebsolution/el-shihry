import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogPostPageClient } from '@/components/BlogPostPageClient';
import { RouteContentProvider } from '@/components/RouteContentProvider';
import {
  getBlogEntriesBySlug,
  getBlogSlugs,
} from '@/lib/data/public-content';
import { getRouteContent } from '@/lib/data/route-content';
import { StructuredData } from '@/components/StructuredData';
import { buildBlogPostingSchema, buildBreadcrumbSchema, buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';

type BlogPageProps = {
  params: Promise<{ locale: 'ar' | 'en'; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();

  return slugs.flatMap((slug) => [{ locale: 'ar' as const, slug }, { locale: 'en' as const, slug }]);
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { entries } = await getBlogEntriesBySlug(slug);
  const post = entries[locale] ?? entries.ar ?? entries.en;

  if (!post) {
    return buildLocalizedMetadata({
      description: 'El Shihry blog and market updates.',
      locale,
      noIndex: true,
      path: `/blog/${slug}`,
      title: 'Blog | El Shihry Developments',
    });
  }

  return buildLocalizedMetadata({
    description: post.excerpt,
    image: post.cover_url,
    locale,
    path: `/blog/${slug}`,
    title: `${post.title} | El Shihry Insights`,
    type: 'article',
  });
}

export default async function LocalizedBlogPostPage({ params }: BlogPageProps) {
  const { locale, slug } = await params;
  const [{ entries, postIndex }, content] = await Promise.all([
    getBlogEntriesBySlug(slug),
    getRouteContent(['blog']),
  ]);

  if (!entries.en && !entries.ar) {
    notFound();
  }

  const post = entries[locale] ?? entries.ar ?? entries.en;

  if (!post) {
    notFound();
  }

  return (
    <RouteContentProvider dynamicContent={content} locale={locale}>
      <StructuredData
        data={[
          buildWebPageSchema({
            description: post.excerpt,
            locale,
            path: `/blog/${slug}`,
            title: post.title,
          }),
          buildBreadcrumbSchema(locale, [
            { name: locale === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
            { name: locale === 'ar' ? 'المدونة' : 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${slug}` },
          ]),
          buildBlogPostingSchema({ locale, path: `/blog/${slug}`, post }),
        ]}
      />
      <BlogPostPageClient entries={entries} postIndex={postIndex} slug={slug} />
    </RouteContentProvider>
  );
}
