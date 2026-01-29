import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, Sun, Cloud, CloudRain, CloudLightning, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

import { ViewState } from '../../../types';
import { useActivityLogStore } from '../stores/use-activity-log-store';
import { usePhotoTrackingStore } from '../stores/use-photo-tracking-store';
import { JournalDialog } from '../components/features/project-management/JournalDialog';
import { ViewJournalDialog } from '../components/features/project-management/ViewJournalDialog';
import { ActivityLog } from '../../domain/models/activity-log';

interface JournalPageProps {
    currentView?: ViewState;
}

interface JournalEntry {
    date: Date;
    projectName: string;
    weatherMorning: string;
    weatherAfternoon: string;
    laborInternal: number;
    laborExternal: number;
    activities: { id: string; desc: string; status: string }[];
    photos: { id: string; dataUrl: string }[];
    incidents: string;
}

export const JournalPage: React.FC<JournalPageProps> = ({ currentView }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewingLog, setViewingLog] = useState<ActivityLog | null>(null);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
    const [editingLogId, setEditingLogId] = useState<string | null>(null);

    const { activityLogs, fetchActivityLogs, deleteActivityLog, createActivityLog, updateActivityLog } = useActivityLogStore();
    const { createPhotoTracking, fetchPhotoTrackings, photoTrackings } = usePhotoTrackingStore();

    useEffect(() => {
        fetchActivityLogs();
    }, [fetchActivityLogs]);

    const handleSaveJournal = async (entry: JournalEntry) => {
        try {
            const logData = {
                date: entry.date,
                projectName: entry.projectName,
                weather: entry.weatherAfternoon as any,
                teamCount: entry.laborInternal + entry.laborExternal,
                activities: entry.activities.map(a => ({
                    id: a.id,
                    description: a.desc,
                    startTime: undefined,
                    endTime: undefined
                })),
                materials: [],
                equipment: [],
                notes: entry.incidents,
                status: 'NORMAL' as any
            };

            if (editingLogId) {
                // UPDATE existing log
                await updateActivityLog(editingLogId, logData);
                alert('Diário atualizado com sucesso!');
            } else {
                // CREATE new log
                await createActivityLog(logData);
                alert('Diário salvo com sucesso!');
            }

            // Save photos if any
            if (entry.photos.length > 0) {
                await createPhotoTracking({
                    title: `Fotos - ${format(entry.date, 'dd/MM/yyyy')}`,
                    date: entry.date,
                    projectName: entry.projectName,
                    category: 'PROGRESS',
                    location: '',
                    description: '',
                    photos: entry.photos.map(p => ({
                        id: p.id,
                        dataUrl: p.dataUrl,
                        caption: '',
                        uploadedAt: new Date()
                    })),
                    photoCount: entry.photos.length,
                    tags: []
                });
            }
        } catch (error) {
            console.error('Error saving journal:', error);
            alert('Erro ao salvar diário!');
        }
    };

    const handleView = (log: ActivityLog) => {
        setViewingLog(log);
        setIsViewDialogOpen(true);
    };

    const handleEdit = async (log: ActivityLog) => {
        // Store the ID of the log being edited
        setEditingLogId(log.id);

        // Find photos for this log
        await fetchPhotoTrackings();
        const existingPhotos = photoTrackings.filter(pt =>
            format(new Date(pt.date), 'dd/MM/yyyy') === format(new Date(log.date), 'dd/MM/yyyy') &&
            pt.projectName === log.projectName
        );
        const photos = existingPhotos.flatMap(pt => pt.photos || []);

        // Convert ActivityLog to JournalEntry format
        const entry: JournalEntry = {
            date: new Date(log.date),
            projectName: log.projectName,
            weatherMorning: log.weather,
            weatherAfternoon: log.weather,
            laborInternal: Math.floor(log.teamCount / 2),
            laborExternal: Math.floor(log.teamCount / 2),
            activities: log.activities.map(a => ({
                id: a.id,
                desc: a.description,
                status: 'IN_PROGRESS'
            })),
            photos: photos,
            incidents: log.notes || ''
        };
        setEditingEntry(entry);
        setIsJournalDialogOpen(true);
    };

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

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'PRODUCTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'NORMAL': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'UNPRODUCTIVE': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diário de Obras</h1>
                    <p className="text-slate-500 font-medium">Registro diário de atividades e ocorrências.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2 px-4 border-x border-slate-100">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-black text-slate-800 uppercase tracking-tighter">
                                {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                    <Button
                        onClick={() => setIsJournalDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Novo Registro
                    </Button>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                {activityLogs.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <div className="text-center space-y-6">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                <Calendar className="w-12 h-12 text-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">Nenhum registro ainda</h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    Clique em "Novo Registro" para documentar as atividades, condições e ocorrências do dia.
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsJournalDialogOpen(true)}
                                className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-slate-200"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Criar Primeiro Registro
                            </Button>
                        </div>
                    </div>
                ) : (
                    activityLogs.map((log) => (
                        <Card key={log.id} className="rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="text-sm font-black text-blue-600 uppercase">
                                                {format(new Date(log.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(log.status)}`}>
                                                {getStatusLabel(log.status)}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">{log.projectName}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleView(log)} className="p-2 text-slate-400 hover:text-blue-500 transition-all" title="Visualizar">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleEdit(log)} className="p-2 text-slate-400 hover:text-amber-500 transition-all" title="Editar">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(log.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all" title="Excluir">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                        {getWeatherIcon(log.weather)}
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase">Clima</div>
                                            <div className="text-sm font-bold text-slate-700">{log.weather}</div>
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
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
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
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <JournalDialog
                isOpen={isJournalDialogOpen}
                onClose={() => {
                    setIsJournalDialogOpen(false);
                    setEditingEntry(null);
                    setEditingLogId(null);
                }}
                onSave={handleSaveJournal}
                entry={editingEntry || undefined}
            />

            <ViewJournalDialog
                isOpen={isViewDialogOpen}
                onClose={() => {
                    setIsViewDialogOpen(false);
                    setViewingLog(null);
                }}
                log={viewingLog}
            />
        </div>
    );
};
