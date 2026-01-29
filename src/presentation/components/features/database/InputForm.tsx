import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inputSchema, InputFormData } from '../../../../domain/validation/database-schema';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { X } from 'lucide-react';
import { Input as InputModel } from '../../../../domain/models/input';

interface InputFormProps {
    onSave: (data: InputFormData) => Promise<void>;
    onCancel: () => void;
    initialData?: InputModel | null;
}

export const InputForm: React.FC<InputFormProps> = ({ onSave, onCancel, initialData }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InputFormData>({
        resolver: zodResolver(inputSchema),
        defaultValues: (initialData ? {
            code: initialData.code,
            name: initialData.name,
            unit: initialData.unit,
            price: initialData.price,
            type: initialData.type,
            source: initialData.source
        } : {
            type: 'MATERIAL',
            source: 'OWN',
            price: 0
        }) as any // Cast to any to bypass strict coercion mismatch during init
    });

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[450px] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Editar Insumo' : 'Novo Insumo'}
                    </h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSave)} className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Código</label>
                            <Input placeholder="Cod." {...register('code')} className={errors.code ? "border-red-500" : ""} />
                            {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Tipo</label>
                            <select
                                {...register('type')}
                                className="w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="MATERIAL">Material</option>
                                <option value="LABOR">Mão de Obra</option>
                                <option value="EQUIPMENT">Equipamento</option>
                                <option value="SERVICE">Serviço</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Descrição</label>
                        <Input placeholder="Nome do insumo..." {...register('name')} className={errors.name ? "border-red-500" : ""} />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Unidade</label>
                            <Input placeholder="UN, M2, KG..." {...register('unit')} className={errors.unit ? "border-red-500" : ""} />
                            {errors.unit && <p className="text-xs text-red-500">{errors.unit.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Preço (R$)</label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                {...register('price')}
                                className={errors.price ? "border-red-500" : ""}
                            />
                            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Insumo'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
