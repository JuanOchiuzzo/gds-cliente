import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Monogram } from '@/components/brand/brand';

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-iris/20 blur-[140px]" />
      </div>
      <div className="relative flex flex-col items-center text-center">
        <Monogram size="lg" />
        <h1 className="mt-6 font-display text-7xl tracking-[-0.03em] text-iris-gradient">
          404
        </h1>
        <p className="mt-3 max-w-sm text-sm text-fg-muted">
          A forja não achou essa rota. Talvez ela ainda não tenha sido esculpida.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-[14px] border border-line-strong bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-fg hover:bg-white/[0.08] press"
        >
          <Compass className="h-4 w-4" />
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
