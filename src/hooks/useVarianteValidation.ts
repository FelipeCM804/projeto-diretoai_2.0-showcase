
import type { VarianteProduto } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useVarianteValidation = () => {
  const { toast } = useToast();

  const validateVariante = (currentVariante: VarianteProduto, loading: boolean) => {
    console.log('➕ [useVarianteValidation] Iniciando validação de variante');
    console.log('🔍 [useVarianteValidation] Dados da variante para validação:', {
      produto_id: currentVariante.produto_id,
      tamanho: currentVariante.tamanho,
      cor: currentVariante.cor,
      preco: currentVariante.preco,
      quantidade: currentVariante.quantidade,
      url_imagem: currentVariante.url_imagem,
      temImagemUrl: !!currentVariante.url_imagem,
      loading
    });
    
    // Validação crítica do produto_id
    if (!currentVariante.produto_id || currentVariante.produto_id === 0) {
      const errorMsg = 'Produto deve ser salvo antes de adicionar variantes';
      console.error('❌ [useVarianteValidation] Erro de produto_id:', errorMsg);
      toast({
        title: "Erro de validação",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
    
    // Validação de campos obrigatórios com feedback visual
    const camposVazios = [];
    if (!currentVariante.tamanho || currentVariante.tamanho.trim() === '') {
      camposVazios.push('Tamanho');
    }
    if (!currentVariante.cor || currentVariante.cor.trim() === '') {
      camposVazios.push('Cor');
    }
    
    if (camposVazios.length > 0) {
      const errorMsg = `Campos obrigatórios não preenchidos: ${camposVazios.join(', ')}`;
      console.error('❌ [useVarianteValidation] Erro de validação:', {
        camposVazios,
        tamanhoAtual: `"${currentVariante.tamanho}"`,
        corAtual: `"${currentVariante.cor}"`
      });
      toast({
        title: "Campos obrigatórios",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
    
    // Validação de preço
    if (!currentVariante.preco || currentVariante.preco <= 0) {
      const errorMsg = 'Preço deve ser maior que zero';
      console.error('❌ [useVarianteValidation] Erro de preço:', currentVariante.preco);
      toast({
        title: "Erro de validação",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
    
    console.log('✅ [useVarianteValidation] Todas as validações passaram');
    return true;
  };

  return { validateVariante };
};
