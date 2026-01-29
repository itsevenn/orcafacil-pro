export interface MeasurementItem {
    id: string;
    serviceCode: string;
    serviceName: string;
    unit: string;
    previousQuantity: number;
    currentQuantity: number;
    unitPrice: number;
    totalValue: number;
}

export interface Measurement {
    id: string;
    projectName: string;
    clientName: string;
    measurementNumber: number;
    referenceDate: Date;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID';
    items: MeasurementItem[];
    subtotal: number;
    retentionPercentage: number;
    retentionAmount: number;
    netValue: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
