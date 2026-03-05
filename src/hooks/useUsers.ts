import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  autorizacao: string;
  loja_id: string | null;
  criado_em?: string | null;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("perfis")
        .select("*")
        .order("nome");

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de usuários",
          variant: "destructive",
        });
        return;
      }

      // @ts-ignore - casting due to schema update sync
      setUsers(data || []);
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: Omit<UserProfile, "criado_em">) => {
    try {
      const { data, error } = await supabase
        .from("perfis")
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar usuário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o usuário",
          variant: "destructive",
        });
        return null;
      }

      setUsers([...users, data as UserProfile]);
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });
      return data;
    } catch (error) {
      console.error("Erro inesperado:", error);
      return null;
    }
  };

  const updateUser = async (id: string, userData: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from("perfis")
        .update(userData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar usuário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o usuário",
          variant: "destructive",
        });
        return null;
      }

      setUsers(users.map((u) => (u.id === id ? (data as UserProfile) : u)));
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error("Erro inesperado:", error);
      return null;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase.from("perfis").delete().eq("id", id);

      if (error) {
        console.error("Erro ao excluir usuário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o usuário",
          variant: "destructive",
        });
        return false;
      }

      setUsers(users.filter((u) => u.id !== id));
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
      return true;
    } catch (error) {
      console.error("Erro inesperado:", error);
      return false;
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
