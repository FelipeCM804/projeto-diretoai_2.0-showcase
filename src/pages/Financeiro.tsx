import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_TRANSACOES } from "@/utils/mockData";

const Financeiro = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const { isPresentationMode, lojaId } = useAuth();

    const { data: transacoes, isLoading } = useQuery({
        queryKey: ["transacoes", lojaId],
        queryFn: async () => {
            if (isPresentationMode) return MOCK_TRANSACOES;
            let query = supabase
                .from("transacoes")
                .select("*")
                .order("data", { ascending: false });

            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    const createTransacaoMutation = useMutation({
        mutationFn: async (newTransacao: any) => {
            const dataToInsert = { ...newTransacao, loja_id: lojaId };
            const { data, error } = await supabase.from("transacoes").insert([dataToInsert]);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transacoes"] });
            toast.success("Transação registrada!");
            setIsDialogOpen(false);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createTransacaoMutation.mutate({
            descricao: formData.get("descricao"),
            valor: parseFloat(formData.get("valor") as string),
            tipo: formData.get("tipo"),
            categoria: formData.get("categoria"),
            data: formData.get("data"),
        });
    };

    const totalReceita = transacoes?.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + t.valor, 0) || 0;
    const totalDespesa = transacoes?.filter(t => t.tipo === 'DESPESA').reduce((acc, t) => acc + t.valor, 0) || 0;
    const saldo = totalReceita - totalDespesa;

    return (
        <div className="space-y-6 p-4 md:p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight neon-text">Gestão Financeira</h1>
                    <p className="text-muted-foreground">Controle de receitas e despesas manuais</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="cyber-button">
                            <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                        <DialogHeader>
                            <DialogTitle className="neon-text">Novo Lançamento Financeiro</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição</label>
                                <Input name="descricao" placeholder="Ex: Venda de Produto" required className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Valor (R$)</label>
                                    <Input name="valor" type="number" step="0.01" placeholder="0,00" required className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo</label>
                                    <Select name="tipo" defaultValue="RECEITA">
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value="RECEITA">Receita</SelectItem>
                                            <SelectItem value="DESPESA">Despesa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Categoria</label>
                                    <Input name="categoria" placeholder="Vendas, Aluguel, etc" className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Data</label>
                                    <Input name="data" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full cyber-button" disabled={createTransacaoMutation.isPending}>
                                {createTransacaoMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Registrar"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="cyber-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-400">R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>
                <Card className="cyber-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
                        <TrendingDown className="h-4 w-4 text-rose-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-400">R$ {totalDespesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>
                <Card className="cyber-card border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="cyber-card">
                <CardContent className="pt-6">
                    <div className="rounded-md border border-slate-800">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="animate-spin mx-auto text-purple-500" /></TableCell></TableRow>
                                ) : transacoes?.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhuma transação registrada.</TableCell></TableRow>
                                ) : transacoes?.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-slate-800/30 transition-colors">
                                        <TableCell className="text-xs">{new Date(t.data).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{t.descricao}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{t.categoria || "-"}</TableCell>
                                        <TableCell className={`text-right font-bold ${t.tipo === 'RECEITA' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {t.tipo === 'RECEITA' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Financeiro;
