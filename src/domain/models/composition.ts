import { Input } from './input';

export interface CompositionItem {
    id: string;
    type: 'INPUT' | 'COMPOSITION';
    itemId: string; // ID of the Input or another Composition
    name: string; // Denormalized for display
    unit: string;
    price: number; // Snapshot price at inclusion
    quantity: number;
}

export interface Composition {
    id: string;
    code: string;
    name: string;
    unit: string;
    laborCost: number; // Mão de obra price calculated
    materialCost: number; // Material price calculated
    equipmentCost: number; // Equipment price calculated
    totalCost: number; // Sum of all
    items: CompositionItem[];

    // Detailed Cost Analysis
    socialCharges: number; // Percent e.g. 80.0
    bdi: number; // Percent e.g. 25.0
    totalWithBDI: number; // Final price

    type: 'COMPOSITION' | 'SERVICE';
    updatedAt: Date;

    // Visual Metadata for Catalog
    source?: 'SINAPI' | 'ORSE' | 'SBC' | 'PROPRIA' | 'OWN';
    category?: string; // e.g. "REVESTIMENTOS", "ALVENARIA"
    referenceRegion?: string; // e.g. "SP", "SE"
    referenceDate?: Date; // e.g. 10/2023
}
