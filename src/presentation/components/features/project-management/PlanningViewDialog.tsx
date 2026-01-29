import React, { useEffect } from 'react';
import { Planning } from '../../../../domain/models/planning';
import { X, Calendar, BarChart, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PlanningViewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    planning: Planning;
}

export const PlanningViewDialog: React.FC<PlanningViewDialogProps> = ({ isOpen, onClose, planning }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'Rascunho';
            case 'ACTIVE': return 'Em Andamento';
            case 'ON_HOLD': return 'Pausado';
            case 'COMPLETED': return 'Concluído';
            default: return status;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'ACTIVE': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ON_HOLD': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const durationDays = Math.ceil((new Date(planning.endDate).getTime() - new Date(planning.startDate).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900/60 z-[100]"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Detalhes do Planejamento</h2>
                            <p className="text-sm text-slate-500 mt-1">{planning.description || 'Cronograma de obra'}</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 overflow-y-auto">
                        {/* Project Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <div className="text-xs font-black text-slate-400 uppercase mb-2">Projeto</div>
                                <div className="text-lg font-black text-slate-900">{planning.projectName}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <div className="text-xs font-black text-slate-400 uppercase mb-2">Cliente</div>
                                <div className="text-lg font-black text-slate-900">{planning.clientName}</div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Início</span>
                                </div>
                                <div className="text-sm font-bold text-slate-700">
                                    {format(new Date(planning.startDate), "dd/MM/yyyy")}
                                </div>
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Término</span>
                                </div>
                                <div className="text-sm font-bold text-slate-700">
                                    {format(new Date(planning.endDate), "dd/MM/yyyy")}
                                </div>
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Duração</span>
                                </div>
                                <div className="text-sm font-bold text-slate-700">{durationDays} dias</div>
                            </div>
                        </div>

                        {/* Status & Budget */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-3">
                                    <BarChart className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Status</span>
                                </div>
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusStyles(planning.status)}`}>
                                    {getStatusLabel(planning.status)}
                                </span>
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Orçamento Total</span>
                                </div>
                                <div className="text-xl font-black text-slate-900">
                                    {planning.totalBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-black text-blue-700 uppercase">Progresso Geral</span>
                                <span className="text-2xl font-black text-blue-700">{planning.overallProgress}%</span>
                            </div>
                            <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                    style={{ width: `${planning.overallProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Tasks */}
                        {planning.tasks && planning.tasks.length > 0 && (
                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                                    <h3 className="text-xs font-black text-slate-700 uppercase">Tarefas do Cronograma</h3>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {planning.tasks.map((task) => (
                                        <div key={task.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-900">{task.name}</div>
                                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                                                        <span>{format(new Date(task.startDate), "dd/MM/yyyy")}</span>
                                                        <span>→</span>
                                                        <span>{format(new Date(task.endDate), "dd/MM/yyyy")}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-blue-600">{task.progress}%</div>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
                                                    style={{ width: `${task.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-[2rem]">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
