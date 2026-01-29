import React from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsStore } from '../stores/use-settings-store';
import { CompanySettings } from '../../domain/models/settings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Building2, Save, Upload, RotateCcw, Database, Download, FileJson } from 'lucide-react';
import { BackupManager } from '../../lib/backup-manager';

export const SettingsPage: React.FC = () => {
    const { company, updateCompany, resetSettings } = useSettingsStore();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { register, handleSubmit, watch, setValue, formState: { isDirty } } = useForm<CompanySettings>({
        defaultValues: company
    });

    const onSubmit = (data: CompanySettings) => {
        updateCompany(data);
        alert('Configurações salvas com sucesso!'); // Simple feedback
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setValue('logo', base64String, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownloadBackup = () => {
        const backup = BackupManager.createBackup();
        BackupManager.downloadBackup(backup);
    };

    const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const success = await BackupManager.restoreBackup(json);
                if (success) {
                    alert('Backup restaurado com sucesso! A página será recarregada.');
                    window.location.reload();
                } else {
                    alert('Erro ao restaurar backup. Verifique o arquivo.');
                }
            } catch (err) {
                alert('Arquivo inválido.');
            }
        };
        reader.readAsText(file);
    };

    const logoPreview = watch('logo');
    const hasChanges = isDirty;
    // isDirty might be tricky with deep updates or external state sync. 
    // In this simple case, we can rely on it or just allow save always.

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
                    <p className="text-slate-500 mt-1">Gerencie os dados da sua empresa e preferências do sistema.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Company Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-slate-800">
                            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                            Perfil da Empresa
                        </CardTitle>
                        <CardDescription>
                            Esses dados aparecerão no cabeçalho dos seus orçamentos PDF/Impressos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Logo Upload */}
                        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 className="w-8 h-8 text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleLogoUpload}
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-900">Logotipo da Empresa</h3>
                                <p className="text-xs text-slate-500 mb-2">Recomendado: PNG transparente. Max 2MB.</p>
                                <Button type="button" variant="outline" size="sm" className="relative">
                                    Carregar Imagem
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleLogoUpload}
                                    />
                                </Button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Razão Social / Nome Fantasia</label>
                                <Input {...register('name')} placeholder="Ex: Minha Construtora Ltda" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">CNPJ / CPF</label>
                                <Input {...register('document')} placeholder="00.000.000/0000-00" />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Telefone / WhatsApp</label>
                                <Input {...register('phone')} placeholder="(00) 00000-0000" />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">E-mail de Contato</label>
                                <Input {...register('email')} placeholder="contato@empresa.com.br" />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Endereço Completo</label>
                                <Input {...register('address')} placeholder="Rua, Número, Bairro, Cidade - UF, CEP" />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Website (Opcional)</label>
                                <Input {...register('website')} placeholder="www.suaempresa.com.br" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Defaults Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-slate-800">Padrões de Orçamento</CardTitle>
                        <CardDescription>
                            Texto padrão para ser inserido automaticamente em novos orçamentos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Termos e Condições Padrão</label>
                            <textarea
                                {...register('termsAndConditions')}
                                className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Insira aqui seus termos de garantia, validade e forma de pagamento..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-between pt-4">
                    <Button type="button" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => {
                        if (confirm('Tem certeza que deseja resetar todas as configurações para o padrão?')) {
                            resetSettings();
                            window.location.reload(); // Quick fix to re-init form
                        }
                    }}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restaurar Padrões
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </div>
            </form>

            {/* Backup Section */}
            <Card className="border-blue-100 bg-blue-50/50 mt-12">
                <CardHeader>
                    <CardTitle className="flex items-center text-blue-900">
                        <Database className="w-5 h-5 mr-2 text-blue-600" />
                        Backup e Segurança de Dados
                    </CardTitle>
                    <CardDescription className="text-blue-700/80">
                        Como seus dados ficam salvos apenas neste navegador, recomenda-se fazer backups regulares.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex-1 h-16 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all"
                            onClick={handleDownloadBackup}
                        >
                            <div className="bg-blue-100 p-2 rounded-full">
                                <Download className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold">Fazer Backup</span>
                                <span className="text-xs text-slate-500 font-normal">Baixar arquivo .json com todos os dados</span>
                            </div>
                        </Button>

                        <Button
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex-1 h-16 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="bg-green-100 p-2 rounded-full">
                                <FileJson className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold">Restaurar Backup</span>
                                <span className="text-xs text-slate-500 font-normal">Carregar arquivo .json e recuperar dados</span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={handleRestoreBackup}
                            />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
