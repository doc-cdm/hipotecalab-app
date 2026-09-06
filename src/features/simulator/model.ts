import type { SimulationData, SimulationInputs } from '../../types/simulation';
import { calculateMonthlyPayment, calculateTotalInvestment, generateAmortizationTable } from '../../utils/calculations';

export const calculateSimulation = (inputs: SimulationInputs): SimulationData => {
  const totalInvestment = calculateTotalInvestment(inputs.propertyPrice, inputs.costs);
  const principal = Math.max(0, totalInvestment - inputs.initialContribution);
  const monthlyInterestRate = inputs.tin / 100 / 12;
  const numberOfPayments = inputs.loanTerm * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, monthlyInterestRate, numberOfPayments);
  const monthlyPaymentWithExtras = monthlyPayment + inputs.monthlyExtras;
  const amortizationTable = generateAmortizationTable(
    principal,
    monthlyInterestRate,
    numberOfPayments,
    monthlyPayment,
    inputs.startDate
  );

  return {
    ...inputs,
    monthlyPayment,
    monthlyPaymentWithExtras,
    amortizationTable,
  };
};
