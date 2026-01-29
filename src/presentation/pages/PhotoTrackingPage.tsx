import React, { useState, useEffect } from 'react';
import { usePhotoTrackingStore } from '../stores/use-photo-tracking-store';
import { Button } from '../components/ui/button';
import { Search, Plus, Camera, Image as ImageIcon, Tag, Eye, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PhotoTracking } from '../../domain/models/photo-tracking';
import { PhotoTrackingDialog } from '../components/features/project-management/PhotoTrackingDialog';

export const PhotoTrackingPage: React.FC = () => {
    const { photoTrackings, fetchPhotoTrackings, deletePhotoTracking, createPhotoTracking, updatePhotoTracking } = usePhotoTrackingStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PROGRESS' | 'ISSUE' | 'BEFORE_AFTER' | 'TEAM' | 'MATERIAL' | 'FINISHING'>('ALL');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTracking, setEditingTracking] = useState<PhotoTracking | undefined>(undefined);

    useEffect(() => {
        fetchPhotoTrackings();
    }, [fetchPhotoTrackings]);

    const handleNew = () => {
        setEditingTracking(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (tracking: PhotoTracking) => {
        setEditingTracking(tracking);
        setIsDialogOpen(true);
    };

    const handleSave = async (data: Omit<PhotoTracking, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingTracking) {
            await updatePhotoTracking(editingTracking.id, data);
        } else {
            await createPhotoTracking(data);
        }
        setIsDialogOpen(false);
        setEditingTracking(undefined);
    };

    const filteredTrackings = photoTrackings.filter(tracking => {
        const matchesSearch = tracking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tracking.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tracking.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter === 'ALL' || tracking.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este registro de fotos?')) {
            await deletePhotoTracking(id);
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'PROGRESS': return 'Progresso';
            case 'ISSUE': return 'Problema';
            case 'BEFORE_AFTER': return 'Antes/Depois';
            case 'TEAM': return 'Equipe';
            case 'MATERIAL': return 'Material';
            case 'FINISHING': return 'Acabamento';
            default: return category;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ISSUE': return 'bg-red-100 text-red-700 border-red-200';
            case 'BEFORE_AFTER': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'TEAM': return 'bg-green-100 text-green-700 border-green-200';
            case 'MATERIAL': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'FINISHING': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const totalPhotos = photoTrackings.reduce((sum, t) => sum + (t.photoCount || 0), 0);
    const categoriesUsed = new Set(photoTrackings.map(t => t.category)).size;
    const projectsCount = new Set(photoTrackings.map(t => t.projectName)).size;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Acompanhamento/Fotos</h1>
                        <p className="text-slate-500 mt-2">Registro fotográfico da obra</p>
                    </div>
                    <Button onClick={handleNew} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg">
                        <Plus className="w-5 h-5 mr-2" /> Adicionar Fotos
                    </Button>
                </div>

                {/* Warning Banner */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <div className="font-bold text-amber-900">Atenção: Fotos não são salvas permanentemente</div>
                        <div className="text-amber-700 mt-1">
                            As fotos ficam disponíveis apenas durante a sessão atual. Ao atualizar a página, apenas os metadados (título, data, categoria) serão preservados.
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Total de Fotos</div>
                                <div className="text-3xl font-black text-slate-900">{totalPhotos}</div>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Camera className="w-7 h-7 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Categorias</div>
                                <div className="text-3xl font-black text-pink-600">{categoriesUsed}</div>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center">
                                <Tag className="w-7 h-7 text-pink-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-400 uppercase mb-1">Projetos</div>
                                <div className="text-3xl font-black text-purple-600">{projectsCount}</div>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                                <ImageIcon className="w-7 h-7 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por título, projeto ou tags..."
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none font-bold text-sm"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as any)}
                        >
                            <option value="ALL">Todas as Categorias</option>
                            <option value="PROGRESS">Progresso</option>
                            <option value="ISSUE">Problema</option>
                            <option value="BEFORE_AFTER">Antes/Depois</option>
                            <option value="TEAM">Equipe</option>
                            <option value="MATERIAL">Material</option>
                            <option value="FINISHING">Acabamento</option>
                        </select>
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {filteredTrackings.length === 0 ? (
                        <div className="col-span-3 bg-white p-16 rounded-2xl shadow-lg border border-slate-100 text-center">
                            <Camera className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-slate-300 mb-2">Nenhuma foto encontrada</h3>
                            <p className="text-slate-400">Clique em "Adicionar Fotos" para começar</p>
                        </div>
                    ) : (
                        filteredTrackings.map((tracking) => (
                            <div key={tracking.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
                                {/* Placeholder Image */}
                                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                                    {tracking.photos.length > 0 && tracking.photos[0].dataUrl ? (
                                        <img src={tracking.photos[0].dataUrl} alt={tracking.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                                            <div className="text-xs font-bold text-purple-400">Sem fotos</div>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-black text-slate-600 shadow-lg">
                                        {tracking.photoCount || 0} foto(s)
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-black text-slate-900 line-clamp-2 flex-1">{tracking.title}</h3>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-500 transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleEdit(tracking)} className="p-1.5 text-slate-400 hover:text-purple-500 transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(tracking.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">
                                        {format(new Date(tracking.date), "dd MMM yyyy", { locale: ptBR })}
                                    </div>

                                    <div className="text-sm font-bold text-slate-600 mb-3">{tracking.projectName}</div>

                                    <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(tracking.category)}`}>
                                        {getCategoryLabel(tracking.category)}
                                    </span>

                                    {tracking.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {tracking.tags.slice(0, 3).map((tag, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <PhotoTrackingDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingTracking(undefined);
                }}
                onSave={handleSave}
                photoTracking={editingTracking}
            />
        </div>
    );
};
