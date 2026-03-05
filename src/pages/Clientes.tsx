import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Mail, Phone, MapPin, Loader2, History, ShoppingBag, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_CLIENTES, MOCK_VENDAS, MOCK_RESERVAS } from "@/utils/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Clientes = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const queryClient = useQueryClient();
    const { isPresentationMode, lojaId } = useAuth();

    const { data: clientes, isLoading, error: fetchError } = useQuery({
        queryKey: ["clientes", lojaId],
        queryFn: async () => {
            if (isPresentationMode) return MOCK_CLIENTES;
            console.log("🚀 Buscando clientes reais do Supabase para loja:", lojaId);
            let query = supabase
                .from("clientes")
                .select("*")
                .order("nome", { ascending: true });

            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }

            const { data, error } = await query;

            if (error) {
                console.error("❌ Erro Supabase:", error);
                toast.error("Erro ao carregar clientes: " + error.message);
                throw error;
            }
            return data;
        },
    });

    const createClienteMutation = useMutation({
        mutationFn: async (newCliente: any) => {
            const dataToInsert = { ...newCliente, loja_id: lojaId };
            const { data, error } = await supabase.from("clientes").insert([dataToInsert]).select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientes"] });
            toast.success("Cliente cadastrado com sucesso!");
            setIsDialogOpen(false);
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar cliente: " + error.message);
        },
    });

    const updateClienteMutation = useMutation({
        mutationFn: async (updatedCliente: any) => {
            const { id, ...dataToUpdate } = updatedCliente;
            const { data, error } = await supabase.from("clientes").update(dataToUpdate).eq('id', id).select();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientes"] });
            toast.success("Dados do cliente atualizados!");
        },
        onError: (error) => {
            toast.error("Erro ao atualizar dados: " + error.message);
        },
    });

    const { data: vendas, isLoading: loadingVendas } = useQuery({
        queryKey: ["vendas", selectedCliente?.id],
        enabled: !!selectedCliente && isSheetOpen,
        queryFn: async () => {
            if (isPresentationMode) return MOCK_VENDAS.filter(v => v.cliente_id === selectedCliente.id);
            const { data, error } = await supabase
                .from("vendas")
                .select("*")
                .eq("cliente_id", selectedCliente.id)
                .order("data_venda", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const { data: reservas, isLoading: loadingReservas } = useQuery({
        queryKey: ["reservas_ia", selectedCliente?.id],
        enabled: !!selectedCliente && isSheetOpen,
        queryFn: async () => {
            if (isPresentationMode) return MOCK_RESERVAS.filter(r => r.Nome === selectedCliente.nome);
            const { data, error } = await supabase
                .from("reservas_ia")
                .select("*, produtos(nome), variantes_produto(tamanho, cor)")
                .eq("cliente_id", selectedCliente.id)
                .order("data_reserva", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const filteredClientes = clientes?.filter((c) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isUpdate = false) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            nome: formData.get("nome") as string,
            email: formData.get("email") as string,
            whatsapp: formData.get("whatsapp") as string,
            endereco: formData.get("endereco") as string,
            idade_crianca: formData.get("idade_crianca") as string,
            genero_crianca: formData.get("genero_crianca") as string,
        };

        if (isUpdate && selectedCliente) {
            updateClienteMutation.mutate({ id: selectedCliente.id, ...data });
        } else {
            createClienteMutation.mutate(data);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight neon-text">Gestão de Clientes</h1>
                    <p className="text-muted-foreground">Gerencie seus contatos e histórico</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="cyber-button">
                            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                        <DialogHeader>
                            <DialogTitle className="neon-text">Cadastrar Novo Cliente</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome Completo</label>
                                <Input name="nome" placeholder="Ex: João Silva" required className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input name="email" type="email" placeholder="joao@exemplo.com" className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp</label>
                                    <Input name="whatsapp" placeholder="(11) 99999-9999" required className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Endereço</label>
                                    <Input name="endereco" placeholder="Rua Exemplo, 123" className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Idade da Criança</label>
                                    <Input name="idade_crianca" placeholder="Ex: 2 anos" className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Gênero</label>
                                    <Input name="genero_crianca" placeholder="Feminino/Masculino" className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full cyber-button" disabled={createClienteMutation.isPending}>
                                {createClienteMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Salvar Cliente"}
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
                            placeholder="Buscar por nome ou email..."
                            className="pl-10 bg-slate-900/50 border-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                        </div>
                    ) : (
                        <div className="responsive-table-container">
                            <Table>
                                <TableHeader className="bg-slate-900/50">
                                    <TableRow>
                                        <TableHead className="font-bold">Nome</TableHead>
                                        <TableHead className="font-bold table-priority-medium">WhatsApp</TableHead>
                                        <TableHead className="font-bold table-priority-medium">Informações da Criança</TableHead>
                                        <TableHead className="text-right font-bold"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClientes?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Nenhum cliente encontrado.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClientes?.map((cliente) => (
                                            <TableRow key={cliente.id} className="hover:bg-slate-800/30 transition-colors">
                                                <TableCell className="font-medium">{cliente.nome}</TableCell>
                                                <TableCell className="table-priority-medium">
                                                    {cliente.whatsapp ? (
                                                        <div className="flex items-center text-sm font-medium text-green-400">
                                                            <Phone className="mr-1.5 h-3.5 w-3.5" /> {cliente.whatsapp}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">Sem contato</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm table-priority-medium">
                                                    <div className="flex flex-col gap-1">
                                                        {(cliente.idade_crianca || cliente.genero_crianca) ? (
                                                            <div className="font-semibold text-purple-400">
                                                                {cliente.idade_crianca || 'Idade N/A'} • {cliente.genero_crianca || 'Neutro'}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground text-xs">Não informado</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:text-purple-400 group"
                                                        onClick={() => {
                                                            setSelectedCliente(cliente);
                                                            setIsSheetOpen(true);
                                                        }}
                                                    >
                                                        Ver Detalhes
                                                        <Search className="ml-2 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[90%] sm:max-w-[600px] cyber-card overflow-y-auto border-l-purple-500/30">
                    <SheetHeader className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                                <UserIcon className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <SheetTitle className="text-2xl font-bold neon-text">{selectedCliente?.nome}</SheetTitle>
                                <SheetDescription className="text-muted-foreground flex items-center gap-2">
                                    <Phone className="h-3 w-3" /> {selectedCliente?.whatsapp}
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <Tabs defaultValue="dados" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-700">
                            <TabsTrigger value="dados" className="data-[state=active]:bg-purple-600">Dados</TabsTrigger>
                            <TabsTrigger value="compras" className="data-[state=active]:bg-purple-600">Compras</TabsTrigger>
                            <TabsTrigger value="reservas" className="data-[state=active]:bg-purple-600">Reservas</TabsTrigger>
                        </TabsList>

                        <TabsContent value="dados" className="space-y-4 pt-4">
                            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome Completo</label>
                                    <Input name="nome" defaultValue={selectedCliente?.nome} required className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" defaultValue={selectedCliente?.email} className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">WhatsApp</label>
                                        <Input name="whatsapp" defaultValue={selectedCliente?.whatsapp} required className="bg-slate-900/50 border-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Endereço</label>
                                        <Input name="endereco" defaultValue={selectedCliente?.endereco} className="bg-slate-900/50 border-slate-700" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Idade da Criança</label>
                                        <Input name="idade_crianca" defaultValue={selectedCliente?.idade_crianca} className="bg-slate-900/50 border-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Gênero</label>
                                        <Input name="genero_crianca" defaultValue={selectedCliente?.genero_crianca} className="bg-slate-900/50 border-slate-700" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full cyber-button mt-4" disabled={updateClienteMutation.isPending}>
                                    {updateClienteMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Atualizar Cadastro"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="compras" className="space-y-4 pt-4">
                            <div className="rounded-md border border-slate-800">
                                <Table>
                                    <TableHeader className="bg-slate-900/50">
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingVendas ? (
                                            <TableRow><TableCell colSpan={3} className="text-center py-4"><Loader2 className="animate-spin h-4 w-4 mx-auto" /></TableCell></TableRow>
                                        ) : vendas?.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Nenhuma compra registrada.</TableCell></TableRow>
                                        ) : (
                                            vendas?.map((venda: any) => (
                                                <TableRow key={venda.id}>
                                                    <TableCell className="text-xs">{new Date(venda.data_venda || venda.criado_em).toLocaleDateString()}</TableCell>
                                                    <TableCell className="font-semibold text-green-400">R$ {Number(venda.valor_total).toFixed(2)}</TableCell>
                                                    <TableCell><Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/50">{venda.status}</Badge></TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="reservas" className="space-y-4 pt-4">
                            <div className="rounded-md border border-slate-800">
                                <Table>
                                    <TableHeader className="bg-slate-900/50">
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Expira em</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingReservas ? (
                                            <TableRow><TableCell colSpan={3} className="text-center py-4"><Loader2 className="animate-spin h-4 w-4 mx-auto" /></TableCell></TableRow>
                                        ) : reservas?.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Nenhuma reserva ativa.</TableCell></TableRow>
                                        ) : (
                                            reservas?.map((reserva: any) => (
                                                <TableRow key={reserva.id}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium">{reserva.produtos?.nome || reserva.Produto}</span>
                                                            <span className="text-[10px] text-muted-foreground">{reserva.variantes_produto?.tamanho || ''} {reserva.variantes_produto?.cor || ''}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-[10px]">{new Date(reserva.expiracao || reserva["Data de Expiração"]).toLocaleDateString()}</TableCell>
                                                    <TableCell><Badge className="text-[10px] bg-purple-500 text-white">{reserva.status || reserva.Status}</Badge></TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Clientes;
