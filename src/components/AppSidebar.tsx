import { useState } from "react";
import { Calendar, Home, LogOut, Users, UserPlus, ShoppingBag, TrendingUp, Package, Briefcase, ShoppingCart, Settings, DollarSign } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// =====================================================================
// MAPA DE ITENS POR MÓDULO
// Cada item declara em quais módulos ele aparece.
// 'completo' = todos; outros = específico
// =====================================================================
const ALL_ITEMS = [
  { title: "Dashboard", url: "/", icon: Home, modulos: ["completo", "vendas", "estoque", "rh", "reservas_ia"] },
  { title: "Vendas", url: "/vendas", icon: ShoppingCart, modulos: ["completo", "vendas"] },
  { title: "Reservas", url: "/reservas", icon: Calendar, modulos: ["completo", "vendas", "reservas_ia"] },
  { title: "Clientes (CRM)", url: "/clientes", icon: Users, modulos: ["completo", "vendas", "reservas_ia"] },
  { title: "Estoque", url: "/estoque", icon: Package, modulos: ["completo", "estoque"] },
  { title: "Produtos", url: "/produtos", icon: Package, modulos: ["completo", "estoque"] },
  { title: "Catálogo", url: "/catalogo", icon: ShoppingBag, modulos: ["completo", "estoque", "vendas", "reservas_ia"] },
  { title: "Fornecedores", url: "/fornecedores", icon: ShoppingBag, modulos: ["completo", "estoque"] },
  { title: "Financeiro", url: "/financeiro", icon: TrendingUp, modulos: ["completo"] },
  { title: "Painel Financeiro", url: "/painel-financeiro", icon: DollarSign, modulos: ["completo"] },
  { title: "Recursos Humanos (RH)", url: "/rh", icon: Briefcase, modulos: ["completo", "rh"] },
  { title: "Configurações", url: "/configuracoes", icon: Settings, modulos: ["completo", "vendas", "estoque", "rh", "reservas_ia"] },
];

const ADMIN_ITEMS = [
  { title: "Usuários da Loja", url: "/usuarios", icon: Users },
  { title: "Cadastrar Usuário", url: "/cadastrar-usuario", icon: UserPlus },
];

// =====================================================================
export function AppSidebar() {
  const location = useLocation();
  const { signOut, usuario, isAdmin, moduloAtivo } = useAuth();
  const { isDark } = useTheme();
  const currentPath = location.pathname;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "cyber-nav-item active" : "cyber-nav-item";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const logoSrc = isDark
    ? "https://wrncxjrdzmdqfxyzpayy.supabase.co/storage/v1/object/public/imagem-do-sistema/DiretoAI_logo.png"
    : "https://wrncxjrdzmdqfxyzpayy.supabase.co/storage/v1/object/public/imagem-do-sistema/DiretoAI_white.png";

  // Filtrar itens pelo módulo ativo da loja
  const modulo = moduloAtivo || 'completo';
  const visibleItems = ALL_ITEMS.filter(item =>
    item.modulos.includes(modulo) || modulo === 'completo'
  );

  // Nome amigável do módulo para exibição
  const moduloNome: Record<string, string> = {
    completo: 'Completo',
    vendas: 'Vendas & Clientes',
    estoque: 'Estoque & Produtos',
    rh: 'Recursos Humanos',
    reservas_ia: 'Reservas & IA',
  };

  return (
    <Sidebar className="w-64 cyber-sidebar">
      <SidebarHeader>
        <div className="p-4 flex items-center justify-center">
          <img
            alt="DiretoAI Logo"
            className="w-full h-auto object-contain max-w-none transition-all duration-300 logo-transition"
            src={logoSrc}
          />
        </div>
        {/* Badge do módulo ativo */}
        {modulo !== 'completo' && (
          <div className="mx-4 mb-2 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-center">
            <span className="text-xs text-purple-300 font-medium">
              Módulo: {moduloNome[modulo] || modulo}
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={`font-medium px-4 py-2 tracking-wider text-xs uppercase ${isDark ? 'text-purple-300/60' : 'text-slate-600/80'}`}>
            MÓDULOS PRINCIPAIS
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {visibleItems.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-300 ${getNavCls({ isActive })}`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="ml-3 font-medium tracking-wide">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Seção de Administração – visível apenas para admins */}
        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className={`font-medium px-4 py-2 tracking-wider text-xs uppercase ${isDark ? 'text-amber-300/60' : 'text-amber-600/80'}`}>
              ADMINISTRAÇÃO
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {ADMIN_ITEMS.map(item => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-300 ${getNavCls({ isActive })}`
                        }
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="ml-3 font-medium tracking-wide">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 space-y-4">
          {/* Info do usuário */}
          {usuario && (
            <div className="cyber-card p-3 text-center">
              <p className="text-xs text-slate-400 truncate">{usuario.email || usuario.nome}</p>
              <p className="text-xs font-semibold mt-0.5">
                <span className={`${usuario.autorizacao === 'admin' ? 'text-amber-400' : 'text-purple-400'}`}>
                  {usuario.autorizacao === 'admin' ? 'Administrador' : 'Operador'}
                </span>
              </p>
            </div>
          )}

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full cyber-nav-item flex items-center justify-start px-4 py-3 rounded-lg transition-all duration-300 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="ml-3 font-medium tracking-wide">Sair do Sistema</span>
          </Button>

          <div className="cyber-card p-4 text-center">
            <div className={`text-xs mb-1 ${isDark ? 'text-purple-300/60' : 'text-slate-600'}`}>STATUS</div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>ONLINE</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
