import { Composition } from '../../domain/models/composition';

export interface ICompositionRepository {
    getAll(): Promise<Composition[]>;
    getById(id: string): Promise<Composition | undefined>;
    create(composition: Composition): Promise<void>;
    update(id: string, composition: Composition): Promise<void>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Composition[]>;
}
