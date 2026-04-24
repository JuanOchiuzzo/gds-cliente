'use client';
import { UsersRound } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Equipe" eyebrow="Corretores" icon={<UsersRound className="h-6 w-6" />} description="Performance, metas e ranking dos corretores." />;
}
