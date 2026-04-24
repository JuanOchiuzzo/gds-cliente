'use client';
import { BarChart3 } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Relatórios" eyebrow="Analytics" icon={<BarChart3 className="h-6 w-6" />} description="Funil, conversão, receita projetada e exportações." />;
}
