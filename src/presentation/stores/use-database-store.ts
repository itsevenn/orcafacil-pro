import { create } from 'zustand';
import { Input } from '../../domain/models/input';
import { Composition } from '../../domain/models/composition';
import { IInputRepository } from '../../application/repositories/input-repository';
import { ICompositionRepository } from '../../application/repositories/composition-repository';
import { MockInputRepository, MockCompositionRepository } from '../../infrastructure/repositories/mock-database-repository';
import { InputFormData, CompositionFormData } from '../../domain/validation/database-schema';
import { v4 as uuidv4 } from 'uuid';

// Ideally, we'd inject these via Context or Container, but direct instantiation for simplicity in this phase
const inputRepo = new MockInputRepository();
const compositionRepo = new MockCompositionRepository();

interface DatabaseState {
    inputs: Input[];
    compositions: Composition[];
    isLoading: boolean;
    error: string | null;

    fetchInputs: () => Promise<void>;
    createInput: (data: InputFormData) => Promise<void>;
    importInputs: (dataList: InputFormData[]) => Promise<void>;
    updateInput: (id: string, data: InputFormData) => Promise<void>;
    deleteInput: (id: string) => Promise<void>;
    createManyInputs: (dataList: any[]) => Promise<void>;

    fetchCompositions: () => Promise<void>;
    createComposition: (data: CompositionFormData) => Promise<void>;
    updateComposition: (id: string, data: CompositionFormData) => Promise<void>;
    deleteComposition: (id: string) => Promise<void>;

    syncOfficialBase: (source: string) => Promise<void>;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
    inputs: [],
    compositions: [],
    isLoading: false,
    error: null,

    syncOfficialBase: async (source: string) => {
        set({ isLoading: true });
        // Simulate network delay for sync
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock: Update some prices or just refresh
        const { inputs } = get();
        const updated = inputs.map(i => i.source === source ? { ...i, updatedAt: new Date() } : i);

        set({ inputs: updated as any, isLoading: false });
    },

    fetchInputs: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await inputRepo.getAll();
            set({ inputs: data });
        } catch (e) {
            set({ error: "Failed to fetch inputs" });
        } finally {
            set({ isLoading: false });
        }
    },

    createInput: async (data) => {
        set({ isLoading: true });
        try {
            const newItem: Input = {
                id: uuidv4(),
                ...data,
                updatedAt: new Date()
            };
            await inputRepo.create(newItem);
            await get().fetchInputs(); // Refresh list
        } catch (e) {
            set({ error: "Failed to create input" });
        } finally {
            set({ isLoading: false });
        }
    },

    importInputs: async (dataList: InputFormData[]) => {
        set({ isLoading: true });
        try {
            const newItems: Input[] = dataList.map(data => ({
                id: uuidv4(),
                ...data,
                updatedAt: new Date()
            }));

            if (inputRepo.createMany) {
                await inputRepo.createMany(newItems);
            } else {
                // Fallback
                for (const item of newItems) {
                    await inputRepo.create(item);
                }
            }
            await get().fetchInputs();
        } catch (e) {
            set({ error: "Failed to import inputs" });
            console.error(e);
        } finally {
            set({ isLoading: false });
        }
    },

    updateInput: async (id, data) => {
        set({ isLoading: true });
        try {
            // Needed to fetch existing to keep ID and audit fields if any
            const existing = await inputRepo.getById(id);
            if (!existing) throw new Error("Input not found");

            const updated: Input = {
                ...existing,
                ...data,
                updatedAt: new Date()
            };
            await inputRepo.update(id, updated);
            await get().fetchInputs();
        } catch (e) {
            set({ error: "Failed to update input" });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteInput: async (id) => {
        set({ isLoading: true });
        try {
            await inputRepo.delete(id);
            await get().fetchInputs();
        } catch (e) {
            set({ error: "Failed to delete input" });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchCompositions: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await compositionRepo.getAll();
            set({ compositions: data });
        } catch (e) {
            set({ error: "Failed to fetch compositions" });
        } finally {
            set({ isLoading: false });
        }
    },

    createComposition: async (data: CompositionFormData) => {
        set({ isLoading: true });
        try {
            const { inputs } = get();
            let totalCost = 0;
            let totalLabor = 0;
            let totalMaterial = 0;
            let totalEquipment = 0;

            const itemsWithDetails = data.items.map(item => {
                const refInput = inputs.find(i => i.id === item.itemId);
                const price = refInput?.price || 0;
                const cost = price * item.quantity;
                totalCost += cost;

                if (refInput?.type === 'LABOR') totalLabor += cost;
                else if (refInput?.type === 'EQUIPMENT') totalEquipment += cost;
                else totalMaterial += cost;

                return {
                    ...item,
                    id: uuidv4(),
                    type: 'INPUT' as const,
                    name: refInput?.name || 'Unknown',
                    unit: refInput?.unit || 'UN',
                    price: price,
                    quantity: item.quantity
                };
            });

            const socialChargesPercent = data.socialCharges ?? 85;
            const bdiPercent = data.bdi ?? 25;
            const laborWithSocial = totalLabor * (1 + socialChargesPercent / 100);
            const directCost = totalMaterial + totalEquipment + laborWithSocial;
            const totalWithBDI = directCost * (1 + bdiPercent / 100);

            const newComp: Composition = {
                id: uuidv4(),
                code: data.code,
                name: data.name,
                unit: data.unit,
                items: itemsWithDetails,
                laborCost: totalLabor,
                materialCost: totalMaterial,
                equipmentCost: totalEquipment,
                totalCost: directCost,
                socialCharges: socialChargesPercent,
                bdi: bdiPercent,
                totalWithBDI: totalWithBDI,
                updatedAt: new Date(),
                source: 'OWN',
                category: 'DIVERSOS',
                type: 'COMPOSITION',
                referenceRegion: 'BR',
                referenceDate: new Date()
            };

            await compositionRepo.create(newComp);
            await get().fetchCompositions();
        } catch (e) {
            set({ error: "Failed to create composition" });
        } finally {
            set({ isLoading: false });
        }
    },

    updateComposition: async (id: string, data: CompositionFormData) => {
        set({ isLoading: true });
        try {
            const { inputs } = get();
            let totalLabor = 0;
            let totalMaterial = 0;
            let totalEquipment = 0;

            const itemsWithDetails = data.items.map(item => {
                const refInput = inputs.find(i => i.id === item.itemId);
                const price = refInput?.price || 0;
                const cost = price * item.quantity;

                if (refInput?.type === 'LABOR') totalLabor += cost;
                else if (refInput?.type === 'EQUIPMENT') totalEquipment += cost;
                else totalMaterial += cost;

                return {
                    ...item,
                    id: uuidv4(),
                    type: 'INPUT' as const,
                    name: refInput?.name || 'Unknown',
                    unit: refInput?.unit || 'UN',
                    price: price,
                    quantity: item.quantity
                };
            });

            const socialChargesPercent = data.socialCharges ?? 85;
            const bdiPercent = data.bdi ?? 25;
            const laborWithSocial = totalLabor * (1 + socialChargesPercent / 100);
            const directCost = totalMaterial + totalEquipment + laborWithSocial;
            const totalWithBDI = directCost * (1 + bdiPercent / 100);

            const updatedComp: Composition = {
                id: id,
                code: data.code,
                name: data.name,
                unit: data.unit,
                items: itemsWithDetails,
                laborCost: totalLabor,
                materialCost: totalMaterial,
                equipmentCost: totalEquipment,
                totalCost: directCost,
                socialCharges: socialChargesPercent,
                bdi: bdiPercent,
                totalWithBDI: totalWithBDI,
                type: 'COMPOSITION',
                updatedAt: new Date()
            };

            await compositionRepo.update(id, updatedComp);
            await get().fetchCompositions();
        } catch (e) {
            set({ error: "Failed to update composition" });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteComposition: async (id: string) => {
        set({ isLoading: true });
        try {
            await compositionRepo.delete(id);
            await get().fetchCompositions();
        } catch (e) {
            set({ error: "Failed to delete composition" });
        } finally {
            set({ isLoading: false });
        }
    },

    // Alias for component expectations or batch operations
    createManyInputs: async (dataList: any[]) => {
        // Simple internal map to InputFormData if needed, but assuming data is already shaped
        await get().importInputs(dataList);
    }
}));
