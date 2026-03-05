
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Monitor,
    Layout,
    ShoppingBag,
    Package,
    Users,
    Calendar,
    Layers
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const PresentationHeader = () => {
    const { isPresentationMode, moduloAtivo, changePresentationModulo } = useAuth();

    if (!isPresentationMode) return null;

    const modulos = [
        { id: 'completo', label: 'Gestão Completa', icon: Layers },
        { id: 'vendas', label: 'Vendas & Comércio', icon: ShoppingBag },
        { id: 'estoque', label: 'Estoque & Logística', icon: Package },
        { id: 'rh', label: 'Recursos Humanos', icon: Users },
        { id: 'reservas_ia', label: 'Reservas & IA', icon: Calendar },
    ];

    return (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 flex items-center justify-between animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-2 text-primary">
                <Monitor className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Modo Apresentação — Dados Simulados (3 Meses)</span>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">Alternar Módulo:</span>
                <Select
                    value={moduloAtivo || 'completo'}
                    onValueChange={(val) => changePresentationModulo(val)}
                >
                    <SelectTrigger className="h-8 w-[180px] bg-background/50 border-primary/30 text-xs">
                        <SelectValue placeholder="Selecione o módulo" />
                    </SelectTrigger>
                    <SelectContent>
                        {modulos.map((m) => (
                            <SelectItem key={m.id} value={m.id} className="text-xs">
                                <div className="flex items-center gap-2">
                                    <m.icon className="h-3 w-3" />
                                    {m.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
