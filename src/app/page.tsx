'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
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
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/brand/gds-login-bg.webp')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.12)_0%,rgba(8,9,11,0.78)_48%,#08090b_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,11,0.24),rgba(8,9,11,0.02),rgba(8,9,11,0.34))]" />

      <section className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col px-5 pb-[max(22px,env(safe-area-inset-bottom))] pt-[max(18px,env(safe-area-inset-top))] lg:max-w-[460px]">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/brand/gds-app-mark.webp"
              alt="GDS"
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-lg border border-white/15 shadow-glow"
            />
            <div>
              <p className="text-base font-semibold leading-none text-white">GDS</p>
              <p className="mt-1 text-[10px] font-semibold uppercase text-white/60">Premium CRM</p>
            </div>
          </div>
          <span className="brand-chip rounded-full px-3 py-1 text-[10px] font-semibold uppercase text-white/80">
            Mobile
          </span>
        </motion.header>

        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={spring}
          className="space-y-5"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-solar" />
              Acesso seguro
            </div>
            <div>
              <h1 className="text-[40px] font-semibold leading-[1.03] text-white sm:text-[44px]">
                {isSignUp ? 'Crie seu acesso.' : 'Entre no painel.'}
              </h1>
              <p className="mt-2 max-w-[320px] text-sm leading-6 text-white/70">
                {isSignUp
                  ? 'Cadastre sua conta para gerenciar leads, plantões e visitas.'
                  : 'Carteira, agenda e operação comercial em uma experiência mobile.'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-[rgba(11,12,16,0.88)] p-4 shadow-xl backdrop-blur-xl">
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-md bg-white/[0.06] p-1">
              {[
                { label: 'Entrar', value: false },
                { label: 'Criar conta', value: true },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setIsSignUp(item.value)}
                  className={cn(
                    'h-10 rounded-sm text-sm font-semibold transition-colors',
                    isSignUp === item.value
                      ? 'bg-white text-canvas shadow-sm'
                      : 'text-white/60 hover:text-white'
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
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <Input
                icon={<Lock className="h-4 w-4" />}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
          </div>
        </motion.div>
      </section>
    </main>
  );
}
