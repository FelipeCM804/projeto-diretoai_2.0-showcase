import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable } from '@/components/ResponsiveTable';
import { AsaasPedido } from '@/types/asaas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PedidosTableProps {
  pedidos: AsaasPedido[];
  isLoading?: boolean;
}

export const PedidosTable = ({ pedidos, isLoading }: PedidosTableProps) => {
  const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const getStatusBadge = (status: string | null) => {
    if (status === 'RECEIVED') {
      return <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/10">Recebido</Badge>;
    }
    if (status === 'PENDING') {
      return <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/10">Pendente</Badge>;
    }
    return <Badge className="bg-muted/10 text-muted-foreground border-muted/20 hover:bg-muted/10">Desconhecido</Badge>;
  };

  const columns = [
    {
      header: 'ID Pedido',
      accessorKey: 'id_pedido',
      cell: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      header: 'Valor',
      accessorKey: 'valor',
      cell: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value: 'RECEIVED' | 'PENDING') => getStatusBadge(value)
    },
    {
      header: 'Data',
      accessorKey: 'created_at',
      cell: (value: string) => (
        <span className="text-sm">{formatDate(value)}</span>
      )
    },
    {
      header: 'ID Cobrança',
      accessorKey: 'id_cobranca',
      cell: (value: string) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      )
    }
  ];

  const renderMobileCard = (pedido: AsaasPedido) => (
    <Card key={pedido.id_pedido} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-sm text-muted-foreground">
            {pedido.id_pedido}
          </span>
          {getStatusBadge(pedido.status)}
        </div>
        <div className="text-lg font-semibold mb-1">
          {formatCurrency(pedido.valor)}
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {formatDate(pedido.created_at)}
        </div>
        <div className="text-xs text-muted-foreground">
          Cobrança: {pedido.id_cobranca}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ASAAS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos ASAAS ({pedidos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveTable
          headers={['ID Pedido', 'Valor', 'Status', 'Data', 'ID Cobrança']}
          data={pedidos}
          renderRow={(pedido: AsaasPedido) => (
            <tr key={pedido.id_pedido} className="border-b hover:bg-muted/50">
              <td className="p-4 font-mono text-sm">{pedido.id_pedido}</td>
              <td className="p-4 font-semibold">{formatCurrency(pedido.valor)}</td>
              <td className="p-4">{getStatusBadge(pedido.status)}</td>
              <td className="p-4 text-sm">{formatDate(pedido.created_at)}</td>
              <td className="p-4 font-mono text-xs text-muted-foreground">{pedido.id_cobranca}</td>
            </tr>
          )}
          renderCard={renderMobileCard}
          emptyMessage="Nenhum pedido encontrado"
        />
      </CardContent>
    </Card>
  );
};
