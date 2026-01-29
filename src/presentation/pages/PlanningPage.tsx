import React, { useState, useEffect } from 'react';
import { usePlanningStore } from '../stores/use-planning-store';
import { Button } from '../components/ui/button';
import { Search, Plus, Calendar, TrendingUp, Trash2, Edit2, Eye, BarChart, Clock, CheckCircle2, PauseCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PlanningDialog } from '../components/features/project-management/PlanningDialog';
import { PlanningViewDialog } from '../components/features/project-management/PlanningViewDialog';
import { Planning } from '../../domain/models/planning';

export const PlanningPage: React.FC = () => {
    const { plannings, fetchPlannings, deletePlanning, createPlanning, updatePlanning, isLoading } = usePlanningStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED'>('ALL');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlanning, setEditingPlanning] = useState<Planning | undefined>(undefined);
    const [viewingPlanning, setViewingPlanning] = useState<Planning | undefined>(undefined);

    useEffect(() => {
        fetchPlannings();
    }, [fetchPlannings]);

    const filtered = plannings.filter(p => {
        const matchesSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'ACTIVE': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ON_HOLD': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'Rascunho';
            case 'ACTIVE': return 'Em Andamento';
            case 'ON_HOLD': return 'Pausado';
            case 'COMPLETED': return 'Concluído';
            default: return status;
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Deseja realmente excluir este planejamento?')) {
            deletePlanning(id);
        }
    };

    const handleSave = async (data: Omit<Planning, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingPlanning) {
            await updatePlanning(editingPlanning.id, data);
        } else {
            await createPlanning(data);
        }
        setIsDialogOpen(false);
        setEditingPlanning(undefined);
    };

    const handleNew = () => {
        setEditingPlanning(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (planning: Planning) => {
        setEditingPlanning(planning);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8 h-full flex flex-col p-6">
            {/* Premium Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    <BarChart className="w-3 h-3" />
                    <span>Gestão de Obras</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-blue-600">Planejamento</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                            Planejamento e Controle
                            <div className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[10px] text-blue-600 align-middle">PRO</div>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 max-w-xl font-medium">
                            Gerencie o cronograma físico-financeiro e acompanhe o progresso das suas obras.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleNew} className="bg-slate-900 hover:bg-black text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-slate-200 flex items-center gap-3 transition-all">
                            <Plus className="w-5 h-5" /> Novo Planejamento
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <BarChart className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Total</div>
                        <div className="text-2xl font-black text-slate-900">{plannings.length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Ativos</div>
                        <div className="text-2xl font-black text-slate-900">{plannings.filter(p => p.status === 'ACTIVE').length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <PauseCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Pausados</div>
                        <div className="text-2xl font-black text-slate-900">{plannings.filter(p => p.status === 'ON_HOLD').length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Concluídos</div>
                        <div className="text-2xl font-black text-slate-900">{plannings.filter(p => p.status === 'COMPLETED').length}</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por projeto ou cliente..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-medium text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Status:</span>
                        {['ALL', 'DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                                    statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                                )}
                            >
                                {s === 'ALL' ? 'Todos' : getStatusLabel(s)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/50">
                                <th className="px-8 py-5">Projeto</th>
                                <th className="px-8 py-5">Cliente</th>
                                <th className="px-8 py-5">Período</th>
                                <th className="px-8 py-5">Progresso</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Orçamento</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900">{p.projectName}</div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight truncate max-w-xs">
                                            {p.description}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-600 font-bold text-sm">{p.clientName}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {format(new Date(p.startDate), "dd/MM/yyyy")}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                até {format(new Date(p.endDate), "dd/MM/yyyy")}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                                    style={{ width: `${p.overallProgress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black text-slate-600 w-10 text-right">{p.overallProgress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            getStatusStyles(p.status)
                                        )}>
                                            {getStatusLabel(p.status)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="font-black text-slate-900 text-base">
                                            {p.totalBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setViewingPlanning(p)} className="p-2 text-slate-400 hover:text-blue-500 transition-all">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-amber-500 transition-all">
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="p-2 text-slate-400 hover:text-red-500 transition-all"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
                                                <BarChart className="w-10 h-10" />
                                            </div>
                                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Nenhum planejamento encontrado</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <PlanningDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingPlanning(undefined);
                }}
                onSave={handleSave}
                planning={editingPlanning}
            />
            {viewingPlanning && (
                <PlanningViewDialog
                    isOpen={!!viewingPlanning}
                    onClose={() => setViewingPlanning(undefined)}
                    planning={viewingPlanning}
                />
            )}
        </div>
    );
};
