import React, { useState } from 'react';
import { Mail, Phone, Building, MoreVertical, Search, Filter, Plus, X, User, MapPin } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { Client } from '../types';

const ClientManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({});

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.company) {
        const client: Client = {
            id: Date.now().toString(),
            name: newClient.name,
            company: newClient.company,
            email: newClient.email || '',
            phone: newClient.phone || '',
            segment: newClient.segment || 'Geral',
            status: 'Active'
        };
        setClients([...clients, client]);
        setIsModalOpen(false);
        setNewClient({});
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative h-full flex flex-col">
        <div className="flex justify-between items-center shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestão de Clientes</h1>
                <p className="text-slate-500">Centralize as informações dos seus parceiros de negócio.</p>
            </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0070d2] hover:bg-[#005fb2] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-all hover:shadow-md"
            >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Cliente
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50/50 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Buscar por nome, empresa ou email..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070d2] transition-shadow"/>
                </div>
                <button className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-white hover:border-[#0070d2] hover:text-[#0070d2] flex items-center transition-colors bg-white">
                    <Filter className="w-4 h-4 mr-2" /> Filtros
                </button>
            </div>
            
            <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {clients.map(client => (
                        <div key={client.id} className="border border-slate-200 rounded-xl p-5 hover:border-[#0070d2] hover:shadow-md transition-all group relative bg-white flex flex-col animate-fade-in-up">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-slate-400 hover:text-[#0070d2] p-1 rounded hover:bg-slate-100"><MoreVertical className="w-5 h-5"/></button>
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-5">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-[#0070d2] flex items-center justify-center font-bold text-lg shadow-inner">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 leading-tight">{client.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1 bg-slate-100 px-2 py-0.5 rounded-full w-fit">{client.segment}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 text-sm text-slate-600 flex-1">
                                <div className="flex items-center p-2 rounded hover:bg-slate-50 transition-colors">
                                    <Building className="w-4 h-4 mr-3 text-slate-400" />
                                    <span className="font-medium">{client.company}</span>
                                </div>
                                <div className="flex items-center p-2 rounded hover:bg-slate-50 transition-colors">
                                    <Mail className="w-4 h-4 mr-3 text-slate-400" />
                                    <span className="truncate">{client.email}</span>
                                </div>
                                <div className="flex items-center p-2 rounded hover:bg-slate-50 transition-colors">
                                    <Phone className="w-4 h-4 mr-3 text-slate-400" />
                                    <span>{client.phone}</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    {client.status === 'Active' ? 'Ativo' : 'Inativo'}
                                </span>
                                <button className="text-xs font-bold text-[#0070d2] hover:text-[#005fb2] hover:underline">Ver Detalhes</button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Card Placeholder */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:text-[#0070d2] hover:border-[#0070d2] hover:bg-blue-50/50 transition-all min-h-[200px] group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
                             <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium">Adicionar Novo Cliente</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                    <div className="bg-[#0070d2] px-6 py-4 flex justify-between items-center text-white">
                        <h2 className="text-lg font-bold flex items-center">
                            <User className="w-5 h-5 mr-2" /> Novo Cliente
                        </h2>
                        <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 rounded p-1 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddClient} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Contato</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0070d2] outline-none transition-shadow"
                                    placeholder="Ex: Roberto Silva"
                                    value={newClient.name || ''}
                                    onChange={e => setNewClient({...newClient, name: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Empresa / Razão Social</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0070d2] outline-none transition-shadow"
                                    placeholder="Ex: Construtora Horizonte"
                                    value={newClient.company || ''}
                                    onChange={e => setNewClient({...newClient, company: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0070d2] outline-none transition-shadow"
                                    placeholder="contato@empresa.com"
                                    value={newClient.email || ''}
                                    onChange={e => setNewClient({...newClient, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                                <input 
                                    type="tel" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0070d2] outline-none transition-shadow"
                                    placeholder="(00) 00000-0000"
                                    value={newClient.phone || ''}
                                    onChange={e => setNewClient({...newClient, phone: e.target.value})}
                                />
                            </div>
                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Segmento</label>
                                <select 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0070d2] outline-none transition-shadow bg-white"
                                    value={newClient.segment || ''}
                                    onChange={e => setNewClient({...newClient, segment: e.target.value})}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Construção Civil">Construção Civil</option>
                                    <option value="Arquitetura">Arquitetura</option>
                                    <option value="Varejo">Varejo</option>
                                    <option value="Tecnologia">Tecnologia</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-4">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="px-6 py-2 bg-[#0070d2] hover:bg-[#005fb2] text-white font-medium rounded-lg shadow-sm transition-all"
                            >
                                Salvar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default ClientManager;