import React from 'react';
import { Input } from '../../../../domain/models/input';
import { Button } from '../../ui/button';
import {
    ArrowLeft, TrendingUp, TrendingDown,
    Calendar, DollarSign, History,
    Download, Filter, Tag, Calculator
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface PricePoint {
    date: string;
    price: number;
    source: string;
    change: number; // percentage
}

interface InputHistoryViewProps {
    input: Input;
    onBack: () => void;
}

export const InputHistoryView: React.FC<InputHistoryViewProps> = ({ input, onBack }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // Mock history data
    const history: PricePoint[] = [
        { date: '2024-01-15', price: input.price, source: 'Mercado Local', change: 2.5 },
        { date: '2023-12-10', price: input.price * 0.975, source: 'SINAPI', change: -1.2 },
        { date: '2023-11-05', price: input.price * 0.987, source: 'SINAPI', change: 0.8 },
        { date: '2023-10-02', price: input.price * 0.979, source: 'Mercado Local', change: 0 }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in p-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-blue-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                                {input.code}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">•</span>
                            <span className="text-xs text-slate-500 font-bold uppercase">{input.type}</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{input.name}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200">
                        <Download className="w-4 h-4 mr-2" /> Exportar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                        Atualizar Preço
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Preço Atual</span>
                            <div className="text-3xl font-black text-slate-900">{formatCurrency(input.price)}</div>
                            <div className="flex items-center gap-1.5 mt-2 text-emerald-600 font-bold text-sm">
                                <TrendingUp className="w-4 h-4" />
                                +5.2% nos últimos 12 meses
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Unidade</span>
                                <div className="font-bold text-slate-700 uppercase">{input.unit}</div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Frequência</span>
                                <div className="font-bold text-slate-700">Mensal</div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Origem dos Dados</span>
                            <div className="flex items-center gap-2 mt-2">
                                <Tag className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-bold text-slate-700">Sinapi / Regional SP</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Analytics */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white">
                        <Calculator className="w-8 h-8 opacity-20 mb-4" />
                        <h3 className="font-bold text-lg mb-2">Impacto no Orçamento</h3>
                        <p className="text-blue-100 text-sm leading-relaxed">Este insumo representa 15.4% dos custos totais de materiais em sua última obra (Residencial Viver).</p>
                    </div>
                </div>

                {/* History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-600" />
                            <h2 className="font-bold text-slate-800">Log de Variação de Preços</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-50">
                                    <th className="px-8 py-4 text-left">Data de Atualização</th>
                                    <th className="px-6 py-4 text-left">Fonte / Base</th>
                                    <th className="px-6 py-4 text-right">Preço</th>
                                    <th className="px-8 py-4 text-right">Variação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.map((point, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 font-bold text-slate-700">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                {new Date(point.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-500 font-medium">{point.source}</td>
                                        <td className="px-6 py-5 text-right font-bold text-slate-900">{formatCurrency(point.price)}</td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={cn(
                                                "inline-flex items-center gap-1 font-bold",
                                                point.change > 0 ? "text-red-500" : point.change < 0 ? "text-emerald-500" : "text-slate-400"
                                            )}>
                                                {point.change > 0 && <TrendingUp className="w-3 h-3" />}
                                                {point.change < 0 && <TrendingDown className="w-3 h-3" />}
                                                {point.change === 0 ? 'Estável' : `${point.change}%`}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
