import { Composition } from './composition';

export interface Service {
    id: string;
    code: string;
    name: string;
    unit: string;
    compositions: {
        compositionId: string;
        composition?: Composition; // Hydrated
        quantity: number;
    }[];
    totalCost: number;
    price: number; // Final suggested price
    updatedAt: Date;
}
