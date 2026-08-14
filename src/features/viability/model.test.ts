import { describe, expect, it } from 'vitest';
import { calculatePurchaseCosts } from './model';

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
});
