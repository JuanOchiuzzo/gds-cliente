'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Fingerprint, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';
import { BrandMark } from '@/components/brand/brand-mark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';

const previewRows = [
  { label: 'Leads em alta', value: '18', tone: 'text-solar' },
  { label: 'Visitas hoje', value: '7', tone: 'text-success' },
  { label: 'Fila ativa', value: '3', tone: 'text-info' },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) return <AuthBootScreen />;
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async () => {
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
        toast.success('Conta criada! Verifique seu email.');
        setIsSignUp(false);
        setPassword('');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        error.includes('Email not confirmed')
          ? toast.error('Confirme seu email primeiro.')
          : toast.error(error);
      } else router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-canvas text-text">
      <div className="absolute inset-0 bg-[url('/brand/gds-native-bg.webp')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(91,241,198,0.16),transparent_28%),linear-gradient(180deg,rgba(6,8,10,0.16)_0%,rgba(6,8,10,0.62)_44%,#06080a_100%)]" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <section className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-[1180px] grid-cols-1 px-5 pb-[max(22px,env(safe-area-inset-bottom))] pt-[max(18px,env(safe-area-inset-top))] lg:grid-cols-[1fr_420px] lg:items-center lg:gap-14 lg:px-8">
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="space-y-8"
          >
            <BrandMark size="lg" />
            <div className="max-w-[560px]">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-text-soft backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                CRM nativo para operação imobiliária
              </p>
              <h1 className="text-[64px] font-semibold leading-[0.98] text-white">
                Controle o stand como uma sala de comando.
              </h1>
              <p className="mt-5 max-w-[460px] text-base leading-7 text-text-soft">
                Fila, carteira, visitas, leads e IA em um fluxo desenhado para uso diário no celular.
              </p>
            </div>

            <div className="grid max-w-[520px] grid-cols-3 gap-3">
              {previewRows.map((row) => (
                <div key={row.label} className="native-panel rounded-lg p-4">
                  <p className={cn('text-3xl font-semibold', row.tone)}>{row.value}</p>
                  <p className="mt-1 text-xs text-text-faint">{row.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex min-h-[100dvh] flex-col lg:min-h-0">
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="flex items-center justify-between lg:hidden"
          >
            <BrandMark size="md" />
            <span className="brand-chip rounded-full px-3 py-1 text-[10px] font-semibold uppercase text-text-soft">
              Native
            </span>
          </motion.header>

          <div className="flex-1 lg:hidden" />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={spring}
            className="native-panel rounded-lg p-4 lg:p-5"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase text-success">
                  <Fingerprint className="h-4 w-4" />
                  Acesso protegido
                </p>
                <h2 className="mt-2 text-[32px] font-semibold leading-tight text-white">
                  {isSignUp ? 'Criar acesso' : 'Entrar no GDS'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-soft">
                  {isSignUp
                    ? 'Sua operação começa com um perfil seguro.'
                    : 'Continue sua rotina comercial em modo aplicativo.'}
                </p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-1 rounded-full border border-white/[0.1] bg-white/[0.055] p-1">
              {[
                { label: 'Entrar', value: false },
                { label: 'Criar', value: true },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setIsSignUp(item.value)}
                  className={cn(
                    'h-10 rounded-full text-sm font-semibold transition-all',
                    isSignUp === item.value
                      ? 'bg-white text-canvas shadow-sm'
                      : 'text-text-faint hover:text-text'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form className="space-y-3" onSubmit={handleFormSubmit}>
              {isSignUp && (
                <Input
                  icon={<User className="h-4 w-4" />}
                  autoComplete="name"
                  placeholder="Nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}
              <Input
                icon={<Mail className="h-4 w-4" />}
                autoComplete="email"
                type="email"
                inputMode="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                icon={<Lock className="h-4 w-4" />}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variant="solar"
                size="lg"
                className="h-12 w-full text-[15px]"
                loading={loading}
                type="submit"
              >
                {isSignUp ? 'Criar acesso' : 'Entrar'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function AuthBootScreen() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-canvas text-text">
      <div className="absolute inset-0 bg-[url('/brand/gds-native-bg.webp')] bg-cover bg-center opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,10,0.36),#06080a_74%)]" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <BrandMark size="lg" />
        <div className="h-1 w-28 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className="h-full w-1/2 rounded-full bg-solar-gradient"
            animate={{ x: ['-100%', '220%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </main>
  );
}
