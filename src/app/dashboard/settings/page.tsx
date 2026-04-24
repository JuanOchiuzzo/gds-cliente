'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  Moon,
  Shield,
  Smartphone,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { PageHeader } from '@/components/layout/page-header';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { cn, getDisplayName } from '@/lib/utils';

export default function SettingsPage() {
  const { profile, signOut } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const supabase = getSupabase();

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, phone: form.phone })
      .eq('id', profile.id);
    setSaving(false);
    if (error) toast.error('Erro ao atualizar.');
    else {
      toast.success('Perfil atualizado.');
      setEditOpen(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Conta" title="Ajustes" description="Perfil, preferências e segurança." />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-4">
            <Avatar name={profile?.full_name} size="lg" dot="ok" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-fg">
                {getDisplayName(profile?.full_name, 'Usuário')}
              </p>
              <p className="truncate text-xs text-fg-muted">{profile?.email}</p>
              {profile?.role && (
                <Badge variant="iris" size="xs" className="mt-1.5 capitalize">{profile.role}</Badge>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              Editar
            </Button>
          </div>
        </Card>
      </motion.section>

      <Section title="Preferências">
        <Row
          icon={<Moon className="h-4 w-4" />}
          label="Tema"
          value="Escuro (nativo)"
        />
        <Row
          icon={<Bell className="h-4 w-4" />}
          label="Notificações"
          value={notifications ? 'Ativas' : 'Desativadas'}
          trailing={
            <button
              onClick={() => setNotifications((v) => !v)}
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                notifications ? 'bg-iris' : 'bg-white/10',
              )}
              aria-label="Alternar notificações"
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                  notifications ? 'left-[22px]' : 'left-0.5',
                )}
              />
            </button>
          }
        />
        <Row icon={<Smartphone className="h-4 w-4" />} label="Instalar como app" value="PWA disponível" />
      </Section>

      <Section title="Conta">
        <Row icon={<Mail className="h-4 w-4" />} label="E-mail" value={profile?.email ?? '—'} />
        <Row icon={<User className="h-4 w-4" />} label="Nome" value={getDisplayName(profile?.full_name, '—')} />
        <Row icon={<Shield className="h-4 w-4" />} label="Segurança" value="Senha protegida" chevron />
      </Section>

      <Section title="Suporte">
        <Row icon={<HelpCircle className="h-4 w-4" />} label="Central de ajuda" chevron />
      </Section>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-6"
      >
        <Button variant="danger" block onClick={() => signOut()}>
          <LogOut className="h-4 w-4" /> Sair da conta
        </Button>
        <p className="mt-3 text-center text-[11px] text-fg-faint">
          StandForge · Forjado para vendedores
        </p>
      </motion.div>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent>
          <SheetHeader title="Editar perfil" />
          <SheetBody>
            <div className="space-y-3">
              <Input label="Nome" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="E-mail" value={profile?.email || ''} disabled />
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={save} loading={saving}>Salvar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-5"
    >
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
        {title}
      </p>
      <Card variant="solid" padding="none" className="divide-y divide-line">
        {children}
      </Card>
    </motion.section>
  );
}

function Row({
  icon,
  label,
  value,
  chevron,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  chevron?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/[0.04] text-fg-soft">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{label}</p>
        {value && <p className="truncate text-xs text-fg-muted">{value}</p>}
      </div>
      {trailing}
      {chevron && <ChevronRight className="h-4 w-4 text-fg-faint" />}
    </div>
  );
}
