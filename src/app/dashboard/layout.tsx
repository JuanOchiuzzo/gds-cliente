'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Topbar } from '@/components/layout/topbar';
import { AIFab } from '@/components/ai-fab';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  // Only show full-screen spinner on very first load
  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[var(--sf-bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[100dvh] bg-[var(--sf-bg)]">
      <Sidebar />
      <div className="lg:ml-[260px]">
        <Topbar />
        <main className="px-4 lg:px-6 py-4 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
      <AIFab />
    </div>
  );
}
