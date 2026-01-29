export type ClientType = 'PRIVATE' | 'PUBLIC' | 'GOVERNMENT';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    sector?: string;
    taxId?: string; // CPF/CNPJ
    clientType: ClientType;
    responsiblePerson?: string;
    website?: string;
    notes?: string;
    address?: {
        street: string;
        number: string;
        complement?: string;
        neighborhood?: string;
        city: string;
        state: string;
        zipCode: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateClientDTO = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClientDTO = Partial<CreateClientDTO>;
