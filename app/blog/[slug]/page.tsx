'use client';

import { useParams, notFound } from 'next/navigation';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { siteImages } from '@/lib/site-content';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';

  const post = copy.blog.items.find(p => p.slug === slug);
  if (!post) return notFound();

  const postIndex = copy.blog.items.findIndex(p => p.slug === slug);
  const heroImage = siteImages.lifestyle[postIndex % siteImages.lifestyle.length];

  return (
    <div className="pb-32">
      {/* Editorial Header */}
      <section className="relative h-[70vh] w-full flex items-end pb-20 px-6">
        <div className="absolute inset-0 z-0">
          <Image src={heroImage} alt={post.title} fill className="object-cover grayscale opacity-40" priority />
          <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl w-full">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-wrap items-center gap-6 text-gold mb-8 text-xs font-bold tracking-[0.3em] uppercase"
           >
              <Link href={"/blog" as any} className="flex items-center gap-2 hover:text-white transition-colors">
                 <ArrowLeft className={cn("w-4 h-4", isArabic ? "rotate-180" : "")} />
                 <span>{isArabic ? 'المدونة' : 'The Blog'}</span>
              </Link>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                 <Calendar className="w-3 h-3" />
                 <span>{post.date}</span>
              </div>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8"
           >
             {post.title}
           </motion.h1>

           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="flex items-center gap-10"
           >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    SH
                 </div>
                 <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                    By El Shihry Editorial
                 </div>
              </div>
              <button className="text-white/40 hover:text-gold transition-colors">
                 <Share2 className="w-5 h-5" />
              </button>
           </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section className="mx-auto max-w-3xl px-6 pt-24">
         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="space-y-12"
         >
            {post.content.map((paragraph, i) => (
              <p 
                key={i} 
                className={cn(
                  "text-xl md:text-2xl leading-[1.8] text-white/80 font-light italic",
                  i === 0 ? "first-letter:text-7xl first-letter:text-gold first-letter:font-bold first-letter:float-left first-letter:mr-4 first-letter:mt-2" : ""
                )}
              >
                {paragraph}
              </p>
            ))}
         </motion.div>

         {/* Editorial Footer */}
         <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">{isArabic ? 'الوسوم' : 'Tags'}:</span>
               <span className="text-xs text-gold font-bold">{post.tag}</span>
            </div>
            
            <Link href={"/blog" as any} className="text-xs font-bold tracking-[0.2em] text-white uppercase border-b border-gold pb-1 hover:text-gold transition-colors">
               {isArabic ? 'العودة لجميع المقالات' : 'Back to all articles'}
            </Link>
         </div>
      </section>

      {/* Visual Break */}
      <section className="mx-auto max-w-7xl px-6 my-32">
         <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative aspect-vide rounded-[4rem] overflow-hidden border border-white/5"
         >
            <Image src={siteImages.hero} alt="Atmosphere" fill className="object-cover grayscale opacity-60" />
            <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
         </motion.div>
      </section>
    </div>
  );
}
