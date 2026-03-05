
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const CadastrarUsuario = () => {
  const { isAdmin, loading, lojaId, usuario } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    autorizacao: 'operador',
  });

  if (loading) {
    return <div className="p-6 text-slate-400">Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (form.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!lojaId) {
      toast.error('Você não está vinculado a nenhuma loja.');
      return;
    }

    setIsCreating(true);

    try {
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.senha,
        options: {
          data: { nome: form.nome.trim() }
        }
      });

      if (authError) {
        toast.error(`Erro ao criar conta: ${authError.message}`);
        return;
      }

      if (!authData.user) {
        toast.error('Não foi possível criar a conta. Tente novamente.');
        return;
      }

      const userId = authData.user.id;

      // 2. Aguardar o trigger do Supabase criar o perfil base
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Upsert no perfil para vincular à loja do admin
      const { error: perfilError } = await supabase
        .from('perfis')
        .upsert({
          id: userId,
          email: form.email.trim(),
          nome: form.nome.trim(),
          loja_id: lojaId,
          autorizacao: form.autorizacao,
        }, { onConflict: 'id' });

      if (perfilError) {
        console.warn('⚠️ Erro ao vincular perfil:', perfilError);
        toast.warning('Conta criada, mas houve problema ao vincular à loja. Contate o suporte.');
      } else {
        toast.success(`Usuário "${form.nome}" cadastrado com sucesso na loja!`);
        setForm({ nome: '', email: '', senha: '', autorizacao: 'operador' });
      }

    } catch (error: any) {
      console.error('Erro inesperado:', error);
      toast.error(`Erro inesperado: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight neon-text">Cadastrar Novo Usuário</h1>
        <p className="text-muted-foreground mt-1">
          Adicione um novo usuário vinculado à sua loja
        </p>
      </div>

      <div className="max-w-2xl">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-400" />
              Informações do Novo Usuário
            </CardTitle>
            <CardDescription>
              Este usuário terá acesso apenas à sua loja e dados vinculados a ela.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">Nome Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Nome do funcionário"
                    value={form.nome}
                    onChange={(e) => setForm(p => ({ ...p, nome: e.target.value }))}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="funcionario@suaempresa.com"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">Senha de Acesso *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={form.senha}
                    onChange={(e) => setForm(p => ({ ...p, senha: e.target.value }))}
                    className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-purple-500"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Autorização */}
              <div className="space-y-2">
                <Label className="text-slate-300 font-medium">Nível de Acesso</Label>
                <Select
                  value={form.autorizacao}
                  onValueChange={(val) => setForm(p => ({ ...p, autorizacao: val }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="operador">Operador — acesso básico ao sistema</SelectItem>
                    <SelectItem value="admin">Administrador — acesso completo + gerenciar usuários</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 border-t border-slate-700/50">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  {isCreating
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando usuário...</>
                    : <><UserPlus className="mr-2 h-4 w-4" />Cadastrar Usuário</>
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastrarUsuario;
