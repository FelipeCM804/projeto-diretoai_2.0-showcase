
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Palette } from 'lucide-react';
import type { VarianteCatalogo } from '@/types/catalogo';

interface VariantesListProps {
  variantes: VarianteCatalogo[];
}

export const VariantesList = ({ variantes }: VariantesListProps) => {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  if (variantes.length === 0) {
    return (
      <div className="text-center py-4">
        <Package className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Nenhuma variante disponível
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {variantes.map((variante, index) => (
        <div key={variante.id || index}>
          <div className={`p-3 rounded-lg transition-all ${
            isDark ? 'bg-slate-700/50 hover:bg-slate-700/70' : 'bg-slate-50 hover:bg-slate-100'
          }`}>
            <div className="flex items-start justify-between gap-3">
              {/* Informações principais */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {/* Tamanho */}
                  <Badge variant="outline" className={`text-xs ${
                    isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-700'
                  }`}>
                    {variante.tamanho}
                  </Badge>
                  
                  {/* Cor */}
                  <div className="flex items-center gap-1">
                    <Palette className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {variante.cor}
                    </span>
                    {variante.codigo_cor && (
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm ml-1"
                        style={{ backgroundColor: variante.codigo_cor }}
                        title={`Cor: ${variante.cor}`}
                      />
                    )}
                  </div>
                </div>

                {/* Preço */}
                <div className="flex items-center gap-2 mb-2">
                  {variante.em_promocao && variante.preco_promocional ? (
                    <>
                      <span className={`text-sm font-semibold ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        R$ {variante.preco_promocional.toFixed(2)}
                      </span>
                      <span className={`text-xs line-through ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        R$ {variante.preco.toFixed(2)}
                      </span>
                      <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                        PROMOÇÃO
                      </Badge>
                    </>
                  ) : (
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      R$ {variante.preco.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Estoque */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Estoque:
                  </span>
                  <span className={`text-xs font-medium ${
                    variante.quantidade === 0
                      ? 'text-red-500'
                      : variante.quantidade <= 5
                      ? 'text-yellow-500'
                      : isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {variante.quantidade === 0 
                      ? 'Esgotado' 
                      : `${variante.quantidade} unidade${variante.quantidade !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>
              </div>

              {/* Imagem da variante (se disponível) */}
              {variante.url_imagem && (
                <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={variante.url_imagem}
                    alt={`${variante.tamanho} - ${variante.cor}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Separador entre variantes */}
          {index < variantes.length - 1 && (
            <Separator className={`my-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};
