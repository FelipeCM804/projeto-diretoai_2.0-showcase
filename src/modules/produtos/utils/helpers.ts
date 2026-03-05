
import type { VarianteProduto } from '@/types';

export const createEmptyVariante = (produtoId: number): VarianteProduto => {
  return {
    produto_id: produtoId,
    tamanho: "",
    cor: "",
    codigo_cor: "",
    preco: 0,
    preco_promocional: 0,
    em_promocao: false,
    quantidade: 0,
    url_imagem: "",
  };
};

export const findVarianteIndex = (variantes: VarianteProduto[], variante: VarianteProduto): number => {
  return variantes.findIndex(v => 
    v.tamanho === variante.tamanho && 
    v.cor === variante.cor && 
    v.preco === variante.preco
  );
};

export const logProdutoState = (context: string, data: any) => {
  console.log(`📊 [${context}] Estado atual:`, data);
};
