export type WeatherCondition = 'SUNNY' | 'CLOUDY' | 'RAINY' | 'STORM';

export interface JournalEntry {
    id: string;
    budgetId: string;
    projectName: string;
    date: Date;
    weather: {
        morning: WeatherCondition;
        afternoon: WeatherCondition;
    };
    labor: {
        internal: number;
        external: number;
    };
    equipment: {
        name: string;
        quantity: number;
        status: 'OPERATIONAL' | 'MAINTENANCE';
    }[];
    activities: {
        description: string;
        status: 'COMPLETED' | 'IN_PROGRESS' | 'DELAYED';
    }[];
    incidents: string[];
    photos: {
        url: string;
        caption?: string;
    }[];
}
