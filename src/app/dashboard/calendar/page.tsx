'use client';
import { Calendar } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Calendário" eyebrow="Visão temporal" icon={<Calendar className="h-6 w-6" />} description="Calendário unificado de visitas, plantões e reuniões." />;
}
