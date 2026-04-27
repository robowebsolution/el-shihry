'use client';

import { motion } from 'motion/react';
import { BookOpen, PenTool } from 'lucide-react';
import Link from 'next/link';
import { SectionEditor } from '@/components/admin/SectionEditor';

export default function BlogPageEditor() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-400/10">
            <BookOpen className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">صفحة المدونة</h1>
            <p className="mt-0.5 text-sm text-white/40">عنوان قسم المدونة ومحتوى الهيدر</p>
          </div>
        </div>

        <div className="my-8 h-px bg-white/8" />

        <Link
          href={'/admin/blog' as any}
          className="group mb-6 flex flex-col gap-4 rounded-2xl border border-purple-400/20 p-5 glass-panel transition-all hover:border-purple-400/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
              <PenTool className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="font-bold text-white">إدارة المقالات</p>
              <p className="text-sm text-white/40">كتابة وتعديل وحذف مقالات المدونة</p>
            </div>
          </div>
          <span className="text-xs tracking-widest text-purple-400/60 transition-colors group-hover:text-purple-400">
            MANAGE POSTS ←
          </span>
        </Link>

        <div className="space-y-4">
          <SectionEditor
            sectionKey="blog"
            label="هيدر قسم المدونة — Blog Header"
            description="عنوان القسم الرئيسي، الوصف، ونص زر قراءة المقال"
            defaultOpen={true}
          />
        </div>
      </motion.div>
    </div>
  );
}
