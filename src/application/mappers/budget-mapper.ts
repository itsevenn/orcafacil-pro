import { Budget as DomainBudget, BudgetStatus as DomainBudgetStatus, BudgetItem as DomainItem } from '../../domain/models/budget';
import { Budget as LegacyBudget, BudgetStatus as LegacyBudgetStatus, BudgetItem as LegacyItem } from '../../../types';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is available or use simpler generator

// Helper to map status
export const mapStatusToDomain = (status: LegacyBudgetStatus): DomainBudgetStatus => {
    switch (status) {
        case LegacyBudgetStatus.DRAFT: return DomainBudgetStatus.DRAFT;
        case LegacyBudgetStatus.SENT: return DomainBudgetStatus.SENT;
        case LegacyBudgetStatus.APPROVED: return DomainBudgetStatus.APPROVED; // Both might match if strings align, but safe custom mapping
        case LegacyBudgetStatus.REJECTED: return DomainBudgetStatus.REJECTED;
        case LegacyBudgetStatus.NEGOTIATION: return DomainBudgetStatus.SENT; // approximate
        case LegacyBudgetStatus.CONVERTED: return DomainBudgetStatus.APPROVED;
        default: return DomainBudgetStatus.DRAFT;
    }
};

export const mapStatusToLegacy = (status: DomainBudgetStatus): LegacyBudgetStatus => {
    switch (status) {
        case DomainBudgetStatus.DRAFT: return LegacyBudgetStatus.DRAFT;
        case DomainBudgetStatus.SENT: return LegacyBudgetStatus.SENT;
        case DomainBudgetStatus.APPROVED: return LegacyBudgetStatus.APPROVED;
        case DomainBudgetStatus.REJECTED: return LegacyBudgetStatus.REJECTED;
        case DomainBudgetStatus.CANCELED: return LegacyBudgetStatus.REJECTED; // approximate
        default: return LegacyBudgetStatus.DRAFT;
    }
};

export const mapLegacyToDomain = (legacy: LegacyBudget): DomainBudget => {
    // legacy.items -> domain.items
    const items: DomainItem[] = legacy.items.map(item => ({
        id: item.id || uuidv4(), // ensure ID
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        taxRate: item.tax || 0, // approximation
    }));

    return {
        id: legacy.id,
        clientId: legacy.clientId,
        client: { id: legacy.clientId, name: legacy.clientName, email: '', phone: '', isActive: true, createdAt: new Date(), updatedAt: new Date() }, // Partial hydration
        items: items,
        status: mapStatusToDomain(legacy.status),
        validUntil: new Date(legacy.expiryDate),
        notes: legacy.notes,
        subtotal: legacy.subtotal,
        totalDiscount: legacy.totalDiscount,
        totalTax: legacy.totalTax,
        total: legacy.grandTotal,
        createdAt: new Date(legacy.date),
        updatedAt: new Date()
    };
};

export const mapDomainToLegacy = (domain: DomainBudget): LegacyBudget => {
    const items: LegacyItem[] = domain.items.map(item => ({
        id: item.id,
        productId: item.productId || 'unknown',
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: item.taxRate,
        total: (item.quantity * item.unitPrice) * (1 - item.discount / 100),
        source: 'INTERNAL' // default
    }));

    return {
        id: domain.id,
        clientId: domain.clientId,
        clientName: domain.client?.name || 'Unknown',
        date: domain.createdAt.toISOString(),
        expiryDate: domain.validUntil.toISOString(),
        items: items,
        subtotal: domain.subtotal,
        totalTax: domain.totalTax,
        totalDiscount: domain.totalDiscount,
        grandTotal: domain.total,
        status: mapStatusToLegacy(domain.status),
        notes: domain.notes
    };
};
