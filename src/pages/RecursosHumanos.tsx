import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Briefcase, DollarSign, Calendar, Loader2, Search, BadgeCheck, BadgeAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_COLABORADORES } from "@/utils/mockData";

const RecursosHumanos = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const { isPresentationMode, lojaId } = useAuth();

    const { data: colaboradores, isLoading } = useQuery({
        queryKey: ["colaboradores", lojaId],
        queryFn: async () => {
            if (isPresentationMode) return MOCK_COLABORADORES;
            let query = supabase
                .from("colaboradores")
                .select("*")
                .order("nome");

            if (lojaId) {
                query = query.eq("loja_id", lojaId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    const createColaboradorMutation = useMutation({
        mutationFn: async (newColaborador: any) => {
            const dataToInsert = { ...newColaborador, loja_id: lojaId };
            const { data, error } = await supabase.from("colaboradores").insert([dataToInsert]);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
            toast.success("Colaborador cadastrado com sucesso!");
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
            nome: formData.get("nome"),
            cpf: formData.get("cpf"),
            cargo: formData.get("cargo"),
            salario: parseFloat(formData.get("salario") as string),
            data_admissao: formData.get("data_admissao"),
            status: "ATIVO",
        };
        createColaboradorMutation.mutate(data);
    };

    const filteredColaboradores = colaboradores?.filter((c) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-4 md:p-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight neon-text">Recursos Humanos</h1>
                    <p className="text-muted-foreground">Gestão de colaboradores e cargos</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="cyber-button">
                            <UserPlus className="mr-2 h-4 w-4" /> Novo Colaborador
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="cyber-card">
                        <DialogHeader>
                            <DialogTitle className="neon-text">Cadastrar Novo Colaborador</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome Completo</label>
                                <Input name="nome" placeholder="Ex: Maria Oliveira" required className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">CPF</label>
                                    <Input name="cpf" placeholder="000.000.000-00" className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cargo</label>
                                    <Input name="cargo" placeholder="Ex: Vendedor" className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Salário (R$)</label>
                                    <Input name="salario" type="number" step="0.01" placeholder="0,00" className="bg-slate-900/50 border-slate-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Data Admissão</label>
                                    <Input name="data_admissao" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="bg-slate-900/50 border-slate-700" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full cyber-button" disabled={createColaboradorMutation.isPending}>
                                {createColaboradorMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Salvar Colaborador"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="cyber-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
                        <Users className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{colaboradores?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card className="cyber-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                        <BadgeCheck className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-400">
                            {colaboradores?.filter(c => c.status === 'ATIVO').length || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card className="cyber-card col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Folha Mensal Estimada</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-400">
                            R$ {colaboradores?.reduce((acc, c) => acc + (c.salario || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="cyber-card">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome ou cargo..."
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
                                    <TableHead>Colaborador</TableHead>
                                    <TableHead>Cargo</TableHead>
                                    <TableHead>Admissão</TableHead>
                                    <TableHead>Salário</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="animate-spin mx-auto text-purple-500" /></TableCell></TableRow>
                                ) : filteredColaboradores?.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum colaborador encontrado.</TableCell></TableRow>
                                ) : filteredColaboradores?.map((colab) => (
                                    <TableRow key={colab.id} className="hover:bg-slate-800/30 transition-colors">
                                        <TableCell className="font-medium">{colab.nome}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{colab.cargo || "-"}</TableCell>
                                        <TableCell className="text-xs">{colab.data_admissao ? new Date(colab.data_admissao).toLocaleDateString() : "-"}</TableCell>
                                        <TableCell className="text-sm">R$ {colab.salario?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${colab.status === 'ATIVO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                                }`}>
                                                {colab.status}
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

export default RecursosHumanos;
