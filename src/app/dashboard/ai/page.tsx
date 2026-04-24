'use client';
import { Sparkles } from 'lucide-react';
import { ComingSoon } from '@/components/layout/coming-soon';
export default function Page() {
  return <ComingSoon title="Forge AI" eyebrow="Inteligência contextual" icon={<Sparkles className="h-6 w-6" />} description="A IA que analisa seus leads, prevê temperatura e sugere ações." />;
}
