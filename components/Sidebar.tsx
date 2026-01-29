import React, { useState } from 'react';
import { 
  Home, FileText, Layers, Package, Database, Calendar, Book, 
  Ruler, ShoppingCart, Users, Link as LinkIcon, Video, Settings, 
  ChevronDown, ChevronRight, MessageSquare, Briefcase, Building, User,
  ClipboardList, HardHat
} from 'lucide-react';
import { ViewState } from '../types';

interface SubMenuItem {
  id: string;
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

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'admin': true // Default expanded for demo purposes
  });

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { 
      id: 'budgets', 
      label: 'Orçamentos', 
      icon: FileText,
      subItems: [
        { id: 'budgets', label: 'Todos os Orçamentos' },
        { id: 'budgets_new', label: 'Novo Orçamento' },
        { id: 'budgets_models', label: 'Modelos' }
      ]
    },
    { 
      id: 'compositions', 
      label: 'Composições', 
      icon: Layers,
      subItems: [
        { id: 'compositions', label: 'Catálogo Geral' },
        { id: 'comp_own', label: 'Bases Próprias' },
        { id: 'comp_cpu', label: 'CPU Analítica' }
      ]
    },
    { 
      id: 'inputs', 
      label: 'Insumos', 
      icon: Package,
      subItems: [
        { id: 'inputs', label: 'Lista de Insumos' },
        { id: 'inputs_prices', label: 'Coleta de Preços' }
      ]
    },
    { id: 'planning', label: 'Planejamento', icon: Calendar },
    { id: 'diary', label: 'Diário de Obras', icon: Book },
    { id: 'measurements', label: 'Medições', icon: Ruler },
    { id: 'purchases', label: 'Compras', icon: ShoppingCart },
    { 
      id: 'clients', 
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
      id: 'admin', 
      label: 'Administrar Empresa', 
      icon: Settings, 
      subItems: [
        { id: 'admin_company', label: 'Empresa', icon: Building },
        { id: 'admin_sectors', label: 'Setores', icon: Users },
        { id: 'admin_users', label: 'Usuários', icon: User },
        { id: 'databases', label: 'Bases', icon: Database }, // Mapped to databases view
      ]
    },
  ];

  return (
    <aside 
      className={`bg-[#1e2124] text-gray-400 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 -ml-64 md:ml-0 md:w-16 overflow-hidden'}`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 bg-[#1e2124] border-b border-gray-800 shrink-0">
        <div className="flex items-center space-x-2 text-white font-bold text-xl tracking-wider">
          <Briefcase className="w-8 h-8 text-[#0070d2]" />
          <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>ORÇAPRO</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if parent or any child is active
            const isChildActive = item.subItems?.some(sub => sub.id === currentView);
            const isActive = currentView === item.id || isChildActive;
            const isExpanded = expandedMenus[item.id];
            const hasSubmenu = !!item.subItems;

            return (
              <li key={item.id}>
                <div 
                  className={`relative flex items-center px-4 py-3 cursor-pointer transition-colors hover:bg-gray-800 hover:text-white group ${isActive && !hasSubmenu ? 'bg-gray-800 text-white border-l-4 border-[#0070d2]' : 'border-l-4 border-transparent'}`}
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleMenu(item.id);
                    } else {
                      onChangeView(item.id as ViewState);
                    }
                  }}
                >
                  <Icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-[#0070d2]' : 'text-gray-500 group-hover:text-white'}`} />
                  <span className={`ml-3 text-sm font-medium whitespace-nowrap ${isOpen ? 'block' : 'hidden md:hidden lg:block'}`}>
                    {item.label}
                  </span>
                  
                  {hasSubmenu && (isOpen || window.innerWidth >= 1024) && (
                    <div className="ml-auto">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  )}
                </div>
                
                {/* Submenu */}
                {hasSubmenu && isExpanded && (isOpen || window.innerWidth >= 1024) && (
                  <ul className="bg-[#15171a] py-2 transition-all animate-fade-in">
                    {item.subItems!.map((subItem) => {
                         const SubIcon = subItem.icon;
                         const isSubActive = currentView === subItem.id;
                         return (
                            <li 
                                key={subItem.id} 
                                className={`pl-6 pr-4 py-2 text-sm cursor-pointer flex items-center transition-colors ${
                                    isSubActive ? 'text-white bg-gray-800' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                                }`}
                                onClick={() => onChangeView(subItem.id as ViewState)}
                            >
                                {/* Indentation Line for visual hierarchy */}
                                <div className={`w-1 h-1 rounded-full mr-4 ${isSubActive ? 'bg-[#0070d2]' : 'bg-gray-600'}`}></div>
                                
                                {SubIcon && <SubIcon className={`w-4 h-4 mr-2 ${isSubActive ? 'text-[#0070d2]' : ''}`} />}
                                <span className="truncate">{subItem.label}</span>
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

      {/* Footer Support Button */}
      <div className="p-4 bg-[#1e2124] border-t border-gray-800">
        <button className="w-full flex items-center justify-center space-x-2 bg-[#0070d2] hover:bg-[#005fb2] text-white py-2 rounded transition-colors shadow-lg shadow-blue-900/20 group">
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className={`${isOpen ? 'block' : 'hidden'} md:hidden lg:block text-sm font-medium`}>Suporte Online</span>
        </button>
        <div className="mt-4 flex justify-between items-center text-xs text-gray-600 px-1">
          <span>v2.5.0</span>
          <div className="flex items-center">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></div>
             <span>Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;