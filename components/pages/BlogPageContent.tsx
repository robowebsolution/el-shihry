'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export function BlogPageContent() {
  const { copy, locale, localizeHref } = useLanguage();
  const isArabic = locale === 'ar';

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="section-glow mx-auto mb-24 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="mb-6 text-6xl font-bold tracking-tight text-white md:text-8xl">
            {copy.blog.title}
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-white/50 italic">
            {copy.blog.description}
          </p>
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        {copy.blog.items.map((post, index) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel grid overflow-hidden rounded-[3rem] border border-white/5 transition-colors hover:border-gold/20 lg:grid-cols-12"
          >
            <div className="relative h-[300px] overflow-hidden lg:col-span-5 lg:h-full">
              <Image
                src={post.cover_url || siteImages.lifestyle[index % siteImages.lifestyle.length]}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="absolute top-6 left-6 rounded-full bg-gold px-4 py-1.5 text-[10px] font-bold tracking-widest text-rich-black uppercase">
                {post.tag}
              </div>
            </div>

            <div className="flex flex-col justify-between p-8 md:p-16 lg:col-span-7">
              <div>
                <div className="mb-8 flex items-center gap-4 text-xs font-bold tracking-widest text-white/40 uppercase">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span>{post.date}</span>
                </div>

                <Link href={localizeHref(`/blog/${post.slug}`) as any}>
                  <h2 className="mb-6 text-3xl font-bold leading-snug text-white transition-colors group-hover:text-gold md:text-4xl">
                    {post.title}
                  </h2>
                </Link>

                <p className="mb-10 line-clamp-3 text-lg leading-relaxed text-white/60">
                  {post.excerpt}
                </p>
              </div>

              <Link
                href={localizeHref(`/blog/${post.slug}`) as any}
                className="group/btn inline-flex items-center gap-4 text-xs font-bold tracking-[0.3em] text-white uppercase"
                aria-label={`${copy.blog.cta}: ${post.title}`}
              >
                <span>{copy.blog.cta}</span>
                <span className="sr-only">: {post.title}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all group-hover/btn:bg-gold group-hover/btn:text-rich-black">
                  <ArrowRight className={cn('h-5 w-5', isArabic ? 'rotate-180' : '')} />
                </div>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
