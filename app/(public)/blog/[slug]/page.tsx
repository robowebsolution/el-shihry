import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: 'Redirecting…',
    alternates: {
      canonical: `/ar/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  redirect(`/ar/blog/${slug}`);
}
