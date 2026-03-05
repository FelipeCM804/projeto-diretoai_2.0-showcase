
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCatalogoProdutos } from '@/hooks/useCatalogoProdutos';
import { ProductFilters } from '@/components/catalogo/ProductFilters';
import { ProductCard } from '@/components/catalogo/ProductCard';
import { Loader2, Package } from 'lucide-react';
import type { FiltrosCatalogo } from '@/types/catalogo';

const Catalogo = () => {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({});
  
  const { data: produtos, isLoading, error } = useCatalogoProdutos(filtros);

  const handleFiltrosChange = (novosFiltros: FiltrosCatalogo) => {
    console.log('🔄 [Catalogo] Aplicando filtros:', novosFiltros);
    setFiltros(novosFiltros);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-slate-400'}`} />
        <div className="text-center">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Erro ao carregar catálogo
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Não foi possível carregar os produtos. Tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} border-b ${isDark ? 'border-purple-500/20' : 'border-slate-200'} mb-6`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-purple-300' : 'text-slate-800'} ${isMobile ? 'text-2xl' : ''}`}>
            Catálogo de Produtos
          </h1>
          <p className={`mt-2 ${isDark ? 'text-purple-300/70' : 'text-slate-600'} ${isMobile ? 'text-sm' : ''}`}>
            Explore nossa coleção completa de produtos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Filtros */}
        <div className="mb-6">
          <ProductFilters 
            filtros={filtros} 
            onFiltrosChange={handleFiltrosChange}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-purple-400' : 'text-slate-400'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Carregando produtos...
              </p>
            </div>
          </div>
        )}

        {/* Grid de Produtos */}
        {!isLoading && produtos && (
          <>
            <div className="mb-4">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {produtos.length} produto{produtos.length !== 1 ? 's' : ''} encontrado{produtos.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {produtos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Package className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-slate-400'}`} />
                <div className="text-center">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Nenhum produto encontrado
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tente ajustar os filtros para ver mais produtos
                  </p>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 pb-8 ${
                isMobile 
                  ? 'grid-cols-1' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {produtos.map((produto) => (
                  <ProductCard 
                    key={produto.produto_id} 
                    produto={produto} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Catalogo;
