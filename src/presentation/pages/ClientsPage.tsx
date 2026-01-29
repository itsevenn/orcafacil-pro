import React, { useEffect, useState } from 'react';
import { useClientStore } from '../stores/use-client-store';
import { Button } from '../components/ui/button';
import {
    Plus, Search, Filter, Phone, Mail, Building2, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Client } from '../../domain/models/client';
import { ClientFormDialog } from '../components/features/clients/ClientFormDialog';
import { ClientDetailsDialog } from '../components/features/clients/ClientDetailsDialog';
import { Badge } from '../components/ui/badge';

export const ClientsPage: React.FC = () => {
    const { clients, fetchClients, createClient, updateClient, deleteClient, isLoading } = useClientStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddClient = () => {
        setSelectedClient(null);
        setIsFormOpen(true);
    };

    const handleEditClient = (client: Client) => {
        setSelectedClient(client);
        setIsDetailsOpen(false); // Close details if open
        setIsFormOpen(true);
    };

    const handleViewDetails = (client: Client) => {
        setSelectedClient(client);
        setIsDetailsOpen(true);
    };

    const handleDeleteClient = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            await deleteClient(id);
            setIsDetailsOpen(false);
        }
    };

    const handleFormSubmit = async (data: any) => {
        if (selectedClient) {
            await updateClient(selectedClient.id, data);
        } else {
            await createClient(data);
        }
        setIsFormOpen(false);
        fetchClients(); // Refresh
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>Home</span>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-700">Clients</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Gestão de Clientes</h1>
                    <p className="text-slate-500 mt-1">Centralize as informações dos seus parceiros de negócio.</p>
                </div>
                <Button className="bg-[#0070d2] hover:bg-[#005fb2] text-white px-6 font-semibold shadow-sm" onClick={handleAddClient}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Cliente
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4 mt-8 bg-white p-1 rounded-lg">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        placeholder="Buscar por nome, empresa ou email..."
                        className="w-full pl-11 pr-4 py-3 bg-[#333333] text-white placeholder-slate-400 rounded-md text-sm border-none focus:ring-2 focus:ring-[#0070d2] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-[46px] px-6 text-slate-600 border-slate-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-[280px] rounded-2xl bg-slate-50 animate-pulse border border-slate-100" />
                    ))
                ) : (
                    <>
                        {filteredClients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => handleViewDetails(client)}
                                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all group relative flex flex-col justify-between h-fit min-h-[300px] cursor-pointer"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">
                                            {client.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[#0f172a] text-lg truncate leading-tight">
                                                {client.name}
                                            </h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {client.sector || 'NÃO DEFINIDO'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{client.company || 'Pessoa Física'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span>{client.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-50">
                                    <Badge variant={client.isActive ? 'emerald' : 'slate'}>
                                        {client.isActive ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(client);
                                        }}
                                        className="text-sm font-bold text-[#0070d2] hover:text-[#005fb2] flex items-center gap-1 group/btn transition-colors"
                                    >
                                        Ver Detalhes
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New Client Card */}
                        <div
                            onClick={handleAddClient}
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] gap-4 cursor-pointer hover:border-[#0070d2] hover:bg-blue-50/30 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#eef2ff] group-hover:text-[#0070d2] transition-colors">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-slate-400 group-hover:text-[#0070d2] transition-colors">
                                Adicionar Novo Cliente
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Dialogs */}
            <ClientFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                initialData={selectedClient}
            />

            <ClientDetailsDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                client={selectedClient}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
            />
        </div>
    );
};
