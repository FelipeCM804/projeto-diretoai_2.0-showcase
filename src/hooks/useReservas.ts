
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Reserva } from "@/types";
import { MOCK_RESERVAS } from "@/utils/mockData";

export const useReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingReservas, setLoadingReservas] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const { user, isPresentationMode, lojaId } = useAuth();

  const buscarReservasAtivasComDetalhesDoProduto = async () => {
    try {
      if (isPresentationMode) {
        console.log('🎭 Modo Apresentação: Usando mock para reservas');
        return MOCK_RESERVAS;
      }
      console.log('🔍 Iniciando busca de reservas ativas...');

      // Usar a view vw_reservas_ativas que já tem todos os JOINs e filtros
      let query = supabase
        .from('vw_reservas_ativas' as any)
        .select('*')
        .order('data_reserva', { ascending: false });

      if (lojaId) {
        query = (query as any).eq('loja_id', lojaId);
      }

      const { data, error } = await (query as any);

      if (error) {
        console.error('❌ Erro ao buscar reservas:', error.message);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as reservas.",
          variant: "destructive",
        });
        return [];
      }

      console.log('📊 Dados brutos da view vw_reservas_ativas:', data);

      if (!data || data.length === 0) {
        console.log('📭 Nenhuma reserva ativa encontrada');
        return [];
      }

      // Validação e formatação mais robusta dos dados
      const resultadosFormatados = data
        .filter(reserva => {
          const hasValidId = reserva.id != null && !isNaN(Number(reserva.id)) && Number(reserva.id) > 0;
          if (!hasValidId) {
            console.warn('⚠️ Reserva com ID inválido encontrada:', reserva);
          }
          return hasValidId;
        })
        .map(reserva => {
          const formattedReserva = {
            id: Number(reserva.id),
            Produto: String(reserva.produto || 'Produto não informado'),
            Nome: String(reserva.nome || 'Nome não informado'),
            Whatsapp: String(reserva.whatsapp || 'WhatsApp não informado'),
            "Data Reserva": String(reserva.data_reserva || ''),
            "Data de Expiração": String(reserva.expiracao || ''),
            Status: String(reserva.status || 'Reservado')
          };

          console.log('✅ Reserva formatada:', formattedReserva);
          return formattedReserva;
        });

      console.log(`📋 Total de reservas válidas formatadas: ${resultadosFormatados.length}`);
      return resultadosFormatados;

    } catch (err) {
      console.error('💥 Erro inesperado ao buscar reservas:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar as reservas.",
        variant: "destructive",
      });
      return [];
    }
  };

  const loadReservas = async () => {
    setLoading(true);
    const reservasData = await buscarReservasAtivasComDetalhesDoProduto();
    setReservas(reservasData);
    setLoading(false);
  };

  const refreshReservas = async () => {
    setRefreshing(true);
    const reservasData = await buscarReservasAtivasComDetalhesDoProduto();
    setReservas(reservasData);
    setRefreshing(false);
    toast({
      title: "Atualizado!",
      description: "Lista de reservas atualizada com sucesso.",
    });
  };

  const handleMarcarEntregue = async (reservaId: number) => {
    try {
      console.log('🚀 Iniciando processo de marcar como entregue');
      console.log('🔢 ID recebido:', reservaId, 'Tipo:', typeof reservaId);
      console.log('👤 Usuário logado:', user?.id);

      // Validação robusta do ID
      if (!reservaId || isNaN(reservaId) || reservaId <= 0 || !Number.isInteger(reservaId)) {
        console.error('❌ ID inválido - detalhes:', {
          reservaId,
          type: typeof reservaId,
          isNaN: isNaN(reservaId),
          isInteger: Number.isInteger(reservaId),
          isPositive: reservaId > 0
        });
        toast({
          title: "Erro",
          description: "ID da reserva inválido.",
          variant: "destructive",
        });
        return;
      }

      // Verificar se há usuário logado
      if (!user?.id) {
        console.error('❌ Usuário não está logado');
        toast({
          title: "Erro",
          description: "Você precisa estar logado para realizar esta ação.",
          variant: "destructive",
        });
        return;
      }

      // Verificar se a reserva existe na lista atual
      const reservaExistente = reservas.find(r => r.id === reservaId);
      if (!reservaExistente) {
        console.error('❌ Reserva não encontrada na lista atual:', reservaId);
        toast({
          title: "Erro",
          description: "Reserva não encontrada.",
          variant: "destructive",
        });
        return;
      }

      // Verificar se já está sendo processada
      if (loadingReservas.has(reservaId)) {
        console.log('⏳ Reserva já está sendo processada:', reservaId);
        return;
      }

      // Adicionar ao estado de loading
      setLoadingReservas(prev => new Set([...prev, reservaId]));

      console.log('💾 Atualizando status da reserva ID:', reservaId);

      // Primeiro, vamos verificar se a reserva existe antes de atualizar
      const { data: existingReserva, error: checkError } = await (supabase
        .from('reservas_ia' as any)
        .select('id, status')
        .eq('id', reservaId as any)
        .single() as any);

      if (checkError) {
        console.error('❌ Erro ao verificar reserva existente:', checkError);
        toast({
          title: "Erro",
          description: `Reserva não encontrada no banco: ${checkError.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!existingReserva) {
        console.error('❌ Reserva não existe no banco:', reservaId);
        toast({
          title: "Erro",
          description: "Reserva não encontrada no banco de dados.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Reserva encontrada:', existingReserva);

      // Agora atualizar o status E registrar quem entregou
      const { data: updateData, error: updateError } = await (supabase
        .from('reservas_ia' as any)
        .update({
          status: 'Entregue',
          entregue_por: user.id // Registrar quem marcou como entregue
        } as any)
        .eq('id', reservaId as any)
        .select('*') as any);

      if (updateError) {
        console.error('❌ Erro na atualização do banco:', updateError);
        toast({
          title: "Erro",
          description: `Não foi possível atualizar o status: ${updateError.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Status atualizado com sucesso no banco:', updateData);

      // Atualiza a lista localmente removendo a reserva marcada como entregue
      setReservas(prev => {
        const novaLista = prev.filter(reserva => reserva.id !== reservaId);
        console.log('📝 Lista atualizada localmente. Reservas restantes:', novaLista.length);
        return novaLista;
      });

      toast({
        title: "Status atualizado!",
        description: "A reserva foi marcada como entregue e removida da lista.",
      });

    } catch (error: any) {
      console.error('💥 Erro inesperado ao atualizar status:', error);
      toast({
        title: "Erro",
        description: `Erro inesperado: ${error?.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      // Remover do estado de loading
      setLoadingReservas(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservaId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadReservas();
    }
  }, [user]);

  return {
    reservas,
    loading,
    refreshing,
    loadingReservas,
    refreshReservas,
    handleMarcarEntregue
  };
};
