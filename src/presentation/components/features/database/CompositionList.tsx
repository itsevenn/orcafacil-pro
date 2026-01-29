import React, { useState } from 'react';
import { useDatabaseStore } from '../../../stores/use-database-store';
import { Composition } from '../../../../domain/models/composition';
import { Button } from '../../ui/button';
import { Input as SearchInput } from '../../ui/input';
import { Search, Plus, Filter, ChevronLeft, ChevronRight, ChevronRight as ArrowRight, FileDown, Trash2 } from 'lucide-react';
import { CompositionEditor } from './CompositionEditor';
import { CompositionFormData } from '../../../../domain/validation/database-schema';
import { cn } from '../../../../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CompositionListProps {
    initialSource?: string;
    onViewAnalytic?: (comp: Composition) => void;
}

export const CompositionList: React.FC<CompositionListProps> = ({ initialSource, onViewAnalytic }) => {
    const { compositions, isLoading, fetchCompositions, createComposition, updateComposition, deleteComposition } = useDatabaseStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSource, setSelectedSource] = useState(initialSource || 'Todas as Bases');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingComp, setEditingComp] = useState<Composition | null>(null);

    // Initial fetch
    React.useEffect(() => {
        fetchCompositions();
    }, [fetchCompositions]);

    // Sync source with initialSource
    React.useEffect(() => {
        if (initialSource) {
            setSelectedSource(initialSource === 'PROPRIA' || initialSource === 'OWN' ? 'Próprias' : initialSource);
        }
    }, [initialSource]);

    const filteredComps = compositions.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSource = selectedSource === 'Todas as Bases' ||
            (selectedSource === 'Próprias' && (c.source === 'PROPRIA' || c.source === 'OWN' || !c.source)) ||
            c.source === selectedSource;

        return matchesSearch && matchesSource;
    });

    const handleSave = async (data: CompositionFormData) => {
        if (editingComp) {
            await updateComposition(editingComp.id, data);
        } else {
            await createComposition(data);
        }
        setIsEditorOpen(false);
        setEditingComp(null);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Deseja excluir esta composição?')) {
            await deleteComposition(id);
        }
    };

    const getSourceBadgeColor = (source?: string) => {
        switch (source) {
            case 'SINAPI': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
            case 'ORSE': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
            case 'SBC': return 'bg-green-100 text-green-700 hover:bg-green-200';
            case 'OWN': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section from Screenshot */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <span>Home</span>
                    <span className="text-slate-300">/</span>
                    <span className="font-medium text-slate-700">Compositions</span>
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Catálogo de Composições</h1>
                        <p className="text-slate-500 text-sm mt-1">Explore composições analíticas do SINAPI, ORSE e Próprias.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="text-slate-600 border-slate-300 hover:bg-slate-50 rounded-xl h-11 px-6 shadow-sm">
                            <FileDown className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                        <Button className="bg-[#0070d2] hover:bg-[#005fb2] text-white shadow-lg shadow-blue-100 rounded-xl h-11 px-8 font-black" onClick={() => { setEditingComp(null); setIsEditorOpen(true); }}>
                            <Plus className="w-4 h-4 mr-2" /> Nova Composição
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-1 rounded-2xl flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por código, descrição ou categoria..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 text-white placeholder-slate-400 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <select
                        className="appearance-none bg-white border border-slate-200 text-slate-700 py-3 pl-6 pr-12 rounded-xl text-sm font-bold focus:outline-none focus:border-[#0070d2] cursor-pointer hover:border-slate-300 shadow-sm transition-all"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                    >
                        <option>Todas as Bases</option>
                        <option>SINAPI</option>
                        <option>ORSE</option>
                        <option>Próprias</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 w-28">Fonte</th>
                            <th className="px-8 py-5 w-24">Código</th>
                            <th className="px-8 py-5">Descrição da Composição</th>
                            <th className="px-8 py-5 w-20 text-center">Unid.</th>
                            <th className="px-8 py-5 w-32 text-right">Preço Total</th>
                            <th className="px-8 py-5 w-32 text-center">Região/Ref</th>
                            <th className="px-8 py-5 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-8 py-6"><div className="h-6 w-16 bg-slate-100 rounded-lg"></div></td>
                                    <td className="px-8 py-6"><div className="h-4 w-12 bg-slate-100 rounded"></div></td>
                                    <td className="px-8 py-6">
                                        <div className="h-4 w-3/4 bg-slate-100 rounded mb-2"></div>
                                        <div className="h-3 w-1/4 bg-slate-100 rounded"></div>
                                    </td>
                                    <td className="px-8 py-6"><div className="h-4 w-8 bg-slate-100 rounded mx-auto"></div></td>
                                    <td className="px-8 py-6"><div className="h-4 w-20 bg-slate-100 rounded ml-auto"></div></td>
                                    <td className="px-8 py-6"><div className="h-8 w-16 bg-slate-100 rounded mx-auto"></div></td>
                                    <td className="px-8 py-6"></td>
                                </tr>
                            ))
                        ) : filteredComps.length === 0 ? (
                            <tr><td colSpan={7} className="p-20 text-center text-slate-400 font-medium">Nenhuma composição encontrada para os filtros selecionados.</td></tr>
                        ) : (
                            filteredComps.map(item => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                    onClick={() => { setEditingComp(item); setIsEditorOpen(true); }}
                                >
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                            getSourceBadgeColor(item.source)
                                        )}>
                                            {item.source || 'PRÓPRIA'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-mono text-[11px] font-bold text-[#0070d2]">
                                        {item.code}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-slate-700 leading-tight mb-1 group-hover:text-[#0070d2] transition-colors">
                                            {item.name}
                                        </div>
                                        {item.category && (
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                                {item.category}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-slate-500 font-bold text-center uppercase text-xs">
                                        {item.unit}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="font-black text-slate-900 text-base">
                                            {(item.totalWithBDI || item.totalCost).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {item.referenceDate && (
                                            <div className="flex flex-col items-center text-[10px] text-slate-500 font-bold">
                                                <span>{format(new Date(item.referenceDate), 'MM/yyyy')}</span>
                                                <span className="text-[#0070d2] uppercase">{item.referenceRegion || 'MG'}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewAnalytic?.(item);
                                                }}
                                                className="p-2 hover:bg-white rounded-xl shadow-sm text-slate-400 hover:text-[#0070d2] transition-all"
                                                title="Ver CPU Analítica"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(item.id, e)}
                                                className="p-2 hover:bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition-all font-bold"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Footer / Pagination */}
                <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-6 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Mostrando <span className="text-slate-900">{filteredComps.length}</span> registros <span className="text-slate-200 mx-2">|</span> Base Ativa: {selectedSource}
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-9 px-4 font-bold disabled:opacity-30" disabled>
                            Anterior
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-9 px-4 font-bold">
                            Próximo
                        </Button>
                    </div>
                </div>
            </div>

            <CompositionEditor
                open={isEditorOpen}
                onOpenChange={setIsEditorOpen}
                composition={editingComp}
                onSave={handleSave}
            />
        </div>
    );
};

