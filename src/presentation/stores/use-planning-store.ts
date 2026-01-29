import { create } from 'zustand';
import { Planning, PlanningTask } from '../../domain/models/planning';
import { v4 as uuidv4 } from 'uuid';

interface PlanningState {
    plannings: Planning[];
    isLoading: boolean;
    error: string | null;

    fetchPlannings: () => Promise<void>;
    createPlanning: (data: Omit<Planning, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updatePlanning: (id: string, data: Partial<Planning>) => Promise<void>;
    deletePlanning: (id: string) => Promise<void>;
}

// Mock initial data
const MOCK_PLANNINGS: Planning[] = [
    {
        id: '1',
        projectName: 'Edifício Residencial Horizonte',
        clientName: 'Tech Solutions Ltda',
        description: 'Planejamento completo da obra residencial',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        status: 'ACTIVE',
        totalBudget: 1032267.45,
        overallProgress: 35,
        tasks: [
            {
                id: '1',
                name: 'Fundações e estrutura',
                startDate: new Date('2024-02-01'),
                endDate: new Date('2024-04-15'),
                progress: 80
            },
            {
                id: '2',
                name: 'Alvenaria e vedações',
                startDate: new Date('2024-04-16'),
                endDate: new Date('2024-06-30'),
                progress: 25
            }
        ],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25')
    },
    {
        id: '2',
        projectName: 'Reforma Comercial Matriz',
        clientName: 'Empresa XYZ',
        description: 'Reforma e modernização do espaço comercial',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-05-15'),
        status: 'DRAFT',
        totalBudget: 485000.00,
        overallProgress: 0,
        tasks: [],
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
    }
];

const STORAGE_KEY = 'orcapro_plannings';

const loadFromStorage = (): Planning[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            return parsed.map((p: any) => ({
                ...p,
                startDate: new Date(p.startDate),
                endDate: new Date(p.endDate),
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt),
                tasks: p.tasks?.map((t: any) => ({
                    ...t,
                    startDate: new Date(t.startDate),
                    endDate: new Date(t.endDate)
                })) || []
            }));
        }
    } catch (error) {
        console.error('Error loading plannings from storage:', error);
    }
    return MOCK_PLANNINGS;
};

const saveToStorage = (plannings: Planning[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plannings));
    } catch (error) {
        console.error('Error saving plannings to storage:', error);
    }
};

export const usePlanningStore = create<PlanningState>((set, get) => ({
    plannings: loadFromStorage(),
    isLoading: false,
    error: null,

    fetchPlannings: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ isLoading: false });
    },

    createPlanning: async (data) => {
        const newPlanning: Planning = {
            ...data,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const updated = [newPlanning, ...get().plannings];
        set({ plannings: updated });
        saveToStorage(updated);
        return newPlanning.id;
    },

    updatePlanning: async (id, data) => {
        const updated = get().plannings.map(p =>
            p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
        );
        set({ plannings: updated });
        saveToStorage(updated);
    },

    deletePlanning: async (id) => {
        const updated = get().plannings.filter(p => p.id !== id);
        set({ plannings: updated });
        saveToStorage(updated);
    }
}));
