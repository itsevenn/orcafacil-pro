import React, { useEffect } from 'react';
import { Measurement } from '../../../../domain/models/measurement';
import { X, Calendar, FileText, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface MeasurementViewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    measurement: Measurement;
}

export const MeasurementViewDialog: React.FC<MeasurementViewDialogProps> = ({ isOpen, onClose, measurement }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);



    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'Rascunho';
            case 'SUBMITTED': return 'Enviado';
            case 'APPROVED': return 'Aprovado';
            case 'PAID': return 'Pago';
            default: return status;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'SUBMITTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (!isOpen || !measurement) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-900/60 z-[100]"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[800px] max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Detalhes da Medição</h2>
                            <p className="text-sm text-slate-500 mt-1">Medição Nº {String(measurement.measurementNumber).padStart(3, '0')}</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center transition-all">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 overflow-y-auto">
                        {/* Project Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <div className="text-xs font-black text-slate-400 uppercase mb-2">Projeto</div>
                                <div className="text-lg font-black text-slate-900">{measurement.projectName}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <div className="text-xs font-black text-slate-400 uppercase mb-2">Cliente</div>
                                <div className="text-lg font-black text-slate-900">{measurement.clientName}</div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Data Referência</span>
                                </div>
                                <div className="text-sm font-bold text-slate-700">
                                    {format(new Date(measurement.referenceDate), "dd/MM/yyyy")}
                                </div>
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Status</span>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(measurement.status)}`}>
                                    {getStatusLabel(measurement.status)}
                                </span>
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Retenção</span>
                                </div>
                                <div className="text-sm font-bold text-slate-700">{measurement.retentionPercentage}%</div>
                            </div>
                        </div>

                        {/* Items Table */}
                        {measurement.items && measurement.items.length > 0 && (
                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                                    <h3 className="text-xs font-black text-slate-700 uppercase">Itens da Medição</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50/50">
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <th className="px-4 py-3 text-left">Código</th>
                                                <th className="px-4 py-3 text-left">Descrição</th>
                                                <th className="px-4 py-3 text-center">Unidade</th>
                                                <th className="px-4 py-3 text-right">Quantidade</th>
                                                <th className="px-4 py-3 text-right">Preço Unit.</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {measurement.items.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{item.serviceCode}</td>
                                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serviceName}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-slate-600">{item.unit}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-700">{item.currentQuantity.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-700">
                                                        {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-black text-slate-900">
                                                        {item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Financial Summary */}
                        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-emerald-700 uppercase">Subtotal:</span>
                                <span className="text-lg font-black text-slate-900">
                                    {measurement.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-red-600 uppercase">Retenção ({measurement.retentionPercentage}%):</span>
                                <span className="text-lg font-black text-red-700">
                                    - {measurement.retentionAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="h-px bg-emerald-200" />
                            <div className="flex justify-between items-center">
                                <span className="text-base font-black text-emerald-900 uppercase">Valor Líquido:</span>
                                <span className="text-2xl font-black text-emerald-700">
                                    {measurement.netValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {measurement.notes && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="text-xs font-black text-slate-400 uppercase mb-2">Observações</div>
                                <p className="text-sm text-slate-600">{measurement.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-[2rem]">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
