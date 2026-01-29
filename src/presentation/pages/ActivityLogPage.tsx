import React, { useState, useEffect } from 'react';
import { useActivityLogStore } from '../stores/use-activity-log-store';
import { Button } from '../components/ui/button';
import { Search, Plus, CalendarDays, Users, TrendingUp, Eye, Edit2, Trash2, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityLog } from '../../domain/models/activity-log';
import { ActivityLogDialog } from '../components/features/project-management/ActivityLogDialog';

export const ActivityLogPage: React.FC = () => {
    const { activityLogs, fetchActivityLogs, deleteActivityLog, createActivityLog, updateActivityLog } = useActivityLogStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRODUCTIVE' | 'NORMAL' | 'UNPRODUCTIVE'>('ALL');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<ActivityLog | undefined>(undefined);

    useEffect(() => {
        fetchActivityLogs();
    }, [fetchActivityLogs]);

    const handleNew = () => {
        setEditingLog(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (log: ActivityLog) => {
        setEditingLog(log);
        setIsDialogOpen(true);
    };

    const handleSave = async (data: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingLog) {
            await updateActivityLog(editingLog.id, data);
        } else {
            await createActivityLog(data);
        }
        setIsDialogOpen(false);
        setEditingLog(undefined);
    };

    const filteredLogs = activityLogs.filter(log => {
        const matchesSearch = log.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.notes.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este registro?')) {
            await deleteActivityLog(id);
        }
    };

    const getWeatherIcon = (weather: string) => {
        switch (weather) {
            case 'SUNNY': return <Sun className="w-5 h-5 text-amber-500" />;
            case 'CLOUDY': return <Cloud className="w-5 h-5 text-slate-400" />;
            case 'RAINY': return <CloudRain className="w-5 h-5 text-blue-500" />;
            case 'STORM': return <CloudLightning className="w-5 h-5 text-slate-700" />;
            default: return <Sun className="w-5 h-5" />;
        }
    };

    const getWeatherLabel = (weather: string) => {
        switch (weather) {
            case 'SUNNY': return 'Ensolarado';
            case 'CLOUDY': return 'Nublado';
            case 'RAINY': return 'Chuvoso';
            case 'STORM': return 'Tempestade';
            default: return weather;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PRODUCTIVE': return 'Produtivo';
            case 'NORMAL': return 'Normal';
            case 'UNPRODUCTIVE': return 'Improdutivo';
            default: return status;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'PRODUCTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'NORMAL': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'UNPRODUCTIVE': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const totalLogs = activityLogs.length;
    const productiveDays = activityLogs.filter(l => l.status === 'PRODUCTIVE').length;
    const avgTeam = activityLogs.length > 0
        ? Math.round(activityLogs.reduce((sum, l) => sum + l.teamCount, 0) / activityLogs.length)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Registro de Atividades</h1>
                        <p className="text-slate-500 mt-2">Diário de obra e acompanhamento diário</p>
                    </div>
                    <Button onClick={handleNew} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg">
                        <Plus className="w-5 h-5 mr-2" /> Novo Registro
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Total Registros</div>
                                <div className="text-3xl font-black text-slate-900">{totalLogs}</div>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                                <CalendarDays className="w-7 h-7 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Dias Produtivos</div>
                                <div className="text-3xl font-black text-emerald-600">{productiveDays}</div>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Equipe Média</div>
                                <div className="text-3xl font-black text-blue-600">{avgTeam}</div>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Users className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por projeto ou observação..."
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none font-bold text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="ALL">Todos os Status</option>
                            <option value="PRODUCTIVE">Produtivo</option>
                            <option value="NORMAL">Normal</option>
                            <option value="UNPRODUCTIVE">Improdutivo</option>
                        </select>
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                    {filteredLogs.length === 0 ? (
                        <div className="bg-white p-16 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <CalendarDays className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-slate-300 mb-2">Nenhum registro encontrado</h3>
                            <p className="text-slate-400">Clique em "Novo Registro" para começar</p>
                        </div>
                    ) : (
                        filteredLogs.map((log) => (
                            <div key={log.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-sm font-black text-amber-600 uppercase">
                                                    {format(new Date(log.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(log.status)}`}>
                                                    {getStatusLabel(log.status)}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900">{log.projectName}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-all">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleEdit(log)} className="p-2 text-slate-400 hover:text-amber-500 transition-all">
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(log.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                            {getWeatherIcon(log.weather)}
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase">Clima</div>
                                                <div className="text-sm font-bold text-slate-700">{getWeatherLabel(log.weather)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                            <Users className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase">Equipe</div>
                                                <div className="text-sm font-bold text-slate-700">{log.teamCount} pessoas</div>
                                            </div>
                                        </div>
                                    </div>

                                    {log.activities.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs font-black text-slate-400 uppercase mb-2">Atividades Executadas</div>
                                            <div className="space-y-1">
                                                {log.activities.slice(0, 3).map((activity) => (
                                                    <div key={activity.id} className="text-sm text-slate-600 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                        {activity.description}
                                                    </div>
                                                ))}
                                                {log.activities.length > 3 && (
                                                    <div className="text-xs text-slate-400 font-bold">
                                                        +{log.activities.length - 3} atividade(s)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {log.notes && (
                                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                                            <div className="text-xs font-black text-amber-600 uppercase mb-1">Observações</div>
                                            <p className="text-sm text-slate-600">{log.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ActivityLogDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingLog(undefined);
                }}
                onSave={handleSave}
                activityLog={editingLog}
            />
        </div>
    );
};
