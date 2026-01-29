import React from 'react';
import { BudgetFormData } from '../../../../domain/validation/budget-schema';
import { Button } from '../../ui/button';
import { Printer, X } from 'lucide-react';
import { useSettingsStore } from '../../../stores/use-settings-store';

interface BudgetPrintPreviewProps {
    data: BudgetFormData;
    onClose: () => void;
}

export const BudgetPrintPreview: React.FC<BudgetPrintPreviewProps> = ({ data, onClose }) => {
    const { company } = useSettingsStore();
    const [reportType, setReportType] = React.useState<'analytic' | 'synthetic'>('analytic');

    // Grouping Logic
    const groupedItems = React.useMemo(() => {
        const groups: Record<string, typeof data.items> = {};
        data.items.forEach(item => {
            const stage = item.stage || 'Sem Etapa Definida';
            if (!groups[stage]) groups[stage] = [];
            groups[stage].push(item);
        });
        // Sort keys if they start with numbers (1.0, 2.0)
        return Object.keys(groups).sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
        }).map(key => ({
            stage: key,
            items: groups[key],
            total: groups[key].reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)
        }));
    }, [data.items]);

    // Financial Totals
    const subtotal = data.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const bdiRate = data.bdi || 0;
    const bdiAmount = subtotal * (bdiRate / 100);
    const totalTax = data.items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * ((item.taxRate || 0) / 100)), 0);
    const totalDiscount = data.items.reduce((acc, item) => acc + ((item.quantity * item.unitPrice) * (item.discount / 100)), 0);
    const grandTotal = subtotal + bdiAmount + totalTax - totalDiscount;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-white overflow-auto flex flex-col">
            {/* Toolbar - Hidden when printing */}
            <div className="no-print sticky top-0 bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold">Visualização de Impressão</h2>
                    <div className="flex bg-slate-700 rounded p-1">
                        <button
                            className={`px-3 py-1 text-xs font-medium rounded ${reportType === 'analytic' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                            onClick={() => setReportType('analytic')}
                        >
                            Analítico
                        </button>
                        <button
                            className={`px-3 py-1 text-xs font-medium rounded ${reportType === 'synthetic' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                            onClick={() => setReportType('synthetic')}
                        >
                            Sintético
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={onClose} className="hover:bg-slate-700 text-white border-slate-600">
                        <X className="w-4 h-4 mr-2" /> Fechar
                    </Button>
                    <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Printer className="w-4 h-4 mr-2" /> Imprimir
                    </Button>
                </div>
            </div>

            {/* Printable Content */}
            <div className="printable-content p-8 max-w-[210mm] mx-auto bg-white min-h-screen">
                {/* Header */}
                <header className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
                    <div className="flex items-center gap-4">
                        {company.logo && (
                            <img src={company.logo} alt="Logo" className="h-16 w-auto object-contain max-w-[150px]" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">
                                Orçamento {reportType === 'analytic' ? 'Analítico' : 'Sintético'}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">Ref: {new Date().getFullYear()}-{Math.floor(Math.random() * 1000).toString().padStart(4, '0')}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className="font-bold text-lg text-slate-800">{company.name}</h3>
                        <p className="text-sm text-slate-600">{company.document}</p>
                        <p className="text-sm text-slate-600">{company.email}</p>
                        <p className="text-sm text-slate-600">{company.phone}</p>
                    </div>
                </header>

                {/* Client & Date Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Cliente</h4>
                        <div className="bg-slate-50 p-4 rounded border border-slate-100">
                            <p className="font-bold text-lg text-slate-800">{data.clientName || "Cliente não informado"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end text-right">
                        <div className="mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Data de Emissão:</span>
                            <span className="font-medium text-slate-800">{new Date(data.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Válido Até:</span>
                            <span className="font-medium text-slate-800">{new Date(data.expiryDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-800">
                            <th className="py-3 text-left text-xs font-bold text-slate-800 uppercase">Item / Descrição</th>
                            {reportType === 'analytic' && (
                                <>
                                    <th className="py-3 text-center text-xs font-bold text-slate-800 uppercase w-24">Qtd</th>
                                    <th className="py-3 text-right text-xs font-bold text-slate-800 uppercase w-32">Unitário</th>
                                </>
                            )}
                            <th className="py-3 text-right text-xs font-bold text-slate-800 uppercase w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {groupedItems.map((group) => (
                            <React.Fragment key={group.stage}>
                                {/* Stage Header */}
                                <tr className="bg-slate-100">
                                    <td colSpan={reportType === 'analytic' ? 4 : 2} className="py-2 px-3 font-bold text-slate-800 text-sm">
                                        {group.stage}
                                    </td>
                                </tr>

                                {reportType === 'analytic' && group.items.map((item, index) => (
                                    <tr key={`${group.stage}-${index}`}>
                                        <td className="py-2 pl-6 pr-3 text-sm text-slate-700">
                                            {item.name}
                                        </td>
                                        <td className="py-2 text-center text-sm text-slate-700">{item.quantity}</td>
                                        <td className="py-2 text-right text-sm text-slate-700">
                                            {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="py-2 text-right text-sm text-slate-700">
                                            {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                    </tr>
                                ))}

                                {/* Stage Total (for Synthetic or Analytic summary) */}
                                <tr className="border-t border-slate-300">
                                    <td colSpan={reportType === 'analytic' ? 3 : 1} className="py-2 text-right text-xs font-bold text-slate-600 uppercase pr-4">
                                        Total {group.stage}
                                    </td>
                                    <td className="py-2 text-right text-sm font-bold text-slate-800">
                                        {group.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-slate-800">
                            <td colSpan={reportType === 'analytic' ? 3 : 1} className="py-4 text-right font-bold text-slate-600 uppercase pr-4">Subtotal (Custos Diretos)</td>
                            <td className="py-4 text-right font-bold text-lg text-slate-800">
                                {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={reportType === 'analytic' ? 3 : 1} className="py-2 text-right font-bold text-slate-600 uppercase pr-4">BDI ({bdiRate.toFixed(2)}%)</td>
                            <td className="py-2 text-right font-bold text-base text-blue-600">
                                + {bdiAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                        </tr>
                        {totalTax > 0 && (
                            <tr>
                                <td colSpan={reportType === 'analytic' ? 3 : 1} className="py-2 text-right font-bold text-slate-600 uppercase pr-4">Impostos</td>
                                <td className="py-2 text-right font-bold text-base text-orange-600">
                                    + {totalTax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={reportType === 'analytic' ? 3 : 1} className="py-2 text-right font-bold text-slate-600 uppercase pr-4">Descontos</td>
                            <td className="py-2 text-right font-bold text-base text-red-500">
                                - {totalDiscount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                        </tr>
                        <tr className="border-t-2 border-slate-800 bg-slate-50">
                            <td colSpan={reportType === 'analytic' ? 3 : 1} className="py-4 text-right font-bold text-slate-900 uppercase pr-4">Total Geral</td>
                            <td className="py-4 text-right font-bold text-xl text-slate-900">
                                {grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Notes */}
                {data.notes && (
                    <div className="mt-8 border-t border-slate-200 pt-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Observações e Termos</h4>
                        <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                            {data.notes}
                        </div>
                    </div>
                )}

                {/* Signature area */}
                <div className="mt-20 grid grid-cols-2 gap-20 page-break-inside-avoid">
                    <div className="border-t border-slate-300 pt-2">
                        <p className="text-center text-xs text-slate-500 uppercase">Assinatura do Cliente</p>
                    </div>
                    <div className="border-t border-slate-300 pt-2">
                        <p className="text-center text-xs text-slate-500 uppercase">Assinatura do Responsável</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
