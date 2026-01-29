export interface PlanningTask {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    progress: number; // 0-100
    dependencies?: string[]; // IDs of dependent tasks
    assignedTo?: string;
}

export interface Planning {
    id: string;
    projectName: string;
    clientName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
    totalBudget: number;
    tasks: PlanningTask[];
    overallProgress: number; // 0-100
    createdAt: Date;
    updatedAt: Date;
}
