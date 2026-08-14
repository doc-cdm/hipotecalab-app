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

export interface SimulationData {
  name: string;
  propertyPrice: number;
  costs: CostBreakdown;
  initialContribution: number;
  tin: number;
  tae: number;
  startDate: string;
  loanTerm: number;
  monthlyExtras: number;
  monthlyPayment: number;
  monthlyPaymentWithExtras: number;
  amortizationTable: AmortizationRow[];
  viabilityData?: ViabilitySpecificData; // Datos opcionales para análisis de viabilidad
}

export interface TabProps {
  simulationData: SimulationData;
  setSimulationData: React.Dispatch<React.SetStateAction<SimulationData>>;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export interface SavedSimulation {
  id?: string;
  userId: string;
  name: string;
  data: SimulationData;
  createdAt: Date | string;
}