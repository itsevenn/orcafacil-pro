import React, { useEffect, useState } from 'react';
import { useBudgetStore } from '../stores/use-budget-store';
import { useClientStore } from '../stores/use-client-store';
import { useReminderStore } from '../stores/use-reminder-store';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import {
    FileText, Users, DollarSign, TrendingUp, Plus, ArrowRight, Database,
    CheckCircle2, X, LayoutGrid, Package, Calendar, Activity,
    ClipboardList, HardHat, Sparkles, Clock, ChevronRight, Calculator, Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ViewState } from '../../../types';

interface DashboardPageProps {
    onNavigate?: (view: ViewState) => void;
}

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
    const { budgets, fetchBudgets } = useBudgetStore();
    const { clients, fetchClients } = useClientStore();
    const { reminders, fetchReminders, addReminder, removeReminder, toggleReminder } = useReminderStore();

    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [isSeeAllModalOpen, setIsSeeAllModalOpen] = useState(false);
    const [newReminder, setNewReminder] = useState({ text: '', priority: 'MEDIUM' as any, dueDate: '' });

    useEffect(() => {
        fetchBudgets();
        fetchClients();
        fetchReminders();
    }, [fetchBudgets, fetchClients, fetchReminders]);

    const handleAddReminder = () => {
        if (!newReminder.text) return;
        addReminder({
            text: newReminder.text,
            priority: newReminder.priority,
            dueDate: newReminder.dueDate ? new Date(newReminder.dueDate) : new Date(),
        });
        setNewReminder({ text: '', priority: 'MEDIUM', dueDate: '' });
        setIsReminderModalOpen(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500';
            case 'MEDIUM': return 'bg-amber-500';
            case 'LOW': return 'bg-emerald-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
            {/* Top Banner */}
            <div className="bg-[#ecfdf5] border-b border-emerald-100 px-6 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                    <span className="font-bold">Ótimo:</span> Bases do SINAPI atualizadas com sucesso hoje às 06:00.
                </div>
                <button className="text-emerald-500 hover:text-emerald-700">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-8 flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto w-full">
                {/* Main Content (Left) */}
                <div className="flex-1 space-y-10">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Visão Geral</h1>
                            <p className="text-slate-500 mt-1">Bem-vindo ao OrçaPro. Aqui está o resumo das suas obras.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-600">Sistema Operacional</span>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Revenue */}
                        <div className="bg-[#0070d2] text-white rounded-3xl p-6 shadow-lg shadow-blue-200/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                                <div className="bg-white/20 p-3 rounded-xl">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="relative z-10 space-y-1">
                                <p className="text-blue-100 text-sm font-medium">Total em Propostas</p>
                                <div className="text-4xl font-black pt-2 pb-4 tracking-tight">R$ 1.2M</div>
                                <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg text-xs font-bold border border-white/10">
                                    <TrendingUp className="w-3 h-3" />
                                    +12% vs mês anterior
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Active Works */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">Obras em Andamento</p>
                                    <h3 className="text-4xl font-black text-slate-900 pt-2">4</h3>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-xl">
                                    <Clock className="w-6 h-6 text-orange-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-[66%]" />
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">66% de capacidade ocupada</p>
                            </div>
                        </div>

                        {/* Card 3: Conversion Rate */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">Taxa de Conversão</p>
                                    <h3 className="text-4xl font-black text-slate-900 pt-2">28%</h3>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-xl">
                                    <Activity className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[80%]" />
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Meta: 35%</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
                            <LayoutGrid className="w-5 h-5 text-blue-500" />
                            Acesso Rápido
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { view: 'budgets' as ViewState, label: 'Orçamentos', sub: '3 itens', icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { view: 'compositions' as ViewState, label: 'Composições', sub: '1420 itens', icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { view: 'inputs' as ViewState, label: 'Insumos', sub: '5302 itens', icon: Database, color: 'text-orange-500', bg: 'bg-orange-50' },
                                { view: 'planning' as ViewState, label: 'Planejamento', sub: '3 itens', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
                                { view: 'measurements' as ViewState, label: 'Medições', sub: '8 itens', icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                                { view: 'journal' as ViewState, label: 'Diário de Obra', sub: '12 itens', icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-50' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => onNavigate?.(item.view)}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center"
                                >
                                    <div className={cn("p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform", item.bg)}>
                                        <item.icon className={cn("w-6 h-6", item.color)} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-slate-900 text-xl">Desempenho Financeiro</h3>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest">
                                Histórico Completo <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0070d2" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#0070d2" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#0070d2"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="w-full lg:w-80 space-y-8">
                    {/* Lembretes */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold text-slate-900 uppercase tracking-tight text-xs">Lembretes</h3>
                            </div>
                            <button
                                onClick={() => setIsSeeAllModalOpen(true)}
                                className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest">Ver tudo</button>
                        </div>
                        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {reminders.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-8 font-medium italic">Nenhum lembrete pendente.</p>
                            ) : (
                                reminders.slice(0, 5).map((rem) => (
                                    <div key={rem.id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors group border border-transparent hover:border-slate-100 flex items-start gap-4">
                                        <div
                                            onClick={() => toggleReminder(rem.id)}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 cursor-pointer shadow-sm",
                                                rem.completed ? 'bg-slate-200' : getPriorityColor(rem.priority)
                                            )}
                                        />
                                        <div className="flex-1 space-y-1">
                                            <p className={cn(
                                                "text-sm font-semibold leading-snug transition-all",
                                                rem.completed ? 'text-slate-300 line-through' : 'text-slate-800'
                                            )}>
                                                {rem.text}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {rem.dueDate.toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={() => setIsReminderModalOpen(true)}
                                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs font-bold hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3 h-3" /> Adicionar Tarefa
                            </button>
                        </div>
                    </div>

                    {/* AI Promo Card */}
                    <div className="bg-[#0f172a] rounded-3xl p-6 relative overflow-hidden group shadow-xl">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl transition-transform group-hover:scale-150" />
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-1.5 bg-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900">
                                <Sparkles className="w-3 h-3" /> Novo Módulo
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Inteligência Artificial</h3>
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                Gere descrições técnicas e analise preços com nossa nova IA integrada.
                            </p>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400" /> Atividade Recente
                        </h3>
                        <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-2">
                            {[
                                { user: 'Roberto Silva', action: 'visualizou o orçamento #2024-01', time: '2 min atrás' },
                                { user: 'Amanda Costa', action: 'aprovou a medição de Novembro', time: '4 horas atrás' },
                            ].map((act, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-600 font-medium">
                                            <span className="font-bold text-slate-900">{act.user}</span> {act.action}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reminder Modal */}
            <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">Novo Lembrete</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="text">O que precisa ser feito?</Label>
                            <Input
                                id="text"
                                placeholder="Descreva a tarefa..."
                                value={newReminder.text}
                                onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="priority">Prioridade</Label>
                                <Select
                                    id="priority"
                                    value={newReminder.priority}
                                    onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value as any })}
                                >
                                    <option value="LOW">Baixa</option>
                                    <option value="MEDIUM">Média</option>
                                    <option value="HIGH">Alta</option>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Data Limite</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newReminder.dueDate}
                                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReminderModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddReminder} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Criar Lembrete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* See All Reminders Modal */}
            <Dialog open={isSeeAllModalOpen} onOpenChange={setIsSeeAllModalOpen}>
                <DialogContent className="max-w-2xl bg-white rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-8 border-b border-slate-50">
                        <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-500" />
                            Todos os Lembretes
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
                        {reminders.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-12">Nenhum lembrete cadastrado.</p>
                        ) : (
                            reminders.map((rem) => (
                                <div key={rem.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all group">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div
                                            onClick={() => toggleReminder(rem.id)}
                                            className={cn(
                                                "w-4 h-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all",
                                                rem.completed ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"
                                            )}
                                        >
                                            {rem.completed && <Plus className="w-2 h-2 text-white rotate-45" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn(
                                                "text-sm font-bold transition-all",
                                                rem.completed ? "text-slate-400 line-through" : "text-slate-800"
                                            )}>
                                                {rem.text}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rem.dueDate.toLocaleDateString('pt-BR')}</span>
                                                <span className={cn("px-2 py-0.5 rounded-full text-white", getPriorityColor(rem.priority))}>
                                                    {rem.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeReminder(rem.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                        <Button onClick={() => setIsSeeAllModalOpen(false)} className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
