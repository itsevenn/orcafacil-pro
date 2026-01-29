import React, { useEffect } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, BudgetFormData } from '../../../../domain/validation/budget-schema';
import { BudgetHeader } from './BudgetHeader';
import { BudgetItemsTable } from './BudgetItemsTable';
import { BudgetSummary } from './BudgetSummary';
import { BudgetStatus } from '../../../../domain/models/budget';
import { cn } from '../../../../lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSettingsStore } from '../../../stores/use-settings-store';

interface BudgetFormProps {
    initialData?: Partial<BudgetFormData>;
    onSave: (data: BudgetFormData) => Promise<void>;
    onCancel: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ initialData, onSave, onCancel }) => {
    const { company } = useSettingsStore(); // Get settings

    // Use implicit typing or looser casting to avoid Zod/RHF mismatch on optional/default fields
    const methods = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            clientId: initialData?.clientId || '',
            clientName: initialData?.clientName || '',
            date: initialData?.date || new Date().toISOString().split('T')[0],
            expiryDate: initialData?.expiryDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: initialData?.status || BudgetStatus.DRAFT,
            notes: initialData?.notes || company.termsAndConditions || '', // Use default terms if no initial data
            items: initialData?.items || []
        } as any // Cast to any to bypass strict partial vs required mismatch on init (Zod handles validation)
    });

    const onSubmit: SubmitHandler<BudgetFormData> = async (data) => {
        await onSave(data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-full bg-[#f4f6f8] animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Top Bar / Navigation */}
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-blue-600 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                {initialData?.clientName ? `Orçamento - ${initialData.clientName}` : 'Novo Orçamento'}
                            </h1>
                            <p className="text-xs text-slate-500">Preencha os dados abaixo</p>
                        </div>
                    </div>
                    {/* Additional top actions could go here */}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <div className="lg:col-span-2 space-y-6">
                            <BudgetHeader />
                            <BudgetItemsTable />

                            {/* Notes Field */}
                            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Observações / Termos</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-blue-600 outline-none"
                                    placeholder="Insira detalhes de entrega, garantia ou observações gerais..."
                                    {...methods.register('notes')}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <BudgetSummary />
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
