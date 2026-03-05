
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, Sparkles, User, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_CLIENTES, MOCK_PRODUTOS, MOCK_TRANSACOES, MOCK_RESERVAS } from "@/utils/mockData";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "clara";
    content: string;
    timestamp: Date;
}

export const ClaraAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "clara",
            content: "Olá! Sou a Clara, sua assistente de dados. Como posso ajudar com os números da sua loja hoje?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { isPresentationMode } = useAuth();
    const { isDark } = useTheme();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate AI thinking
        setTimeout(() => {
            let response = "";
            const query = input.toLowerCase();

            if (isPresentationMode) {
                // Mock logic for presentation mode
                if (query.includes("venda") || query.includes("faturamento") || query.includes("vendeu")) {
                    const totalVendas = MOCK_TRANSACOES.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + t.valor, 0);
                    response = `Até agora, registramos um faturamento total de R$ ${totalVendas.toLocaleString('pt-BR')}. Fevereiro foi um mês excelente!`;
                } else if (query.includes("produto") || query.includes("estoque") || query.includes("mais vendido")) {
                    const topProduto = MOCK_PRODUTOS[0].nome;
                    response = `O seu produto mais popular no momento é o "${topProduto}". Temos cerca de ${MOCK_PRODUTOS.length} itens cadastrados no total.`;
                } else if (query.includes("cliente") || query.includes("crm")) {
                    response = `Temos ${MOCK_CLIENTES.length} clientes cadastrados. A base cresceu 15% nos últimos 3 meses.`;
                } else if (query.includes("reserva")) {
                    response = `Existem ${MOCK_RESERVAS.length} reservas ativas aguardando retirada.`;
                } else {
                    response = "Interessante! Posso analisar as vendas, estoque ou clientes para você. O que gostaria de saber especificamente?";
                }
            } else {
                response = "No momento estou operando em modo de demonstração. Em breve poderei analisar seus dados reais do banco de dados!";
            }

            const claraMessage: Message = {
                role: "clara",
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, claraMessage]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <Card className={cn(
                    "w-80 md:w-96 h-[500px] flex flex-col shadow-2xl border-2 animate-in slide-in-from-bottom-5 duration-300",
                    isDark ? "bg-slate-900/95 border-purple-500/30 backdrop-blur-xl" : "bg-white/95 border-purple-100 backdrop-blur-xl"
                )}>
                    <CardHeader className="p-4 border-b border-purple-500/20 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center animate-pulse">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold flex items-center gap-1">
                                    Clara <Sparkles className="w-3 h-3 text-purple-400" />
                                </CardTitle>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Assistente de Dados</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                        <div
                            ref={scrollRef}
                            className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20"
                        >
                            <div className="space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={cn(
                                        "flex gap-2 max-w-[85%]",
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                            msg.role === "user" ? "bg-slate-200" : "bg-purple-100 dark:bg-purple-900/40"
                                        )}>
                                            {msg.role === "user" ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm shadow-sm",
                                            msg.role === "user"
                                                ? "bg-purple-600 text-white rounded-tr-none"
                                                : isDark ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700" : "bg-slate-100 text-slate-800 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-2 mr-auto">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm shadow-sm rounded-tl-none",
                                            isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                                        )}>
                                            Pensando...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-purple-500/20 bg-slate-500/5">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Pergunte sobre as vendas..."
                                    className="bg-transparent border-purple-500/20 focus-visible:ring-purple-500"
                                />
                                <Button size="icon" onClick={handleSend} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 shrink-0 shadow-lg shadow-purple-500/20">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "w-14 h-14 rounded-full shadow-2xl transition-all duration-500 group relative flex items-center justify-center overflow-hidden",
                    isOpen
                        ? "bg-slate-900 text-white rotate-90"
                        : "bg-gradient-to-tr from-purple-600 to-pink-500 hover:scale-110"
                )}
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <>
                        <MessageSquare className="w-6 h-6" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    </>
                )}
            </Button>
        </div>
    );
};
