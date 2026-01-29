import { Budget, CreateBudgetDTO, BudgetTemplate, CreateTemplateDTO } from '../models/budget';

export interface IBudgetRepository {
    create(budget: CreateBudgetDTO): Promise<Budget>;
    findById(id: string): Promise<Budget | null>;
    findAll(): Promise<Budget[]>;
    update(id: string, data: Partial<Budget>): Promise<Budget>;
    delete(id: string): Promise<void>;
    findByClientId(clientId: string): Promise<Budget[]>;

    // Template Methods
    createTemplate(data: CreateTemplateDTO): Promise<BudgetTemplate>;
    findAllTemplates(): Promise<BudgetTemplate[]>;
    deleteTemplate(id: string): Promise<void>;
}
