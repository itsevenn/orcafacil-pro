import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'; // REMOVED
import { Button } from '../../ui/button';
import { Database, Calendar, Globe, X, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface IntegrationSettingsDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSave?: (settings: { sources: string[], frequency: string, regions: string[] }) => void;
    children?: React.ReactNode;
}

export const IntegrationSettingsDialog: React.FC<IntegrationSettingsDialogProps> = ({ open, onOpenChange, onSave, children }) => {
    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const [selectedStates, setSelectedStates] = React.useState<string[]>(['MG', 'RJ', 'SP', 'SE']);
    const [selectedSources, setSelectedSources] = React.useState<string[]>(['SINAPI', 'ORSE']);
    const [selectedFrequency, setSelectedFrequency] = React.useState<string>('Mensal');

    const toggleSource = (source: string) => {
        if (selectedSources.includes(source)) {
            setSelectedSources(prev => prev.filter(s => s !== source));
        } else {
            setSelectedSources(prev => [...prev, source]);
        }
    };

    const toggleState = (uf: string) => {
        if (selectedStates.includes(uf)) {
            setSelectedStates(prev => prev.filter(s => s !== uf));
        } else {
            setSelectedStates(prev => [...prev, uf]);
        }
    };

    const handleOpen = () => onOpenChange?.(true);
    const handleClose = () => onOpenChange?.(false);

    return (
        <>
            {children && React.cloneElement(children as React.ReactElement, { onClick: handleOpen })}

            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/60 z-[100]"
                        onClick={handleClose}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                        <div
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[600px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 pb-2 shrink-0">
                                <h2 className="text-xl font-bold flex flex-col gap-1 text-slate-900">
                                    Configurações de Integração
                                    <span className="text-sm font-normal text-slate-500">Defina quais bases o sistema deve consultar.</span>
                                </h2>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">

                                {/* Data Sources */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Database className="w-4 h-4 text-[#0070d2]" />
                                        FONTES DE DADOS
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* SINAPI */}
                                        <div
                                            onClick={() => toggleSource('SINAPI')}
                                            className={cn(
                                                "border-2 rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors relative",
                                                selectedSources.includes('SINAPI')
                                                    ? "border-[#0070d2] bg-blue-50/50"
                                                    : "border-slate-200 hover:border-blue-300 bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-md flex items-center justify-center",
                                                    selectedSources.includes('SINAPI') ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    <Database className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">SINAPI</div>
                                                    <div className="text-xs text-slate-500">Caixa Econômica Federal</div>
                                                </div>
                                            </div>
                                            {selectedSources.includes('SINAPI') && (
                                                <div className="bg-[#0070d2] text-white rounded-full p-0.5">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>

                                        {/* ORSE */}
                                        <div
                                            onClick={() => toggleSource('ORSE')}
                                            className={cn(
                                                "border-2 rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors relative",
                                                selectedSources.includes('ORSE')
                                                    ? "border-[#0070d2] bg-blue-50/50"
                                                    : "border-slate-200 hover:border-orange-300 bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-md flex items-center justify-center",
                                                    selectedSources.includes('ORSE') ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    <Database className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">ORSE</div>
                                                    <div className="text-xs text-slate-500">CEHOP - Sergipe</div>
                                                </div>
                                            </div>
                                            {selectedSources.includes('ORSE') && (
                                                <div className="bg-[#0070d2] text-white rounded-full p-0.5">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Frequency */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Calendar className="w-4 h-4 text-[#0070d2]" />
                                        FREQUÊNCIA DE ATUALIZAÇÃO
                                    </div>
                                    <div className="flex gap-2">
                                        {['Diária', 'Semanal', 'Mensal', 'Manual'].map((freq) => (
                                            <button
                                                key={freq}
                                                onClick={() => setSelectedFrequency(freq)}
                                                className={cn(
                                                    "px-4 py-2 rounded-md text-sm font-medium border transition-colors",
                                                    selectedFrequency === freq
                                                        ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                )}
                                            >
                                                {freq}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">A atualização automática ocorrerá sempre às 02:00 AM do período selecionado.</p>
                                </div>

                                {/* Regional Scope */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Globe className="w-4 h-4 text-[#0070d2]" />
                                        ABRANGÊNCIA REGIONAL (UF)
                                    </div>
                                    <div className="grid grid-cols-9 gap-2">
                                        {states.map(uf => (
                                            <button
                                                key={uf}
                                                onClick={() => toggleState(uf)}
                                                className={cn(
                                                    "h-9 rounded-md text-xs font-bold border transition-all",
                                                    selectedStates.includes(uf)
                                                        ? "bg-[#4f46e5] text-white border-[#4f46e5] shadow-sm transform scale-105"
                                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                )}
                                            >
                                                {uf}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">Selecione apenas os estados onde sua empresa atua para otimizar o banco de dados.</p>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0 rounded-b-[2rem]">
                                <Button variant="outline" onClick={handleClose} className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50">
                                    Cancelar
                                </Button>
                                <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white" onClick={() => onSave?.({ sources: selectedSources, frequency: selectedFrequency, regions: selectedStates })}>
                                    <Database className="w-4 h-4 mr-2" />
                                    Salvar Preferências
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
