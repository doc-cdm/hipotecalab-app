import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TabProps } from '../../types/simulation';
import { formatCurrency } from '../../utils/formatters';
import { calculateTotalInvestment } from '../../utils/calculations';
import HelpTooltip from '../HelpTooltip';

const LoanTab: React.FC<TabProps> = ({ 
  simulationData, 
  setSimulationData, 
  onNext, 
  onPrev, 
  canGoNext, 
  canGoPrev 
}) => {
  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'startDate') {
      setSimulationData(prev => ({
        ...prev,
        [field]: typeof value === 'string' ? value : String(value)
      }));
    } else {
      setSimulationData(prev => ({
        ...prev,
        [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const totalInvestment = calculateTotalInvestment(
    simulationData.propertyPrice,
    simulationData.costs
  );
  const requestedFinancing = totalInvestment - simulationData.initialContribution;
  const isFormValid = simulationData.initialContribution >= 0 && 
                     simulationData.tin > 0 && 
                     simulationData.tae > 0 && 
                     simulationData.loanTerm > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Detalles del préstamo</h2>
        
        <div className="space-y-6">
          {/* Initial Contribution */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Aportación inicial (cantidad ahorrada) *
            </label>
            <input
              type="number"
              value={simulationData.initialContribution || ''}
              onChange={(e) => handleInputChange('initialContribution', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Total Investment Summary */}
          <div className="bg-slate-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">
                Coste total de la inversión
              </span>
              <span className="text-lg font-semibold text-slate-200">
                {formatCurrency(totalInvestment)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">
                Aportación inicial
              </span>
              <span className="text-lg font-semibold text-slate-200">
                -{formatCurrency(simulationData.initialContribution)}
              </span>
            </div>
            <div className="border-t border-slate-600 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">
                  Financiación solicitada
                </span>
                <span className="text-xl font-bold text-orange-500">
                  {formatCurrency(requestedFinancing)}
                </span>
              </div>
            </div>
          </div>

          {/* Interest Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Tipo de Interés Nominal (TIN) % *
                </label>
                <HelpTooltip content="Tipo de interés nominal anual sin incluir gastos ni comisiones. Es el interés puro que se aplica al capital prestado para calcular los intereses." />
              </div>
              <input
                type="number"
                step="0.01"
                value={simulationData.tin || ''}
                onChange={(e) => handleInputChange('tin', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2.30"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Tasa Anual Equivalente (TAE) % *
                </label>
                <HelpTooltip content="Coste real del préstamo incluyendo gastos y comisiones. La TAE siempre es mayor que el TIN y representa el coste total efectivo del préstamo." />
              </div>
              <input
                type="number"
                step="0.01"
                value={simulationData.tae || ''}
                onChange={(e) => handleInputChange('tae', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2.80"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fecha de inicio del préstamo *
            </label>
            <input
              type="date"
              value={simulationData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Plazo del préstamo (años) *
            </label>
            <input
              type="number"
              value={simulationData.loanTerm || ''}
              onChange={(e) => handleInputChange('loanTerm', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="25"
            />
          </div>

          {/* Monthly Extras */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Seguros, comunidad y otros gastos mensuales
              </label>
              <HelpTooltip content="Gastos adicionales mensuales no incluidos en la cuota hipotecaria, como seguro de hogar, gastos de comunidad, IBI, etc. Estos gastos se suman al coste total mensual de la vivienda." />
            </div>
            <input
              type="number"
              value={simulationData.monthlyExtras || ''}
              onChange={(e) => handleInputChange('monthlyExtras', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
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
            disabled={!canGoNext || !isFormValid}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${
              canGoNext && isFormValid
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

export default LoanTab;