export interface AsaasPedido {
  id_pedido: number;
  created_at: string;
  valor: number | null;
  status: string | null;
  id_cobranca: string | null;
}

export interface AsaasResumo {
  status: string | null;
  total_pedidos: number | null;
  total_valor: number | null;
}

export interface AsaasValoresPorData {
  data: string | null;
  total_recebido: number | null;
  total_pendente: number | null;
}

export interface FinancialSummary {
  totalRecebido: number;
  totalPendente: number;
  totalGeral: number;
}
