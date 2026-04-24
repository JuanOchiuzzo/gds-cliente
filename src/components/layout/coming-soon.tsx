'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Hammer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

export function ComingSoon({
  title,
  eyebrow,
  description,
  icon,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div>
      <PageHeader
        eyebrow={eyebrow ?? 'Em forja'}
        title={title}
        description={description ?? 'Este módulo está sendo forjado com o novo design language.'}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card variant="glass" padding="xl" className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-20 -right-10 h-[240px] w-[240px] rounded-full bg-iris/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-[220px] w-[220px] rounded-full bg-cyanx/15 blur-3xl" />
          </div>

          <div className="flex flex-col items-center py-10 text-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(157,140,255,0.3),rgba(96,222,255,0.2))] border border-white/10 text-iris-hi">
              {icon ?? <Hammer className="h-6 w-6" />}
              <span className="absolute inset-0 rounded-[20px] border border-iris/20 animate-pulse-ring" />
            </div>
            <h2 className="font-display text-xl tracking-tight text-fg">
              Próximo na forja
            </h2>
            <p className="mt-2 max-w-md text-sm text-fg-muted">
              Estamos reconstruindo esta área com o novo design premium 2026.
              A lógica já existe — estamos apenas polindo a interface.
            </p>
            <div className="mt-6 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-iris animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-iris animate-pulse" style={{ animationDelay: '120ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-iris animate-pulse" style={{ animationDelay: '240ms' }} />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
