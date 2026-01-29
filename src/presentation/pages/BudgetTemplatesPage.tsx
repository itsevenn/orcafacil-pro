import React, { useEffect } from 'react';
import { useBudgetStore } from '../stores/use-budget-store';
import { BudgetTemplate } from '../../domain/models/budget';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
    Copy, Trash2, Layout, Layers,
    ArrowRight, Search, Filter, Plus
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../../lib/utils';

interface BudgetTemplatesPageProps {
    onUseTemplate: (template: BudgetTemplate) => void;
}

export const BudgetTemplatesPage: React.FC<BudgetTemplatesPageProps> = ({ onUseTemplate }) => {
    const { templates, fetchTemplates, deleteTemplate, isLoading } = useBudgetStore();

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const calculateTotal = (template: BudgetTemplate) => {
        const subtotal = template.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
        const bdiAmount = subtotal * (template.bdi / 100);
        return subtotal + bdiAmount;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Layout className="w-8 h-8 text-[#0070d2]" />
                        Modelos de Orçamento
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Use modelos pré-definidos para agilizar sua orçamentação.</p>
                </div>
                <Button className="bg-[#0070d2] hover:bg-[#005fb2] shadow-lg shadow-blue-900/10">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Novo Modelo
                </Button>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center"><span className="animate-spin text-[#0070d2]">Loading templates...</span></div>
                ) : templates.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                        <p className="text-slate-400">Nenhum modelo cadastrado.</p>
                    </div>
                ) : (
                    templates.map((tmpl) => (
                        <Card key={tmpl.id} className="group hover:border-[#0070d2] hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden border-slate-200/60 shadow-sm bg-white border">
                            <CardContent className="p-6 space-y-5">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 rounded-lg px-3 py-1">
                                        {tmpl.category || 'Geral'}
                                    </Badge>
                                    <button
                                        onClick={() => { if (confirm('Excluir este modelo?')) deleteTemplate(tmpl.id); }}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0070d2] transition-colors line-clamp-1">
                                        {tmpl.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">
                                        {tmpl.description || 'Sem descrição fornecida.'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                                    <div className="flex-1">
                                        <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block mb-0.5">Itens</span>
                                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                            <Layers className="w-3 h-3" /> {tmpl.items.length} Composições
                                        </span>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <span className="text-[10px] uppercase tracking-wider font-black text-slate-400 block mb-0.5">Base Est.</span>
                                        <span className="text-sm font-bold text-emerald-600">
                                            {formatCurrency(calculateTotal(tmpl))}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() => onUseTemplate(tmpl)}
                                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md group/btn"
                                    >
                                        Usar Modelo
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
                                        <Copy className="w-4 h-4 text-slate-500" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
