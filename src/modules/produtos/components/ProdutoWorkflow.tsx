
import { StepsIndicator } from "@/components/produtos/StepsIndicator";
import { ProdutoModule } from "./ProdutoModule";
import { VarianteModule } from "./VarianteModule";
import { useProdutoWorkflow } from "../hooks/useProdutoWorkflow";

export const ProdutoWorkflow = () => {
  const { currentStep, isStepComplete } = useProdutoWorkflow();

  return (
    <div className="space-y-6">
      <StepsIndicator currentStep={currentStep} isStepComplete={isStepComplete} />

      {currentStep === 1 && <ProdutoModule />}
      {currentStep === 2 && <VarianteModule />}
    </div>
  );
};