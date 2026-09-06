import { describe, expect, it } from 'vitest';
import {
  calculateMaximumLoan,
  calculateMonthlyPayment,
  calculateTotalInvestment,
  generateAmortizationTable,
} from './calculations';

describe('mortgage calculations', () => {
  it('calculates the total investment including taxes and purchase costs', () => {
    expect(calculateTotalInvestment(200_000, {
      appraisal: 350,
      notary: 1_200,
      agency: 500,
      registry: 600,
      taxRate: 10,
    })).toBe(222_650);
  });

  it('calculates fixed monthly payments and supports zero interest', () => {
    expect(calculateMonthlyPayment(100_000, 0.03 / 12, 360)).toBeCloseTo(421.60, 2);
    expect(calculateMonthlyPayment(1_200, 0, 12)).toBe(100);
  });

  it('returns safe results for invalid inputs', () => {
    expect(calculateMonthlyPayment(100_000, 0.03 / 12, 0)).toBe(0);
    expect(generateAmortizationTable(-1, 0, 12, 100, '2026-01-01')).toEqual([]);
    expect(calculateMaximumLoan(0, 30, 3, 25)).toEqual({
      maxMonthlyPayment: 0,
      maxLoanAmount: 0,
    });
  });

  it('keeps end-of-month payment dates stable', () => {
    const table = generateAmortizationTable(1_200, 0, 12, 100, '2024-01-31');

    expect(table).toHaveLength(12);
    expect(table[0].paymentDate).toBe('2024-02-29');
    expect(table[1].paymentDate).toBe('2024-03-31');
    expect(table[table.length - 1]?.remainingBalance).toBe(0);
  });

});
