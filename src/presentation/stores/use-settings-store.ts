import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, CompanySettings, DEFAULT_SETTINGS } from '../../domain/models/settings';

interface SettingsState extends AppSettings {
    updateCompany: (company: Partial<CompanySettings>) => void;
    updateTheme: (theme: 'light' | 'dark') => void;
    resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            updateCompany: (company) => set((state) => ({
                company: { ...state.company, ...company }
            })),

            updateTheme: (theme) => set({ theme }),

            resetSettings: () => set(DEFAULT_SETTINGS)
        }),
        {
            name: 'orcapro-settings-storage', // key in localStorage
        }
    )
);
