
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User } from 'lucide-react';

interface UserFormProps {
  onSubmit: (formData: UserFormData) => Promise<void>;
  isCreating: boolean;
}

export interface UserFormData {
  nome: string;
  email: string;
  senha: string;
  autorizacao: string;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, isCreating }) => {
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    senha: '',
    autorizacao: '2'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    
    // Limpar formulário após sucesso
    setFormData({
      nome: '',
      email: '',
      senha: '',
      autorizacao: '2'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
          placeholder="Digite o nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="exemplo@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          required
          placeholder="Mínimo 6 caracteres"
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="autorizacao">Nível de Autorização</Label>
        <Select value={formData.autorizacao} onValueChange={(value) => setFormData({ ...formData, autorizacao: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                Administrador
              </div>
            </SelectItem>
            <SelectItem value="2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Usuário Comum
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isCreating}
        className="w-full"
      >
        {isCreating ? "Criando..." : "Criar Usuário"}
      </Button>
    </form>
  );
};
