'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card variant="glass" padding="xl" className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-bad/15 text-bad border border-bad/30">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl tracking-tight">
          Algo derreteu na forja
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Este módulo encontrou um erro. Tente recarregar ou volte depois.
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          <RotateCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </Card>
    </div>
  );
}
