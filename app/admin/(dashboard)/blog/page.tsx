'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, FileText, Loader2, Save } from 'lucide-react';

import { ImageUploader } from '@/components/admin/ImageUploader';
import { useToast } from '@/components/admin/ToastProvider';
import { notifyContentUpdated } from '@/lib/content-sync';

export default function BlogManager() {
  const [editingPost, setEditingPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const json = await res.json();
        setPosts(json.data || []);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchPosts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchPosts]);

  const handleCreateNew = () => {
    setEditingPost({
      id: 'new',
      title: '',
      slug: '',
      excerpt: '',
      content: [''],
      tag: '',
      cover_url: '',
      published: false,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!editingPost.title || !editingPost.slug) {
        toast('يجب إدخال العنوان والرابط', 'error');
        setSaving(false);
        return;
      }

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingPost, locale: 'ar' }),
      });

      if (res.ok) {
        notifyContentUpdated();
        toast('تم الحفظ وتحديث الموقع بنجاح', 'success');
        void fetchPosts();
        setEditingPost(null);
      } else {
        toast('حدث خطأ في الحفظ', 'error');
      }
    } catch {
      toast('لا يوجد اتصال بقاعدة البيانات حاليًا', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        notifyContentUpdated();
      }
      toast('تم الحذف', 'success');
      void fetchPosts();
      if (editingPost?.id === id) setEditingPost(null);
    } catch {}
  };

  return (
    <div className="flex min-h-screen flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">إدارة المقالات</h1>
          <p className="text-white/50">أضف، عدّل، وانشر مقالات المدونة</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-bold text-rich-black transition-colors hover:bg-white sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          مقال جديد
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 xl:flex-row">
        <div className="glass-panel flex-[2] overflow-y-auto rounded-[2rem] border border-white/10 p-4 sm:rounded-3xl sm:p-6 lg:p-8">
          {editingPost ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-white sm:text-2xl">تعديل المقال</h2>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-2 font-bold text-white transition-colors hover:bg-gold hover:text-rich-black disabled:opacity-50 sm:w-auto"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  حفظ
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-white/80">عنوان المقال</label>
                    <input
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-white/80">التصنيف (Tag)</label>
                    <input
                      value={editingPost.tag}
                      onChange={(e) => setEditingPost({ ...editingPost, tag: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white focus:border-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-white/80">صورة الغلاف (أو صور المقال)</label>
                  <ImageUploader
                    onUploadSuccess={(urls) => setEditingPost({ ...editingPost, cover_url: urls[0] })}
                    multiple={true}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-white/80">نبذة مختصرة</label>
                  <textarea
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-white/80">
                    محتوى المقال (كل سطر يعتبر فقرة)
                  </label>
                  <textarea
                    value={editingPost.content.join('\n')}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value.split('\n') })}
                    rows={10}
                    className="w-full rounded-xl border border-white/10 bg-rich-black-light px-4 py-3 text-white focus:border-gold/50"
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={editingPost.published}
                      onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                      className="h-5 w-5 accent-gold"
                    />
                    <span className="font-bold text-white">نشر المقال للعامة</span>
                  </label>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-white/30">
              <FileText className="mb-4 h-16 w-16 opacity-50" />
              <p className="text-lg sm:text-xl">اختر مقالًا للتعديل أو أنشئ واحدًا جديدًا</p>
            </div>
          )}
        </div>

        <div className="glass-panel flex-1 overflow-y-auto rounded-[2rem] border border-white/5 p-4 sm:rounded-3xl sm:p-6">
          <h3 className="mb-6 flex justify-between text-sm font-bold uppercase tracking-wider text-white">
            <span>المقالات المحفوظة</span>
            <span className="rounded-lg bg-gold/10 px-2 py-0.5 font-mono text-gold">{posts.length}</span>
          </h3>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-gold" />
              </div>
            ) : posts.length === 0 ? (
              <p className="py-10 text-center text-sm text-white/40">
                لا توجد مقالات، أو لم يتم ربط قاعدة البيانات بعد.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer rounded-2xl border border-white/10 bg-rich-black p-4 transition-all hover:border-gold/30"
                  onClick={() => setEditingPost(post)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1 truncate font-bold text-white transition-colors group-hover:text-gold">
                        {post.title}
                      </div>
                      <div className="truncate text-xs font-mono text-white/40">{post.slug}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-gray-500'}`}
                        title={post.published ? 'منشور' : 'مسودة'}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDelete(post.id);
                        }}
                        className="rounded-lg p-2 text-red-400 opacity-0 transition-opacity hover:bg-red-500/20 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
