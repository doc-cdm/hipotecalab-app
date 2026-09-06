import { describe, expect, it } from 'vitest';
import { calculatePurchaseCosts, createViabilityScenario } from './model';
import { calculateSimulation } from '../simulator/model';
import { calculateMaximumLoan } from '../../utils/calculations';

describe('viability purchase costs', () => {
  it('uses the regional transfer tax for a second-hand property', () => {
    const costs = calculatePurchaseCosts(200_000, 'Madrid', false);
    expect(costs.tax).toBe(12_000);
    expect(costs.totalCosts).toBe(14_650);
  });

  it('uses VAT for a new property', () => {
    const costs = calculatePurchaseCosts(200_000, 'Madrid', true);
    expect(costs.tax).toBe(20_000);
    expect(costs.totalCosts).toBe(22_650);
  });

  it.each([0.8, 0.85, 0.9])('preserves the estimated loan and payment when transferring %s financing', ratio => {
    const data = { monthlyNetIncome: 3000, debtRatio: 30, tin: 3, loanTerm: 25, region: 'Madrid' as const, isNewConstruction: false };
    const result = calculateMaximumLoan(data.monthlyNetIncome, data.debtRatio, data.tin, data.loanTerm);
    const scenario = createViabilityScenario(data, result.maxLoanAmount, ratio);
    const simulation = calculateSimulation({
      name: '', propertyPrice: 0, initialContribution: 0, tin: 0, tae: 0,
      loanTerm: 25, monthlyExtras: 0, startDate: '2026-01-01',
      costs: { appraisal: 0, notary: 0, registry: 0, agency: 0, taxRate: 0 },
      ...scenario,
    });
    expect(simulation.monthlyPayment).toBeCloseTo(result.maxMonthlyPayment, 6);
    expect(simulation.amortizationTable.reduce((sum, row) => sum + row.principal, 0)).toBeCloseTo(result.maxLoanAmount, 6);
    expect(simulation.initialContribution).toBeGreaterThan(simulation.propertyPrice - result.maxLoanAmount);
    expect(simulation.monthlyExtras).toBe(0);
  });
});
