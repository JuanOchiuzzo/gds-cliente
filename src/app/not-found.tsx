'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-canvas p-6 text-text">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: "url('/brand/gds-mobile-splash.webp')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.55),#08090b_72%)]" />

      <div className="relative z-10 max-w-md text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-solar/30 bg-solar/10 px-3 py-1 text-xs font-semibold uppercase text-white">
          <Sparkles className="h-3 w-3" />
          Rota indisponível
        </div>
        <h1 className="text-[112px] font-semibold leading-none text-solar-gradient">
          404
        </h1>
        <p className="mt-2 text-2xl font-semibold text-text">Página não encontrada.</p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-text-soft">
          Volte para o dashboard e continue a operação pelo app.
        </p>
        <Link href="/dashboard" className="inline-block mt-8">
          <Button variant="solar" size="lg">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
