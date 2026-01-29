import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select } from '../../ui/select';
import { Client, CreateClientDTO, ClientType } from '../../../domain/models/client';
import { Building2, User, Globe, Mail, Phone, MapPin, FileText, Check } from 'lucide-react';

interface ClientFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    initialData?: Client | null;
}

export const ClientFormDialog: React.FC<ClientFormDialogProps> = ({ open, onOpenChange, onSubmit, initialData }) => {
    const isEdit = !!initialData;

    const [formData, setFormData] = useState<Partial<Client>>({
        name: '',
        email: '',
        phone: '',
        company: '',
        sector: '',
        taxId: '',
        clientType: 'PRIVATE',
        responsiblePerson: '',
        website: '',
        notes: '',
        isActive: true,
        address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                sector: '',
                taxId: '',
                clientType: 'PRIVATE',
                responsiblePerson: '',
                website: '',
                notes: '',
                isActive: true,
                address: {
                    street: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    zipCode: '',
                }
            });
        }
    }, [initialData, open]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address!,
                [name]: value
            }
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (

        <>
            <div
                className={`fixed inset-0 bg-slate-900/60 z-[100] ${open ? 'block' : 'hidden'}`}
                onClick={() => onOpenChange(false)}
            />
            <div className={`fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4 ${open ? 'block' : 'hidden'}`}>
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                            </h2>
                            {!isEdit && <p className="text-sm font-normal text-slate-500 mt-1">Cadastre um novo parceiro de negócio.</p>}
                        </div>
                        {/* Add Close Button if needed, currently not in original code but good for UX */}
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-[#0070d2] uppercase tracking-wider">
                                <Building2 className="w-4 h-4" />
                                Informações Básicas
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-8 space-y-2">
                                    <Label htmlFor="name">Nome / Razão Social</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Roberto Silva ou Empresa Ltda" required />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <Label htmlFor="taxId">CPF / CNPJ</Label>
                                    <Input id="taxId" name="taxId" value={formData.taxId} onChange={handleInputChange} placeholder="00.000.000/0000-00" />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <Label htmlFor="clientType">Tipo de Cliente</Label>
                                    <Select id="clientType" name="clientType" value={formData.clientType} onChange={handleInputChange}>
                                        <option value="PRIVATE">Iniciativa Privada</option>
                                        <option value="PUBLIC">Empresa Pública</option>
                                        <option value="GOVERNMENT">Governo / Prefeitura</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>CNPJ / CPF</Label>
                                    <Input name="taxId" value={formData.taxId} onChange={handleInputChange} className="mt-1.5" />
                                </div>
                                <div>
                                    <Label>Setor / Atividade</Label>
                                    <Input name="sector" value={formData.sector} onChange={handleInputChange} className="mt-1.5" placeholder="Ex: Residencial, Comercial" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Email Corporativo</Label>
                                    <Input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1.5" />
                                </div>
                                <div>
                                    <Label>Telefone / WhatsApp</Label>
                                    <Input name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1.5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Empresa / Grupo (Opcional)</Label>
                                    <Input name="company" value={formData.company} onChange={handleInputChange} className="mt-1.5" />
                                </div>
                                <div>
                                    <Label>Website</Label>
                                    <Input name="website" value={formData.website} onChange={handleInputChange} className="mt-1.5" placeholder="https://" />
                                </div>
                            </div>

                            <div>
                                <Label>Pessoa Responsável</Label>
                                <Input name="responsiblePerson" value={formData.responsiblePerson} onChange={handleInputChange} className="mt-1.5" placeholder="Contato principal na empresa" />
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Endereço
                                </h3>
                                <div className="grid grid-cols-6 gap-4">
                                    <div className="col-span-2">
                                        <Label>CEP</Label>
                                        <Input name="zipCode" value={formData.address?.zipCode} onChange={handleAddressChange} className="mt-1.5" />
                                    </div>
                                    <div className="col-span-3">
                                        <Label>Logradouro</Label>
                                        <Input name="street" value={formData.address?.street} onChange={handleAddressChange} className="mt-1.5" />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Número</Label>
                                        <Input name="number" value={formData.address?.number} onChange={handleAddressChange} className="mt-1.5" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Bairro</Label>
                                        <Input name="neighborhood" value={formData.address?.neighborhood} onChange={handleAddressChange} className="mt-1.5" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Cidade</Label>
                                        <Input name="city" value={formData.address?.city} onChange={handleAddressChange} className="mt-1.5" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Estado (UF)</Label>
                                        <Input name="state" value={formData.address?.state} onChange={handleAddressChange} className="mt-1.5" maxLength={2} />
                                    </div>
                                    <div className="col-span-6">
                                        <Label>Complemento</Label>
                                        <Input name="complement" value={formData.address?.complement} onChange={handleAddressChange} className="mt-1.5" optional />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Observações Internas</Label>
                                <Textarea name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={3} className="mt-1.5 resize-none" placeholder="Anotações sobre o cliente..." />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-slate-50 rounded-b-[2rem] shrink-0">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50">
                            Cancelar
                        </Button>
                        <Button onClick={() => onSubmit(formData)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
                            <Check className="w-4 h-4 mr-2" />
                            {isEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
