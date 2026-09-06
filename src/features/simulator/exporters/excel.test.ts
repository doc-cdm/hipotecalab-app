import { describe, expect, it } from 'vitest';
import writeXlsxFile from 'write-excel-file/node';
import type { SimulationData } from '../../../types/simulation';
import { buildWorkbookData } from './excel';

const simulation: SimulationData = {
  name: 'Test',
  propertyPrice: 200_000,
  costs: { appraisal: 350, notary: 1_200, agency: 500, registry: 600, taxRate: 10 },
  initialContribution: 50_000,
  tin: 3,
  tae: 3.2,
  startDate: '2026-01-01',
  loanTerm: 25,
  monthlyExtras: 100,
  monthlyPayment: 800,
  monthlyPaymentWithExtras: 900,
  amortizationTable: [{
    month: 1,
    paymentDate: '2026-02-01',
    payment: 800,
    interest: 300,
    principal: 500,
    remainingBalance: 149_500,
    amortizedCapital: 500,
  }],
};

describe('Excel workbook data', () => {
  it('builds summary, costs, and amortization sheets', () => {
    const workbook = buildWorkbookData(simulation);
    expect(workbook.summary.length).toBeGreaterThan(10);
    expect(workbook.costs).toHaveLength(8);
    expect(workbook.amortization).toHaveLength(4);
    expect(workbook.amortization[3][0]).toBe(1);
  });

  it('serializes the workbook as a valid XLSX payload', async () => {
    const workbook = buildWorkbookData(simulation);
    const output = await writeXlsxFile([
      { data: workbook.summary, sheet: 'Resumen' },
      { data: workbook.costs, sheet: 'Costes' },
      { data: workbook.amortization, sheet: 'Amortización' },
    ]).toBuffer();

    expect(output.byteLength).toBeGreaterThan(1_000);
  });
});
