
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, nome, autorizacao } = await req.json()

    // Criar usuário usando Admin API
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        nome: nome
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário:', authError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: authError.message === 'User already registered' ? 'Este email já está cadastrado' : authError.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    if (authData.user) {
      // Criar perfil do usuário
      const { error: profileError } = await supabaseClient
        .from('usuarios_sistema')
        .insert({
          auth_user_id: authData.user.id,
          nome: nome,
          email: email,
          autorizacao: autorizacao
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Usuário criado mas erro ao salvar perfil' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Usuário ${nome} criado com sucesso`,
          user: authData.user 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro inesperado ao criar usuário' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )

  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro interno do servidor' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
