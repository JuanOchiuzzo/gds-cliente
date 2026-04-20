'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Phone, MessageCircle, Flame, Thermometer, Snowflake,
  ListTodo, Check, CalendarPlus, PhoneCall,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { useWallet, type WalletClientRow } from '@/lib/hooks/use-wallet';
import { useStands } from '@/lib/hooks/use-stands';
import { generateWhatsAppLink } from '@/lib/utils';
import { format } from 'date-fns';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

type Temp = 'quente' | 'morno' | 'frio';
const tempConfig: Record<Temp, { icon: React.ReactNode; label: string; color: string }> = {
  quente: { icon: <Flame className="w-4 h-4" />, label: 'Quente', color: 'text-orange-500' },
  morno: { icon: <Thermometer className="w-4 h-4" />, label: 'Morno', color: 'text-amber-500' },
  frio: { icon: <Snowflake className="w-4 h-4" />, label: 'Frio', color: 'text-blue-400' },
};

const taskTypes = [
  { key: 'ligar', icon: '📞', label: 'Ligar' },
  { key: 'agendar_visita', icon: '📅', label: 'Agendar Visita' },
  { key: 'enviar_proposta', icon: '📄', label: 'Enviar Proposta' },
  { key: 'follow_up', icon: '🔄', label: 'Follow-up' },
];

export default function WalletPage() {
  const { clients, tasks, loading, createClient, createTask, completeTask } = useWallet();
  const { stands } = useStands();
  const [search, setSearch] = useState('');
  const [tempFilter, setTempFilter] = useState<'all' | Temp>('all');
  const [selectedClient, setSelectedClient] = useState<WalletClientRow | null>(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [tab, setTab] = useState<'clientes' | 'tarefas'>('clientes');

  // New client form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newTemp, setNewTemp] = useState<Temp>('morno');
  const [newNotes, setNewNotes] = useState('');
  const [newStandId, setNewStandId] = useState('');

  // New task form
  const [taskType, setTaskType] = useState('ligar');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDue, setTaskDue] = useState('');

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone || '').includes(search);
      const matchTemp = tempFilter === 'all' || c.temperature === tempFilter;
      return matchSearch && matchTemp;
    });
  }, [clients, search, tempFilter]);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const clientTasks = selectedClient ? tasks.filter((t) => t.client_id === selectedClient.id) : [];

  const handleCreateClient = async () => {
    if (!newName) { toast.error('Nome é obrigatório'); return; }
    await createClient({
      name: newName, phone: newPhone, email: newEmail,
      interested_product: newProduct || null, temperature: newTemp,
      notes: newNotes || null, stand_id: newStandId || null,
    });
    toast.success('Cliente adicionado à carteira!');
    setShowNewClient(false);
    setNewName(''); setNewPhone(''); setNewEmail(''); setNewProduct(''); setNewTemp('morno'); setNewNotes(''); setNewStandId('');
  };

  const handleCreateTask = async () => {
    if (!taskDesc || !taskDue || !selectedClient) { toast.error('Preencha todos os campos'); return; }
    await createTask({
      client_id: selectedClient.id,
      type: taskType as 'ligar',
      description: taskDesc,
      due_date: new Date(taskDue).toISOString(),
    });
    toast.success('Tarefa criada!');
    setShowNewTask(false);
    setTaskDesc(''); setTaskDue('');
  };

  const handleComplete = async (id: string) => {
    await completeTask(id);
    toast.success('Tarefa concluída! ✅');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Minha Carteira</h1>
          <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">🔒 Dados visíveis só para você</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNewClient(true)}>
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Cliente</span>
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-1 p-1 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
        {(['clientes', 'tarefas'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${
              tab === t ? 'bg-[var(--sf-bg-secondary)] text-[var(--sf-text-primary)] shadow-sm border border-[var(--sf-border)]' : 'text-[var(--sf-text-tertiary)]'
            }`}>
            {t === 'clientes' ? <><Flame className="w-3.5 h-3.5" /> Clientes ({clients.length})</> : <><ListTodo className="w-3.5 h-3.5" /> Tarefas ({pendingTasks.length})</>}
          </button>
        ))}
      </motion.div>

      {/* CLIENTES TAB */}
      {tab === 'clientes' && (
        <>
          <motion.div variants={fadeUp} className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-muted)]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente..."
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 transition-all" />
            </div>
            <div className="flex gap-2">
              {(['all', 'quente', 'morno', 'frio'] as const).map((t) => (
                <button key={t} onClick={() => setTempFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    tempFilter === t ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300' : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
                  }`}>
                  {t === 'all' ? 'Todos' : <><span className={tempConfig[t].color}>{tempConfig[t].icon}</span> {tempConfig[t].label}</>}
                </button>
              ))}
            </div>
          </motion.div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Flame className="w-10 h-10 mx-auto text-[var(--sf-text-muted)] mb-3" />
              <p className="text-sm text-[var(--sf-text-tertiary)]">{clients.length === 0 ? 'Sua carteira está vazia' : 'Nenhum cliente encontrado'}</p>
              <Button variant="neon" size="sm" className="mt-4" onClick={() => setShowNewClient(true)}>
                <Plus className="w-4 h-4" /> Adicionar Cliente
              </Button>
            </div>
          ) : (
            <motion.div variants={stagger} className="space-y-2">
              {filtered.map((client) => {
                const cTasks = tasks.filter((t) => t.client_id === client.id && !t.completed);
                return (
                  <motion.div key={client.id} variants={fadeUp}>
                    <motion.div whileTap={{ scale: 0.98 }} onClick={() => setSelectedClient(client)}
                      className="p-3.5 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Avatar name={client.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{client.name}</h3>
                            <span className={tempConfig[client.temperature].color}>{tempConfig[client.temperature].icon}</span>
                          </div>
                          <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">{client.interested_product || 'Sem produto definido'}</p>
                          {cTasks.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-violet-600 dark:text-violet-400 font-medium mt-0.5">
                              <ListTodo className="w-3 h-3" /> {cTasks.length} tarefa{cTasks.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {client.phone && (
                            <>
                              <a href={generateWhatsAppLink(client.phone, `Olá ${client.name.split(' ')[0]}!`)} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-xl text-green-600 dark:text-green-400 active:bg-green-500/10">
                                <MessageCircle className="w-4 h-4" />
                              </a>
                              <a href={`tel:${client.phone}`} onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-xl text-blue-600 dark:text-cyan-400 active:bg-blue-500/10">
                                <Phone className="w-4 h-4" />
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </>
      )}

      {/* TAREFAS TAB */}
      {tab === 'tarefas' && (
        <motion.div variants={stagger} className="space-y-2">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-16">
              <ListTodo className="w-10 h-10 mx-auto text-[var(--sf-text-muted)] mb-3" />
              <p className="text-sm text-[var(--sf-text-tertiary)]">Nenhuma tarefa pendente</p>
            </div>
          ) : (
            pendingTasks.map((task) => {
              const isOverdue = new Date(task.due_date) < new Date();
              const cfg = taskTypes.find((t) => t.key === task.type) || taskTypes[3];
              return (
                <motion.div key={task.id} variants={fadeUp}>
                  <div className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
                    isOverdue ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
                  }`}>
                    <span className="text-lg">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[var(--sf-text-primary)]">{task.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[var(--sf-text-tertiary)]">{task.client_name}</span>
                        <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-[var(--sf-text-tertiary)]'}`}>
                          {format(new Date(task.due_date), 'dd/MM HH:mm')}{isOverdue && ' ⚠️'}
                        </span>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleComplete(task.id)}
                      className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <Check className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
          {completedTasks.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-[var(--sf-text-muted)] font-medium mb-2">Concluídas</p>
              {completedTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl opacity-50">
                  <span className="text-lg">{(taskTypes.find((t) => t.key === task.type) || taskTypes[3]).icon}</span>
                  <p className="text-xs text-[var(--sf-text-tertiary)] line-through flex-1">{task.description}</p>
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Client Detail Modal */}
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
            <div className="grid grid-cols-3 gap-2">
              {selectedClient.phone && (
                <>
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
                </>
              )}
              <button onClick={() => setShowNewTask(true)} className="block w-full">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-2xl">
                  <CalendarPlus className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-[11px] font-medium text-violet-700 dark:text-violet-300">Nova Tarefa</span>
                </div>
              </button>
            </div>
            {selectedClient.notes && (
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-xs text-[var(--sf-text-secondary)]">{selectedClient.notes}</p>
              </div>
            )}
            {clientTasks.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--sf-text-secondary)] mb-2">Tarefas</p>
                {clientTasks.map((task) => (
                  <div key={task.id} className={`flex items-center gap-2 p-2.5 rounded-xl border mb-1.5 ${task.completed ? 'opacity-50' : ''} bg-[var(--sf-surface)] border-[var(--sf-border)]`}>
                    <span>{(taskTypes.find((t) => t.key === task.type) || taskTypes[3]).icon}</span>
                    <span className={`text-xs flex-1 ${task.completed ? 'line-through text-[var(--sf-text-muted)]' : 'text-[var(--sf-text-primary)]'}`}>{task.description}</span>
                    {!task.completed && (
                      <button onClick={() => handleComplete(task.id)} className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-[var(--sf-text-muted)] text-center">🔒 Dados visíveis somente para você</p>
          </div>
        )}
      </Modal>

      {/* New Client Modal */}
      <Modal open={showNewClient} onClose={() => setShowNewClient(false)} title="Novo Cliente" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Nome *</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Nome do cliente" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Telefone</label>
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="(11) 99999-0000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Email</label>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Produto de interesse</label>
              <input value={newProduct} onChange={(e) => setNewProduct(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Apt 1204 Bloco A" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Temperatura</label>
            <div className="flex gap-2">
              {(['quente', 'morno', 'frio'] as const).map((t) => (
                <button key={t} onClick={() => setNewTemp(t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-medium transition-all ${
                    newTemp === t ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-300 dark:border-cyan-500/30' : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
                  } text-[var(--sf-text-secondary)]`}>
                  <span className={tempConfig[t].color}>{tempConfig[t].icon}</span> {tempConfig[t].label}
                </button>
              ))}
            </div>
          </div>
          {stands.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Stand</label>
              <select value={newStandId} onChange={(e) => setNewStandId(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none">
                <option value="">Selecionar stand...</option>
                {stands.filter((s) => s.status === 'ativo').map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Notas</label>
            <textarea rows={3} value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none resize-none" placeholder="Observações pessoais..." />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNewClient(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleCreateClient}>Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* New Task Modal */}
      <Modal open={showNewTask} onClose={() => setShowNewTask(false)} title={`Nova Tarefa${selectedClient ? ` — ${selectedClient.name}` : ''}`} size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {taskTypes.map((t) => (
              <button key={t.key} onClick={() => setTaskType(t.key)}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all ${
                  taskType === t.key ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-300 dark:border-cyan-500/30' : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
                } text-[var(--sf-text-secondary)]`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
          <input value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="O que precisa fazer?"
            className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" />
          <input type="datetime-local" value={taskDue} onChange={(e) => setTaskDue(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" />
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNewTask(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleCreateTask}>Criar Tarefa</Button>
          </div>
        </div>
      </Modal>

      {/* FAB */}
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNewClient(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-lg border border-white/20">
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}
