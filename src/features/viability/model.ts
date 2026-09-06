import type { SimulationInputs } from '../../types/simulation';

export const ITP_RATES = {
  Andalucía: 7,
  Aragón: 8,
  Asturias: 8,
  Baleares: 8,
  Canarias: 6.5,
  Cantabria: 9,
  'Castilla-La Mancha': 9,
  'Castilla y León': 8,
  Cataluña: 10,
  Ceuta: 6,
  Madrid: 6,
  'C. Valenciana': 10,
  Extremadura: 8,
  Galicia: 8,
  'La Rioja': 7,
  Melilla: 6,
  Murcia: 8,
  Navarra: 6,
  'País Vasco': 7,
} as const;

export const ITP_RATES_LAST_REVIEWED = '2024';

export type Region = keyof typeof ITP_RATES;

export interface ViabilityData {
  monthlyNetIncome: number;
  debtRatio: number;
  tin: number;
  loanTerm: number;
  region: Region;
  isNewConstruction: boolean;
}

export const calculatePurchaseCosts = (
  propertyPrice: number,
  region: Region,
  isNewConstruction: boolean
) => {
  const appraisal = 350;
  const notary = 1_200;
  const agency = 500;
  const registry = 600;
  const taxRate = isNewConstruction ? 10 : ITP_RATES[region];
  const tax = propertyPrice * (taxRate / 100);

  return {
    appraisal,
    notary,
    agency,
    registry,
    tax,
    totalCosts: appraisal + notary + agency + registry + tax,
  };
};

// Transfer the exact scenario, including purchase costs, so the simulator keeps
// the same principal and monthly payment as the viability estimate.
export const createViabilityScenario = (data: ViabilityData, loan: number, financingRatio: number): Partial<SimulationInputs> => {
  const propertyPrice = loan / financingRatio;
  const costs = calculatePurchaseCosts(propertyPrice, data.region, data.isNewConstruction);
  return {
    name: `Vivienda en ${data.region} · financiación ${Math.round(financingRatio * 100)}%`,
    propertyPrice,
    initialContribution: propertyPrice - loan + costs.totalCosts,
    costs: {
      appraisal: costs.appraisal, notary: costs.notary, agency: costs.agency,
      registry: costs.registry, taxRate: data.isNewConstruction ? 10 : ITP_RATES[data.region],
    },
    tin: data.tin, tae: 0, loanTerm: data.loanTerm, monthlyExtras: 0,
  };
};
