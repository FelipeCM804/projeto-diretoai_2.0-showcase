import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  Users, Package, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownLeft, Wallet, Briefcase, Calendar, Clock
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  MOCK_CLIENTES, MOCK_PRODUTOS, MOCK_COLABORADORES, MOCK_TRANSACOES, MOCK_RESERVAS, MOCK_VENDAS
} from "@/utils/mockData";

// =====================================================================
// DASHBOARD DINÂMICO — exibe métricas conforme o módulo ativo da loja
// =====================================================================
const Index = () => {
  const { isDark } = useTheme();
  const { isPresentationMode, lojaId, moduloAtivo } = useAuth();
  const modulo = moduloAtivo || 'completo';

  // ---- Queries (sempre buscam, o render escolhe quais cards mostrar) ----
  const { data: countClientes } = useQuery({
    queryKey: ["count-clientes", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return MOCK_CLIENTES.length;
      let q = supabase.from("clientes").select("*", { count: 'exact', head: true });
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { count } = await q;
      return count || 0;
    },
  });

  const { data: countProdutos } = useQuery({
    queryKey: ["count-produtos", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return MOCK_PRODUTOS.length;
      let q = supabase.from("produtos").select("*", { count: 'exact', head: true });
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { count } = await q;
      return count || 0;
    },
  });

  const { data: countReservas } = useQuery({
    queryKey: ["count-reservas", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return MOCK_RESERVAS.length;
      let q = supabase.from("reservas_ia" as any).select("*", { count: 'exact', head: true }).eq('status', 'Reservado');
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { count } = await q;
      return count || 0;
    },
  });

  const { data: countReservasEntregues } = useQuery({
    queryKey: ["count-reservas-entregues", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return 15; // Número fictício de entregas para o modo demo
      let q = supabase.from("reservas_ia" as any).select("*", { count: 'exact', head: true }).eq('status', 'Entregue');
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { count } = await q;
      return count || 0;
    },
  });

  const { data: countColab } = useQuery({
    queryKey: ["count-colab", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return MOCK_COLABORADORES.length;
      let q = supabase.from("colaboradores").select("*", { count: 'exact', head: true });
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { count } = await q;
      return count || 0;
    },
  });

  const { data: countFornecedores } = useQuery({
    queryKey: ["count-fornecedores", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return 2;
      let q = supabase.from("fornecedores").select("*", { count: 'exact', head: true });
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { count } = await q;
      return count || 0;
    },
  });

  const { data: transacoes } = useQuery({
    queryKey: ["dashboard-transacoes", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return MOCK_TRANSACOES;
      let q = supabase.from("transacoes").select("*").order("data", { ascending: true });
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { data } = await q;
      return data || [];
    },
    enabled: modulo === 'completo',
  });

  const { data: reservasRecentes } = useQuery({
    queryKey: ["reservas-recentes", lojaId],
    queryFn: async () => {
      if (isPresentationMode) return MOCK_RESERVAS.slice(0, 5);
      let q = supabase.from("reservas_ia" as any).select("*, cliente:clientes(nome)").order("data_reserva", { ascending: false }).limit(5);
      if (lojaId) q = q.eq("loja_id", lojaId);
      const { data } = await q;
      return data || [];
    },
    enabled: modulo === 'reservas_ia' || modulo === 'completo' || modulo === 'vendas',
  });

  // ---- Financeiro e Vendas ----
  const totalReceita = transacoes?.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + t.valor, 0) || 0;
  const totalDespesa = transacoes?.filter(t => t.tipo === 'DESPESA').reduce((acc, t) => acc + t.valor, 0) || 0;
  const saldo = totalReceita - totalDespesa;

  // Valor total vendido (específico para métrica de vendas)
  const valorTotalVendas = isPresentationMode
    ? MOCK_VENDAS.reduce((acc, v) => acc + v.valor_total, 0)
    : totalReceita; // Simplificação se não houver tabela de vendas separada no banco real

  // Top Clientes
  const topClientes = isPresentationMode
    ? Object.entries(MOCK_VENDAS.reduce((acc: any, v) => {
      const nome = v.clientes?.nome || "Desconhecido";
      acc[nome] = (acc[nome] || 0) + v.valor_total;
      return acc;
    }, {})).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5)
    : [];

  // Estoque Baixo
  const estoqueBaixo = isPresentationMode
    ? MOCK_PRODUTOS.filter(p => (p as any).estoque < 10)
    : [];

  const pieData = [
    { name: "Receitas", value: totalReceita, color: "#10b981" },
    { name: "Despesas", value: totalDespesa, color: "#f43f5e" }
  ];
  const categoryData = transacoes?.reduce((acc: any[], t) => {
    const existing = acc.find(item => item.name === t.categoria);
    if (existing) { existing.value += t.valor; }
    else { acc.push({ name: t.categoria || "Outros", value: t.valor }); }
    return acc;
  }, []) || [];

  // ---- RH Metrics ----
  const totalFolhaPagamento = MOCK_COLABORADORES.reduce((acc, c) => acc + c.salario, 0);
  const cargosUnicos = new Set(MOCK_COLABORADORES.map(c => c.cargo)).size;

  // ---- Títulos e subtítulos por módulo ----
  const titleMap: Record<string, { title: string; sub: string }> = {
    completo: { title: "Dashboard ERP", sub: "Visão geral do seu negócio em tempo real" },
    vendas: { title: "Dashboard — Vendas", sub: "Acompanhe clientes, reservas e vendas" },
    estoque: { title: "Dashboard — Estoque & Logística", sub: "Monitore produtos, fornecedores e movimentações" },
    rh: { title: "Dashboard — RH", sub: "Gestão da equipe e colaboradores" },
    reservas_ia: { title: "Dashboard — Reservas & IA", sub: "Reservas ativas, clientes e atendimentos da IA" },
  };
  const { title, sub } = titleMap[modulo] || titleMap.completo;

  // ==========================================================================
  return (
    <div className="space-y-6 p-4 md:p-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text">{title}</h1>
          <p className="text-muted-foreground">{sub}</p>
        </div>
      </div>

      {/* ======================================================= */}
      {/* MÓDULO: RESERVAS IA                                       */}
      {/* ======================================================= */}
      {(modulo === 'reservas_ia') && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
                <Calendar className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countReservas}</div>
                <p className="text-xs text-muted-foreground">Aguardando retirada</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Entregas Realizadas</CardTitle>
                <Clock className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">{countReservasEntregues}</div>
                <p className="text-xs text-muted-foreground">Total entregue</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clientes Cadastrados</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countClientes}</div>
                <p className="text-xs text-muted-foreground">Atendidos pela IA</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de reservas recentes */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Reservas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reservasRecentes?.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">Nenhuma reserva ainda.</p>
                )}
                {reservasRecentes?.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{r.cliente?.nome || "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.data_reserva ? new Date(r.data_reserva).toLocaleDateString('pt-BR') : '—'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.status === 'Reservado' ? 'bg-amber-500/20 text-amber-400' :
                      r.status === 'Entregue' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ======================================================= */}
      {/* MÓDULO: ESTOQUE                                           */}
      {/* ======================================================= */}
      {(modulo === 'estoque') && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
                <Package className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countProdutos}</div>
                <p className="text-xs text-muted-foreground">SKUs no catálogo</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Alertas Estoque</CardTitle>
                <TrendingUp className="h-4 w-4 text-rose-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-400">{estoqueBaixo.length}</div>
                <p className="text-xs text-muted-foreground">Reposição necessária</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countFornecedores}</div>
                <p className="text-xs text-muted-foreground">Parceiros ativos</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
                <Calendar className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countReservas}</div>
                <p className="text-xs text-muted-foreground">Mercadoria separada</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Baixo Estoque Detalhado */}
            <Card className="cyber-card">
              <CardHeader><CardTitle className="text-lg">Relatório de Baixo Estoque</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estoqueBaixo.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><Package className="h-4 w-4" /></div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[150px]">{p.nome}</p>
                          <p className="text-xs text-muted-foreground">Categoria: {p.categoria}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-rose-400">{p.estoque} un</div>
                        <div className="text-[10px] uppercase text-rose-500/70 font-bold">Repor Urgente</div>
                      </div>
                    </div>
                  ))}
                  {estoqueBaixo.length === 0 && <p className="text-center text-muted-foreground py-4 text-emerald-400">Todo o estoque está em dia!</p>}
                </div>
              </CardContent>
            </Card>

            {/* Categorias e Atividade */}
            <Card className="cyber-card">
              <CardHeader><CardTitle className="text-lg">Resumo por Categoria</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Bebês', 'Meninas', 'Meninos', 'Acessórios', 'Enxoval'].map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{cat}</span>
                        <span className="text-slate-400">{MOCK_PRODUTOS.filter(p => p.categoria === cat).length} itens</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(MOCK_PRODUTOS.filter(p => p.categoria === cat).length / MOCK_PRODUTOS.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* ======================================================= */}
      {/* MÓDULO: VENDAS                                           */}
      {/* ======================================================= */}
      {(modulo === 'vendas') && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Valor Vendido</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  R$ {valorTotalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Total acumulado</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countClientes}</div>
                <p className="text-xs text-muted-foreground">Na base de dados</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
                <Calendar className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countReservas}</div>
                <p className="text-xs text-muted-foreground">Aguardando retirada</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Top Clientes */}
            <Card className="cyber-card">
              <CardHeader><CardTitle className="text-lg">Top Clientes</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topClientes.map(([nome, valor]: any, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                          {idx + 1}
                        </div>
                        <p className="text-sm font-medium">{nome}</p>
                      </div>
                      <span className="font-bold text-slate-100">R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {topClientes.length === 0 && <p className="text-center text-muted-foreground py-4">Sem dados de clientes.</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reservas recentes */}
          <Card className="cyber-card">
            <CardHeader><CardTitle>Reservas Recentes</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reservasRecentes?.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-500/10 text-amber-500"><Calendar className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm font-medium">{r.cliente?.nome || "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">{r.data_reserva ? new Date(r.data_reserva).toLocaleDateString('pt-BR') : '—'}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.status === 'Reservado' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ======================================================= */}
      {/* MÓDULO: RH                                               */}
      {/* ======================================================= */}
      {(modulo === 'rh') && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Colaboradores Ativos</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countColab}</div>
                <p className="text-xs text-muted-foreground">Total da equipe</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Folha Mensal Estimada</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  R$ {totalFolhaPagamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Base salarial total</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cargos/Funções</CardTitle>
                <Briefcase className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cargosUnicos}</div>
                <p className="text-xs text-muted-foreground">Diversidade de funções</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de Colaboradores */}
            <Card className="cyber-card">
              <CardHeader><CardTitle className="text-lg">Equipe Atual</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_COLABORADORES.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                          {c.nome.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.nome}</p>
                          <p className="text-xs text-muted-foreground">{c.cargo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-200">R$ {c.salario.toLocaleString('pt-BR')}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase">{c.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Próximos Pagamentos / Timeline */}
            <Card className="cyber-card">
              <CardHeader><CardTitle className="text-lg">Timeline & Próximos Passos</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-950" />
                      <div>
                        <p className="text-sm font-bold">Fechamento de Ponto</p>
                        <p className="text-xs text-muted-foreground">Dia 25 do mês atual</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950" />
                      <div>
                        <p className="text-sm font-bold">Pagamento de Salários</p>
                        <p className="text-xs text-muted-foreground">5º dia útil do mês</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-slate-950" />
                      <div>
                        <p className="text-sm font-bold">Revisão de Metas</p>
                        <p className="text-xs text-muted-foreground">Planejado para o fim do trimestre</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* ======================================================= */}
      {/* MÓDULO: COMPLETO                                         */}
      {/* ======================================================= */}
      {/* ======================================================= */}
      {/* MÓDULO: COMPLETO (ERP)                                    */}
      {/* ======================================================= */}
      {(modulo === 'completo') && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Faturamento (Vendas)</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  R$ {valorTotalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Vendas acumuladas</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Saúde do Estoque</CardTitle>
                <Package className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{countProdutos} itens</div>
                <p className="text-xs text-muted-foreground">{estoqueBaixo.length} alertas de reposição</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
                <Calendar className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-400">{countReservas}</div>
                <p className="text-xs text-muted-foreground">Aguardando entrega</p>
              </CardContent>
            </Card>
            <Card className="cyber-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Custo Operacional (RH)</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  R$ {totalFolhaPagamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Folha de pagamento mensal</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico Financeiro */}
            <Card className="cyber-card lg:col-span-2">
              <CardHeader><CardTitle className="text-lg">Fluxo de Caixa por Categoria</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                    <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alertas Críticos unificados */}
            <Card className="cyber-card">
              <CardHeader><CardTitle className="text-lg">Radar de Urgências</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estoqueBaixo.length > 0 && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <p className="text-xs font-bold text-rose-500 uppercase flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3 w-3" /> Reposição Urgente
                      </p>
                      <p className="text-sm font-medium text-slate-200">{estoqueBaixo.length} produtos abaixo do estoque mínimo.</p>
                    </div>
                  )}
                  {countReservas > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3" /> Logística
                      </p>
                      <p className="text-sm font-medium text-slate-200">{countReservas} reservas pendentes de retirada.</p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2 mb-1">
                      <Users className="h-3 w-3" /> RH & Operações
                    </p>
                    <p className="text-sm font-medium text-slate-200">Equipe de {countColab} pessoas operacional.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="cyber-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico Recente (ERP unificado)</CardTitle>
              <span className="text-xs text-muted-foreground">Últimas 5 operações</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transacoes?.slice(-5).reverse().map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.tipo === 'RECEITA' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {t.tipo === 'RECEITA' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.descricao}</p>
                        <p className="text-xs text-muted-foreground">Setor: {t.categoria || 'Geral'} • {new Date(t.criado_em).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${t.tipo === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Index;
