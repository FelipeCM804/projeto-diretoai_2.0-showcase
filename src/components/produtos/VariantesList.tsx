
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit } from "lucide-react";
import type { VarianteProduto } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

interface VariantesListProps {
  variantes: VarianteProduto[];
  onResetarFormulario: () => void;
  onEditarVariante?: (variante: VarianteProduto) => void;
}

export const VariantesList = ({ variantes, onResetarFormulario, onEditarVariante }: VariantesListProps) => {
  const { isDark } = useTheme();

  if (variantes.length === 0) return null;

  const handleEditVariante = (variante: VarianteProduto) => {
    console.log('✏️ [VariantesList] Iniciando edição da variante:', variante);
    if (onEditarVariante) {
      onEditarVariante(variante);
    }
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="neon-text">Variantes Adicionadas ({variantes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {variantes.map((variante, index) => (
            <div key={index} className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
              isDark 
                ? 'border-purple-500/20 bg-slate-800/50' 
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={`${
                  isDark 
                    ? 'border-purple-500/30 text-purple-300' 
                    : 'badge-secondary-light'
                }`}>{variante.tamanho}</Badge>
                <span className={`font-medium ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>{variante.cor}</span>
                <span className={`text-sm ${isDark ? 'text-purple-300/80' : 'text-slate-600'}`}>R$ {variante.preco.toFixed(2)}</span>
                <span className={`text-sm ${isDark ? 'text-purple-300/80' : 'text-slate-600'}`}>Estoque: {variante.quantidade}</span>
                {variante.em_promocao && (
                  <Badge className={`${
                    isDark 
                      ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                      : 'badge-error-light'
                  }`}>Promoção</Badge>
                )}
              </div>
              
              {onEditarVariante && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`${
                        isDark 
                          ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10' 
                          : 'btn-light-outline'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className={`${
                    isDark 
                      ? 'bg-slate-800 border-purple-500/30' 
                      : 'bg-white border-slate-200'
                  }`}>
                    <AlertDialogHeader>
                      <AlertDialogTitle className={isDark ? 'text-purple-300' : 'text-slate-800'}>Editar Variante</AlertDialogTitle>
                      <AlertDialogDescription className={isDark ? 'text-purple-300/70' : 'text-slate-600'}>
                        Deseja editar a variante {variante.tamanho} - {variante.cor}? 
                        Os dados serão carregados no formulário para edição.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className={`${
                        isDark 
                          ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10' 
                          : 'btn-light-outline'
                      }`}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleEditVariante(variante)}
                        className={`${
                          isDark 
                            ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                            : 'bg-slate-700 hover:bg-slate-800 text-white'
                        }`}
                      >
                        Editar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6 space-x-3">
          <Button 
            variant="outline"
            onClick={onResetarFormulario}
            className={`${
              isDark 
                ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10' 
                : 'btn-light-outline'
            }`}
          >
            Cadastrar Novo Produto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
