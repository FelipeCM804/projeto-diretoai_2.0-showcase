import { Home, Calendar, UserPlus, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const MobileNavigation = () => {
  const { isAdmin } = useAuth();
  const { isDark } = useTheme();

  const navItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      requireAdmin: false
    },
    {
      title: "Catálogo",
      url: "/catalogo",
      icon: ShoppingBag,
      requireAdmin: false
    },
    {
      title: "Reservas",
      url: "/reservas",
      icon: Calendar,
      requireAdmin: false
    },
    {
      title: "Produtos",
      url: "/produtos",
      icon: Package,
      requireAdmin: false
    },
    {
      title: "Financeiro",
      url: "/painel-financeiro",
      icon: TrendingUp,
      requireAdmin: false
    },
    {
      title: "Cadastrar",
      url: "/cadastrar-usuario",
      icon: UserPlus,
      requireAdmin: true
    }
  ];

  const visibleItems = navItems.filter(item => !item.requireAdmin || isAdmin);

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden",
        "safe-area-pb h-16 px-2",
        isDark ? "bg-slate-900/95 border-purple-500/20" : "bg-white/95 border-slate-200"
      )}
    >
      <div className="flex items-center justify-around h-full max-w-screen-sm mx-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center min-h-[44px] px-3 py-1 rounded-lg transition-all duration-200",
                "text-xs font-medium min-w-[60px] touch-manipulation",
                isActive
                  ? isDark
                    ? "text-purple-300 bg-purple-500/20"
                    : "text-blue-600 bg-blue-50"
                  : isDark
                    ? "text-slate-400 hover:text-purple-300 hover:bg-purple-500/10"
                    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              )
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="truncate max-w-[50px]">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
