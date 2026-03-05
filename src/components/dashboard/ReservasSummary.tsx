import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import type { Reserva } from "@/types";
import { useTheme } from "@/contexts/ThemeContext"; // 1. Importe o useTheme

interface ReservasSummaryProps {
  reservas: Reserva[];
  loading: boolean;
}

export const ReservasSummary = ({
  reservas,
  loading
}: ReservasSummaryProps) => {
  const { isDark } = useTheme(); // 2. Obtenha isDark
  const reservasLimitadas = reservas.slice(0, 5);

  if (loading) {
    return (
      <Card className={`cyber-card ${isDark ? 'border-purple-500/30' : 'border-slate-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 text-xl md:text-2xl tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            <Calendar className={`h-5 w-5 md:h-6 md:w-6 ${isDark ? 'text-purple-400' : 'text-slate-600'}`} />
            RESERVAS ATIVAS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className={`h-4 rounded mb-2 ${isDark ? 'bg-slate-700/50' : 'bg-slate-300/50'}`}></div>
                <div className={`h-3 rounded w-3/4 ${isDark ? 'bg-slate-700/30' : 'bg-slate-300/30'}`}></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`cyber-card hover:glow-purple transition-all duration-300 ${isDark ? 'border-purple-500/30' : 'border-slate-200'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
        <div>
          <CardTitle className={`flex items-center gap-3 text-xl md:text-2xl tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            <Calendar className={`h-5 w-5 md:h-6 md:w-6 ${isDark ? 'text-purple-400' : 'text-slate-600'}`} />
            RESERVAS ATIVAS
          </CardTitle>
          <CardDescription className={`text-sm md:text-base mt-1 md:mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Produtos aguardando entrega
          </CardDescription>
        </div>
        <Badge className="cyber-badge success">
          {reservas.length} ATIVAS
        </Badge>
      </CardHeader>
      <CardContent className="p-3 md:p-6 pt-0">
        {reservas.length === 0 ? (
          <div className="text-center py-6 md:py-8">
            <Calendar className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm md:text-base`}>Nenhuma reserva ativa no momento</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {reservasLimitadas.map(reserva => (
              <div 
                key={reserva.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/80' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'} transition-colors`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium text-sm md:text-base ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{reserva.Produto}</h4>
                  </div>
                  <div className={`flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{reserva.Nome}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 sm:mt-0">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(reserva["Data de Expiração"]).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`cyber-badge success text-xs ${isDark ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200'}`}>
                  {reserva.Status}
                </Badge>
              </div>
            ))}
            
            {reservas.length > 5 && (
              <div className="text-center pt-2">
                <p className={`text-xs md:text-sm mb-2 md:mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  +{reservas.length - 5} reservas adicionais
                </p>
              </div>
            )}
            
            <div className="pt-3 md:pt-4">
              <Link to="/reservas">
                <Button className="w-full cyber-button text-white font-semibold tracking-wide h-10 text-sm">
                  VER TODAS AS RESERVAS
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
