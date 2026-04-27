import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { siteContent, Locale } from '@/lib/site-content';

export const getPublishedBlogPosts = unstable_cache(
  async (locale: Locale = 'ar') => {
    // If we don't have keys, fallback completely to static
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return (siteContent[locale] as any).blog.items;
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('locale', locale)
        .eq('published', true)
        .order('published_at', { ascending: false });
      
      if (error || !data || data.length === 0) {
        return (siteContent[locale] as any).blog.items; // fallback
      }

      // Map to match the existing shape
      return data.map(post => ({
        slug: post.slug,
        title: post.title,
        date: new Date(post.published_at || post.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        tag: post.tag,
        excerpt: post.excerpt,
        content: post.content,
        // Optional extension: we can use cover_url here if we want image, but siteContent mapped it by index
      }));
    } catch (e) {
      return (siteContent[locale] as any).blog.items;
    }
  },
  ['blog-posts'],
  { tags: ['blog-posts'], revalidate: 3600 }
);

export const getBlogPost = unstable_cache(
  async (slug: string, locale: Locale = 'ar') => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return (siteContent[locale] as any).blog.items.find((i: any) => i.slug === slug);
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .single();
      
      if (error || !data) {
        return (siteContent[locale] as any).blog.items.find((i: any) => i.slug === slug);
      }

      return {
         slug: data.slug,
         title: data.title,
         date: new Date(data.published_at || data.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
         tag: data.tag,
         excerpt: data.excerpt,
         content: data.content,
         cover_url: data.cover_url
      };
    } catch (e) {
      return (siteContent[locale] as any).blog.items.find((i: any) => i.slug === slug);
    }
  },
  ['blog-post-single'],
  { tags: ['blog-posts'], revalidate: 3600 }
);
