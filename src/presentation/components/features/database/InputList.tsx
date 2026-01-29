import React, { useState } from 'react';
import { useDatabaseStore } from '../../../stores/use-database-store';
import { Input, InputType } from '../../../../domain/models/input';
import { Button } from '../../ui/button';
import { Input as SearchInput } from '../../ui/input';
import { Search, Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { InputForm } from './InputForm';
import { InputFormData } from '../../../../domain/validation/database-schema';

export const InputList: React.FC = () => {
    const { inputs, isLoading, fetchInputs, createInput, updateInput, deleteInput, importInputs } = useDatabaseStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingInput, setEditingInput] = useState<Input | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Initial fetch
    React.useEffect(() => {
        fetchInputs();
    }, [fetchInputs]);

    const filteredInputs = inputs.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (data: InputFormData) => {
        if (editingInput) {
            await updateInput(editingInput.id, data);
        } else {
            await createInput(data);
        }
        setIsFormOpen(false);
        setEditingInput(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este insumo?')) {
            await deleteInput(id);
        }
    };

    const handleImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const data: any[] = []; // InputFormData array

            // Allow header skip? Assuming header exists for now
            // Format: code,name,unit,price,type
            const startIndex = 1;

            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Basic CSV split - warning: breaks on commas in fields
                const cols = line.split(',');
                if (cols.length < 4) continue;

                const priceStr = cols[3].replace('R$', '').replace(/\./g, '').replace(',', '.').trim();

                data.push({
                    code: cols[0].trim(),
                    name: cols[1].trim(),
                    unit: cols[2].trim(),
                    price: parseFloat(priceStr) || 0,
                    type: (cols[4]?.trim().toUpperCase() as any) || 'MATERIAL',
                    source: 'OWN'
                });
            }

            if (data.length > 0) {
                if (window.confirm(`Deseja importar ${data.length} itens?`)) {
                    await importInputs(data);
                    alert('Importação concluída!');
                }
            } else {
                alert('Nenhum dado válido encontrado. Formato: Código,Nome,Unidade,Preço,Tipo');
            }

            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <SearchInput
                        placeholder="Buscar insumos..."
                        className="pl-9 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} title="Formato CSV: Código,Nome,Unidade,Preço,Tipo">
                        <Upload className="w-4 h-4 mr-2" /> Importar CSV
                    </Button>
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImportCsv}
                    />
                    <Button onClick={() => { setEditingInput(null); setIsFormOpen(true); }}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Insumo
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 w-24">Código</th>
                            <th className="px-4 py-3">Descrição</th>
                            <th className="px-4 py-3 w-24">Tipo</th>
                            <th className="px-4 py-3 w-20 text-center">Und.</th>
                            <th className="px-4 py-3 w-32 text-right">Preço</th>
                            <th className="px-4 py-3 w-24 text-center">Origem</th>
                            <th className="px-4 py-3 w-24 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={7} className="p-4 text-center text-slate-400">Carregando...</td></tr>
                        ) : filteredInputs.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-400">Nenhum insumo encontrado.</td></tr>
                        ) : (
                            filteredInputs.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 group">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.code}</td>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                                            item.type === 'LABOR' ? "bg-amber-100 text-amber-700" :
                                                item.type === 'MATERIAL' ? "bg-blue-100 text-blue-700" :
                                                    "bg-slate-100 text-slate-700"
                                        )}>
                                            {item.type === 'LABOR' ? 'MO' : item.type === 'MATERIAL' ? 'MAT' : 'EQUIP'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-500">{item.unit}</td>
                                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                                        {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={cn(
                                            "text-[10px] font-bold px-1 rounded",
                                            item.source === 'SINAPI' ? "text-blue-600 bg-blue-50" :
                                                item.source === 'ORSE' ? "text-orange-600 bg-orange-50" :
                                                    "text-emerald-600 bg-emerald-50"
                                        )}>{item.source}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingInput(item); setIsFormOpen(true); }} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-red-100 rounded text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <InputForm
                    onSave={handleSave}
                    onCancel={() => { setIsFormOpen(false); setEditingInput(null); }}
                    initialData={editingInput}
                />
            )}
        </div>
    );
};
