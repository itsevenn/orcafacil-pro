import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Sun, Cloud, CloudRain, CloudLightning, Camera, Clock } from 'lucide-react';
import { Button } from '../../ui/button';
import { v4 as uuidv4 } from 'uuid';

interface Activity {
    id: string;
    desc: string;
    status: 'COMPLETED' | 'IN_PROGRESS';
}

interface Photo {
    id: string;
    dataUrl: string;
}

interface JournalEntry {
    date: Date;
    projectName: string;
    weatherMorning: string;
    weatherAfternoon: string;
    laborInternal: number;
    laborExternal: number;
    activities: Activity[];
    photos: Photo[];
    incidents: string;
}

interface JournalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: JournalEntry) => void;
    entry?: JournalEntry;
}

export const JournalDialog: React.FC<JournalDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    entry
}) => {
    const [date, setDate] = useState(new Date());
    const [projectName, setProjectName] = useState('Obra Principal');
    const [weatherMorning, setWeatherMorning] = useState('SUNNY');
    const [weatherAfternoon, setWeatherAfternoon] = useState('SUNNY');
    const [laborInternal, setLaborInternal] = useState(12);
    const [laborExternal, setLaborExternal] = useState(8);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [incidents, setIncidents] = useState('');
    const [newActivityDesc, setNewActivityDesc] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (entry) {
            setDate(entry.date);
            setProjectName(entry.projectName);
            setWeatherMorning(entry.weatherMorning);
            setWeatherAfternoon(entry.weatherAfternoon);
            setLaborInternal(entry.laborInternal);
            setLaborExternal(entry.laborExternal);
            setActivities(entry.activities);
            setPhotos(entry.photos);
            setIncidents(entry.incidents);
        } else {
            // Reset
            setDate(new Date());
            setProjectName('Obra Principal');
            setWeatherMorning('SUNNY');
            setWeatherAfternoon('SUNNY');
            setLaborInternal(12);
            setLaborExternal(8);
            setActivities([]);
            setPhotos([]);
            setIncidents('');
        }
    }, [entry, isOpen]);

    const weatherIcons = {
        SUNNY: { icon: Sun, label: 'Sol', color: 'text-amber-500' },
        CLOUDY: { icon: Cloud, label: 'Nublado', color: 'text-slate-500' },
        RAINY: { icon: CloudRain, label: 'Chuva', color: 'text-blue-500' },
        STORM: { icon: CloudLightning, label: 'Tempestade', color: 'text-indigo-500' }
    };

    const handleAddActivity = () => {
        if (!newActivityDesc.trim()) return;
        const newAct: Activity = {
            id: uuidv4(),
            desc: newActivityDesc.trim(),
            status: 'IN_PROGRESS'
        };
        setActivities([...activities, newAct]);
        setNewActivityDesc('');
    };

    const handleToggleStatus = (id: string) => {
        setActivities(activities.map(a =>
            a.id === id ? { ...a, status: a.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' } : a
        ));
    };

    const handleRemoveActivity = (id: string) => {
        setActivities(activities.filter(a => a.id !== id));
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
                alert(`${file.name} não é uma imagem válida!`);
                continue;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} é muito grande! Máximo 5MB.`);
                continue;
            }

            const dataUrl = await fileToBase64(file);
            setPhotos(prev => [...prev, { id: uuidv4(), dataUrl }]);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleRemovePhoto = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectName.trim()) {
            alert('Nome do projeto é obrigatório!');
            return;
        }

        onSave({
            date,
            projectName: projectName.trim(),
            weatherMorning,
            weatherAfternoon,
            laborInternal,
            laborExternal,
            activities,
            photos,
            incidents
        });
        onClose();
    };

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
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />

                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {entry ? 'Editar Diário de Obra' : 'Novo Diário de Obra'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Registre as atividades e condições do dia</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form className="p-6 space-y-6 overflow-y-auto flex-1">
                        {/* Date & Project */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    value={date.toISOString().split('T')[0]}
                                    onChange={(e) => setDate(new Date(e.target.value))}
                                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                    Projeto / Obra
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Ex: Edifício Residencial..."
                                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Weather */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                Condições do Tempo
                            </label>
                            <div className="grid grid-cols-2 gap-6">
                                {['morning', 'afternoon'].map((period) => (
                                    <div key={period} className="space-y-3">
                                        <span className="text-xs font-black text-slate-400 uppercase">
                                            {period === 'morning' ? '🌅 Manhã' : '🌇 Tarde'}
                                        </span>
                                        <div className="flex gap-2">
                                            {Object.entries(weatherIcons).map(([key, cfg]) => {
                                                const isSelected = period === 'morning' ? weatherMorning === key : weatherAfternoon === key;
                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => period === 'morning' ? setWeatherMorning(key as any) : setWeatherAfternoon(key as any)}
                                                        className={`flex-1 p-3 rounded-2xl border-2 transition-all ${isSelected
                                                            ? `border-blue-500 bg-blue-50 ${cfg.color}`
                                                            : 'border-slate-200 bg-white text-slate-300 hover:border-slate-300'
                                                            }`}
                                                        title={cfg.label}
                                                    >
                                                        <cfg.icon className="w-6 h-6 mx-auto" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Labor */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                Mão de Obra
                            </label>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <span className="text-xs font-black text-slate-400 uppercase">👷 Interna</span>
                                    <input
                                        type="number"
                                        value={laborInternal}
                                        onChange={(e) => setLaborInternal(parseInt(e.target.value) || 0)}
                                        className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-2xl font-black text-slate-900"
                                        min="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-xs font-black text-slate-400 uppercase">🏗️ Externa</span>
                                    <input
                                        type="number"
                                        value={laborExternal}
                                        onChange={(e) => setLaborExternal(parseInt(e.target.value) || 0)}
                                        className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-2xl font-black text-slate-900"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Activities */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                📋 Atividades Executadas
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newActivityDesc}
                                    onChange={(e) => setNewActivityDesc(e.target.value)}
                                    placeholder="Ex: Concretagem da laje..."
                                    className="flex-1 p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddActivity();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddActivity}
                                    className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
                                >
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {activities.map((act) => (
                                    <div key={act.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-all">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(act.id)}
                                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${act.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                                }`}
                                        >
                                            {act.status === 'COMPLETED' ? '✓' : <Clock className="w-4 h-4" />}
                                        </button>
                                        <span className="flex-1 font-bold text-slate-700">{act.desc}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveActivity(act.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {activities.length === 0 && (
                                    <div className="text-center py-6 text-slate-400 text-sm bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        Nenhuma atividade registrada
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                📸 Galeria de Fotos
                            </label>
                            <div className="grid grid-cols-4 gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                                >
                                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Adicionar</span>
                                </div>
                                {photos.map((photo) => (
                                    <div key={photo.id} className="aspect-square rounded-2xl bg-slate-100 relative overflow-hidden group">
                                        <img src={photo.dataUrl} alt="Foto" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(photo.id)}
                                                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Incidents */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                ⚠️ Ocorrências / Incidentes
                            </label>
                            <textarea
                                value={incidents}
                                onChange={(e) => setIncidents(e.target.value)}
                                placeholder="Descreva qualquer imprevisto, acidente ou atraso..."
                                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none"
                            />
                        </div>
                    </form>

                    {/* Footer - Fixed at bottom */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="ghost"
                            className="flex-1 py-6 rounded-xl font-black uppercase text-xs tracking-widest"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 py-6 bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-slate-200"
                        >
                            Salvar Diário
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
