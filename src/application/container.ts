import { MockBudgetRepository } from '../infrastructure/repositories/mock-budget-repository';
import { MockClientRepository } from '../infrastructure/repositories/mock-client-repository';

// Singleton instances
const clientRepository = new MockClientRepository();
const budgetRepository = new MockBudgetRepository();

// Export as a Container object (can be refined later)
export const DI = {
    clientRepository,
    budgetRepository
};
