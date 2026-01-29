import { IClientRepository } from '../../domain/repositories/client-repository';
import { Client, CreateClientDTO, UpdateClientDTO } from '../../domain/models/client';

const STORAGE_KEY = 'orcapro_clients';

export class MockClientRepository implements IClientRepository {
    private clients: Client[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            this.clients = JSON.parse(data, (key, value) => {
                if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
                return value;
            });
        } else {
            // Initial mock data ONLY if storage is empty
            this.clients = [
                {
                    id: '1',
                    name: 'Roberto Silva',
                    sector: 'TECNOLOGIA',
                    company: 'Tech Solutions Ltda',
                    email: 'roberto@techsolutions.com',
                    phone: '(11) 99999-1234',
                    clientType: 'PRIVATE',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '2',
                    name: 'Amanda Costa',
                    sector: 'CONSTRUÇÃO',
                    company: 'Construtora Horizonte',
                    email: 'amanda@construtora.com',
                    phone: '(21) 98888-5678',
                    clientType: 'PRIVATE',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '3',
                    name: 'Prefeitura de Belo Horizonte',
                    sector: 'SETOR PÚBLICO',
                    company: 'PBH',
                    email: 'contato@pbh.gov.br',
                    phone: '(31) 3333-4444',
                    clientType: 'GOVERNMENT',
                    responsiblePerson: 'Carlos Oliveira',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            this.saveToStorage();
        }
    }

    private saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.clients));
    }

    async create(data: CreateClientDTO): Promise<Client> {
        const newClient: Client = {
            ...data,
            id: crypto.randomUUID(),
            isActive: data.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.clients.push(newClient);
        this.saveToStorage();
        return newClient;
    }

    async findById(id: string): Promise<Client | null> {
        return this.clients.find(c => c.id === id) || null;
    }

    async findAll(): Promise<Client[]> {
        return [...this.clients];
    }

    async update(id: string, data: UpdateClientDTO): Promise<Client> {
        const index = this.clients.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Client not found');

        const updatedClient = {
            ...this.clients[index],
            ...data,
            updatedAt: new Date(),
        };

        this.clients[index] = updatedClient;
        this.saveToStorage();
        return updatedClient;
    }

    async delete(id: string): Promise<void> {
        this.clients = this.clients.filter(c => c.id !== id);
        this.saveToStorage();
    }

    async search(query: string): Promise<Client[]> {
        const lowerQuery = query.toLowerCase();
        return this.clients.filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.email.toLowerCase().includes(lowerQuery) ||
            c.company?.toLowerCase().includes(lowerQuery)
        );
    }
}
