
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CatalogoProduto, FiltrosCatalogo, VarianteCatalogo } from '@/types/catalogo';

import { useAuth } from '@/contexts/AuthContext';
import { MOCK_PRODUTOS } from '@/utils/mockData';

export const useCatalogoProdutos = (filtros?: FiltrosCatalogo) => {
  const { isPresentationMode } = useAuth();

  return useQuery({
    queryKey: ['catalogo-produtos', filtros, isPresentationMode],
    queryFn: async (): Promise<CatalogoProduto[]> => {
      if (isPresentationMode) {
        // Mapear MOCK_PRODUTOS para o formato esperado pelo catálogo
        return MOCK_PRODUTOS.map(p => ({
          produto_id: Number(p.id),
          nome_produto: p.nome,
          categoria: p.categoria,
          genero: 'Unissex',
          descricao_curta: p.descricao,
          data_cadastro: p.criado_em,
          variantes: [
            { id: 100 + Number(p.id), tamanho: 'G', cor: 'Padrão', preco: p.preco, quantidade: 10, em_promocao: false }
          ]
        })) as any;
      }

      console.log('🔍 [useCatalogoProdutos] Buscando produtos do catálogo...');


      let query = supabase
        .from('vw_catalogo_produtos' as any)
        .select('*')
        .order('nome_produto');

      // Aplicar filtros se fornecidos
      if (filtros?.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }

      if (filtros?.genero) {
        // Mapear os valores do filtro para os valores do banco
        let generoValue = filtros.genero;
        if (filtros.genero === 'Masculino') {
          generoValue = 'Menino';
        } else if (filtros.genero === 'Feminino') {
          generoValue = 'Menina';
        } else if (filtros.genero === 'Unissex') {
          generoValue = 'Neutro';
        }
        query = query.eq('genero', generoValue);
      }

      if (filtros?.busca) {
        query = query.ilike('nome_produto', `%${filtros.busca}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [useCatalogoProdutos] Erro ao buscar produtos:', error);
        throw error;
      }

      console.log('✅ [useCatalogoProdutos] Produtos encontrados:', data?.length || 0);

      // Processar os dados para garantir tipagem correta
      const produtos: CatalogoProduto[] = ((data as any) || []).map((item: any) => ({
        produto_id: item.produto_id || 0,
        nome_produto: item.nome_produto || '',
        categoria: item.categoria || '',
        subcategoria: item.subcategoria || undefined,
        genero: item.genero || '',
        idade_min: item.idade_min || undefined,
        idade_max: item.idade_max || undefined,
        descricao_curta: item.descricao_curta || undefined,
        descricao_completa: item.descricao_completa || undefined,
        material: item.material || undefined,
        instrucoes_lavagem: item.instrucoes_lavagem || undefined,
        data_cadastro: item.data_cadastro || '',
        imagem_principal: item.imagem_principal || undefined,
        variantes: Array.isArray(item.variantes)
          ? (item.variantes as any[]).map((v: any) => ({
            id: v.id || 0,
            tamanho: v.tamanho || '',
            cor: v.cor || '',
            codigo_cor: v.codigo_cor || undefined,
            preco: typeof v.preco === 'number' ? v.preco : parseFloat(v.preco) || 0,
            preco_promocional: v.preco_promocional ? (typeof v.preco_promocional === 'number' ? v.preco_promocional : parseFloat(v.preco_promocional)) : undefined,
            em_promocao: Boolean(v.em_promocao),
            quantidade: typeof v.quantidade === 'number' ? v.quantidade : parseInt(v.quantidade) || 0,
            url_imagem: v.url_imagem || undefined,
          } as VarianteCatalogo))
          : []
      }));

      // Aplicar filtros de preço e promoção após buscar os dados
      if (filtros?.precoMin || filtros?.precoMax || filtros?.apenasPromocao) {
        return produtos.filter(produto => {
          const variantesValidas = produto.variantes.filter(variante => {
            let valida = true;

            if (filtros.precoMin && variante.preco < filtros.precoMin) {
              valida = false;
            }

            if (filtros.precoMax && variante.preco > filtros.precoMax) {
              valida = false;
            }

            if (filtros.apenasPromocao && !variante.em_promocao) {
              valida = false;
            }

            return valida;
          });

          return variantesValidas.length > 0;
        });
      }

      return produtos;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

