'use client';
import { Settings } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Ajustes" eyebrow="Preferências" icon={<Settings className="h-6 w-6" />} description="Perfil, notificações, tema e segurança." />;
}
