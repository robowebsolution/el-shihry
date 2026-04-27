'use client';

import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { SectionEditor } from '@/components/admin/SectionEditor';

const sections = [
  {
    key: 'nav',
    label: 'شريط التنقل — Navigation',
    description: 'اسم العلامة التجارية وروابط القائمة الرئيسية',
  },
  {
    key: 'footer',
    label: 'الفوتر — Footer',
    description: 'وصف الشركة، الروابط، معلومات الاتصال، والحقوق القانونية',
  },
  {
    key: 'arch',
    label: 'النهج والمحاور — Approach',
    description: 'قسم "النهج المميز" الظاهر في صفحات المشاريع والرئيسية',
  },
];

export default function GlobalPageEditor() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <Globe className="h-5 w-5 text-white/70" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">العناصر المشتركة</h1>
            <p className="mt-0.5 text-sm text-white/40">العناصر الظاهرة في كل صفحات الموقع</p>
          </div>
        </div>

        <div className="my-8 h-px bg-white/8" />

        <div className="space-y-4">
          {sections.map((section) => (
            <SectionEditor
              key={section.key}
              sectionKey={section.key}
              label={section.label}
              description={section.description}
              defaultOpen={section.key === 'nav'}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
