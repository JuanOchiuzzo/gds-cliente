'use client';
import { CalendarCheck } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Agendamentos" eyebrow="Agenda & vouchers" icon={<CalendarCheck className="h-6 w-6" />} description="Visitas, vouchers compartilháveis e controle de presença." />;
}
