
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { UserForm } from '@/components/users/UserForm';
import { UserTable } from '@/components/users/UserTable';
import { useUsers } from '@/hooks/useUsers';

const Usuarios = () => {
  const { isAdmin, loading } = useAuth();
  const { usuarios, loading: usersLoading, isCreating, createUser, deleteUser } = useUsers();

  if (loading) {
    return <div className="p-4 md:p-6">Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Gerenciar usuários do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-400" />
              Criar Novo Usuário
            </CardTitle>
            <CardDescription>
              Adicione um novo usuário ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm onSubmit={createUser} isCreating={isCreating} />
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Usuários Cadastrados
            </CardTitle>
            <CardDescription>
              {usuarios.length} usuário(s) no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable
              usuarios={usuarios}
              onDelete={deleteUser}
              loading={usersLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Usuarios;
