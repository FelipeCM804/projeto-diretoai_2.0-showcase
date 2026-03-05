
export type ProdutoStep = 1 | 2;

export interface ProdutoFormState {
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
}

export interface VarianteFormState {
  isValid: boolean;
  isDirty: boolean;
  isEditing: boolean;
  errors: Record<string, string>;
}

export interface ProdutoWorkflowState {
  currentStep: ProdutoStep;
  canProceed: boolean;
  canGoBack: boolean;
}
