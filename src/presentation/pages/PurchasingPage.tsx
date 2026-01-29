import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    ShoppingCart, Plus, Search, Filter,
    Clock, CheckCircle2, AlertCircle, TrendingUp,
    FileText, Package, Truck, ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PurchaseRequest, PurchaseOrder, PurchaseStatus } from '../../domain/models/purchasing';

import { ViewState } from '../../../types';

interface PurchasingPageProps {
    currentView?: ViewState;
}

export const PurchasingPage: React.FC<PurchasingPageProps> = ({ currentView }) => {
    const [activeTab, setActiveTab] = useState<'requests' | 'orders'>('requests');
    const [searchTerm, setSearchTerm] = useState('');

    // Sync tab with sidebar navigation
    React.useEffect(() => {
        if (currentView === 'purchases_requests') setActiveTab('requests');
        if (currentView === 'purchases_control') setActiveTab('orders');
    }, [currentView]);

    const getStatusStyle = (status: PurchaseStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'QUOTING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ORDERED': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'RECEIVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const StatusIcon = ({ status }: { status: PurchaseStatus }) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-3.5 h-3.5 mr-1" />;
            case 'QUOTING': return <FileText className="w-3.5 h-3.5 mr-1" />;
            case 'ORDERED': return <ShoppingCart className="w-3.5 h-3.5 mr-1" />;
            case 'RECEIVED': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
            default: return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Compras</h1>
                    <p className="text-slate-500 font-medium">Controle solicitações de material e ordens de compra.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50">
                        <TrendingUp className="w-4 h-4 mr-2 text-blue-600" /> Relatórios
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200">
                        <Plus className="w-4 h-4 mr-2" />
                        {activeTab === 'requests' ? 'Nova Solicitação' : 'Nova Ordem'}
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Solicitações Aberta', value: '12', icon: FileText, color: 'blue' },
                    { label: 'Em Cotação', value: '05', icon: Search, color: 'amber' },
                    { label: 'A Caminho', value: '08', icon: Truck, color: 'indigo' },
                    { label: 'Entregues (Mês)', value: '42', icon: Package, color: 'emerald' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={cn(`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{stat.label}</span>
                            <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs & Filters */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-2 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                                activeTab === 'requests' ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            Solicitações
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                                activeTab === 'orders' ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            Ordens de Compra
                        </button>
                    </div>

                    <div className="flex items-center gap-3 pr-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white border border-transparent hover:border-slate-100">
                            <Filter className="w-4 h-4 text-slate-500" />
                        </Button>
                    </div>
                </div>

                <div className="min-h-[400px]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-50">
                                <th className="px-8 py-5 text-left">ID / Obra</th>
                                <th className="px-6 py-5 text-left">Status</th>
                                <th className="px-6 py-5 text-left">Solicitante</th>
                                <th className="px-6 py-5 text-center">Itens</th>
                                <th className="px-6 py-5 text-right">Data</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="group hover:bg-slate-50 transition-all cursor-pointer">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">#SC-2024-00{i}</span>
                                            <span className="text-xs text-slate-400 font-medium">Reforma apto 402</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight",
                                            getStatusStyle(i === 1 ? 'PENDING' : i === 2 ? 'QUOTING' : 'ORDERED')
                                        )}>
                                            <StatusIcon status={i === 1 ? 'PENDING' : i === 2 ? 'QUOTING' : 'ORDERED'} />
                                            {i === 1 ? 'Pendente' : i === 2 ? 'Em Cotação' : 'Comprado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white shadow-sm">
                                                ES
                                            </div>
                                            <span className="font-semibold text-slate-600">Everton Silva</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="bg-slate-100 text-slate-500 font-black text-[10px] px-2 py-0.5 rounded-full">08 itens</span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-medium text-slate-500">
                                        15/Jan/2024
                                    </td>
                                    <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white rounded-lg shadow-sm text-blue-600">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
