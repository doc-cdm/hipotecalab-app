import { saveFile, type SaveResult } from '../../../shared/utils/saveFile';
import type { Cell, SheetData } from 'write-excel-file/browser';
import type { SimulationData } from '../../../types/simulation';
import { calculateTotalInvestment } from '../../../utils/calculations';

const titleCell = (value: string): Cell => ({
  value,
  fontWeight: 'bold',
  fontSize: 16,
  textColor: '#f97316',
});

const sectionCell = (value: string): Cell => ({
  value,
  fontWeight: 'bold',
  backgroundColor: '#E2E8F0',
});

const currencyCell = (value: number): Cell => ({
  value,
  type: Number,
  format: '#,##0.00 [$€-es-ES]',
});

const percentageCell = (value: number): Cell => ({
  value: value / 100,
  type: Number,
  format: '0.00%',
});

export const buildWorkbookData = (simulationData: SimulationData) => {
  const totalInvestment = calculateTotalInvestment(
    simulationData.propertyPrice,
    simulationData.costs
  );
  const requestedFinancing = totalInvestment - simulationData.initialContribution;
  const financingPercentage = simulationData.propertyPrice > 0
    ? (requestedFinancing / simulationData.propertyPrice) * 100
    : 0;
  const totalInterest = simulationData.amortizationTable.reduce(
    (sum, row) => sum + row.interest,
    0
  );

  const summary: SheetData = [
    [titleCell('SIMULACIÓN HIPOTECARIA')],
    ['Fecha', new Date().toLocaleDateString('es-ES')],
    [],
    [sectionCell('INFORMACIÓN DEL INMUEBLE')],
    ['Precio del inmueble', currencyCell(simulationData.propertyPrice)],
    ['Coste total de la inversión', currencyCell(totalInvestment)],
    ['Aportación inicial', currencyCell(simulationData.initialContribution)],
    ['Financiación solicitada', currencyCell(requestedFinancing)],
    ['Porcentaje financiado', percentageCell(financingPercentage)],
    [],
    [sectionCell('CONDICIONES DEL PRÉSTAMO')],
    ['Plazo', `${simulationData.loanTerm} años`],
    ['TIN', percentageCell(simulationData.tin)],
    ['TAE', percentageCell(simulationData.tae)],
    ['Fecha de inicio', simulationData.startDate],
    [],
    [sectionCell('INFORMACIÓN DE CUOTAS')],
    ['Cuota de la hipoteca', currencyCell(simulationData.monthlyPayment)],
    ['Gasto mensual con seguros y otros gastos', currencyCell(simulationData.monthlyPaymentWithExtras)],
    ['Coste total del préstamo', currencyCell(totalInvestment + totalInterest)],
    ['Intereses totales', currencyCell(totalInterest)],
  ];

  const costs: SheetData = [
    [titleCell('DESGLOSE DE COSTES')],
    [],
    [sectionCell('Concepto'), sectionCell('Importe')],
    ['Notaría', currencyCell(simulationData.costs.notary)],
    ['Registro de la Propiedad', currencyCell(simulationData.costs.registry)],
    ['Gestoría', currencyCell(simulationData.costs.agency)],
    ['Tasación', currencyCell(simulationData.costs.appraisal)],
    ['ITP/IVA', percentageCell(simulationData.costs.taxRate)],
  ];

  const amortization: SheetData = [
    [titleCell('TABLA DE AMORTIZACIÓN')],
    [],
    ['Cuota', 'Fecha', 'Pago total', 'Capital', 'Intereses', 'Saldo pendiente']
      .map((heading) => sectionCell(heading)),
    ...simulationData.amortizationTable.map((row) => [
      row.month,
      row.paymentDate,
      currencyCell(row.payment),
      currencyCell(row.principal),
      currencyCell(row.interest),
      currencyCell(row.remainingBalance),
    ]),
  ];

  return { summary, costs, amortization };
};

export const exportToExcel = async (simulationData: SimulationData): Promise<SaveResult> => {
  const { default: writeXlsxFile } = await import('write-excel-file/browser');
  const workbook = buildWorkbookData(simulationData);

  const blob = await writeXlsxFile([
    {
      data: workbook.summary,
      sheet: 'Resumen',
      columns: [{ width: 34 }, { width: 22 }],
    },
    {
      data: workbook.costs,
      sheet: 'Costes',
      columns: [{ width: 34 }, { width: 22 }],
    },
    {
      data: workbook.amortization,
      sheet: 'Amortización',
      columns: [
        { width: 10 },
        { width: 16 },
        { width: 18 },
        { width: 18 },
        { width: 18 },
        { width: 20 },
      ],
      stickyRowsCount: 3,
    },
  ]).toBlob();
  return saveFile(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `simulacion-hipotecaria-${new Date().toISOString().split('T')[0]}.xlsx`);
};
