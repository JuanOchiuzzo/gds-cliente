'use client';
import { Building2 } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Stands" eyebrow="Rede nacional" icon={<Building2 className="h-6 w-6" />} description="Mapa, status e performance de cada stand." />;
}
