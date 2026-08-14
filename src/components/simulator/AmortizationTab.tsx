import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TabProps } from '../../types/simulation';
import { formatCurrency } from '../../utils/formatters';

const AmortizationTab: React.FC<TabProps> = ({ 
  simulationData, 
  onNext, 
  onPrev, 
  canGoNext, 
  canGoPrev 
}) => {
  const hasData = simulationData.amortizationTable.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Tabla de amortización</h2>
        
        {hasData ? (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400 mb-1">Total Pagado</div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(simulationData.amortizationTable.reduce((sum, row) => sum + row.payment, 0))}
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400 mb-1">Total Intereses</div>
                <div className="text-lg font-bold text-red-400">
                  {formatCurrency(simulationData.amortizationTable.reduce((sum, row) => sum + row.interest, 0))}
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400 mb-1">Total Capital</div>
                <div className="text-lg font-bold text-green-400">
                  {formatCurrency(simulationData.amortizationTable.reduce((sum, row) => sum + row.principal, 0))}
                </div>
              </div>
            </div>

            {/* Full Amortization Table */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-200">Tabla Completa de Amortización</h3>
                <span className="text-sm text-slate-400">
                  {simulationData.amortizationTable.length} pagos totales
                </span>
              </div>
              
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-700">
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 px-2 text-slate-300 font-medium">Fecha de Pago</th>
                      <th className="text-right py-3 px-2 text-slate-300 font-medium">Cuota</th>
                      <th className="text-right py-3 px-2 text-slate-300 font-medium">Interés</th>
                      <th className="text-right py-3 px-2 text-slate-300 font-medium">Capital</th>
                      <th className="text-right py-3 px-2 text-slate-300 font-medium">Capital Pendiente</th>
                      <th className="text-right py-3 px-2 text-slate-300 font-medium">Capital Amortizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationData.amortizationTable.map((row) => (
                      <tr key={row.month} className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="py-2 px-2 text-white">{new Date(row.paymentDate).toLocaleDateString('es-ES')}</td>
                        <td className="py-2 px-2 text-right text-white">{formatCurrency(row.payment)}</td>
                        <td className="py-2 px-2 text-right text-red-400">{formatCurrency(row.interest)}</td>
                        <td className="py-2 px-2 text-right text-green-400">{formatCurrency(row.principal)}</td>
                        <td className="py-2 px-2 text-right text-slate-300">{formatCurrency(row.remainingBalance)}</td>
                        <td className="py-2 px-2 text-right text-orange-400">{formatCurrency(row.amortizedCapital)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              La tabla de amortización se generará automáticamente después de calcular la cuota mensual.
            </div>
            <div className="text-sm text-slate-500">
              Vuelve a la pestaña anterior para calcular tu cuota mensual.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={onPrev}
            disabled={!canGoPrev}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${
              canGoPrev
                ? 'bg-slate-600 hover:bg-slate-500 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <button
            onClick={onNext}
            disabled={!canGoNext || !hasData}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${
              canGoNext && hasData
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmortizationTab;
