import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TabProps } from '../../../types/simulation';
import type { CostBreakdown } from '../../../types/simulation';
import { formatCurrency } from '../../../utils/formatters';
import { calculateTotalInvestment } from '../../../utils/calculations';
import HelpTooltip from '../../../shared/components/HelpTooltip';

const CostsTab: React.FC<TabProps> = ({ 
  simulationData, 
  updateSimulation,
  updateCosts,
  onNext, 
  canGoNext 
}) => {
  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'name') {
      updateSimulation({ name: typeof value === 'string' ? value : String(value) });
    } else if (field.startsWith('costs.')) {
      const costField = field.split('.')[1] as keyof CostBreakdown;
      updateCosts({ [costField]: typeof value === 'string' ? parseFloat(value) || 0 : value });
    } else {
      updateSimulation({ propertyPrice: typeof value === 'string' ? parseFloat(value) || 0 : value });
    }
  };

  const totalInvestment = calculateTotalInvestment(
    simulationData.propertyPrice,
    simulationData.costs
  );

  const costItems = [
    { 
      key: 'appraisal', 
      label: 'Tasación', 
      value: simulationData.costs.appraisal,
      reference: '350€',
      help: 'Coste de la valoración del inmueble por parte del banco'
    },
    { 
      key: 'notary', 
      label: 'Notaría', 
      value: simulationData.costs.notary,
      reference: '1200€',
      help: 'Coste de la escritura pública ante notario'
    },
    { 
      key: 'agency', 
      label: 'Gestoría', 
      value: simulationData.costs.agency,
      reference: '500€',
      help: 'Coste de los trámites administrativos'
    },
    { 
      key: 'registry', 
      label: 'Registro', 
      value: simulationData.costs.registry,
      reference: '600€',
      help: 'Coste de inscribir la propiedad a tu nombre'
    }
  ];

  const isFormValid = simulationData.name.trim() !== '' && simulationData.propertyPrice > 0 && Number.isFinite(simulationData.propertyPrice) && Object.values(simulationData.costs).every(value => Number.isFinite(value) && value >= 0);

  return (
    <div className="tool-layout">
      <div className="space-y-5">
        <h2 className="section-title mb-5">Costes iniciales</h2>
        
        <div className="space-y-6">
          {/* Simulation Name */}
          <div>
            <label htmlFor="simulation-name" className="block text-sm font-medium text-slate-300 mb-2">
              Nombre de la simulación *
            </label>
            <input id="simulation-name"
              type="text"
              value={simulationData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Ej: Casa en Madrid Centro"
            />
          </div>

          {/* Property Price */}
          <div>
            <label htmlFor="property-price" className="block text-sm font-medium text-slate-300 mb-2">
              Precio de la vivienda (sin impuestos) *
            </label>
            <input id="property-price"
              type="number"
              value={simulationData.propertyPrice || ''}
              onChange={(e) => handleInputChange('propertyPrice', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Mortgage Costs */}
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Gastos hipoteca</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {costItems.map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`cost-${item.key}`} className="block text-sm font-medium text-slate-300">
                      {item.label}
                    </label>
                    <HelpTooltip content={item.help} />
                  </div>
                  <input
                    type="number"
                    id={`cost-${item.key}`}
                    value={item.value || ''}
                    onChange={(e) => handleInputChange(`costs.${item.key}`, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-400">Referencia: {item.reference}</p>
                </div>
              ))}
            </div>

            {/* Tax Rate */}
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="tax-rate" className="block text-sm font-medium text-slate-300">
                  IVA/ITP (%)
                </label>
                <HelpTooltip content="Impuesto sobre Transmisiones Patrimoniales (ITP) para vivienda de segunda mano o IVA para vivienda nueva. Varía entre 6-10% según la comunidad autónoma." />
              </div>
              <input id="tax-rate"
                type="number"
                step="0.1"
                value={simulationData.costs.taxRate || ''}
                onChange={(e) => handleInputChange('costs.taxRate', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="10"
              />
              <p className="text-xs text-slate-400 mt-1">Referencia: 6-10% según CCAA</p>
            </div>
          </div>

          {/* Total Investment */}
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
              <span className="text-lg font-semibold text-slate-200">
                Precio + gastos de compra
              </span>
              <span className="text-2xl font-bold text-brand">
                {formatCurrency(totalInvestment)}
              </span>
            </div>
          </div>
        </div>

        {!isFormValid && <p className="mt-5 text-sm text-slate-300">Para continuar, da un nombre a la simulación e introduce el precio de la vivienda. Los gastos deben ser positivos o cero.</p>}
        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onNext}
            disabled={!canGoNext || !isFormValid}
            className={`w-full justify-center flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
              canGoNext && isFormValid
                ? 'bg-brand hover:bg-brand-hover text-slate-950'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Continuar al préstamo</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostsTab;
