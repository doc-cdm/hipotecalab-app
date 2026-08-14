import { useState, type FC } from 'react';
import { Calculator } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateMaximumLoan } from '../../utils/calculations';
import HelpTooltip from '../../components/HelpTooltip';

interface ViabilityData {
  monthlyNetIncome: number;
  debtRatio: number;
  tin: number;
  loanTerm: number;
  region: string;
  isNewConstruction: boolean;
}

// ITP rates by region (2024)
const ITP_RATES: Record<string, number> = {
  'Andalucía': 7,
  'Aragón': 8,
  'Asturias': 8,
  'Baleares': 8,
  'Canarias': 6.5,
  'Cantabria': 9,
  'Castilla-La Mancha': 9,
  'Castilla y León': 8,
  'Cataluña': 10,
  'Ceuta': 6,
  'Madrid': 6,
  'C. Valenciana': 10,
  'Extremadura': 8,
  'Galicia': 8,
  'La Rioja': 7,
  'Melilla': 6,
  'Murcia': 8,
  'Navarra': 6,
  'País Vasco': 7
};

const Viability: FC = () => {
  const [data, setData] = useState<ViabilityData>({
    monthlyNetIncome: 0,
    debtRatio: 30,
    tin: 0,
    loanTerm: 25,
    region: 'Madrid',
    isNewConstruction: false
  });

  const [results, setResults] = useState<{
    maxMonthlyPayment: number;
    maxLoanAmount: number;
  } | null>(null);

  const handleInputChange = (field: keyof ViabilityData, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      [field]: field === 'region' ? value :
        field === 'isNewConstruction' ? value :
          parseFloat(value as string) || 0
    }));
  };

  // Calculate purchase costs
  const calculatePurchaseCosts = (propertyPrice: number) => {
    const appraisal = 350;
    const notary = 1200;
    const agency = 500;
    const registry = 600;

    // ITP or IVA depending on new construction
    let tax = 0;
    if (data.isNewConstruction) {
      // New construction: IVA 10%
      tax = propertyPrice * 0.10;
    } else {
      // Second hand: ITP based on region
      const itpRate = ITP_RATES[data.region] || 7;
      tax = propertyPrice * (itpRate / 100);
    }

    const totalCosts = appraisal + notary + agency + registry + tax;

    return {
      appraisal,
      notary,
      agency,
      registry,
      tax,
      totalCosts
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateMaximumLoan(
      data.monthlyNetIncome,
      data.debtRatio,
      data.tin,
      data.loanTerm
    );
    setResults(calculatedResults);
  };

  const isFormValid = data.monthlyNetIncome > 0 &&
    data.tin > 0 &&
    data.loanTerm > 0;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">
            Cálculo de viabilidad financiera
          </h2>

          <div className="space-y-6">
            {/* Monthly Net Income */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ingresos netos mensuales *
              </label>
              <input
                type="number"
                value={data.monthlyNetIncome || ''}
                onChange={(e) => handleInputChange('monthlyNetIncome', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="3000"
              />
            </div>

            {/* Debt Ratio */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Tasa de endeudamiento (%) *
                </label>
                <HelpTooltip content="Porcentaje máximo de ingresos destinado al pago de la hipoteca. Se recomienda mantenerlo por debajo del 30% para garantizar estabilidad financiera y capacidad de ahorro." />
              </div>
              <input
                type="number"
                step="0.1"
                value={data.debtRatio || ''}
                onChange={(e) => handleInputChange('debtRatio', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="30"
              />
              <p className="text-xs text-slate-400 mt-1">Recomendado: &lt;30%</p>
            </div>

            {/* TIN */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Tipo de Interés Nominal (TIN) % *
                </label>
                <HelpTooltip content="Tipo de interés nominal anual del préstamo hipotecario, sin incluir gastos ni comisiones adicionales. Es el interés que se aplica al capital prestado." />
              </div>
              <input
                type="number"
                step="0.01"
                value={data.tin || ''}
                onChange={(e) => handleInputChange('tin', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2.30"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Plazo del préstamo (años) *
              </label>
              <input
                type="number"
                value={data.loanTerm || ''}
                onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="25"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Comunidad Autónoma *
              </label>
              <select
                value={data.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Object.keys(ITP_RATES).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                ITP aplicable: {ITP_RATES[data.region]}%
              </p>
            </div>

            {/* New Construction */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isNewConstruction}
                  onChange={(e) => handleInputChange('isNewConstruction', e.target.checked)}
                  className="w-5 h-5 bg-slate-700 border border-slate-600 rounded text-orange-500 focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-slate-300">
                  ¿Es obra nueva?
                </span>
              </label>
              <p className="text-xs text-slate-400 mt-1 ml-8">
                {data.isNewConstruction
                  ? 'Se aplicará IVA 10% en lugar de ITP'
                  : `Se aplicará ITP del ${ITP_RATES[data.region]}%`
                }
              </p>
            </div>

            {/* Calculate Button */}
            <div className="text-center">
              <button
                onClick={handleCalculate}
                disabled={!isFormValid}
                className={`inline-flex items-center space-x-2 px-8 py-3 rounded-md font-medium transition-colors ${isFormValid
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <Calculator size={20} />
                <span>Calcular</span>
              </button>
            </div>

            {/* Results */}
            {results && (
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Resultados de Viabilidad</h3>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Cuota máxima mensual</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {formatCurrency(results.maxMonthlyPayment)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Capital máximo financiable</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {formatCurrency(results.maxLoanAmount)}
                    </div>
                  </div>
                </div>

                {/* Property Price Estimations */}
                <div className="mb-6 p-4 bg-slate-800/80 border border-slate-600/60 rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-3 flex items-center">
                    <span className="mr-2">🏠</span>
                    Estimación de precio de vivienda según financiación
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0.8, 0.85, 0.9].map((financingRatio) => {
                      const propertyPrice = results.maxLoanAmount / financingRatio;
                      const downPayment = propertyPrice * (1 - financingRatio);
                      const costs = calculatePurchaseCosts(propertyPrice);
                      const totalInitialPayment = downPayment + costs.totalCosts;

                      return (
                        <div key={financingRatio} className="text-center p-3 bg-slate-700/50 rounded-lg border border-orange-500/40 hover:border-orange-400/60 transition-colors">
                          <div className="text-sm text-slate-400 mb-1">
                            Financiando el {(financingRatio * 100).toFixed(0)}%
                          </div>
                          <div className="text-lg font-bold text-amber-400 mb-2">
                            {formatCurrency(propertyPrice)}
                          </div>
                          <div className="text-xs text-slate-300 space-y-2">
                            <div>
                              <div className="text-slate-400 font-medium">Entrada (sin gastos):</div>
                              <div className="text-sm font-semibold text-slate-100">
                                {formatCurrency(downPayment)}
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-600">
                              <div className="text-slate-400 font-medium mb-1">Gastos de compra:</div>
                              <div className="text-xs space-y-0.5">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">• Tasación:</span>
                                  <span>{formatCurrency(costs.appraisal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">• Notaría:</span>
                                  <span>{formatCurrency(costs.notary)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">• Gestoría:</span>
                                  <span>{formatCurrency(costs.agency)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">• Registro:</span>
                                  <span>{formatCurrency(costs.registry)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">• {data.isNewConstruction ? 'IVA (10%)' : `ITP (${ITP_RATES[data.region]}%)`}:</span>
                                  <span>{formatCurrency(costs.tax)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-slate-600 font-semibold">
                                  <span className="text-slate-300">Total gastos:</span>
                                  <span className="text-orange-400">{formatCurrency(costs.totalCosts)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-600">
                              <div className="text-amber-400 font-medium">Entrada inicial total:</div>
                              <div className="text-base font-bold text-green-400">
                                {formatCurrency(totalInitialPayment)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-slate-400 mt-3 text-center">
                    La entrada inicial total incluye la entrada (parte no financiada) más todos los gastos de compraventa.
                  </p>
                </div>

                {/* Explanation Section */}
                <div className="mb-6 p-4 bg-slate-800/60 border border-slate-600/40 rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-3 flex items-center">
                    <span className="mr-2">💡</span>
                    ¿Qué significan estos resultados?
                  </h4>
                  <div className="text-sm text-slate-300 space-y-3">
                    <div>
                      <strong className="text-amber-400">Cuota máxima mensual:</strong>
                      <p className="mt-1">Es el importe máximo que puedes destinar mensualmente al pago de la hipoteca, calculado según tu tasa de endeudamiento del {formatPercentage(data.debtRatio)}. Esta cantidad garantiza que mantengas un equilibrio financiero saludable.</p>
                    </div>
                    <div>
                      <strong className="text-amber-400">Capital máximo financiable:</strong>
                      <p className="mt-1">Es la cantidad máxima que una entidad financiera te podría prestar considerando tus ingresos, la tasa de interés y el plazo seleccionado. Este cálculo te ayuda a determinar el rango de precios de vivienda que puedes considerar.</p>
                    </div>
                    <div>
                      <strong className="text-amber-400">Estimación de precio de vivienda:</strong>
                      <p className="mt-1">Basándose en el capital máximo financiable ({formatCurrency(results.maxLoanAmount)}), estos valores muestran el precio total de vivienda que podrías permitirte según diferentes porcentajes de financiación. La entrada inicial total ya incluye tanto la parte no financiada como todos los gastos de compraventa calculados según tu comunidad autónoma ({data.region}) y tipo de vivienda ({data.isNewConstruction ? 'obra nueva' : 'segunda mano'}).</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="p-4 bg-slate-700/40 border border-slate-600/30 rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-2">Información del cálculo</h4>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>• Tasa de endeudamiento aplicada: <span className="text-amber-400 font-medium">{formatPercentage(data.debtRatio)}</span></p>
                    <p>• Basado en ingresos netos de: <span className="text-amber-400 font-medium">{formatCurrency(data.monthlyNetIncome)}/mes</span></p>
                    <p>• Tipo de interés considerado: <span className="text-amber-400 font-medium">{formatPercentage(data.tin)}</span></p>
                    <p>• Plazo del préstamo: <span className="text-amber-400 font-medium">{data.loanTerm} años</span></p>
                    <p>• Comunidad Autónoma: <span className="text-amber-400 font-medium">{data.region}</span></p>
                    <p>• Tipo de vivienda: <span className="text-amber-400 font-medium">{data.isNewConstruction ? 'Obra nueva (IVA 10%)' : `Segunda mano (ITP ${ITP_RATES[data.region]}%)`}</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viability;
