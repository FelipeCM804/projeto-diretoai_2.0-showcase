
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bot, Sparkles, Settings as SettingsIcon, Brain } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Configuracoes = () => {
    const { isClaraEnabled, setIsClaraEnabled } = useSettings();
    const { isDark } = useTheme();

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-24">
            <div>
                <h1 className="text-3xl font-bold tracking-tight neon-text flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8" /> Configurações do Sistema
                </h1>
                <p className="text-muted-foreground">Gerencie as funcionalidades e assistentes de IA.</p>
            </div>

            <div className="grid gap-6">
                <Card className="cyber-card">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Assistente Virtual</CardTitle>
                                <CardDescription>Configure como a IA interage com você.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="clara-toggle" className="text-base font-semibold flex items-center gap-2">
                                    Ativar Clara <Sparkles className="w-4 h-4 text-purple-400" />
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Habilita o botão flutuante da Clara para análise de dados e suporte.
                                </p>
                            </div>
                            <Switch
                                id="clara-toggle"
                                checked={isClaraEnabled}
                                onCheckedChange={setIsClaraEnabled}
                                className="data-[state=checked]:bg-purple-600"
                            />
                        </div>

                        <Separator className="bg-purple-500/10" />

                        {isClaraEnabled && (
                            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start gap-4">
                                    <Bot className="w-10 h-10 text-purple-400 shrink-0" />
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-purple-300">Clara está ativa!</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Você agora pode encontrar o ícone da Clara no canto inferior direito da tela.
                                            Ela pode ajudar a responder perguntas sobre faturamento, estoque e clientes.
                                        </p>
                                        <div className="text-[11px] text-purple-400/60 uppercase tracking-widest font-bold pt-2">
                                            Modo: Demonstração (Mock Data)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="cyber-card opacity-50 cursor-not-allowed">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            Integração de Backend <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded ml-2">EM BREVE</span>
                        </CardTitle>
                        <CardDescription>Configurações avançadas para conexão com modelos GPT-4.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500 italic">
                            A conexão direta com chaves de API e workflows do n8n personalizados será disponibilizada na próxima atualização.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Configuracoes;
