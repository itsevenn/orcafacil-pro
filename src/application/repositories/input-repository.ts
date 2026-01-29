import { Input } from '../../domain/models/input';

export interface IInputRepository {
    getAll(): Promise<Input[]>;
    getById(id: string): Promise<Input | undefined>;
    create(input: Input): Promise<void>;
    createMany?(inputs: Input[]): Promise<void>; // Optional for backward compatibility, but we will implement it
    update(id: string, input: Input): Promise<void>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Input[]>;
}
