import { z } from 'zod';
import { BudgetStatus } from '../models/budget';

// Helper for parsing currency strings if needed, though we try to work with numbers
const stringToNumber = z.string().transform((val) => parseFloat(val.replace(/[^\d.-]/g, ''))).or(z.number());

export const budgetItemSchema = z.object({
    id: z.string().optional(), // Optional for new items before save
    productId: z.string().min(1, 'Produto é obrigatório'),
    name: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
    quantity: z.number().min(0.01, 'Quantidade deve ser maior que zero'),
    unitPrice: z.number().min(0, 'Preço unitário não pode ser negativo'),
    discount: z.number().min(0).max(100, 'Desconto deve ser entre 0 e 100').default(0),
    taxRate: z.number().min(0).max(100).default(0),
    source: z.string().optional(),
    stage: z.string().optional(),
});

export const budgetSchema = z.object({
    clientId: z.string().min(1, 'Cliente é obrigatório'),
    clientName: z.string().optional(), // Can be derived or stored
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' }),
    expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' }),
    status: z.nativeEnum(BudgetStatus).default(BudgetStatus.DRAFT),
    notes: z.string().optional(),
    bdi: z.number().min(0).max(100, 'BDI deve ser entre 0 e 100').default(0),
    items: z.array(budgetItemSchema).min(1, 'Adicione pelo menos um item ao orçamento'),

    // Optional schedule data
    schedulePeriods: z.array(z.object({
        id: z.string(),
        name: z.string(),
        date: z.any() // Simplify date handling for now
    })).optional(),
    scheduleAllocations: z.array(z.object({
        stage: z.string(),
        periodId: z.string(),
        percentage: z.number()
    })).optional(),

    measurements: z.array(z.object({
        id: z.string(),
        name: z.string(),
        date: z.any(),
        items: z.array(z.object({
            itemId: z.string(),
            quantity: z.number()
        })),
        notes: z.string().optional()
    })).optional(),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;
export type BudgetItemFormData = z.infer<typeof budgetItemSchema>;
