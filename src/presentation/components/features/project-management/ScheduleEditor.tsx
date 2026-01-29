import React, { useState, useMemo } from 'react';
import { Budget, SchedulePeriod, ScheduleAllocation } from '../../../../domain/models/budget';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Plus, Save, Trash2, AlertCircle, History } from 'lucide-react';
import { useBudgetStore } from '../../../stores/use-budget-store';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../../../../lib/utils';

interface ScheduleEditorProps {
    budget: Budget;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ budget }) => {
    const { updateBudget } = useBudgetStore();
    const [periods, setPeriods] = useState<SchedulePeriod[]>(
        budget.schedulePeriods?.length ? budget.schedulePeriods : [
            { id: uuidv4(), name: 'Mês 1', date: new Date() }
        ]
    );
    const [allocations, setAllocations] = useState<ScheduleAllocation[]>(budget.scheduleAllocations || []);
    const [baseline, setBaseline] = useState<ScheduleAllocation[]>(budget.baselineAllocations || []);
    const [showBaseline, setShowBaseline] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Group items by stage and calculate totals
    const stages = useMemo(() => {
        const groups: Record<string, number> = {};
        budget.items.forEach(item => {
            const stage = item.stage || 'Sem Etapa';
            const itemTotal = item.unitPrice * item.quantity;
            groups[stage] = (groups[stage] || 0) + itemTotal;
        });
        return Object.keys(groups).sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        }).map(key => ({
            name: key,
            value: groups[key]
        }));
    }, [budget.items]);

    const handleAddPeriod = () => {
        setPeriods(prev => [
            ...prev,
            { id: uuidv4(), name: `Mês ${prev.length + 1}`, date: new Date() }
        ]);
    };

    const handleRemovePeriod = (id: string) => {
        setPeriods(prev => prev.filter(p => p.id !== id));
        setAllocations(prev => prev.filter(a => a.periodId !== id));
        setBaseline(prev => prev.filter(a => a.periodId !== id));
    };

    const handleAllocationChange = (stageName: string, periodId: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) && value !== '') return;

        setAllocations(prev => {
            const content = prev.filter(a => !(a.stage === stageName && a.periodId === periodId));
            if (!value || numValue === 0) return content;
            return [...content, { stage: stageName, periodId, percentage: numValue }];
        });
    };

    const getAllocation = (stageName: string, periodId: string) => {
        return allocations.find(a => a.stage === stageName && a.periodId === periodId)?.percentage || 0;
    };

    const getBaselineAllocation = (stageName: string, periodId: string) => {
        return baseline.find(a => a.stage === stageName && a.periodId === periodId)?.percentage || 0;
    };

    const saveSchedule = async () => {
        setIsSaving(true);
        try {
            await updateBudget(budget.id, {
                ...budget,
                schedulePeriods: periods,
                scheduleAllocations: allocations,
                baselineAllocations: baseline
            });
            alert('Cronograma salvo com sucesso!');
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar cronograma.');
        } finally {
            setIsSaving(false);
        }
    };

    const saveBaseline = () => {
        if (confirm('Deseja salvar o cronograma atual como Linha de Base? Isso apagará a linha de base anterior.')) {
            setBaseline([...allocations]);
            alert('Linha de Base definida. Salve o cronograma para persistir.');
        }
    };

    // Calculate totals per period
    const periodTotals = periods.map(period => {
        let total = 0;
        stages.forEach(stage => {
            const pct = getAllocation(stage.name, period.id);
            total += stage.value * (pct / 100);
        });
        return total;
    });

    const budgetTotal = stages.reduce((acc, s) => acc + s.value, 0);

    return (
        <Card className="h-full flex flex-col shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold text-slate-800">Cronograma Físico-Financeiro</CardTitle>
                        {baseline.length > 0 && (
                            <button
                                onClick={() => setShowBaseline(!showBaseline)}
                                className={cn(
                                    "text-[10px] font-black px-2 py-0.5 rounded transition-colors",
                                    showBaseline ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
                                )}
                            >
                                LINHA DE BASE: {showBaseline ? 'ON' : 'OFF'}
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Obra: <span className="font-medium text-slate-700">{budget.client?.name}</span> |
                        Total: <span className="font-medium text-blue-600">{budgetTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={saveBaseline} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                        <History className="w-4 h-4 mr-2" /> Fixar Linha de Base
                    </Button>
                    <Button variant="outline" onClick={handleAddPeriod} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        <Plus className="w-4 h-4 mr-2" /> Adicionar Período
                    </Button>
                    <Button onClick={saveSchedule} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white">
                        <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Salvando...' : 'Salvar Cronograma'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                <div className="min-w-[800px]">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="text-left p-4 font-semibold text-slate-600 border-b border-slate-200 min-w-[200px]">Etapa</th>
                                <th className="text-right p-4 font-semibold text-slate-600 border-b border-slate-200 min-w-[120px]">Valor da Etapa</th>
                                {periods.map((period, idx) => (
                                    <th key={period.id} className="text-center p-3 border-b border-slate-200 min-w-[100px] group relative">
                                        <div className="flex flex-col items-center">
                                            <input
                                                className="bg-transparent text-center font-bold text-slate-700 w-full mb-1 focus:outline-none focus:bg-white rounded"
                                                value={period.name}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setPeriods(ps => ps.map(p => p.id === period.id ? { ...p, name: val } : p));
                                                }}
                                            />
                                            {/* Delete button only visible on hover if > 1 period */}
                                            {periods.length > 1 && (
                                                <button
                                                    onClick={() => handleRemovePeriod(period.id)}
                                                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                <th className="text-center p-4 font-semibold text-slate-600 border-b border-slate-200 w-24">Total %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stages.map((stage) => {
                                const stageAllocations = allocations.filter(a => a.stage === stage.name);
                                const totalPct = stageAllocations.reduce((acc, a) => acc + a.percentage, 0);
                                const isValid = Math.abs(totalPct - 100) < 0.1;

                                return (
                                    <tr key={stage.name} className="hover:bg-slate-50/50">
                                        <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            {stage.name}
                                        </td>
                                        <td className="p-4 text-right text-slate-600">
                                            {stage.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        {periods.map(period => (
                                            <td key={period.id} className="p-2 text-center border-l border-slate-100">
                                                <div className="relative flex justify-center">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className={cn(
                                                            "w-16 h-8 text-center px-1 text-xs z-10 relative bg-white",
                                                            getAllocation(stage.name, period.id) > 0 ? "border-blue-300 text-blue-700 font-bold" : "text-slate-400"
                                                        )}
                                                        value={getAllocation(stage.name, period.id) || ''}
                                                        onChange={(e) => handleAllocationChange(stage.name, period.id, e.target.value)}
                                                        placeholder="0"
                                                    />
                                                    {showBaseline && getBaselineAllocation(stage.name, period.id) > 0 && (
                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-200 rounded-full" title={`Baseline: ${getBaselineAllocation(stage.name, period.id)}%`} />
                                                    )}
                                                    <span className="absolute right-3 top-2 text-[10px] text-slate-400 pointer-events-none z-20">%</span>
                                                </div>
                                            </td>
                                        ))}
                                        <td className="p-4 text-center">
                                            <div className={cn(
                                                "flex items-center justify-center gap-1 font-bold text-sm px-2 py-1 rounded",
                                                totalPct === 0 ? "text-slate-300" :
                                                    isValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                            )}>
                                                {totalPct.toFixed(0)}%
                                                {!isValid && totalPct > 0 && <AlertCircle className="w-3 h-3" />}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold text-slate-800">
                            <tr>
                                <td className="p-4 text-right uppercase text-xs tracking-wider">Total Mensal</td>
                                <td className="p-4 text-right border-t border-slate-300">
                                    {budgetTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                {periodTotals.map((total, idx) => (
                                    <td key={idx} className="p-4 text-center border-t border-slate-300 text-blue-700 text-sm">
                                        {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                ))}
                                <td className="p-4 border-t border-slate-300"></td>
                            </tr>
                            <tr>
                                <td className="p-2 text-right uppercase text-[10px] text-slate-500">Acumulado %</td>
                                <td className="p-2"></td>
                                {periodTotals.reduce((acc: number[], curr, i) => {
                                    const prev = i > 0 ? acc[i - 1] : 0;
                                    acc.push(prev + (budgetTotal > 0 ? (curr / budgetTotal) * 100 : 0));
                                    return acc;
                                }, []).map((accPct, idx) => (
                                    <td key={idx} className="p-2 text-center text-xs text-slate-500">
                                        {accPct.toFixed(1)}%
                                    </td>
                                ))}
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </CardContent>
        </Card >
    );
};
