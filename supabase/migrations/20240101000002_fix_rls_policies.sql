
-- Remove a função problemática que causa recursão
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Remove todas as políticas existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.usuarios_sistema;
DROP POLICY IF EXISTS "Admins can view all users" ON public.usuarios_sistema;

-- Desabilita RLS temporariamente
ALTER TABLE public.usuarios_sistema DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS
ALTER TABLE public.usuarios_sistema ENABLE ROW LEVEL SECURITY;

-- Política simples para SELECT: permite que usuários vejam seus próprios dados OU sejam admins
CREATE POLICY "Allow user access" 
ON public.usuarios_sistema 
FOR SELECT 
TO authenticated
USING (
  auth_user_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema admin_check 
    WHERE admin_check.auth_user_id = auth.uid() 
    AND admin_check.autorizacao = 1
  )
);

-- Política para INSERT: usuários autenticados podem criar perfis
CREATE POLICY "Allow profile creation" 
ON public.usuarios_sistema 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth_user_id = auth.uid()
  OR 
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema admin_check 
    WHERE admin_check.auth_user_id = auth.uid() 
    AND admin_check.autorizacao = 1
  )
);

-- Política para UPDATE: usuários podem atualizar seus próprios dados ou admins podem atualizar qualquer um
CREATE POLICY "Allow profile updates" 
ON public.usuarios_sistema 
FOR UPDATE 
TO authenticated
USING (
  auth_user_id = auth.uid()
  OR 
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema admin_check 
    WHERE admin_check.auth_user_id = auth.uid() 
    AND admin_check.autorizacao = 1
  )
);

-- Política para DELETE: apenas admins podem deletar
CREATE POLICY "Allow admin delete" 
ON public.usuarios_sistema 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios_sistema admin_check 
    WHERE admin_check.auth_user_id = auth.uid() 
    AND admin_check.autorizacao = 1
  )
);
