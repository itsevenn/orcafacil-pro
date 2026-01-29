import React, { useState, useEffect } from 'react';
import { useMeasurementStore } from '../stores/use-measurement-store';
import { Button } from '../components/ui/button';
import { Search, Plus, Calendar, CheckCircle2, Clock, Trash2, Edit2, Eye, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MeasurementDialog } from '../components/features/project-management/MeasurementDialog';
import { MeasurementViewDialog } from '../components/features/project-management/MeasurementViewDialog';
import { Measurement } from '../../domain/models/measurement';

export const MeasurementsPage: React.FC = () => {
    const { measurements, fetchMeasurements, deleteMeasurement, createMeasurement, updateMeasurement, isLoading } = useMeasurementStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID'>('ALL');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMeasurement, setEditingMeasurement] = useState<Measurement | undefined>(undefined);
    const [viewingMeasurement, setViewingMeasurement] = useState<Measurement | undefined>(undefined);

    useEffect(() => {
        fetchMeasurements();
    }, [fetchMeasurements]);

    const filtered = measurements.filter(m => {
        const matchesSearch = m.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'SUBMITTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'Rascunho';
            case 'SUBMITTED': return 'Enviado';
            case 'APPROVED': return 'Aprovado';
            case 'PAID': return 'Pago';
            default: return status;
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Deseja realmente excluir esta medição?')) {
            deleteMeasurement(id);
        }
    };

    const handleSave = async (data: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingMeasurement) {
            await updateMeasurement(editingMeasurement.id, data);
        } else {
            await createMeasurement(data);
        }
        setIsDialogOpen(false);
        setEditingMeasurement(undefined);
    };

    const handleNew = () => {
        setEditingMeasurement(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (measurement: Measurement) => {
        setEditingMeasurement(measurement);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8 h-full flex flex-col p-6">
            {/* Premium Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    <FileText className="w-3 h-3" />
                    <span>Gestão de Obras</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-emerald-600">Medições</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                            Medições de Obras
                            <div className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-600 align-middle">PRO</div>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 max-w-xl font-medium">
                            Acompanhe a execução e gere boletins de medição para controle financeiro da obra.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleNew} className="bg-slate-900 hover:bg-black text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-slate-200 flex items-center gap-3 transition-all">
                            <Plus className="w-5 h-5" /> Nova Medição
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Total</div>
                        <div className="text-2xl font-black text-slate-900">{measurements.length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Pendentes</div>
                        <div className="text-2xl font-black text-slate-900">{measurements.filter(m => m.status === 'SUBMITTED').length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Aprovadas</div>
                        <div className="text-2xl font-black text-slate-900">{measurements.filter(m => m.status === 'APPROVED').length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Pagas</div>
                        <div className="text-2xl font-black text-slate-900">{measurements.filter(m => m.status === 'PAID').length}</div>
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
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-medium text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Status:</span>
                        {['ALL', 'DRAFT', 'SUBMITTED', 'APPROVED', 'PAID'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                                    statusFilter === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400'
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
                                <th className="px-8 py-5">Medição</th>
                                <th className="px-8 py-5">Cliente</th>
                                <th className="px-8 py-5">Data Ref.</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Valor Líquido</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(m => (
                                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900">{m.projectName}</div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight flex items-center gap-1.5">
                                            Nº: <span className="text-slate-500 font-mono">{String(m.measurementNumber).padStart(3, '0')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-600 font-bold text-sm">{m.clientName}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {format(new Date(m.referenceDate), "dd/MM/yyyy")}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            getStatusStyles(m.status)
                                        )}>
                                            {getStatusLabel(m.status)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="font-black text-slate-900 text-base">
                                            {m.netValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setViewingMeasurement(m)} className="p-2 text-slate-400 hover:text-blue-500 transition-all">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleEdit(m)} className="p-2 text-slate-400 hover:text-amber-500 transition-all">
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="p-2 text-slate-400 hover:text-red-500 transition-all"
                                                onClick={() => handleDelete(m.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
                                                <FileText className="w-10 h-10" />
                                            </div>
                                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Nenhuma medição encontrada</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <MeasurementDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingMeasurement(undefined);
                }}
                onSave={handleSave}
                measurement={editingMeasurement}
            />
            {viewingMeasurement && (
                <MeasurementViewDialog
                    isOpen={!!viewingMeasurement}
                    onClose={() => setViewingMeasurement(undefined)}
                    measurement={viewingMeasurement}
                />
            )}
        </div>
    );
};
