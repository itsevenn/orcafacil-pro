import { Client, CreateClientDTO, UpdateClientDTO } from '../models/client';

export interface IClientRepository {
    create(client: CreateClientDTO): Promise<Client>;
    findById(id: string): Promise<Client | null>;
    findAll(): Promise<Client[]>;
    update(id: string, data: UpdateClientDTO): Promise<Client>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Client[]>;
}
