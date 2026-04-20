'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, ChevronDown } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  phone: string | null;
  created_at: string;
}

const roles = [
  { value: 'admin', label: 'Administrador', desc: 'Acesso total ao sistema', variant: 'red' as const },
  { value: 'gerente', label: 'Gerente', desc: 'Gerencia stands e equipe', variant: 'violet' as const },
  { value: 'corretor', label: 'Corretor', desc: 'Acesso padrão de vendas', variant: 'cyan' as const },
  { value: 'visualizador', label: 'Visualizador', desc: 'Apenas visualização', variant: 'zinc' as const },
];

export default function TeamPage() {
  const { profile } = useAuth();
  const supabase = getSupabase();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at');
    setUsers((data as UserRow[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const changeRole = async (userId: string, newRole: string) => {
    if (!isAdmin) { toast.error('Apenas administradores podem alterar roles'); return; }
    if (userId === profile?.id && newRole !== 'admin') {
      toast.error('Você não pode remover seu próprio acesso de admin');
      return;
    }

    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) {
      toast.error('Erro ao alterar role');
    } else {
      toast.success('Role atualizado!');
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    }
    setEditingId(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--text)]">Gestão de Equipe</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {/* Roles legend */}
      <motion.div variants={fadeUp}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {roles.map((r) => (
            <div key={r.value} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl whitespace-nowrap">
              <Badge variant={r.variant} className="!text-[9px]">{r.label}</Badge>
              <span className="text-[10px] text-[var(--text-muted)]">{r.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* User list */}
      <motion.div variants={stagger} className="space-y-2">
        {users.map((user) => {
          const roleConfig = roles.find((r) => r.value === user.role) || roles[2];
          const isMe = user.id === profile?.id;

          return (
            <motion.div key={user.id} variants={fadeUp}>
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
                <div className="flex items-center gap-3">
                  <Avatar name={user.full_name} src={user.avatar_url} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--text)] truncate">
                        {user.full_name}
                        {isMe && <span className="text-[10px] text-[var(--text-faint)] ml-1">(você)</span>}
                      </h3>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{user.email}</p>
                    {user.phone && <p className="text-[10px] text-[var(--text-faint)]">{user.phone}</p>}
                  </div>

                  {/* Role selector */}
                  {isAdmin ? (
                    <div className="relative">
                      <button
                        onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                        className="flex items-center gap-1.5"
                      >
                        <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                        <ChevronDown className="w-3 h-3 text-[var(--text-faint)]" />
                      </button>

                      {editingId === user.id && (
                        <div className="absolute right-0 top-full mt-1 z-10 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden">
                          {roles.map((r) => (
                            <button
                              key={r.value}
                              onClick={() => changeRole(user.id, r.value)}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left transition-colors ${
                                user.role === r.value
                                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium'
                                  : 'text-[var(--text-secondary)] hover:bg-[var(--accent-soft)]'
                              }`}
                            >
                              <Badge variant={r.variant} className="!text-[8px]">{r.label}</Badge>
                              <span className="text-[10px] text-[var(--text-faint)]">{r.desc}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {!isAdmin && (
        <GlassCard hover={false} className="!p-4 text-center">
          <Shield className="w-6 h-6 mx-auto text-[var(--text-faint)] mb-2" />
          <p className="text-xs text-[var(--text-muted)]">Apenas administradores podem alterar roles de usuários</p>
        </GlassCard>
      )}
    </motion.div>
  );
}
