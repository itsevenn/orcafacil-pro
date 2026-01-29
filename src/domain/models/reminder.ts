export type ReminderPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Reminder {
    id: string;
    text: string;
    dueDate: Date;
    priority: ReminderPriority;
    completed: boolean;
    createdAt: Date;
}

export type CreateReminderDTO = Omit<Reminder, 'id' | 'createdAt' | 'completed'>;
