export interface PriceQuote {
    supplierId: string;
    supplierName: string; // Denormalized for easy display
    price: number;
    isLowest?: boolean;
    isSelected?: boolean;
    notes?: string;
}

export interface PriceCollectionItem {
    inputId: string;
    inputName: string;
    unit: string;
    quotes: PriceQuote[];
    lastPrice: number; // For comparison
}

export interface PriceCollection {
    id: string;
    date: Date;
    description: string;
    status: 'OPEN' | 'CLOSED' | 'EXPIRED';
    items: PriceCollectionItem[];
    updatedAt: Date;
}
