'use client';
import { MessagesSquare } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Chat" eyebrow="Comunicação interna" icon={<MessagesSquare className="h-6 w-6" />} description="Canais por stand, mensagens diretas e arquivos." />;
}
