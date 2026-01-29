import React from 'react';
import { Menu, Plus, Tag, PlayCircle, HelpCircle, Search, Command, Headphones, Bell, User } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ViewState } from '../../../../types';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (v: boolean) => void;
    currentView: ViewState;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <header className="h-16 bg-[#0070d2] text-white flex items-center justify-between px-4 shadow-md z-[210] shrink-0 gap-4 transition-all">
            <div className="flex items-center space-x-4 shrink-0">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-white/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Quick Actions */}
                <div className="hidden md:flex items-center space-x-1">
                    <button className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded transition-colors group">
                        <Plus className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] leading-none opacity-90 group-hover:opacity-100">Criar<br />Orçamento</span>
                    </button>
                    {/* ... other specific header items kept simple for now */}
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-blue-200 group-hover:text-white transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-blue-800/40 text-blue-100 placeholder-blue-300 focus:outline-none focus:bg-blue-900 focus:border-blue-400 focus:text-white focus:placeholder-blue-400 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Pesquisar orçamentos, composições ou clientes..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="flex items-center border border-blue-400/30 rounded px-1.5 py-0.5 text-xs text-blue-200">
                        <Command className="w-3 h-3 mr-1" /> K
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
                {/* User Menu */}
                <button className="flex items-center space-x-2 pl-2 hover:bg-white/10 rounded-lg p-1 transition-colors group">
                    <div className="w-8 h-8 bg-white text-[#0070d2] rounded-full flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                        <User className="w-5 h-5" />
                    </div>
                </button>
            </div>
        </header>
    );
};
