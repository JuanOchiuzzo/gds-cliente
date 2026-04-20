'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg'; className?: string; }
const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn('relative w-full bg-[var(--bg-card)] rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden', sizeMap[size], className)}>
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="p-5 overflow-y-auto max-h-[80vh]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
