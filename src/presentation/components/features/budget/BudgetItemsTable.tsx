import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BudgetFormData } from '../../../../domain/validation/budget-schema';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { ItemSelector } from './ItemSelector';
import { CatalogItem } from '../../../../../types';

// Extend generic CatalogItem to ensure it maps correctly if needed, but our props are simpler
export const BudgetItemsTable: React.FC = () => {
    const { control, register, setValue, watch } = useFormContext<BudgetFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    // State for auto-filling stage
    const [currentStage, setCurrentStage] = React.useState('1.0 Preliminares');

    const handleAddItem = (item: CatalogItem) => {
        const taxRate = item.source === 'INTERNAL' ? 10 : 5;

        append({
            productId: item.id,
            name: item.name,
            quantity: 1,
            unitPrice: item.price,
            discount: 0,
            taxRate: taxRate,
            source: item.source,
            stage: currentStage // Auto-fill
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="w-full md:w-1/3">
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Etapa Atual (Auto-preencher)</label>
                    <Input
                        value={currentStage}
                        onChange={(e) => setCurrentStage(e.target.value)}
                        placeholder="Ex: 2.0 Estrutura"
                        className="bg-white"
                    />
                </div>
                <div className="w-full md:w-2/3">
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Adicionar Item</label>
                    <ItemSelector onSelectItem={handleAddItem} />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm min-h-[300px]">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th className="w-10 px-4 py-3 text-center">#</th>
                            <th className="w-24 px-4 py-3">Etapa</th>
                            <th className="px-4 py-3">Descrição</th>
                            <th className="w-24 px-4 py-3 text-center">Fonte</th>
                            <th className="w-20 px-4 py-3 text-center">Qtd</th>
                            <th className="w-28 px-4 py-3 text-right">Preço Un.</th>
                            <th className="w-20 px-4 py-3 text-center">Desc %</th>
                            <th className="w-28 px-4 py-3 text-right">Total</th>
                            <th className="w-10 px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {fields.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-16 text-slate-400">
                                    Nenhum item adicionado. Defina a etapa e adicione itens acima.
                                </td>
                            </tr>
                        ) : (
                            fields.map((field, index) => {
                                const qty = watch(`items.${index}.quantity`) || 0;
                                const price = watch(`items.${index}.unitPrice`) || 0;
                                const discount = watch(`items.${index}.discount`) || 0;
                                const total = (qty * price) * (1 - discount / 100);

                                return (
                                    <tr key={field.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-2 text-center text-slate-400 text-xs">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                className="border-transparent bg-transparent hover:bg-white focus:bg-white h-auto py-1 px-2 text-xs font-medium text-slate-600 w-full"
                                                {...register(`items.${index}.stage`)}
                                                placeholder="Etapa"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                className="border-transparent bg-transparent hover:bg-white focus:bg-white h-auto py-1 px-2 font-medium text-slate-700 w-full"
                                                {...register(`items.${index}.name`)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                                                {(field as any).source || 'INT'}
                                            </span>
                                            <input type="hidden" {...register(`items.${index}.source`)} />
                                            <input type="hidden" {...register(`items.${index}.productId`)} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number" step="0.01" min="0"
                                                className="text-center h-8"
                                                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number" step="0.01" min="0"
                                                className="text-right h-8"
                                                {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number" step="0.1" min="0" max="100"
                                                className="text-center h-8"
                                                {...register(`items.${index}.discount`, { valueAsNumber: true })}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-right font-bold text-slate-700">
                                            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-red-500"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
