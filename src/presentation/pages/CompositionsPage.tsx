import React, { useState } from 'react';
import { CompositionList } from '../components/features/database/CompositionList';
import { CPUAnalyticView } from '../components/features/database/CPUAnalyticView';
import { Composition } from '../../domain/models/composition';
import { ViewState } from '../../../types';

interface CompositionsPageProps {
    currentView: ViewState;
}

export const CompositionsPage: React.FC<CompositionsPageProps> = ({ currentView }) => {
    const [selectedComp, setSelectedComp] = useState<Composition | null>(null);

    // If we have a selected composition, show analytic view
    if (selectedComp) {
        return (
            <div className="h-full p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CPUAnalyticView
                    composition={selectedComp}
                    onBack={() => setSelectedComp(null)}
                />
            </div>
        );
    }

    // Determine initial source filter based on view
    const initialSource = currentView === 'compositions_own' ? 'PROPRIA' : undefined;

    return (
        <div className="h-full p-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CompositionList
                initialSource={initialSource}
                onViewAnalytic={setSelectedComp}
            />
        </div>
    );
};
