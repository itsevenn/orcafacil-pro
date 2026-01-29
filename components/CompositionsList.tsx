import React from 'react';
import { Layers, Search, Filter, Download, MoreHorizontal, ChevronRight } from 'lucide-react';
import { MOCK_SINAPI, MOCK_ORSE } from '../constants';

const CompositionsList: React.FC = () => {
  const allCompositions = [...MOCK_SINAPI, ...MOCK_ORSE].filter(i => i.type === 'Composition');

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catálogo de Composições</h1>
          <p className="text-slate-500">Explore composições analíticas do SINAPI, ORSE e Próprias.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center shadow-sm text-sm font-medium">
                <Download className="w-4 h-4 mr-2" />
                Exportar
            </button>
            <button className="bg-[#0070d2] hover:bg-[#005fb2] text-white px-4 py-2 rounded-lg flex items-center shadow-sm text-sm font-medium">
                <Layers className="w-4 h-4 mr-2" />
                Nova Composição
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 shrink-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar código ou descrição..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070d2]"
            />
          </div>
          <div className="flex gap-2">
              <select className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#0070d2]">
                  <option>Todas as Bases</option>
                  <option>SINAPI</option>
                  <option>ORSE</option>
                  <option>Própria</option>
              </select>
              <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600">
                  <Filter className="w-5 h-5" />
              </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 w-20">Fonte</th>
                        <th className="px-6 py-3 w-32">Código</th>
                        <th className="px-6 py-3">Descrição da Composição</th>
                        <th className="px-6 py-3 w-24">Unid.</th>
                        <th className="px-6 py-3 w-32 text-right">Preço Unit.</th>
                        <th className="px-6 py-3 w-32 text-center">Ref.</th>
                        <th className="px-6 py-3 w-16"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {allCompositions.map((comp) => (
                        <tr key={comp.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                            <td className="px-6 py-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    comp.source === 'SINAPI' 
                                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                }`}>
                                    {comp.source}
                                </span>
                            </td>
                            <td className="px-6 py-3 font-mono text-slate-600 font-medium">{comp.code}</td>
                            <td className="px-6 py-3 text-slate-800 font-medium">
                                <div className="line-clamp-1 group-hover:line-clamp-none group-hover:text-[#0070d2] transition-colors">{comp.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{comp.category}</div>
                            </td>
                            <td className="px-6 py-3 text-slate-500">{comp.unit}</td>
                            <td className="px-6 py-3 text-right font-bold text-slate-700">
                                R$ {comp.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </td>
                            <td className="px-6 py-3 text-center text-xs text-slate-500">
                                {comp.referenceDate} <br/> {comp.region}
                            </td>
                            <td className="px-6 py-3 text-right">
                                <button className="text-slate-300 hover:text-[#0070d2]">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* Mock rows to fill space visually if needed */}
                    {Array.from({length: 5}).map((_, i) => (
                         <tr key={`mock-${i}`} className="hover:bg-slate-50">
                            <td className="px-6 py-3"><div className="h-4 w-12 bg-slate-100 rounded animate-pulse"></div></td>
                            <td className="px-6 py-3"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div></td>
                            <td className="px-6 py-3"><div className="h-4 w-64 bg-slate-100 rounded animate-pulse"></div></td>
                            <td className="px-6 py-3"><div className="h-4 w-8 bg-slate-100 rounded animate-pulse"></div></td>
                            <td className="px-6 py-3"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse ml-auto"></div></td>
                            <td className="px-6 py-3"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse mx-auto"></div></td>
                             <td className="px-6 py-3"></td>
                         </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="bg-slate-50 border-t border-slate-200 p-3 text-xs text-slate-500 flex justify-between items-center shrink-0">
             <span>Mostrando {allCompositions.length} de 15.420 registros</span>
             <div className="flex gap-2">
                 <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100">Anterior</button>
                 <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100">Próximo</button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionsList;