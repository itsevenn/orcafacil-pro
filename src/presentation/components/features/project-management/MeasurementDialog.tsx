import React, { useState, useEffect } from 'react';
import { Measurement, MeasurementItem } from '../../../../domain/models/measurement';
import { Button } from '../../ui/button';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MeasurementDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>) => void;
    measurement?: Measurement;
}

export const MeasurementDialog: React.FC<MeasurementDialogProps> = ({ isOpen, onClose, onSave, measurement }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const [formData, setFormData] = useState({
        projectName: measurement?.projectName || '',
        clientName: measurement?.clientName || '',
        measurementNumber: measurement?.measurementNumber || 1,
        referenceDate: measurement?.referenceDate ? new Date(measurement.referenceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: measurement?.status || 'DRAFT' as const,
        retentionPercentage: measurement?.retentionPercentage || 5,
        notes: measurement?.notes || ''
    });

    const [items, setItems] = useState<MeasurementItem[]>(measurement?.items || []);
    const [newItem, setNewItem] = useState({
        serviceCode: '',
        serviceName: '',
        unit: 'M2',
        currentQuantity: 0,
        unitPrice: 0
    });

    if (!isOpen) return null;

    const handleAddItem = () => {
        if (!newItem.serviceCode.trim() || !newItem.serviceName.trim()) return;

        const item: MeasurementItem = {
            id: uuidv4(),
            serviceCode: newItem.serviceCode,
            serviceName: newItem.serviceName,
            unit: newItem.unit,
            previousQuantity: 0,
            currentQuantity: newItem.currentQuantity,
            unitPrice: newItem.unitPrice,
            totalValue: newItem.currentQuantity * newItem.unitPrice
        };

        setItems([...items, item]);
        setNewItem({
            serviceCode: '',
            serviceName: '',
            unit: 'M2',
            currentQuantity: 0,
            unitPrice: 0
        });
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleUpdateItemQuantity = (id: string, quantity: number) => {
        setItems(items.map(i =>
            i.id === id ? { ...i, currentQuantity: quantity, totalValue: quantity * i.unitPrice } : i
        ));
    };

    const handleUpdateItemPrice = (id: string, price: number) => {
        setItems(items.map(i =>
            i.id === id ? { ...i, unitPrice: price, totalValue: i.currentQuantity * price } : i
        ));
    };

    const subtotal = items.reduce((sum, item) => sum + item.totalValue, 0);
    const retentionAmount = (subtotal * formData.retentionPercentage) / 100;
    const netValue = subtotal - retentionAmount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSave({
            projectName: formData.projectName,
            clientName: formData.clientName,
            measurementNumber: formData.measurementNumber,
            referenceDate: new Date(formData.referenceDate),
            status: formData.status,
            items: items,
            subtotal: subtotal,
            retentionPercentage: formData.retentionPercentage,
            retentionAmount,
            netValue,
            notes: formData.notes
        });
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900/60 z-[100]"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[800px] max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {measurement ? 'Editar Medição' : 'Nova Medição'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Preencha os dados da medição de obra</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                        {/* Project Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Informações da Medição</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Nome do Projeto *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={formData.projectName}
                                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Cliente *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Nº Medição</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={formData.measurementNumber}
                                        onChange={(e) => setFormData({ ...formData, measurementNumber: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Data Referência</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={formData.referenceDate}
                                        onChange={(e) => setFormData({ ...formData, referenceDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Status</label>
                                    <select
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="DRAFT">Rascunho</option>
                                        <option value="SUBMITTED">Enviado</option>
                                        <option value="APPROVED">Aprovado</option>
                                        <option value="PAID">Pago</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Retenção (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={formData.retentionPercentage}
                                        onChange={(e) => setFormData({ ...formData, retentionPercentage: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Itens Medidos</h3>
                                <span className="text-xs font-bold text-slate-500">{items.length} item(ns)</span>
                            </div>

                            {/* Add New Item Form */}
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-3">
                                <div className="text-xs font-black text-emerald-700 uppercase mb-2">Adicionar Novo Item</div>
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Código"
                                            className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            value={newItem.serviceCode}
                                            onChange={(e) => setNewItem({ ...newItem, serviceCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            placeholder="Descrição do serviço..."
                                            className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            value={newItem.serviceName}
                                            onChange={(e) => setNewItem({ ...newItem, serviceName: e.target.value })}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <select
                                            className="w-full px-2 py-2 text-sm border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            value={newItem.unit}
                                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        >
                                            <option value="M2">M²</option>
                                            <option value="M3">M³</option>
                                            <option value="M">M</option>
                                            <option value="UN">UN</option>
                                            <option value="KG">KG</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Qtd"
                                            className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            value={newItem.currentQuantity}
                                            onChange={(e) => setNewItem({ ...newItem, currentQuantity: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="R$ Unit."
                                            className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            value={newItem.unitPrice}
                                            onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="w-full h-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all flex items-center justify-center"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            {items.length > 0 && (
                                <div className="border border-slate-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <th className="px-4 py-3 text-left">Código</th>
                                                <th className="px-4 py-3 text-left">Descrição</th>
                                                <th className="px-4 py-3 text-center">Unidade</th>
                                                <th className="px-4 py-3 text-right">Quantidade</th>
                                                <th className="px-4 py-3 text-right">Preço Unit.</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {items.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/50 group">
                                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{item.serviceCode}</td>
                                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serviceName}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-slate-600">{item.unit}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="w-20 px-2 py-1 text-right border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                                            value={item.currentQuantity}
                                                            onChange={(e) => handleUpdateItemQuantity(item.id, parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="w-24 px-2 py-1 text-right border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                                            value={item.unitPrice}
                                                            onChange={(e) => handleUpdateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-black text-slate-900">
                                                        {item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {items.length === 0 && (
                                <div className="text-center py-8 text-slate-300">
                                    <p className="text-sm font-bold">Nenhum item adicionado</p>
                                    <p className="text-xs mt-1">Adicione itens para compor a medição</p>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Observações</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Notas adicionais sobre esta medição..."
                            />
                        </div>

                        {/* Summary */}
                        <div className="mt-8 flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="text-xs font-bold uppercase">Subtotal</span>
                                    <span className="text-sm font-medium">
                                        {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-red-500">
                                    <span className="text-xs font-bold uppercase">Retenção ({formData.retentionPercentage}%)</span>
                                    <span className="text-sm font-medium">
                                        - {retentionAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div className="flex justify-between items-center text-emerald-600">
                                    <span className="text-sm font-black uppercase">Valor Líquido</span>
                                    <span className="text-xl font-black">
                                        {netValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                            Cancelar
                        </Button>
                        <Button type="submit" onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                            <Save className="w-4 h-4 mr-2" /> Salvar Medição
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
