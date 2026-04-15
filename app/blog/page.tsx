'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { siteImages } from '@/lib/site-content';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BlogPage() {
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="mx-auto max-w-7xl mb-24 section-glow">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-3xl"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            {copy.blog.title}
          </h1>
          <p className="text-xl text-white/50 leading-relaxed italic max-w-2xl">
            {copy.blog.description}
          </p>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl flex flex-col gap-12">
        {copy.blog.items.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-[3rem] border border-white/5 overflow-hidden grid lg:grid-cols-12 group hover:border-gold/20 transition-colors"
          >
            {/* Image Side */}
            <div className="lg:col-span-5 relative h-[300px] lg:h-full overflow-hidden">
               <Image 
                src={siteImages.lifestyle[i % siteImages.lifestyle.length]} 
                alt={post.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
               />
               <div className="absolute top-6 left-6 bg-gold text-rich-black px-4 py-1.5 rounded-full font-bold text-[10px] tracking-widest uppercase">
                  {post.tag}
               </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-4 text-white/40 text-xs font-bold tracking-widest uppercase mb-8">
                     <Calendar className="w-4 h-4 text-gold" />
                     <span>{post.date}</span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}` as any}>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 group-hover:text-gold transition-colors leading-snug">
                       {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-white/60 text-lg leading-relaxed mb-10 line-clamp-3">
                    {post.excerpt}
                  </p>
               </div>

               <Link 
                href={`/blog/${post.slug}` as any}
                className="inline-flex items-center gap-4 text-xs font-bold tracking-[0.3em] text-white uppercase group/btn"
               >
                 <span>{copy.blog.cta}</span>
                 <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-gold group-hover/btn:text-rich-black transition-all">
                    <ArrowRight className={cn("w-5 h-5", isArabic ? "rotate-180" : "")} />
                 </div>
               </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
