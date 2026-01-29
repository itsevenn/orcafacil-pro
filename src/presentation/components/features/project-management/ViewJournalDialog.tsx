import React, { useEffect, useState } from 'react';
import { X, Sun, Cloud, CloudRain, CloudLightning, Users, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityLog } from '../../../../domain/models/activity-log';
import { usePhotoTrackingStore } from '../../../stores/use-photo-tracking-store';

interface ViewJournalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    log: ActivityLog | null;
}

export const ViewJournalDialog: React.FC<ViewJournalDialogProps> = ({ isOpen, onClose, log }) => {
    const [photos, setPhotos] = useState<any[]>([]);
    const { photoTrackings, fetchPhotoTrackings } = usePhotoTrackingStore();

    useEffect(() => {
        const loadPhotos = async () => {
            if (isOpen && log) {
                await fetchPhotoTrackings();
            }
        };
        loadPhotos();
    }, [isOpen, log, fetchPhotoTrackings]);

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

    useEffect(() => {
        if (isOpen && log && photoTrackings.length > 0) {
            // Find photos for this log's date and project
            const logPhotos = photoTrackings.filter(pt =>
                format(new Date(pt.date), 'dd/MM/yyyy') === format(new Date(log.date), 'dd/MM/yyyy') &&
                pt.projectName === log.projectName
            );
            const allPhotos = logPhotos.flatMap(pt => pt.photos || []);
            setPhotos(allPhotos);
            console.log('Found photos:', allPhotos.length, 'for', log.projectName, format(new Date(log.date), 'dd/MM/yyyy'));
        }
    }, [photoTrackings, isOpen, log]);

    if (!isOpen || !log) return null;

    const getWeatherIcon = (weather: string) => {
        switch (weather) {
            case 'SUNNY': return <Sun className="w-6 h-6 text-amber-500" />;
            case 'CLOUDY': return <Cloud className="w-6 h-6 text-slate-400" />;
            case 'RAINY': return <CloudRain className="w-6 h-6 text-blue-500" />;
            case 'STORM': return <CloudLightning className="w-6 h-6 text-slate-700" />;
            default: return <Sun className="w-6 h-6" />;
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

    return (
        <>
            {/* Backdrop - Blur only applies to content behind it (z-5 < Header z-10) */}
            <div
                className="fixed inset-0 bg-slate-900/60 z-[100]"
                onClick={onClose}
            />

            {/* Modal Container - sits on top of everything but lets clicks pass through to Sidebar/Header */}
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                <div
                    className="bg-white rounded-3xl shadow-2xl max-w-[800px] w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 fade-in duration-200 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white rounded-t-3xl text-slate-900 z-10 shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Visualizar Registro</h2>
                            <p className="text-sm text-slate-500">
                                {format(new Date(log.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {/* Project Info */}
                        <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-2xl border border-blue-100">
                            <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">Projeto</div>
                            <h3 className="text-3xl font-black text-slate-900">{log.projectName}</h3>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-3 mb-3">
                                    {getWeatherIcon(log.weather)}
                                    <div className="text-xs font-black text-amber-600 uppercase">Condição do Tempo</div>
                                </div>
                                <div className="text-2xl font-black text-slate-900">{getWeatherLabel(log.weather)}</div>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <Users className="w-6 h-6 text-blue-500" />
                                    <div className="text-xs font-black text-blue-600 uppercase">Equipe Total</div>
                                </div>
                                <div className="text-2xl font-black text-slate-900">{log.teamCount} pessoas</div>
                            </div>
                        </div>

                        {/* Activities */}
                        {log.activities.length > 0 && (
                            <div className="space-y-3">
                                <div className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                    Atividades Executadas ({log.activities.length})
                                </div>
                                <div className="space-y-2">
                                    {log.activities.map((activity) => (
                                        <div key={activity.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-900">{activity.description}</div>
                                                    {activity.startTime && activity.endTime && (
                                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {activity.startTime} - {activity.endTime}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Photos */}
                        {photos.length > 0 && (
                            <div className="space-y-3">
                                <div className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-4 bg-pink-500 rounded-full" />
                                    Fotos do Registro ({photos.length})
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {photos.map((photo) => (
                                        <div key={photo.id} className="relative group">
                                            <img
                                                src={photo.dataUrl}
                                                alt={photo.caption || 'Foto do registro'}
                                                className="w-full h-32 object-cover rounded-xl border-2 border-slate-200 hover:border-pink-400 transition-all cursor-pointer"
                                            />
                                            {photo.caption && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {photo.caption}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Materials */}
                        {log.materials && log.materials.length > 0 && (
                            <div className="space-y-3">
                                <div className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                    Materiais Utilizados ({log.materials.length})
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {log.materials.map((material) => (
                                        <div key={material.id} className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                            <div className="font-bold text-slate-900 text-sm">{material.name}</div>
                                            <div className="text-xs text-slate-600">
                                                Qtd: {material.quantity} {material.unit}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Equipment */}
                        {log.equipment && log.equipment.length > 0 && (
                            <div className="space-y-3">
                                <div className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-4 bg-purple-500 rounded-full" />
                                    Equipamentos ({log.equipment.length})
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {log.equipment.map((equip) => (
                                        <div key={equip.id} className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                                            <div className="font-bold text-slate-900 text-sm">{equip.name}</div>
                                            <div className="text-xs text-slate-600">
                                                {equip.hoursUsed}h de uso
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes/Incidents */}
                        {log.notes && (
                            <div className="space-y-3">
                                <div className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-4 bg-amber-500 rounded-full" />
                                    Observações e Incidentes
                                </div>
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <p className="text-slate-700 whitespace-pre-wrap">{log.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-6 text-xs text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Criado em {format(new Date(log.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </div>
                                {log.updatedAt && new Date(log.updatedAt).getTime() !== new Date(log.createdAt).getTime() && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        Atualizado em {format(new Date(log.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
