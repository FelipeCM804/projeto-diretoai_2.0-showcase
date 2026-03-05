
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Phone, Loader2, AlertCircle, User, Package } from "lucide-react";
import type { Reserva } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

interface ReservaCardProps {
  reserva: Reserva;
  isLoading: boolean;
  onMarcarEntregue: (reservaId: number) => void;
}

export const ReservaCard = ({ reserva, isLoading, onMarcarEntregue }: ReservaCardProps) => {
  const { isDark } = useTheme();

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
        <Badge className={`flex items-center gap-1 text-xs px-2 py-1 ${
          isDark ? 'cyber-badge error' : 'bg-red-100 text-red-800 border-red-300'
        }`}>
          <AlertCircle className="h-3 w-3" />
          Expirada
        </Badge>
      );
    }

    if (isExpiringSoon(expirationString)) {
      return (
        <Badge className={`flex items-center gap-1 text-xs px-2 py-1 ${
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
      <Badge className={`${statusBadgeClass} text-xs px-2 py-1`}>
        {status}
      </Badge>
    );
  };

  const expired = isExpired(reserva["Data de Expiração"]);

  return (
    <Card className={`w-full max-w-full ${expired ? 'opacity-60' : ''} ${
      isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      <CardContent className="p-3 space-y-3">
        {/* Header com produto e status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Package className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-slate-600'}`} />
            <span className={`font-semibold text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {reserva.Produto}
            </span>
          </div>
          {getStatusBadge(reserva.Status, reserva["Data de Expiração"])}
        </div>

        {/* Informações do cliente */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className={`h-3 w-3 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {reserva.Nome}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className={`h-3 w-3 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {reserva.Whatsapp}
            </span>
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-200/50">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Reserva:
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {formatDate(reserva["Data Reserva"])}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Expiração:
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {formatDate(reserva["Data de Expiração"])}
            </span>
          </div>
        </div>

        {/* Ação */}
        {reserva.Status === "Reservado" && !expired && (
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarcarEntregue(reserva.id)}
              disabled={isLoading}
              className={`w-full h-10 text-sm disabled:opacity-50 ${
                isDark 
                  ? 'btn-dark-outline text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30' 
                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-300'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Processando...' : 'Marcar como Entregue'}
            </Button>
          </div>
        )}

        {expired && (
          <div className="pt-2 text-center">
            <span className={`text-xs font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              Reserva Expirada
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
