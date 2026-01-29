export type InputType = 'MATERIAL' | 'EQUIPMENT' | 'LABOR' | 'SERVICE';

export interface Input {
    id: string;
    code: string;
    name: string;
    unit: string;
    price: number;
    type: InputType;
    source: 'SINAPI' | 'ORSE' | 'OWN'; // Source of the data
    category?: string;
    supplierId?: string;
    region?: string;
    updatedAt: Date;
}
