export interface Supplier {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    category: string;
    address: string;
    rating: number;
    isActive: boolean;
}

export interface Collaborator {
    id: string;
    name: string;
    cpf: string;
    role: string;
    salary: number;
    hiringDate: Date;
    phone: string;
    status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}
