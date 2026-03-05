
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ReservasHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export const ReservasHeader = ({ refreshing, onRefresh }: ReservasHeaderProps) => {
  const { isDark } = useTheme();

  return (
    <div className="cyber-card p-3 md:p-6 mb-4 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className={`text-xl md:text-4xl font-bold tracking-wide neon-text flex items-center gap-2 md:gap-3`}>
            <Calendar className={`h-5 w-5 md:h-10 md:w-10 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-700'}`} />
            <span className="break-words">PAINEL DE RESERVAS</span>
          </h1>
          <p className={`text-sm md:text-lg tracking-wide ${isDark ? 'text-slate-600' : 'text-slate-600'}`}>
            Gerencie todas as reservas de produtos
          </p>
        </div>
        <Button 
          onClick={onRefresh}
          disabled={refreshing}
          variant="outline"
          className={`h-10 px-4 text-sm self-start sm:self-auto cyber-button flex items-center gap-2 ${
            isDark 
              ? 'border-slate-400/50 text-slate-700 hover:text-slate-800' 
              : 'border-slate-300 text-slate-700 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {refreshing ? 'ATUALIZANDO...' : 'ATUALIZAR'}
          </span>
          <span className="sm:hidden">
            {refreshing ? 'ATUALIZANDO' : 'ATUALIZAR'}
          </span>
        </Button>
      </div>
    </div>
  );
};
