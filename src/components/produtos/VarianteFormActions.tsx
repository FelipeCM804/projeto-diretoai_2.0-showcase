
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, Loader2, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

interface VarianteFormActionsProps {
  onAdicionarVariante: () => void;
  onVoltarStep: () => void;
  loading: boolean;
  editandoVariante?: boolean;
}

export const VarianteFormActions = ({ onAdicionarVariante, onVoltarStep, loading, editandoVariante = false }: VarianteFormActionsProps) => {
  const isMobile = useIsMobile();
  const { isDark } = useTheme();

  return (
    <div className={`flex pt-4 gap-4 ${isMobile ? 'flex-col' : 'justify-between'}`}>
      <Button 
        variant="outline"
        onClick={onVoltarStep}
        className={`cyber-button ${isMobile ? 'mobile-button order-2' : ''} ${
          isDark 
            ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10' 
            : 'btn-light-outline'
        }`}
      >
        <RefreshCcw className="w-4 h-4 mr-2" />
        Cadastrar Novo Produto
      </Button>
      
      <Button 
        onClick={onAdicionarVariante}
        disabled={loading}
        className={`cyber-button ${isMobile ? 'mobile-button order-1' : ''} ${
          isDark 
            ? 'bg-purple-500 hover:bg-purple-600 text-white' 
            : 'bg-slate-700 hover:bg-slate-800 text-white'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {editandoVariante ? 'Salvando...' : 'Salvando...'}
          </>
        ) : (
          <>
            {editandoVariante ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Variante
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};
