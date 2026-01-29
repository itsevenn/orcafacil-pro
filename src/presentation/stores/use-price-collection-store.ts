import { create } from 'zustand';
import { PriceCollection, PriceCollectionItem, PriceQuote } from '../../domain/models/price-collection';
import { v4 as uuidv4 } from 'uuid';

interface PriceCollectionState {
    collections: PriceCollection[];
    isLoading: boolean;
    error: string | null;

    fetchCollections: () => Promise<void>;
    createCollection: (description: string, inputs: any[]) => Promise<string>;
    updateCollection: (id: string, updates: Partial<PriceCollection>) => Promise<void>;
    deleteCollection: (id: string) => Promise<void>;
    addQuote: (collectionId: string, inputId: string, quote: PriceQuote) => Promise<void>;
    selectQuote: (collectionId: string, inputId: string, supplierId: string) => Promise<void>;
    closeCollection: (id: string) => Promise<void>;
}

// Mock initial data
const MOCK_COLLECTIONS: PriceCollection[] = [
    {
        id: '1',
        date: new Date('2024-01-20'),
        description: 'Coleta Mensal - Materiais de Alvenaria',
        status: 'OPEN',
        updatedAt: new Date('2024-01-20'),
        items: [
            {
                inputId: 'CIM-001',
                inputName: 'Cimento Portland CP-II-32 50kg',
                unit: 'KG',
                lastPrice: 0.85,
                quotes: [
                    { supplierId: 'S1', supplierName: 'Hidráulica Central', price: 0.82, isLowest: true },
                    { supplierId: 'S2', supplierName: 'Materiais Construforte', price: 0.88 }
                ]
            },
            {
                inputId: 'ARE-002',
                inputName: 'Areia Média Lavada',
                unit: 'M3',
                lastPrice: 95.00,
                quotes: [
                    { supplierId: 'S1', supplierName: 'Hidráulica Central', price: 92.00, isLowest: true },
                    { supplierId: 'S2', supplierName: 'Materiais Construforte', price: 98.00 }
                ]
            }
        ]
    }
];

export const usePriceCollectionStore = create<PriceCollectionState>((set, get) => ({
    collections: MOCK_COLLECTIONS,
    isLoading: false,
    error: null,

    fetchCollections: async () => {
        set({ isLoading: true });
        // Simulate fetch
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ isLoading: false });
    },

    createCollection: async (description, inputs) => {
        const newCol: PriceCollection = {
            id: uuidv4(),
            date: new Date(),
            description,
            status: 'OPEN',
            updatedAt: new Date(),
            items: inputs.map(i => ({
                inputId: i.id,
                inputName: i.name,
                unit: i.unit,
                lastPrice: i.price,
                quotes: []
            }))
        };
        set(state => ({ collections: [newCol, ...state.collections] }));
        return newCol.id;
    },

    updateCollection: async (id, updates) => {
        set(state => ({
            collections: state.collections.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c)
        }));
    },

    deleteCollection: async (id) => {
        set(state => ({
            collections: state.collections.filter(c => c.id !== id)
        }));
    },

    addQuote: async (collectionId, inputId, quote) => {
        set(state => ({
            collections: state.collections.map(c => {
                if (c.id !== collectionId) return c;

                const updatedItems = c.items.map(item => {
                    if (item.inputId !== inputId) return item;

                    const newQuotes = [...item.quotes.filter(q => q.supplierId !== quote.supplierId), quote];

                    // Recalculate lowest price
                    const minPrice = Math.min(...newQuotes.map(q => q.price));
                    const finalQuotes = newQuotes.map(q => ({
                        ...q,
                        isLowest: q.price === minPrice
                    }));

                    return { ...item, quotes: finalQuotes };
                });

                return { ...c, items: updatedItems, updatedAt: new Date() };
            })
        }));
    },

    selectQuote: async (collectionId, inputId, supplierId) => {
        set(state => ({
            collections: state.collections.map(c => {
                if (c.id !== collectionId) return c;

                const updatedItems = c.items.map(item => {
                    if (item.inputId !== inputId) return item;

                    return {
                        ...item,
                        quotes: item.quotes.map(q => ({
                            ...q,
                            isSelected: q.supplierId === supplierId
                        }))
                    };
                });

                return { ...c, items: updatedItems, updatedAt: new Date() };
            })
        }));
    },

    closeCollection: async (id) => {
        set(state => ({
            collections: state.collections.map(c => c.id === id ? { ...c, status: 'CLOSED', updatedAt: new Date() } : c)
        }));
    }
}));
