import React, { useState } from 'react';
import { PriceCollectionDashboard } from '../components/features/database/PriceCollectionDashboard';
import { PriceCollectionEditor } from '../components/features/database/PriceCollectionEditor';
import { PriceCollection } from '../../domain/models/price-collection';

export const PriceCollectionPage: React.FC = () => {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

    if (selectedCollectionId) {
        return (
            <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <PriceCollectionEditor
                    collectionId={selectedCollectionId}
                    onBack={() => setSelectedCollectionId(null)}
                />
            </div>
        );
    }

    return (
        <div className="h-full p-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <PriceCollectionDashboard onSelectCollection={setSelectedCollectionId} />
        </div>
    );
};
