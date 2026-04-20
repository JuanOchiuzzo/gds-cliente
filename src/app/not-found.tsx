'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-canvas text-text relative overflow-hidden flex items-center justify-center p-6">
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(245, 158, 11, 0.15), transparent 60%)',
              'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(167, 139, 250, 0.12), transparent 60%)',
              'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(245, 158, 11, 0.15), transparent 60%)',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-solar/30 bg-solar/5 text-solar text-xs font-mono uppercase tracking-widest mb-6">
          <Sparkles className="w-3 h-3" />
          Fora de órbita
        </div>
        <h1 className="font-display italic text-[120px] leading-none tracking-tighter text-solar-gradient">
          404
        </h1>
        <p className="font-display italic text-2xl text-text mt-2">Esta rota se perdeu no espaço.</p>
        <p className="text-sm text-text-soft mt-3 max-w-sm mx-auto">
          A página que você procura não existe ou foi movida para outra constelação.
        </p>
        <Link href="/dashboard" className="inline-block mt-8">
          <Button variant="solar" size="lg">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
