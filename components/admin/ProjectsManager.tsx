'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  MapPin,
  LayoutGrid,
  Building2,
  Trash,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from 'lucide-react';
import { SmartUploader } from '@/components/admin/SmartUploader';
import { useToast } from '@/components/admin/ToastProvider';
import { notifyContentUpdated } from '@/lib/content-sync';

interface Project {
  slug: string;
  title: string;
  location: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  details: string[];
  cover_url?: string;
  gallery?: string[];
}

interface ProjectsSection {
  titleFirst: string;
  titleSecond: string;
  description: string;
  cta: string;
  items: Project[];
}

interface AdminProjectStat {
  label: string;
  labelEn: string;
  value: string;
}

interface AdminProjectDetail {
  text: string;
  textEn: string;
}

interface AdminProject {
  slug: string;
  title: string;
  titleEn: string;
  location: string;
  locationEn: string;
  description: string;
  descriptionEn: string;
  stats: AdminProjectStat[];
  details: AdminProjectDetail[];
  cover_url?: string;
  gallery?: string[];
}

const createEmptyProject = (): AdminProject => ({
  slug: '',
  title: '',
  titleEn: '',
  location: '',
  locationEn: '',
  description: '',
  descriptionEn: '',
  stats: [
    { label: 'الارتفاع', labelEn: 'Height', value: '' },
    { label: 'الوحدات', labelEn: 'Units', value: '' },
    { label: 'التسليم', labelEn: 'Delivery', value: '' },
  ],
  details: [
    { text: '', textEn: '' },
    { text: '', textEn: '' },
    { text: '', textEn: '' },
  ],
  cover_url: '',
  gallery: [],
});

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function mergeProjectLocales(arProject?: Project, enProject?: Project): AdminProject {
  const maxStats = Math.max(arProject?.stats?.length || 0, enProject?.stats?.length || 0, 3);
  const maxDetails = Math.max(arProject?.details?.length || 0, enProject?.details?.length || 0, 3);

  return {
    slug: arProject?.slug || enProject?.slug || '',
    title: arProject?.title || '',
    titleEn: enProject?.title || '',
    location: arProject?.location || '',
    locationEn: enProject?.location || '',
    description: arProject?.description || '',
    descriptionEn: enProject?.description || '',
    stats: Array.from({ length: maxStats }, (_, index) => ({
      label: arProject?.stats?.[index]?.label || '',
      labelEn: enProject?.stats?.[index]?.label || '',
      value: arProject?.stats?.[index]?.value || enProject?.stats?.[index]?.value || '',
    })),
    details: Array.from({ length: maxDetails }, (_, index) => ({
      text: arProject?.details?.[index] || '',
      textEn: enProject?.details?.[index] || '',
    })),
    cover_url: arProject?.cover_url || enProject?.cover_url || '',
    gallery: arProject?.gallery || enProject?.gallery || [],
  };
}

function projectToLocale(project: AdminProject, locale: 'ar' | 'en'): Project {
  return {
    slug: project.slug,
    title: locale === 'ar' ? project.title : project.titleEn,
    location: locale === 'ar' ? project.location : project.locationEn,
    description: locale === 'ar' ? project.description : project.descriptionEn,
    stats: project.stats.map((stat) => ({
      label: locale === 'ar' ? stat.label : stat.labelEn,
      value: stat.value,
    })),
    details: project.details.map((detail) => (locale === 'ar' ? detail.text : detail.textEn)),
    cover_url: project.cover_url,
    gallery: project.gallery || [],
  };
}

function sanitizeProject(project: AdminProject): AdminProject {
  return {
    ...project,
    title: project.title.trim(),
    titleEn: project.titleEn.trim(),
    slug: project.slug.trim(),
    location: project.location.trim(),
    locationEn: project.locationEn.trim(),
    description: project.description.trim(),
    descriptionEn: project.descriptionEn.trim(),
    stats: project.stats
      .map((stat) => ({
        label: stat.label.trim(),
        labelEn: stat.labelEn.trim(),
        value: stat.value.trim(),
      }))
      .filter((stat) => stat.label || stat.labelEn || stat.value),
    details: project.details
      .map((detail) => ({
        text: detail.text.trim(),
        textEn: detail.textEn.trim(),
      }))
      .filter((detail) => detail.text || detail.textEn),
    gallery: (project.gallery || []).filter(Boolean),
  };
}

function buildMergedProjects(dataAr: ProjectsSection | null, dataEn: ProjectsSection | null) {
  const maxItems = Math.max(dataAr?.items.length || 0, dataEn?.items.length || 0);

  return Array.from({ length: maxItems }, (_, index) => {
    const arProject = dataAr?.items[index];
    const enProject =
      dataEn?.items.find((candidate) => candidate.slug === arProject?.slug) || dataEn?.items[index];

    return mergeProjectLocales(arProject, enProject);
  }).filter((project) => project.slug || project.title || project.titleEn);
}

export function ProjectsManager() {
  const [dataAr, setDataAr] = useState<ProjectsSection | null>(null);
  const [dataEn, setDataEn] = useState<ProjectsSection | null>(null);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const mergedProjects = buildMergedProjects(dataAr, dataEn);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const [arRes, enRes] = await Promise.all([
          fetch('/api/admin/sections?section_key=projects&locale=ar'),
          fetch('/api/admin/sections?section_key=projects&locale=en'),
        ]);

        if (!arRes.ok || !enRes.ok) {
          toast('تعذر تحميل بيانات المشاريع', 'error');
          return;
        }

        const [arJson, enJson] = await Promise.all([arRes.json(), enRes.json()]);
        setDataAr(arJson.data);
        setDataEn(enJson.data);
      } catch {
        toast('خطأ في الاتصال بالشبكة', 'error');
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [toast]);

  useEffect(() => {
    document.body.style.overflow = editingProject ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingProject]);

  const handleSaveAll = async (updatedItems: AdminProject[]) => {
    if (!dataAr || !dataEn) return;

    setSaving(true);
    try {
      const nextArData: ProjectsSection = {
        ...dataAr,
        items: updatedItems.map((item) => projectToLocale(item, 'ar')),
      };
      const nextEnData: ProjectsSection = {
        ...dataEn,
        items: updatedItems.map((item) => projectToLocale(item, 'en')),
      };

      const [arRes, enRes] = await Promise.all([
        fetch('/api/admin/sections', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_key: 'projects',
            locale: 'ar',
            data: nextArData,
          }),
        }),
        fetch('/api/admin/sections', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_key: 'projects',
            locale: 'en',
            data: nextEnData,
          }),
        }),
      ]);

      if (!arRes.ok || !enRes.ok) {
        toast('حدث خطأ أثناء الحفظ', 'error');
        return;
      }

      notifyContentUpdated();
      setDataAr(nextArData);
      setDataEn(nextEnData);
      setEditingProject(null);
      setEditIndex(-1);
      setCurrentStep(1);
      toast('✓ تم تحديث المشروع عربي وإنجليزي بنجاح', 'success');
    } catch {
      toast('مشكلة في الاتصال بالشبكة', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    setEditingProject(createEmptyProject());
    setEditIndex(-1);
    setCurrentStep(1);
  };

  const handleEdit = (project: AdminProject, index: number) => {
    setEditingProject({
      ...project,
      gallery: project.gallery || [],
      stats: project.stats || [],
      details: project.details || [],
    });
    setEditIndex(index);
    setCurrentStep(1);
  };

  const handleDelete = (index: number) => {
    if (!dataAr || !confirm('هل أنت متأكد من حذف هذا المشروع نهائياً؟')) return;
    const newItems = [...mergedProjects];
    newItems.splice(index, 1);
    void handleSaveAll(newItems);
  };

  const handleProjectSubmit = () => {
    if (!dataAr || !editingProject) return;

    const sanitizedProject = sanitizeProject(editingProject);

    if (!sanitizedProject.title) {
      toast('اسم المشروع بالعربية مطلوب', 'error');
      setCurrentStep(2);
      return;
    }
    if (!sanitizedProject.titleEn) {
      toast('اسم المشروع بالإنجليزية مطلوب', 'error');
      setCurrentStep(2);
      return;
    }
    if (!sanitizedProject.description) {
      toast('وصف المشروع بالعربية مطلوب', 'error');
      setCurrentStep(2);
      return;
    }
    if (!sanitizedProject.descriptionEn) {
      toast('وصف المشروع بالإنجليزية مطلوب', 'error');
      setCurrentStep(2);
      return;
    }
    if ((sanitizedProject.location || sanitizedProject.locationEn) && (!sanitizedProject.location || !sanitizedProject.locationEn)) {
      toast('أدخل الموقع بالعربية والإنجليزية معاً', 'error');
      setCurrentStep(2);
      return;
    }
    if (sanitizedProject.stats.some((stat) => !stat.label || !stat.labelEn || !stat.value)) {
      toast('كل إحصائية تحتاج اسم عربي واسم إنجليزي وقيمة', 'error');
      setCurrentStep(2);
      return;
    }
    if (sanitizedProject.details.some((detail) => !detail.text || !detail.textEn)) {
      toast('كل ميزة تحتاج نصاً عربياً ونصاً إنجليزياً', 'error');
      setCurrentStep(2);
      return;
    }
    if (!sanitizedProject.cover_url) {
      toast('الصورة الرئيسية مطلوبة', 'error');
      setCurrentStep(1);
      return;
    }

    const finalProject: AdminProject = {
      ...sanitizedProject,
      slug: slugify(sanitizedProject.titleEn),
    };

    const newItems = [...mergedProjects];
    if (editIndex > -1) {
      newItems[editIndex] = finalProject;
    } else {
      newItems.push(finalProject);
    }

    void handleSaveAll(newItems);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border border-gold/10"
          />
        </div>
        <p className="mt-8 text-sm font-mono uppercase tracking-[0.2em] text-white/40 animate-pulse">
          Initializing Assets...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <h2 className="text-2xl font-bold tracking-tight text-white">معرض المشاريع</h2>
          </div>
          <p className="max-w-md text-sm text-white/30">
            المودال الآن يراجع ويحفظ بيانات المشروع بالعربية والإنجليزية معاً بما يشمل الاسم، الموقع، الوصف، الإحصائيات، والمميزات.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="group relative flex items-center gap-3 overflow-hidden rounded-[2rem] bg-gold px-8 py-4 font-bold text-rich-black shadow-[0_0_30px_rgba(241,213,130,0.15)] transition-all hover:bg-white hover:shadow-gold/25"
        >
          <div className="absolute inset-0 translate-y-full bg-white/40 transition-transform duration-500 group-hover:translate-y-0" />
          <Plus className="relative z-10 h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
          <span className="relative z-10">إضافة تحفة معمارية</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {mergedProjects.map((project, idx) => (
            <motion.div
              key={project.slug + idx}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full flex-col overflow-hidden rounded-[3rem] border border-white/5 glass-panel transition-all duration-700 hover:border-gold/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={project.cover_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070'}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />

                <div className="absolute right-6 top-6 flex gap-3 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(project, idx)}
                    className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-2xl transition-all hover:scale-110 hover:bg-gold hover:text-rich-black active:scale-95"
                    title="تعديل المشروع"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-2xl transition-all hover:scale-110 hover:bg-red-500/80 active:scale-95"
                    title="حذف المشروع"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-3 py-1.5 backdrop-blur-lg">
                  <MapPin className="h-3 w-3 text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                    {project.location}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <div className="mb-6">
                  <h3 className="mb-1 text-xl font-bold text-white transition-colors duration-500 group-hover:text-gold">
                    {project.title}
                  </h3>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/25">{project.titleEn}</p>
                  <p className="line-clamp-2 text-sm font-light leading-relaxed text-white/40">
                    {project.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex flex-col">
                    <span className="mb-1 text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">
                      Architecture ID
                    </span>
                    <span className="text-[10px] font-mono tracking-wider text-gold/40">
                      RES:{project.slug.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition-colors group-hover:border-gold/20">
                    <Building2 className="h-4 w-4 text-white/20 transition-colors group-hover:text-gold/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {mergedProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[4rem] border-2 border-dashed border-white/5 bg-white/2 py-32">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-white/5 bg-white/5">
            <LayoutGrid className="h-10 w-10 text-white/10" />
          </div>
          <p className="text-xl font-bold uppercase tracking-wide text-white/20">No Projects Detected</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/10">
            Start by adding your first iconic masterpiece
          </p>
        </div>
      )}

      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-rich-black/95"
              onClick={() => !saving && setEditingProject(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="relative flex h-full w-full flex-col overflow-hidden bg-rich-black shadow-[0_0_100px_rgba(0,0,0,0.5)] md:h-[90vh] md:max-w-5xl md:rounded-[3.5rem] md:border md:border-white/10"
            >
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4 shrink-0 md:px-8 md:py-5">
                <div className="flex items-center rounded-full border border-white/5 bg-white/5 p-1">
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 transition-all duration-500 ${currentStep === 1 ? 'bg-gold text-rich-black shadow-lg shadow-gold/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    onClick={() => setCurrentStep(1)}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-xs font-bold">الوسائط والصور</span>
                  </div>
                  <div
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 transition-all duration-500 ${currentStep === 2 ? 'bg-gold text-rich-black shadow-lg shadow-gold/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    onClick={() => {
                      if (editingProject.cover_url) setCurrentStep(2);
                      else toast('يرجى رفع صورة الغلاف أولاً', 'error');
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-xs font-bold">تفاصيل المشروع</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  disabled={saving}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all duration-300 hover:bg-red-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto overscroll-contain p-6 md:p-10">
                <AnimatePresence mode="wait">
                  {currentStep === 1 ? (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8 pb-10 md:space-y-12"
                    >
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-4 w-4 text-gold/60" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 md:text-xs">
                            الغلاف الرئيسي
                          </h4>
                        </div>
                        <SmartUploader
                          value={editingProject.cover_url ? [editingProject.cover_url] : []}
                          onChange={(urls) => setEditingProject({ ...editingProject, cover_url: urls[0] || '' })}
                          multiple={false}
                          label="ارفع الغلاف الرئيسي (4K)"
                        />
                      </div>

                      <div className="space-y-4 border-t border-white/5 pt-8 md:space-y-6">
                        <div className="flex items-center gap-3">
                          <LayoutGrid className="h-4 w-4 text-white/20" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 md:text-xs">
                            معرض الصور
                          </h4>
                        </div>
                        <SmartUploader
                          value={editingProject.gallery || []}
                          onChange={(urls) => setEditingProject({ ...editingProject, gallery: urls })}
                          multiple={true}
                          label="إضافة صور للمعرض"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-10"
                    >
                      <div className="space-y-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 md:p-8">
                        <div className="mb-2 flex items-center gap-3 border-b border-white/5 pb-4">
                          <FileText className="h-4 w-4 text-gold/60" />
                          <h4 className="text-xs font-bold uppercase tracking-widest text-white">المعلومات الأساسية</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                              اسم المشروع (بالعربية) <span className="text-red-400">*</span>
                            </label>
                            <input
                              value={editingProject.title}
                              placeholder="مثال: برج خليفة"
                              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/10 focus:border-gold/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                              اسم المشروع (بالإنجليزية) <span className="text-red-400">*</span>
                            </label>
                            <input
                              value={editingProject.titleEn}
                              placeholder="e.g. Burj Khalifa"
                              onChange={(e) => {
                                const titleEn = e.target.value;
                                setEditingProject({
                                  ...editingProject,
                                  titleEn,
                                  slug: slugify(titleEn),
                                });
                              }}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/10 focus:border-gold/50"
                              dir="ltr"
                            />
                            <p className="text-[9px] text-white/30">يتم إنشاء الرابط تلقائياً من الاسم الإنجليزي.</p>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                              رابط المشروع (Slug) <span className="text-red-400">*</span>
                            </label>
                            <input
                              value={editingProject.slug}
                              readOnly
                              className="w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 font-mono text-sm text-gold/70 outline-none"
                              dir="ltr"
                            />
                            <p className="text-[9px] text-white/30">يتولد تلقائياً من اسم المشروع بالإنجليزية.</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/50">الموقع بالعربية</label>
                              <input
                                value={editingProject.location}
                                placeholder="مثال: دبي، الإمارات"
                                onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/10 focus:border-gold/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/50">Location in English</label>
                              <input
                                value={editingProject.locationEn}
                                placeholder="e.g. Dubai, UAE"
                                onChange={(e) => setEditingProject({ ...editingProject, locationEn: e.target.value })}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/10 focus:border-gold/50"
                                dir="ltr"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                              وصف المشروع بالعربية <span className="text-red-400">*</span>
                            </label>
                            <textarea
                              rows={5}
                              value={editingProject.description}
                              placeholder="اكتب وصفاً جذاباً للمشروع..."
                              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/10 focus:border-gold/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                              Project Description in English <span className="text-red-400">*</span>
                            </label>
                            <textarea
                              rows={5}
                              value={editingProject.descriptionEn}
                              placeholder="Write the English project description..."
                              onChange={(e) => setEditingProject({ ...editingProject, descriptionEn: e.target.value })}
                              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/10 focus:border-gold/50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 md:p-8">
                        <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-gold/60" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">إحصاءات المشروع</h4>
                          </div>
                          <button
                            onClick={() =>
                              setEditingProject({
                                ...editingProject,
                                stats: [...editingProject.stats, { label: '', labelEn: '', value: '' }],
                              })
                            }
                            className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-[10px] font-bold text-gold transition-colors hover:bg-gold hover:text-rich-black"
                          >
                            <Plus className="h-3 w-3" /> إضافة إحصائية
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {editingProject.stats.map((stat, sIdx) => (
                            <div
                              key={sIdx}
                              className="relative space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-gold/30"
                            >
                              <button
                                onClick={() =>
                                  setEditingProject({
                                    ...editingProject,
                                    stats: editingProject.stats.filter((_, i) => i !== sIdx),
                                  })
                                }
                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white shadow-lg transition-all hover:bg-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>

                              <input
                                value={stat.label}
                                placeholder="الاسم بالعربية"
                                onChange={(e) => {
                                  const newStats = [...editingProject.stats];
                                  newStats[sIdx] = { ...newStats[sIdx], label: e.target.value };
                                  setEditingProject({ ...editingProject, stats: newStats });
                                }}
                                className="w-full rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold/40"
                              />

                              <input
                                value={stat.labelEn}
                                placeholder="Label in English"
                                onChange={(e) => {
                                  const newStats = [...editingProject.stats];
                                  newStats[sIdx] = { ...newStats[sIdx], labelEn: e.target.value };
                                  setEditingProject({ ...editingProject, stats: newStats });
                                }}
                                className="w-full rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-gold/40"
                                dir="ltr"
                              />

                              <input
                                value={stat.value}
                                placeholder="القيمة / Value"
                                onChange={(e) => {
                                  const newStats = [...editingProject.stats];
                                  newStats[sIdx] = { ...newStats[sIdx], value: e.target.value };
                                  setEditingProject({ ...editingProject, stats: newStats });
                                }}
                                className="w-full rounded-lg border border-gold/20 bg-gold/10 px-3 py-2 text-center text-sm font-bold text-gold outline-none transition-colors focus:border-gold/50"
                                dir="ltr"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6 rounded-[2rem] border border-gold/10 bg-gold/[0.02] p-6 md:p-8">
                        <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-4 w-4 text-gold/60" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">المميزات التفصيلية</h4>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {editingProject.details.map((detail, dIdx) => (
                            <div
                              key={dIdx}
                              className="grid grid-cols-[40px_1fr] gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:border-gold/20 md:grid-cols-[40px_1fr_1fr_40px]"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                                <span className="text-[10px] font-mono font-bold text-gold">{dIdx + 1}</span>
                              </div>

                              <input
                                value={detail.text}
                                placeholder="الميزة بالعربية"
                                onChange={(e) => {
                                  const newDetails = [...editingProject.details];
                                  newDetails[dIdx] = { ...newDetails[dIdx], text: e.target.value };
                                  setEditingProject({ ...editingProject, details: newDetails });
                                }}
                                className="w-full rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/20 focus:border-gold/40"
                              />

                              <input
                                value={detail.textEn}
                                placeholder="Feature in English"
                                onChange={(e) => {
                                  const newDetails = [...editingProject.details];
                                  newDetails[dIdx] = { ...newDetails[dIdx], textEn: e.target.value };
                                  setEditingProject({ ...editingProject, details: newDetails });
                                }}
                                className="w-full rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/20 focus:border-gold/40"
                                dir="ltr"
                              />

                              <button
                                onClick={() =>
                                  setEditingProject({
                                    ...editingProject,
                                    details: editingProject.details.filter((_, i) => i !== dIdx),
                                  })
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/20 transition-colors hover:bg-red-400/10 hover:text-red-400"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() =>
                              setEditingProject({
                                ...editingProject,
                                details: [...editingProject.details, { text: '', textEn: '' }],
                              })
                            }
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.01] py-4 text-xs font-bold text-white/30 transition-all hover:border-gold/30 hover:bg-gold/5 hover:text-gold"
                          >
                            <Plus className="h-4 w-4" /> إضافة ميزة جديدة
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-white/5 bg-white/[0.01] px-6 py-4 md:flex-row md:px-8">
                <div className="hidden gap-4 md:flex">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 text-xs font-bold text-white/30 transition-colors hover:text-white"
                  >
                    إلغاء
                  </button>
                </div>
                <div className="flex w-full gap-3 md:w-auto">
                  {currentStep === 2 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 md:flex-none"
                    >
                      <ArrowRight className="h-4 w-4" />
                      الرجوع
                    </button>
                  )}
                  {currentStep === 1 ? (
                    <button
                      onClick={() => (editingProject.cover_url ? setCurrentStep(2) : toast('ارفع صورة الغلاف', 'error'))}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3 text-sm font-bold text-rich-black shadow-lg shadow-gold/10 transition-all hover:bg-white hover:shadow-gold/20 md:flex-none"
                    >
                      التالي: التفاصيل
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleProjectSubmit}
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-10 py-3 text-sm font-bold text-rich-black shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:opacity-50 md:flex-none"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      حفظ ونشر
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
