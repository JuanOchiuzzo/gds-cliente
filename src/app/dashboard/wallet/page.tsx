'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  Flame,
  Thermometer,
  Snowflake,
  ListTodo,
  Check,
  CalendarPlus,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Chip } from '@/components/ui/chip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useWallet, type WalletClientRow } from '@/lib/hooks/use-wallet';
import { useStands } from '@/lib/hooks/use-stands';
import { generateWhatsAppLink, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { staggerParent, slideUp } from '@/lib/motion';

type Temp = 'quente' | 'morno' | 'frio';

const TEMP_CONFIG: Record<Temp, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  border: string;
}> = {
  quente: {
    icon: <Flame className="w-4 h-4" />,
    label: 'Quente',
    color: 'text-hot',
    bg: 'bg-hot/10',
    border: 'border-hot/30',
  },
  morno: {
    icon: <Thermometer className="w-4 h-4" />,
    label: 'Morno',
    color: 'text-warm',
    bg: 'bg-warm/10',
    border: 'border-warm/30',
  },
  frio: {
    icon: <Snowflake className="w-4 h-4" />,
    label: 'Frio',
    color: 'text-cold',
    bg: 'bg-cold/10',
    border: 'border-cold/30',
  },
};

const TASK_TYPES = [
  { key: 'ligar', icon: '📞', label: 'Ligar' },
  { key: 'agendar_visita', icon: '📅', label: 'Agendar visita' },
  { key: 'enviar_proposta', icon: '📄', label: 'Proposta' },
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

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    product: '',
    temp: 'morno' as Temp,
    notes: '',
    stand_id: '',
  });

  const [taskForm, setTaskForm] = useState({
    type: 'ligar',
    description: '',
    due_date: '',
  });

  const filtered = useMemo(
    () =>
      clients.filter((c) => {
        const matchSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.phone || '').includes(search);
        const matchTemp = tempFilter === 'all' || c.temperature === tempFilter;
        return matchSearch && matchTemp;
      }),
    [clients, search, tempFilter]
  );

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const clientTasks = selectedClient
    ? tasks.filter((t) => t.client_id === selectedClient.id)
    : [];

  const byTemp = {
    quente: filtered.filter((c) => c.temperature === 'quente'),
    morno: filtered.filter((c) => c.temperature === 'morno'),
    frio: filtered.filter((c) => c.temperature === 'frio'),
  };

  const handleCreateClient = async () => {
    if (!form.name) {
      toast.error('Nome é obrigatório');
      return;
    }
    await createClient({
      name: form.name,
      phone: form.phone,
      email: form.email,
      interested_product: form.product || null,
      temperature: form.temp,
      notes: form.notes || null,
      stand_id: form.stand_id || null,
    });
    toast.success('Cliente adicionado');
    setShowNewClient(false);
    setForm({ name: '', phone: '', email: '', product: '', temp: 'morno', notes: '', stand_id: '' });
  };

  const handleCreateTask = async () => {
    if (!taskForm.description || !taskForm.due_date || !selectedClient) {
      toast.error('Preencha todos os campos');
      return;
    }
    await createTask({
      client_id: selectedClient.id,
      type: taskForm.type as 'ligar',
      description: taskForm.description,
      due_date: new Date(taskForm.due_date).toISOString(),
    });
    toast.success('Tarefa criada');
    setShowNewTask(false);
    setTaskForm({ type: 'ligar', description: '', due_date: '' });
  };

  const handleComplete = async (id: string) => {
    await completeTask(id);
    toast.success('Tarefa concluída');
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
      <motion.div variants={slideUp} className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Carteira</h1>
          <p className="mt-1 text-sm text-text-soft flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Dados privados · só você vê
          </p>
        </div>
        <Button variant="solar" onClick={() => setShowNewClient(true)}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Cliente</span>
        </Button>
      </motion.div>

      <Tabs defaultValue="clientes">
        <motion.div variants={slideUp}>
          <TabsList>
            <TabsTrigger value="clientes" className="gap-2">
              <Flame className="w-3.5 h-3.5" />
              Clientes <span className="font-mono text-text-faint">{clients.length}</span>
            </TabsTrigger>
            <TabsTrigger value="tarefas" className="gap-2">
              <ListTodo className="w-3.5 h-3.5" />
              Tarefas <span className="font-mono text-text-faint">{pendingTasks.length}</span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="clientes" className="space-y-5">
          <motion.div variants={slideUp} className="space-y-3">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Buscar cliente…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
              <Chip active={tempFilter === 'all'} onClick={() => setTempFilter('all')}>
                Todos
              </Chip>
              {(['quente', 'morno', 'frio'] as const).map((t) => {
                const c = TEMP_CONFIG[t];
                return (
                  <Chip
                    key={t}
                    active={tempFilter === t}
                    onClick={() => setTempFilter(t)}
                  >
                    <span className={c.color}>{c.icon}</span>
                    {c.label}
                  </Chip>
                );
              })}
            </div>
          </motion.div>

          {/* Temperature columns */}
          {filtered.length === 0 ? (
            <Surface variant="elevated" padding="xl">
              <EmptyState
                icon={<Flame className="w-6 h-6" />}
                title={clients.length === 0 ? 'Sua carteira está vazia' : 'Nada encontrado'}
                description="Adicione seus clientes para começar a organizar."
                action={
                  <Button variant="solar" onClick={() => setShowNewClient(true)}>
                    <Plus className="w-4 h-4" />
                    Adicionar cliente
                  </Button>
                }
              />
            </Surface>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['quente', 'morno', 'frio'] as const).map((t) => {
                const cfg = TEMP_CONFIG[t];
                return (
                  <div key={t}>
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className={cfg.color}>{cfg.icon}</span>
                      <h3 className={cn('text-sm font-medium', cfg.color)}>{cfg.label}</h3>
                      <Badge variant="neutral" size="xs">
                        {byTemp[t].length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {byTemp[t].length === 0 ? (
                        <div className="text-center py-8 text-xs text-text-faint">
                          —
                        </div>
                      ) : (
                        byTemp[t].map((client) => {
                          const cTasks = tasks.filter(
                            (task) => task.client_id === client.id && !task.completed
                          );
                          return (
                            <motion.div
                              key={client.id}
                              layout
                              onClick={() => setSelectedClient(client)}
                              className={cn(
                                'p-3 bg-surface-0 border rounded-md cursor-pointer transition-colors',
                                'border-border hover:border-border-glow hover:bg-surface-1'
                              )}
                            >
                              <div className="flex items-start gap-2.5">
                                <Avatar name={client.name} size="sm" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text truncate">
                                    {client.name}
                                  </p>
                                  <p className="text-[11px] text-text-faint truncate">
                                    {client.interested_product || 'Sem produto'}
                                  </p>
                                  {cTasks.length > 0 && (
                                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-aurora-1">
                                      <ListTodo className="w-2.5 h-2.5" /> {cTasks.length}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {client.phone && (
                                <div className="flex gap-1.5 mt-2 pt-2 border-t border-border">
                                  <a
                                    href={generateWhatsAppLink(
                                      client.phone,
                                      `Olá ${client.name.split(' ')[0]}!`
                                    )}
                                    target="_blank"
                                    rel="noopener"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 flex items-center justify-center h-7 rounded-sm text-success hover:bg-success/10"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                  <a
                                    href={`tel:${client.phone}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 flex items-center justify-center h-7 rounded-sm text-info hover:bg-info/10"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              )}
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tarefas" className="space-y-3">
          {pendingTasks.length === 0 && completedTasks.length === 0 ? (
            <Surface variant="elevated" padding="xl">
              <EmptyState
                icon={<ListTodo className="w-6 h-6" />}
                title="Nenhuma tarefa"
                description="Crie tarefas pelos cards de clientes."
              />
            </Surface>
          ) : (
            <>
              {pendingTasks.map((task) => {
                const isOverdue = new Date(task.due_date) < new Date();
                const cfg = TASK_TYPES.find((t) => t.key === task.type) || TASK_TYPES[3];
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <Surface
                      variant="flat"
                      padding="sm"
                      className={cn(
                        isOverdue ? 'border-danger/30 bg-danger/5' : ''
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{cfg.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text">{task.description}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-faint">
                            <span>{task.client_name}</span>
                            <span className={isOverdue ? 'text-danger' : ''}>
                              · {format(new Date(task.due_date), 'dd/MM HH:mm')}
                              {isOverdue && ' · atrasada'}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleComplete(task.id)}
                          className="w-8 h-8 rounded-md bg-success/10 border border-success/25 text-success flex items-center justify-center hover:bg-success/20"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </Surface>
                  </motion.div>
                );
              })}
              {completedTasks.length > 0 && (
                <div className="pt-4">
                  <p className="text-xs text-text-faint uppercase tracking-wider mb-2 font-medium">
                    Concluídas
                  </p>
                  {completedTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-2.5 opacity-50"
                    >
                      <span className="text-base">
                        {(TASK_TYPES.find((t) => t.key === task.type) || TASK_TYPES[3]).icon}
                      </span>
                      <p className="text-xs text-text-soft line-through flex-1">
                        {task.description}
                      </p>
                      <Check className="w-4 h-4 text-success" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Client detail */}
      <Dialog
        open={!!selectedClient && !showNewTask}
        onOpenChange={(v) => !v && setSelectedClient(null)}
      >
        <DialogContent size="lg">
          {selectedClient && (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle className="flex items-start gap-3">
                  <Avatar name={selectedClient.name} size="lg" ring="solar" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display italic text-2xl text-text">{selectedClient.name}</p>
                    <div className="text-[11px] text-text-soft mt-0.5 space-x-2">
                      {selectedClient.phone && <span>{selectedClient.phone}</span>}
                      {selectedClient.email && <span>· {selectedClient.email}</span>}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 h-8 rounded-full border font-medium text-xs',
                      TEMP_CONFIG[selectedClient.temperature].color,
                      TEMP_CONFIG[selectedClient.temperature].bg,
                      TEMP_CONFIG[selectedClient.temperature].border
                    )}
                  >
                    {TEMP_CONFIG[selectedClient.temperature].icon}
                    {TEMP_CONFIG[selectedClient.temperature].label}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-2">
                {selectedClient.phone && (
                  <>
                    <a href={`tel:${selectedClient.phone}`}>
                      <Button variant="outline" className="w-full flex-col h-auto py-3 border-info/30 text-info hover:bg-info/10">
                        <Phone className="w-4 h-4 mb-0.5" />
                        <span className="text-[11px]">Ligar</span>
                      </Button>
                    </a>
                    <a
                      href={generateWhatsAppLink(
                        selectedClient.phone,
                        `Olá ${selectedClient.name.split(' ')[0]}!`
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Button variant="outline" className="w-full flex-col h-auto py-3 border-success/30 text-success hover:bg-success/10">
                        <MessageCircle className="w-4 h-4 mb-0.5" />
                        <span className="text-[11px]">WhatsApp</span>
                      </Button>
                    </a>
                  </>
                )}
                <Button
                  variant="outline"
                  className="w-full flex-col h-auto py-3 border-aurora-1/30 text-aurora-1 hover:bg-aurora-1/10"
                  onClick={() => setShowNewTask(true)}
                >
                  <CalendarPlus className="w-4 h-4 mb-0.5" />
                  <span className="text-[11px]">Tarefa</span>
                </Button>
              </div>

              {selectedClient.notes && (
                <Surface variant="flat" padding="md">
                  <p className="text-xs text-text-faint uppercase tracking-wider mb-1.5">Notas</p>
                  <p className="text-sm text-text-soft">{selectedClient.notes}</p>
                </Surface>
              )}

              {clientTasks.length > 0 && (
                <div>
                  <p className="text-xs text-text-faint uppercase tracking-wider mb-2 font-medium">
                    Tarefas
                  </p>
                  <div className="space-y-1.5">
                    {clientTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-md border bg-surface-1 border-border',
                          task.completed && 'opacity-50'
                        )}
                      >
                        <span>
                          {(TASK_TYPES.find((t) => t.key === task.type) || TASK_TYPES[3]).icon}
                        </span>
                        <span
                          className={cn(
                            'text-xs flex-1',
                            task.completed ? 'line-through text-text-faint' : 'text-text'
                          )}
                        >
                          {task.description}
                        </span>
                        {!task.completed && (
                          <button
                            onClick={() => handleComplete(task.id)}
                            className="w-6 h-6 rounded-sm bg-success/10 border border-success/25 text-success flex items-center justify-center hover:bg-success/15"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-text-ghost text-center flex items-center justify-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                Visível apenas para você
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New client */}
      <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Novo cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nome"
                placeholder="Nome completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="Email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Produto de interesse"
                placeholder="Apt 1204 Bloco A"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-soft tracking-wide">Temperatura</label>
              <div className="grid grid-cols-3 gap-2">
                {(['quente', 'morno', 'frio'] as const).map((t) => {
                  const cfg = TEMP_CONFIG[t];
                  const active = form.temp === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, temp: t })}
                      className={cn(
                        'flex items-center justify-center gap-2 h-11 rounded-md border text-sm font-medium transition-colors',
                        active
                          ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                          : 'bg-surface-1 border-border text-text-soft hover:border-border-glow'
                      )}
                    >
                      {cfg.icon} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {stands.length > 0 && (
              <Select
                label="Stand"
                value={form.stand_id}
                onChange={(v) => setForm({ ...form, stand_id: v })}
                options={[
                  { value: '', label: '—' },
                  ...stands
                    .filter((s) => s.status === 'ativo')
                    .map((s) => ({ value: s.id, label: s.name })),
                ]}
              />
            )}

            <Textarea
              label="Notas"
              rows={3}
              placeholder="Observações pessoais…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewClient(false)}>
                Cancelar
              </Button>
              <Button variant="solar" className="flex-1" onClick={handleCreateClient}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New task */}
      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              Nova tarefa{selectedClient ? ` · ${selectedClient.name}` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {TASK_TYPES.map((t) => {
                const active = taskForm.type === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTaskForm({ ...taskForm, type: t.key })}
                    className={cn(
                      'flex items-center justify-center gap-2 h-10 rounded-md border text-xs font-medium transition-colors',
                      active
                        ? 'bg-solar/10 border-solar/30 text-solar'
                        : 'bg-surface-1 border-border text-text-soft hover:border-border-glow'
                    )}
                  >
                    <span>{t.icon}</span> {t.label}
                  </button>
                );
              })}
            </div>
            <Input
              placeholder="O que precisa fazer?"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={taskForm.due_date}
              onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
            />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewTask(false)}>
                Cancelar
              </Button>
              <Button variant="solar" className="flex-1" onClick={handleCreateTask}>
                Criar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewClient(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Plus className="w-6 h-6 text-canvas" />
      </motion.button>
    </motion.div>
  );
}
