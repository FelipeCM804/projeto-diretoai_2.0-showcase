
import { VarianteForm } from "@/components/produtos/VarianteForm";
import { VariantesList } from "@/components/produtos/VariantesList";
import { useVarianteForm } from "../hooks/useVarianteForm";
import { useProdutoWorkflow } from "../hooks/useProdutoWorkflow";
import { useProdutoContext } from "../contexts/ProdutoContext";

export const VarianteModule = () => {
  const { produto } = useProdutoContext();
  const { voltarParaStep1, resetarFormulario } = useProdutoWorkflow();
  const {
    currentVariante,
    variantes,
    editandoVariante,
    handleVarianteChange,
    handleAdicionarVariante,
    handleEditarVariante,
    loading
  } = useVarianteForm();

  return (
    <div className="space-y-6">
      <VarianteForm
        produto={produto}
        currentVariante={currentVariante}
        onVarianteChange={handleVarianteChange}
        onAdicionarVariante={handleAdicionarVariante}
        onVoltarStep={voltarParaStep1}
        loading={loading}
        editandoVariante={editandoVariante}
      />
      
      <VariantesList
        variantes={variantes}
        onResetarFormulario={resetarFormulario}
        onEditarVariante={handleEditarVariante}
      />
    </div>
  );
};
