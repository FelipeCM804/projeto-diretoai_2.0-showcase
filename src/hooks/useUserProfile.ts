
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  autorizacao: string;
  criado_em?: string | null;
  loja_id?: string | null;
  loja?: {
    nome: string;
    modulo_ativo: string;
  };
}

export const useUserProfile = (user: User | null) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsuario = async (userId: string) => {
    try {
      console.log('🔍 Buscando dados do usuário para ID:', userId);

      const { data, error } = await supabase
        .from('perfis')
        .select('*, loja:lojas(nome, modulo_ativo)')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar dados do usuário:', error);

        if (error.code !== 'PGRST116') {
          toast({
            title: "Erro",
            description: "Erro ao carregar dados do usuário",
            variant: "destructive",
          });
        }
        setUsuario(null);
        return;
      }

      if (!data) {
        console.log('⚠️ Perfil do usuário não encontrado no banco de dados');
        setUsuario(null);
        return;
      }

      console.log('✅ Dados do usuário encontrados:', {
        nome: data.nome,
        email: data.email,
        autorizacao: data.autorizacao,
        isAdmin: data.autorizacao === 'admin'
      });
      // @ts-ignore - casting due to schema update sync
      setUsuario(data);
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar usuário:', error);
      setUsuario(null);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUsuario(user.id).finally(() => {
        setLoading(false);
      });
    } else {
      setUsuario(null);
      setLoading(false);
    }
  }, [user]);

  const createUserProfile = async (authUserId: string, nome: string, email: string, autorizacao: string = 'operador') => {
    try {
      console.log('👤 Criando perfil para usuário:', { authUserId, nome, email, autorizacao });

      const { error } = await supabase
        .from('perfis')
        .insert({
          id: authUserId,
          nome: nome,
          email: email,
          autorizacao: autorizacao
        });

      if (error) {
        console.error('❌ Erro ao criar perfil do usuário:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar perfil do usuário",
          variant: "destructive",
        });
      } else {
        console.log('✅ Perfil criado com sucesso!');
        if (user) {
          await fetchUsuario(user.id);
        }
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao criar perfil:', error);
    }
  };

  const createAdminProfile = async (authUserId: string, nome: string, email: string) => {
    return createUserProfile(authUserId, nome, email, 'admin');
  };

  const isAdmin = usuario?.autorizacao === 'admin';

  return {
    usuario,
    loading,
    isAdmin,
    createUserProfile,
    createAdminProfile,
    refetchUser: () => user ? fetchUsuario(user.id) : null
  };
};
