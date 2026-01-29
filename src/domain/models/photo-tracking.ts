export interface Photo {
    id: string;
    dataUrl: string;  // base64 encoded image - ONLY IN MEMORY
    caption: string;
    uploadedAt: Date;
}

export type PhotoCategory = 'PROGRESS' | 'ISSUE' | 'BEFORE_AFTER' | 'TEAM' | 'MATERIAL' | 'FINISHING';

export interface PhotoTracking {
    id: string;
    title: string;
    date: Date;
    projectName: string;
    category: PhotoCategory;
    location: string;
    description: string;
    photos: Photo[];  // Photos stored in memory only, not persisted
    photoCount: number;  // Persisted count for display
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
