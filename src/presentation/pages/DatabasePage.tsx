import React, { useState } from 'react';
import { InputList } from '../components/features/database/InputList';
import { CompositionList } from '../components/features/database/CompositionList';
import { Database, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

type DatabaseTab = 'inputs' | 'compositions';

export const DatabasePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<DatabaseTab>('inputs');

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Base de Dados</h1>
                    <p className="text-slate-500">Gerencie seus insumos e composições de preço.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('inputs')}
                        className={cn(
                            "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === 'inputs'
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        <Database className={cn("mr-2 h-5 w-5", activeTab === 'inputs' ? "text-blue-500" : "text-slate-400 group-hover:text-slate-500")} />
                        Insumos
                    </button>
                    <button
                        onClick={() => setActiveTab('compositions')}
                        className={cn(
                            "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === 'compositions'
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        <Layers className={cn("mr-2 h-5 w-5", activeTab === 'compositions' ? "text-blue-500" : "text-slate-400 group-hover:text-slate-500")} />
                        Composições
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                {activeTab === 'inputs' ? (
                    <InputList />
                ) : (
                    <CompositionList />
                )}
            </div>
        </div>
    );
};
