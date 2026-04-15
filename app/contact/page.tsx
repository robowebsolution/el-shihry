'use client';

import { motion } from 'motion/react';
import { useLanguage } from '@/components/LanguageProvider';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';

  return (
    <div className="pt-40 pb-20 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-24 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {copy.contactPage.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: isArabic ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 leading-relaxed font-light"
          >
            {copy.contactPage.description}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-white/10 relative"
          >
            <h2 className="text-3xl font-bold text-white mb-10">{copy.contactPage.formTitle}</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase px-1">
                  {isArabic ? 'الاسم بالكامل' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder={isArabic ? 'اسمك الكريم' : 'Your prestigious name'}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase px-1">
                      {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input 
                      type="tel" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-start"
                      placeholder="+20 --- --- ----"
                      dir="ltr"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase px-1">
                      {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="email@example.com"
                      dir="ltr"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase px-1">
                  {isArabic ? 'رسالتك' : 'Your Inquiry'}
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  placeholder={isArabic ? 'كيف يمكننا مساعدتك؟' : 'How may we assist you today?'}
                />
              </div>

              <button className="w-full bg-gold rounded-2xl py-6 text-rich-black font-bold text-lg tracking-[0.2em] uppercase shadow-[0_12px_40px_rgba(241,213,130,0.25)] hover:shadow-[0_15px_50px_rgba(241,213,130,0.4)] hover:translate-y-[-2px] transition-all active:translate-y-[0px]">
                {isArabic ? 'إرسال الطلب' : 'Send Inquiry'}
              </button>
            </form>

            {/* Back Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-[100px] -z-10 rounded-full" />
          </motion.div>

          {/* Info Side */}
          <div className="space-y-12">
             <motion.div
                initial={{ opacity: 0, x: isArabic ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-8"
             >
                <h2 className="text-3xl font-bold text-white">{copy.contactPage.infoTitle}</h2>
                
                <div className="grid sm:grid-cols-2 gap-8">
                   {[
                     { icon: MapPin, title: isArabic ? 'العنوان' : 'Address', value: copy.footer.location },
                     { icon: Phone, title: isArabic ? 'اتصل بنا' : 'Call center', value: '+20 100 000 0000' },
                     { icon: Mail, title: isArabic ? 'البريد' : 'Email', value: 'vip@elshihry.com' },
                     { icon: Clock, title: isArabic ? 'ساعات العمل' : 'Working hours', value: isArabic ? '9ص - 10م' : '9AM - 10PM' }
                   ].map((item, i) => (
                     <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 space-y-3">
                        <item.icon className="w-6 h-6 text-gold mb-2" />
                        <h4 className="text-xs font-bold tracking-[0.1em] text-white/40 uppercase">{item.title}</h4>
                        <p className="text-lg text-white font-medium">{item.value}</p>
                     </div>
                   ))}
                </div>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-panel p-10 rounded-[3rem] border border-white/5 flex items-center gap-8 group cursor-pointer overflow-hidden relative"
             >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-rich-black transition-all duration-500">
                   <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white mb-1">
                     {isArabic ? 'دردشة حية' : 'Live Concierge'}
                   </h3>
                   <p className="text-sm text-white/50 lowercase">
                     {isArabic ? 'تحدث معنا مباشرة عبر الواتساب' : 'Speak directly with our VIP agents'}
                   </p>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-gold/5 blur-3xl -z-10 group-hover:bg-gold/10" />
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
