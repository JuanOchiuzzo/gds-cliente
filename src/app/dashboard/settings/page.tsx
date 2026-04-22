'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, LogOut, Smartphone, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { staggerParent, slideUp } from '@/lib/motion';

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
    else toast.success('Perfil atualizado');
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Máximo 2MB');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error('Erro no upload');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl + '?t=' + Date.now();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) toast.error('Erro ao atualizar');
    else {
      setAvatarUrl(publicUrl);
      toast.success('Foto atualizada');
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleChangePassword = async () => {
    if (!profile?.email) return;
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${origin}/dashboard/settings`,
    });
    if (error) toast.error(error.message);
    else toast.success('Email enviado');
  };

  return (
    <motion.div
      variants={staggerParent(0.06)}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl"
    >
      <motion.div variants={slideUp}>
        <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-text-soft">Gerencie sua conta e preferências</p>
      </motion.div>

      {/* Profile */}
      <motion.div variants={slideUp}>
        <Surface variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-solar" />
            <h3 className="text-sm font-medium text-text">Perfil</h3>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  name={profile?.full_name || 'U'}
                  src={avatarUrl}
                  size="2xl"
                  ring="solar"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-solar to-solar-hot text-canvas flex items-center justify-center shadow-glow hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-3.5 h-3.5 border-2 border-canvas/30 border-t-canvas rounded-full animate-spin" />
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
                <p className="text-base font-medium text-text">{profile?.full_name}</p>
                <p className="text-sm text-text-soft">{profile?.email}</p>
                <p className="text-xs text-text-faint capitalize mt-0.5">{profile?.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Button variant="solar" onClick={handleSave} loading={saving}>
              Salvar alterações
            </Button>
          </div>
        </Surface>
      </motion.div>

      {/* Security */}
      <motion.div variants={slideUp}>
        <Surface variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-aurora-1" />
            <h3 className="text-sm font-medium text-text">Segurança</h3>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface-1 border border-border rounded-md">
            <div>
              <p className="text-sm text-text font-medium">Alterar senha</p>
              <p className="text-xs text-text-soft">Enviaremos um email de redefinição</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleChangePassword}>
              Alterar
            </Button>
          </div>
        </Surface>
      </motion.div>

      {/* PWA */}
      <motion.div variants={slideUp}>
        <Surface variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-4 h-4 text-aurora-2" />
            <h3 className="text-sm font-medium text-text">Instalar como app</h3>
          </div>
          <p className="text-sm text-text-soft mb-2">
            Instale o GDS no seu dispositivo para acesso rápido.
          </p>
          <p className="text-xs text-text-faint">
            Chrome: Menu (⋮) → &ldquo;Adicionar à tela inicial&rdquo;
          </p>
        </Surface>
      </motion.div>

      {/* Logout */}
      <motion.div variants={slideUp}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-md bg-danger/10 border border-danger/25 text-danger font-medium text-sm hover:bg-danger/15 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </button>
      </motion.div>
    </motion.div>
  );
}
