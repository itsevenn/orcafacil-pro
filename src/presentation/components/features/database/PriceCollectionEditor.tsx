import React, { useState, useMemo } from 'react';
import { usePriceCollectionStore } from '../../../stores/use-price-collection-store';
import { Button } from '../../ui/button';
import {
    ChevronLeft,
    Save,
    Plus,
    Trash2,
    Calculator,
    TrendingDown,
    Award,
    Building2,
    UserPlus,
    CheckCircle2,
    DollarSign,
    Target
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface PriceCollectionEditorProps {
    collectionId: string;
    onBack: () => void;
}

export const PriceCollectionEditor: React.FC<PriceCollectionEditorProps> = ({ collectionId, onBack }) => {
    const { collections, updateCollection, addQuote, selectQuote, closeCollection } = usePriceCollectionStore();
    const collection = useMemo(() => collections.find(c => c.id === collectionId), [collections, collectionId]);

    // Internal state for "Adding a new supplier to the grid"
    const [supplierNames, setSupplierNames] = useState<string[]>(['Hidráulica Central', 'Materiais Construforte']);

    if (!collection) return <div>Coleta não encontrada.</div>;

    const handleAddSupplier = () => {
        const name = prompt('Nome do Fornecedor:');
        if (name && !supplierNames.includes(name)) {
            setSupplierNames([...supplierNames, name]);
        }
    };

    const handlePriceChange = (inputId: string, supplierName: string, price: string) => {
        const numPrice = parseFloat(price.replace(',', '.'));
        if (!isNaN(numPrice)) {
            addQuote(collectionId, inputId, {
                supplierId: supplierName, // Using name as ID for mock simplicity
                supplierName: supplierName,
                price: numPrice
            });
        }
    };

    const getQuoteFor = (item: any, supplierName: string) => {
        return item.quotes.find((q: any) => q.supplierName === supplierName);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/30 overflow-hidden">
            {/* Contextual Header */}
            <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="px-2 py-0.5 rounded bg-blue-50 text-[9px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">
                                Marketplace Intelligence
                            </div>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] font-black font-mono text-slate-400 uppercase">{collection.id.slice(0, 8)}</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">{collection.description}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Coleta em Andamento</span>
                    </div>
                    <Button variant="outline" className="h-12 border-slate-200 rounded-2xl font-black text-[10px] uppercase px-6" onClick={handleAddSupplier}>
                        <UserPlus className="w-4 h-4 mr-2" /> Adicionar Fornecedor
                    </Button>
                    <Button className="h-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase px-8 shadow-lg shadow-slate-200" onClick={() => { closeCollection(collection.id); onBack(); }}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar & Atualizar Base
                    </Button>
                </div>
            </div>

            {/* Matrix View */}
            <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden min-w-[1000px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-8 w-[350px] sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.05)]">
                                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Items da Coleta</div>
                                        <div className="text-[10px] text-slate-400 font-medium lowercase italic">Insumos selecionados para cotação</div>
                                    </th>
                                    {supplierNames.map(s => (
                                        <th key={s} className="px-8 py-8 border-r border-slate-50 min-w-[200px]">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="font-black text-slate-900 text-sm tracking-tight">{s}</div>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-50">
                                                <Award className="w-3 h-3 text-amber-500" />
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Fornecedor VIP</span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-8 py-8 bg-blue-50/30">
                                        <div className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1 text-center">Inteligência</div>
                                        <div className="text-[10px] text-blue-400 font-medium lowercase text-center">Melhor Oferta</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {collection.items.map((item, idx) => (
                                    <tr key={item.inputId} className="hover:bg-slate-50/20 transition-colors group">
                                        <td className="px-8 py-6 sticky left-0 bg-white z-10 border-r border-slate-50 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.05)]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{item.inputName}</div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">
                                                        Unidade: {item.unit} <span className="mx-2 text-slate-200">|</span> Ref: {item.lastPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {supplierNames.map(s => {
                                            const quote = getQuoteFor(item, s);
                                            return (
                                                <td key={s} className={cn(
                                                    "px-8 py-6 border-r border-slate-50 transition-all",
                                                    quote?.isLowest && "bg-emerald-50/30"
                                                )}>
                                                    <div className="relative group/input">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">R$</div>
                                                        <input
                                                            type="text"
                                                            className={cn(
                                                                "w-full pl-8 pr-3 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-black text-slate-900 transition-all outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200",
                                                                quote?.isLowest && "border-emerald-200 text-emerald-700 bg-white"
                                                            )}
                                                            placeholder="0,00"
                                                            defaultValue={quote?.price?.toString().replace('.', ',') || ''}
                                                            onBlur={(e) => handlePriceChange(item.inputId, s, e.target.value)}
                                                        />
                                                        {quote?.isLowest && (
                                                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                                                                <Target className="w-2.5 h-2.5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="px-8 py-6 bg-blue-50/20 text-center">
                                            {item.quotes.length > 0 ? (
                                                <div className="animate-in fade-in zoom-in duration-300">
                                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 leading-none">Minimo</div>
                                                    <div className="text-lg font-black text-slate-900">
                                                        {Math.min(...item.quotes.map(q => q.price)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </div>
                                                    <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase mt-1">
                                                        <TrendingDown className="w-3 h-3" />
                                                        Economia de {(((item.lastPrice - Math.min(...item.quotes.map(q => q.price))) / item.lastPrice) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-black text-slate-300 uppercase italic">Aguardando preços</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legend & Summary Cards */}
                <div className="mt-8 grid grid-cols-4 gap-6">
                    <div className="col-span-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resumo Global</h3>
                            <Calculator className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900">R$ 15.240,00</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Valor Total Baseado na Melhor Oferta</div>
                        </div>
                        <div className="h-1 bg-slate-50 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-blue-600 w-2/3" />
                        </div>
                    </div>

                    <div className="col-span-1 bg-emerald-900 p-6 rounded-[2rem] shadow-xl shadow-emerald-100 flex flex-col gap-3 group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                            <DollarSign className="w-32 h-32 text-white" />
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">Economia Potencial</h3>
                            <Award className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-black text-white">R$ 1.150,40</div>
                            <div className="text-[10px] font-medium text-emerald-400 mt-1 uppercase">Redução de custos vs. Base Atual</div>
                        </div>
                        <button className="mt-2 text-left relative z-10">
                            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest hover:text-white transition-colors">Ver detalhes da análise →</span>
                        </button>
                    </div>

                    <div className="col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2rem] shadow-xl shadow-blue-100 flex items-center gap-8 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-10 blur-3xl" />
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-3">Dica de Compra</h3>
                            <p className="text-lg font-bold leading-tight">
                                "O fornecedor <span className="text-amber-300">Hidráulica Central</span> oferece os melhores preços para materiais hidráulicos, com média 12% abaixo da sua base atual."
                            </p>
                        </div>
                        <div className="relative z-10 flex-shrink-0">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Award className="w-8 h-8 text-amber-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
