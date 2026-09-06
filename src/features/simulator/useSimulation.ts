import { useCallback, useMemo, useState } from 'react';
import type { SimulationData, SimulationInputs, UpdateCosts, UpdateSimulation } from '../../types/simulation';
import { calculateSimulation } from './model';

const getLocalDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createInitialInputs = (): SimulationInputs => ({
  name: '',
  propertyPrice: 0,
  costs: {
    appraisal: 350,
    notary: 1_200,
    agency: 500,
    registry: 600,
    taxRate: 10,
  },
  initialContribution: 0,
  tin: 0,
  tae: 0,
  startDate: getLocalDate(),
  loanTerm: 25,
  monthlyExtras: 0,
});

export const useSimulation = () => {
  const [inputs, setInputs] = useState<SimulationInputs>(createInitialInputs);

  const updateSimulation = useCallback<UpdateSimulation>((patch) => {
    setInputs((current) => ({ ...current, ...patch }));
  }, []);

  const updateCosts = useCallback<UpdateCosts>((patch) => {
    setInputs((current) => ({
      ...current,
      costs: { ...current.costs, ...patch },
    }));
  }, []);

  const simulationData = useMemo<SimulationData>(() => {
    return calculateSimulation(inputs);
  }, [inputs]);

  return { simulationData, updateSimulation, updateCosts };
};
