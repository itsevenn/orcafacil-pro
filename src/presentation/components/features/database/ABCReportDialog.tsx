import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Budget } from '../../../../domain/models/budget';
import { useDatabaseStore } from '../../../stores/use-database-store';
import { BarChart3, TrendingUp, PieChart, Info, Download, ArrowRight, LayoutGrid } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../../lib/utils';

interface ABCReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    budget: Budget | null;
}

export const ABCReportDialog: React.FC<ABCReportDialogProps> = ({ open, onOpenChange, budget }) => {
    const { inputs, compositions } = useDatabaseStore();

    const abcData = useMemo(() => {
        if (!budget) return [];

        const inputTotals: Record<string, { id: string, name: string, type: string, total: number, quantity: number, unit: string }> = {};

        budget.items.forEach(item => {
            if (item.type === 'INPUT') {
                const input = inputs.find(i => i.id === item.itemId);
                if (!input) return;

                const current = inputTotals[item.itemId] || { id: item.itemId, name: input.name, type: input.type, total: 0, quantity: 0, unit: input.unit };
                current.quantity += item.quantity;
                current.total += item.price * item.quantity;
                inputTotals[item.itemId] = current;
            } else {
                // Composition - Expand items
                const comp = compositions.find(c => c.id === item.itemId);
                if (!comp) return;

                comp.items.forEach(cItem => {
                    const subInput = inputs.find(i => i.id === cItem.itemId);
                    if (!subInput) return;

                    const totalQty = item.quantity * cItem.quantity;
                    const current = inputTotals[cItem.itemId] || { id: cItem.itemId, name: subInput.name, type: subInput.type, total: 0, quantity: 0, unit: subInput.unit };
                    current.quantity += totalQty;
                    current.total += subInput.price * totalQty;
                    inputTotals[cItem.itemId] = current;
                });
            }
        });

        const sorted = Object.values(inputTotals).sort((a, b) => b.total - a.total);
        const totalValue = sorted.reduce((acc, curr) => acc + curr.total, 0);

        let cumulative = 0;
        return sorted.map(item => {
            cumulative += item.total;
            const percentage = (item.total / totalValue) * 100;
            const cumPercentage = (cumulative / totalValue) * 100;

            let category: 'A' | 'B' | 'C' = 'C';
            if (cumPercentage <= 80) category = 'A';
            else if (cumPercentage <= 95) category = 'B';

            return { ...item, percentage, cumPercentage, category };
        });
    }, [budget, inputs, compositions]);

    const summary = useMemo(() => {
        const stats = { A: 0, B: 0, C: 0, countA: 0, countB: 0, countC: 0 };
        abcData.forEach(item => {
            stats[item.category] += item.total;
            stats[`count${item.category}` as keyof typeof stats]++;
        });
        return stats;
    }, [abcData]);



    if (!budget) return null;

    return (
        <>
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/60 z-[100]"
                        onClick={() => onOpenChange(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                        <div
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[900px] h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto"
                            style={{ backgroundColor: 'white' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-slate-900 px-8 py-6 shrink-0">
                                <div className="flex justify-between items-center mr-8">
                                    <div>
                                        <h2 className="text-white text-2xl font-black flex items-center gap-3 italic">
                                            <TrendingUp className="w-8 h-8 text-emerald-400" />
                                            CURVA ABC DE INSUMOS
                                        </h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Análise de Pareto • Orçamento #{budget.id.substring(0, 8)}</p>
                                    </div>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black h-11 px-6 shadow-lg shadow-emerald-900/20">
                                        <Download className="w-4 h-4 mr-2" />
                                        Exportar Relatório
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-4 right-4 text-emerald-200 group-hover:text-emerald-300 transition-colors">
                                            <LayoutGrid className="w-12 h-12" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Classe A (80% do valor)</div>
                                            <div className="text-3xl font-black text-emerald-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.A)}</div>
                                            <div className="text-xs font-bold text-emerald-600/70 mt-2">{summary.countA} insumos principais</div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-4 right-4 text-blue-200 group-hover:text-blue-300 transition-colors">
                                            <BarChart3 className="w-12 h-12" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Classe B (15% do valor)</div>
                                            <div className="text-3xl font-black text-blue-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.B)}</div>
                                            <div className="text-xs font-bold text-blue-600/70 mt-2">{summary.countB} insumos intermediários</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-4 right-4 text-slate-200 group-hover:text-slate-300 transition-colors">
                                            <PieChart className="w-12 h-12" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Classe C (5% do valor)</div>
                                            <div className="text-3xl font-black text-slate-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.C)}</div>
                                            <div className="text-xs font-bold text-slate-600/70 mt-2">{summary.countC} itens de baixo impacto</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Info className="w-4 h-4" /> Detalhamento de Itens
                                        </h3>
                                        <div className="text-[10px] text-slate-400 font-bold italic">Total do Orçamento: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget.total)}</div>
                                    </div>

                                    <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-100/50">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <th className="px-6 py-4 text-center w-16">Classe</th>
                                                    <th className="px-6 py-4 text-left">Insumo</th>
                                                    <th className="px-6 py-4 text-center w-24">Unidade</th>
                                                    <th className="px-6 py-4 text-center w-24">Qtd.</th>
                                                    <th className="px-6 py-4 text-right w-32">Total</th>
                                                    <th className="px-6 py-4 text-right w-24">%</th>
                                                    <th className="px-6 py-4 text-right w-24">% Acum.</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {abcData.map((item, idx) => (
                                                    <tr key={`${item.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={cn(
                                                                "inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-xs",
                                                                item.category === 'A' ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                                                                    item.category === 'B' ? "bg-blue-100 text-blue-700 border border-blue-200" :
                                                                        "bg-slate-100 text-slate-500 border border-slate-200"
                                                            )}>
                                                                {item.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-slate-700 line-clamp-1">{item.name}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{item.type}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-bold text-slate-400 uppercase">{item.unit}</td>
                                                        <td className="px-6 py-4 text-center font-mono font-medium text-slate-600">{item.quantity.toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-right font-black text-slate-900">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-slate-400">{item.percentage.toFixed(2)}%</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="font-black text-slate-900">{item.cumPercentage.toFixed(2)}%</span>
                                                                <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-[#0070d2]" style={{ width: `${item.cumPercentage}%` }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Itens Estratégicos</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /> Gestão Tática</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400" /> itens Operacionais</div>
                                </div>
                                <Button onClick={() => onOpenChange(false)} className="bg-slate-900 text-white hover:bg-black rounded-xl px-12 font-black h-12 flex items-center gap-2">
                                    Fechar Relatório <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
