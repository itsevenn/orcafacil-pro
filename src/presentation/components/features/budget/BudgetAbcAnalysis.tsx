import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { BudgetFormData } from '../../../../domain/validation/budget-schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '../../../../lib/utils';

// Types for analysis
interface AbcItem {
    id: string;
    name: string;
    total: number;
    percentage: number;
    cumulativePercentage: number;
    class: 'A' | 'B' | 'C';
}

export const BudgetAbcAnalysis: React.FC = () => {
    const { watch } = useFormContext<BudgetFormData>();
    const items = watch('items') || [];

    const analysisData = useMemo(() => {
        if (items.length === 0) return [];

        const totalBudget = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

        // 1. Calculate totals and sort descending
        const sortedItems = items.map(item => ({
            id: item.id || Math.random().toString(), // handle temp ids
            name: item.name,
            total: item.quantity * item.unitPrice
        })).sort((a, b) => b.total - a.total);

        // 2. Classify
        let cumulative = 0;
        const result: AbcItem[] = sortedItems.map(item => {
            cumulative += item.total;
            const cumulativePercentage = (cumulative / totalBudget) * 100;
            const percentage = (item.total / totalBudget) * 100;

            let abcClass: 'A' | 'B' | 'C' = 'C';
            if (cumulativePercentage <= 80) abcClass = 'A';
            else if (cumulativePercentage <= 95) abcClass = 'B';

            return {
                ...item,
                percentage,
                cumulativePercentage,
                class: abcClass
            };
        });

        // Edge case: ensure at least one A if exists
        return result;
    }, [items]);

    const stats = {
        A: analysisData.filter(i => i.class === 'A'),
        B: analysisData.filter(i => i.class === 'B'),
        C: analysisData.filter(i => i.class === 'C'),
    };

    if (items.length === 0) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-slate-300">
                    <BarChart3 className="w-4 h-4 mr-2" /> Análise ABC
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-slate-200">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                        Curva ABC (Pareto)
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-green-50 border-green-100">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-700">{stats.A.length}</div>
                            <div className="text-sm font-medium text-green-600">Itens Classe A</div>
                            <div className="text-xs text-green-500 mt-1">~80% do Custo</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-100">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-700">{stats.B.length}</div>
                            <div className="text-sm font-medium text-yellow-600">Itens Classe B</div>
                            <div className="text-xs text-yellow-500 mt-1">~15% do Custo</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-50 border-slate-100">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-slate-700">{stats.C.length}</div>
                            <div className="text-sm font-medium text-slate-600">Itens Classe C</div>
                            <div className="text-xs text-slate-500 mt-1">~5% do Custo</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="h-[350px] w-full mb-6 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={analysisData.slice(0, 20)}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={60}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                            />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip
                                formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                labelFormatter={(label) => `Item: ${label}`}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={40}>
                                {analysisData.slice(0, 20).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.class === 'A' ? '#22c55e' : entry.class === 'B' ? '#eab308' : '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Top 20 itens de maior impacto financeiro</p>
                </div>

                <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-2 text-left w-12">Cl.</th>
                                <th className="px-4 py-2 text-left">Item</th>
                                <th className="px-4 py-2 text-right">% Individual</th>
                                <th className="px-4 py-2 text-right">% Acumulado</th>
                                <th className="px-4 py-2 text-right">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {analysisData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2">
                                        <span className={cn(
                                            "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                            item.class === 'A' ? "bg-green-100 text-green-700" :
                                                item.class === 'B' ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-slate-100 text-slate-700"
                                        )}>
                                            {item.class}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 font-medium text-slate-700 truncate max-w-[200px]" title={item.name}>{item.name}</td>
                                    <td className="px-4 py-2 text-right text-slate-500">{item.percentage.toFixed(2)}%</td>
                                    <td className="px-4 py-2 text-right text-slate-500">{item.cumulativePercentage.toFixed(2)}%</td>
                                    <td className="px-4 py-2 text-right font-medium">
                                        {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
};
