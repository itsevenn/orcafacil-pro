export interface Activity {
    id: string;
    description: string;
    startTime?: string;
    endTime?: string;
}

export type WeatherType = 'SUNNY' | 'CLOUDY' | 'RAINY' | 'STORM';
export type ActivityStatus = 'PRODUCTIVE' | 'NORMAL' | 'UNPRODUCTIVE';

export interface ActivityLog {
    id: string;
    date: Date;
    projectName: string;
    weather: WeatherType;
    teamCount: number;
    activities: Activity[];
    materials: string[];
    equipment: string[];
    notes: string;
    status: ActivityStatus;
    createdAt: Date;
    updatedAt: Date;
}
