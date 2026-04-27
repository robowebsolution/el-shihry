'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AdminDashboardShellProps {
  children: React.ReactNode;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isSidebarVisible = isSidebarOpen;

  useEffect(() => {
    if (!isMobile) return;

    document.body.style.overflow = isSidebarVisible ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isSidebarVisible, pathname]);

  return (
    <div className="min-h-screen bg-rich-black">
      {!isMobile && !isSidebarVisible && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed right-4 top-4 z-[60] hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-rich-black/90 text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-colors hover:bg-white/10 md:inline-flex"
          aria-label="Open sidebar"
          aria-expanded={false}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <header className="sticky top-0 z-40 border-b border-white/8 bg-rich-black/90 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold/80">El Shihry</p>
            <p className="text-sm text-white/45">Dashboard</p>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            aria-label={isSidebarVisible ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isSidebarVisible}
          >
            {isSidebarVisible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {isMobile && isSidebarVisible && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={isSidebarVisible} onClose={() => setIsSidebarOpen(false)} />

      <main
        className={cn(
          'min-h-screen bg-rich-black-light/30 transition-[margin] duration-300',
          'pb-6 md:pb-0',
          isSidebarVisible ? 'md:mr-72' : 'md:mr-0'
        )}
      >
        {children}
      </main>
    </div>
  );
}
