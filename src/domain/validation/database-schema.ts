import { z } from 'zod';

export const inputSchema = z.object({
    code: z.string().min(1, "Código é obrigatório"),
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    unit: z.string().min(1, "Unidade é obrigatória"),
    price: z.coerce.number().min(0, "Preço deve ser positivo"),
    type: z.enum(['MATERIAL', 'EQUIPMENT', 'LABOR', 'SERVICE']),
    source: z.enum(['SINAPI', 'ORSE', 'OWN']).default('OWN')
});

export type InputFormData = z.infer<typeof inputSchema>;

export const compositionItemSchema = z.object({
    type: z.enum(['INPUT', 'COMPOSITION']),
    itemId: z.string().min(1, "Item é obrigatório"),
    quantity: z.coerce.number().gt(0, "Quantidade deve ser maior que zero")
});

export const compositionSchema = z.object({
    code: z.string().min(1, "Código é obrigatório"),
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    unit: z.string().min(1, "Unidade é obrigatória"),
    socialCharges: z.coerce.number().min(0).optional(),
    bdi: z.coerce.number().min(0).optional(),
    items: z.array(compositionItemSchema).min(1, "Composition must have at least one item")
});

export type CompositionFormData = z.infer<typeof compositionSchema>;
