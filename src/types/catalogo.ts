
export interface VarianteCatalogo {
  id: number;
  tamanho: string;
  cor: string;
  codigo_cor?: string;
  preco: number;
  preco_promocional?: number;
  em_promocao: boolean;
  quantidade: number;
  url_imagem?: string;
}

export interface CatalogoProduto {
  produto_id: number;
  nome_produto: string;
  categoria: string;
  subcategoria?: string;
  genero: string;
  idade_min?: string;
  idade_max?: string;
  descricao_curta?: string;
  descricao_completa?: string;
  material?: string;
  instrucoes_lavagem?: string;
  data_cadastro: string;
  imagem_principal?: string;
  variantes: VarianteCatalogo[];
}

export interface FiltrosCatalogo {
  categoria?: string;
  genero?: string;
  precoMin?: number;
  precoMax?: number;
  apenasPromocao?: boolean;
  busca?: string;
}
