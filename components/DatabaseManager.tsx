import React, { useState } from 'react';
import { 
  Database, RefreshCw, CheckCircle, AlertTriangle, Search, 
  Server, Settings, X, Globe, Calendar, Save, Check, Ban
} from 'lucide-react';
import { MOCK_CATALOG, MOCK_SYNC_STATUS } from '../constants';
import { SourceType } from '../types';

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface DbConfig {
  sources: {
    SINAPI: boolean;
    ORSE: boolean;
  };
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'MANUAL';
  regions: string[];
}

const DatabaseManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<SourceType | 'ALL'>('ALL');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Configuration State
  const [config, setConfig] = useState<DbConfig>({
    sources: { SINAPI: true, ORSE: true },
    frequency: 'MONTHLY',
    regions: ['SP', 'SE', 'RJ', 'MG']
  });

  // Temporary state for the modal (to allow cancelling changes)
  const [tempConfig, setTempConfig] = useState<DbConfig>(config);

  const handleOpenSettings = () => {
    setTempConfig(config);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    setConfig(tempConfig);
    setShowSettings(false);
    // Here you would typically make an API call to save preferences
  };

  const handleSync = (source: string) => {
    setIsSyncing(source);
    // Simulate sync delay
    setTimeout(() => {
      setIsSyncing(null);
      alert(`${source} sincronizado com sucesso!`);
    }, 2000);
  };

  const toggleRegion = (uf: string) => {
    setTempConfig(prev => {
      const exists = prev.regions.includes(uf);
      return {
        ...prev,
        regions: exists 
          ? prev.regions.filter(r => r !== uf)
          : [...prev.regions, uf]
      };
    });
  };

  const toggleSource = (source: 'SINAPI' | 'ORSE') => {
    setTempConfig(prev => ({
      ...prev,
      sources: {
        ...prev.sources,
        [source]: !prev.sources[source]
      }
    }));
  };

  // Filter items based on search AND enabled sources
  const filteredItems = MOCK_CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.includes(searchTerm);
    const matchesSourceFilter = filterSource === 'ALL' || item.source === filterSource;
    
    // Check if the source is enabled in config
    const isSourceEnabled = item.source === 'INTERNAL' || 
                            (item.source === 'SINAPI' && config.sources.SINAPI) || 
                            (item.source === 'ORSE' && config.sources.ORSE);

    return matchesSearch && matchesSourceFilter && item.source !== 'INTERNAL' && isSourceEnabled;
  });

  const activeSyncStatus = MOCK_SYNC_STATUS.filter(status => 
    (status.source === 'SINAPI' && config.sources.SINAPI) || 
    (status.source === 'ORSE' && config.sources.ORSE)
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bases Oficiais e Integrações</h1>
          <p className="text-slate-500">Gerencie a sincronização com SINAPI e ORSE e consulte composições.</p>
        </div>
        <button 
          onClick={handleOpenSettings}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
            <Settings className="w-4 h-4" />
            <span>Configurações Avançadas</span>
        </button>
      </div>

      {/* Sync Status Cards */}
      {activeSyncStatus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeSyncStatus.map((status) => (
            <div key={status.source} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${status.source === 'SINAPI' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                    <Server className={`w-6 h-6 ${status.source === 'SINAPI' ? 'text-blue-600' : 'text-orange-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{status.source}</h3>
                    <p className="text-sm text-slate-500">Tabela Oficial</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  status.status === 'Synced' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {status.status === 'Synced' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  <span>{status.status === 'Synced' ? 'Atualizado' : 'Desatualizado'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Mês de Referência</p>
                  <p className="font-semibold text-slate-900">{status.referenceMonth}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Região / UF</p>
                  <p className="font-semibold text-slate-900">{status.region}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Itens Indexados</p>
                  <p className="font-semibold text-slate-900">{status.itemCount.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Última Varredura</p>
                  <p className="font-semibold text-slate-900">{status.lastUpdate.split(' ')[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
                 <span>Frequência: {config.frequency}</span>
                 <span>Regiões: {config.regions.join(', ')}</span>
              </div>

              <button 
                onClick={() => handleSync(status.source)}
                disabled={isSyncing === status.source || status.status === 'Synced'}
                className={`w-full py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  isSyncing === status.source 
                    ? 'bg-slate-100 text-slate-400 cursor-wait'
                    : status.status === 'Synced'
                      ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing === status.source ? 'animate-spin' : ''}`} />
                <span>
                  {isSyncing === status.source ? 'Sincronizando...' : status.status === 'Synced' ? 'Verificar Atualizações' : 'Sincronizar Agora'}
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
            <Ban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Nenhuma fonte de dados ativa</h3>
            <p className="text-slate-500 mt-2">Habilite o SINAPI ou ORSE nas configurações avançadas para visualizar os dados.</p>
            <button onClick={handleOpenSettings} className="mt-4 text-indigo-600 font-medium hover:underline">Abrir Configurações</button>
        </div>
      )}

      {/* Database Browser */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center">
            <Database className="w-4 h-4 mr-2" /> Explorador de Itens
          </h3>
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar código ou descrição..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
             <select 
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as SourceType | 'ALL')}
                className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              >
                 <option value="ALL">Todas as Fontes</option>
                 {config.sources.SINAPI && <option value="SINAPI">SINAPI</option>}
                 {config.sources.ORSE && <option value="ORSE">ORSE</option>}
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Fonte</th>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Unid.</th>
                <th className="px-6 py-3 text-right">Preço Ref.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.source === 'SINAPI' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.source}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-slate-600">{item.code}</td>
                  <td className="px-6 py-3 font-medium text-slate-900 max-w-md truncate" title={item.name}>
                    {item.name}
                  </td>
                  <td className="px-6 py-3 text-slate-500">{item.type}</td>
                  <td className="px-6 py-3 text-slate-500">{item.unit}</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-900">
                    R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
               {filteredItems.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                          {activeSyncStatus.length === 0 
                            ? "Nenhuma fonte habilitada."
                            : "Nenhum item encontrado com os filtros atuais."}
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Configurações de Integração</h2>
                        <p className="text-sm text-slate-500">Defina quais bases o sistema deve consultar.</p>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    
                    {/* Section 1: Data Sources */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center">
                            <Database className="w-4 h-4 mr-2 text-indigo-600" /> Fontes de Dados
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => toggleSource('SINAPI')}
                                className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-between transition-all ${tempConfig.sources.SINAPI ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${tempConfig.sources.SINAPI ? 'bg-indigo-200' : 'bg-slate-100'}`}>
                                        <Server className="w-6 h-6 text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">SINAPI</div>
                                        <div className="text-xs text-slate-500">Caixa Econômica Federal</div>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${tempConfig.sources.SINAPI ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                    {tempConfig.sources.SINAPI && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </div>

                            <div 
                                onClick={() => toggleSource('ORSE')}
                                className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-between transition-all ${tempConfig.sources.ORSE ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${tempConfig.sources.ORSE ? 'bg-indigo-200' : 'bg-slate-100'}`}>
                                        <Server className="w-6 h-6 text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">ORSE</div>
                                        <div className="text-xs text-slate-500">CEHOP - Sergipe</div>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${tempConfig.sources.ORSE ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                    {tempConfig.sources.ORSE && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Frequency */}
                    <section>
                         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-indigo-600" /> Frequência de Atualização
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['DAILY', 'WEEKLY', 'MONTHLY', 'MANUAL'].map((freq) => (
                                <button
                                    key={freq}
                                    onClick={() => setTempConfig({...tempConfig, frequency: freq as any})}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                        tempConfig.frequency === freq 
                                        ? 'bg-indigo-600 text-white border-indigo-600' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {freq === 'DAILY' && 'Diária'}
                                    {freq === 'WEEKLY' && 'Semanal'}
                                    {freq === 'MONTHLY' && 'Mensal'}
                                    {freq === 'MANUAL' && 'Manual'}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            A atualização automática ocorrerá sempre às 02:00 AM do período selecionado.
                        </p>
                    </section>

                    {/* Section 3: Regions */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-indigo-600" /> Abrangência Regional (UF)
                        </h3>
                        <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                            {BRAZIL_STATES.map(uf => {
                                const isSelected = tempConfig.regions.includes(uf);
                                return (
                                    <button
                                        key={uf}
                                        onClick={() => toggleRegion(uf)}
                                        className={`h-10 rounded-lg text-sm font-bold transition-all border ${
                                            isSelected 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                                            : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                        }`}
                                    >
                                        {uf}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Selecione apenas os estados onde sua empresa atua para otimizar o banco de dados.
                        </p>
                    </section>

                </div>

                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
                    <button 
                        onClick={() => setShowSettings(false)}
                        className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveSettings}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Preferências
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseManager;