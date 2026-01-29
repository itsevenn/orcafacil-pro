import { create } from 'zustand';
import { Client, CreateClientDTO, UpdateClientDTO } from '../../domain/models/client';
import { DI } from '../../application/container';

interface ClientState {
    clients: Client[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchClients: () => Promise<void>;
    createClient: (data: CreateClientDTO) => Promise<void>;
    updateClient: (id: string, data: UpdateClientDTO) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    searchClients: (query: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
    clients: [],
    isLoading: false,
    error: null,

    fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
            const clients = await DI.clientRepository.findAll();
            set({ clients, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch clients', isLoading: false });
        }
    },

    createClient: async (data: CreateClientDTO) => {
        set({ isLoading: true, error: null });
        try {
            const newClient = await DI.clientRepository.create(data);
            set((state) => ({
                clients: [...state.clients, newClient],
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to create client', isLoading: false });
        }
    },

    updateClient: async (id: string, data: UpdateClientDTO) => {
        set({ isLoading: true, error: null });
        try {
            const updatedClient = await DI.clientRepository.update(id, data);
            set((state) => ({
                clients: state.clients.map((c) => (c.id === id ? updatedClient : c)),
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to update client', isLoading: false });
        }
    },

    deleteClient: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await DI.clientRepository.delete(id);
            set((state) => ({
                clients: state.clients.filter((c) => c.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to delete client', isLoading: false });
        }
    },

    searchClients: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
            const clients = await DI.clientRepository.search(query);
            set({ clients, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to search clients', isLoading: false });
        }
    }
}));
