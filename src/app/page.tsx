'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowRight, Lock, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (authLoading) return null;
  if (user) { router.push('/dashboard'); return null; }

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error('Preencha email e senha');
      return;
    }
    if (isSignUp && !fullName) {
      toast.error('Preencha seu nome completo');
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Conta criada! Verifique seu email para confirmar.');
        setIsSignUp(false);
        setPassword('');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.includes('Email not confirmed')) {
          toast.error('Confirme seu email antes de entrar. Verifique sua caixa de entrada.');
        } else {
          toast.error(error);
        }
      } else {
        router.push('/dashboard');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--sf-bg)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[var(--sf-bg-secondary)]/80 backdrop-blur-3xl border border-[var(--sf-border)] rounded-3xl shadow-[var(--sf-shadow-lg)] p-8 space-y-6">
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
              <p className="text-sm text-[var(--sf-text-tertiary)] mt-1">
                {isSignUp ? 'Crie sua conta' : 'Entre na sua conta'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--sf-text-secondary)]">Nome completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--sf-text-secondary)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-tertiary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--sf-text-secondary)]">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-tertiary)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <Button variant="neon" size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : isSignUp ? (
                <><UserPlus className="w-4 h-4" /> Criar Conta</>
              ) : (
                <><LogIn className="w-4 h-4" /> Entrar</>
              )}
            </Button>
          </div>

          {/* Toggle sign up / sign in */}
          <p className="text-center text-sm text-[var(--sf-text-tertiary)]">
            {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--sf-accent)] font-medium hover:underline"
            >
              {isSignUp ? 'Entrar' : 'Criar conta'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
