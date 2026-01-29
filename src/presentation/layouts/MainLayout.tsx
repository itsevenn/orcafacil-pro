import React, { useState } from 'react';
import { Sidebar } from '../components/features/Sidebar';
import { Header } from '../components/features/Header';
import { ViewState } from '../../../types';
import { cn } from '../../lib/utils';

// Store for local UI state (Sidebar open/close) should ideally be in useUIStore, but local state is fine for layout specific things if limited.
// However, since we promised Zustand, let's keep it clean. But for this specific file, useState for sidebar toggle is acceptable for "View Logic".

interface MainLayoutProps {
    children: React.ReactNode;
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentView, onNavigate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-[#f4f6f8] font-sans overflow-hidden">
            <Sidebar
                currentView={currentView}
                onChangeView={onNavigate}
                isOpen={isSidebarOpen}
            />

            <div className={cn(
                "flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out",
                isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
            )}>
                <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    currentView={currentView}
                />

                <main className="flex-1 overflow-auto bg-[#f4f6f8] relative rounded-tl-[3rem] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                    {children}
                </main>
            </div>
        </div>
    );
};
