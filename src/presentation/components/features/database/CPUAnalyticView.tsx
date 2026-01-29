import React from 'react';
import { Composition } from '../../../../domain/models/composition';
import { Button } from '../../ui/button';
import {
    X, FileText, Printer, Share2,
    Construction, ShoppingCart, Hammer,
    ArrowLeft, Calculator
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface CPUAnalyticViewProps {
    composition: Composition;
    onBack: () => void;
}

export const CPUAnalyticView: React.FC<CPUAnalyticViewProps> = ({ composition, onBack }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden animate-fade-in max-w-5xl mx-auto border-t-4 border-t-[#0070d2]">
            {/* Header / Toolbar */}
            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-6">
                    <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-[#0070d2]">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600">
                            <Printer className="w-4 h-4 mr-2" /> Imprimir
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600">
                            <FileText className="w-4 h-4 mr-2" /> Exportar PDF
                        </Button>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#0070d2] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                            {composition.source || 'PRÓPRIA'}
                        </span>
                        <span className="text-sm font-mono font-bold text-[#0070d2]">
                            {composition.code}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 leading-tight">
                        {composition.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium pt-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Unidade: <span className="text-slate-900 uppercase">{composition.unit}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Região: <span className="text-slate-900 font-bold">Sinapi/MG</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Referência: <span className="text-slate-900">01/2024 (Não desonerado)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 p-8 bg-slate-50/30 border-b border-slate-100">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <ShoppingCart className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Materiais</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(composition.materialCost || 0)}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Hammer className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Mão de Obra</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                        {formatCurrency(composition.laborCost || 0)}
                        {composition.socialCharges > 0 && (
                            <div className="text-[10px] text-emerald-600 font-bold mt-1">
                                + {composition.socialCharges}% Encargos
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Construction className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Equipamentos</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(composition.equipmentCost || 0)}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calculator className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Custo Direto</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(composition.totalCost)}</div>
                    {composition.bdi > 0 && (
                        <div className="text-[10px] text-blue-600 font-bold mt-1">
                            BDI: {composition.bdi}%
                        </div>
                    )}
                </div>
                <div className="bg-[#0070d2] p-5 rounded-2xl shadow-lg shadow-blue-200 flex flex-col justify-center col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2 text-blue-100 mb-0.5">
                        <Calculator className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total com BDI</span>
                    </div>
                    <div className="text-2xl font-black text-white">
                        {formatCurrency(composition.totalWithBDI || composition.totalCost)}
                    </div>
                </div>
            </div>

            {/* Composition Table */}
            <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                            <th className="px-8 py-4 text-left font-black">Código / Descrição do Insumo</th>
                            <th className="px-6 py-4 text-center w-24">Tipo</th>
                            <th className="px-6 py-4 text-center w-20">Unid.</th>
                            <th className="px-6 py-4 text-center w-24">Coefic.</th>
                            <th className="px-6 py-4 text-right w-32">Preço Unit.</th>
                            <th className="px-8 py-4 text-right w-32">Custo Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {composition.items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-[11px] font-bold text-[#0070d2] mb-0.5">{item.id}</span>
                                        <span className="font-bold text-slate-700 leading-tight group-hover:text-[#0070d2] transition-colors">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider",
                                        item.type === 'INPUT' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    )}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center text-slate-500 font-bold uppercase">{item.unit}</td>
                                <td className="px-6 py-5 text-center font-mono font-bold text-slate-900 bg-slate-50/50">
                                    {item.quantity.toLocaleString('pt-BR', { minimumFractionDigits: 4 })}
                                </td>
                                <td className="px-6 py-5 text-right font-medium text-slate-500">
                                    {formatCurrency(item.price)}
                                </td>
                                <td className="px-8 py-5 text-right font-black text-slate-900 bg-slate-50/30">
                                    {formatCurrency(item.price * item.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Price Formation Analysis */}
            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Detalhamento da Composição do Preço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-slate-500">Total Materiais</span>
                            <span className="text-slate-900 font-bold">{formatCurrency(composition.materialCost || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-slate-500">Total Mão de Obra (Direto)</span>
                            <span className="text-slate-900 font-bold">{formatCurrency(composition.laborCost || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-slate-500">Encargos Sociais ({composition.socialCharges}%)</span>
                            <span className="text-emerald-600 font-bold">
                                {formatCurrency((composition.laborCost || 0) * (composition.socialCharges / 100))}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium p-3 bg-white rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-[#0070d2]">
                            <span className="text-[#0070d2] font-black uppercase text-[10px] tracking-wider">Custo Direto Total</span>
                            <span className="text-slate-900 font-black text-lg">{formatCurrency(composition.totalCost)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-slate-500">BDI ({composition.bdi}%)</span>
                            <span className="text-blue-600 font-bold">
                                {formatCurrency(composition.totalCost * (composition.bdi / 100))}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-4 bg-[#0070d2] text-white rounded-xl shadow-lg shadow-blue-100">
                            <span className="font-black uppercase tracking-widest text-xs">Preço de Venda Sugerido</span>
                            <span className="font-black text-xl">{formatCurrency(composition.totalWithBDI || composition.totalCost)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Information */}
            <div className="p-8 border-t border-slate-100 bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center">
                <p>Relatório gerado em {new Date().toLocaleDateString('pt-BR')} via OrçaPro ERP • Base Legal: AF_06/2014</p>
                <div className="flex gap-4">
                    <span>Versão: 1.0.0</span>
                    <span>ID: {composition.id}</span>
                </div>
            </div>
        </div>
    );
};
