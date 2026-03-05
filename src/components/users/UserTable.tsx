
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, User, Trash2 } from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  autorizacao: number;
  criado_em: string;
}

interface UserTableProps {
  usuarios: Usuario[];
  onDelete: (usuario: Usuario) => void;
  loading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ usuarios, onDelete, loading }) => {
  const getAuthorizationBadge = (autorizacao: number) => {
    if (autorizacao === 1) {
      return <Badge variant="destructive" className="flex items-center gap-1"><Shield className="h-3 w-3" />Admin</Badge>;
    }
    return <Badge variant="secondary" className="flex items-center gap-1"><User className="h-3 w-3" />Usuário</Badge>;
  };

  if (loading) {
    return <div className="text-center py-4">Carregando usuários...</div>;
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        Nenhum usuário encontrado
      </div>
    );
  }

  return (
    <div className="responsive-table-container">
      <Table>
        <TableHeader className="bg-slate-900/50">
          <TableRow>
            <TableHead className="font-bold">Nome</TableHead>
            <TableHead className="font-bold text-center">Autorização</TableHead>
            <TableHead className="text-right font-bold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id} className="hover:bg-slate-800/30 transition-colors">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-200">{usuario.nome}</span>
                  <span className="text-xs text-slate-500">{usuario.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{getAuthorizationBadge(usuario.autorizacao)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(usuario)}
                  className="text-rose-500 hover:text-rose-400 border-rose-500/20 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
