
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    KeyRound, Mail, Loader2, Rocket, Building2, CheckCircle2,
    Store, Package, Users, BarChart3, Lock, Eye, EyeOff, PlusCircle, Calendar, Pencil, X, Save
} from 'lucide-react';
import { toast } from 'sonner';

// =============================================================================
// MÓDULOS
// =============================================================================
const MODULOS = [
    { id: 'completo', nome: 'Completo', icon: BarChart3, descricao: 'Todos os módulos do sistema.' },
    { id: 'vendas', nome: 'Vendas & Clientes', icon: Store, descricao: 'Vendas, catálogo e clientes.' },
    { id: 'estoque', nome: 'Estoque & Produtos', icon: Package, descricao: 'Controle de estoque e fornecedores.' },
    { id: 'rh', nome: 'Recursos Humanos', icon: Users, descricao: 'Gestão de colaboradores.' },
    { id: 'reservas_ia', nome: 'Reservas & IA', icon: Calendar, descricao: 'Reservas integradas com IA.' },
];

// =============================================================================
// COMPONENTE
// =============================================================================
const Onboarding = () => {
    const navigate = useNavigate();

    // Etapa 1: validação
    const [etapa, setEtapa] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [emailChave, setEmailChave] = useState('');
    const [chave, setChave] = useState('');

    // Etapa 2: lojas existentes ou nova
    const [lojasExistentes, setLojasExistentes] = useState<any[]>([]);
    const [loadingLojas, setLoadingLojas] = useState(false);
    const [modoSelecao, setModoSelecao] = useState<'selecionar' | 'criar'>('selecionar');
    const [lojaSelecionadaId, setLojaSelecionadaId] = useState<string | null>(null);

    // Estado de edição
    const [editandoLojaId, setEditandoLojaId] = useState<string | null>(null);
    const [editNome, setEditNome] = useState('');
    const [editModulo, setEditModulo] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    // Nova loja
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [moduloAtivo, setModuloAtivo] = useState('completo');

    // Admin
    const [adminEmail, setAdminEmail] = useState('');
    const [adminSenha, setAdminSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ===== SALVAR EDIÇÃO DA LOJA ============================================
    const handleSalvarEdicao = async (lojaId: string) => {
        setSavingEdit(true);
        try {
            const { error } = await supabase
                .from('lojas')
                .update({ nome: editNome.trim(), modulo_ativo: editModulo, status: editStatus })
                .eq('id', lojaId);
            if (error) { toast.error(`Erro ao salvar: ${error.message}`); return; }
            setLojasExistentes(prev => prev.map(l => l.id === lojaId ? { ...l, nome: editNome, modulo_ativo: editModulo, status: editStatus } : l));
            toast.success('Loja atualizada com sucesso!');
            setEditandoLojaId(null);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSavingEdit(false);
        }
    };

    const abrirEdicao = (loja: any) => {
        setEditandoLojaId(loja.id);
        setEditNome(loja.nome);
        setEditModulo(loja.modulo_ativo);
        setEditStatus(loja.status);
        setLojaSelecionadaId(null); // deselect when editing
    };

    // ===== VALIDAR CHAVE =====================================================
    const handleValidacao = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('chaves_ativacao' as any)
                .select('*')
                .eq('chave', chave.trim())
                .single();

            if (error || !data) {
                toast.error('Chave de ativação inválida.');
                return;
            }

            // Carregar lojas existentes
            setLoadingLojas(true);
            const { data: lojas } = await supabase
                .from('lojas')
                .select('id, nome, modulo_ativo, status')
                .order('criado_em', { ascending: false });

            setLojasExistentes(lojas || []);
            setAdminEmail(emailChave);
            setEtapa(2);
            toast.success('Chave validada! Selecione ou crie uma loja.');
        } catch (err: any) {
            toast.error(`Erro: ${err.message}`);
        } finally {
            setLoading(false);
            setLoadingLojas(false);
        }
    };

    // ===== ETAPA 2: Vincular/Criar empresa + usuário admin ====================
    const handleCadastroEmpresa = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!adminEmail.trim() || !adminSenha.trim()) {
                toast.error('E-mail e senha do administrador são obrigatórios.');
                return;
            }
            if (adminSenha.length < 6) {
                toast.error('A senha deve ter pelo menos 6 caracteres.');
                return;
            }

            let lojaId: string;
            let lojaNome: string;

            if (modoSelecao === 'selecionar') {
                if (!lojaSelecionadaId) {
                    toast.error('Selecione uma loja ou escolha criar uma nova.');
                    return;
                }
                const lojaEscolhida = lojasExistentes.find(l => l.id === lojaSelecionadaId);
                lojaId = lojaSelecionadaId;
                lojaNome = lojaEscolhida?.nome || 'Loja';
            } else {
                if (!nomeFantasia.trim()) {
                    toast.error('O Nome Fantasia é obrigatório.');
                    return;
                }
                // Criar nova loja
                const { data: novaLoja, error: lojaError } = await supabase
                    .from('lojas')
                    .insert({ nome: nomeFantasia.trim(), modulo_ativo: moduloAtivo, status: 'ativa' })
                    .select()
                    .single();
                if (lojaError) { toast.error(`Erro ao criar loja: ${lojaError.message}`); return; }
                lojaId = novaLoja.id;
                lojaNome = novaLoja.nome;
            }

            // Criar conta no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: adminEmail.trim(),
                password: adminSenha,
                options: { data: { nome: lojaNome } }
            });

            if (authError) { toast.error(`Erro ao criar conta: ${authError.message}`); return; }
            if (!authData.user) { toast.error('Não foi possível criar a conta.'); return; }

            // Aguardar trigger criar perfil base
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Vincular perfil à loja
            const { error: perfilError } = await supabase
                .from('perfis')
                .upsert({ id: authData.user.id, email: adminEmail.trim(), nome: lojaNome, loja_id: lojaId, autorizacao: 'admin' },
                    { onConflict: 'id' });

            if (perfilError) console.warn('Aviso ao vincular perfil:', perfilError);

            // Marcar chave como usada
            await supabase.from('chaves_ativacao' as any).update({ ativador_banco: lojaId }).eq('chave', chave.trim());

            toast.success(`Empresa "${lojaNome}" ativada! Entrando no sistema...`);

            // Login automático
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: adminEmail.trim(), password: adminSenha
            });
            if (loginError) {
                toast.info('Conta criada! Faça login com suas credenciais.');
                setTimeout(() => navigate('/auth'), 1500);
            } else {
                setTimeout(() => { window.location.href = '/'; }, 1000);
            }
        } catch (err: any) {
            toast.error(`Erro inesperado: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const moduloLabel: Record<string, string> = {
        completo: 'Completo', vendas: 'Vendas', estoque: 'Estoque', rh: 'RH', reservas_ia: 'Reservas & IA'
    };

    // ===== RENDER ETAPA 1 ====================================================
    if (etapa === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/30">
                                <Rocket className="h-10 w-10 text-purple-400 animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Ativação de Loja</h1>
                        <p className="text-slate-400">Insira o e-mail e a chave de ativação recebida</p>
                    </div>

                    {/* Indicador de etapa */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">1</div>
                            <span className="text-purple-300 text-sm font-medium">Validação</span>
                        </div>
                        <div className="w-12 h-px bg-slate-600" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-sm font-bold">2</div>
                            <span className="text-slate-500 text-sm">Cadastro</span>
                        </div>
                    </div>

                    <Card className="bg-slate-800/80 border-purple-500/30 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <form onSubmit={handleValidacao} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">E-mail de Contato</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input type="email" placeholder="seu@email.com" value={emailChave}
                                            onChange={(e) => setEmailChave(e.target.value)}
                                            className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-purple-500" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Chave de Ativação</Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input type="text" placeholder="Ex: 123456" value={chave}
                                            onChange={(e) => setChave(e.target.value)}
                                            className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-purple-500 font-mono tracking-widest" required />
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3">
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Validando...</> : <><CheckCircle2 className="mr-2 h-4 w-4" />Validar e Continuar</>}
                                </Button>
                                <div className="text-center pt-1">
                                    <button type="button" onClick={() => navigate('/auth')} className="text-slate-500 hover:text-slate-400 text-sm underline">
                                        Já tenho uma conta, fazer login
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // ===== RENDER ETAPA 2 ====================================================
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 py-10">
            <div className="w-full max-w-2xl space-y-5">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-green-500/20 rounded-full border border-green-500/30">
                            <Building2 className="h-10 w-10 text-green-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Selecionar ou Criar Loja</h1>
                    <p className="text-slate-400">Vincule sua conta a uma loja existente ou crie uma nova</p>
                </div>

                {/* Indicador de etapa */}
                <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-white" /></div>
                        <span className="text-green-300 text-sm font-medium">Validação</span>
                    </div>
                    <div className="w-12 h-px bg-green-500" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">2</div>
                        <span className="text-purple-300 text-sm font-medium">Cadastro</span>
                    </div>
                </div>

                <form onSubmit={handleCadastroEmpresa} className="space-y-5">
                    {/* Seleção de modo */}
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setModoSelecao('selecionar')}
                            className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${modoSelecao === 'selecionar' ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-500'}`}>
                            <Store className="inline h-4 w-4 mr-2" />Selecionar Loja Existente
                        </button>
                        <button type="button" onClick={() => setModoSelecao('criar')}
                            className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${modoSelecao === 'criar' ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-500'}`}>
                            <PlusCircle className="inline h-4 w-4 mr-2" />Criar Nova Loja
                        </button>
                    </div>

                    {/* === SELECIONAR LOJA EXISTENTE === */}
                    {modoSelecao === 'selecionar' && (
                        <Card className="bg-slate-800/80 border-purple-500/30 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-base">Lojas Cadastradas</CardTitle>
                                <CardDescription className="text-slate-400">Clique na loja para selecioná-la</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingLojas ? (
                                    <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-purple-400" /></div>
                                ) : lojasExistentes.length === 0 ? (
                                    <p className="text-slate-500 text-sm text-center py-4">Nenhuma loja encontrada. Crie uma nova.</p>
                                ) : (
                                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                        {lojasExistentes.map((loja) => {
                                            const isSelected = lojaSelecionadaId === loja.id;
                                            const isEditing = editandoLojaId === loja.id;
                                            return (
                                                <div key={loja.id} className={`rounded-lg border-2 transition-all overflow-hidden ${isEditing ? 'border-amber-500 bg-amber-500/10' : isSelected ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700 bg-slate-900/30'}`}>
                                                    {!isEditing && (
                                                        <div className="flex items-center p-3 gap-2">
                                                            <button type="button" onClick={() => setLojaSelecionadaId(loja.id)} className="flex-1 text-left">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className={`font-semibold text-sm ${isSelected ? 'text-purple-300' : 'text-slate-200'}`}>{loja.nome}</p>
                                                                        <p className="text-slate-500 text-xs mt-0.5">Módulo: {moduloLabel[loja.modulo_ativo] || loja.modulo_ativo}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mr-2">
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${loja.status === 'ativa' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                                            {loja.status}
                                                                        </span>
                                                                        {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-400" />}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                            <button type="button" onClick={() => abrirEdicao(loja)}
                                                                className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors flex-shrink-0"
                                                                title="Editar loja">
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {isEditing && (
                                                        <div className="p-4 space-y-3">
                                                            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Editando loja</p>
                                                            <div className="space-y-1">
                                                                <Label className="text-slate-300 text-xs">Nome da Loja</Label>
                                                                <Input value={editNome} onChange={e => setEditNome(e.target.value)}
                                                                    className="bg-slate-900/70 border-slate-600 text-slate-100 text-sm h-8 focus:border-amber-500" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-slate-300 text-xs">Módulo</Label>
                                                                <div className="grid grid-cols-2 gap-1.5">
                                                                    {Object.entries(moduloLabel).map(([id, nome]) => (
                                                                        <button key={id} type="button" onClick={() => setEditModulo(id)}
                                                                            className={`py-1.5 px-2 rounded text-xs font-medium border transition-all ${editModulo === id ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                                                            {nome}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-slate-300 text-xs">Status</Label>
                                                                <div className="flex gap-2">
                                                                    {['ativa', 'inativa'].map(s => (
                                                                        <button key={s} type="button" onClick={() => setEditStatus(s)}
                                                                            className={`py-1.5 px-3 rounded text-xs font-medium border transition-all ${editStatus === s ? (s === 'ativa' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-rose-500 bg-rose-500/20 text-rose-300') : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                                                            {s}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 pt-1">
                                                                <button type="button" onClick={() => setEditandoLojaId(null)} disabled={savingEdit}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors">
                                                                    <X className="h-3 w-3" /> Cancelar
                                                                </button>
                                                                <button type="button" onClick={() => handleSalvarEdicao(loja.id)} disabled={savingEdit}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors">
                                                                    {savingEdit ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                                                    Salvar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* === CRIAR NOVA LOJA === */}
                    {modoSelecao === 'criar' && (
                        <Card className="bg-slate-800/80 border-purple-500/30 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-base">Dados da Nova Loja</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Nome Fantasia *</Label>
                                    <Input placeholder="Ex: Baby Kids" value={nomeFantasia}
                                        onChange={(e) => setNomeFantasia(e.target.value)}
                                        className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-purple-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Módulo do Sistema</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {MODULOS.map((m) => {
                                            const Icon = m.icon;
                                            const isSelected = moduloAtivo === m.id;
                                            return (
                                                <button key={m.id} type="button" onClick={() => setModuloAtivo(m.id)}
                                                    className={`text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${isSelected ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700 bg-slate-900/30 hover:border-slate-500'}`}>
                                                    <Icon className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                                                    <div className="flex-1">
                                                        <p className={`font-semibold text-sm ${isSelected ? 'text-purple-300' : 'text-slate-200'}`}>{m.nome}</p>
                                                        <p className="text-slate-500 text-xs">{m.descricao}</p>
                                                    </div>
                                                    {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Conta do Administrador */}
                    <Card className="bg-slate-800/80 border-green-500/30 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-base flex items-center gap-2">
                                <Lock className="h-4 w-4 text-green-400" />Login do Administrador
                            </CardTitle>
                            <CardDescription className="text-slate-400">Credenciais de acesso para esta loja</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-medium">E-mail *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}
                                        placeholder="admin@empresa.com"
                                        className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-green-500" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-medium">Senha *</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input type={showPassword ? 'text' : 'password'} value={adminSenha}
                                        onChange={(e) => setAdminSenha(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                        className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-slate-100 focus:border-green-500" required minLength={6} />
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões */}
                    <div className="flex gap-3 pb-4">
                        <Button type="button" variant="outline" onClick={() => setEtapa(1)} disabled={loading}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800">Voltar</Button>
                        <Button type="submit" disabled={loading} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3">
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ativando...</> :
                                <><Rocket className="mr-2 h-4 w-4" />Ativar e Entrar no Sistema</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
