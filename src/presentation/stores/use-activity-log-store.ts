import { create } from 'zustand';
import { ActivityLog, Activity } from '../../domain/models/activity-log';
import { v4 as uuidv4 } from 'uuid';

interface ActivityLogState {
    activityLogs: ActivityLog[];
    isLoading: boolean;
    error: string | null;

    fetchActivityLogs: () => Promise<void>;
    createActivityLog: (data: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateActivityLog: (id: string, data: Partial<ActivityLog>) => Promise<void>;
    deleteActivityLog: (id: string) => Promise<void>;
}

const STORAGE_KEY = 'orcapro_activity_logs';

const loadFromStorage = (): ActivityLog[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map((log: any) => ({
                ...log,
                date: new Date(log.date),
                createdAt: new Date(log.createdAt),
                updatedAt: new Date(log.updatedAt)
            }));
        }
    } catch (error) {
        console.error('Error loading activity logs from storage:', error);
    }
    return [];
};

const saveToStorage = (logs: ActivityLog[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
        console.error('Error saving activity logs to storage:', error);
    }
};

export const useActivityLogStore = create<ActivityLogState>((set, get) => ({
    activityLogs: loadFromStorage(),
    isLoading: false,
    error: null,

    fetchActivityLogs: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ isLoading: false });
    },

    createActivityLog: async (data) => {
        const newLog: ActivityLog = {
            ...data,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const updated = [newLog, ...get().activityLogs];
        set({ activityLogs: updated });
        saveToStorage(updated);
        return newLog.id;
    },

    updateActivityLog: async (id, data) => {
        const updated = get().activityLogs.map(log =>
            log.id === id ? { ...log, ...data, updatedAt: new Date() } : log
        );
        set({ activityLogs: updated });
        saveToStorage(updated);
    },

    deleteActivityLog: async (id) => {
        const updated = get().activityLogs.filter(log => log.id !== id);
        set({ activityLogs: updated });
        saveToStorage(updated);
    }
}));
