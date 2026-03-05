import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, ArrowUpRight, ArrowDownLeft, History, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_PRODUTOS, MOCK_TRANSACOES } from "@/utils/mockData";

const Estoque = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const queryClient = useQueryClient();
    const { isPresentationMode, lojaId } = useAuth();

    // Buscar Produtos
    const { data: produtos, isLoading: isLoadingProdutos } = useQuery({
        queryKey: ["produtos", lojaId],
        queryFn: async () => {
            if (isPresentationMode) return MOCK_PRODUTOS;
            let query = supabase.from("produtos").select("*").order("nome");
            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }
            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    // Buscar Movimentações (para o histórico)
    const { data: movimentacoes, isLoading: isLoadingMovs } = useQuery({
        queryKey: ["movimentacoes", lojaId],
        queryFn: async () => {
            if (isPresentationMode) {
                // ... (mock logic kept)
                return MOCK_TRANSACOES.filter(t => t.categoria === 'Vendas').map(t => ({
                    id: t.id,
                    produtos: { nome: t.descricao },
                    quantidade: 1,
                    tipo: 'SAIDA',
                    criado_em: t.criado_em
                }));
            }
            let query = supabase
                .from("movimentacoes_estoque")
                .select("*, produtos(nome)")
                .order("criado_em", { ascending: false })
                .limit(10);

            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    const createProductMutation = useMutation({
        mutationFn: async (newProduct: any) => {
            const dataToInsert = { ...newProduct, loja_id: lojaId };
            const { data, error } = await supabase.from("produtos").insert([dataToInsert]);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["produtos"] });
            toast.success("Produto cadastrado com sucesso!");
            setIsProductDialogOpen(false);
        },
    });

    const createMovementMutation = useMutation({
        mutationFn: async (mov: any) => {
            const dataToInsert = { ...mov, loja_id: lojaId };
            const { data, error } = await supabase.from("movimentacoes_estoque").insert([dataToInsert]);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["produtos"] });
            queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
            toast.success("Movimentação registrada!");
            setIsMovementDialogOpen(false);
        },
    });

    const filteredProdutos = produtos?.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createProductMutation.mutate({
            nome: formData.get("nome"),
            sku: formData.get("sku"),
            preco: parseFloat(formData.get("preco") as string),
            categoria: formData.get("categoria"),
            descricao: formData.get("descricao"),
        });
    };

    const handleMovementSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createMovementMutation.mutate({
            produto_id: selectedProduct.id,
            quantidade: parseInt(formData.get("quantidade") as string),
            tipo: formData.get("tipo"),
            motivo: formData.get("motivo"),
        });
    };

    return (
        <div className="space-y-6 p-4 md:p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight neon-text">Controle de Estoque</h1>
                    <p className="text-muted-foreground">Gerencie produtos e movimentações</p>
                </div>

                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="cyber-button">
                            <Plus className="mr-2 h-4 w-4" /> Novo Produto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                        <DialogHeader>
                            <DialogTitle className="neon-text">Cadastrar Novo Produto</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleProductSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">Nome do Produto</label>
                                    <Input name="nome" placeholder="Ex: Camiseta Branca" required className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">SKU / Código</label>
                                    <Input name="sku" placeholder="PROD-001" className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Preço (R$)</label>
                                    <Input name="preco" type="number" step="0.01" placeholder="0,00" className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoria</label>
                                <Input name="categoria" placeholder="Ex: Vestuário" className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição</label>
                                <Input name="descricao" placeholder="Detalhes do produto..." className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <Button type="submit" className="w-full cyber-button" disabled={createProductMutation.isPending}>
                                {createProductMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Salvar Produto"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="cyber-card md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Produtos em Estoque</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar produtos..."
                                className="pl-9 bg-slate-900/50 border-slate-700 h-9"
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
                                        <TableHead className="font-bold">Produto</TableHead>
                                        <TableHead className="font-bold table-priority-medium">SKU</TableHead>
                                        <TableHead className="font-bold table-priority-medium">Categoria</TableHead>
                                        <TableHead className="font-bold">Preço</TableHead>
                                        <TableHead className="text-right font-bold"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingProdutos ? (
                                        <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                                    ) : filteredProdutos?.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.nome}</TableCell>
                                            <TableCell className="table-priority-medium">
                                                <span className="text-xs font-mono text-slate-400">{p.sku || '-'}</span>
                                            </TableCell>
                                            <TableCell className="table-priority-medium">
                                                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full">{p.categoria || 'Geral'}</span>
                                            </TableCell>
                                            <TableCell className="font-bold text-purple-400">
                                                R$ {p.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 border-purple-500/30 hover:bg-purple-500/10"
                                                    onClick={() => {
                                                        setSelectedProduct(p);
                                                        setIsMovementDialogOpen(true);
                                                    }}
                                                >
                                                    <History className="mr-1 h-3 w-3" /> Movimentar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cyber-card">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <History className="h-5 w-5 text-purple-400" /> Últimas Movimentações
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoadingMovs ? (
                                <Loader2 className="animate-spin mx-auto" />
                            ) : movimentacoes?.map((m: any) => (
                                <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30 border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        {m.tipo === 'ENTRADA' ?
                                            <ArrowUpRight className="h-4 w-4 text-emerald-400" /> :
                                            <ArrowDownLeft className="h-4 w-4 text-rose-400" />
                                        }
                                        <div>
                                            <p className="text-sm font-medium">{m.produtos?.nome}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(m.criado_em).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${m.tipo === 'ENTRADA' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {m.tipo === 'ENTRADA' ? '+' : '-'}{m.quantidade}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
                <DialogContent className="cyber-card">
                    <DialogHeader>
                        <DialogTitle>Registrar Movimentação: {selectedProduct?.nome}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleMovementSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de Movimentação</label>
                            <Select name="tipo" defaultValue="ENTRADA">
                                <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="ENTRADA">Entrada (+)</SelectItem>
                                    <SelectItem value="SAIDA">Saída (-)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quantidade</label>
                            <Input name="quantidade" type="number" min="1" required className="bg-slate-900/50 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Motivo / Observação</label>
                            <Input name="motivo" placeholder="Ex: Compra com fornecedor" className="bg-slate-900/50 border-slate-700" />
                        </div>
                        <Button type="submit" className="w-full cyber-button" disabled={createMovementMutation.isPending}>
                            {createMovementMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Confirmar Movimentação"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Estoque;
