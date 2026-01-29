import React, { useState } from 'react';
import { MainLayout } from './src/presentation/layouts/MainLayout';
import { DashboardPage } from './src/presentation/pages/DashboardPage';
import { BudgetsPage } from './src/presentation/pages/BudgetsPage';
import { ClientsPage } from './src/presentation/pages/ClientsPage';
import { DatabasePage } from './src/presentation/pages/DatabasePage';
import { InputsPage } from './src/presentation/pages/InputsPage';
import { CompositionsPage } from './src/presentation/pages/CompositionsPage';
import { PlanningPage } from './src/presentation/pages/PlanningPage';
import { MeasurementsPage } from './src/presentation/pages/MeasurementsPage';
import { PurchasingPage } from './src/presentation/pages/PurchasingPage';
import { JournalPage } from './src/presentation/pages/JournalPage';
import { RegistrationsPage } from './src/presentation/pages/RegistrationsPage';
import { IntegrationsPage } from './src/presentation/pages/IntegrationsPage';
import { AdminPage } from './src/presentation/pages/AdminPage';
import { BudgetTemplatesPage } from './src/presentation/pages/BudgetTemplatesPage';
import { PriceCollectionPage } from './src/presentation/pages/PriceCollectionPage';
import { BudgetForm } from './src/presentation/components/features/budget';
import { ModulePlaceholder } from './src/presentation/components/features/ModulePlaceholder';
import {
  Tag, ClipboardList, Book, ShoppingCart,
  Link as LinkIcon, Settings, Layers
} from 'lucide-react';
import { useBudgetStore } from './src/presentation/stores/use-budget-store';
import { ViewState } from './types';
import { Budget as DomainBudget, BudgetTemplate, BudgetStatus } from './src/domain/models/budget';
import { BudgetFormData } from './src/domain/validation/budget-schema';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [editingBudget, setEditingBudget] = useState<DomainBudget | null>(null);
  const [templateToUse, setTemplateToUse] = useState<BudgetTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { createBudget, updateBudget: updateBudgetStore } = useBudgetStore();

  const handleSaveBudget = async (formData: BudgetFormData) => {
    try {
      const budgetToSave: DomainBudget = {
        id: editingBudget?.id || uuidv4(),
        clientId: formData.clientId,
        client: editingBudget?.client || { id: formData.clientId, name: formData.clientName || 'Unknown', email: '', phone: '', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        items: formData.items.map(item => ({
          id: item.id || uuidv4(),
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          taxRate: item.taxRate || 0,
          stage: item.stage
        })),
        status: formData.status,
        validUntil: new Date(formData.expiryDate),
        notes: formData.notes,
        bdi: formData.bdi || 0,
        subtotal: formData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0),
        totalDirect: formData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0),
        totalTax: formData.items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * ((item.taxRate || 0) / 100)), 0),
        totalDiscount: formData.items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * ((item.discount || 0) / 100)), 0),
        total: 0,
        createdAt: editingBudget?.createdAt || new Date(formData.date),
        updatedAt: new Date(),
        schedulePeriods: editingBudget?.schedulePeriods,
        scheduleAllocations: editingBudget?.scheduleAllocations,
        measurements: editingBudget?.measurements
      };

      const bdiAmount = budgetToSave.subtotal * (budgetToSave.bdi / 100);
      budgetToSave.total = budgetToSave.subtotal + bdiAmount + budgetToSave.totalTax - budgetToSave.totalDiscount;

      if (editingBudget) {
        await updateBudgetStore(budgetToSave.id, budgetToSave);
      } else {
        await createBudget(budgetToSave);
      }

      setIsEditing(false);
      setEditingBudget(null);
      setTemplateToUse(null);
      setCurrentView('budgets');
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Erro ao salvar orçamento. Verifique os logs.");
    }
  };

  const handleNewBudget = () => {
    setEditingBudget(null);
    setTemplateToUse(null);
    setIsEditing(true);
  };

  const handleEditBudget = (budget: DomainBudget) => {
    setEditingBudget(budget);
    setTemplateToUse(null);
    setIsEditing(true);
  };

  const renderContent = () => {
    if (isEditing) {
      // Logic for pre-filling: Edit > Template > Empty
      const initialFormValues = editingBudget ? {
        items: editingBudget.items.map(i => ({ ...i, taxRate: i.taxRate || 0 })),
        status: editingBudget.status,
        clientId: editingBudget.clientId,
        clientName: editingBudget.client?.name,
        date: editingBudget.createdAt.toISOString().split('T')[0],
        expiryDate: editingBudget.validUntil.toISOString().split('T')[0],
        notes: editingBudget.notes,
        bdi: editingBudget.bdi || 0
      } : (templateToUse ? {
        items: templateToUse.items.map(i => ({ ...i, id: uuidv4() })),
        status: BudgetStatus.DRAFT,
        date: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: templateToUse.notes,
        bdi: templateToUse.bdi
      } : undefined);

      return (
        <div className="h-full">
          <BudgetForm
            onSave={handleSaveBudget}
            onCancel={() => {
              setIsEditing(false);
              setEditingBudget(null);
              setTemplateToUse(null);
            }}
            initialData={initialFormValues as any}
          />
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentView} />;
      case 'budgets':
        return (
          <BudgetsPage
            onNewBudget={handleNewBudget}
            onEditBudget={handleEditBudget}
          />
        );
      case 'budgets_new':
        return (
          <div className="h-full">
            <BudgetForm
              onSave={handleSaveBudget}
              onCancel={() => setCurrentView('budgets')}
            />
          </div>
        );
      case 'clients':
        return <ClientsPage />;
      case 'databases':
        return <div className="h-full"><DatabasePage /></div>;
      case 'inputs':
        return <div className="h-full"><InputsPage /></div>;
      case 'compositions':
      case 'compositions_own':
      case 'compositions_cpu':
        return <div className="h-full"><CompositionsPage currentView={currentView} /></div>;
      case 'planning':
        return <PlanningPage />;
      case 'measurements':
        return <MeasurementsPage />;
      case 'purchases':
      case 'purchases_requests':
      case 'purchases_control':
        return <PurchasingPage currentView={currentView} />;
      case 'journal':
      case 'journal_logs':
      case 'journal_photos':
        return <JournalPage currentView={currentView} />;
      case 'registrations':
      case 'suppliers':
      case 'employees':
        return <RegistrationsPage currentView={currentView} />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'admin':
      case 'admin_company':
      case 'admin_sectors':
      case 'admin_users':
        return <AdminPage />;
      case 'budgets_templates':
        return (
          <BudgetTemplatesPage
            onUseTemplate={(template) => {
              setEditingBudget(null);
              setTemplateToUse(template);
              setIsEditing(true);
            }}
          />
        );
      case 'inputs_prices':
        return <div className="h-full"><PriceCollectionPage /></div>;
      case 'settings':
        return (
          <ModulePlaceholder
            title="Módulo Técnico"
            subtitle="Ferramentas avançadas de engenharia e orçamentação."
            icon={Layers}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400 animate-fade-in p-6">
            <div className="bg-slate-100 p-8 rounded-full mb-6 shadow-inner">
              <Tag className="w-16 h-16 text-slate-300" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-600 mb-2">Módulo {currentView}</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Esta funcionalidade está em desenvolvimento e estará disponível na próxima atualização.
              </p>
              <button onClick={() => setCurrentView('dashboard')} className="mt-6 text-[#0070d2] font-medium hover:underline">
                Voltar para o Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout currentView={currentView} onNavigate={(view) => {
      setCurrentView(view);
      setIsEditing(false);
    }}>
      {renderContent()}
    </MainLayout>
  );
};

export default App;