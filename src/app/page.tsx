'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowRight, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--sf-bg)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/3 dark:from-cyan-500/3 to-violet-500/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[var(--sf-bg-secondary)]/80 backdrop-blur-3xl border border-[var(--sf-border)] rounded-3xl shadow-[var(--sf-shadow-lg)] p-8 space-y-8">
          {/* Logo */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
              className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--sf-text-primary)] tracking-tight">StandForge</h1>
              <p className="text-sm text-[var(--sf-text-tertiary)] mt-1">O futuro da gestão de stands imobiliários</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--sf-text-secondary)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-tertiary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 focus:border-blue-500/30 dark:focus:border-cyan-500/30 transition-all"
                />
              </div>
            </div>

            <Button variant="neon" size="lg" className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Entrar com Magic Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--sf-border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[var(--sf-bg-secondary)]/80 text-[var(--sf-text-tertiary)]">ou</span>
              </div>
            </div>

            <Button variant="secondary" size="lg" className="w-full" onClick={handleLogin}>
              <Fingerprint className="w-5 h-5" />
              Entrar com Biometria
            </Button>
          </div>

          <p className="text-center text-xs text-[var(--sf-text-tertiary)]">
            Ao entrar, você concorda com os{' '}
            <span className="text-[var(--sf-accent)] hover:underline cursor-pointer">Termos de Uso</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
