import { create } from 'zustand';
import { Reminder, CreateReminderDTO } from '../../domain/models/reminder';
import { v4 as uuidv4 } from 'uuid';

interface ReminderState {
    reminders: Reminder[];
    isLoading: boolean;

    // Actions
    fetchReminders: () => void;
    addReminder: (data: CreateReminderDTO) => void;
    removeReminder: (id: string) => void;
    toggleReminder: (id: string) => void;
}

const STORAGE_KEY = 'orcapro_reminders';

export const useReminderStore = create<ReminderState>((set, get) => ({
    reminders: [],
    isLoading: false,

    fetchReminders: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data, (key, value) => {
                if (key === 'dueDate' || key === 'createdAt') return new Date(value);
                return value;
            });
            set({ reminders: parsed });
        } else {
            // Seed with some initials
            const initials: Reminder[] = [
                { id: '1', text: 'Enviar proposta revisada para Construtora ABC', dueDate: new Date(), priority: 'HIGH', completed: false, createdAt: new Date() },
                { id: '2', text: 'Reunião de alinhamento com equipe de engenharia', dueDate: new Date(Date.now() + 86400000), priority: 'MEDIUM', completed: false, createdAt: new Date() },
            ];
            set({ reminders: initials });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initials));
        }
    },

    addReminder: (data) => {
        const newReminder: Reminder = {
            id: uuidv4(),
            ...data,
            completed: false,
            createdAt: new Date(),
        };
        const updated = [newReminder, ...get().reminders];
        set({ reminders: updated });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    removeReminder: (id: string) => {
        const updated = get().reminders.filter(r => r.id !== id);
        set({ reminders: updated });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    toggleReminder: (id: string) => {
        const updated = get().reminders.map(r =>
            r.id === id ? { ...r, completed: !r.completed } : r
        );
        set({ reminders: updated });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
}));
