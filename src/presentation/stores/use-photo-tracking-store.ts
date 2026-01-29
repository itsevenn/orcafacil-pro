import { create } from 'zustand';
import { PhotoTracking, Photo } from '../../domain/models/photo-tracking';
import { v4 as uuidv4 } from 'uuid';

interface PhotoTrackingState {
    photoTrackings: PhotoTracking[];
    isLoading: boolean;
    error: string | null;

    fetchPhotoTrackings: () => Promise<void>;
    createPhotoTracking: (data: Omit<PhotoTracking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updatePhotoTracking: (id: string, data: Partial<PhotoTracking>) => Promise<void>;
    deletePhotoTracking: (id: string) => Promise<void>;
}

const STORAGE_KEY = 'orcapro_photo_trackings';

// Load from storage
const loadFromStorage = (): PhotoTracking[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map((tracking: any) => ({
                ...tracking,
                date: new Date(tracking.date),
                createdAt: new Date(tracking.createdAt),
                updatedAt: new Date(tracking.updatedAt)
            }));
        }
    } catch (error) {
        console.error('Error loading photo trackings from storage:', error);
    }
    return [];
};

// Save to storage
const saveToStorage = (trackings: PhotoTracking[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trackings));
    } catch (error) {
        console.error('Error saving photo trackings to storage:', error);
    }
};

export const usePhotoTrackingStore = create<PhotoTrackingState>((set, get) => ({
    photoTrackings: loadFromStorage(),
    isLoading: false,
    error: null,

    fetchPhotoTrackings: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        set({ isLoading: false });
    },

    createPhotoTracking: async (data) => {
        const newTracking: PhotoTracking = {
            ...data,
            id: uuidv4(),
            photoCount: data.photos.length,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const updated = [newTracking, ...get().photoTrackings];
        set({ photoTrackings: updated });
        saveToStorage(updated);
        return newTracking.id;
    },

    updatePhotoTracking: async (id, data) => {
        const updated = get().photoTrackings.map(tracking =>
            tracking.id === id ? { ...tracking, ...data, updatedAt: new Date() } : tracking
        );
        set({ photoTrackings: updated });
        saveToStorage(updated);
    },

    deletePhotoTracking: async (id) => {
        const updated = get().photoTrackings.filter(tracking => tracking.id !== id);
        set({ photoTrackings: updated });
        saveToStorage(updated);
    }
}));
