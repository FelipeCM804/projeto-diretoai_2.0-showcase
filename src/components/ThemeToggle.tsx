
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`
        transition-all duration-300
        ${isDark 
          ? 'border-purple-500/40 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/60 hover:text-purple-100' 
          : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800'
        }
      `}
      title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};
