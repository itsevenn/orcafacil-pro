export type PurchaseStatus = 'PENDING' | 'QUOTING' | 'ORDERED' | 'RECEIVED' | 'CANCELED';

export interface PurchaseRequestItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    estimatedPrice?: number;
    status: PurchaseStatus;
}

export interface PurchaseRequest {
    id: string;
    budgetId: string;
    projectName: string;
    requester: string;
    date: Date;
    neededBy: Date;
    items: PurchaseRequestItem[];
    status: PurchaseStatus;
    notes?: string;
}

export interface PurchaseOrder extends PurchaseRequest {
    vendorId: string;
    vendorName: string;
    totalAmount: number;
    paymentTerms: string;
    deliveryDate?: Date;
}
