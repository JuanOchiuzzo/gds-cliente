'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Fingerprint,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { Brand, Monogram } from '@/components/brand/brand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) return <BootScreen />;
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha email e senha');
      return;
    }
    if (isSignUp && !fullName) {
      toast.error('Preencha seu nome');
      return;
    }
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) toast.error(error);
      else {
        toast.success('Conta criada — verifique seu email');
        setIsSignUp(false);
        setPassword('');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.includes('Email not confirmed'))
          toast.error('Confirme seu email primeiro.');
        else toast.error(error);
      } else router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-iris/25 blur-[140px]" />
        <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-cyanx/20 blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-[280px] bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />
      </div>

      <section
        className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-[1180px] grid-cols-1 px-5 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-16 lg:px-8"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 20px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 28px)',
        }}
      >
        {/* Hero side (desktop) */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Brand size="lg" href={null} />
            <h1 className="mt-12 font-display text-[64px] leading-[0.98] tracking-[-0.03em]">
              Forja de vendas
              <br />
              <span className="text-iris-gradient">sob comando</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-fg-soft">
              O CRM nativo para stands imobiliários. Fila em tempo real,
              agenda compartilhada, carteira privada e IA que estuda seus leads
              enquanto você dorme.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { label: 'Leads ativos', value: '284' },
                { label: 'Visitas · hoje', value: '17' },
                { label: 'Plantão · ao vivo', value: '3' },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="rounded-[18px] border border-line bg-white/[0.04] p-4"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
                    {s.label}
                  </p>
                  <p className="mt-2 font-display text-3xl text-fg">{s.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-fg-muted">
              <ShieldCheck className="h-4 w-4 text-ok" />
              Supabase Auth · TLS 1.3 · Row Level Security ativo
            </div>
          </motion.div>
        </div>

        {/* Form side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          <div className="lg:hidden mb-8 flex items-center justify-between">
            <Brand size="md" href={null} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
              <Sparkles className="h-3 w-3 text-iris-hi" />
              2026
            </span>
          </div>

          <div className="glass-strong relative overflow-hidden rounded-[26px] p-6 lg:p-7">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-iris/20 blur-3xl" />
            <div className="relative">
              <div className="mb-6">
                <h2 className="font-display text-2xl tracking-tight">
                  {isSignUp ? 'Crie sua conta' : 'Entre no comando'}
                </h2>
                <p className="mt-1 text-sm text-fg-muted">
                  {isSignUp
                    ? 'Comece a forjar sua operação hoje.'
                    : 'Bem-vindo de volta.'}
                </p>
              </div>

              <form onSubmit={submit} className="space-y-3">
                {isSignUp && (
                  <Input
                    name="fullName"
                    icon={<User className="h-4 w-4" />}
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                  />
                )}
                <Input
                  name="email"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Input
                  name="password"
                  type="password"
                  icon={<Lock className="h-4 w-4" />}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />

                <Button
                  type="submit"
                  block
                  size="lg"
                  loading={loading}
                  className="mt-5"
                >
                  {isSignUp ? 'Criar conta' : 'Entrar'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-faint">
                  ou
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-line bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-fg-muted opacity-70"
              >
                <Fingerprint className="h-4 w-4" />
                Biometria (em breve)
              </button>

              <p className="mt-6 text-center text-sm text-fg-muted">
                {isSignUp ? 'Já tem conta?' : 'Primeira vez aqui?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold text-iris-hi hover:text-iris"
                >
                  {isSignUp ? 'Entrar' : 'Criar conta'}
                </button>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-fg-faint">
            Ao continuar, você aceita os termos de uso e a política de privacidade.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

function BootScreen() {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris/30 blur-[160px]" />
      </div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center"
      >
        <Monogram size="xl" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-fg-muted">
          Standforge
        </p>
        <div className="mt-6 flex items-center gap-1.5">
          <span className={cn('h-1.5 w-1.5 rounded-full bg-iris animate-pulse')} />
          <span
            className={cn('h-1.5 w-1.5 rounded-full bg-iris animate-pulse')}
            style={{ animationDelay: '120ms' }}
          />
          <span
            className={cn('h-1.5 w-1.5 rounded-full bg-iris animate-pulse')}
            style={{ animationDelay: '240ms' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
