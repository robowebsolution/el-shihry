'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';
import { Award, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';

  return (
    <div className="pt-32 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src={siteImages.about} 
            alt="About Background" 
            fill 
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-b from-rich-black via-transparent to-rich-black" />
        </motion.div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-bold tracking-[0.5em] text-gold uppercase"
          >
            {copy.about.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
          >
            {copy.about.titleLines[0]} <br />
            <span className="text-gradient-gold">{copy.about.titleLines[1]}</span>
          </motion.h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center mb-32 motion-safe">
        <div className={cn("space-y-8", isArabic ? "order-2 text-right" : "text-left")}>
          {copy.about.paragraphs.map((p, i) => (
            <motion.p 
              key={i}
              initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2 }}
              className="text-lg md:text-xl leading-relaxed text-white/70 italic font-light"
            >
              {p}
            </motion.p>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 glass-panel shadow-2xl"
        >
          <Image 
            src={siteImages.lifestyle[1]} 
            alt="Craftsmanship" 
            fill 
            className="object-cover"
          />
        </motion.div>
      </section>

      {/* Philosophy Banner */}
      <section className="bg-white/5 border-y border-white/10 py-24 mb-32 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-medium tracking-tight text-white leading-tight"
          >
            "{copy.philosophy.text}"
          </motion.blockquote>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
      </section>

      {/* Values Section */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 mb-40">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-widest">{isArabic ? 'قيمنا الجوهرية' : 'Core Values'}</h2>
          <div className="h-1 w-20 bg-gold mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-12">
           {copy.about.values.map((val, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="glass-panel p-10 rounded-[3rem] border border-white/5 text-center group hover:border-gold/30 transition-all duration-500"
             >
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-8 group-hover:scale-110 transition-transform">
                   {i === 0 ? <Award className="w-8 h-8" /> : i === 1 ? <Shield className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{val.title}</h3>
                <p className="text-white/50 leading-relaxed italic">{val.description}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="bg-rich-black-light py-32 mb-40 px-6">
         <div className="mx-auto max-w-7xl">
            <div className={cn("mb-20", isArabic ? "text-right" : "text-left")}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{isArabic ? 'رحلة الإنجاز' : 'Journey of Achievement'}</h2>
              <p className="text-gold/60 tracking-widest uppercase font-bold text-sm tracking-[0.4em]">{isArabic ? 'محطات تاريخية' : 'Key Milestones'}</p>
            </div>
            
            <div className="space-y-24 relative">
               <div className={cn("absolute top-0 bottom-0 w-px bg-white/10 hidden md:block", isArabic ? "right-1/2" : "left-1/2")} />
               
               {copy.about.milestones.map((m, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className={cn(
                     "flex flex-col md:flex-row items-center gap-12",
                     i % 2 !== 0 && !isArabic ? "md:flex-row-reverse" : "",
                     i % 2 === 0 && isArabic ? "md:flex-row-reverse" : ""
                   )}
                 >
                    <div className="w-full md:w-1/2 text-center md:text-start">
                       <span className="text-6xl font-black text-white/5 group-hover:text-gold/20 transition-colors">{m.year}</span>
                       <h4 className="text-2xl font-bold text-gold mb-4 uppercase tracking-widest">{m.title}</h4>
                       <p className="text-white/60 leading-relaxed font-light italic text-lg">{m.description}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gold border-4 border-rich-black z-10 hidden md:block shadow-[0_0_20px_rgba(241,213,130,0.5)]" />
                    <div className="w-full md:w-1/2" />
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 mb-20">
         <div className="grid lg:grid-cols-2 gap-20 items-center glass-panel p-12 md:p-20 rounded-[4rem] border border-white/5 overflow-hidden relative">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative aspect-3/4 md:aspect-square rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000"
            >
               <Image src={siteImages.lifestyle[3]} alt="Leadership" fill className="object-cover" />
            </motion.div>
            <div className={cn("space-y-8", isArabic ? "text-right" : "text-left")}>
               <div className="space-y-2">
                  <h3 className="text-4xl md:text-5xl font-bold text-white">{copy.about.leadership[0].name}</h3>
                  <p className="text-gold font-bold tracking-[0.3em] uppercase text-sm">{copy.about.leadership[0].position}</p>
               </div>
               <p className="text-2xl md:text-3xl text-white/80 font-light italic leading-snug">
                  "{copy.about.leadership[0].quote}"
               </p>
               <div className="h-px w-20 bg-gold/50" />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full" />
         </div>
      </section>
    </div>
  );
}
