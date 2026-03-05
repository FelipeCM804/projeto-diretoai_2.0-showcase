
import { useProdutoContext } from '../contexts/ProdutoContext';
import { useProdutoOperations } from './useProdutoOperations';
import type { Produto } from '@/types';

export const useProdutoForm = () => {
  const { produto, setProduto, setProdutoSalvo, setCurrentStep, setCurrentVariante } = useProdutoContext();
  const { salvarProduto, loading } = useProdutoOperations();

  const handleProdutoChange = (field: keyof Produto, value: string) => {
    console.log(`🔄 [useProdutoForm] Alterando campo ${field} para:`, value);
    setProduto(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvarProduto = async () => {
    console.log('💾 [useProdutoForm] Iniciando salvamento do produto:', produto);
    try {
      const produtoSalvoData = await salvarProduto(produto);
      console.log('✅ [useProdutoForm] Produto salvo com sucesso:', produtoSalvoData);
      
      setProduto(prev => ({ ...prev, id: produtoSalvoData.id }));
      setCurrentVariante(prev => ({ 
        ...prev, 
        produto_id: produtoSalvoData.id 
      }));
      setProdutoSalvo(true);
      setCurrentStep(2);
      
      console.log('🔄 [useProdutoForm] Estado atualizado - produto_id na variante:', produtoSalvoData.id);
    } catch (error) {
      console.error('❌ [useProdutoForm] Erro ao salvar produto:', error);
    }
  };

  return {
    produto,
    handleProdutoChange,
    handleSalvarProduto,
    loading
  };
};
