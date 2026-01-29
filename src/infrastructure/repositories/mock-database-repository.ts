import { IInputRepository } from '../../application/repositories/input-repository';
import { ICompositionRepository } from '../../application/repositories/composition-repository';
import { Input } from '../../domain/models/input';
import { Composition } from '../../domain/models/composition';

const STORAGE_KEY_INPUTS = 'orcapro_inputs';
const STORAGE_KEY_COMPOSITIONS = 'orcapro_compositions';

export class MockInputRepository implements IInputRepository {
    private getInputs(): Input[] {
        const stored = localStorage.getItem(STORAGE_KEY_INPUTS);
        if (stored) return JSON.parse(stored);

        const initialInputs: Input[] = [
            {
                id: 'i1',
                code: 'CIM-001',
                name: 'Cimento Portland CP-II-32 50kg',
                unit: 'KG',
                price: 0.85,
                type: 'MATERIAL',
                source: 'OWN',
                category: 'CIMENTOS',
                updatedAt: new Date()
            },
            {
                id: 'i2',
                code: 'ARE-002',
                name: 'Areia Média Lavada',
                unit: 'M3',
                price: 95.00,
                type: 'MATERIAL',
                source: 'OWN',
                category: 'AGREGADOS',
                updatedAt: new Date()
            },
            {
                id: 'i3',
                code: 'PED-003',
                name: 'Pedra Britada nº 1',
                unit: 'M3',
                price: 110.00,
                type: 'MATERIAL',
                source: 'OWN',
                category: 'AGREGADOS',
                updatedAt: new Date()
            }
        ];
        this.saveInputs(initialInputs);
        return initialInputs;
    }

    private saveInputs(inputs: Input[]): void {
        localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(inputs));
    }

    async getAll(): Promise<Input[]> {
        return this.getInputs();
    }

    async getById(id: string): Promise<Input | undefined> {
        return this.getInputs().find(i => i.id === id);
    }

    async create(input: Input): Promise<void> {
        const inputs = this.getInputs();
        inputs.push(input);
        this.saveInputs(inputs);
    }

    async createMany(newInputs: Input[]): Promise<void> {
        const inputs = this.getInputs();
        inputs.push(...newInputs);
        this.saveInputs(inputs);
    }

    async update(id: string, input: Input): Promise<void> {
        const inputs = this.getInputs();
        const index = inputs.findIndex(i => i.id === id);
        if (index !== -1) {
            inputs[index] = input;
            this.saveInputs(inputs);
        }
    }

    async delete(id: string): Promise<void> {
        const inputs = this.getInputs();
        this.saveInputs(inputs.filter(i => i.id !== id));
    }

    async search(query: string): Promise<Input[]> {
        const lowerQuery = query.toLowerCase();
        return this.getInputs().filter(i =>
            i.name.toLowerCase().includes(lowerQuery) ||
            i.code.toLowerCase().includes(lowerQuery)
        );
    }
}

export class MockCompositionRepository implements ICompositionRepository {
    private getCompositions(): Composition[] {
        const stored = localStorage.getItem(STORAGE_KEY_COMPOSITIONS);
        if (stored) return JSON.parse(stored);

        // Seed with example data if empty
        const initialData: Composition[] = [
            {
                id: '1',
                code: '87301',
                name: 'ARGAMASSA TRAÇO 1:1:6 (EM VOLUME DE CIMENTO, CAL E AREIA MÉDIA ÚMIDA). AF_06/2014',
                unit: 'M3',
                laborCost: 120.00,
                materialCost: 420.23,
                equipmentCost: 0,
                totalCost: 540.23,
                socialCharges: 85.00,
                bdi: 25.00,
                totalWithBDI: 675.29,
                type: 'COMPOSITION',
                items: [],
                updatedAt: new Date('2023-10-01'),
                source: 'SINAPI',
                category: 'ARGAMASSAS',
                referenceRegion: 'SP',
                referenceDate: new Date('2023-10-01')
            },
            {
                id: '5',
                code: 'PRP-001',
                name: 'Composição de Exemplo Própria - Piso Vinílico de Alta Resistência',
                unit: 'M2',
                laborCost: 15.00,
                materialCost: 85.00,
                equipmentCost: 0,
                totalCost: 100.00,
                socialCharges: 85.00,
                bdi: 20.00,
                totalWithBDI: 120.00,
                type: 'COMPOSITION',
                items: [],
                updatedAt: new Date(),
                source: 'OWN',
                category: 'REVESTIMENTOS',
                referenceRegion: 'PR',
                referenceDate: new Date()
            }
        ];
        this.saveCompositions(initialData);
        return initialData;
    }

    private saveCompositions(compositions: Composition[]): void {
        localStorage.setItem(STORAGE_KEY_COMPOSITIONS, JSON.stringify(compositions));
    }

    async getAll(): Promise<Composition[]> {
        return this.getCompositions();
    }

    async getById(id: string): Promise<Composition | undefined> {
        return this.getCompositions().find(c => c.id === id);
    }

    async create(composition: Composition): Promise<void> {
        const list = this.getCompositions();
        list.push(composition);
        this.saveCompositions(list);
    }

    async update(id: string, composition: Composition): Promise<void> {
        const list = this.getCompositions();
        const index = list.findIndex(c => c.id === id);
        if (index !== -1) {
            list[index] = composition;
            this.saveCompositions(list);
        }
    }

    async delete(id: string): Promise<void> {
        const list = this.getCompositions();
        this.saveCompositions(list.filter(c => c.id !== id));
    }

    async search(query: string): Promise<Composition[]> {
        const lowerQuery = query.toLowerCase();
        return this.getCompositions().filter(c =>
            c.name.toLowerCase().includes(lowerQuery) ||
            c.code.toLowerCase().includes(lowerQuery)
        );
    }
}
