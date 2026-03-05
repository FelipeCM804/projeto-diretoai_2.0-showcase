import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import Index from "./pages/Index";
import Vendas from "./pages/Vendas";
import Produtos from "./pages/Produtos";
import PainelFinanceiro from "./pages/PainelFinanceiro";
import Usuarios from "./pages/Usuarios";
import CadastrarUsuario from "./pages/CadastrarUsuario";
import Configuracoes from "./pages/Configuracoes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Catalogo from "./pages/Catalogo";
import Clientes from "./pages/Clientes";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";
import RecursosHumanos from "./pages/RecursosHumanos";
import Fornecedores from "./pages/Fornecedores";
import Reservas from "./pages/Reservas";
import { ClaraAssistant } from "./components/ClaraAssistant";

import { PresentationHeader } from "./components/PresentationHeader";

const queryClient = new QueryClient();

const AppContent = () => {
  const { usuario, isPresentationMode } = useAuth();
  const { isClaraEnabled } = useSettings();
  const isMobile = useIsMobile();

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1 flex flex-col">
                <PresentationHeader />
                <header className="h-16 flex items-center justify-between app-header px-6 shadow-lg">

                  <div className="flex items-center">
                    <SidebarTrigger className="mr-4 app-trigger-button transition-colors" />
                    <h1 className={`app-title tracking-wider ${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                      {isMobile ? 'GESTÃO IA' : 'GESTÃO COM IA'}
                    </h1>
                  </div>

                  {!isMobile && (
                    <div className="flex-1 flex justify-center">
                      {usuario && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-800 dark:text-white">
                            {usuario.nome}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Bem-vindo ao sistema
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {!isMobile && <UserMenu />}
                  </div>
                </header>
                <div className={`flex-1 p-4 md:p-6 app-background ${isMobile ? 'mobile-nav-space' : ''}`}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/estoque" element={<Estoque />} />
                    <Route path="/financeiro" element={<Financeiro />} />
                    <Route path="/rh" element={<RecursosHumanos />} />
                    <Route path="/fornecedores" element={<Fornecedores />} />
                    <Route path="/reservas" element={<Reservas />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/vendas" element={<Vendas />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/painel-financeiro" element={<PainelFinanceiro />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    <Route path="/usuarios" element={
                      <ProtectedRoute requireAdmin={true}>
                        <Usuarios />
                      </ProtectedRoute>
                    } />
                    <Route path="/cadastrar-usuario" element={
                      <ProtectedRoute requireAdmin={true}>
                        <CadastrarUsuario />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
              {isMobile && <MobileNavigation />}
              {isClaraEnabled && <ClaraAssistant />}
            </div>
          </SidebarProvider>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
