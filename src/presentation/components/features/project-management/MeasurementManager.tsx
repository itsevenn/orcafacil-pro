import React, { useState } from 'react';
import { Budget, Measurement, MeasurementItem } from '../../../../domain/models/budget';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Plus, Save, ArrowLeft, Printer, FileText } from 'lucide-react';
import { useBudgetStore } from '../../../stores/use-budget-store';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../../../../lib/utils';
import { format } from 'date-fns';

interface MeasurementManagerProps {
    budget: Budget;
}

export const MeasurementManager: React.FC<MeasurementManagerProps> = ({ budget }) => {
    const { updateBudget } = useBudgetStore();
    const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
    const [currentMeasurement, setCurrentMeasurement] = useState<Measurement | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // List of existing measurements (sorted date desc)
    const measurements = (budget.measurements || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleNewMeasurement = () => {
        // Initialize new measurement with 0 quantity for all items
        const newMeasurement: Measurement = {
            id: uuidv4(),
            name: `${(measurements.length + 1)}ª Medição`,
            date: new Date(),
            items: budget.items.map(item => ({ itemId: item.id, quantity: 0 })),
            notes: ''
        };
        setCurrentMeasurement(newMeasurement);
        setViewMode('edit');
    };

    const handleEditMeasurement = (m: Measurement) => {
        // Ensure all items are present (in case budget changed)
        const updatedItems = budget.items.map(item => {
            const existing = m.items.find(mi => mi.itemId === item.id);
            return existing || { itemId: item.id, quantity: 0 };
        });
        setCurrentMeasurement({ ...m, items: updatedItems });
        setViewMode('edit');
    };

    const handleSave = async () => {
        if (!currentMeasurement) return;
        setIsSaving(true);
        try {
            const otherMeasurements = (budget.measurements || []).filter(m => m.id !== currentMeasurement.id);
            const updatedMeasurements = [...otherMeasurements, currentMeasurement];

            await updateBudget(budget.id, {
                ...budget,
                measurements: updatedMeasurements
            });
            setViewMode('list');
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar medição.");
        } finally {
            setIsSaving(false);
        }
    };

    const updateItemQuantity = (itemId: string, quantity: number) => {
        if (!currentMeasurement) return;
        setCurrentMeasurement(prev => ({
            ...prev!,
            items: prev!.items.map(i => i.itemId === itemId ? { ...i, quantity } : i)
        }));
    };

    // Calculate accumulation up to this measurement (excluding current if editing existing, actually accumulation should include all previous)
    // For simplicity, let's just calculate "Previous Accumulated" dynamically relative to the current one being edited.

    const getPreviousAccumulated = (itemId: string) => {
        if (!currentMeasurement) return 0;
        // Sum of all measurements before the current one's date (or id check if just created)
        // If it's a new one, all existing are previous.
        // If editing, filter out self.
        // But what if dates change? Let's rely on ID filtering for "others" and assuming chronological order isn't strictly enforced by ID.
        // Ideally we sum everything EXCEPT the current one. BUT, if we have multiple, we usually want "Previous" to mean "Before this one".
        // Let's assume for now "Previous" = All saved measurements excluding current ID.

        return (budget.measurements || [])
            .filter(m => m.id !== currentMeasurement.id)
            .reduce((acc, m) => {
                const item = m.items.find(i => i.itemId === itemId);
                return acc + (item ? item.quantity : 0);
            }, 0);
    };

    if (viewMode === 'list') {
        return (
            <Card className="h-full border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-800">Boletins de Medição</CardTitle>
                        <p className="text-slate-500">Histórico de medições para {budget.client?.name}</p>
                    </div>
                    <Button onClick={handleNewMeasurement} className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Nova Medição
                    </Button>
                </CardHeader>
                <CardContent className="px-0">
                    {/* Summary Progress Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Progresso Físico Total</h4>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-black text-slate-900 leading-none">
                                    {(() => {
                                        const totalContract = budget.items.reduce((acc, i) => acc + i.quantity, 0);
                                        const totalMeasured = (budget.measurements || []).reduce((acc, m) =>
                                            acc + m.items.reduce((iAcc, i) => iAcc + i.quantity, 0), 0);
                                        return totalContract > 0 ? ((totalMeasured / totalContract) * 100).toFixed(1) : '0.0';
                                    })()}%
                                </span>
                                <span className="text-emerald-600 font-bold text-sm mb-1 pb-1">concluído</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{
                                        width: `${(() => {
                                            const totalContract = budget.items.reduce((acc, i) => acc + i.quantity, 0);
                                            const totalMeasured = (budget.measurements || []).reduce((acc, m) =>
                                                acc + m.items.reduce((iAcc, i) => iAcc + i.quantity, 0), 0);
                                            return Math.min(100, totalContract > 0 ? (totalMeasured / totalContract) * 100 : 0);
                                        })()}%`
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Execução Financeira</h4>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-black text-blue-600 leading-none">
                                    {(() => {
                                        const totalContract = budget.total || 1;
                                        const totalValMeasured = (budget.measurements || []).reduce((acc, m) =>
                                            acc + m.items.reduce((iAcc, item) => {
                                                const budgetItem = budget.items.find(bi => bi.id === item.itemId);
                                                return iAcc + ((budgetItem?.unitPrice || 0) * item.quantity);
                                            }, 0), 0);
                                        return ((totalValMeasured / totalContract) * 100).toFixed(1);
                                    })()}%
                                </span>
                                <span className="text-slate-400 font-bold text-sm mb-1 pb-1">faturado</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{
                                        width: `${(() => {
                                            const totalContract = budget.total || 1;
                                            const totalValMeasured = (budget.measurements || []).reduce((acc, m) =>
                                                acc + m.items.reduce((iAcc, item) => {
                                                    const budgetItem = budget.items.find(bi => bi.id === item.itemId);
                                                    return iAcc + ((budgetItem?.unitPrice || 0) * item.quantity);
                                                }, 0), 0);
                                            return Math.min(100, (totalValMeasured / totalContract) * 100);
                                        })()}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {measurements.map(m => (
                            <div key={m.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEditMeasurement(m)}>
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-full text-green-700 font-bold">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700">{m.name}</h3>
                                        <p className="text-sm text-slate-500">{format(new Date(m.date), 'dd/MM/yyyy')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-slate-900">
                                        {/* Calculate total value of measurement */}
                                        {m.items.reduce((acc, item) => {
                                            const budgetItem = budget.items.find(bi => bi.id === item.itemId);
                                            return acc + ((budgetItem?.unitPrice || 0) * item.quantity);
                                        }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {measurements.length === 0 && (
                            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                <p>Nenhuma medição registrada.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Edit Mode
    const totalMeasured = currentMeasurement?.items.reduce((acc, item) => {
        const budgetItem = budget.items.find(bi => bi.id === item.itemId);
        return acc + ((budgetItem?.unitPrice || 0) * item.quantity);
    }, 0) || 0;

    return (
        <Card className="h-full flex flex-col shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-800">
                            {currentMeasurement?.name}
                        </CardTitle>
                        <p className="text-sm text-slate-500">
                            Total Medido: <span className="font-bold text-green-600">{totalMeasured.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Input
                        type="date"
                        value={currentMeasurement?.date ? new Date(currentMeasurement.date).toISOString().split('T')[0] : ''}
                        onChange={(e) => setCurrentMeasurement(prev => ({ ...prev!, date: new Date(e.target.value) }))}
                        className="w-40"
                    />
                    <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white">
                        <Save className="w-4 h-4 mr-2" /> Salvar Boletim
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="text-left p-3 font-semibold text-slate-600 border-b w-[30%]">Item</th>
                            <th className="text-center p-3 font-semibold text-slate-600 border-b w-[10%]">Unid.</th>
                            <th className="text-right p-3 font-semibold text-slate-600 border-b w-[10%]">Preço Unit.</th>
                            <th className="text-right p-3 font-semibold text-slate-600 border-b w-[10%]">Qtd. Contrato</th>
                            <th className="text-right p-3 font-semibold text-slate-600 border-b w-[10%]">Acum. Anterior</th>
                            <th className="text-center p-3 font-semibold text-blue-700 border-b w-[15%] bg-blue-50">Qtd. Atual</th>
                            <th className="text-right p-3 font-semibold text-green-700 border-b w-[15%]">Valor Atual</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {budget.items.map(item => {
                            const measuredItem = currentMeasurement?.items.find(i => i.itemId === item.id);
                            const currentQty = measuredItem?.quantity || 0;
                            const prevQty = getPreviousAccumulated(item.id);
                            const unitPrice = item.unitPrice;
                            const totalQty = item.quantity;
                            const balance = totalQty - prevQty - currentQty;
                            const currentValue = currentQty * unitPrice;

                            return (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-700 truncate max-w-[300px]" title={item.name}>
                                        {item.name}
                                    </td>
                                    <td className="p-3 text-center text-slate-500 uppercase text-[10px] font-bold">{item.unit || 'un'}</td>
                                    <td className="p-3 text-right text-slate-600">
                                        {unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="p-3 text-right font-bold text-slate-700">{totalQty}</td>
                                    <td className="p-3 text-right text-slate-500">{prevQty}</td>
                                    <td className="p-2 text-center bg-blue-50/50">
                                        <Input
                                            type="number"
                                            className={cn(
                                                "w-full text-center font-bold",
                                                currentQty > 0 ? "border-blue-400 text-blue-700 bg-white" : "text-slate-400 bg-transparent"
                                            )}
                                            value={currentQty || ''}
                                            onChange={(e) => updateItemQuantity(item.id, parseFloat(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                        {balance < 0 && <span className="text-[10px] text-red-500 font-bold block mt-1">Excedido!</span>}
                                    </td>
                                    <td className="p-3 text-right font-bold text-green-700 bg-green-50/30">
                                        {currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};
