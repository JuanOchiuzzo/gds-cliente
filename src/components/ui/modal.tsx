'use client';

// Backwards-compatible wrapper around Radix Dialog.
// Prefer importing from ./dialog for new code.
import { type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent size={size} className={cn(className)}>
        {title && <DialogTitle className="mb-4">{title}</DialogTitle>}
        {children}
      </DialogContent>
    </Dialog>
  );
}
