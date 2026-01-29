import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input as UIInput } from '../../ui/input';
import { Search, Plus, Trash2, Calculator, Hammer, ShoppingCart, Construction, ArrowRight, Briefcase } from 'lucide-react';
import { useDatabaseStore } from '../../../stores/use-database-store';
import { Composition, CompositionItem } from '../../../../domain/models/composition';
import { Input } from '../../../../domain/models/input';
import { cn } from '../../../../lib/utils';

interface CompositionEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    composition?: Composition | null;
    onSave: (comp: any) => void;
}

export const CompositionEditor: React.FC<CompositionEditorProps> = ({ open, onOpenChange, composition, onSave }) => {
    const { inputs, fetchInputs } = useDatabaseStore();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [unit, setUnit] = useState('UN');
    const [items, setItems] = useState<Partial<CompositionItem>[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [socialCharges, setSocialCharges] = useState(0);
    const [bdi, setBdi] = useState(0);

    useEffect(() => {
        if (open) fetchInputs();
    }, [open, fetchInputs]);

    useEffect(() => {
        if (composition) {
            setName(composition.name);
            setCode(composition.code);
            setUnit(composition.unit);
            setItems(composition.items);
            setSocialCharges(composition.socialCharges || 0);
            setBdi(composition.bdi || 0);
        } else {
            setName('');
            setCode('');
            setUnit('UN');
            setItems([]);
            setSocialCharges(0);
            setBdi(0);
        }
    }, [composition, open]);

    const filteredInputs = useMemo(() => {
        return inputs.filter(i =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inputs, searchTerm]);

    const addItem = (input: Input) => {
        if (items.find(item => item.itemId === input.id)) return;
        setItems([...items, {
            itemId: input.id,
            name: input.name,
            unit: input.unit,
            type: 'INPUT',
            price: input.price,
            quantity: 1
        }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.itemId !== id));
    };

    const updateQuantity = (id: string, qty: number) => {
        setItems(items.map(item => item.itemId === id ? { ...item, quantity: qty } : item));
    };

    const totals = useMemo(() => {
        let mat = 0; let lab = 0; let eqp = 0;
        items.forEach(item => {
            const input = inputs.find(i => i.id === item.itemId);
            const cost = (item.price || 0) * (item.quantity || 0);
            if (input?.type === 'LABOR') lab += cost;
            else if (input?.type === 'EQUIPMENT') eqp += cost;
            else mat += cost;
        });

        // Apply Social Charges to Labor
        const laborWithCharges = lab * (1 + (socialCharges / 100));
        const direct = mat + laborWithCharges + eqp;
        const totalWithBDI = direct * (1 + (bdi / 100));

        return { mat, lab, eqp, laborWithCharges, direct, totalWithBDI };
    }, [items, inputs, socialCharges, bdi]);

    const handleSave = () => {
        onSave({
            id: composition?.id,
            name,
            code,
            unit,
            socialCharges,
            bdi,
            items: items.map(i => ({ itemId: i.itemId, quantity: i.quantity, type: 'INPUT' }))
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col bg-white p-0 gap-0 overflow-hidden" style={{ backgroundColor: 'white' }}>
                <div className="bg-slate-900 px-8 py-6">
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl font-black flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-blue-400" />
                            {composition ? 'Editar Composição' : 'Nova Composição de Preço'}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Catalog Sidebar */}
                    <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                        <div className="p-4 border-b border-slate-100 bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <UIInput
                                    placeholder="Buscar insumos..."
                                    className="pl-9 h-10 bg-slate-50 border-slate-200 rounded-xl text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredInputs.map(input => (
                                <button
                                    key={input.id}
                                    onClick={() => addItem(input)}
                                    className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-slate-100"
                                >
                                    <div className="text-[10px] font-black text-[#0070d2] mb-0.5">{input.code}</div>
                                    <div className="text-sm font-bold text-slate-700 line-clamp-2 leading-tight group-hover:text-blue-600">
                                        {input.name}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{input.unit}</span>
                                        <span className="text-sm font-black text-slate-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(input.price)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Editor Main Area */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Código</label>
                                    <UIInput value={code} onChange={e => setCode(e.target.value)} className="h-12 font-mono font-bold text-blue-600 rounded-xl" placeholder="87.301" />
                                </div>
                                <div className="col-span-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Descrição da Composição</label>
                                    <UIInput value={name} onChange={e => setName(e.target.value)} className="h-12 font-bold text-slate-900 rounded-xl" placeholder="Ex: Argamassa traço 1:1:6..." />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Unidade</label>
                                    <UIInput value={unit} onChange={e => setUnit(e.target.value)} className="h-12 font-black text-slate-900 rounded-xl text-center" placeholder="M3" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Insumos e Coeficientes</h3>
                                    <div className="text-[10px] text-slate-400 font-bold">{items.length} itens adicionados</div>
                                </div>

                                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50/50 border-b border-slate-100">
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                                <th className="px-6 py-4 text-left">Insumo</th>
                                                <th className="px-6 py-4 text-center w-24">Unid.</th>
                                                <th className="px-6 py-4 text-center w-32">Coeficiente</th>
                                                <th className="px-6 py-4 text-right w-32">Preço</th>
                                                <th className="px-6 py-4 text-right w-32">Total</th>
                                                <th className="px-6 py-4 text-center w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {items.map(item => (
                                                <tr key={item.itemId} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-700">{item.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-black text-slate-400">{item.unit}</td>
                                                    <td className="px-6 py-4">
                                                        <UIInput
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={e => updateQuantity(item.itemId!, parseFloat(e.target.value))}
                                                            className="h-9 font-mono text-center font-bold bg-slate-50 border-slate-100 rounded-lg"
                                                            step="0.0001"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-medium text-slate-500">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price || 0)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-black text-slate-900">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.price || 0) * (item.quantity || 0))}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button onClick={() => removeItem(item.itemId!)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {items.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                                                                <Plus className="w-6 h-6 text-slate-300" />
                                                            </div>
                                                            <div className="text-slate-400 font-medium">Selecione insumos na barra lateral para começar</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Summary Footer Bar */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-6 gap-6">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ShoppingCart className="w-3 h-3" /> Materiais
                                </div>
                                <div className="text-lg font-bold text-slate-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.mat)}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Hammer className="w-3 h-3" /> Mão de Obra
                                </div>
                                <div className="text-sm font-bold text-slate-500 line-through decoration-slate-300">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.lab)}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <UIInput
                                        type="number"
                                        value={socialCharges}
                                        onChange={e => setSocialCharges(parseFloat(e.target.value))}
                                        className="h-7 w-16 text-[10px] font-black p-1 text-center bg-white border-blue-100 text-blue-600 rounded-md"
                                    />
                                    <span className="text-[10px] font-black text-blue-400">% Encargos</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Construction className="w-3 h-3" /> Equipamentos
                                </div>
                                <div className="text-lg font-bold text-slate-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.eqp)}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-emerald-600">
                                    <Plus className="w-3 h-3" /> BDI
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <UIInput
                                        type="number"
                                        value={bdi}
                                        onChange={e => setBdi(parseFloat(e.target.value))}
                                        className="h-10 w-20 text-sm font-black p-2 text-center bg-white border-emerald-100 text-emerald-600 rounded-xl shadow-sm"
                                    />
                                    <span className="text-[10px] font-black text-emerald-400">% BDI</span>
                                </div>
                            </div>
                            <div className="col-span-2 bg-slate-900 p-6 rounded-3xl shadow-2xl shadow-slate-200 flex items-center justify-between relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Preço Final (com BDI)</div>
                                    <div className="text-3xl font-black text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.totalWithBDI)}</div>
                                    <div className="text-[10px] font-bold text-emerald-400 mt-1">Custo Direto: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.direct)}</div>
                                </div>
                                <Calculator className="w-10 h-10 text-slate-700 relative z-10" />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-white border-t border-slate-100">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-slate-500">Cancelar</Button>
                    <Button onClick={handleSave} className="bg-slate-900 text-white hover:bg-black rounded-xl px-8 font-black flex items-center gap-2">
                        Salvar Composição <ArrowRight className="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
