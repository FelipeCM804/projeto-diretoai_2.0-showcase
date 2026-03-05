
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface StepsIndicatorProps {
  currentStep: number;
  isStepComplete: (step: number) => boolean;
}

export const StepsIndicator = ({
  currentStep,
  isStepComplete
}: StepsIndicatorProps) => {
  const { isDark } = useTheme();

  return (
    <Card className="cyber-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Step 1: Dados do Produto */}
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                currentStep >= 1 
                  ? isDark 
                    ? "bg-purple-500 text-white glow-purple" 
                    : "bg-purple-600 text-white"
                  : isDark 
                    ? "bg-slate-700 text-slate-400" 
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {isStepComplete(1) ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span 
              className={`font-medium transition-colors duration-300 text-sm sm:text-base ${
                currentStep >= 1 
                  ? isDark ? "text-purple-300" : "text-purple-700"
                  : isDark ? "text-slate-500" : "text-slate-600"
              }`}
            >
              Dados do Produto
            </span>
            
            <ArrowRight className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            
            {/* Step 2: Variantes */}
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                currentStep >= 2 
                  ? isDark 
                    ? "bg-purple-500 text-white glow-purple" 
                    : "bg-purple-600 text-white"
                  : isDark 
                    ? "bg-slate-700 text-slate-400" 
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </div>
            <span 
              className={`font-medium transition-colors duration-300 text-sm sm:text-base ${
                currentStep >= 2 
                  ? isDark ? "text-purple-300" : "text-purple-700"
                  : isDark ? "text-slate-500" : "text-slate-600"
              }`}
            >
              Variantes
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
