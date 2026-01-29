import React, { useState, useEffect } from 'react';
import { usePriceCollectionStore } from '../../../stores/use-price-collection-store';
import { Button } from '../../ui/button';
import { Search, Plus, Calendar, CheckCircle2, Clock, Trash2, ArrowRight, TrendingUp, Info } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PriceCollectionDashboardProps {
    onSelectCollection: (id: string) => void;
}

export const PriceCollectionDashboard: React.FC<PriceCollectionDashboardProps> = ({ onSelectCollection }) => {
    const { collections, isLoading, fetchCollections, deleteCollection, createCollection } = usePriceCollectionStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const filtered = collections.filter(c =>
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CLOSED': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'EXPIRED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleCreateNew = async () => {
        const desc = prompt('Descrição da nova coleta:');
        if (desc) {
            // In a real app, we'd select inputs first. 
            // Here we'll just start an empty one or with some mocks for demo.
            await createCollection(desc, []);
        }
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Custom Premium Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>Engenharia de Custos</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-blue-600">Market Intelligence</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                            Coleta de Preços
                            <div className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[10px] text-blue-600 align-middle">PRO</div>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 max-w-xl font-medium">
                            Gerencie cotações multi-fornecedor e mantenha sua base de dados sempre atualizada com os melhores preços do mercado.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-slate-900 hover:bg-black text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-slate-200 flex items-center gap-3 transition-all" onClick={handleCreateNew}>
                            <Plus className="w-5 h-5" /> Nova Coleta
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Ativas</div>
                        <div className="text-2xl font-black text-slate-900">{collections.filter(c => c.status === 'OPEN').length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Concluídas</div>
                        <div className="text-2xl font-black text-slate-900">{collections.filter(c => c.status === 'CLOSED').length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Info className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Aguardando Retorno</div>
                        <div className="text-2xl font-black text-slate-900">12 Ins.</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar coleta..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-medium text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Status:</span>
                        <button className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all">Todos</button>
                        <button className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all">Abertos</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/50">
                                <th className="px-8 py-5">Coleta de Preços</th>
                                <th className="px-8 py-5">Data de Criação</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-center">Insumos</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => onSelectCollection(c.id)}>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{c.description}</div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight flex items-center gap-1.5">
                                            ID: <span className="text-slate-500 font-mono">{c.id.slice(0, 8)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {format(new Date(c.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            getStatusStyles(c.status)
                                        )}>
                                            {c.status === 'OPEN' ? 'Ativo' : c.status === 'CLOSED' ? 'Finalizado' : 'Expirado'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-50 text-slate-900 font-black text-sm border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                                            {c.items.length}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="p-2 text-slate-400 hover:text-red-500 transition-all"
                                                onClick={(e) => { e.stopPropagation(); if (confirm('Excluir esta coleta?')) deleteCollection(c.id); }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <button className="flex items-center gap-2 bg-slate-100 text-slate-900 font-black text-[10px] uppercase px-4 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                                Visualizar <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
                                                <TrendingUp className="w-10 h-10" />
                                            </div>
                                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Nenhuma coleta encontrada</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
