'use client';
import { UsersRound } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Time" eyebrow="Organização" icon={<UsersRound className="h-6 w-6" />} description="Organograma, papéis e convites." />;
}
