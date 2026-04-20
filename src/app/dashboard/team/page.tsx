'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { staggerParent, slideUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  phone: string | null;
  created_at: string;
}

const ROLES: {
  value: string;
  label: string;
  desc: string;
  variant: BadgeProps['variant'];
}[] = [
  { value: 'admin', label: 'Admin', desc: 'Acesso total', variant: 'danger' },
  { value: 'gerente', label: 'Gerente', desc: 'Gerencia equipe', variant: 'aurora' },
  { value: 'corretor', label: 'Corretor', desc: 'Vendas padrão', variant: 'info' },
  { value: 'visualizador', label: 'Visualizador', desc: 'Apenas leitura', variant: 'neutral' },
];

export default function TeamPage() {
  const { profile } = useAuth();
  const supabase = getSupabase();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at');
    setUsers((data as UserRow[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const changeRole = async (userId: string, newRole: string) => {
    if (!isAdmin) {
      toast.error('Apenas admin pode alterar roles');
      return;
    }
    if (userId === profile?.id && newRole !== 'admin') {
      toast.error('Você não pode remover seu próprio admin');
      return;
    }
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) toast.error('Erro ao alterar');
    else {
      toast.success('Role atualizado');
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerParent(0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={slideUp}>
        <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Equipe</h1>
        <p className="mt-1 text-sm text-text-soft">
          {users.length} usuário{users.length !== 1 ? 's' : ''} · gestão de permissões
        </p>
      </motion.div>

      {/* Roles legend */}
      <motion.div variants={slideUp}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ROLES.map((r) => (
            <div
              key={r.value}
              className="flex items-center gap-2 px-3 h-9 bg-surface-1 border border-border rounded-md whitespace-nowrap flex-shrink-0"
            >
              <Badge variant={r.variant} size="xs">
                {r.label}
              </Badge>
              <span className="text-[11px] text-text-faint">{r.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={staggerParent(0.03)} className="space-y-2">
        {users.map((user) => {
          const roleConfig = ROLES.find((r) => r.value === user.role) || ROLES[2];
          const isMe = user.id === profile?.id;

          return (
            <motion.div key={user.id} variants={slideUp}>
              <Surface variant="flat" padding="md">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={user.full_name}
                    src={user.avatar_url}
                    size="md"
                    ring={isMe ? 'solar' : 'none'}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-text truncate">
                        {user.full_name}
                      </h3>
                      {isMe && (
                        <span className="text-[10px] text-solar font-mono">você</span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-faint truncate">{user.email}</p>
                  </div>

                  {isAdmin ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-1.5 px-2 h-8 rounded-md hover:bg-surface-2 transition-colors">
                          <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                          <ChevronDown className="w-3 h-3 text-text-faint" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-56 p-1">
                        {ROLES.map((r) => (
                          <button
                            key={r.value}
                            onClick={() => changeRole(user.id, r.value)}
                            className={cn(
                              'w-full flex items-start gap-2 px-3 py-2 rounded-sm text-left transition-colors',
                              user.role === r.value
                                ? 'bg-solar/10 text-solar'
                                : 'text-text-soft hover:bg-surface-2'
                            )}
                          >
                            <Badge variant={r.variant} size="xs">
                              {r.label}
                            </Badge>
                            <span className="text-[11px] text-text-faint flex-1">
                              {r.desc}
                            </span>
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                  )}
                </div>
              </Surface>
            </motion.div>
          );
        })}
      </motion.div>

      {!isAdmin && (
        <Surface variant="flat" padding="md" className="text-center">
          <Shield className="w-5 h-5 mx-auto text-text-faint mb-2" />
          <p className="text-xs text-text-soft">
            Apenas administradores podem alterar roles
          </p>
        </Surface>
      )}
    </motion.div>
  );
}
