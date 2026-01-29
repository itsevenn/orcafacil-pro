import React, { useState } from 'react';
import {
    Home, FileText, Layers, Package, Database, Calendar, Book,
    Ruler, ShoppingCart, Users, Link as LinkIcon, Settings,
    ChevronDown, ChevronRight, MessageSquare, Briefcase, Building, User,
    ClipboardList, Camera, Search, LayoutGrid, HardHat
} from 'lucide-react';
import { ViewState } from '../../../../types';
import { cn } from '../../../lib/utils';

interface SubMenuItem {
    id: ViewState;
    label: string;
    icon?: React.ElementType;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ElementType;
    subItems?: SubMenuItem[];
}

interface SidebarProps {
    currentView: ViewState;
    onChangeView: (view: ViewState) => void;
    isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen }) => {
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        'budgets': true
    });

    const toggleMenu = (id: string) => {
        setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Home', icon: Home },
        {
            id: 'budgets_group',
            label: 'Orçamentos',
            icon: FileText,
            subItems: [
                { id: 'budgets', label: 'Todos os Orçamentos' },
                { id: 'budgets_new', label: 'Novo Orçamento' },
                { id: 'budgets_templates', label: 'Modelos de Orçamento' }
            ]
        },
        { id: 'compositions', label: 'Composições', icon: Layers },
        {
            id: 'inputs_group',
            label: 'Insumos',
            icon: Package,
            subItems: [
                { id: 'inputs', label: 'Lista de Insumos' },
                { id: 'inputs_prices', label: 'Coleta de Preços' }
            ]
        },
        { id: 'planning', label: 'Planejamento de Obras', icon: Calendar },
        { id: 'measurements', label: 'Medições de Serviços', icon: Ruler },
        {
            id: 'journal_group',
            label: 'Diário de Obras',
            icon: Book,
            subItems: [
                { id: 'journal', label: 'Resumo do Diário' },
                { id: 'journal_logs', label: 'Registro de Atividades' },
                { id: 'journal_photos', label: 'Acompanhamento/Fotos' }
            ]
        },
        {
            id: 'purchases_group',
            label: 'Compras',
            icon: ShoppingCart,
            subItems: [
                { id: 'purchases_requests', label: 'Solicitação de Compras' },
                { id: 'purchases_control', label: 'Controle de Aquisições' }
            ]
        },
        {
            id: 'registrations_group',
            label: 'Cadastros',
            icon: ClipboardList,
            subItems: [
                { id: 'clients', label: 'Clientes' },
                { id: 'suppliers', label: 'Fornecedores' },
                { id: 'employees', label: 'Funcionários' }
            ]
        },
        { id: 'integrations', label: 'Integrações', icon: LinkIcon },
        {
            id: 'admin_group',
            label: 'Administração',
            icon: Settings,
            subItems: [
                { id: 'admin_company', label: 'Empresa', icon: Building },
                { id: 'admin_sectors', label: 'Setores', icon: Users },
                { id: 'admin_users', label: 'Usuários', icon: User },
                { id: 'databases', label: 'Bases Oficiais', icon: Database },
            ]
        },
    ];

    return (
        <aside
            className={cn(
                "bg-[#1e2124] text-gray-400 flex flex-col h-screen fixed left-0 top-0 z-[220] transition-all duration-300 notranslate",
                isOpen ? 'w-64' : 'w-0 -ml-64 md:ml-0 md:w-16 overflow-hidden'
            )}
        >
            <div className="h-16 flex items-center px-4 bg-[#1e2124] border-b border-gray-800 shrink-0">
                <div className="flex items-center space-x-2 text-white font-bold text-xl tracking-wider">
                    <Briefcase className="w-8 h-8 text-[#0070d2]" />
                    {isOpen && <span className="animate-fade-in">ORÇAPRO</span>}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isChildActive = item.subItems?.some(sub => sub.id === currentView);
                        const isActive = currentView === item.id || isChildActive;
                        const isExpanded = expandedMenus[item.id];
                        const hasSubmenu = !!item.subItems;

                        return (
                            <li key={item.id}>
                                <div
                                    className={cn(
                                        "relative flex items-center px-4 py-3 cursor-pointer transition-colors hover:bg-gray-800 hover:text-white group border-l-4 border-transparent",
                                        isActive && (!hasSubmenu || !isOpen) && "bg-gray-800 text-white border-[#0070d2]"
                                    )}
                                    onClick={() => {
                                        if (hasSubmenu) {
                                            if (!isExpanded) {
                                                // Expand and navigate to first sub-item
                                                toggleMenu(item.id);
                                                onChangeView(item.subItems![0].id);
                                            } else {
                                                // Just collapse if already expanded
                                                toggleMenu(item.id);
                                            }
                                        } else {
                                            onChangeView(item.id as ViewState);
                                        }
                                    }}
                                >
                                    <Icon className={cn("w-5 h-5 min-w-[20px]", (isActive || isChildActive) ? 'text-[#0070d2]' : 'text-gray-500 group-hover:text-white')} />
                                    {isOpen && (
                                        <span className="ml-3 text-sm font-medium whitespace-nowrap animate-fade-in">
                                            {item.label}
                                        </span>
                                    )}

                                    {hasSubmenu && isOpen && (
                                        <div className="ml-auto">
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </div>
                                    )}
                                </div>

                                {hasSubmenu && isExpanded && isOpen && (
                                    <ul className="bg-[#15171a] py-2 transition-all animate-fade-in">
                                        {item.subItems!.map((subItem) => {
                                            const isSubActive = currentView === subItem.id;
                                            return (
                                                <li
                                                    key={subItem.id}
                                                    className={cn(
                                                        "pl-6 pr-4 py-2 text-sm cursor-pointer flex items-center transition-colors",
                                                        isSubActive ? 'text-white bg-gray-800' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                                    )}
                                                    onClick={() => onChangeView(subItem.id)}
                                                >
                                                    <div className={cn("w-1 h-1 rounded-full mr-4", isSubActive ? 'bg-[#0070d2]' : 'bg-gray-600')} />
                                                    {isOpen && <span className="truncate animate-fade-in">{subItem.label}</span>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 bg-[#1e2124] border-t border-gray-800">
                <button className="w-full flex items-center justify-center space-x-2 bg-[#0070d2] hover:bg-[#005fb2] text-white py-2 rounded transition-colors shadow-lg shadow-blue-900/20 group">
                    <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                {isOpen && (
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-600 animate-fade-in">
                        <span>v2.6.0</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span>Online</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
