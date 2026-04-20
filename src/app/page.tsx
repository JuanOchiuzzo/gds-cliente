'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { spring, slideUp, staggerParent } from '@/lib/motion';

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

  return (
    <div className="min-h-[100dvh] bg-canvas text-text relative overflow-hidden flex">
      {/* Animated aurora backdrop + grid pattern */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid opacity-[0.25]" />
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 60% 50% at 20% 30%, rgba(245, 158, 11, 0.18), transparent 60%)',
              'radial-gradient(ellipse 60% 50% at 70% 20%, rgba(167, 139, 250, 0.12), transparent 60%)',
              'radial-gradient(ellipse 60% 50% at 20% 30%, rgba(245, 158, 11, 0.18), transparent 60%)',
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-aurora-1/10 blur-[120px]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-solar/10 blur-[100px]" />
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[30%] w-2 h-2 rounded-full bg-solar blur-sm"
        />
        <motion.div
          animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-aurora-2 blur-[1px]"
        />
        <motion.div
          animate={{ y: [0, -24, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-[40%] right-[40%] w-1.5 h-1.5 rounded-full bg-aurora-1 blur-[1px]"
        />
      </div>

      {/* Left — editorial */}
      <div className="relative z-10 hidden lg:flex flex-col justify-between w-[58%] p-14 xl:p-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-canvas" />
          </div>
          <span className="text-lg font-medium tracking-tight">StandForge</span>
          <span className="ml-3 px-2 py-0.5 text-[10px] font-mono text-solar border border-solar/30 bg-solar/5 rounded-full tracking-widest uppercase">
            Nexus Orbit
          </span>
        </motion.div>

        <motion.div
          variants={staggerParent(0.12, 0.2)}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-xl"
        >
          <motion.h1
            variants={slideUp}
            className="font-display italic text-[56px] xl:text-[72px] leading-[0.95] tracking-tight"
          >
            Onde negócios<br />
            imobiliários<br />
            <span className="text-solar-gradient not-italic font-sans font-medium">ganham órbita.</span>
          </motion.h1>
          <motion.p variants={slideUp} className="text-text-soft text-[17px] leading-relaxed max-w-md">
            Carteira viva, fila de plantão em tempo real, vouchers compartilháveis e IA que entende
            o seu mercado — tudo em uma interface que você nunca viu antes.
          </motion.p>

          <motion.div variants={slideUp} className="flex items-center gap-6 text-[13px] text-text-faint">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
              Realtime Supabase
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-solar animate-pulse-soft" />
              Mobile-first PWA
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-aurora-2 animate-pulse-soft" />
              IA contextual
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[11px] text-text-ghost font-mono tracking-widest uppercase"
        >
          © 2026 · StandForge Systems
        </motion.p>
      </div>

      {/* Right — form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={spring}
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-canvas" />
            </div>
            <span className="text-lg font-medium">StandForge</span>
          </div>

          <div
            className="relative p-8 rounded-2xl bg-surface-0/70 backdrop-blur-xl border border-border-strong shadow-xl"
          >
            <div className="mb-8">
              <h2 className="font-display italic text-3xl tracking-tight mb-1.5">
                {isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta.'}
              </h2>
              <p className="text-sm text-text-soft">
                {isSignUp ? 'Um novo ciclo começa aqui.' : 'Continue de onde parou.'}
              </p>
            </div>

            <div className="space-y-4">
              {isSignUp && (
                <Input
                  icon={<User className="w-4 h-4" />}
                  placeholder="Nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}
              <Input
                icon={<Mail className="w-4 h-4" />}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <Input
                icon={<Lock className="w-4 h-4" />}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />

              <Button
                variant="solar"
                size="lg"
                className="w-full group"
                loading={loading}
                onClick={handleSubmit}
              >
                {isSignUp ? 'Criar conta' : 'Entrar'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-soft">
                {isSignUp ? 'Já tem conta?' : 'Novo por aqui?'}{' '}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-solar font-medium hover:underline underline-offset-4"
                >
                  {isSignUp ? 'Entrar' : 'Criar conta'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
