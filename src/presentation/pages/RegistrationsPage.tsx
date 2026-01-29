import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Users, Briefcase, Truck, Plus, Search,
    Filter, Mail, Phone, MapPin, Star,
    CheckCircle2, AlertCircle, MoreVertical
} from 'lucide-react';
import { cn } from '../../lib/utils';

import { ViewState } from '../../../types';

interface RegistrationsPageProps {
    currentView?: ViewState;
}

export const RegistrationsPage: React.FC<RegistrationsPageProps> = ({ currentView }) => {
    const [activeTab, setActiveTab] = useState<'suppliers' | 'employees'>('suppliers');
    const [searchTerm, setSearchTerm] = useState('');

    // Sync tab with sidebar navigation
    React.useEffect(() => {
        if (currentView === 'suppliers') setActiveTab('suppliers');
        if (currentView === 'employees') setActiveTab('employees');
    }, [currentView]);

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cadastros</h1>
                    <p className="text-slate-500 font-medium">Gestão centralizada de fornecedores e colaboradores.</p>
                </div>
                <Button className="bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg shadow-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    {activeTab === 'suppliers' ? 'Novo Fornecedor' : 'Novo Colaborador'}
                </Button>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex p-1 bg-slate-100 rounded-2xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('suppliers')}
                        className={cn(
                            "px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                            activeTab === 'suppliers' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <Truck className="w-4 h-4" /> Fornecedores
                    </button>
                    <button
                        onClick={() => setActiveTab('employees')}
                        className={cn(
                            "px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                            activeTab === 'employees' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <Users className="w-4 h-4" /> Colaboradores
                    </button>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={activeTab === 'suppliers' ? "Buscar fornecedor..." : "Buscar colaborador..."}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="group hover:shadow-2xl hover:shadow-slate-200/50 transition-all border-0 shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
                                <MoreVertical className="w-4 h-4 text-slate-400" />
                            </Button>
                        </div>

                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner",
                                    activeTab === 'suppliers' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                )}>
                                    {activeTab === 'suppliers' ? 'F' : 'C'}{i}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg font-black text-slate-900">
                                            {activeTab === 'suppliers' ? `Fornecedor Exemplo ${i}` : `Colaborador ${i}`}
                                        </CardTitle>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                        {activeTab === 'suppliers' ? (
                                            <> <Truck className="w-3 h-3" /> Materiais de Construção </>
                                        ) : (
                                            <> <Briefcase className="w-3 h-3" /> Mestre de Obras </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{activeTab === 'suppliers' ? 'contato@fornecedor.com' : 'colaborador@orcax.com'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Phone className="w-4 h-4" />
                                    <span>(11) 98765-4321</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">São Paulo, SP</span>
                                </div>
                            </div>

                            {activeTab === 'suppliers' ? (
                                <div className="pt-2 flex justify-between items-center">
                                    <div className="flex items-center gap-0.5 text-amber-500">
                                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-3.5 h-3.5 fill-current" />)}
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tighter">
                                        Excelente
                                    </span>
                                </div>
                            ) : (
                                <div className="pt-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Salário: <span className="text-slate-900">R$ 4.500,00</span></span>
                                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">CLT</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
