import React, { useEffect, useState } from 'react';
import { useBudgetStore } from '../stores/use-budget-store';
import { Budget, BudgetStatus } from '../../domain/models/budget';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
    Plus, Search, Filter, MoreHorizontal, FileText,
    Calendar, ArrowUpRight, ArrowDownRight, Trash2, Edit, TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ABCReportDialog } from '../components/features/database/ABCReportDialog';

interface BudgetsPageProps {
    onNewBudget: () => void;
    onEditBudget: (budget: Budget) => void;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({ onNewBudget, onEditBudget }) => {
    const { budgets, fetchBudgets, deleteBudget, isLoading } = useBudgetStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [isABCReportOpen, setIsABCReportOpen] = useState(false);
    const [selectedBudgetForABC, setSelectedBudgetForABC] = useState<Budget | null>(null);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    const handleOpenABC = (budget: Budget, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedBudgetForABC(budget);
        setIsABCReportOpen(true);
    };

    const filteredBudgets = budgets.filter(budget => {
        const clientName = budget.client?.name || '';
        const matchesSearch =
            clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            budget.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            budget.clientId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || budget.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este orçamento?')) {
            await deleteBudget(id);
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 h-full flex flex-col animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orçamentos</h1>
                    <p className="text-slate-500 mt-1">Gerencie suas propostas e acompanhe negociações.</p>
                </div>
                <Button onClick={onNewBudget}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Orçamento
                </Button>
            </div>

            {/* Filters */}
            <Card className="shrink-0">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por cliente ou número..."
                            className="pl-9 bg-slate-50 border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('ALL')}
                            className="text-xs"
                        >
                            Todos
                        </Button>
                        <Button
                            variant={statusFilter === BudgetStatus.DRAFT ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(BudgetStatus.DRAFT)}
                            className="text-xs"
                        >
                            Rascunhos
                        </Button>
                        <Button
                            variant={statusFilter === BudgetStatus.APPROVED ? 'default' : 'outline'}
                            onClick={() => setStatusFilter(BudgetStatus.APPROVED)}
                            className="text-xs"
                        >
                            Aprovados
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* List */}
            <div className="flex-1 overflow-auto space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-10"><span className="animate-spin text-blue-600">Loading...</span></div>
                ) : filteredBudgets.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">Nenhum orçamento encontrado.</div>
                ) : (
                    filteredBudgets.map((budget) => (
                        <div
                            key={budget.id}
                            onClick={() => onEditBudget(budget)}
                            className="bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {budget.client?.name || 'Cliente sem nome'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(budget.updatedAt).toLocaleDateString('pt-BR')}</span>
                                        <span>•</span>
                                        <span>Ref: {budget.id.substring(0, 8)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-900">{formatCurrency(budget.total)}</div>
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                        budget.status === BudgetStatus.APPROVED ? "bg-emerald-100 text-emerald-700" :
                                            budget.status === BudgetStatus.DRAFT ? "bg-slate-100 text-slate-600" :
                                                "bg-blue-100 text-blue-700"
                                    )}>
                                        {budget.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50" onClick={(e) => handleOpenABC(budget, e)} title="Relatório ABC">
                                        <TrendingUp className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); onEditBudget(budget); }}>
                                        <Edit className="w-4 h-4 text-slate-500" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => handleDelete(e, budget.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ABCReportDialog
                open={isABCReportOpen}
                onOpenChange={setIsABCReportOpen}
                budget={selectedBudgetForABC}
            />
        </div>
    );
};
