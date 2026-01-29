import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input as UIInput } from '../../ui/input';
import { Input, InputType } from '../../../../domain/models/input';
import { Tag, Package, Truck, User, DollarSign, MapPin } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface InputEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    input?: Input | null;
    onSave: (input: Input) => void;
}

export const InputEditor: React.FC<InputEditorProps> = ({
    open,
    onOpenChange,
    input,
    onSave
}) => {
    const [formData, setFormData] = useState<Partial<Input>>({
        name: '',
        code: '',
        unit: '',
        price: 0,
        type: 'MATERIAL',
        category: '',
        source: 'OWN'
    });

    useEffect(() => {
        if (input) {
            setFormData(input);
        } else {
            setFormData({
                name: '',
                code: '',
                unit: '',
                price: 0,
                type: 'MATERIAL',
                category: '',
                source: 'OWN'
            });
        }
    }, [input, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: input?.id || Math.random().toString(36).substr(2, 9),
            updatedAt: new Date()
        } as Input);
        onOpenChange(false);
    };

    const typeOptions: { value: InputType; label: string; icon: any; color: string }[] = [
        { value: 'MATERIAL', label: 'Material', icon: Package, color: 'text-blue-600' },
        { value: 'LABOR', label: 'Mão de Obra', icon: User, color: 'text-orange-600' },
        { value: 'EQUIPMENT', label: 'Equipamento', icon: Truck, color: 'text-emerald-600' },
        { value: 'SERVICE', label: 'Serviço', icon: Tag, color: 'text-purple-600' }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white" style={{ backgroundColor: 'white' }}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        {input ? 'Editar Insumo' : 'Novo Insumo Próprio'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Código / Referência</label>
                            <UIInput
                                value={formData.code}
                                onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                placeholder="Ex: MAT-001"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Unidade</label>
                            <UIInput
                                value={formData.unit}
                                onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                placeholder="Ex: M2, KG, UN"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nome / Descrição do Insumo</label>
                        <UIInput
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Descreva o insumo detalhadamente..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Preço Unitário (R$)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <UIInput
                                    type="number"
                                    step="0.01"
                                    className="pl-9"
                                    value={formData.price}
                                    onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                            <UIInput
                                value={formData.category}
                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="Ex: Cimentos, Ferramentas"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase block">Tipo de Insumo</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {typeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: opt.value }))}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2",
                                        formData.type === opt.value
                                            ? "border-blue-500 bg-blue-50/50 shadow-sm"
                                            : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                                    )}
                                >
                                    <opt.icon className={cn("w-5 h-5", formData.type === opt.value ? "text-blue-600" : "text-slate-400")} />
                                    <span className={cn("text-[10px] font-bold uppercase", formData.type === opt.value ? "text-blue-700" : "text-slate-500 text-center")}>
                                        {opt.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Região / UF (Opcional)
                        </label>
                        <UIInput
                            value={formData.region}
                            onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
                            placeholder="Ex: SP, Nacional"
                        />
                    </div>
                </form>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-slate-900 text-white hover:bg-slate-800 px-8 font-black shadow-lg shadow-slate-200"
                    >
                        Salvar Insumo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
