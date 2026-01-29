import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';

interface ActivityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (activity: { desc: string; status: 'COMPLETED' | 'IN_PROGRESS' }) => void;
    activity?: { id: string; desc: string; status: 'COMPLETED' | 'IN_PROGRESS' };
}

export const ActivityDialog: React.FC<ActivityDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    activity
}) => {
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState<'COMPLETED' | 'IN_PROGRESS'>('IN_PROGRESS');

    useEffect(() => {
        if (activity) {
            setDesc(activity.desc);
            setStatus(activity.status);
        } else {
            setDesc('');
            setStatus('IN_PROGRESS');
        }
    }, [activity, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!desc.trim()) {
            alert('Descrição é obrigatória!');
            return;
        }
        onSave({ desc: desc.trim(), status });
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
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[450px] flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
                        <h2 className="text-2xl font-black text-slate-900">
                            {activity ? 'Editar Atividade' : 'Nova Atividade'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form className="p-6 space-y-6 flex-1 overflow-y-auto">
                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                Descrição da Atividade
                            </label>
                            <textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Ex: Concretagem da laje, Instalação elétrica..."
                                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-none"
                                autoFocus
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                                Status
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStatus('IN_PROGRESS')}
                                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${status === 'IN_PROGRESS'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    Em Andamento
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatus('COMPLETED')}
                                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${status === 'COMPLETED'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    Concluído
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Footer - Actions */}
                    <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50 rounded-b-[2rem] shrink-0">
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
                            className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-200"
                        >
                            {activity ? 'Atualizar' : 'Adicionar'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
