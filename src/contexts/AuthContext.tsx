
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile, Usuario } from '@/hooks/useUserProfile';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import {
  MOCK_CLIENTES, MOCK_PRODUTOS, MOCK_TRANSACOES,
  MOCK_COLABORADORES, MOCK_FORNECEDORES, MOCK_VENDAS
} from '@/utils/mockData';

// Usuario interface imported from useUserProfile

interface AuthContextType {
  user: User | null;
  session: Session | null;
  usuario: Usuario | null;
  loading: boolean;
  lojaId: string | null;
  moduloAtivo: string | null;
  signIn: (email: string, password: string, onSuccess?: () => void) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPresentationMode: boolean;
  enterPresentationMode: () => void;
  changePresentationModulo: (modulo: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPresentationMode, setIsPresentationMode] = useState(localStorage.getItem('erp_presentation_mode') === 'true');
  const [presentationModulo, setPresentationModulo] = useState<string>(localStorage.getItem('erp_presentation_modulo') || 'completo');


  const { usuario: realUsuario, loading: profileLoading, isAdmin: realIsAdmin } = useUserProfile(isPresentationMode ? null : user);
  const { signIn: originalSignIn, signOut: originalSignOut } = useAuthOperations();

  // Mock Data
  const mockUser: User | null = isPresentationMode ? {
    id: 'mock-user-id',
    email: 'apresentacao@teste.com',
    app_metadata: {},
    user_metadata: { full_name: 'Usuário Demonstração' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User : null;

  const mockUsuario: Usuario | null = isPresentationMode ? {
    id: 'mock-id',
    nome: 'Usuário Demo',
    email: 'demo@erp.com',
    autorizacao: 'admin',
    loja: { id: 'mock-loja-id', nome: 'Loja Apresentação', modulo_ativo: presentationModulo },
    criado_em: new Date().toISOString()
  } as any : null;

  const signIn = async (email: string, password: string, onSuccess?: () => void) => {
    // Interceptar login de apresentação
    if (email === 'apresentacao@teste.com' && password === '123456') {
      enterPresentationMode();
      onSuccess?.();
      return { error: null };
    }

    localStorage.removeItem('erp_presentation_mode');
    localStorage.removeItem('erp_presentation_modulo');
    setIsPresentationMode(false);
    return originalSignIn(email, password, onSuccess);
  };

  const signOut = async () => {
    localStorage.removeItem('erp_presentation_mode');
    localStorage.removeItem('erp_presentation_modulo');
    setIsPresentationMode(false);
    await originalSignOut();
  };

  const enterPresentationMode = () => {
    localStorage.setItem('erp_presentation_mode', 'true');
    setIsPresentationMode(true);
  };

  const changePresentationModulo = (modulo: string) => {
    localStorage.setItem('erp_presentation_modulo', modulo);
    setPresentationModulo(modulo);
  };

  useEffect(() => {
    if (isPresentationMode) {
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isPresentationMode]);

  const finalUser = isPresentationMode ? mockUser : user;
  const finalUsuario = isPresentationMode ? mockUsuario : realUsuario;
  const finalIsAdmin = isPresentationMode ? true : realIsAdmin;
  const finalLoading = isPresentationMode ? false : (loading || profileLoading);

  const value: AuthContextType = {
    user: finalUser,
    session,
    usuario: finalUsuario,
    loading: finalLoading,
    lojaId: finalUsuario?.loja_id || (isPresentationMode ? 'mock-loja-id' : null),
    moduloAtivo: isPresentationMode ? presentationModulo : (finalUsuario?.loja?.modulo_ativo || 'completo'),
    signIn,
    signOut,
    isAdmin: finalIsAdmin,
    isPresentationMode,
    enterPresentationMode,
    changePresentationModulo
  };


  if (!isPresentationMode && !(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 text-center">
        <div className="max-w-md space-y-4 border border-red-500/50 p-8 rounded-xl bg-red-500/10">
          <h1 className="text-2xl font-bold text-red-500">Erro de Configuração</h1>
          <p className="text-slate-300">As variáveis de ambiente do Supabase não foram encontradas.</p>
          <div className="text-sm text-slate-400 bg-black/30 p-4 rounded text-left font-mono">
            VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ OK' : '❌ Ausente'}<br />
            VITE_SUPABASE_KEY: {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ OK' : '❌ Ausente'}
          </div>
          <p className="text-xs text-slate-500 italic">Por favor, configure-as no painel da Vercel e faça um novo deploy.</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
