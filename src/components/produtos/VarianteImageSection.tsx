import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import type { VarianteProduto } from "@/types";
import { forceUpdatePersistentState } from "@/hooks/usePersistentState";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface VarianteImageSectionProps {
  currentVariante: VarianteProduto;
  onVarianteChange: (field: keyof VarianteProduto, value: string | number | boolean) => void;
}

export const VarianteImageSection = ({ currentVariante, onVarianteChange }: VarianteImageSectionProps) => {
  const { isDark } = useTheme();

  // Sincronizar mudanças na URL da imagem
  useEffect(() => {
    console.log('🔄 [VarianteImageSection] URL da imagem alterada:', {
      url_imagem: currentVariante.url_imagem,
      isEmpty: !currentVariante.url_imagem
    });
  }, [currentVariante.url_imagem]);

  const handleImageChange = (url: string) => {
    console.log('🖼️ [VarianteImageSection] URL da imagem recebida:', url);
    console.log('🖼️ [VarianteImageSection] Estado atual da variante antes da mudança:', {
      produto_id: currentVariante.produto_id,
      url_imagem_atual: currentVariante.url_imagem,
      nova_url: url
    });
    
    // Chamar onVarianteChange normalmente
    onVarianteChange("url_imagem", url);
    
    // Garantir que a atualização seja persistida imediatamente
    setTimeout(() => {
      try {
        const currentVarianteData = localStorage.getItem('produtos_current_variante');
        if (currentVarianteData) {
          const varianteData = JSON.parse(currentVarianteData);
          const updatedVariante = { ...varianteData, url_imagem: url };
          forceUpdatePersistentState('produtos_current_variante', updatedVariante);
          console.log('🔧 [VarianteImageSection] Forçada persistência da URL da imagem:', url);
        }
      } catch (error) {
        console.error('❌ [VarianteImageSection] Erro ao forçar persistência:', error);
      }
    }, 50);
  };

  const handleImageRemove = () => {
    console.log('🗑️ [VarianteImageSection] Removendo imagem da variante');
    onVarianteChange("url_imagem", "");
    
    // Garantir que a remoção seja persistida
    setTimeout(() => {
      try {
        const currentVarianteData = localStorage.getItem('produtos_current_variante');
        if (currentVarianteData) {
          const varianteData = JSON.parse(currentVarianteData);
          const updatedVariante = { ...varianteData, url_imagem: "" };
          forceUpdatePersistentState('produtos_current_variante', updatedVariante);
          console.log('🔧 [VarianteImageSection] Forçada remoção da URL da imagem');
        }
      } catch (error) {
        console.error('❌ [VarianteImageSection] Erro ao forçar remoção:', error);
      }
    }, 50);
  };

  return (
    <div className="space-y-2">
      <Label className={isDark ? 'text-slate-200' : 'text-slate-700'}>Imagem do Produto</Label>
      <ImageUpload
        key={`image-upload-${currentVariante.produto_id}-${currentVariante.url_imagem || 'empty'}`}
        value={currentVariante.url_imagem}
        onChange={handleImageChange}
        onRemove={handleImageRemove}
      />
    </div>
  );
};
