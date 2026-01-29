import React, { useState, useEffect } from 'react';
import { Planning, PlanningTask } from '../../../../domain/models/planning';
import { Button } from '../../ui/button';
import { X, Save, Plus, Trash2, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PlanningDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Planning, 'id' | 'createdAt' | 'updatedAt'>) => void;
    planning?: Planning;
}

export const PlanningDialog: React.FC<PlanningDialogProps> = ({ isOpen, onClose, onSave, planning }) => {
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

    const [formData, setFormData] = useState({
        projectName: planning?.projectName || '',
        clientName: planning?.clientName || '',
        description: planning?.description || '',
        startDate: planning?.startDate ? new Date(planning.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: planning?.endDate ? new Date(planning.endDate).toISOString().split('T')[0] : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: planning?.status || 'DRAFT' as const,
        totalBudget: planning?.totalBudget || 0,
        overallProgress: planning?.overallProgress || 0
    });

    const [tasks, setTasks] = useState<PlanningTask[]>(planning?.tasks || []);
    const [newTask, setNewTask] = useState({
        name: '',
        startDate: formData.startDate,
        endDate: formData.endDate,
        progress: 0
    });

    if (!isOpen) return null;

    const handleAddTask = () => {
        if (!newTask.name.trim()) return;

        const task: PlanningTask = {
            id: uuidv4(),
            name: newTask.name,
            startDate: new Date(newTask.startDate),
            endDate: new Date(newTask.endDate),
            progress: newTask.progress
        };

        setTasks([...tasks, task]);
        setNewTask({
            name: '',
            startDate: formData.startDate,
            endDate: formData.endDate,
            progress: 0
        });
    };

    const handleRemoveTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate overall progress from tasks
        const calculatedProgress = tasks.length > 0
            ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)
            : formData.overallProgress;

        onSave({
            projectName: formData.projectName,
            clientName: formData.clientName,
            description: formData.description,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            status: formData.status,
            totalBudget: formData.totalBudget,
            tasks: tasks,
            overallProgress: calculatedProgress
        });
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900/60 z-[100]"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[800px] max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {planning ? 'Editar Planejamento' : 'Novo Planejamento'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Defina o cronograma e orçamento da obra</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                        {/* Project Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Informações do Projeto</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Nome do Projeto *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.projectName}
                                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Cliente *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Descrição do Projeto</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Ex: Construção de edifício residencial de 10 andares"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Data Início</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Data Término</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Status</label>
                                    <select
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="DRAFT">Rascunho</option>
                                        <option value="ACTIVE">Em Andamento</option>
                                        <option value="ON_HOLD">Pausado</option>
                                        <option value="COMPLETED">Concluído</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Orçamento Total (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.totalBudget}
                                        onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tarefas do Cronograma</h3>
                                <span className="text-xs font-bold text-slate-500">{tasks.length} tarefa(s)</span>
                            </div>

                            {/* Add New Task Form */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
                                <div className="text-xs font-black text-blue-700 uppercase mb-2">Adicionar Nova Tarefa</div>
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-5">
                                        <input
                                            type="text"
                                            placeholder="Nome da tarefa..."
                                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            value={newTask.name}
                                            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            value={newTask.startDate}
                                            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            value={newTask.endDate}
                                            onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <button
                                            type="button"
                                            onClick={handleAddTask}
                                            className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tasks List */}
                            {tasks.length > 0 && (
                                <div className="space-y-2">
                                    {tasks.map((task, index) => (
                                        <div key={task.id} className="bg-white border border-slate-100 rounded-xl p-4 hover:border-blue-200 transition-all group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                                                        <span className="font-bold text-slate-900">{task.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                                                        </div>
                                                        <span>→</span>
                                                        <span>{new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                                                        <span className="ml-auto font-bold text-blue-600">{task.progress}%</span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTask(task.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-16 px-2 py-1 text-xs text-center border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                    value={task.progress}
                                                    onChange={(e) => {
                                                        const updatedTasks = tasks.map(t =>
                                                            t.id === task.id ? { ...t, progress: parseInt(e.target.value) || 0 } : t
                                                        );
                                                        setTasks(updatedTasks);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {tasks.length === 0 && (
                                <div className="text-center py-8 text-slate-300">
                                    <p className="text-sm font-bold">Nenhuma tarefa adicionada</p>
                                    <p className="text-xs mt-1">Adicione tarefas para compor o cronograma</p>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                            Cancelar
                        </Button>
                        <Button type="submit" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                            <Save className="w-4 h-4 mr-2" /> Salvar Planejamento
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
