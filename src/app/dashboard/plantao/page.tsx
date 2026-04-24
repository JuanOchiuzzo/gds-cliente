'use client';
import { Clock } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Plantão" eyebrow="Fila ao vivo" icon={<Clock className="h-6 w-6" />} description="Fila de atendimento em tempo real no stand." />;
}
