import { useAsaasPedidos } from '@/hooks/useAsaasPedidos';
import { useAsaasResumo } from '@/hooks/useAsaasResumo';
import { useAsaasValoresPorData } from '@/hooks/useAsaasValoresPorData';
import { FinancialCards } from '@/components/dashboard/FinancialCards';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { PedidosTable } from '@/components/dashboard/PedidosTable';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const PainelFinanceiro = () => {
  const { data: pedidos = [], isLoading: isLoadingPedidos, error: errorPedidos } = useAsaasPedidos();
  const { data: resumo, isLoading: isLoadingResumo, error: errorResumo } = useAsaasResumo();
  const { data: valoresPorData = [], isLoading: isLoadingValores, error: errorValores } = useAsaasValoresPorData();

  const hasError = errorPedidos || errorResumo || errorValores;
  const isLoading = isLoadingPedidos || isLoadingResumo || isLoadingValores;

  if (hasError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe os pagamentos e estatísticas dos pedidos ASAAS
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados financeiros. Verifique se as tabelas ASAAS estão configuradas no banco de dados.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const defaultSummary = {
    totalRecebido: 0,
    totalPendente: 0,
    totalGeral: 0
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel Financeiro</h1>
        <p className="text-muted-foreground">
          Acompanhe os pagamentos e estatísticas dos pedidos ASAAS
        </p>
      </div>

      {/* Cards de Resumo */}
      <FinancialCards 
        summary={resumo || defaultSummary} 
        isLoading={isLoadingResumo} 
      />

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatusChart 
          summary={resumo || defaultSummary} 
          isLoading={isLoadingResumo} 
        />
        <TrendChart 
          data={valoresPorData} 
          isLoading={isLoadingValores} 
        />
      </div>

      {/* Tabela de Pedidos */}
      <PedidosTable 
        pedidos={pedidos} 
        isLoading={isLoadingPedidos} 
      />
    </div>
  );
};

export default PainelFinanceiro;