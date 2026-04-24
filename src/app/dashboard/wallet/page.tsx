'use client';
import { Wallet } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Carteira" eyebrow="Clientes privados" icon={<Wallet className="h-6 w-6" />} description="Sua carteira privada: temperatura, tarefas e histórico." />;
}
