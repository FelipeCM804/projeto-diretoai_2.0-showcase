
-- Criar função de segurança definida para verificar se um usuário é admin
-- Esta função executa com privilégios elevados e evita recursão RLS
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_authorization INTEGER;
BEGIN
  -- Busca diretamente a autorização do usuário atual
  SELECT autorizacao INTO user_authorization
  FROM public.usuarios_sistema
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  -- Retorna true se o usuário tem autorização de admin (1)
  RETURN COALESCE(user_authorization = 1, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Remove as políticas existentes que podem causar recursão
DROP POLICY IF EXISTS "Allow user access" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Allow profile creation" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Allow profile updates" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Allow admin delete" ON public.usuarios_sistema;

-- Política para SELECT: usuários podem ver seus próprios dados OU admins podem ver todos
CREATE POLICY "Users can view own data or admins can view all" 
ON public.usuarios_sistema 
FOR SELECT 
TO authenticated
USING (
  auth_user_id = auth.uid() 
  OR 
  public.is_current_user_admin()
);

-- Política para INSERT: usuários podem criar seus próprios perfis OU admins podem criar qualquer perfil
CREATE POLICY "Users can create own profile or admins can create any" 
ON public.usuarios_sistema 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth_user_id = auth.uid()
  OR 
  public.is_current_user_admin()
);

-- Política para UPDATE: usuários podem atualizar seus próprios dados OU admins podem atualizar qualquer um
CREATE POLICY "Users can update own data or admins can update any" 
ON public.usuarios_sistema 
FOR UPDATE 
TO authenticated
USING (
  auth_user_id = auth.uid()
  OR 
  public.is_current_user_admin()
);

-- Política para DELETE: apenas admins podem deletar
CREATE POLICY "Only admins can delete users" 
ON public.usuarios_sistema 
FOR DELETE 
TO authenticated
USING (
  public.is_current_user_admin()
);
