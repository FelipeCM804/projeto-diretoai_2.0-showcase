
import type { Produto, VarianteProduto } from '@/types';

export const validateProduto = (produto: Produto): boolean => {
  return !!(produto.nome && produto.categoria && produto.genero);
};

export const validateVariante = (variante: VarianteProduto): boolean => {
  return !!(
    variante.tamanho && 
    variante.cor && 
    variante.preco > 0 && 
    variante.quantidade >= 0 &&
    variante.produto_id > 0
  );
};

export const validateVarianteForSave = (variante: VarianteProduto): string | null => {
  if (!variante.tamanho) return "Tamanho é obrigatório";
  if (!variante.cor) return "Cor é obrigatória";
  if (!variante.preco || variante.preco <= 0) return "Preço deve ser maior que zero";
  if (!variante.produto_id || variante.produto_id === 0) return "Produto deve ser salvo primeiro";
  return null;
};
