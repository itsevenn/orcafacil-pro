import { create } from 'zustand';
import { Budget, CreateBudgetDTO, BudgetTemplate, CreateTemplateDTO } from '../../domain/models/budget';
import { DI } from '../../application/container';

interface BudgetState {
    budgets: Budget[];
    templates: BudgetTemplate[];
    currentBudget: Budget | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchBudgets: () => Promise<void>;
    createBudget: (data: CreateBudgetDTO) => Promise<void>;
    updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    fetchBudgetById: (id: string) => Promise<void>;
    clearCurrentBudget: () => void;

    // Template Actions
    fetchTemplates: () => Promise<void>;
    createTemplate: (data: CreateTemplateDTO) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set) => ({
    budgets: [],
    templates: [],
    currentBudget: null,
    isLoading: false,
    error: null,

    fetchBudgets: async () => {
        set({ isLoading: true, error: null });
        try {
            const budgets = await DI.budgetRepository.findAll();
            set({ budgets, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch budgets', isLoading: false });
        }
    },

    createBudget: async (data: CreateBudgetDTO) => {
        set({ isLoading: true, error: null });
        try {
            const newBudget = await DI.budgetRepository.create(data);
            set((state) => ({
                budgets: [...state.budgets, newBudget],
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to create budget', isLoading: false });
        }
    },

    updateBudget: async (id: string, data: Partial<Budget>) => {
        set({ isLoading: true, error: null });
        try {
            const updatedBudget = await DI.budgetRepository.update(id, data);
            set((state) => ({
                budgets: state.budgets.map((b) => (b.id === id ? updatedBudget : b)),
                currentBudget: state.currentBudget?.id === id ? updatedBudget : state.currentBudget,
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to update budget', isLoading: false });
        }
    },

    deleteBudget: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await DI.budgetRepository.delete(id);
            set((state) => ({
                budgets: state.budgets.filter((b) => b.id !== id),
                currentBudget: state.currentBudget?.id === id ? null : state.currentBudget,
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to delete budget', isLoading: false });
        }
    },

    fetchBudgetById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const budget = await DI.budgetRepository.findById(id);
            set({ currentBudget: budget, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch budget details', isLoading: false });
        }
    },

    clearCurrentBudget: () => {
        set({ currentBudget: null });
    },

    // Template Implementations
    fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            const templates = await DI.budgetRepository.findAllTemplates();
            set({ templates, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch templates', isLoading: false });
        }
    },

    createTemplate: async (data: CreateTemplateDTO) => {
        set({ isLoading: true, error: null });
        try {
            const newTemplate = await DI.budgetRepository.createTemplate(data);
            set((state) => ({
                templates: [...state.templates, newTemplate],
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to create template', isLoading: false });
        }
    },

    deleteTemplate: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await DI.budgetRepository.deleteTemplate(id);
            set((state) => ({
                templates: state.templates.filter((t) => t.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ error: 'Failed to delete template', isLoading: false });
        }
    }
}));

