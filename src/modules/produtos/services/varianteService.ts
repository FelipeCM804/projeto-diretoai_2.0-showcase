
import { supabase } from '@/integrations/supabase/client';
import type { VarianteProduto } from '@/types';

export const varianteService = {
  async salvarVariante(variante: Omit<VarianteProduto, 'id' | 'criado_por'>) {
    console.log('🎨 [varianteService] Iniciando salvamento da variante...', {
      produto_id: variante.produto_id,
      tamanho: variante.tamanho,
      cor: variante.cor,
      preco: variante.preco,
      quantidade: variante.quantidade,
      hasImage: !!variante.url_imagem,
      imageUrl: variante.url_imagem || 'Não informado',
      dadosCompletos: variante
    });
    
    // Verificação crítica do produto_id
    if (!variante.produto_id || variante.produto_id === 0) {
      const errorMsg = 'Produto ID é obrigatório para salvar a variante';
      console.error('❌ [varianteService]', errorMsg, {
        varianteRecebida: variante,
        produto_id: variante.produto_id,
        tipoProdutoId: typeof variante.produto_id
      });
      throw new Error(errorMsg);
    }

    // Validação adicional de campos obrigatórios
    if (!variante.tamanho || !variante.cor) {
      const errorMsg = 'Tamanho e cor são obrigatórios';
      console.error('❌ [varianteService]', errorMsg, {
        tamanho: variante.tamanho,
        cor: variante.cor
      });
      throw new Error(errorMsg);
    }

    if (!variante.preco || variante.preco <= 0) {
      const errorMsg = 'Preço deve ser maior que zero';
      console.error('❌ [varianteService]', errorMsg, {
        preco: variante.preco,
        tipoPreco: typeof variante.preco
      });
      throw new Error(errorMsg);
    }
    
    console.log('📤 [varianteService] Enviando dados para o banco:', {
      produto_id: variante.produto_id,
      tamanho: variante.tamanho,
      cor: variante.cor,
      codigo_cor: variante.codigo_cor,
      preco: variante.preco,
      preco_promocional: variante.preco_promocional,
      em_promocao: variante.em_promocao,
      quantidade: variante.quantidade,
      url_imagem: variante.url_imagem,
    });

    const { data, error } = await supabase
      .from('variantes_produto_ia')
      .insert([{
        produto_id: variante.produto_id,
        tamanho: variante.tamanho,
        cor: variante.cor,
        codigo_cor: variante.codigo_cor,
        preco: variante.preco,
        preco_promocional: variante.preco_promocional,
        em_promocao: variante.em_promocao,
        quantidade: variante.quantidade,
        url_imagem: variante.url_imagem,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ [varianteService] Erro do Supabase ao salvar variante:', {
        error,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details,
        dadosEnviados: variante
      });
      throw error;
    }

    console.log('✅ [varianteService] Variante salva com sucesso no banco:', data);
    return data;
  },

  async atualizarVariante(variante: VarianteProduto) {
    console.log('✏️ [varianteService] Iniciando atualização da variante no banco...', {
      id: variante.id,
      produto_id: variante.produto_id,
      tamanho: variante.tamanho,
      cor: variante.cor,
      preco: variante.preco,
      quantidade: variante.quantidade,
      hasImage: !!variante.url_imagem,
      dadosCompletos: variante
    });
    
    if (!variante.id) {
      throw new Error('ID da variante é obrigatório para atualização');
    }

    const { data, error } = await supabase
      .from('variantes_produto_ia')
      .update({
        tamanho: variante.tamanho,
        cor: variante.cor,
        codigo_cor: variante.codigo_cor,
        preco: variante.preco,
        preco_promocional: variante.preco_promocional,
        em_promocao: variante.em_promocao,
        quantidade: variante.quantidade,
        url_imagem: variante.url_imagem,
      })
      .eq('id', variante.id)
      .select()
      .single();

    if (error) {
      console.error('❌ [varianteService] Erro do Supabase ao atualizar variante:', error);
      throw error;
    }

    console.log('✅ [varianteService] Variante atualizada com sucesso no banco:', data);
    return data;
  }
};