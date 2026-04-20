'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
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

  if (authLoading) return null;
  if (user) { router.push('/dashboard'); return null; }

  const handleSubmit = async () => {
    if (!email || !password) { toast.error('Preencha email e senha'); return; }
    if (isSignUp && !fullName) { toast.error('Preencha seu nome'); return; }
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) toast.error(error);
      else { toast.success('Conta criada! Verifique seu email.'); setIsSignUp(false); setPassword(''); }
    } else {
      const { error } = await signIn(email, password);
      if (error) { error.includes('Email not confirmed') ? toast.error('Confirme seu email primeiro.') : toast.error(error); }
      else router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#1c1917] p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-violet-600/20 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">StandForge</span>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold text-white leading-tight">
            O futuro da gestão<br />de stands imobiliários
          </h2>
          <p className="text-stone-400 text-sm max-w-md">
            Carteira de clientes, fila de plantão, agendamentos com voucher, ranking da equipe — tudo num app premium feito pra quem vende no campo.
          </p>
        </div>
        <p className="relative z-10 text-[11px] text-stone-600">© 2026 StandForge</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--text)]">StandForge</span>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-[var(--text)]">{isSignUp ? 'Criar conta' : 'Entrar'}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">{isSignUp ? 'Preencha seus dados' : 'Acesse sua conta'}</p>
          </div>

          <div className="space-y-3">
            {isSignUp && (
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Nome completo</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome"
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius)] text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius)] text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius)] text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all" />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white text-sm font-semibold rounded-[var(--radius)] shadow-md hover:shadow-[0_4px_20px_var(--accent-glow)] transition-all disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : isSignUp ? <><UserPlus className="w-4 h-4" /> Criar Conta</>
                : <><LogIn className="w-4 h-4" /> Entrar</>}
            </motion.button>
          </div>

          <p className="text-center text-sm text-[var(--text-muted)]">
            {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-[var(--accent)] font-medium hover:underline">
              {isSignUp ? 'Entrar' : 'Criar conta'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
