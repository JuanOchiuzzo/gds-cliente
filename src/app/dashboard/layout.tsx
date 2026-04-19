'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Topbar } from '@/components/layout/topbar';
import { AIFab } from '@/components/ai-fab';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--sf-bg)]">
      <Sidebar />
      <div className="lg:ml-64">
        <Topbar />
        <main className="px-4 lg:px-6 py-4 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
