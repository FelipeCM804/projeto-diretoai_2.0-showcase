import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AsaasValoresPorData } from '@/types/asaas';

export const useAsaasValoresPorData = () => {
  return useQuery({
    queryKey: ['asaas-valores-por-data'],
    queryFn: async (): Promise<AsaasValoresPorData[]> => {
      const { data, error } = await supabase
        .from('vw_valores_por_data')
        .select('*')
        .order('data', { ascending: true });

      if (error) {
        console.error('Erro ao buscar valores por data ASAAS:', error);
        throw error;
      }

      const processedData = (data || []).map(item => ({
        data: item.data || '',
        total_recebido: item.total_recebido || 0,
        total_pendente: item.total_pendente || 0
      }));

      return processedData;
    },
  });
};
