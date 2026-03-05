import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plus, Search, Mail, Phone, Globe, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_FORNECEDORES } from "@/utils/mockData";

const Fornecedores = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const { isPresentationMode, lojaId } = useAuth();

    const { data: fornecedores, isLoading } = useQuery({
        queryKey: ["fornecedores", lojaId],
        queryFn: async () => {
            if (isPresentationMode) return MOCK_FORNECEDORES;
            let query = supabase
                .from("fornecedores")
                .select("*")
                .order("nome_fantasia");

            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    const createFornecedorMutation = useMutation({
        mutationFn: async (newFornecedor: any) => {
            const dataToInsert = { ...newFornecedor, loja_id: lojaId };
            const { data, error } = await supabase.from("fornecedores").insert([dataToInsert]);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fornecedores"] });
            toast.success("Fornecedor cadastrado!");
            setIsDialogOpen(false);
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar: " + error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            nome_fantasia: formData.get("nome_fantasia"),
            razao_social: formData.get("razao_social"),
            cnpj: formData.get("cnpj"),
            contato: formData.get("contato"),
            telefone: formData.get("telefone"),
            email: formData.get("email"),
        };
        createFornecedorMutation.mutate(data);
    };

    const filteredFornecedores = fornecedores?.filter((f) =>
        f.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cnpj?.includes(searchTerm)
    );

    return (
        <div className="space-y-6 p-4 md:p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight neon-text">Fornecedores</h1>
                    <p className="text-muted-foreground">Gerencie seus parceiros e fornecedores</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="cyber-button">
                            <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                        <DialogHeader>
                            <DialogTitle className="neon-text">Cadastrar Novo Fornecedor</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome Fantasia</label>
                                <Input name="nome_fantasia" placeholder="Ex: Fornecedor Ltda" required className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Razão Social</label>
                                    <Input name="razao_social" placeholder="Razão Social Completa" className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">CNPJ</label>
                                    <Input name="cnpj" placeholder="00.000.000/0000-00" className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contato (Nome)</label>
                                    <Input name="contato" placeholder="Nome do representante" className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telefone</label>
                                    <Input name="telefone" placeholder="(00) 0000-0000" className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input name="email" type="email" placeholder="fornecedor@email.com" className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <Button type="submit" className="w-full cyber-button" disabled={createFornecedorMutation.isPending}>
                                {createFornecedorMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Salvar Fornecedor"}
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
                            placeholder="Buscar por nome ou CNPJ..."
                            className="pl-10 bg-slate-900/50 border-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-800">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fornecedor</TableHead>
                                    <TableHead>CNPJ</TableHead>
                                    <TableHead>Contato</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="animate-spin mx-auto text-purple-500" /></TableCell></TableRow>
                                ) : filteredFornecedores?.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum fornecedor encontrado.</TableCell></TableRow>
                                ) : filteredFornecedores?.map((f) => (
                                    <TableRow key={f.id} className="hover:bg-slate-800/30 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{f.nome_fantasia}</span>
                                                <span className="text-xs text-muted-foreground">{f.razao_social || "-"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs">{f.cnpj || "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {f.contato || "-"}</span>
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {f.telefone || "-"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="hover:text-purple-400">Editar</Button>
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

export default Fornecedores;
