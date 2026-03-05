
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Produto } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

interface ProdutoFormProps {
  produto: Produto;
  onProdutoChange: (field: keyof Produto, value: string) => void;
  onSalvarProduto: () => void;
  loading: boolean;
}

export const ProdutoForm = ({ produto, onProdutoChange, onSalvarProduto, loading }: ProdutoFormProps) => {
  const isMobile = useIsMobile();
  const { isDark } = useTheme();

  const handleSalvar = () => {
    console.log('💾 Salvando produto:', produto);
    onSalvarProduto();
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="neon-text mobile-subtitle">Informações do Produto</CardTitle>
        <CardDescription className="mobile-body">
          Preencha os dados básicos do produto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          <div className="space-y-2">
            <Label htmlFor="nome" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Nome do Produto *</Label>
            <Input
              id="nome"
              value={produto.nome}
              onChange={(e) => onProdutoChange("nome", e.target.value)}
              placeholder="Ex: Camiseta Premium"
              className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoria" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Categoria *</Label>
            <Input
              id="categoria"
              value={produto.categoria}
              onChange={(e) => onProdutoChange("categoria", e.target.value)}
              placeholder="Ex: Roupas"
              className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subcategoria" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Subcategoria</Label>
            <Input
              id="subcategoria"
              value={produto.subcategoria}
              onChange={(e) => onProdutoChange("subcategoria", e.target.value)}
              placeholder="Ex: Camisetas"
              className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genero" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Gênero *</Label>
            <Input
              id="genero"
              value={produto.genero}
              onChange={(e) => onProdutoChange("genero", e.target.value)}
              placeholder="Ex: Unissex"
              className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idade_min" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Idade Mínima</Label>
            <Input
              id="idade_min"
              value={produto.idade_min}
              onChange={(e) => onProdutoChange("idade_min", e.target.value)}
              placeholder="Ex: 18"
              className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idade_max" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Idade Máxima</Label>
            <Input
              id="idade_max"
              value={produto.idade_max}
              onChange={(e) => onProdutoChange("idade_max", e.target.value)}
              placeholder="Ex: 65"
              className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="material" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Material</Label>
            <Input
              id="material"
              value={produto.material}
              onChange={(e) => onProdutoChange("material", e.target.value)}
              placeholder="Ex: 100% Algodão"
              className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descricao_curta" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Descrição Curta</Label>
          <Input
            id="descricao_curta"
            value={produto.descricao_curta}
            onChange={(e) => onProdutoChange("descricao_curta", e.target.value)}
            placeholder="Breve descrição do produto"
            className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descricao_completa" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Descrição Completa</Label>
          <Textarea
            id="descricao_completa"
            value={produto.descricao_completa}
            onChange={(e) => onProdutoChange("descricao_completa", e.target.value)}
            placeholder="Descrição detalhada do produto"
            rows={4}
            className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instrucoes_lavagem" className={isDark ? 'text-slate-200' : 'text-slate-700'}>Instruções de Lavagem</Label>
          <Textarea
            id="instrucoes_lavagem"
            value={produto.instrucoes_lavagem}
            onChange={(e) => onProdutoChange("instrucoes_lavagem", e.target.value)}
            placeholder="Como cuidar do produto"
            rows={3}
            className={`cyber-input ${isMobile ? "mobile-input" : ""}`}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSalvar}
            disabled={!produto.nome || !produto.categoria || !produto.genero || loading}
            className={`cyber-button ${isMobile ? 'mobile-button w-full' : ''} ${
              isDark 
                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                : 'bg-slate-700 hover:bg-slate-800 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Salvar Produto e Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
