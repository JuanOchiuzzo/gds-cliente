'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Phone, MessageCircle, Flame, Thermometer, Snowflake,
  ListTodo, ChevronRight, Check, Clock, CalendarPlus, FileText, PhoneCall,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { walletClients, clientTasks } from '@/lib/mock-data';
import { formatCurrency, generateWhatsAppLink, timeAgo } from '@/lib/utils';
import { format } from 'date-fns';
import type { WalletClient, ClientTask, ClientTemperature } from '@/types';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const tempConfig: Record<ClientTemperature, { icon: React.ReactNode; label: string; color: string; badge: 'red' | 'amber' | 'cyan' }> = {
  quente: { icon: <Flame className="w-4 h-4" />, label: 'Quente', color: 'text-orange-500', badge: 'red' },
  morno: { icon: <Thermometer className="w-4 h-4" />, label: 'Morno', color: 'text-amber-500', badge: 'amber' },
  frio: { icon: <Snowflake className="w-4 h-4" />, label: 'Frio', color: 'text-blue-400', badge: 'cyan' },
};

const taskTypeConfig: Record<string, { icon: string; label: string }> = {
  ligar: { icon: '📞', label: 'Ligar' },
  agendar_visita: { icon: '📅', label: 'Agendar Visita' },
  enviar_proposta: { icon: '📄', label: 'Enviar Proposta' },
  follow_up: { icon: '🔄', label: 'Follow-up' },
  outro: { icon: '📋', label: 'Outro' },
};

export default function WalletPage() {
  const [search, setSearch] = useState('');
  const [tempFilter, setTempFilter] = useState<'all' | ClientTemperature>('all');
  const [selectedClient, setSelectedClient] = useState<WalletClient | null>(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [taskForClient, setTaskForClient] = useState<WalletClient | null>(null);
  const [tab, setTab] = useState<'clientes' | 'tarefas'>('clientes');

  const filtered = useMemo(() => {
    return walletClients.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
      const matchTemp = tempFilter === 'all' || c.temperature === tempFilter;
      return matchSearch && matchTemp;
    });
  }, [search, tempFilter]);

  const tempCounts = useMemo(() => {
    const counts = { all: walletClients.length, quente: 0, morno: 0, frio: 0 };
    walletClients.forEach((c) => { counts[c.temperature]++; });
    return counts;
  }, []);

  const clientTasksMap = useMemo(() => {
    const map: Record<string, ClientTask[]> = {};
    clientTasks.forEach((t) => {
      if (!map[t.client_id]) map[t.client_id] = [];
      map[t.client_id].push(t);
    });
    return map;
  }, []);

  const pendingTasks = clientTasks.filter((t) => !t.completed).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  const completedTasks = clientTasks.filter((t) => t.completed);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Minha Carteira</h1>
          <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">Seus clientes pessoais · Dados visíveis só para você</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNewClient(true)}>
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Cliente</span>
        </Button>
      </motion.div>

      {/* Tab switcher */}
      <motion.div variants={fadeUp} className="flex gap-1 p-1 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
        {(['clientes', 'tarefas'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${
              tab === t
                ? 'bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)] shadow-sm border border-[var(--sf-border)]'
                : 'text-[var(--sf-text-tertiary)]'
            }`}
          >
            {t === 'clientes' ? <><Flame className="w-3.5 h-3.5" /> Clientes ({walletClients.length})</> : <><ListTodo className="w-3.5 h-3.5" /> Tarefas ({pendingTasks.length})</>}
          </button>
        ))}
      </motion.div>

      {/* ── TAB: CLIENTES ── */}
      {tab === 'clientes' && (
        <>
          {/* Search + Temperature filter */}
          <motion.div variants={fadeUp} className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'quente', 'morno', 'frio'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTempFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    tempFilter === t
                      ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300'
                      : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
                  }`}
                >
                  {t === 'all' ? 'Todos' : <><span className={tempConfig[t].color}>{tempConfig[t].icon}</span> {tempConfig[t].label}</>}
                  <span className="text-[10px] opacity-60">{tempCounts[t]}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Client list */}
          <motion.div variants={stagger} className="space-y-2">
            {filtered.map((client) => {
              const tasks = clientTasksMap[client.id] || [];
              const pendingCount = tasks.filter((t) => !t.completed).length;
              return (
                <motion.div key={client.id} variants={fadeUp}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedClient(client)}
                    className="p-3.5 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{client.name}</h3>
                          <span className={tempConfig[client.temperature].color}>{tempConfig[client.temperature].icon}</span>
                        </div>
                        <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">
                          {client.interested_product || 'Sem produto definido'}
                        </p>
                        {pendingCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-violet-600 dark:text-violet-400 font-medium mt-0.5">
                            <ListTodo className="w-3 h-3" /> {pendingCount} tarefa{pendingCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <a href={generateWhatsAppLink(client.phone, `Olá ${client.name.split(' ')[0]}!`)} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl text-green-600 dark:text-green-400 active:bg-green-500/10">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a href={`tel:${client.phone}`} onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl text-blue-600 dark:text-cyan-400 active:bg-blue-500/10 dark:active:bg-cyan-500/10">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {/* ── TAB: TAREFAS ── */}
      {tab === 'tarefas' && (
        <motion.div variants={stagger} className="space-y-2">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-12 text-[var(--sf-text-tertiary)]">
              <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma tarefa pendente</p>
            </div>
          ) : (
            pendingTasks.map((task) => {
              const isOverdue = new Date(task.due_date) < new Date(2026, 3, 19, 12);
              const cfg = taskTypeConfig[task.type];
              return (
                <motion.div key={task.id} variants={fadeUp}>
                  <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-colors ${
                    isOverdue
                      ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
                      : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
                  }`}>
                    <span className="text-lg">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--sf-text-primary)]">{task.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[var(--sf-text-tertiary)]">{task.client_name}</span>
                        <span className="text-[10px] text-[var(--sf-text-muted)]">·</span>
                        <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-[var(--sf-text-tertiary)]'}`}>
                          {format(new Date(task.due_date), 'dd/MM HH:mm')}
                          {isOverdue && ' ⚠️'}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}

          {completedTasks.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-[var(--sf-text-muted)] font-medium mb-2 px-0.5">Concluídas</p>
              {completedTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl opacity-50">
                  <span className="text-lg">{taskTypeConfig[task.type].icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-[var(--sf-text-tertiary)] line-through">{task.description}</p>
                    <p className="text-[10px] text-[var(--sf-text-muted)]">{task.client_name}</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Client Detail Modal ── */}
      <Modal open={!!selectedClient} onClose={() => setSelectedClient(null)} title={selectedClient?.name || ''} size="lg">
        {selectedClient && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={selectedClient.name} size="lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--sf-text-primary)]">{selectedClient.name}</h3>
                <p className="text-sm text-[var(--sf-text-tertiary)]">{selectedClient.phone}</p>
                <p className="text-sm text-[var(--sf-text-tertiary)]">{selectedClient.email}</p>
              </div>
              <div className={`flex items-center gap-1.5 ${tempConfig[selectedClient.temperature].color}`}>
                {tempConfig[selectedClient.temperature].icon}
                <span className="text-sm font-semibold">{tempConfig[selectedClient.temperature].label}</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-2">
              <a href={`tel:${selectedClient.phone}`} className="block">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 rounded-2xl">
                  <PhoneCall className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span className="text-[11px] font-medium text-blue-700 dark:text-cyan-300">Ligar</span>
                </div>
              </a>
              <a href={generateWhatsAppLink(selectedClient.phone, `Olá ${selectedClient.name.split(' ')[0]}!`)} target="_blank" rel="noopener" className="block">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl">
                  <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-[11px] font-medium text-green-700 dark:text-green-300">WhatsApp</span>
                </div>
              </a>
              <button onClick={() => { setTaskForClient(selectedClient); setShowNewTask(true); }} className="block w-full">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-2xl">
                  <CalendarPlus className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-[11px] font-medium text-violet-700 dark:text-violet-300">Nova Tarefa</span>
                </div>
              </button>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{selectedClient.interested_product || '—'}</p>
                <p className="text-[10px] text-[var(--sf-text-tertiary)]">Produto de Interesse</p>
              </div>
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{selectedClient.stand_name?.replace('Stand ', '') || 'Stand'}</p>
                <p className="text-[10px] text-[var(--sf-text-tertiary)]">Stand</p>
              </div>
            </div>

            {selectedClient.notes && (
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-xs text-[var(--sf-text-secondary)]">{selectedClient.notes}</p>
                <p className="text-[10px] text-[var(--sf-text-muted)] mt-1">Notas pessoais</p>
              </div>
            )}

            {/* Client tasks */}
            {(clientTasksMap[selectedClient.id] || []).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--sf-text-secondary)] mb-2">Tarefas</p>
                <div className="space-y-1.5">
                  {(clientTasksMap[selectedClient.id] || []).map((task) => (
                    <div key={task.id} className={`flex items-center gap-2 p-2.5 rounded-xl border ${task.completed ? 'opacity-50' : ''} bg-[var(--sf-surface)] border-[var(--sf-border)]`}>
                      <span>{taskTypeConfig[task.type].icon}</span>
                      <span className={`text-xs flex-1 ${task.completed ? 'line-through text-[var(--sf-text-muted)]' : 'text-[var(--sf-text-primary)]'}`}>{task.description}</span>
                      {task.completed && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-[var(--sf-text-muted)] text-center">🔒 Dados visíveis somente para você</p>
          </div>
        )}
      </Modal>

      {/* ── New Client Modal ── */}
      <Modal open={showNewClient} onClose={() => setShowNewClient(false)} title="Novo Cliente" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Nome completo', placeholder: 'Nome do cliente' },
              { label: 'Telefone', placeholder: '(11) 99999-0000' },
              { label: 'Email', placeholder: 'email@exemplo.com' },
              { label: 'Produto de interesse', placeholder: 'Apt 1204 Bloco A' },
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">{f.label}</label>
                <input className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Temperatura</label>
            <div className="flex gap-2">
              {(['quente', 'morno', 'frio'] as const).map((t) => (
                <button key={t} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-medium transition-all bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-secondary)]`}>
                  <span className={tempConfig[t].color}>{tempConfig[t].icon}</span>
                  {tempConfig[t].label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Notas</label>
            <textarea rows={3} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 resize-none" placeholder="Observações pessoais..." />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNewClient(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={() => setShowNewClient(false)}>Salvar</Button>
          </div>
          <p className="text-[10px] text-[var(--sf-text-muted)] text-center">🔒 Dados visíveis somente para você</p>
        </div>
      </Modal>

      {/* ── New Task Modal ── */}
      <Modal open={showNewTask} onClose={() => { setShowNewTask(false); setTaskForClient(null); }} title={`Nova Tarefa${taskForClient ? ` — ${taskForClient.name}` : ''}`} size="sm">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(taskTypeConfig).map(([key, cfg]) => (
                <button key={key} className="flex items-center gap-2 p-3 rounded-2xl border bg-[var(--sf-surface)] border-[var(--sf-border)] text-xs font-medium text-[var(--sf-text-secondary)]">
                  <span>{cfg.icon}</span> {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Descrição</label>
            <input className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" placeholder="O que precisa fazer?" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Data e hora</label>
            <input type="datetime-local" className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => { setShowNewTask(false); setTaskForClient(null); }}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={() => { setShowNewTask(false); setTaskForClient(null); }}>Criar Tarefa</Button>
          </div>
        </div>
      </Modal>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewClient(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-lg border border-white/20"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}
