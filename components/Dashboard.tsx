import React from 'react';
import { 
  Code, PlusSquare, PackagePlus, Hourglass, Activity, ClipboardList, ShoppingCart, 
  RefreshCw, BarChart2, Zap, Droplets, AlignJustify, Gem, Users, TrendingUp, DollarSign,
  CheckSquare, Clock, ArrowRight
} from 'lucide-react';
import { Budget } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  budgets: Budget[];
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

const TASKS = [
    { id: 1, text: 'Enviar proposta revisada para Construtora ABC', due: 'Hoje, 14:00', priority: 'high' },
    { id: 2, text: 'Reunião de alinhamento com equipe de engenharia', due: 'Amanhã, 09:00', priority: 'medium' },
    { id: 3, text: 'Atualizar índices do SINAPI (Mês ref. 11/2023)', due: '15/11', priority: 'low' },
    { id: 4, text: 'Follow-up cliente Roberto Silva', due: '16/11', priority: 'medium' },
];

const Dashboard: React.FC<DashboardProps> = ({ budgets }) => {
  
  const modules = [
    { id: 1, title: 'Orçamentos', icon: Code, count: budgets.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, title: 'Composições', icon: PlusSquare, count: 1420, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 3, title: 'Insumos', icon: PackagePlus, count: 5302, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 4, title: 'Planejamento', icon: Hourglass, count: 3, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 5, title: 'Medições', icon: Activity, count: 8, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 6, title: 'Diário de Obra', icon: ClipboardList, count: 12, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
                    <p className="text-sm text-slate-500">Bem-vindo ao OrçaPro. Aqui está o resumo das suas obras.</p>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-slate-600">Sistema Operacional</span>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gradient-to-br from-[#0070d2] to-[#005fb2] rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                     <div className="relative z-10">
                        <div className="flex justify-between items-start">
                             <div>
                                 <p className="text-blue-100 text-sm font-medium mb-1">Total em Propostas</p>
                                 <h3 className="text-3xl font-bold">R$ 1.2M</h3>
                             </div>
                             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                 <DollarSign className="w-6 h-6 text-white" />
                             </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-blue-100 bg-white/10 w-fit px-2 py-1 rounded">
                             <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mês anterior
                        </div>
                     </div>
                     <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                 </div>

                 <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover-card">
                     <div className="flex justify-between items-start mb-4">
                         <div>
                             <p className="text-slate-500 text-sm font-medium mb-1">Obras em Andamento</p>
                             <h3 className="text-3xl font-bold text-slate-800">4</h3>
                         </div>
                         <div className="bg-orange-50 p-2 rounded-lg">
                             <Hourglass className="w-6 h-6 text-orange-500" />
                         </div>
                     </div>
                     <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-orange-500 h-full w-2/3"></div>
                     </div>
                     <p className="text-xs text-slate-400 mt-2">66% de capacidade ocupada</p>
                 </div>

                 <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover-card">
                     <div className="flex justify-between items-start mb-4">
                         <div>
                             <p className="text-slate-500 text-sm font-medium mb-1">Taxa de Conversão</p>
                             <h3 className="text-3xl font-bold text-slate-800">28%</h3>
                         </div>
                         <div className="bg-emerald-50 p-2 rounded-lg">
                             <Activity className="w-6 h-6 text-emerald-500" />
                         </div>
                     </div>
                     <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-emerald-500 h-full w-[28%]"></div>
                     </div>
                     <p className="text-xs text-slate-400 mt-2">Meta: 35%</p>
                 </div>
            </div>

            {/* Modules Grid */}
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <AlignJustify className="w-5 h-5 mr-2 text-[#0070d2]" /> Acesso Rápido
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {modules.map((mod) => (
                    <div key={mod.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:border-blue-300 cursor-pointer group">
                        <div className={`p-3 rounded-full ${mod.bg} mb-3 group-hover:scale-110 transition-transform`}>
                            <mod.icon className={`w-6 h-6 ${mod.color}`} />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-700">{mod.title}</h3>
                        <span className="text-xs text-slate-400 mt-1">{mod.count} itens</span>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho Financeiro</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0070d2" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#0070d2" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                                itemStyle={{color: '#0070d2', fontWeight: 600}}
                            />
                            <Area type="monotone" dataKey="value" stroke="#0070d2" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="text-xs text-center text-slate-400 pb-4">
                OrçaPro v2.5.0 &copy; 2026. Todos os direitos reservados.
            </div>
        </div>

        {/* Right Sidebar - Feed & Notifications */}
        <div className="w-full lg:w-80 bg-white border-l border-slate-200 p-6 shrink-0 lg:h-full overflow-y-auto hidden xl:block">
            
            {/* Tasks Section (New) */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center">
                        <CheckSquare className="w-5 h-5 mr-2 text-[#0070d2]" /> Lembretes
                    </h2>
                    <button className="text-xs font-semibold text-[#0070d2] hover:underline">Ver tudo</button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {TASKS.map(task => (
                        <div key={task.id} className="p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 shrink-0 ${
                                    task.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                                    task.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-500'
                                }`} title={`Prioridade: ${task.priority}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 group-hover:text-[#0070d2] transition-colors line-clamp-2 leading-snug">{task.text}</p>
                                    <div className="flex items-center mt-1.5 text-xs text-slate-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {task.due}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-2.5 text-xs font-bold text-[#0070d2] hover:bg-blue-50 transition-colors flex items-center justify-center border-t border-slate-100">
                        + Adicionar Tarefa
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Novidades</h2>
                <div className="bg-[#0f172a] rounded-xl overflow-hidden relative text-white p-6 shadow-xl group cursor-pointer">
                    <div className="relative z-10">
                        <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block">Novo Módulo</span>
                        <h4 className="font-bold mb-2 text-lg">Inteligência Artificial</h4>
                        <p className="text-slate-300 text-xs mb-4 leading-relaxed">
                            Gere descrições técnicas e analise preços com nossa nova IA integrada.
                        </p>
                        <div className="w-full bg-white/10 h-1 rounded overflow-hidden">
                             <div className="bg-blue-500 h-full w-0 group-hover:w-full transition-all duration-1000"></div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full mix-blend-overlay filter blur-2xl opacity-20 -mr-10 -mt-10"></div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Atividade Recente</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold">Roberto Silva</span> visualizou o orçamento <span className="text-blue-600">#1234</span>
                                </p>
                                <span className="text-xs text-slate-400">Há 2 horas</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;