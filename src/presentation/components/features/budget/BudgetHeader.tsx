import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { BudgetFormData } from '../../../../domain/validation/budget-schema';
import { Input } from '../../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { useClientStore } from '../../../stores/use-client-store';
import { Users, Calendar } from 'lucide-react';
import { BudgetStatus } from '../../../../domain/models/budget';

export const BudgetHeader: React.FC = () => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<BudgetFormData>();
    const { clients, fetchClients } = useClientStore();
    const clientId = watch('clientId');

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    useEffect(() => {
        if (clientId) {
            const client = clients.find(c => c.id === clientId);
            if (client) {
                setValue('clientName', client.company || client.name);
            }
        }
    }, [clientId, clients, setValue]);

    return (
        <Card className="mb-6">
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center text-slate-700">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    Dados Gerais
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Cliente</label>
                    <select
                        {...register('clientId')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Selecione um cliente...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.company ? `${c.company} (${c.name})` : c.name}</option>
                        ))}
                    </select>
                    {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Data Base</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <Input type="date" className="pl-9" {...register('date')} />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Validade</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <Input type="date" className="pl-9" {...register('expiryDate')} />
                    </div>
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">BDI Global (%)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            className="pl-9"
                            {...register('bdi', { valueAsNumber: true })}
                        />
                    </div>
                    {errors.bdi && <p className="text-red-500 text-xs mt-1">{errors.bdi.message}</p>}
                </div>

                {/* Hidden Status Field or exposed if needed */}
                <input type="hidden" {...register('status')} />
            </CardContent>
        </Card>
    );
};
