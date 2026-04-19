'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, LogOut, Smartphone, Camera } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function SettingsPage() {
  const { profile, signOut, user } = useAuth();
  const router = useRouter();
  const supabase = getSupabase();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone: phone || null })
      .eq('id', profile.id);
    if (error) toast.error('Erro ao salvar');
    else toast.success('Perfil atualizado!');
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 2MB');
      return;
    }

    setUploading(true);

    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error('Erro ao enviar foto');
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl + '?t=' + Date.now(); // cache bust

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      toast.error('Erro ao atualizar perfil');
    } else {
      setAvatarUrl(publicUrl);
      toast.success('Foto atualizada!');
    }

    setUploading(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleChangePassword = async () => {
    if (!profile?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/dashboard/settings`,
    });
    if (error) toast.error(error.message);
    else toast.success('Email de redefinição enviado!');
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 max-w-3xl">
      <motion.div variants={fadeUp}>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Configurações</h1>
        <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">Gerencie sua conta</p>
      </motion.div>

      {/* Profile */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Perfil</h3>
          </div>
          <div className="space-y-4">
            {/* Avatar with upload */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={profile?.full_name || ''}
                    className="w-16 h-16 rounded-2xl object-cover border border-[var(--sf-border)]"
                  />
                ) : (
                  <Avatar name={profile?.full_name || 'U'} size="lg" />
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--sf-accent)] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{profile?.full_name}</p>
                <p className="text-xs text-[var(--sf-text-tertiary)]">{profile?.email}</p>
                <p className="text-xs text-[var(--sf-text-tertiary)] capitalize">{profile?.role}</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Nome</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Telefone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="(11) 99999-0000"
                />
              </div>
            </div>
            <Button variant="neon" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Security */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Segurança</h3>
          </div>
          <div className="flex items-center justify-between p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
            <div>
              <p className="text-sm text-[var(--sf-text-primary)]">Alterar senha</p>
              <p className="text-xs text-[var(--sf-text-tertiary)]">Enviaremos um email para redefinição</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleChangePassword}>Alterar</Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* PWA */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Instalar App</h3>
          </div>
          <p className="text-sm text-[var(--sf-text-tertiary)] mb-3">
            Instale o StandForge como app no seu celular para acesso rápido.
          </p>
          <p className="text-xs text-[var(--sf-text-muted)]">
            No Chrome: Menu (⋮) → &quot;Adicionar à tela inicial&quot;
          </p>
        </GlassCard>
      </motion.div>

      {/* Logout */}
      <motion.div variants={fadeUp}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-100 dark:hover:bg-red-500/15 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </motion.div>
    </motion.div>
  );
}
