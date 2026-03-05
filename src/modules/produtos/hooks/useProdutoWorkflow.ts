
import { useEffect } from 'react';
import { useProdutoContext } from '../contexts/ProdutoContext';
import { clearPersistentState } from '@/hooks/usePersistentState';

export const useProdutoWorkflow = () => {
  const {
    currentStep,
    setCurrentStep,
    produto,
    produtoSalvo,
    currentVariante,
    setCurrentVariante,
    setProduto,
    setVariantes,
    setCurrentVariante: setCurrentVarianteState,
    setProdutoSalvo,
    setEditandoVariante,
    setVarianteOriginalIndex
  } = useProdutoContext();

  // Detectar retorno de câmera e restaurar contexto
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📱 [useProdutoWorkflow] App voltou para foreground');
        
        if (currentStep === 2 && (!produto.id || !produtoSalvo)) {
          console.warn('⚠️ [useProdutoWorkflow] Estado inconsistente, voltando para step 1');
          setCurrentStep(1);
        }
        
        if (currentStep === 2 && produto.id && currentVariante.produto_id !== produto.id) {
          console.log('🔧 [useProdutoWorkflow] Corrigindo produto_id na variante');
          setCurrentVariante(prev => ({
            ...prev,
            produto_id: produto.id!
          }));
        }
      }
    };

    const handleFocus = () => {
      console.log('🎯 [useProdutoWorkflow] Window focus detectado');
      if (currentStep === 2 && produto.id && currentVariante.produto_id !== produto.id) {
        console.log('🔧 [useProdutoWorkflow] Sincronizando produto_id no focus');
        setCurrentVariante(prev => ({
          ...prev,
          produto_id: produto.id!
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentStep, produto.id, produtoSalvo, currentVariante.produto_id]);

  const voltarParaStep1 = () => {
    console.log('🔄 [useProdutoWorkflow] Iniciando novo cadastro de produto - limpando tudo');
    
    // Limpar TODOS os estados persistentes para começar um cadastro completamente novo
    clearPersistentState('produtos_current_step');
    clearPersistentState('produtos_produto_data');
    clearPersistentState('produtos_variantes_list');
    clearPersistentState('produtos_current_variante');
    clearPersistentState('produtos_produto_salvo');
    
    // Resetar todos os estados para valores iniciais
    setProduto({
      nome: "",
      categoria: "",
      subcategoria: "",
      genero: "",
      idade_min: "",
      idade_max: "",
      descricao_curta: "",
      descricao_completa: "",
      material: "",
      instrucoes_lavagem: "",
    });
    
    setVariantes([]);
    
    setCurrentVarianteState({
      produto_id: 0,
      tamanho: "",
      cor: "",
      codigo_cor: "",
      preco: 0,
      preco_promocional: 0,
      em_promocao: false,
      quantidade: 0,
      url_imagem: "",
    });
    
    setProdutoSalvo(false);
    setEditandoVariante(false);
    setVarianteOriginalIndex(null);
    setCurrentStep(1);
    
    console.log('✅ [useProdutoWorkflow] Novo cadastro iniciado - todos os estados limpos');
  };

  const resetarFormulario = () => {
    console.log('🔄 [useProdutoWorkflow] Resetando formulário completo');
    
    clearPersistentState('produtos_current_step');
    clearPersistentState('produtos_produto_data');
    clearPersistentState('produtos_variantes_list');
    clearPersistentState('produtos_current_variante');
    clearPersistentState('produtos_produto_salvo');
    
    setProduto({
      nome: "",
      categoria: "",
      subcategoria: "",
      genero: "",
      idade_min: "",
      idade_max: "",
      descricao_curta: "",
      descricao_completa: "",
      material: "",
      instrucoes_lavagem: "",
    });
    setVariantes([]);
    setCurrentVarianteState({
      produto_id: 0,
      tamanho: "",
      cor: "",
      codigo_cor: "",
      preco: 0,
      preco_promocional: 0,
      em_promocao: false,
      quantidade: 0,
      url_imagem: "",
    });
    setProdutoSalvo(false);
    setCurrentStep(1);
    setEditandoVariante(false);
    setVarianteOriginalIndex(null);
  };

  const isStepComplete = (step: number) => {
    if (step === 1) return produtoSalvo;
    return false;
  };

  return {
    currentStep,
    setCurrentStep,
    voltarParaStep1,
    resetarFormulario,
    isStepComplete
  };
};
