
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Phone, Loader2, AlertCircle } from "lucide-react";
import type { Reserva } from "@/types";
import { useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { ReservaCard } from "./ReservaCard";

interface ReservasTableProps {
  reservas: Reserva[];
  loadingReservas: Set<number>;
  onMarcarEntregue: (reservaId: number) => void;
}

export const ReservasTable = ({ reservas, loadingReservas, onMarcarEntregue }: ReservasTableProps) => {
  const { isDark } = useTheme();
  const [debounceMap, setDebounceMap] = useState<Map<number, NodeJS.Timeout>>(new Map());

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Erro ao formatar data:', dateString, error);
      return 'Data inválida';
    }
  };

  const isExpiringSoon = (expirationString: string) => {
    try {
      const expiration = new Date(expirationString);
      const now = new Date();
      const timeDiff = expiration.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      return hoursDiff <= 24 && hoursDiff > 0;
    } catch (error) {
      return false;
    }
  };

  const isExpired = (expirationString: string) => {
    try {
      const expiration = new Date(expirationString);
      const now = new Date();
      return expiration.getTime() <= now.getTime();
    } catch (error) {
      return false;
    }
  };

  const getStatusBadge = (status: string, expirationString: string) => {
    if (isExpired(expirationString)) {
      return (
        <Badge className={`flex items-center gap-1 ${
          isDark ? 'cyber-badge error' : 'bg-red-100 text-red-800 border-red-300'
        }`}>
          <AlertCircle className="h-3 w-3" />
          Expirada
        </Badge>
      );
    }

    if (isExpiringSoon(expirationString)) {
      return (
        <Badge className={`flex items-center gap-1 ${
          isDark ? 'cyber-badge warning' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
        }`}>
          <AlertCircle className="h-3 w-3" />
          Expira em breve
        </Badge>
      );
    }

    const statusBadgeClass = status === "Entregue" 
      ? (isDark ? 'cyber-badge success' : 'bg-green-100 text-green-800 border-green-300')
      : (isDark ? 'cyber-badge warning' : 'bg-blue-100 text-blue-800 border-blue-300');
    
    return (
      <Badge className={statusBadgeClass}>
        {status}
      </Badge>
    );
  };

  const handleMarcarEntregueClick = useCallback((reservaId: number) => {
    console.log('🎯 Botão clicado para reserva ID:', reservaId);
    
    if (!reservaId || isNaN(reservaId) || reservaId <= 0 || !Number.isInteger(reservaId)) {
      console.error('❌ ID inválido no componente:', {
        id: reservaId,
        type: typeof reservaId,
        isNaN: isNaN(reservaId),
        isInteger: Number.isInteger(reservaId)
      });
      return;
    }
    
    if (loadingReservas.has(reservaId)) {
      console.log('⏳ Botão desabilitado - reserva sendo processada:', reservaId);
      return;
    }

    const reserva = reservas.find(r => r.id === reservaId);
    if (reserva && isExpired(reserva["Data de Expiração"])) {
      console.warn('⚠️ Tentativa de marcar reserva expirada como entregue:', reservaId);
      return;
    }

    const existingTimeout = debounceMap.get(reservaId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      console.log('✅ Executando ação após debounce para reserva:', reservaId);
      onMarcarEntregue(reservaId);
      
      setDebounceMap(prev => {
        const newMap = new Map(prev);
        newMap.delete(reservaId);
        return newMap;
      });
    }, 300);

    setDebounceMap(prev => new Map(prev.set(reservaId, timeout)));
  }, [loadingReservas, onMarcarEntregue, debounceMap, reservas]);

  const renderRow = (reserva: Reserva, index: number) => {
    const isLoading = loadingReservas.has(reserva.id);
    const isDebouncing = debounceMap.has(reserva.id);
    const expired = isExpired(reserva["Data de Expiração"]);
    
    return (
      <TableRow key={reserva.id} className={`${
        isDark ? 'table-row-dark' : 'hover:bg-slate-50 border-b'
      } ${expired ? 'opacity-60' : ''}`}>
        <TableCell className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
          {reserva.Produto}
        </TableCell>
        <TableCell className={isDark ? 'text-slate-300' : 'text-slate-700'}>
          {reserva.Nome}
        </TableCell>
        <TableCell>
          <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <Phone className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            {reserva.Whatsapp}
          </div>
        </TableCell>
        <TableCell className={isDark ? 'text-slate-300' : 'text-slate-700'}>
          {formatDate(reserva["Data Reserva"])}
        </TableCell>
        <TableCell className={isDark ? 'text-slate-300' : 'text-slate-700'}>
          {formatDate(reserva["Data de Expiração"])}
        </TableCell>
        <TableCell>{getStatusBadge(reserva.Status, reserva["Data de Expiração"])}</TableCell>
        <TableCell className="text-right">
          {reserva.Status === "Reservado" && !expired && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleMarcarEntregueClick(reserva.id)}
              disabled={isLoading || isDebouncing}
              className={`disabled:opacity-50 ${
                isDark 
                  ? 'btn-dark-outline text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30' 
                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-300'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              {isLoading ? 'Processando...' : 'Marcar como Entregue'}
            </Button>
          )}
          {expired && (
            <span className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              Expirada
            </span>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const renderCard = (reserva: Reserva, index: number) => {
    const isLoading = loadingReservas.has(reserva.id);
    
    return (
      <ReservaCard
        key={reserva.id}
        reserva={reserva}
        isLoading={isLoading}
        onMarcarEntregue={handleMarcarEntregueClick}
      />
    );
  };

  const headers = [
    "Produto",
    "Cliente", 
    "WhatsApp",
    "Data Reserva",
    "Data Expiração",
    "Status",
    "Ações"
  ];

  return (
    <ResponsiveTable
      headers={headers}
      data={reservas}
      renderRow={renderRow}
      renderCard={renderCard}
      emptyMessage="Nenhuma reserva ativa encontrada"
      className={isDark ? 'table-dark' : ''}
    />
  );
};
