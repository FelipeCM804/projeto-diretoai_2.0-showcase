
-- 1. Unificação da Tabela de Perfis
-- Vamos usar 'perfis' como a tabela principal, pois é a que o Onboarding já está tentando usar.
-- Se 'usuarios_sistema' existir, vamos migrar os dados e deletá-la depois.

-- Adiciona colunas necessárias à tabela 'perfis' se elas não existirem
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'perfis' AND column_name = 'nome') THEN
        ALTER TABLE public.perfis ADD COLUMN nome TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'perfis' AND column_name = 'email') THEN
        ALTER TABLE public.perfis ADD COLUMN email TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'perfis' AND column_name = 'autorizacao') THEN
        ALTER TABLE public.perfis ADD COLUMN autorizacao TEXT DEFAULT 'operador';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'perfis' AND column_name = 'loja_id') THEN
        ALTER TABLE public.perfis ADD COLUMN loja_id UUID REFERENCES public.lojas(id);
    END IF;

    -- Renomeia auth_user_id para id se necessário (geralmente perfis.id já é o auth.uid())
    -- No types.ts, perfis.id é a PK e FK para users.id. 
END $$;

-- 2. Limpeza e Migração de dados de usuarios_sistema para perfis (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usuarios_sistema') THEN
        -- Tenta migrar dados básicos
        INSERT INTO public.perfis (id, nome, email, autorizacao)
        SELECT auth_user_id, nome, email, 
               CASE WHEN autorizacao = 1 THEN 'admin' ELSE 'operador' END
        FROM public.usuarios_sistema
        ON CONFLICT (id) DO UPDATE 
        SET nome = EXCLUDED.nome, 
            email = EXCLUDED.email, 
            autorizacao = EXCLUDED.autorizacao;
            
        -- Drop da tabela antiga
        DROP TABLE public.usuarios_sistema CASCADE;
    END IF;
END $$;

-- 3. Adição de loja_id em todas as tabelas Core
DO $$
DECLARE
    t TEXT;
    tables_to_update TEXT[] := ARRAY['clientes', 'produtos', 'vendas', 'transacoes', 'colaboradores', 'fornecedores', 'movimentacoes_estoque', 'reservas_ia'];
BEGIN
    FOREACH t IN ARRAY tables_to_update
    LOOP
        EXECUTE format('
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = %L AND column_name = ''loja_id'') THEN
                ALTER TABLE public.%I ADD COLUMN loja_id UUID REFERENCES public.lojas(id);
            END IF;', t, t);
    END LOOP;
END $$;

-- 4. Habilitar RLS em todas as tabelas
DO $$
DECLARE
    t TEXT;
    tables_to_update TEXT[] := ARRAY['perfis', 'clientes', 'produtos', 'vendas', 'transacoes', 'colaboradores', 'fornecedores', 'movimentacoes_estoque', 'reservas_ia'];
BEGIN
    FOREACH t IN ARRAY tables_to_update
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        -- Remover políticas antigas para evitar conflitos
        EXECUTE format('DROP POLICY IF EXISTS "Isolamento por loja" ON public.%I;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Isolado por loja_id" ON public.%I;', t);
        
        -- Criar nova política baseada no perfil do usuário
        EXECUTE format('
            CREATE POLICY "Isolamento por loja" ON public.%I
            FOR ALL
            TO authenticated
            USING (
                loja_id = (SELECT loja_id FROM public.perfis WHERE id = auth.uid())
                OR 
                -- Permitir que super-admins (sem loja_id) vejam tudo (opcional)
                (SELECT loja_id FROM public.perfis WHERE id = auth.uid()) IS NULL
            )
            WITH CHECK (
                loja_id = (SELECT loja_id FROM public.perfis WHERE id = auth.uid())
            );', t, t);
    END LOOP;
END $$;

-- 5. Política especial para a tabela de Perfis
-- Usuários podem ver seu próprio perfil e perfis da mesma loja
DROP POLICY IF EXISTS "Acesso ao perfil" ON public.perfis;
CREATE POLICY "Acesso ao perfil" ON public.perfis
FOR ALL 
TO authenticated
USING (
    id = auth.uid() 
    OR 
    loja_id = (SELECT loja_id FROM public.perfis WHERE id = auth.uid())
);
