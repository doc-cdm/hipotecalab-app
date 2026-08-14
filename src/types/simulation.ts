export interface CostBreakdown {
  appraisal: number;
  notary: number;
  agency: number;
  registry: number;
  taxRate: number;
}

export interface AmortizationRow {
  month: number;
  paymentDate: string;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
  amortizedCapital: number;
}

export interface ViabilitySpecificData {
  monthlyNetIncome: number;
  debtRatio: number;
  maxLoanAmount: number;
  type: 'viability';
}

export interface SimulationInputs {
  name: string;
  propertyPrice: number;
  costs: CostBreakdown;
  initialContribution: number;
  tin: number;
  tae: number;
  startDate: string;
  loanTerm: number;
  monthlyExtras: number;
}

export interface SimulationResults {
  monthlyPayment: number;
  monthlyPaymentWithExtras: number;
  amortizationTable: AmortizationRow[];
}

export type SimulationData = SimulationInputs & SimulationResults;

export type UpdateSimulation = (patch: Partial<SimulationInputs>) => void;
export type UpdateCosts = (patch: Partial<CostBreakdown>) => void;

export interface TabProps {
  simulationData: SimulationData;
  updateSimulation: UpdateSimulation;
  updateCosts: UpdateCosts;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}
