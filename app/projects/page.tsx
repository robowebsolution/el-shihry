'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { siteImages } from '@/lib/site-content';
import { ArrowUpRight, MapPin } from 'lucide-react';

export default function ProjectsPage() {
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';

  return (
    <div className="pt-40 pb-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl text-center mb-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold tracking-[0.4em] text-gold uppercase mb-6"
        >
          {isArabic ? 'محافظتنا العقارية' : 'Our Portfolio'}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold text-white tracking-tight"
        >
          {copy.projects.titleFirst} <br />
          <span className="text-gradient-gold">{copy.projects.titleSecond}</span>
        </motion.h1>
      </div>

      {/* Masonry Grid Implementation */}
      <div className="mx-auto max-w-7xl columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 motion-safe">
        {copy.projects.items.map((project, i) => {
           // Varying aspect ratios for masonry feel
           const aspects = ['aspect-3/4', 'aspect-4/5', 'aspect-square', 'aspect-[9/16]'];
           const aspectClass = aspects[i % aspects.length];

           return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="break-inside-avoid mb-8 group relative"
            >
              <Link 
                href={`/projects/${project.slug}` as any} 
                className={`block overflow-hidden rounded-[2.5rem] relative ${aspectClass} border border-white/10 glass-panel shadow-xl`}
              >
                 {/* Project Image */}
                 <Image 
                  src={siteImages.projects[i % siteImages.projects.length]} 
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 />

                 {/* Overlays */}
                 <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-rich-black via-rich-black/80 to-transparent pt-32 h-full flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-gold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 shrink-0">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">{project.location}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors duration-500 line-clamp-2">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-4 text-white font-bold tracking-widest uppercase text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                       <span className="border-b border-gold pb-0.5">{copy.projects.cta}</span>
                       <ArrowUpRight className="w-4 h-4 text-gold" />
                    </div>
                 </div>

                 {/* Small Featured Tag */}
                 <div className="absolute top-6 right-6 bg-rich-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full z-10">
                    <span className="text-[8px] font-bold tracking-[0.2em] text-gold uppercase">Shihry Classic</span>
                 </div>
              </Link>
            </motion.div>
           );
        })}
      </div>
    </div>
  );
}
