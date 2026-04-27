'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/ToastProvider';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (email !== 'elshihry2027@gmail.com') {
      toast('غير مصرح لك بالدخول', 'error');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast(error.message, 'error');
      setLoading(false);
    } else {
      toast('تم تسجيل الدخول بنجاح');
      router.push('/admin' as any);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden bg-rich-black z-0">
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gold/10 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-gold/10 blur-[120px] rounded-full z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-10 rounded-[2.5rem] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 mb-6 overflow-hidden p-2">
            <Image
              src="/logo.webp"
              alt="El Shihry Logo"
              width={80}
              height={80}
              loading="eager"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">تسجيل الدخول</h1>
          <p className="text-white/50 text-sm">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-right text-white">
            <label className="text-sm font-medium text-white/80 pr-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-rich-black-light border-2 text-right border-white/10 rounded-xl py-3 px-12 text-white focus:border-gold/50 focus:outline-none transition-colors"
                placeholder="admin@example.com"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2 text-right text-white">
            <label className="text-sm font-medium text-white/80 pr-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-rich-black-light border-2 border-white/10 rounded-xl py-3 px-12 text-white focus:border-gold/50 focus:outline-none transition-colors text-right"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-rich-black font-bold py-4 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-rich-black border-t-transparent animate-spin" />
            ) : (
              <>
                 <span>دخول</span>
                 <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
