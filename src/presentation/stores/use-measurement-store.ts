import { create } from 'zustand';
import { Measurement, MeasurementItem } from '../../domain/models/measurement';
import { v4 as uuidv4 } from 'uuid';

interface MeasurementState {
    measurements: Measurement[];
    isLoading: boolean;
    error: string | null;

    fetchMeasurements: () => Promise<void>;
    createMeasurement: (data: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateMeasurement: (id: string, data: Partial<Measurement>) => Promise<void>;
    deleteMeasurement: (id: string) => Promise<void>;
}

// Mock initial data
const MOCK_MEASUREMENTS: Measurement[] = [
    {
        id: '1',
        projectName: 'Edifício Residencial Horizonte',
        clientName: 'Tech Solutions Ltda',
        measurementNumber: 1,
        referenceDate: new Date('2024-01-15'),
        status: 'APPROVED',
        items: [
            {
                id: '1',
                serviceCode: '87301',
                serviceName: 'Alvenaria de vedação',
                unit: 'M2',
                previousQuantity: 0,
                currentQuantity: 120.5,
                unitPrice: 85.00,
                totalValue: 10242.50
            }
        ],
        subtotal: 10242.50,
        retentionPercentage: 5,
        retentionAmount: 512.13,
        netValue: 9730.37,
        notes: 'Primeira medição - Etapa de alvenaria',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: '2',
        projectName: 'Reforma Comercial Matriz',
        clientName: 'Empresa XYZ',
        measurementNumber: 2,
        referenceDate: new Date('2024-01-20'),
        status: 'SUBMITTED',
        items: [],
        subtotal: 5480.00,
        retentionPercentage: 0,
        retentionAmount: 0,
        netValue: 5480.00,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20')
    }
];

const STORAGE_KEY = 'orcapro_measurements';

const loadFromStorage = (): Measurement[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            return parsed.map((m: any) => ({
                ...m,
                referenceDate: new Date(m.referenceDate),
                createdAt: new Date(m.createdAt),
                updatedAt: new Date(m.updatedAt)
            }));
        }
    } catch (error) {
        console.error('Error loading measurements from storage:', error);
    }
    return MOCK_MEASUREMENTS;
};

const saveToStorage = (measurements: Measurement[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    } catch (error) {
        console.error('Error saving measurements to storage:', error);
    }
};

export const useMeasurementStore = create<MeasurementState>((set, get) => ({
    measurements: loadFromStorage(),
    isLoading: false,
    error: null,

    fetchMeasurements: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ isLoading: false });
    },

    createMeasurement: async (data) => {
        const newMeasurement: Measurement = {
            ...data,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const updated = [newMeasurement, ...get().measurements];
        set({ measurements: updated });
        saveToStorage(updated);
        return newMeasurement.id;
    },

    updateMeasurement: async (id, data) => {
        const updated = get().measurements.map(m =>
            m.id === id ? { ...m, ...data, updatedAt: new Date() } : m
        );
        set({ measurements: updated });
        saveToStorage(updated);
    },

    deleteMeasurement: async (id) => {
        const updated = get().measurements.filter(m => m.id !== id);
        set({ measurements: updated });
        saveToStorage(updated);
    }
}));
