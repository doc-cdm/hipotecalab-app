export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('es-ES').format(number);
};