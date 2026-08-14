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
