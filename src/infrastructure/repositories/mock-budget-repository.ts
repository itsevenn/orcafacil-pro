import { IBudgetRepository } from '../../domain/repositories/budget-repository';
import { Budget, CreateBudgetDTO, BudgetStatus, BudgetTemplate, CreateTemplateDTO } from '../../domain/models/budget';

const STORAGE_KEY = 'orcapro_budgets';
const TEMPLATE_STORAGE_KEY = 'orcapro_budget_templates';

export class MockBudgetRepository implements IBudgetRepository {
    private budgets: Budget[] = [];
    private templates: BudgetTemplate[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                this.budgets = JSON.parse(data, (key, value) => {
                    if (key === 'createdAt' || key === 'updatedAt' || key === 'validUntil') return new Date(value);
                    return value;
                });
            } catch (e) {
                console.error('Failed to parse budgets', e);
                this.budgets = [];
            }
        }

        const templateData = localStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (templateData) {
            try {
                this.templates = JSON.parse(templateData, (key, value) => {
                    if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
                    return value;
                });
            } catch (e) {
                console.error('Failed to parse templates', e);
                this.seedTemplates();
            }
        } else {
            this.seedTemplates();
        }
    }

    private seedTemplates() {
        this.templates = [
            {
                id: 'tmpl-1',
                name: 'Casa Padrão Médio (100m²)',
                description: 'Modelo completo para residência unifamiliar com acabamento padrão médio.',
                category: 'Residencial',
                items: [
                    { id: 't1-i1', name: 'Mobilização de Obra', stage: '1.0 Serviços Preliminares', quantity: 1, unitPrice: 2500, discount: 0, taxRate: 0 },
                    { id: 't1-i2', name: 'Escavação de Baldrame', stage: '2.0 Infraestrutura', quantity: 15, unitPrice: 85, discount: 0, taxRate: 0 }
                ],
                bdi: 25,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'tmpl-2',
                name: 'Reforma de Banheiro',
                description: 'Troca de revestimentos, louças e metais.',
                category: 'Reforma',
                items: [
                    { id: 't2-i1', name: 'Remoção de Revestimento antigo', stage: '1.0 Demolições', quantity: 18, unitPrice: 35, discount: 0, taxRate: 0 },
                    { id: 't2-i2', name: 'Revestimento Cerâmico 60x60', stage: '2.0 Acabamentos', quantity: 20, unitPrice: 120, discount: 0, taxRate: 0 }
                ],
                bdi: 15,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.saveToStorage();
    }

    private saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.budgets));
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(this.templates));
    }

    async create(data: Budget | CreateBudgetDTO): Promise<Budget> {
        const id = (data as any).id || crypto.randomUUID();
        const newBudget: Budget = {
            ...data,
            id,
            status: (data as any).status || BudgetStatus.DRAFT,
            subtotal: 0,
            totalDirect: 0,
            totalDiscount: 0,
            totalTax: 0,
            total: 0,
            createdAt: (data as any).createdAt || new Date(),
            updatedAt: new Date(),
        };

        this.recalculateTotals(newBudget);
        this.budgets.push(newBudget);
        this.saveToStorage();
        return newBudget;
    }

    private recalculateTotals(budget: Budget) {
        budget.subtotal = budget.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        budget.totalDirect = budget.subtotal;

        const discountAmount = budget.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.discount / 100)), 0);
        const taxAmount = budget.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0);
        const bdiAmount = budget.subtotal * (budget.bdi / 100);

        budget.totalDiscount = discountAmount;
        budget.totalTax = taxAmount;
        budget.total = budget.subtotal - discountAmount + taxAmount + bdiAmount;
    }

    async findById(id: string): Promise<Budget | null> {
        return this.budgets.find(b => b.id === id) || null;
    }

    async findAll(): Promise<Budget[]> {
        return [...this.budgets];
    }

    async update(id: string, data: Partial<Budget>): Promise<Budget> {
        const index = this.budgets.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Budget not found');

        const updatedBudget = {
            ...this.budgets[index],
            ...data,
            updatedAt: new Date(),
        };

        this.recalculateTotals(updatedBudget);
        this.budgets[index] = updatedBudget;
        this.saveToStorage();
        return updatedBudget;
    }

    async delete(id: string): Promise<void> {
        this.budgets = this.budgets.filter(b => b.id !== id);
        this.saveToStorage();
    }

    async findByClientId(clientId: string): Promise<Budget[]> {
        return this.budgets.filter(b => b.clientId === clientId);
    }

    // Template Implementations
    async createTemplate(data: CreateTemplateDTO): Promise<BudgetTemplate> {
        const newTemplate: BudgetTemplate = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.templates.push(newTemplate);
        this.saveToStorage();
        return newTemplate;
    }

    async findAllTemplates(): Promise<BudgetTemplate[]> {
        return [...this.templates];
    }

    async deleteTemplate(id: string): Promise<void> {
        this.templates = this.templates.filter(t => t.id !== id);
        this.saveToStorage();
    }
}
