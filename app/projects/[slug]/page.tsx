'use client';

import { useParams, notFound } from 'next/navigation';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';
import { siteImages } from '@/lib/site-content';
import { MapPin, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);

  // Find project
  const project = copy.projects.items.find(p => p.slug === slug);
  if (!project) return notFound();

  // Find index for images
  const projectIndex = copy.projects.items.findIndex(p => p.slug === slug);
  const mainImage = siteImages.projects[projectIndex % siteImages.projects.length];

  return (
    <div ref={containerRef} className="pb-32 overflow-hidden">
      {/* Dynamic Hero */}
      <section className="relative h-screen w-full flex items-center justify-center">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <Image src={mainImage} alt={project.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-rich-black/40 via-transparent to-rich-black" />
        </motion.div>

        <div className="relative z-10 text-center max-w-5xl px-6">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center justify-center gap-2 text-gold mb-6"
           >
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-bold tracking-[0.3em] uppercase">{project.location}</span>
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-6xl md:text-9xl font-bold text-white tracking-tighter"
           >
             {project.title}
           </motion.h1>
        </div>

        {/* Floating Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl glass-panel border border-white/10 rounded-full py-6 px-12 hidden md:flex items-center justify-between"
        >
          {project.stats.map((stat, i) => (
            <div key={i} className="text-center group">
               <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase group-hover:text-gold transition-colors">{stat.label}</p>
               <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          ))}
          <div className="h-10 w-[1px] bg-white/10" />
          <button className="flex items-center gap-2 text-gold font-bold tracking-widest text-xs uppercase group">
             {isArabic ? 'الحصول على الكتيب' : 'Request Brochure'}
             <ArrowRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", isArabic ? "rotate-180 group-hover:-translate-x-1" : "")} />
          </button>
        </motion.div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 py-32">
         <motion.div 
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="space-y-8"
         >
            <h2 className="text-xs font-bold tracking-[0.5em] text-gold uppercase">{isArabic ? 'نظرة عامة' : 'The Overview'}</h2>
            <p className="text-3xl md:text-4xl font-medium text-white leading-tight italic">
              "{project.description}"
            </p>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="grid sm:grid-cols-2 gap-8"
         >
            {project.details.map((detail, i) => (
              <div key={i} className="flex gap-4 items-start">
                 <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold mt-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                 </div>
                 <p className="text-white/70 font-medium">{detail}</p>
              </div>
            ))}
         </motion.div>
      </section>

      {/* Visual Showcase */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
         <div className="grid grid-cols-12 gap-6 h-[70vh]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-span-8 relative rounded-[3rem] overflow-hidden border border-white/5"
            >
               <Image src={siteImages.lifestyle[2]} alt="Interior" fill className="object-cover" />
            </motion.div>
            <div className="col-span-4 flex flex-col gap-6">
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="h-1/2 relative rounded-[2rem] overflow-hidden border border-white/5"
               >
                  <Image src={siteImages.lifestyle[3]} alt="Feature" fill className="object-cover" />
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: 20, y: 20 }}
                 whileInView={{ opacity: 1, x: 0, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="h-1/2 glass-panel p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between"
               >
                  <ShieldCheck className="w-10 h-10 text-gold" />
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{isArabic ? 'ضمان الشهري' : 'Shihry Warranty'}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {isArabic ? 'نضمن جودة التنفيذ والتشطيبات لمدة 10 سنوات.' : 'We guarantee the quality of execution and finishes for 10 years.'}
                    </p>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>
    </div>
  );
}
