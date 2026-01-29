import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BudgetFormData } from '../../../../domain/validation/budget-schema';
import { Card, CardContent } from '../../ui/card';
import { Calculator, Send, Printer, TrendingUp } from 'lucide-react';
import { Button } from '../../ui/button';
import { BudgetPrintPreview } from './BudgetPrintPreview';
import { ABCReportDialog } from '../database/ABCReportDialog';
import { Budget } from '../../../../domain/models/budget';

export const BudgetSummary: React.FC = () => {
    const { watch } = useFormContext<BudgetFormData>();
    const items = watch('items') || [];
    const formData = watch();
    const [showPreview, setShowPreview] = useState(false);
    const [isABCReportOpen, setIsABCReportOpen] = useState(false);

    // Calculate totals automatically from form state
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const bdiRate = formData.bdi || 0;

    // BDI is applied on the Direct Cost (Subtotal)
    // Formula: Total = Subtotal * (1 + BDI%)
    const bdiAmount = subtotal * (bdiRate / 100);

    // If we keep Tax Rate per item, it might be confusing if BDI also covers taxes. 
    // For now, let's assume Item Tax is distinct (e.g. IPI) and BDI is overhead.
    const totalTaxItems = items.reduce((acc, item) => {
        return acc + ((item.quantity * item.unitPrice) * ((item.taxRate || 0) / 100));
    }, 0);

    const totalDiscount = items.reduce((acc, item) => {
        return acc + ((item.quantity * item.unitPrice) * (item.discount / 100));
    }, 0);

    // Final Total = (Subtotal + BDI) + ItemTaxes - Discounts
    const grandTotal = subtotal + bdiAmount + totalTaxItems - totalDiscount;

    return (
        <>
            <Card className="sticky top-6">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                        <Calculator className="w-5 h-5 mr-2 text-blue-600" /> Resumo Financeiro
                    </h3>

                    <div className="space-y-3 mb-6 border-b border-slate-100 pb-6">
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span>Custos Diretos (Subtotal)</span>
                            <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span>BDI ({bdiRate.toFixed(2)}%)</span>
                            <span className="text-blue-600 font-medium">+ {bdiAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        {totalTaxItems > 0 && (
                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Outros Impostos</span>
                                <span className="text-orange-600">+ {totalTaxItems.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span>Descontos</span>
                            <span className="text-red-500">- {totalDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-6">
                        <span className="text-lg font-bold text-slate-900">Total Geral</span>
                        <span className="text-2xl font-bold text-blue-600">
                            {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 rounded-xl font-bold" type="submit">
                            <Send className="w-4 h-4 mr-2" /> Salvar Orçamento
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full border-slate-200 hover:bg-slate-50 h-11 rounded-xl font-bold text-slate-600"
                            type="button"
                            onClick={() => setIsABCReportOpen(true)}
                        >
                            <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" /> Análise ABC (Pareto)
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full border-slate-200 hover:bg-slate-50 h-11 rounded-xl font-bold text-slate-600"
                            type="button"
                            onClick={() => setShowPreview(true)}
                        >
                            <Printer className="w-4 h-4 mr-2" /> Exportar / Imprimir
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ABCReportDialog
                open={isABCReportOpen}
                onOpenChange={setIsABCReportOpen}
                budget={{
                    id: (formData as any).id || 'TEMP',
                    clientName: formData.clientName || 'Cliente',
                    items: items.map(i => ({
                        itemId: i.productId,
                        quantity: i.quantity,
                        price: i.unitPrice,
                        type: (i as any).type || 'INPUT'
                    })),
                    total: grandTotal,
                    updatedAt: new Date().toISOString()
                } as any}
            />

            {showPreview && (
                <BudgetPrintPreview
                    data={formData as BudgetFormData}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
};
