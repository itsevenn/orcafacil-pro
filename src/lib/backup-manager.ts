import { useClientStore } from '../presentation/stores/use-client-store';
import { useBudgetStore } from '../presentation/stores/use-budget-store';
import { useDatabaseStore } from '../presentation/stores/use-database-store';
import { useSettingsStore } from '../presentation/stores/use-settings-store';
import { v4 as uuidv4 } from 'uuid';

export interface BackupData {
    version: string;
    timestamp: string;
    data: {
        clients: any[];
        budgets: any[];
        inputs: any[];
        compositions: any[];
        settings: any;
    };
}

export const BackupManager = {
    /**
     * Collects all state from stores and creates a backup object
     */
    createBackup: (): BackupData => {
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: {
                clients: useClientStore.getState().clients,
                budgets: useBudgetStore.getState().budgets,
                inputs: useDatabaseStore.getState().inputs,
                compositions: useDatabaseStore.getState().compositions,
                settings: useSettingsStore.getState().company
            }
        };
    },

    /**
     * Triggers a browser download of the backup file
     */
    downloadBackup: (backup: BackupData) => {
        const fileName = `orcapro-backup-${new Date().toISOString().split('T')[0]}.json`;
        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Restores data from a backup object into the stores
     */
    restoreBackup: async (backup: BackupData) => {
        try {
            // Validate basic structure
            if (!backup.data || !backup.version) {
                throw new Error('Formato de arquivo de backup inválido.');
            }

            // Restore Clients
            if (Array.isArray(backup.data.clients)) {
                // In a real app we might merge, here we replace or append. 
                // For simplicity, let's force set (if store allowed) or just rebuild.
                // Since our stores persist, we can hackily write to localStorage or use store setters.
                // Using store actions is safer.

                // Note: The stores might not expose a "setAll" method. 
                // Ideally we should add `setClients`, `setBudgets` etc to stores.
                // For now, let's assume we can interact with the store state or localStorage directly.

                useClientStore.setState({ clients: backup.data.clients });
            }

            // Restore Budgets
            if (Array.isArray(backup.data.budgets)) {
                useBudgetStore.setState({ budgets: backup.data.budgets });
            }

            // Restore Database
            if (Array.isArray(backup.data.inputs)) {
                useDatabaseStore.setState({ inputs: backup.data.inputs });
            }
            if (Array.isArray(backup.data.compositions)) {
                useDatabaseStore.setState({ compositions: backup.data.compositions });
            }

            // Restore Settings
            if (backup.data.settings) {
                useSettingsStore.setState({ company: backup.data.settings });
            }

            return true;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return false;
        }
    }
};
