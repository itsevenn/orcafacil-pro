import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Client } from '../../../../domain/models/client';
import {
    Building2, User, Mail, Phone, MapPin, Globe, FileText,
    Calendar, Edit, Trash2, ShieldCheck, ChevronRight
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface ClientDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client: Client | null;
    onEdit: (client: Client) => void;
    onDelete: (id: string) => void;
}

export const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({ open, onOpenChange, client, onEdit, onDelete }) => {


    const getClientTypeLabel = (type: string) => {
        switch (type) {
            case 'PRIVATE': return 'Iniciativa Privada';
            case 'PUBLIC': return 'Empresa Pública';
            case 'GOVERNMENT': return 'Governo / Prefeitura';
            default: return type;
        }
    };

    if (!client) return null;

    return (
        <>
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/60 z-[100]"
                        onClick={() => onOpenChange(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                        <div
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex h-full max-h-[90vh]">
                                {/* Left Sidebar - Quick Info */}
                                <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center text-center overflow-y-auto">
                                    <div className="w-24 h-24 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] font-bold text-3xl mb-4 shadow-sm shrink-0">
                                        {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{client.name}</h2>
                                    <p className="text-xs font-bold text-[#4f46e5]/70 uppercase tracking-widest mb-4">{client.sector || 'SETOR NÃO DEFINIDO'}</p>

                                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                                        <Badge variant={client.isActive ? 'emerald' : 'slate'}>
                                            {client.isActive ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                        <Badge variant="blue">
                                            {getClientTypeLabel(client.clientType)}
                                        </Badge>
                                    </div>

                                    <div className="w-full space-y-4 pt-8 border-t border-slate-200">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">CNPJ / CPF</span>
                                            <span className="text-sm font-medium text-slate-700">{client.taxId || 'Não informado'}</span>
                                        </div>
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Desde</span>
                                            <span className="text-sm font-medium text-slate-700">{new Date(client.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto w-full space-y-2 pt-8">
                                        <Button className="w-full bg-[#0070d2] text-white" onClick={() => onEdit(client)}>
                                            <Edit className="w-4 h-4 mr-2" /> Editar Cliente
                                        </Button>
                                        <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(client.id)}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Excluir Registro
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Content - Detailed Info */}
                                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-white">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <User className="w-3 h-3" /> Detalhes de Contato
                                        </h3>
                                        <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400">Email Corporativo</p>
                                            <p className="text-sm font-semibold text-slate-700">{client.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400">Telefone / WhatsApp</p>
                                            <p className="text-sm font-semibold text-slate-700">{client.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400">Empresa / Grupo</p>
                                            <p className="text-sm font-semibold text-slate-700">{client.company || '-'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400">Website</p>
                                            <p className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">{client.website || '-'}</p>
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <p className="text-xs text-slate-400">Pessoa Responsável</p>
                                            <p className="text-sm font-semibold text-slate-700">{client.responsiblePerson || 'Não definido'}</p>
                                        </div>
                                    </div>

                                    <section className="space-y-6">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> Endereço e Localização
                                        </h3>
                                        {client.address ? (
                                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 grid grid-cols-2 gap-4">
                                                <div className="col-span-2 space-y-1">
                                                    <p className="text-xs text-slate-400">Logradouro</p>
                                                    <p className="text-sm font-semibold text-slate-700">{client.address.street}, {client.address.number}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-slate-400">Complemento</p>
                                                    <p className="text-sm font-semibold text-slate-700">{client.address.complement || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-slate-400">Bairro</p>
                                                    <p className="text-sm font-semibold text-slate-700">{client.address.neighborhood || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-slate-400">Cidade / UF</p>
                                                    <p className="text-sm font-semibold text-slate-700">{client.address.city} - {client.address.state}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-slate-400">CEP</p>
                                                    <p className="text-sm font-semibold text-slate-700">{client.address.zipCode}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">Endereço não cadastrado.</p>
                                        )}
                                    </section>

                                    <section className="space-y-6">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FileText className="w-3 h-3" /> Observações Internas
                                        </h3>
                                        <div className="bg-amber-50/50 rounded-xl p-6 border border-amber-100">
                                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                {client.notes || 'Sem observações adicionais para este cliente.'}
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
