import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: 'Redirecting…',
    alternates: {
      canonical: `/ar/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  redirect(`/ar/projects/${slug}`);
}
