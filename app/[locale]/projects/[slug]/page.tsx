import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectDetailPageClient } from '@/components/ProjectDetailPageClient';
import { RouteContentProvider } from '@/components/RouteContentProvider';
import {
  getProjectEntriesBySlug,
  getProjectSlugs,
} from '@/lib/data/public-content';
import { StructuredData } from '@/components/StructuredData';
import { buildBreadcrumbSchema, buildLocalizedMetadata, buildProjectWebPageSchema } from '@/lib/seo';

type ProjectPageProps = {
  params: Promise<{ locale: 'ar' | 'en'; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();

  return slugs.flatMap((slug) => [{ locale: 'ar' as const, slug }, { locale: 'en' as const, slug }]);
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { entries } = await getProjectEntriesBySlug(slug);
  const project = entries[locale] ?? entries.ar ?? entries.en;

  if (!project) {
    return buildLocalizedMetadata({
      description: 'El Shihry project details.',
      locale,
      noIndex: true,
      path: `/projects/${slug}`,
      title: 'Project | El Shihry Developments',
    });
  }

  return buildLocalizedMetadata({
    description: project.description,
    image: project.cover_url,
    locale,
    path: `/projects/${slug}`,
    title: `${project.title} | El Shihry Projects`,
  });
}

export default async function LocalizedProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const { entries, projectIndex } = await getProjectEntriesBySlug(slug);

  if (!entries.en && !entries.ar) {
    notFound();
  }

  const project = entries[locale] ?? entries.ar ?? entries.en;

  if (!project) {
    notFound();
  }

  return (
    <RouteContentProvider locale={locale} sectionKeys={['projects']}>
      <StructuredData
        data={[
          buildProjectWebPageSchema({ locale, path: `/projects/${slug}`, project }),
          buildBreadcrumbSchema(locale, [
            { name: locale === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
            { name: locale === 'ar' ? 'المشاريع' : 'Projects', path: '/projects' },
            { name: project.title, path: `/projects/${slug}` },
          ]),
        ]}
      />
      <ProjectDetailPageClient entries={entries} projectIndex={projectIndex} slug={slug} />
    </RouteContentProvider>
  );
}
