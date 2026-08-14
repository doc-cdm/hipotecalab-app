import React from 'react';
import { ChevronLeft, FileDown, Sheet } from 'lucide-react';
import { TabProps } from '../../types/simulation';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateTotalInvestment } from '../../utils/calculations';

const SummaryTab: React.FC<TabProps> = ({
  simulationData,
  onPrev,
  canGoPrev
}) => {
  const totalInvestment = calculateTotalInvestment(simulationData.propertyPrice, simulationData.costs);
  const requestedFinancing = totalInvestment - simulationData.initialContribution;
  const financingPercentage = simulationData.propertyPrice > 0
    ? (requestedFinancing / simulationData.propertyPrice) * 100
    : null;

  const totalInterestTIN = simulationData.amortizationTable.reduce((sum, row) => sum + row.interest, 0);
  // Coste total real: lo que pagas de tu bolsillo (aportación inicial) + lo que pagas al banco (financiación + intereses)
  const totalCost = simulationData.initialContribution + requestedFinancing + totalInterestTIN;

  const summaryItems = [
    { label: 'Precio del inmueble', value: formatCurrency(simulationData.propertyPrice) },
    { label: 'Coste total de la inversión', value: formatCurrency(totalInvestment) },
    { label: 'Aportación inicial', value: formatCurrency(simulationData.initialContribution) },
    { label: 'Financiación solicitada', value: formatCurrency(requestedFinancing) },
    { label: 'Porcentaje financiado', value: financingPercentage !== null ? formatPercentage(financingPercentage) : '—' },
    { label: 'Plazo', value: `${simulationData.loanTerm} años` },
    { label: 'TIN', value: formatPercentage(simulationData.tin) },
    { label: 'TAE', value: formatPercentage(simulationData.tae) },
    { label: 'Cuota mensual (sin extras)', value: formatCurrency(simulationData.monthlyPayment) },
    { label: 'Cuota mensual (con extras)', value: formatCurrency(simulationData.monthlyPaymentWithExtras) },
    { label: 'Coste total real', value: formatCurrency(totalCost) },
    { label: 'Intereses totales (TIN)', value: formatCurrency(totalInterestTIN) },
  ];

  const handleExportPDF = async () => {
    try {
      const { exportToPDF } = await import('../../utils/exportUtils');
      await exportToPDF(simulationData);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  const handleExportExcel = async () => {
    try {
      const { exportToExcel } = await import('../../utils/exportUtils');
      await exportToExcel(simulationData);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert('Error al generar el archivo Excel. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Resumen financiero</h2>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {summaryItems.map((item, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">{item.label}</div>
              <div className="text-lg font-semibold text-white">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="bg-slate-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Métricas Clave</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 mb-1">
                {financingPercentage !== null ? formatPercentage(financingPercentage) : '—'}
              </div>
              <div className="text-sm text-slate-400">Financiado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {formatCurrency(simulationData.monthlyPayment)}
              </div>
              <div className="text-sm text-slate-400">Cuota mensual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {formatCurrency(totalInterestTIN)}
              </div>
              <div className="text-sm text-slate-400">Intereses totales</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
          >
            <FileDown size={16} />
            <span>Exportar a PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Sheet size={16} />
            <span>Exportar a Excel</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            onClick={onPrev}
            disabled={!canGoPrev}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${canGoPrev
              ? 'bg-slate-600 hover:bg-slate-500 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;