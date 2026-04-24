'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shell } from '@/components/layout/shell';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Monogram } from '@/components/brand/brand';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Monogram size="lg" />
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-iris animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-iris animate-pulse" style={{ animationDelay: '120ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-iris animate-pulse" style={{ animationDelay: '240ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <Shell>{children}</Shell>
    </TooltipProvider>
  );
}
