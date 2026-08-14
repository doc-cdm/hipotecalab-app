import { CostBreakdown, AmortizationRow } from '../types/simulation';

export const calculateTotalInvestment = (propertyPrice: number, costs: CostBreakdown): number => {
  const taxAmount = (propertyPrice * costs.taxRate) / 100;
  return propertyPrice + costs.appraisal + costs.notary + costs.agency + costs.registry + taxAmount;
};

export const calculateMonthlyPayment = (
  principal: number,
  monthlyInterestRate: number,
  numberOfPayments: number
): number => {
  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }

  const monthlyPayment = 
    principal * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyPayment;
};

export const generateAmortizationTable = (
  principal: number,
  monthlyInterestRate: number,
  numberOfPayments: number,
  monthlyPayment: number,
  startDate: string
): AmortizationRow[] => {
  const table: AmortizationRow[] = [];
  let remainingBalance = principal;
  let amortizedCapital = 0;
  const startDateObj = new Date(startDate);

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    remainingBalance -= principalPayment;
    amortizedCapital += principalPayment;

    // Ensure remaining balance doesn't go negative due to rounding
    if (remainingBalance < 0) {
      remainingBalance = 0;
    }

    // Calculate payment date (add months to start date)
    const paymentDate = new Date(startDateObj);
    paymentDate.setMonth(paymentDate.getMonth() + month);

    table.push({
      month,
      paymentDate: paymentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      payment: monthlyPayment,
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