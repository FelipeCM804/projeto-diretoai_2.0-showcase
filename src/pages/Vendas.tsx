import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Loader2, Search, Calendar, User, Tag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_VENDAS, MOCK_CLIENTES } from "@/utils/mockData";

const Vendas = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const { isPresentationMode, lojaId } = useAuth();

    // Fetch Vendas
    const { data: vendas, isLoading: isLoadingVendas } = useQuery({
        queryKey: ["vendas", lojaId],
        queryFn: async () => {
            if (isPresentationMode) return MOCK_VENDAS;
            let query = supabase
                .from("vendas")
                .select("*, clientes(nome)")
                .order("data_venda", { ascending: false });

            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    // Fetch Clientes for the new sale form
    const { data: clientes } = useQuery({
        queryKey: ["clientes", lojaId],
        queryFn: async () => {
            if (isPresentationMode) return MOCK_CLIENTES;
            let query = supabase.from("clientes").select("id, nome").order("nome");
            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }
            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    const createVendaMutation = useMutation({
        mutationFn: async (newVenda: any) => {
            const dataToInsert = { ...newVenda, loja_id: lojaId };
            const { data, error } = await supabase.from("vendas").insert([dataToInsert]);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendas"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-transacoes"] });
            toast.success("Venda registrada com sucesso!");
            setIsDialogOpen(false);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createVendaMutation.mutate({
            cliente_id: formData.get("cliente_id"),
            valor_total: parseFloat(formData.get("valor_total") as string),
            status: formData.get("status") || "PENDENTE",
            data_venda: new Date().toISOString(),
        });
    };

    const filteredVendas = vendas?.filter((v) =>
        v.clientes?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-4 md:p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight neon-text">Gestão de Vendas</h1>
                    <p className="text-muted-foreground">Controle seus pedidos e faturamento</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="cyber-button">
                            <Plus className="mr-2 h-4 w-4" /> Nova Venda
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                        <DialogHeader>
                            <DialogTitle className="neon-text">Registrar Nova Venda</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cliente</label>
                                <Select name="cliente_id" required>
                                    <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                        <SelectValue placeholder="Selecione um cliente" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {clientes?.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Valor Total (R$)</label>
                                    <Input name="valor_total" type="number" step="0.01" placeholder="0,00" required className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select name="status" defaultValue="PENDENTE">
                                        <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700">
                                            <SelectItem value="PENDENTE">Pendente</SelectItem>
                                            <SelectItem value="PAGO">Pago</SelectItem>
                                            <SelectItem value="ENTREGUE">Entregue</SelectItem>
                                            <SelectItem value="CANCELADO">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full cyber-button" disabled={createVendaMutation.isPending}>
                                {createVendaMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Finalizar Venda"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="cyber-card">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente ou status..."
                            className="pl-10 bg-slate-900/50 border-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="responsive-table-container">
                        <Table>
                            <TableHeader className="bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="font-bold">Cliente</TableHead>
                                    <TableHead className="font-bold table-priority-medium">Data</TableHead>
                                    <TableHead className="font-bold">Valor</TableHead>
                                    <TableHead className="font-bold text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingVendas ? (
                                    <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="animate-spin mx-auto text-purple-500" /></TableCell></TableRow>
                                ) : filteredVendas?.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhuma venda registrada.</TableCell></TableRow>
                                ) : filteredVendas?.map((venda) => (
                                    <TableRow key={venda.id} className="hover:bg-slate-800/30 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4 text-purple-400" />
                                                {venda.clientes?.nome || "Cliente Removido"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="table-priority-medium">
                                            <div className="flex items-center text-sm">
                                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {new Date(venda.data_venda).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-emerald-400">
                                            R$ {venda.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${venda.status === 'PAGO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                venda.status === 'PENDENTE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                    venda.status === 'CANCELADO' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                {venda.status}
                                            </span>
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

export default Vendas;
