import { useState, useRef, useEffect, type FC } from 'react';
import { Calculator, Home, Info } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateMaximumLoan } from '../../utils/calculations';
import HelpTooltip from '../../shared/components/HelpTooltip';
import { calculatePurchaseCosts, ITP_RATES, type Region, type ViabilityData } from './model';

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

  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (results) resultsRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [results]);

  const handleInputChange = (field: keyof ViabilityData, value: string | boolean) => {
    setResults(null);
    setData(prev => ({
      ...prev,
      [field]: field === 'region' ? value :
        field === 'isNewConstruction' ? value :
          parseFloat(value as string) || 0
    }));
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
    Number.isInteger(data.loanTerm) && data.loanTerm > 0 && data.loanTerm <= 50 &&
    data.debtRatio > 0 && data.debtRatio <= 100 &&
    [data.monthlyNetIncome, data.tin].every(Number.isFinite);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <p className="brand-eyebrow mb-2">VIABILIDAD</p><h1 className="text-2xl font-semibold mb-3">¿Qué encaja con tu presupuesto?</h1><p className="text-sm text-slate-300 mb-6">Introduce tus ingresos y las condiciones del préstamo para explorar tu capacidad de compra.</p>

          <div className="space-y-6">
            {/* Monthly Net Income */}
            <div>
              <label htmlFor="viability-monthlyNetIncome" className="block text-sm font-medium text-slate-300 mb-2">
                Ingresos netos mensuales *
              </label>
              <input
                id="viability-monthlyNetIncome"
                type="number"
                value={data.monthlyNetIncome || ''}
                onChange={(e) => handleInputChange('monthlyNetIncome', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="3000"
              />
            </div>

            {/* Debt Ratio */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="viability-debtRatio" className="block text-sm font-medium text-slate-300">
                  Porcentaje de ingresos para la hipoteca (%) *
                </label>
                <HelpTooltip content="Porcentaje máximo de ingresos destinado al pago de la hipoteca. Se recomienda mantenerlo por debajo del 30% para garantizar estabilidad financiera y capacidad de ahorro." />
              </div>
              <input
                id="viability-debtRatio"
                type="number"
                step="0.1"
                value={data.debtRatio || ''}
                onChange={(e) => handleInputChange('debtRatio', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="30"
              />
              <p className="text-xs text-slate-400 mt-1">Recomendado: &lt;30%</p>
            </div>

            {/* TIN */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="viability-tin" className="block text-sm font-medium text-slate-300">
                  Tipo de Interés Nominal (TIN) % *
                </label>
                <HelpTooltip content="Tipo de interés nominal anual del préstamo hipotecario, sin incluir gastos ni comisiones adicionales. Es el interés que se aplica al capital prestado." />
              </div>
              <input
                id="viability-tin"
                type="number"
                step="0.01"
                value={data.tin || ''}
                onChange={(e) => handleInputChange('tin', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="2.30"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label htmlFor="viability-loanTerm" className="block text-sm font-medium text-slate-300 mb-2">
                Plazo del préstamo (años) *
              </label>
              <input
                id="viability-loanTerm"
                type="number"
                value={data.loanTerm || ''}
                onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="25"
              />
            </div>

            {/* Region */}
            <div>
              <label htmlFor="viability-region" className="block text-sm font-medium text-slate-300 mb-2">
                Comunidad Autónoma *
              </label>
              <select
                id="viability-region"
                value={data.region}
                onChange={(e) => handleInputChange('region', e.target.value as Region)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                {Object.keys(ITP_RATES).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                ITP de referencia: {ITP_RATES[data.region]}%
              </p>
            </div>

            {/* New Construction */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isNewConstruction}
                  onChange={(e) => handleInputChange('isNewConstruction', e.target.checked)}
                  className="w-5 h-5 bg-slate-700 border border-slate-600 rounded text-brand focus:ring-2 focus:ring-brand"
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
                className={`w-full flex justify-center items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-colors ${isFormValid
                    ? 'bg-brand hover:bg-brand-hover text-slate-950'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <Calculator size={20} />
                <span>Ver mi presupuesto</span>
              </button>
            </div>

            {!results && <p className="text-sm text-slate-300 rounded-xl border border-dashed border-slate-600 p-4">{isFormValid ? 'Todo listo. Pulsa «Ver mi presupuesto» para descubrir tu resultado.' : 'Completa ingresos e interés positivos, un plazo de 1 a 50 años y un porcentaje de endeudamiento entre 0 y 100 (mayor que 0).'}</p>}
            {/* Results */}
            {results && (
              <div ref={resultsRef} role="region" aria-label="Resultados de viabilidad" className="bg-slate-700 rounded-lg p-6 scroll-mt-24">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Tu presupuesto orientativo</h3>

                <p className="text-sm text-slate-300 mb-5">Con ingresos de {formatCurrency(data.monthlyNetIncome)} al mes, destinar el {formatPercentage(data.debtRatio)} a la hipoteca equivale a {formatCurrency(results.maxMonthlyPayment)} al mes. A un TIN del {formatPercentage(data.tin)} durante {data.loanTerm} años, esa cuota permite calcular el préstamo siguiente.</p>
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Cuota según el porcentaje elegido</div>
                    <div className="text-2xl font-bold text-brand">
                      {formatCurrency(results.maxMonthlyPayment)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Préstamo estimado</div>
                    <div className="text-2xl font-bold text-brand">
                      {formatCurrency(results.maxLoanAmount)}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-white flex items-center gap-2"><Home size={20} aria-hidden="true" />Precio de vivienda y ahorro necesario</h4>
                  <p className="mt-2 mb-4 text-sm text-slate-300">Los tres ejemplos usan el mismo préstamo de {formatCurrency(results.maxLoanAmount)}. Lo que cambia es cuánto pone el banco y cuánto tendrías que aportar tú.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0.8, 0.85, 0.9].map(financingRatio => {
                      const propertyPrice = results.maxLoanAmount / financingRatio;
                      const downPayment = propertyPrice - results.maxLoanAmount;
                      const costs = calculatePurchaseCosts(propertyPrice, data.region, data.isNewConstruction);
                      return (
                        <article key={financingRatio} className="rounded-xl border border-slate-600 bg-slate-800 p-4">
                          <h5 className="text-sm font-semibold text-white">Si el banco financia el {Math.round(financingRatio * 100)}%</h5>
                          <dl className="mt-4 space-y-4">
                            <div><dt className="text-sm text-slate-300">Precio de la vivienda</dt><dd className="text-xl font-bold text-brand">{formatCurrency(propertyPrice)}</dd></div>
                            <div><dt className="text-sm text-slate-300">Entrada que aportas tú</dt><dd className="font-semibold">{formatCurrency(downPayment)}</dd></div>
                            <div><dt className="text-sm text-slate-300">Gastos e impuestos estimados</dt><dd className="font-semibold">{formatCurrency(costs.totalCosts)}</dd></div>
                            <div className="border-t border-slate-600 pt-3"><dt className="text-sm font-semibold text-white">Ahorro necesario para comprar</dt><dd className="text-xl font-bold text-brand">{formatCurrency(downPayment + costs.totalCosts)}</dd><p className="text-xs text-slate-400 mt-1">Entrada + gastos e impuestos estimados</p></div>
                          </dl>
                          <details className="mt-4 text-sm">
                            <summary className="cursor-pointer py-2 text-slate-300">Ver desglose de gastos</summary>
                            <dl className="mt-2 space-y-2 text-slate-300">{[['Tasación', costs.appraisal], ['Notaría', costs.notary], ['Gestoría', costs.agency], ['Registro', costs.registry], [data.isNewConstruction ? 'IVA estimado' : 'ITP estimado', costs.tax]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2"><dt>{label}</dt><dd>{formatCurrency(Number(value))}</dd></div>)}</dl>
                          </details>
                        </article>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-6 rounded-xl border border-slate-600 p-4 text-sm text-slate-300">
                  <h4 className="flex items-center gap-2 font-semibold text-white mb-2"><Info size={18} aria-hidden="true" />Cómo interpretar esta estimación</h4>
                  <p>No es una aprobación bancaria. No hemos comprobado tus ahorros, otros préstamos ni tus gastos habituales. Compara el ahorro necesario con lo que tienes disponible y deja margen para imprevistos.</p>
                  <p className="mt-2">La financiación del 80%, 85% o 90% son escenarios de comparación, no ofertas garantizadas. Los gastos e impuestos son orientativos; confirma los que correspondan a tu compra.</p>
                </div>

                {/* Additional Info */}
                <div className="p-4 bg-slate-700/40 border border-slate-600/30 rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-2">Información del cálculo</h4>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>• Tasa de endeudamiento aplicada: <span className="text-brand font-medium">{formatPercentage(data.debtRatio)}</span></p>
                    <p>• Basado en ingresos netos de: <span className="text-brand font-medium">{formatCurrency(data.monthlyNetIncome)}/mes</span></p>
                    <p>• Tipo de interés considerado: <span className="text-brand font-medium">{formatPercentage(data.tin)}</span></p>
                    <p>• Plazo del préstamo: <span className="text-brand font-medium">{data.loanTerm} años</span></p>
                    <p>• Comunidad Autónoma: <span className="text-brand font-medium">{data.region}</span></p>
                    <p>• Tipo de vivienda: <span className="text-brand font-medium">{data.isNewConstruction ? 'Obra nueva (IVA 10%)' : `Segunda mano (ITP ${ITP_RATES[data.region]}%)`}</span></p>
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
