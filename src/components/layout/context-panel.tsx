'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { findNavItem } from './nav-config';
import { cn } from '@/lib/utils';
import { slideUpSmall } from '@/lib/motion';

export function ContextPanel() {
  const pathname = usePathname();
  const item = findNavItem(pathname);
  const content = getPanelContent(pathname);

  return (
    <aside
      className={cn(
        'hidden xl:flex flex-col fixed left-[72px] top-0 bottom-0 z-30 w-[260px]',
        'bg-surface-0/75 backdrop-blur-xl border-r border-white/[0.08]'
      )}
    >
      <div className="h-16 flex items-center px-5 border-b border-white/[0.08]">
        <AnimatePresence mode="wait">
          <motion.div
            key={item?.href}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5"
          >
            {item && <item.icon className="w-4 h-4 text-solar" />}
            <span className="font-display text-[20px] text-text">
              {item?.label || 'GDS'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={slideUpSmall}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -4 }}
            className="space-y-6"
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}

function getPanelContent(pathname: string) {
  const map: Record<string, React.ReactNode> = {
    '/dashboard': <PanelSection title="Seu dia" items={[
      'Revise a fila de plantão',
      'Confirme visitas de hoje',
      'Fale com leads quentes',
      'Registre follow-ups',
    ]} />,
    '/dashboard/wallet': <PanelSection title="Sua carteira" items={[
      'Clientes privados a você',
      'Organize por temperatura',
      'Tarefas com prazo',
      'Converta frio → morno',
    ]} />,
    '/dashboard/leads': <PanelSection title="Leads" items={[
      'Filtre por stage ou origem',
      'Hover para ações rápidas',
      'Score IA prioriza hot',
      'Drawer com detalhes',
    ]} />,
    '/dashboard/stands': <PanelSection title="Stands" items={[
      'Grid 3D com tilt',
      'Toggle Grid ↔ Mapa',
      'Progresso vendas/meta',
      'Click abre detalhe',
    ]} />,
    '/dashboard/plantao': <PanelSection title="Plantão" items={[
      'Entre na fila por stand',
      'Acompanhe em tempo real',
      'Status: aguardando/atendendo',
      'Chame o próximo',
    ]} />,
    '/dashboard/appointments': <PanelSection title="Agendamentos" items={[
      'Timeline de visitas',
      'Voucher compartilhável',
      'Registre resultado visita',
      'Status das visitas',
    ]} />,
    '/dashboard/calendar': <PanelSection title="Calendário" items={[
      'Visão semanal',
      'Tipos: visita/reunião/plantão',
      'Cor customizável',
      'Click vago para criar',
    ]} />,
    '/dashboard/chat': <PanelSection title="Chat" items={[
      '3 canais: geral/vendas/gerentes',
      'Mensagens em tempo real',
      'Shift+Enter pula linha',
    ]} />,
    '/dashboard/agents': <PanelSection title="Ranking" items={[
      'Top 3 pódio',
      'Receita e conversão',
      'Status online/busy',
    ]} />,
    '/dashboard/reports': <PanelSection title="Relatórios" items={[
      'KPIs macro',
      'Segmente por stand/agente',
      'Charts em tempo real',
    ]} />,
    '/dashboard/ai': <PanelSection title="GDS AI" items={[
      'Resumos da carteira',
      'Próximas ações',
      'Insights contextuais',
    ]} />,
    '/dashboard/team': <PanelSection title="Equipe" items={[
      'Gestão de roles',
      'Admin apenas',
      'Promover/demover',
    ]} />,
    '/dashboard/settings': <PanelSection title="Conta" items={[
      'Foto e perfil',
      'Telefone',
      'Preferências',
    ]} />,
  };
  return map[pathname] || null;
}

function PanelSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-text-faint uppercase tracking-widest mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2 text-[13px] text-text-soft"
          >
            <span className="mt-1.5 w-1 h-4 rounded-full bg-solar flex-shrink-0" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
