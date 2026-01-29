import React, { useState, useRef } from 'react';
import { PhotoTracking, Photo, PhotoCategory } from '../../../../domain/models/photo-tracking';
import { Button } from '../../ui/button';
import { X, Save, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PhotoTrackingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<PhotoTracking, 'id' | 'createdAt' | 'updatedAt'>) => void;
    photoTracking?: PhotoTracking;
}

export const PhotoTrackingDialog: React.FC<PhotoTrackingDialogProps> = ({ isOpen, onClose, onSave, photoTracking }) => {
    const [formData, setFormData] = useState({
        title: photoTracking?.title || '',
        date: photoTracking?.date ? new Date(photoTracking.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        projectName: photoTracking?.projectName || '',
        category: (photoTracking?.category || 'PROGRESS') as PhotoCategory,
        location: photoTracking?.location || '',
        description: photoTracking?.description || '',
        tags: photoTracking?.tags || []
    });

    const [photos, setPhotos] = useState<Photo[]>(photoTracking?.photos || []);
    const [newTag, setNewTag] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);



    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const maxPhotos = 5;
        if (photos.length + files.length > maxPhotos) {
            alert(`Máximo de ${maxPhotos} fotos permitidas!`);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file type
            if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
                alert(`Arquivo ${file.name} não é uma imagem válida!`);
                continue;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert(`Arquivo ${file.name} é muito grande! Máximo 5MB.`);
                continue;
            }

            try {
                const dataUrl = await fileToBase64(file);
                const photo: Photo = {
                    id: uuidv4(),
                    dataUrl,
                    caption: file.name,
                    uploadedAt: new Date()
                };
                setPhotos(prev => [...prev, photo]);
            } catch (error) {
                console.error('Error converting file:', error);
                alert(`Erro ao processar ${file.name}`);
            }
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleRemovePhoto = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        if (formData.tags.includes(newTag.trim())) return;
        setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
        setNewTag('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSave({
            title: formData.title,
            date: new Date(formData.date),
            projectName: formData.projectName,
            category: formData.category,
            location: formData.location,
            description: formData.description,
            photos,
            photoCount: photos.length,
            tags: formData.tags
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900/60 z-[100]"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {photoTracking ? 'Editar Fotos' : 'Adicionar Fotos'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Registro fotográfico da obra (máx. 5 fotos)</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Título *</label>
                                <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Conclusão da fundação" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Data *</label>
                                <input type="date" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Projeto *</label>
                                <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Categoria</label>
                                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as PhotoCategory })}>
                                    <option value="PROGRESS">Progresso</option>
                                    <option value="ISSUE">Problema</option>
                                    <option value="BEFORE_AFTER">Antes/Depois</option>
                                    <option value="TEAM">Equipe</option>
                                    <option value="MATERIAL">Material</option>
                                    <option value="FINISHING">Acabamento</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Localização/Etapa</label>
                                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Ex: 2º andar" />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Descrição</label>
                            <textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detalhes sobre as fotos..." />
                        </div>

                        {/* Photo Upload */}
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase mb-3">Fotos ({photos.length}/5)</h3>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-8 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all mb-4"
                                disabled={photos.length >= 5}
                            >
                                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                <div className="text-sm font-bold text-purple-600">
                                    {photos.length >= 5 ? 'Limite de fotos atingido' : 'Clique para adicionar fotos'}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    JPG, PNG ou WebP - Máx. 5MB cada
                                </div>
                            </button>

                            {/* Photo Preview Grid */}
                            {photos.length > 0 && (
                                <div className="grid grid-cols-5 gap-4">
                                    {photos.map((photo) => (
                                        <div key={photo.id} className="relative group">
                                            <img
                                                src={photo.dataUrl}
                                                alt={photo.caption}
                                                className="w-full h-24 object-cover rounded-xl border border-slate-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(photo.id)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Adicionar tag..."
                                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                />
                                <button type="button" onClick={handleAddTag} className="px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold">
                                    Adicionar
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) })}
                                                className="hover:text-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50 rounded-b-[2rem] shrink-0">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancelar</Button>
                        <Button type="submit" onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                            <Save className="w-4 h-4 mr-2" /> Salvar Fotos
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
