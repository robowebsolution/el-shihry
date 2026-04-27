'use client';

import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';
import { ProjectsManager } from '@/components/admin/ProjectsManager';

export default function ProjectsPageEditor() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <Building2 className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">إدارة المشاريع</h1>
            <p className="mt-0.5 text-sm text-white/40">صياغة معرض أعمال النخبة وتعديل تفاصيل كل مشروع</p>
          </div>
        </div>

        <div className="my-10 h-px bg-white/5" />

        <ProjectsManager />
      </motion.div>
    </div>
  );
}
