
import React, { createContext, useContext, ReactNode } from 'react';
import type { Produto, VarianteProduto } from '@/types';
import { usePersistentState } from '@/hooks/usePersistentState';

interface ProdutoContextType {
  // Produto state
  produto: Produto;
  setProduto: (value: Produto | ((prev: Produto) => Produto)) => void;
  produtoSalvo: boolean;
  setProdutoSalvo: (value: boolean | ((prev: boolean) => boolean)) => void;
  
  // Variantes state
  variantes: VarianteProduto[];
  setVariantes: (value: VarianteProduto[] | ((prev: VarianteProduto[]) => VarianteProduto[])) => void;
  currentVariante: VarianteProduto;
  setCurrentVariante: (value: VarianteProduto | ((prev: VarianteProduto) => VarianteProduto)) => void;
  
  // Workflow state
  currentStep: number;
  setCurrentStep: (value: number | ((prev: number) => number)) => void;
  
  // Editing state
  editandoVariante: boolean;
  setEditandoVariante: (value: boolean) => void;
  varianteOriginalIndex: number | null;
  setVarianteOriginalIndex: (value: number | null) => void;
}

const ProdutoContext = createContext<ProdutoContextType | undefined>(undefined);

export const useProdutoContext = () => {
  const context = useContext(ProdutoContext);
  if (!context) {
    throw new Error('useProdutoContext must be used within a ProdutoProvider');
  }
  return context;
};

interface ProdutoProviderProps {
  children: ReactNode;
}

export const ProdutoProvider = ({ children }: ProdutoProviderProps) => {
  const [currentStep, setCurrentStep] = usePersistentState({
    key: 'produtos_current_step',
    defaultValue: 1
  });

  const [produto, setProduto] = usePersistentState<Produto>({
    key: 'produtos_produto_data',
    defaultValue: {
      nome: "",
      categoria: "",
      subcategoria: "",
      genero: "",
      idade_min: "",
      idade_max: "",
      descricao_curta: "",
      descricao_completa: "",
      material: "",
      instrucoes_lavagem: "",
    }
  });
  
  const [variantes, setVariantes] = usePersistentState<VarianteProduto[]>({
    key: 'produtos_variantes_list',
    defaultValue: []
  });

  const [currentVariante, setCurrentVariante] = usePersistentState<VarianteProduto>({
    key: 'produtos_current_variante',
    defaultValue: {
      produto_id: 0,
      tamanho: "",
      cor: "",
      codigo_cor: "",
      preco: 0,
      preco_promocional: 0,
      em_promocao: false,
      quantidade: 0,
      url_imagem: "",
    }
  });
  
  const [produtoSalvo, setProdutoSalvo] = usePersistentState({
    key: 'produtos_produto_salvo',
    defaultValue: false
  });

  const [editandoVariante, setEditandoVariante] = React.useState<boolean>(false);
  const [varianteOriginalIndex, setVarianteOriginalIndex] = React.useState<number | null>(null);

  const contextValue: ProdutoContextType = {
    produto,
    setProduto,
    produtoSalvo,
    setProdutoSalvo,
    variantes,
    setVariantes,
    currentVariante,
    setCurrentVariante,
    currentStep,
    setCurrentStep,
    editandoVariante,
    setEditandoVariante,
    varianteOriginalIndex,
    setVarianteOriginalIndex,
  };

  return (
    <ProdutoContext.Provider value={contextValue}>
      {children}
    </ProdutoContext.Provider>
  );
};
