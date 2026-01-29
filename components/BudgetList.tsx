import React from 'react';
import { Plus, Search, MoreHorizontal, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Budget, BudgetStatus } from '../types';

interface BudgetListProps {
  budgets: Budget[];
  onNewBudget: () => void;
  onEditBudget: (budget: Budget) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onNewBudget, onEditBudget }) => {
  const getStatusColor = (status: BudgetStatus) => {
    switch (status) {
      case BudgetStatus.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case BudgetStatus.SENT: return 'bg-blue-100 text-blue-700 border-blue-200';
      case BudgetStatus.DRAFT: return 'bg-slate-100 text-slate-700 border-slate-200';
      case BudgetStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: BudgetStatus) => {
     switch (status) {
      case BudgetStatus.APPROVED: return <CheckCircle className="w-3 h-3 mr-1" />;
      case BudgetStatus.SENT: return <FileText className="w-3 h-3 mr-1" />;
      case BudgetStatus.REJECTED: return <XCircle className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Orçamentos</h1>
          <p className="text-slate-500">Gerencie todas as propostas comerciais em um só lugar.</p>
        </div>
        <button 
          onClick={onNewBudget}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Orçamento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, número ou valor..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <select className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
                 <option>Todos os Status</option>
                 <option>Aprovados</option>
                 <option>Em Aberto</option>
             </select>
             <select className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none">
                 <option>Mais recentes</option>
                 <option>Maior valor</option>
             </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Número / Data</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Validade</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgets.map((budget) => (
                <tr key={budget.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(budget.status)}`}>
                      {getStatusIcon(budget.status)}
                      {budget.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">#{budget.id}</div>
                    <div className="text-slate-500 text-xs">{new Date(budget.date).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{budget.clientName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(budget.expiryDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    R$ {budget.grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                        onClick={() => onEditBudget(budget)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {budgets.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                          Nenhum orçamento encontrado.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm text-slate-500">Mostrando {budgets.length} resultados</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-300 rounded bg-white text-sm text-slate-600 disabled:opacity-50" disabled>Anterior</button>
                <button className="px-3 py-1 border border-slate-300 rounded bg-white text-sm text-slate-600 hover:bg-slate-50">Próximo</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetList;