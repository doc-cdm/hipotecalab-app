import { describe, expect, it } from 'vitest';
import { calculateSimulation } from './model';
import { buildWorkbookData } from './exporters/excel';
import type { SimulationInputs } from '../../types/simulation';

const inputs: SimulationInputs = {
  name: 'Hipoteca', propertyPrice: 200000, initialContribution: 62650,
  costs: { appraisal: 350, notary: 1200, agency: 500, registry: 600, taxRate: 10 },
  tin: 3, tae: 3.2, startDate: '2026-01-01', loanTerm: 30, monthlyExtras: 0,
};
describe('household expenses are separate from mortgage repayment', () => {
  it.each([0, 3])('keeps the full schedule and exported mortgage payments at %s percent interest', tin => {
    const mortgage = calculateSimulation({ ...inputs, tin });
    const withExpenses = calculateSimulation({ ...inputs, tin, monthlyExtras: 150 });
    expect(withExpenses.monthlyPayment).toBe(mortgage.monthlyPayment);
    expect(withExpenses.monthlyPaymentWithExtras).toBe(mortgage.monthlyPayment + 150);
    expect(withExpenses.amortizationTable).toEqual(mortgage.amortizationTable);
    expect(withExpenses.amortizationTable).toHaveLength(360);
    expect(withExpenses.amortizationTable[0].payment).toBeCloseTo(mortgage.monthlyPayment, 8);
    expect(withExpenses.amortizationTable[withExpenses.amortizationTable.length - 1]?.remainingBalance).toBeCloseTo(0, 6);
    expect(withExpenses.amortizationTable.reduce((sum, row) => sum + row.principal, 0)).toBeCloseTo(160000, 6);
    expect(buildWorkbookData(withExpenses).amortization).toEqual(buildWorkbookData(mortgage).amortization);
  });
});
