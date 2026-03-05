
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useAuthOperations } from '@/hooks/useAuthOperations';

export const UserMenu = () => {
  const { usuario } = useAuth();
  const { signOut } = useAuthOperations();

  const handleLogout = async () => {
    try {
      console.log("🚪 Iniciando logout...");
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!usuario) return null;

  return (
    <Button 
      onClick={handleLogout} 
      variant="ghost" 
      className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/20"
    >
      <LogOut className="w-4 h-4" />
      <span>Sair</span>
    </Button>
  );
};
