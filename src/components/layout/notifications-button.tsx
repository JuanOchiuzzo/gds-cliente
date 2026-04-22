'use client';

import { useMemo, useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useActivities } from '@/lib/hooks/use-activities';
import { timeAgo, cn } from '@/lib/utils';

const STORAGE_KEY = 'gds:notifications:lastSeen';

function getLastSeen(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? Number(raw) : 0;
}

function setLastSeen(ts: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, String(ts));
}

const ACTIVITY_LABELS: Record<string, string> = {
  lead_created: 'Novo lead',
  lead_updated: 'Lead atualizado',
  lead_stage_changed: 'Etapa alterada',
  call: 'Ligação',
  whatsapp: 'WhatsApp',
  email: 'Email',
  visit: 'Visita',
  appointment_scheduled: 'Visita agendada',
  sale: 'Venda fechada',
  note: 'Anotação',
};

interface NotificationsButtonProps {
  className?: string;
  iconSize?: number;
}

export function NotificationsButton({ className, iconSize = 18 }: NotificationsButtonProps) {
  const { activities, loading } = useActivities(15);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeenState] = useState<number>(0);

  useEffect(() => {
    setLastSeenState(getLastSeen());
  }, []);

  const unreadCount = useMemo(
    () => activities.filter((a) => new Date(a.created_at).getTime() > lastSeen).length,
    [activities, lastSeen]
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && activities.length > 0) {
      const newest = new Date(activities[0].created_at).getTime();
      setLastSeen(newest);
      setLastSeenState(newest);
    }
  };

  const markAllAsRead = () => {
    const now = Date.now();
    setLastSeen(now);
    setLastSeenState(now);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          aria-label="Notificações"
          className={cn(
            'relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)] active:bg-[var(--bg-hover)] transition-colors',
            className
          )}
        >
          <Bell style={{ width: iconSize, height: iconSize }} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-solar text-canvas text-[9px] font-bold flex items-center justify-center shadow-glow"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 max-h-[420px] overflow-hidden flex flex-col"
      >
        <header className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[var(--text)]">Notificações</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-solar/20 text-solar text-[10px] font-semibold">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {activities.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <Check className="w-3 h-3" />
              Marcar como lidas
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          {loading && activities.length === 0 ? (
            <div className="p-6 text-center text-[12px] text-[var(--text-muted)]">
              Carregando...
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 mx-auto text-[var(--text-faint)] mb-2 opacity-40" />
              <p className="text-[12px] text-[var(--text-muted)]">
                Nenhuma notificação por aqui
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {activities.map((a) => {
                const isUnread = new Date(a.created_at).getTime() > lastSeen;
                const label = ACTIVITY_LABELS[a.type] ?? a.type.replace(/_/g, ' ');
                return (
                  <li
                    key={a.id}
                    className={cn(
                      'px-3 py-2.5 hover:bg-[var(--bg-hover)] transition-colors cursor-default',
                      isUnread && 'bg-solar/5'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          'mt-1.5 w-1.5 h-1.5 rounded-full shrink-0',
                          isUnread ? 'bg-solar' : 'bg-[var(--text-faint)] opacity-40'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] font-semibold text-[var(--text)] capitalize">
                            {label}
                          </span>
                          <span className="text-[10px] text-[var(--text-faint)] shrink-0">
                            {timeAgo(a.created_at)}
                          </span>
                        </div>
                        {a.description && (
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                            {a.description}
                          </p>
                        )}
                        {a.agent_name && (
                          <p className="text-[10px] text-[var(--text-faint)] mt-0.5">
                            por {a.agent_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
