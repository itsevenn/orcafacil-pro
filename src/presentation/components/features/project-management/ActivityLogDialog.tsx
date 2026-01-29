import React, { useState } from 'react';
import { ActivityLog, Activity, WeatherType, ActivityStatus } from '../../../../domain/models/activity-log';
import { Button } from '../../ui/button';
import { X, Save, Plus, Trash2, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ActivityLogDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'>) => void;
    activityLog?: ActivityLog;
}

export const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({ isOpen, onClose, onSave, activityLog }) => {
    const [formData, setFormData] = useState({
        date: activityLog?.date ? new Date(activityLog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        projectName: activityLog?.projectName || '',
        weather: (activityLog?.weather || 'SUNNY') as WeatherType,
        teamCount: activityLog?.teamCount || 0,
        materials: activityLog?.materials || [],
        equipment: activityLog?.equipment || [],
        notes: activityLog?.notes || '',
        status: (activityLog?.status || 'NORMAL') as ActivityStatus
    });

    const [activities, setActivities] = useState<Activity[]>(activityLog?.activities || []);
    const [newActivity, setNewActivity] = useState({ description: '', startTime: '', endTime: '' });
    const [newMaterial, setNewMaterial] = useState('');
    const [newEquipment, setNewEquipment] = useState('');


    const handleAddActivity = () => {
        if (!newActivity.description.trim()) return;
        const activity: Activity = {
            id: uuidv4(),
            description: newActivity.description,
            startTime: newActivity.startTime || undefined,
            endTime: newActivity.endTime || undefined
        };
        setActivities([...activities, activity]);
        setNewActivity({ description: '', startTime: '', endTime: '' });
    };

    const handleAddMaterial = () => {
        if (!newMaterial.trim()) return;
        setFormData({ ...formData, materials: [...formData.materials, newMaterial] });
        setNewMaterial('');
    };

    const handleAddEquipment = () => {
        if (!newEquipment.trim()) return;
        setFormData({ ...formData, equipment: [...formData.equipment, newEquipment] });
        setNewEquipment('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            date: new Date(formData.date),
            projectName: formData.projectName,
            weather: formData.weather,
            teamCount: formData.teamCount,
            activities,
            materials: formData.materials,
            equipment: formData.equipment,
            notes: formData.notes,
            status: formData.status
        });
        onClose();
    };

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
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {activityLog ? 'Editar Registro' : 'Novo Registro de Atividade'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Documente as atividades do dia</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Data *</label>
                                <input type="date" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Projeto *</label>
                                <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none" value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Clima</label>
                                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none" value={formData.weather} onChange={(e) => setFormData({ ...formData, weather: e.target.value as WeatherType })}>
                                    <option value="SUNNY">☀️ Ensolarado</option>
                                    <option value="CLOUDY">☁️ Nublado</option>
                                    <option value="RAINY">🌧️ Chuvoso</option>
                                    <option value="STORM">⛈️ Tempestade</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Equipe (pessoas)</label>
                                <input type="number" min="0" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none" value={formData.teamCount} onChange={(e) => setFormData({ ...formData, teamCount: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Status</label>
                                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ActivityStatus })}>
                                    <option value="PRODUCTIVE">Produtivo</option>
                                    <option value="NORMAL">Normal</option>
                                    <option value="UNPRODUCTIVE">Improdutivo</option>
                                </select>
                            </div>
                        </div>

                        {/* Activities */}
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase mb-3">Atividades Executadas</h3>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-3">
                                <div className="grid grid-cols-12 gap-2">
                                    <input type="text" placeholder="Descrição da atividade..." className="col-span-12 px-3 py-2 text-sm border border-amber-200 rounded-lg" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddActivity())} />
                                    <button type="button" onClick={handleAddActivity} className="col-span-12 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold">
                                        <Plus className="w-4 h-4 inline mr-1" /> Adicionar
                                    </button>
                                </div>
                            </div>
                            {activities.map((act, idx) => (
                                <div key={act.id} className="flex items-center gap-2 mb-2 bg-white border border-slate-100 p-3 rounded-xl">
                                    <span className="text-xs font-black text-amber-600">{idx + 1}</span>
                                    <span className="flex-1 text-sm text-slate-700">{act.description}</span>
                                    <button type="button" onClick={() => setActivities(activities.filter(a => a.id !== act.id))} className="p-1 text-slate-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Materials & Equipment */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase mb-3">Materiais Utilizados</h3>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" placeholder="Nome do material..." className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg" value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())} />
                                    <button type="button" onClick={handleAddMaterial} className="px-4 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm">+</button>
                                </div>
                                {formData.materials.map((mat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-1 bg-slate-50 px-3 py-2 rounded-lg text-sm">
                                        <span className="flex-1">{mat}</span>
                                        <button type="button" onClick={() => setFormData({ ...formData, materials: formData.materials.filter((_, i) => i !== idx) })} className="text-slate-400 hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase mb-3">Equipamentos</h3>
                                <div className="flex gap-2 mb-2">
                                    <input type="text" placeholder="Nome do equipamento..." className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg" value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEquipment())} />
                                    <button type="button" onClick={handleAddEquipment} className="px-4 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm">+</button>
                                </div>
                                {formData.equipment.map((eq, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-1 bg-slate-50 px-3 py-2 rounded-lg text-sm">
                                        <span className="flex-1">{eq}</span>
                                        <button type="button" onClick={() => setFormData({ ...formData, equipment: formData.equipment.filter((_, i) => i !== idx) })} className="text-slate-400 hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Observações</label>
                            <textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none resize-none" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Notas sobre o dia..." />
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-[2rem] shrink-0 flex gap-3 justify-end">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancelar</Button>
                        <Button type="button" onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                            <Save className="w-4 h-4 mr-2" /> Salvar Registro
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
