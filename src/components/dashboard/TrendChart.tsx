import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AsaasValoresPorData } from '@/types/asaas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrendChartProps {
  data: AsaasValoresPorData[];
  isLoading?: boolean;
}

export const TrendChart = ({ data, isLoading }: TrendChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM', { locale: ptBR });
  };

  const chartData = data.map(item => ({
    ...item,
    dataFormatada: formatDate(item.data)
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução dos Valores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução dos Valores</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dataFormatada" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'total_recebido' ? 'Recebido' : 'Pendente'
              ]}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend 
              formatter={(value) => value === 'total_recebido' ? 'Recebido' : 'Pendente'}
            />
            <Line 
              type="monotone" 
              dataKey="total_recebido" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="total_pendente" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};