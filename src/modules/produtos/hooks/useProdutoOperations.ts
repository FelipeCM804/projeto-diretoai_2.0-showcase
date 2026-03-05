
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { produtoService } from '../services/produtoService';
import { varianteService } from '../services/varianteService';
import type { Produto, VarianteProduto } from '@/types';

export const useProdutoOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const salvarProduto = async (produto: Omit<Produto, 'id' | 'data_cadastro' | 'criado_por'>) => {
    setLoading(true);
    try {
      const data = await produtoService.salvarProduto(produto);
      
      toast({
        title: "Produto salvo!",
        description: "Produto cadastrado com sucesso no banco de dados.",
      });

      return data;
    } catch (error: any) {
      console.error('❌ [useProdutoOperations] Erro crítico ao salvar produto:', error);
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível salvar o produto no banco de dados.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const salvarVariante = async (variante: Omit<VarianteProduto, 'id' | 'criado_por'>) => {
    setLoading(true);
    try {
      const data = await varianteService.salvarVariante(variante);
      
      toast({
        title: "Variante adicionada!",
        description: "Variante salva com sucesso no banco de dados.",
      });

      return data;
    } catch (error: any) {
      console.error('❌ [useProdutoOperations] Erro crítico ao salvar variante:', {
        error,
        errorMessage: error?.message,
        errorCode: error?.code,
        varianteDados: variante
      });
      
      let errorMessage = "Não foi possível salvar a variante no banco de dados.";
      if (error?.message) {
        if (error.message.includes('produto_id')) {
          errorMessage = "Erro: Produto deve ser salvo antes de adicionar variantes.";
        } else if (error.message.includes('violates')) {
          errorMessage = "Erro: Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const atualizarVariante = async (variante: VarianteProduto) => {
    setLoading(true);
    try {
      const data = await varianteService.atualizarVariante(variante);
      
      toast({
        title: "Variante atualizada!",
        description: "Alterações salvas com sucesso no banco de dados.",
      });

      return data;
    } catch (error: any) {
      console.error('❌ [useProdutoOperations] Erro crítico ao atualizar variante:', error);
      
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível atualizar a variante no banco de dados.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    salvarProduto,
    salvarVariante,
    atualizarVariante,
    loading
  };
};
