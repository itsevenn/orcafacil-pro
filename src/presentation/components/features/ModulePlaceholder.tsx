import React from 'react';
import { LucideIcon, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface ModulePlaceholderProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    onBack: () => void;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ title, subtitle, icon: Icon, onBack }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#f8fafc] p-8 animate-fade-in text-center">
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-blue-500/10 rounded-[40px] blur-3xl" />
                <div className="relative bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-100/50 border border-slate-100">
                    <Icon className="w-16 h-16 text-[#0070d2]" />
                </div>
            </div>

            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">
                {title}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed mb-10 font-medium">
                {subtitle}
                <br />
                <span className="text-sm text-slate-400 mt-2 block italic">
                    Esta funcionalidade está em fase final de desenvolvimento e será liberada na próxima atualização.
                </span>
            </p>

            <Button
                onClick={onBack}
                variant="outline"
                className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full px-8 py-6 h-auto font-bold group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Início
            </Button>

            <div className="mt-16 grid grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none">
                <div className="h-2 w-32 bg-slate-200 rounded-full" />
                <div className="h-2 w-32 bg-slate-200 rounded-full" />
                <div className="h-2 w-32 bg-slate-200 rounded-full" />
            </div>
        </div>
    );
};
