import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AsaasResumo, FinancialSummary } from '@/types/asaas';

export const useAsaasResumo = () => {
  return useQuery({
    queryKey: ['asaas-resumo'],
    queryFn: async (): Promise<FinancialSummary> => {
      const { data, error } = await supabase
        .from('vw_resumo_pedidos_asaas')
        .select('*');

      if (error) {
        console.error('Erro ao buscar resumo ASAAS:', error);
        throw error;
      }

      const resumoData = data || [];
      
      const totalRecebido = resumoData
        .filter(item => item.status === 'RECEIVED')
        .reduce((sum, item) => sum + (item.total_valor || 0), 0);
      
      const totalPendente = resumoData
        .filter(item => item.status === 'PENDING')
        .reduce((sum, item) => sum + (item.total_valor || 0), 0);
      
      const totalGeral = totalRecebido + totalPendente;

      return {
        totalRecebido,
        totalPendente,
        totalGeral
      };
    },
  });
};
