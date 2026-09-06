import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TabProps } from '../../../types/simulation';
import { formatCurrency } from '../../../utils/formatters';
import { calculateTotalInvestment } from '../../../utils/calculations';

const PaymentTab: React.FC<TabProps> = ({ 
  simulationData, 
  onNext, 
  onPrev, 
  canGoNext, 
  canGoPrev 
}) => {
  const isCalculated = simulationData.monthlyPayment > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-brand mb-6">Cuota mensual</h2>
        
        <div className="space-y-6">
          {/* Payment Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                Cuota de la hipoteca
              </h3>
              <div className="text-3xl font-bold text-brand">
                {formatCurrency(simulationData.monthlyPayment)}
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                Gasto mensual con seguros y otros gastos
              </h3>
              <div className="text-3xl font-bold text-brand">
                {formatCurrency(simulationData.monthlyPaymentWithExtras)}
              </div>
            </div>
          </div>

          {/* Summary Information */}
          {isCalculated && (
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Resumen del cálculo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Capital prestado:</span>
                  <div className="font-semibold text-white">
                    {formatCurrency(calculateTotalInvestment(simulationData.propertyPrice, simulationData.costs) - simulationData.initialContribution)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">TIN:</span>
                  <div className="font-semibold text-white">
                    {simulationData.tin}%
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Plazo:</span>
                  <div className="font-semibold text-white">
                    {simulationData.loanTerm} años
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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
            disabled={!canGoNext || !isCalculated}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${
              canGoNext && isCalculated
                ? 'bg-brand hover:bg-brand-hover text-white'
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

export default PaymentTab;
