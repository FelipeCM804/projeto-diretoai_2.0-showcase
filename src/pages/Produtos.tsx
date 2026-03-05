import { Package } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProdutoProvider } from "@/modules/produtos/contexts/ProdutoContext";
import { ProdutoWorkflow } from "@/modules/produtos/components/ProdutoWorkflow";

const Produtos = () => {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  return (
    <ProdutoProvider>
      <div className={`space-y-6 ${isMobile ? 'pb-20' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`font-bold tracking-tight neon-text flex items-center gap-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              <Package className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} ${isDark ? 'text-purple-400' : 'text-gray-600'}`} />
              Cadastro de Produtos
            </h1>
            <p className={`mt-1 ${isMobile ? 'text-sm' : 'text-base'} ${isDark ? 'text-purple-300/80' : 'text-gray-600'}`}>
              Cadastre produtos e suas variantes no sistema
            </p>
          </div>
        </div>

        <ProdutoWorkflow />
      </div>
    </ProdutoProvider>
  );
};

export default Produtos;
