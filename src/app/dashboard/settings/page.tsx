'use client';

import { motion } from 'framer-motion';
import { User, Bell, Palette, Link2, Shield, Smartphone } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function SettingsPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-[var(--sf-text-primary)]">Configurações</h1>
        <p className="text-sm text-[var(--sf-text-tertiary)] mt-1">Gerencie sua conta e preferências</p>
      </motion.div>

      {/* Profile */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Perfil</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center text-xl font-bold text-cyan-200 border border-[var(--sf-border)]">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--sf-text-primary)]">Administrador</p>
                <p className="text-xs text-[var(--sf-text-tertiary)]">admin@standforge.com</p>
              </div>
              <Button variant="secondary" size="sm" className="ml-auto">Editar</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--sf-text-tertiary)]">Nome</label>
                <input defaultValue="Administrador" className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--sf-text-tertiary)]">Email</label>
                <input defaultValue="admin@standforge.com" className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Notificações</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Nova venda realizada', desc: 'Receba notificação quando uma venda for concluída', default: true },
              { label: 'Novo lead capturado', desc: 'Alerta quando um novo lead entrar no sistema', default: true },
              { label: 'Lead sem follow-up', desc: 'Aviso quando um lead ficar 3+ dias sem contato', default: true },
              { label: 'Meta atingida', desc: 'Celebração quando um stand atingir a meta mensal', default: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <div>
                  <p className="text-sm text-[var(--sf-text-primary)]">{item.label}</p>
                  <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500/60" />
                </label>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Integrations */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Integrações</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'WhatsApp Business', status: 'Conectado', connected: true },
              { name: 'Google Calendar', status: 'Não conectado', connected: false },
              { name: 'Supabase', status: 'Conectado', connected: true },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <div>
                  <p className="text-sm text-[var(--sf-text-primary)]">{item.name}</p>
                  <p className={`text-xs mt-0.5 ${item.connected ? 'text-emerald-400' : 'text-[var(--sf-text-tertiary)]'}`}>{item.status}</p>
                </div>
                <Button variant={item.connected ? 'secondary' : 'primary'} size="sm">
                  {item.connected ? 'Configurar' : 'Conectar'}
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* PWA Install */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false} glow="violet">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Instalar App</h3>
          </div>
          <p className="text-sm text-[var(--sf-text-secondary)] mb-3">
            Instale o StandForge como app no seu celular para acesso rápido e experiência nativa.
          </p>
          <Button variant="neon" size="sm">Instalar PWA</Button>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
