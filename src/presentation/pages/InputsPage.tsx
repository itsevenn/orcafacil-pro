import React, { useState } from 'react';
import { OfficialBasesDashboard } from '../components/features/database/OfficialBasesDashboard';
import { InputHistoryView } from '../components/features/database/InputHistoryView';
import { Input } from '../../domain/models/input';

export const InputsPage: React.FC = () => {
    const [selectedInput, setSelectedInput] = useState<Input | null>(null);

    if (selectedInput) {
        return (
            <div className="h-full p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <InputHistoryView
                    input={selectedInput}
                    onBack={() => setSelectedInput(null)}
                />
            </div>
        );
    }

    return (
        <div className="h-full p-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <OfficialBasesDashboard onViewHistory={setSelectedInput} />
        </div>
    );
};
