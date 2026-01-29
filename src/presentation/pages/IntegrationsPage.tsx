import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Link as LinkIcon, Database, Cloud,
    Globe, Shield, Zap, Settings, ArrowRight,
    ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const IntegrationsPage: React.FC = () => {
    const integrations = [
        {
            id: 'google-drive',
            name: 'Google Drive',
            desc: 'Sincronize arquivos de projetos e fotos do diário de obras.',
            icon: Cloud,
            color: 'bg-blue-50 text-blue-600',
            connected: true
        },
        {
            id: 'dropbox',
            name: 'Dropbox',
            desc: 'Armazenamento em nuvem para orçamentos e documentos PDF.',
            icon: Cloud,
            color: 'bg-indigo-50 text-indigo-600',
            connected: false
        },
        {
            id: 'whatsapp-api',
            name: 'WhatsApp Business',
            desc: 'Envio automático de orçamentos e alertas para clientes.',
            icon: Zap,
            color: 'bg-emerald-50 text-emerald-600',
            connected: true
        },
        {
            id: 'erp-external',
            name: 'ERP Externo (API)',
            desc: 'Webhooks para integração bidirecional com sistemas SAP/Sienge.',
            icon: Database,
            color: 'bg-slate-50 text-slate-600',
            connected: false
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrações</h1>
                    <p className="text-slate-500 font-medium">Conecte o OrçaPro com suas ferramentas favoritas.</p>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-200">
                    <Globe className="w-4 h-4 mr-2" /> Explorar API Docs
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((item) => (
                    <Card key={item.id} className="group rounded-3xl border-0 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className={cn("p-4 rounded-2xl shadow-inner", item.color)}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                        item.connected ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                                    )}>
                                        {item.connected ? 'Conectado' : 'Desconectado'}
                                    </span>
                                    {/* Mock Switch */}
                                    <div className={cn(
                                        "w-8 h-4 rounded-full relative transition-colors cursor-pointer",
                                        item.connected ? "bg-blue-600" : "bg-slate-200"
                                    )}>
                                        <div className={cn(
                                            "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                                            item.connected ? "left-4.5" : "left-0.5"
                                        )} />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <CardTitle className="text-xl font-black text-slate-900">{item.name}</CardTitle>
                                <CardDescription className="text-sm font-medium text-slate-500 mt-1">
                                    {item.desc}
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-1 transition-colors">
                                    <Shield className="w-3 h-3" /> Logs de Segurança
                                </button>
                                <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-1 transition-colors">
                                    <Settings className="w-3 h-3" /> Configurar
                                </button>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Developer Section */}
                <Card className="md:col-span-2 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group">
                    <CardContent className="p-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Custom Webhook Integration</h3>
                        <p className="text-slate-500 max-w-md mt-2 font-medium">
                            Crie sua própria integração usando nossos Webhooks e APIs RESTful para sincronizar dados em tempo real.
                        </p>
                        <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-12 py-6 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200">
                            Começar Integração <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
