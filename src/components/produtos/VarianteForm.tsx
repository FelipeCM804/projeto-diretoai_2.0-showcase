
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VarianteProduto } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { VarianteFormFields } from "./VarianteFormFields";
import { VarianteImageSection } from "./VarianteImageSection";
import { VarianteFormActions } from "./VarianteFormActions";
import { useVarianteValidation } from "@/hooks/useVarianteValidation";
import { useTheme } from "@/contexts/ThemeContext";

interface VarianteFormProps {
  produto: { nome: string };
  currentVariante: VarianteProduto;
  onVarianteChange: (field: keyof VarianteProduto, value: string | number | boolean) => void;
  onAdicionarVariante: () => void;
  onVoltarStep: () => void;
  loading: boolean;
  editandoVariante?: boolean;
}

export const VarianteForm = ({ 
  produto, 
  currentVariante, 
  onVarianteChange, 
  onAdicionarVariante, 
  onVoltarStep, 
  loading,
  editandoVariante = false
}: VarianteFormProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { validateVariante } = useVarianteValidation();
  const { isDark } = useTheme();

  const handleAddVariante = () => {
    if (!validateVariante(currentVariante, loading)) {
      return;
    }
    
    console.log('✅ [VarianteForm] Todas as validações passaram, chamando onAdicionarVariante');
    console.log('📤 [VarianteForm] Dados finais sendo enviados:', {
      ...currentVariante,
      produto_id: currentVariante.produto_id,
      url_imagem: currentVariante.url_imagem || 'Sem imagem',
      temImagem: !!currentVariante.url_imagem,
      editandoVariante
    });
    
    try {
      onAdicionarVariante();
    } catch (error) {
      console.error('❌ [VarianteForm] Erro ao chamar onAdicionarVariante:', error);
      toast({
        title: "Erro interno",
        description: "Falha ao processar a variante. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Log do estado atual para debug
  console.log('📊 [VarianteForm] Estado atual renderização:', {
    produto: produto.nome,
    varianteId: currentVariante.produto_id,
    temImagem: !!currentVariante.url_imagem,
    urlImagem: currentVariante.url_imagem || 'Não definida',
    loading,
    tamanho: `"${currentVariante.tamanho}"`,
    cor: `"${currentVariante.cor}"`,
    preco: currentVariante.preco,
    quantidade: currentVariante.quantidade,
    editandoVariante
  });

  return (
    <div className="variante-container w-full">
      <Card className={`cyber-card w-full ${
        isDark 
          ? 'bg-slate-800/50 border-purple-500/20' 
          : 'bg-white border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`neon-text mobile-subtitle ${
            isDark ? 'text-purple-300' : 'text-slate-800'
          }`}>
            {editandoVariante ? 'Editando Variante' : 'Variantes do Produto'}: {produto.nome}
          </CardTitle>
          <CardDescription className={`mobile-body ${
            isDark ? 'text-purple-300/70' : 'text-slate-600'
          }`}>
            {editandoVariante 
              ? 'Modifique os dados da variante e clique em "Salvar Alterações"'
              : 'Adicione diferentes variações do produto (tamanho, cor, preço, etc.)'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 w-full">
          <VarianteFormFields 
            currentVariante={currentVariante}
            onVarianteChange={onVarianteChange}
          />
          
          <VarianteImageSection 
            currentVariante={currentVariante}
            onVarianteChange={onVarianteChange}
          />
          
          <VarianteFormActions
            onAdicionarVariante={handleAddVariante}
            onVoltarStep={onVoltarStep}
            loading={loading}
            editandoVariante={editandoVariante}
          />
        </CardContent>
      </Card>
    </div>
  );
};
