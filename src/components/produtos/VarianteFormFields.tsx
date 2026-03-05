
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { VarianteProduto } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

interface VarianteFormFieldsProps {
  currentVariante: VarianteProduto;
  onVarianteChange: (field: keyof VarianteProduto, value: string | number | boolean) => void;
}

export const VarianteFormFields = ({ currentVariante, onVarianteChange }: VarianteFormFieldsProps) => {
  const isMobile = useIsMobile();
  const { isDark } = useTheme();

  return (
    <div className="variante-form-container">
      <div className={`mobile-form-grid ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-4'}`}>
        <div className="mobile-input-container space-y-2">
          <Label htmlFor="tamanho" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Tamanho *</Label>
          <Input
            id="tamanho"
            value={currentVariante.tamanho}
            onChange={(e) => {
              const valor = e.target.value;
              console.log('📝 [VarianteFormFields] Alterando tamanho de:', `"${currentVariante.tamanho}"`, 'para:', `"${valor}"`);
              onVarianteChange("tamanho", valor);
            }}
            placeholder="Ex: M, G, GG"
            className={`prevent-zoom cyber-input ${isMobile ? "mobile-input" : ""} ${!currentVariante.tamanho ? 'border-red-300' : ''}`}
            required
          />
        </div>
        
        <div className="mobile-input-container space-y-2">
          <Label htmlFor="cor" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Cor *</Label>
          <Input
            id="cor"
            value={currentVariante.cor}
            onChange={(e) => {
              const valor = e.target.value;
              console.log('🎨 [VarianteFormFields] Alterando cor de:', `"${currentVariante.cor}"`, 'para:', `"${valor}"`);
              onVarianteChange("cor", valor);
            }}
            placeholder="Ex: Azul"
            className={`prevent-zoom cyber-input ${isMobile ? "mobile-input" : ""} ${!currentVariante.cor ? 'border-red-300' : ''}`}
            required
          />
        </div>
        
        <div className="mobile-input-container space-y-2">
          <Label htmlFor="codigo_cor" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Código da Cor</Label>
          <Input
            id="codigo_cor"
            value={currentVariante.codigo_cor}
            onChange={(e) => onVarianteChange("codigo_cor", e.target.value)}
            placeholder="Ex: #0066CC"
            className={`prevent-zoom cyber-input ${isMobile ? "mobile-input" : ""}`}
          />
        </div>
        
        <div className="mobile-input-container space-y-2">
          <Label htmlFor="preco" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Preço *</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            min="0.01"
            value={currentVariante.preco > 0 ? currentVariante.preco : ""}
            onChange={(e) => {
              const valor = e.target.value === "" ? 0 : parseFloat(e.target.value);
              console.log('💰 [VarianteFormFields] Alterando preço para:', valor);
              onVarianteChange("preco", valor);
            }}
            placeholder="0.00"
            className={`prevent-zoom cyber-input ${isMobile ? "mobile-input" : ""} ${!currentVariante.preco || currentVariante.preco <= 0 ? 'border-red-300' : ''}`}
            required
          />
        </div>
        
        <div className="mobile-input-container space-y-2">
          <Label htmlFor="preco_promocional" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Preço Promocional</Label>
          <Input
            id="preco_promocional"
            type="number"
            step="0.01"
            min="0"
            value={currentVariante.preco_promocional && currentVariante.preco_promocional > 0 ? currentVariante.preco_promocional : ""}
            onChange={(e) => {
              const valor = e.target.value === "" ? 0 : parseFloat(e.target.value);
              onVarianteChange("preco_promocional", valor);
            }}
            placeholder="0.00"
            className={`prevent-zoom cyber-input ${isMobile ? "mobile-input" : ""}`}
          />
        </div>
        
        <div className="mobile-input-container space-y-2">
          <Label htmlFor="quantidade" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Quantidade em Estoque *</Label>
          <Input
            id="quantidade"
            type="number"
            min="0"
            value={currentVariante.quantidade > 0 ? currentVariante.quantidade : ""}
            onChange={(e) => {
              const valor = e.target.value === "" ? 0 : parseInt(e.target.value);
              console.log('📦 [VarianteFormFields] Alterando quantidade para:', valor);
              onVarianteChange("quantidade", valor);
            }}
            placeholder="0"
            className={`prevent-zoom cyber-input ${isMobile ? "mobile-input" : ""}`}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 touch-target mt-4">
        <Checkbox
          id="em_promocao"
          checked={currentVariante.em_promocao}
          onCheckedChange={(checked) => onVarianteChange("em_promocao", checked as boolean)}
          className="touch-target"
        />
        <Label htmlFor="em_promocao" className={`cursor-pointer ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Em promoção</Label>
      </div>
    </div>
  );
};
