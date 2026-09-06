import { CostBreakdown, AmortizationRow } from '../types/simulation';

export const calculateTotalInvestment = (propertyPrice: number, costs: CostBreakdown): number => {
  if (!Number.isFinite(propertyPrice) || propertyPrice < 0) return 0;

  const taxAmount = (propertyPrice * costs.taxRate) / 100;
  return propertyPrice + costs.appraisal + costs.notary + costs.agency + costs.registry + taxAmount;
};

export const calculateMonthlyPayment = (
  principal: number,
  monthlyInterestRate: number,
  numberOfPayments: number
): number => {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(monthlyInterestRate) ||
    !Number.isFinite(numberOfPayments) ||
    principal <= 0 ||
    monthlyInterestRate < 0 ||
    numberOfPayments <= 0
  ) {
    return 0;
  }

  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }

  const monthlyPayment = 
    principal * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyPayment;
};

const addMonthsClamped = (date: string, monthsToAdd: number): string => {
  const [year, month, day] = date.split('-').map(Number);
  if (![year, month, day].every(Number.isFinite)) return date;

  const targetMonthIndex = month - 1 + monthsToAdd;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonthIndex = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, normalizedMonthIndex + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDayOfTargetMonth);

  return [
    targetYear.toString().padStart(4, '0'),
    (normalizedMonthIndex + 1).toString().padStart(2, '0'),
    targetDay.toString().padStart(2, '0'),
  ].join('-');
};

export const generateAmortizationTable = (
  principal: number,
  monthlyInterestRate: number,
  numberOfPayments: number,
  monthlyPayment: number,
  startDate: string
): AmortizationRow[] => {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(monthlyInterestRate) ||
    !Number.isFinite(numberOfPayments) ||
    !Number.isFinite(monthlyPayment) ||
    principal <= 0 ||
    monthlyInterestRate < 0 ||
    numberOfPayments <= 0 ||
    monthlyPayment <= 0
  ) {
    return [];
  }

  const table: AmortizationRow[] = [];
  let remainingBalance = principal;
  let amortizedCapital = 0;

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const scheduledPayment = monthlyPayment;
    const principalPayment = Math.min(
      remainingBalance,
      Math.max(0, scheduledPayment - interestPayment)
    );

    if (principalPayment <= 0) break;

    const actualPayment = interestPayment + principalPayment;
    
    remainingBalance -= principalPayment;
    amortizedCapital += principalPayment;

    // Ensure remaining balance doesn't go negative due to rounding
    if (remainingBalance < 0) {
      remainingBalance = 0;
    }

    table.push({
      month,
      paymentDate: addMonthsClamped(startDate, month),
      payment: actualPayment,
      interest: interestPayment,
      principal: principalPayment,
      remainingBalance,
      amortizedCapital
    });

    // Break if balance is paid off
    if (remainingBalance <= 0) {
      break;
    }
  }

  return table;
};

export const calculateMaximumLoan = (
  monthlyNetIncome: number,
  debtRatio: number,
  tin: number,
  loanTermYears: number
): { maxMonthlyPayment: number; maxLoanAmount: number } => {
  if (
    !Number.isFinite(monthlyNetIncome) ||
    !Number.isFinite(debtRatio) ||
    !Number.isFinite(tin) ||
    !Number.isFinite(loanTermYears) ||
    monthlyNetIncome <= 0 ||
    debtRatio <= 0 ||
    tin < 0 ||
    loanTermYears <= 0
  ) {
    return { maxMonthlyPayment: 0, maxLoanAmount: 0 };
  }

  const maxMonthlyPayment = (monthlyNetIncome * debtRatio) / 100;
  const monthlyInterestRate = tin / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  let maxLoanAmount = 0;
  if (monthlyInterestRate > 0) {
    maxLoanAmount = maxMonthlyPayment * 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) /
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments));
  } else {
    maxLoanAmount = maxMonthlyPayment * numberOfPayments;
  }

  return { maxMonthlyPayment, maxLoanAmount };
};
