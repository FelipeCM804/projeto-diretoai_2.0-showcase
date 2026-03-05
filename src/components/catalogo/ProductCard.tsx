
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VariantesList } from './VariantesList';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import type { CatalogoProduto } from '@/types/catalogo';

interface ProductCardProps {
  produto: CatalogoProduto;
}

export const ProductCard = ({ produto }: ProductCardProps) => {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [mostrarVariantes, setMostrarVariantes] = useState(false);

  const precoMinimo = produto.variantes.length > 0 
    ? Math.min(...produto.variantes.map(v => v.preco))
    : 0;

  const temPromocao = produto.variantes.some(v => v.em_promocao);
  const totalEstoque = produto.variantes.reduce((acc, v) => acc + (v.quantidade || 0), 0);

  return (
    <Card className={`h-fit transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      <CardHeader className="pb-3">
        {/* Imagem do produto */}
        <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
          {produto.imagem_principal ? (
            <img
              src={produto.imagem_principal}
              alt={produto.nome_produto}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${produto.imagem_principal ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}>
            <Package className={`w-12 h-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {temPromocao && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                PROMOÇÃO
              </Badge>
            )}
            {totalEstoque <= 5 && totalEstoque > 0 && (
              <Badge variant="outline" className="bg-yellow-500/90 text-black text-xs px-2 py-1 border-yellow-400">
                Últimas unidades
              </Badge>
            )}
            {totalEstoque === 0 && (
              <Badge variant="outline" className="bg-gray-500/90 text-white text-xs px-2 py-1 border-gray-400">
                Esgotado
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <CardTitle className={`text-lg font-semibold line-clamp-2 ${
            isDark ? 'text-white' : 'text-slate-800'
          } ${isMobile ? 'text-base' : ''}`}>
            {produto.nome_produto}
          </CardTitle>
          
          {/* Tags de categoria e gênero */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={`text-xs ${
              isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-100 text-slate-700'
            }`}>
              {produto.categoria}
            </Badge>
            <Badge variant="secondary" className={`text-xs ${
              isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'
            }`}>
              {produto.genero}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Descrição */}
        {produto.descricao_curta && (
          <p className={`text-sm mb-4 line-clamp-2 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {produto.descricao_curta}
          </p>
        )}

        {/* Preço inicial */}
        <div className="mb-4">
          <p className={`text-lg font-semibold ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>
            A partir de R$ {precoMinimo.toFixed(2)}
          </p>
          <p className={`text-xs ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {produto.variantes.length} variante{produto.variantes.length !== 1 ? 's' : ''} disponível{produto.variantes.length !== 1 ? 'is' : ''}
          </p>
        </div>

        {/* Botão de variantes */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMostrarVariantes(!mostrarVariantes)}
          className={`w-full transition-all ${
            isDark 
              ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10' 
              : 'border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span className="flex-1 text-left">
            {mostrarVariantes ? 'Ocultar Variantes' : 'Ver Variantes'}
          </span>
          {mostrarVariantes ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </Button>

        {/* Lista de variantes */}
        {mostrarVariantes && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <VariantesList variantes={produto.variantes} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
