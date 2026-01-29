import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, X, Command } from 'lucide-react';
import { MOCK_CATALOG } from '../../../../../constants';
import { CatalogItem } from '../../../../../types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { cn } from '../../../../lib/utils';
import { useDatabaseStore } from '../../../stores/use-database-store';

// Helper types for props if we want to be strict, or perform callbacks
interface ItemSelectorProps {
    onSelectItem: (item: CatalogItem) => void;
}

export const ItemSelector: React.FC<ItemSelectorProps> = ({ onSelectItem }) => {
    const { inputs, compositions, fetchInputs, fetchCompositions } = useDatabaseStore();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CatalogItem[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initial fetch
    useEffect(() => {
        fetchInputs();
        fetchCompositions();
    }, [fetchInputs, fetchCompositions]);

    // Combine sources
    const allItems = useMemo(() => {
        const mappedInputs: CatalogItem[] = inputs.map(i => ({
            id: i.id,
            code: i.code,
            name: i.name,
            price: i.price,
            unit: i.unit,
            category: i.type,
            source: i.source === 'OWN' ? 'INTERNAL' : i.source, // 'SINAPI' | 'ORSE' are compatible
            type: 'Input'
        }));

        const mappedCompositions: CatalogItem[] = compositions.map(c => ({
            id: c.id,
            code: c.code,
            name: c.name,
            price: c.totalCost,
            unit: c.unit,
            category: 'COMPOSICAO',
            source: 'INTERNAL',
            type: 'Composition'
        }));

        return [...mappedCompositions, ...mappedInputs, ...MOCK_CATALOG];
    }, [inputs, compositions]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search logic
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = allItems.filter(item =>
            item.name.toLowerCase().includes(lowerQuery) ||
            item.code.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
        setResults(filtered);
    }, [query, allItems]);

    return (
        <div className="relative w-full max-w-lg" ref={wrapperRef}>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Adicionar item (Produto, SINAPI, Insumo)..."
                    className="pl-9 pr-12 bg-white shadow-sm focus-visible:ring-blue-500"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                />
                <div className="absolute right-3 top-2.5 flex items-center pointer-events-none text-xs text-slate-400 border border-slate-200 rounded px-1.5 bg-slate-50">
                    <Command className="w-3 h-3 mr-1" /> K
                </div>
            </div>

            {open && (query.length > 0 || results.length > 0) && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 text-center">
                            {query.length < 2 ? 'Digite para buscar...' : 'Nenhum item encontrado.'}
                        </div>
                    ) : (
                        <ul className="max-h-[300px] overflow-auto divide-y divide-slate-100">
                            {results.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                        onClick={() => {
                                            onSelectItem(item);
                                            setQuery('');
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn(
                                                    "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                                                    item.source === 'SINAPI' ? "bg-blue-100 text-blue-700" :
                                                        item.source === 'ORSE' ? "bg-orange-100 text-orange-700" :
                                                            "bg-slate-100 text-slate-700"
                                                )}>
                                                    {item.source}
                                                </span>
                                                <span className="text-xs font-mono text-slate-500">{item.code}</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="block font-bold text-blue-600 text-sm">
                                                {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                            <span className="text-xs text-slate-400">/{item.unit}</span>
                                        </div>
                                        <Plus className="w-4 h-4 ml-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
