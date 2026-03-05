
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import type { FiltrosCatalogo } from '@/types/catalogo';

interface ProductFiltersProps {
  filtros: FiltrosCatalogo;
  onFiltrosChange: (filtros: FiltrosCatalogo) => void;
}

export const ProductFilters = ({ filtros, onFiltrosChange }: ProductFiltersProps) => {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleBuscaChange = (valor: string) => {
    onFiltrosChange({ ...filtros, busca: valor || undefined });
  };

  const handleCategoriaChange = (valor: string) => {
    onFiltrosChange({ 
      ...filtros, 
      categoria: valor === 'todas' ? undefined : valor 
    });
  };

  const handleGeneroChange = (valor: string) => {
    onFiltrosChange({ 
      ...filtros, 
      genero: valor === 'todos' ? undefined : valor 
    });
  };

  const handlePromocaoChange = () => {
    onFiltrosChange({ 
      ...filtros, 
      apenasPromocao: !filtros.apenasPromocao 
    });
  };

  const limparFiltros = () => {
    onFiltrosChange({});
  };

  const temFiltrosAtivos = Object.values(filtros).some(valor => valor !== undefined && valor !== '');

  return (
    <Card className={`${isDark ? 'bg-slate-800/50 border-purple-500/20' : 'bg-white border-slate-200'}`}>
      <CardContent className="p-4">
        {/* Barra de busca sempre visível */}
        <div className="flex gap-3 items-center mb-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <Input
              placeholder="Buscar produtos..."
              value={filtros.busca || ''}
              onChange={(e) => handleBuscaChange(e.target.value)}
              className={`pl-10 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}
            />
          </div>
          
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={isDark ? 'border-purple-500/30 text-purple-300' : 'border-slate-300'}
            >
              <Filter className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filtros avançados */}
        <div className={`space-y-4 ${isMobile && !mostrarFiltros ? 'hidden' : ''}`}>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {/* Categoria */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Categoria
              </label>
              <Select value={filtros.categoria || 'todas'} onValueChange={handleCategoriaChange}>
                <SelectTrigger className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="Roupas">Roupas</SelectItem>
                  <SelectItem value="Calçados">Calçados</SelectItem>
                  <SelectItem value="Acessórios">Acessórios</SelectItem>
                  <SelectItem value="Brinquedos">Brinquedos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gênero */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Gênero
              </label>
              <Select value={filtros.genero || 'todos'} onValueChange={handleGeneroChange}>
                <SelectTrigger className={isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Unissex">Unissex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apenas Promoção */}
            <div className="flex items-end">
              <Button
                variant={filtros.apenasPromocao ? "default" : "outline"}
                size="sm"
                onClick={handlePromocaoChange}
                className={`w-full ${
                  filtros.apenasPromocao 
                    ? isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'
                    : isDark ? 'border-purple-500/30 text-purple-300' : 'border-slate-300'
                }`}
              >
                🏷️ Apenas Promoção
              </Button>
            </div>

            {/* Limpar Filtros */}
            {temFiltrosAtivos && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparFiltros}
                  className={`w-full ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'}`}
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            )}
          </div>

          {/* Filtros ativos */}
          {temFiltrosAtivos && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              {filtros.categoria && (
                <Badge variant="secondary" className={isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-100 text-slate-700'}>
                  Categoria: {filtros.categoria}
                </Badge>
              )}
              {filtros.genero && (
                <Badge variant="secondary" className={isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-100 text-slate-700'}>
                  Gênero: {filtros.genero}
                </Badge>
              )}
              {filtros.apenasPromocao && (
                <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                  Em Promoção
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
