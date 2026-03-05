
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthOperations = () => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string, onSuccess?: () => void) => {
    try {
      console.log('🔐 Tentando fazer login...');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error.message);
        toast({
          title: "Erro no login",
          description: error.message === 'Invalid login credentials'
            ? "Email ou senha incorretos"
            : error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Login realizado com sucesso!');
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });

        if (onSuccess) {
          onSuccess();
        }
      }

      return { error };
    } catch (error: any) {
      console.error('❌ Erro inesperado no login:', error);
      const errorMessage = error?.message || 'Erro inesperado no login';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    }
  };

  const createUser = async (email: string, password: string, nome: string, isAdmin: boolean = false) => {
    try {
      console.log('👤 Admin criando novo usuário...');
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: nome
          }
        }
      });

      if (error) {
        console.error('❌ Erro ao criar usuário:', error.message);
        toast({
          title: "Erro ao criar usuário",
          description: error.message === 'User already registered'
            ? "Este email já está cadastrado"
            : error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        console.log('👤 Criando perfil do usuário...');
        const autorizacao = isAdmin ? 'admin' : 'operador';

        const { error: profileError } = await supabase
          .from('perfis')
          .insert({
            id: data.user.id,
            nome: nome,
            email: email,
            autorizacao: autorizacao
          });

        if (profileError) {
          console.error('❌ Erro ao criar perfil do usuário:', profileError);
        } else {
          console.log('✅ Usuário criado com sucesso!', {
            nome,
            email,
            autorizacao
          });
        }

        toast({
          title: "Usuário criado!",
          description: `Usuário ${nome} criado como ${autorizacao} com sucesso.`,
        });
      }

      return { error };
    } catch (error: any) {
      console.error('❌ Erro inesperado ao criar usuário:', error);
      const errorMessage = error?.message || 'Erro inesperado ao criar usuário';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: error?.message || 'Erro inesperado',
        variant: "destructive",
      });
    }
  };

  return {
    signIn,
    createUser,
    signOut
  };
};
