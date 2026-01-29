import { Client } from './client';

export enum BudgetStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELED = 'CANCELED'
}

export interface BudgetItem {
    id: string;
    productId?: string; // Optional if ad-hoc item
    name: string;
    description?: string;
    stage?: string; // e.g. "1.0 Infraestrutura"
    quantity: number;
    unitPrice: number;
    discount: number; // Percentage 0-100
    taxRate: number; // Percentage 0-100
}

export interface SchedulePeriod {
    id: string;
    name: string;
    date: Date;
}

export interface ScheduleAllocation {
    // We allocate by Stage for the Physical-Financial Schedule
    stage: string;
    periodId: string;
    percentage: number; // 0-100
}

export interface MeasurementItem {
    itemId: string;
    quantity: number; // Quantity executed in this measurement
}

export interface Measurement {
    id: string;
    name: string; // e.g. "1ª Medição"
    date: Date;
    items: MeasurementItem[];
    notes?: string;
}

export interface Budget {
    id: string;
    clientId: string;
    client?: Client; // Hydrated reference
    items: BudgetItem[];

    // Schedule Data
    schedulePeriods?: SchedulePeriod[];
    scheduleAllocations?: ScheduleAllocation[];
    baselineAllocations?: ScheduleAllocation[];

    // Measurement Data
    measurements?: Measurement[];

    status: BudgetStatus;
    validUntil: Date;
    notes?: string;
    bdi: number; // Percentage

    // Computed (handled by domain service or getter, but stored for ease if needed)
    subtotal: number; // Sum of items (Quantity * UnitPrice)
    totalDirect: number; // Sum of items cost (without BDI - if items are direct cost)
    totalDiscount: number;
    totalTax: number;
    total: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface BudgetTemplate {
    id: string;
    name: string;
    description?: string;
    category?: string;
    items: BudgetItem[];
    notes?: string;
    bdi: number;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateBudgetDTO = Pick<Budget, 'clientId' | 'items' | 'validUntil' | 'notes' | 'bdi'>;
export type CreateTemplateDTO = Pick<BudgetTemplate, 'name' | 'description' | 'category' | 'items' | 'notes' | 'bdi'>;
