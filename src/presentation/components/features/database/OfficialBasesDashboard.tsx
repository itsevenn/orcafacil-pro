import React, { useState } from 'react';
import { useDatabaseStore } from '../../../stores/use-database-store';
import { Input as DomainInput } from '../../../../domain/models/input';
import { Button } from '../../ui/button';
import { Search, Settings, RefreshCw, Database, Server, CheckCircle2, AlertTriangle, History, Plus, Briefcase, Globe, Trash2, Edit2, Download, Upload } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { IntegrationSettingsDialog } from './IntegrationSettingsDialog';
import { InputEditor } from './InputEditor';
import { HistoryDialog } from './HistoryDialog';

interface OfficialBasesDashboardProps {
    onViewHistory?: (input: DomainInput) => void;
}

export const OfficialBasesDashboard: React.FC<OfficialBasesDashboardProps> = ({ onViewHistory }) => {
    const { inputs, createInput, updateInput, deleteInput, fetchInputs, isLoading, createManyInputs, syncOfficialBase } = useDatabaseStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedSource, setSelectedSource] = useState('Todas as Fontes');
    const [viewMode, setViewMode] = useState<'OFFICIAL' | 'OWN'>('OFFICIAL');
    const [isInputEditorOpen, setIsInputEditorOpen] = useState(false);
    const [editingInput, setEditingInput] = useState<DomainInput | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyItem, setHistoryItem] = useState<DomainInput | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    React.useEffect(() => {
        fetchInputs();
    }, [fetchInputs]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await syncOfficialBase(selectedSource === 'Todas as Fontes' ? 'SINAPI' : selectedSource);
            alert(`Base ${selectedSource} atualizada com sucesso!`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleViewHistory = (item: DomainInput) => {
        setHistoryItem(item);
        setIsHistoryOpen(true);
    };

    const handleExport = () => {
        const ownInputs = inputs.filter(i => i.source === 'OWN');
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ownInputs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "meus_insumos_orcapro.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (Array.isArray(json)) {
                    await createManyInputs(json);
                    alert(`${json.length} insumos importados com sucesso!`);
                }
            } catch (err) {
                alert("Erro ao importar arquivo. Verifique o formato.");
            }
        };
        reader.readAsText(file);
    };

    const filteredItems = inputs.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesViewMode = viewMode === 'OWN' ? item.source === 'OWN' : item.source !== 'OWN';
        const matchesSource = selectedSource === 'Todas as Fontes' || item.source === selectedSource;

        return matchesSearch && matchesSource && matchesViewMode;
    });

    const handleSaveInput = async (input: DomainInput) => {
        if (editingInput) {
            await updateInput(input.id, input);
        } else {
            await createInput(input);
        }
        setIsInputEditorOpen(false);
    };

    const handleDeleteInput = async (id: string) => {
        if (confirm('Deseja realmente excluir este insumo?')) {
            await deleteInput(id);
        }
    };

    const getSourceBadgeColor = (source: string) => {
        switch (source) {
            case 'SINAPI': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
            case 'ORSE': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
            case 'OWN': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Insumos</h1>
                    <p className="text-slate-500 mt-1">Consulte bases oficiais ou gerencie sua própria base de custos.</p>
                </div>
                <div className="flex gap-2">
                    {viewMode === 'OWN' && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accept=".json"
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm font-bold"
                            >
                                <Upload className="w-4 h-4 mr-2 text-slate-500" />
                                Importar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleExport}
                                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm font-bold"
                            >
                                <Download className="w-4 h-4 mr-2 text-slate-500" />
                                Exportar
                            </Button>
                            <Button
                                onClick={() => { setEditingInput(null); setIsInputEditorOpen(true); }}
                                className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 font-bold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Insumo
                            </Button>
                        </>
                    )}
                    <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="w-4 h-4 mr-2 text-slate-500" />
                        Configurações
                    </Button>
                </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                <button
                    onClick={() => setViewMode('OFFICIAL')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                        viewMode === 'OFFICIAL' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-600"
                    )}
                >
                    <Globe className="w-4 h-4" />
                    Bases Oficiais
                </button>
                <button
                    onClick={() => setViewMode('OWN')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                        viewMode === 'OWN' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-600"
                    )}
                >
                    <Briefcase className="w-4 h-4" />
                    Minha Base Própria
                </button>
            </div>

            {viewMode === 'OFFICIAL' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* SINAPI Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">SINAPI</h3>
                                    <p className="text-sm text-slate-500">Tabela Oficial</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Atualizado
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Mês de Referência</div>
                                <div className="font-bold text-slate-800 text-lg">10/2023</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Região / UF</div>
                                <div className="font-bold text-slate-800 text-lg">SP</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button variant="ghost" className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 h-10 border border-slate-100">
                                <RefreshCw className="w-3 h-3 mr-2" /> Verificar Atualizações
                            </Button>
                        </div>
                    </div>

                    {/* ORSE Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                    <Server className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">ORSE</h3>
                                    <p className="text-sm text-slate-500">Tabela Oficial</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Desatualizado
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Mês de Referência</div>
                                <div className="font-bold text-slate-800 text-lg">09/2023</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Região / UF</div>
                                <div className="font-bold text-slate-800 text-lg">SE</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md shadow-indigo-500/20 h-10">
                                <RefreshCw className="w-3 h-3 mr-2" /> Sincronizar Agora
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Item Explorer */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Database className="w-4 h-4 text-slate-500" />
                        {viewMode === 'OFFICIAL' ? 'Explorador de Insumos Oficiais' : 'Meus Insumos Próprios'}
                    </div>
                    <div className="flex gap-2 w-full max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar código ou nome..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-md text-sm border border-slate-200 focus:ring-1 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {viewMode === 'OFFICIAL' && (
                            <select
                                className="bg-white border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-md text-sm font-medium focus:outline-none focus:border-[#0070d2] cursor-pointer hover:border-slate-300"
                                value={selectedSource}
                                onChange={(e) => setSelectedSource(e.target.value)}
                            >
                                <option>Todas as Fontes</option>
                                <option>SINAPI</option>
                                <option>ORSE</option>
                            </select>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 w-28">Fonte</th>
                                <th className="px-6 py-4 w-24">Código</th>
                                <th className="px-6 py-4">Descrição do Insumo</th>
                                <th className="px-6 py-4 w-32">Categoria</th>
                                <th className="px-6 py-4 w-20 text-center">Unid.</th>
                                <th className="px-6 py-4 w-32 text-right">Preço Unit.</th>
                                <th className="px-6 py-4 w-28 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-4 h-12 bg-slate-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                                        Nenhum insumo encontrado nesta visualização.
                                    </td>
                                </tr>
                            ) : filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                            getSourceBadgeColor(item.source)
                                        )}>
                                            {item.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-500 font-medium">
                                        {item.code}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                                        {item.category || item.type}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-bold lowercase text-center">
                                        {item.unit}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-slate-900 bg-slate-50/30">
                                        {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {viewMode === 'OWN' ? (
                                                <>
                                                    <button
                                                        onClick={() => { setEditingInput(item); setIsInputEditorOpen(true); }}
                                                        className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-100 text-slate-400 transition-all"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteInput(item.id)}
                                                        className="p-1.5 hover:bg-white hover:text-red-500 rounded-lg shadow-sm border border-transparent hover:border-red-100 text-slate-400 transition-all"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => onViewHistory?.(item)}
                                                    className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-100 text-slate-400 transition-all"
                                                    title="Ver Histórico"
                                                >
                                                    <History className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <InputEditor
                open={isInputEditorOpen}
                onOpenChange={setIsInputEditorOpen}
                input={editingInput}
                onSave={handleSaveInput}
            />

            <HistoryDialog
                open={isHistoryOpen}
                onOpenChange={setIsHistoryOpen}
                item={historyItem}
            />

            <IntegrationSettingsDialog
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                onSave={(settings) => {
                    console.log("Settings saved:", settings);
                    setIsSettingsOpen(false);
                }}
            />
        </div>
    );
};
