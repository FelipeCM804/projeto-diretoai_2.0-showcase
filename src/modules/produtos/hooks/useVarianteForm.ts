import { useProdutoContext } from '../contexts/ProdutoContext';
import { useProdutoOperations } from './useProdutoOperations';
import { forceUpdatePersistentState } from '@/hooks/usePersistentState';
import type { VarianteProduto } from '@/types';
import { useEffect } from 'react';

export const useVarianteForm = () => {
  const {
    produto,
    currentVariante,
    setCurrentVariante,
    variantes,
    setVariantes,
    editandoVariante,
    setEditandoVariante,
    varianteOriginalIndex,
    setVarianteOriginalIndex,
    currentStep
  } = useProdutoContext();
  
  const { salvarVariante, atualizarVariante, loading } = useProdutoOperations();

  // Filtrar variantes apenas do produto atual
  const variantesFiltradasDoProdutoAtual = variantes.filter(variante => {
    if (!produto.id) return false;
    return variante.produto_id === produto.id;
  });

  // Limpar variantes quando mudar de produto ou resetar
  useEffect(() => {
    if (produto.id && variantes.length > 0) {
      const variantesDoOutroProduto = variantes.some(v => v.produto_id !== produto.id);
      if (variantesDoOutroProduto) {
        console.log('🧹 [useVarianteForm] Limpando variantes de outros produtos');
        const variantesAtuais = variantes.filter(v => v.produto_id === produto.id);
        setVariantes(variantesAtuais);
      }
    }
  }, [produto.id]);

  const handleVarianteChange = (field: keyof VarianteProduto, value: string | number | boolean) => {
    console.log(`🎨 [useVarianteForm] Alterando campo da variante ${field} para:`, value);
    
    if (currentStep === 2) {
      setCurrentVariante(prev => {
        const novaVariante = { ...prev, [field]: value };
        console.log('🔄 [useVarianteForm] Nova variante state:', novaVariante);
        return novaVariante;
      });
    } else {
      console.warn('⚠️ [useVarianteForm] Tentativa de alterar variante fora do step 2');
    }
  };

  const resetarVarianteForm = () => {
    console.log('🧹 [useVarianteForm] Resetando formulário de variante');
    
    const novaVarianteLimpa = {
      produto_id: produto.id!,
      tamanho: "",
      cor: "",
      codigo_cor: "",
      preco: 0,
      preco_promocional: 0,
      em_promocao: false,
      quantidade: 0,
      url_imagem: "",
    };
    
    setCurrentVariante(novaVarianteLimpa);
    forceUpdatePersistentState('produtos_current_variante', novaVarianteLimpa);
    setEditandoVariante(false);
    setVarianteOriginalIndex(null);
    
    console.log('✅ [useVarianteForm] Formulário resetado:', novaVarianteLimpa);
  };

  const handleAdicionarVariante = async () => {
    console.log('🎨 [useVarianteForm] Iniciando adição/edição de variante:', {
      currentVariante,
      editandoVariante,
      varianteOriginalIndex
    });
    
    if (!produto.id || currentStep !== 2) {
      console.error('❌ [useVarianteForm] Estado inválido para salvar variante');
      return;
    }
    
    try {
      if (editandoVariante && varianteOriginalIndex !== null) {
        const varianteAtualizada = await atualizarVariante(currentVariante);
        
        setVariantes(prev => {
          const novasVariantes = prev.filter(v => v.produto_id === produto.id);
          novasVariantes[varianteOriginalIndex] = varianteAtualizada;
          console.log('📝 [useVarianteForm] Lista atualizada (edição):', novasVariantes);
          return novasVariantes;
        });
      } else {
        const varianteSalva = await salvarVariante(currentVariante);
        console.log('✅ [useVarianteForm] Variante salva:', varianteSalva);
        
        setVariantes(prev => {
          const variantesDoOutroProduto = prev.filter(v => v.produto_id !== produto.id);
          const variantesAtuais = prev.filter(v => v.produto_id === produto.id);
          const novasVariantes = [...variantesDoOutroProduto, ...variantesAtuais, varianteSalva];
          console.log('📝 [useVarianteForm] Lista atualizada (nova):', novasVariantes);
          return novasVariantes;
        });
      }
      
      resetarVarianteForm();
      
    } catch (error) {
      console.error('❌ [useVarianteForm] Erro ao salvar variante:', error);
    }
  };

  const handleEditarVariante = (variante: VarianteProduto) => {
    console.log('✏️ [useVarianteForm] Carregando variante para edição:', variante);
    
    const index = variantesFiltradasDoProdutoAtual.findIndex(v => 
      v.tamanho === variante.tamanho && 
      v.cor === variante.cor && 
      v.preco === variante.preco
    );
    
    if (index === -1) {
      console.error('❌ [useVarianteForm] Variante não encontrada para edição');
      return;
    }
    
    setCurrentVariante({
      ...variante,
      produto_id: produto.id!
    });
    
    setEditandoVariante(true);
    setVarianteOriginalIndex(index);
    
    console.log('🔄 [useVarianteForm] Estado de edição configurado:', { editandoVariante: true, index });
  };

  return {
    currentVariante,
    variantes: variantesFiltradasDoProdutoAtual,
    editandoVariante,
    handleVarianteChange,
    handleAdicionarVariante,
    handleEditarVariante,
    resetarVarianteForm,
    loading
  };
};
