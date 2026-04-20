'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard route error', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center py-10">
      <Surface variant="elevated" padding="xl" className="w-full max-w-xl text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-danger" />
        </div>

        <h1 className="mt-5 font-display italic text-3xl text-text tracking-tight">
          Algo falhou ao abrir esta página
        </h1>
        <p className="mt-2 text-sm text-text-soft">
          A navegação foi interrompida no cliente. Você pode tentar recarregar este trecho da
          aplicação sem sair do dashboard.
        </p>

        {error.digest && (
          <p className="mt-3 text-[11px] font-mono text-text-faint">
            erro {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="solar" onClick={reset}>
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: 'outline', size: 'md' }))}
          >
            <Home className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </Surface>
    </div>
  );
}
