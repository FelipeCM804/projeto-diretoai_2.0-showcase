
export interface Produto {
  id?: number;
  nome: string;
  categoria: string;
  subcategoria?: string;
  genero: string;
  idade_min?: string;
  idade_max?: string;
  descricao_curta?: string;
  descricao_completa?: string;
  material?: string;
  instrucoes_lavagem?: string;
  data_cadastro?: string;
}

export interface VarianteProduto {
  id?: number;
  produto_id: number;
  tamanho: string;
  cor: string;
  codigo_cor: string;
  preco: number;
  preco_promocional?: number;
  em_promocao: boolean;
  quantidade: number;
  url_imagem?: string;
}

export interface Reserva {
  id: number; // Removido o ? para tornar obrigatório
  Produto: string;
  Nome: string;
  Whatsapp: string;
  "Data Reserva": string;
  "Data de Expiração": string;
  Status: string;
  variante_id?: number;
}
