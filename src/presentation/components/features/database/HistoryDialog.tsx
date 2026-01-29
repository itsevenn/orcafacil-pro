import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'; // REMOVED
import { Input } from '../../../../domain/models/input';
import { History, Clock, User, ChevronRight, Activity } from 'lucide-react';

interface HistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: Input | null;
}

export const HistoryDialog: React.FC<HistoryDialogProps> = ({ open, onOpenChange, item }) => {


    // Simulate audit log based on item data
    const auditLog = [
        {
            id: '1',
            action: 'CREATE',
            user: 'Sistema (Importação)',
            date: new Date(item.updatedAt.getTime() - 86400000 * 2), // 2 days ago
            details: 'Item criado na base de dados.'
        },
        {
            id: '2',
            action: 'UPDATE',
            user: 'Everton Silva',
            date: item.updatedAt,
            details: 'Atualização de preço unitário e categoria.'
        }
    ];

    if (!item) return null;

    return (

        <>
            {open && (
                <>
                    <div className="fixed inset-0 bg-slate-900/60 z-[100]" onClick={() => onOpenChange(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                        <div
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[450px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto"
                            style={{ backgroundColor: 'white' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-slate-900 p-6 shrink-0">
                                <div className="flex items-center gap-2 text-xl font-black text-white">
                                    <History className="w-5 h-5 text-blue-400" />
                                    Histórico de Auditoria
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white font-mono text-xs font-bold">
                                        {item.code}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm truncate max-w-[300px]">{item.name}</div>
                                        <div className="text-slate-400 text-xs uppercase font-black tracking-widest">{item.source} • {item.unit}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 relative bg-white">
                                <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-slate-100" />

                                <div className="space-y-8 relative">
                                    {auditLog.reverse().map((entry) => (
                                        <div key={entry.id} className="flex gap-4">
                                            <div className="z-10 w-4 h-4 rounded-full bg-white border-4 border-slate-900 mt-1 shadow-sm" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black uppercase text-slate-900">{entry.action === 'CREATE' ? 'Criação' : 'Alteração'}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold">•</span>
                                                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                                                            <User className="w-3 h-3" /> {entry.user}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    {entry.details}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    Fechar Visualização <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
