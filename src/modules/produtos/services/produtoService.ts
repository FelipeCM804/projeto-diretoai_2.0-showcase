
import { supabase } from '@/integrations/supabase/client';
import type { Produto } from '@/types';

export const produtoService = {
  async salvarProduto(produto: Omit<Produto, 'id' | 'data_cadastro' | 'criado_por'>) {
    console.log('🛍️ [produtoService] Iniciando salvamento do produto...', produto);
    
    const { data, error } = await supabase
      .from('produtos_ia')
      .insert([{
        nome: produto.nome,
        categoria: produto.categoria,
        subcategoria: produto.subcategoria,
        genero: produto.genero,
        idade_min: produto.idade_min,
        idade_max: produto.idade_max,
        descricao_curta: produto.descricao_curta,
        descricao_completa: produto.descricao_completa,
        material: produto.material,
        instrucoes_lavagem: produto.instrucoes_lavagem,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ [produtoService] Erro ao salvar produto:', error);
      throw error;
    }

    console.log('✅ [produtoService] Produto salvo com sucesso:', data);
    return data;
  }
};
