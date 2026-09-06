import { useState } from 'react';
import { FileDown, Sheet } from 'lucide-react';
import type { TabProps, SimulationData } from '../../../types/simulation';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';
import { calculateTotalInvestment } from '../../../utils/calculations';

interface Props extends TabProps {
  comparison: SimulationData | null;
  onEdit: () => void;
  onCompare: () => void;
  onClearComparison: () => void;
}

export default function SummaryTab({ simulationData, comparison, onEdit, onCompare, onClearComparison }: Props) {
  const totalInvestment = calculateTotalInvestment(simulationData.propertyPrice, simulationData.costs);
  const principal = Math.max(0, totalInvestment - simulationData.initialContribution);
  const interest = simulationData.amortizationTable.reduce((sum, row) => sum + row.interest, 0);
  const valid = simulationData.propertyPrice > 0 && principal > 0 && simulationData.tin >= 0
    && Number.isInteger(simulationData.loanTerm) && simulationData.loanTerm > 0 && simulationData.loanTerm <= 50
    && simulationData.initialContribution >= 0 && simulationData.monthlyExtras >= 0
    && [totalInvestment, principal, simulationData.monthlyPayment, simulationData.tin, simulationData.monthlyExtras].every(Number.isFinite)
    && simulationData.amortizationTable.length > 0;
  const details = [
    ['Precio de la vivienda', formatCurrency(simulationData.propertyPrice)],
    ['Gastos e impuestos estimados', formatCurrency(totalInvestment - simulationData.propertyPrice)],
    ['Precio + gastos de compra', formatCurrency(totalInvestment)],
    ['Préstamo solicitado', formatCurrency(principal)],
    ['Financiación sobre el precio', simulationData.propertyPrice > 0 ? formatPercentage(principal / simulationData.propertyPrice * 100) : '—'],
    ['Plazo', `${simulationData.loanTerm} años`],
    ['TIN', formatPercentage(simulationData.tin)],
    ['TAE indicada', simulationData.tae > 0 ? formatPercentage(simulationData.tae) : 'No indicada'],
    ['Intereses durante todo el préstamo', formatCurrency(interest)],
    ['Total estimado de compra y préstamo', formatCurrency(totalInvestment + interest)],
  ];
  const compareRows = comparison ? [
    ['Precio de la vivienda', formatCurrency(comparison.propertyPrice), formatCurrency(simulationData.propertyPrice)],
    ['Plazo', `${comparison.loanTerm} años`, `${simulationData.loanTerm} años`],
    ['TIN', formatPercentage(comparison.tin), formatPercentage(simulationData.tin)],
    ['Cuota al mes', formatCurrency(comparison.monthlyPayment), formatCurrency(simulationData.monthlyPayment)],
    ['Gasto mensual con extras', formatCurrency(comparison.monthlyPaymentWithExtras), formatCurrency(simulationData.monthlyPaymentWithExtras)],
    ['Ahorro destinado a la compra', formatCurrency(comparison.initialContribution), formatCurrency(simulationData.initialContribution)],
    ['Intereses totales', formatCurrency(comparison.amortizationTable.reduce((sum, row) => sum + row.interest, 0)), formatCurrency(interest)],
  ] : [];
  const [exporting, setExporting] = useState<'PDF' | 'Excel' | null>(null);
  const [exportMessage, setExportMessage] = useState('');
  const [exportFailed, setExportFailed] = useState(false);
  const handleExport = async (format: 'PDF' | 'Excel') => {
    if (exporting) return;
    setExporting(format);
    setExportFailed(false);
    setExportMessage(`Preparando ${format}…`);
    try {
      const { exportToPDF, exportToExcel } = await import('../exporters');
      const result = await (format === 'PDF' ? exportToPDF : exportToExcel)(simulationData);
      setExportMessage(result === 'cancelled' ? 'Exportación cancelada. Puedes volver a intentarlo.' : result === 'saved' ? `${format} guardado en la ubicación elegida.` : `Descarga de ${format} iniciada. Revisa las descargas del navegador.`);
    } catch {
      setExportFailed(true);
      setExportMessage(`No se pudo guardar el ${format}. Vuelve a pulsar Exportar y prueba otra ubicación.`);
    } finally {
      setExporting(null);
    }
  };

  if (!valid) return <div className="tool-layout"><h2 className="section-title">Tu resumen</h2><p className="mt-3 text-slate-300">Completa el precio y las condiciones de una hipoteca válida para ver los resultados.</p><button type="button" className="primary-button mt-5" onClick={onEdit}>Revisar préstamo</button></div>;

  return (
    <div className="tool-layout space-y-6">
      <div><h2 className="section-title">Tu compra, en tres cifras</h2><p className="mt-2 text-sm text-slate-300">{simulationData.name || 'Tu simulación'} · Estimación a tipo fijo.</p></div>
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="result-primary"><dt className="text-sm text-slate-200">Cuota hipotecaria al mes</dt><dd className="result-value text-brand-cream">{formatCurrency(simulationData.monthlyPayment)}</dd><p className="result-note">Capital e intereses, sin otros gastos.</p></div>
        <div className="result-secondary"><dt className="text-sm text-slate-300">Gasto mensual con extras</dt><dd className="result-value">{formatCurrency(simulationData.monthlyPaymentWithExtras)}</dd><p className="result-note">Incluye {formatCurrency(simulationData.monthlyExtras)} de seguros y otros gastos indicados.</p></div>
        <div className="result-secondary"><dt className="text-sm text-slate-300">Ahorro destinado a la compra</dt><dd className="result-value">{formatCurrency(simulationData.initialContribution)}</dd><p className="result-note">Aportación que has elegido para este escenario; no es un mínimo exigido por el banco.</p></div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onEdit} className="primary-button">Cambiar plazo o interés</button>
        <button type="button" onClick={onCompare} className="secondary-button">{comparison ? 'Usar esta opción como referencia' : 'Comparar otra opción'}</button>
      </div>
      {comparison && <section aria-label="Comparación de simulaciones" className="space-y-3">
        <h3 className="text-lg font-semibold">Opción inicial y opción actual</h3>
        <p className="text-sm text-slate-300">La cuota actual es {formatCurrency(Math.abs(simulationData.monthlyPayment - comparison.monthlyPayment))} {simulationData.monthlyPayment >= comparison.monthlyPayment ? 'mayor' : 'menor'} al mes. Compara también el ahorro y los intereses totales.</p>
        <div className="overflow-x-auto"><table className="w-full text-sm text-left"><caption className="sr-only">Comparación de las condiciones y los resultados de ambas opciones</caption><thead><tr className="border-b border-slate-600"><th scope="col" className="py-3 pr-3">Concepto</th><th scope="col" className="p-3">Inicial</th><th scope="col" className="p-3">Actual</th></tr></thead><tbody>{compareRows.map(([label, initial, current]) => <tr key={label} className="border-b border-slate-700"><th scope="row" className="py-3 pr-3 font-normal text-slate-300">{label}</th><td className="p-3 whitespace-nowrap">{initial}</td><td className="p-3 whitespace-nowrap">{current}</td></tr>)}</tbody></table></div>
        <button type="button" className="secondary-button" onClick={onClearComparison}>Cerrar comparación</button>
      </section>}
      <details className="border-y border-slate-700 py-2">
        <summary className="cursor-pointer py-3 font-semibold">Ver desglose de compra y préstamo</summary>
        <dl className="divide-y divide-slate-700">{details.map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-slate-300">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl>
        <p className="py-3 text-sm text-slate-300">El total estimado suma el precio, los gastos de compra y los intereses de toda la hipoteca. No incluye seguros ni otros gastos mensuales. La TAE indicada es informativa; la cuota se calcula con el TIN.</p>
      </details>
      <section aria-label="Exportar simulación">
        <h3 className="text-lg font-semibold mb-3">Llévate los resultados</h3>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => handleExport('PDF')} disabled={!!exporting} className="secondary-button flex items-center gap-2"><FileDown size={18} aria-hidden="true" />{exporting === 'PDF' ? 'Preparando PDF…' : 'Exportar PDF'}</button>
          <button type="button" onClick={() => handleExport('Excel')} disabled={!!exporting} className="secondary-button flex items-center gap-2"><Sheet size={18} aria-hidden="true" />{exporting === 'Excel' ? 'Preparando Excel…' : 'Exportar Excel'}</button>
        </div>
        {exportMessage && <p role={exportFailed ? 'alert' : 'status'} className="text-sm text-slate-200 mt-3">{exportMessage}</p>}
      </section>
      <p className="text-sm text-slate-400">Estimación orientativa, no una oferta ni una aprobación bancaria. Los datos se conservan mientras esta sesión permanezca abierta; exporta una copia para guardarlos.</p>
    </div>
  );
}
