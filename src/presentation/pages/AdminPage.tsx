import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Settings, Building2, Users, Shield,
    Lock, Bell, Globe, Mail, Save,
    CheckCircle2, ChevronRight, UserPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'company' | 'sectors' | 'users'>('company');

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel Administrativo</h1>
                    <p className="text-slate-500 font-medium">Configurações globais, permissões e estrutura organizacional.</p>
                </div>
                <Button className="bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg shadow-slate-200">
                    <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {[
                        { id: 'company', label: 'Empresa', icon: Building2 },
                        { id: 'sectors', label: 'Setores', icon: Shield },
                        { id: 'users', label: 'Usuários & Níveis', icon: Users },
                        { id: 'security', label: 'Segurança', icon: Lock },
                        { id: 'notifications', label: 'Notificações', icon: Bell }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as any)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                activeSection === item.id
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                    : "text-slate-500 hover:bg-white hover:shadow-md"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", activeSection === item.id ? "text-blue-400" : "text-slate-400 group-hover:text-slate-600")} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </div>
                            <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", activeSection === item.id ? "opacity-100" : "")} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {activeSection === 'company' && (
                        <Card className="rounded-3xl border-0 shadow-xl shadow-slate-100/50 overflow-hidden">
                            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                                <CardTitle className="text-xl font-black text-slate-900">Perfil da Empresa</CardTitle>
                                <CardDescription>Informações básicas e identidade visual.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Fantasia</label>
                                        <input className="w-full p-4 bg-slate-50 rounded-2xl border-0 focus:ring-4 focus:ring-blue-100 outline-none text-slate-900 font-bold transition-all" defaultValue="OrçaPro Engenharia" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CNPJ</label>
                                        <input className="w-full p-4 bg-slate-50 rounded-2xl border-0 focus:ring-4 focus:ring-blue-100 outline-none text-slate-900 font-bold transition-all" defaultValue="12.345.678/0001-90" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">E-mail Corporativo</label>
                                        <input className="w-full p-4 bg-slate-50 rounded-2xl border-0 focus:ring-4 focus:ring-blue-100 outline-none text-slate-900 font-bold transition-all" defaultValue="contato@orcapro.com.br" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-50">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Localização</h4>
                                    <input className="w-full p-4 bg-slate-50 rounded-2xl border-0 focus:ring-4 focus:ring-blue-100 outline-none text-slate-900 font-bold transition-all" defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'users' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-black text-slate-900">Usuários Ativos</h3>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                                    <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
                                </Button>
                            </div>
                            {[
                                { name: 'Everton Silva', role: 'Administrador', status: 'Online' },
                                { name: 'João Pereira', role: 'Engenheiro de Campo', status: 'Offline' },
                                { name: 'Maria Santos', role: 'Orçamentista', status: 'Online' }
                            ].map((user, i) => (
                                <Card key={i} className="rounded-2xl border-0 shadow-md shadow-slate-100/50 hover:shadow-xl transition-all group overflow-hidden">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{user.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</span>
                                                    <span className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        user.status === 'Online' ? "bg-emerald-500" : "bg-slate-300"
                                                    )} />
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-xl text-slate-300 hover:text-slate-600">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
