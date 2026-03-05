import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AsaasPedido } from '@/types/asaas';

export const useAsaasPedidos = () => {
  return useQuery({
    queryKey: ['asaas-pedidos'],
    queryFn: async (): Promise<AsaasPedido[]> => {
      const { data, error } = await supabase
        .from('asaas_pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos ASAAS:', error);
        throw error;
      }

      return data || [];
    },
  });
};
