
import { ProdutoForm } from "@/components/produtos/ProdutoForm";
import { useProdutoForm } from "../hooks/useProdutoForm";

export const ProdutoModule = () => {
  const { produto, handleProdutoChange, handleSalvarProduto, loading } = useProdutoForm();

  return (
    <ProdutoForm
      produto={produto}
      onProdutoChange={handleProdutoChange}
      onSalvarProduto={handleSalvarProduto}
      loading={loading}
    />
  );
};