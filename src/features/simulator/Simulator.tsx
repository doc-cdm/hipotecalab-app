import React, { useState } from 'react';
import CostsTab from './components/CostsTab';
import LoanTab from './components/LoanTab';
import PaymentTab from './components/PaymentTab';
import AmortizationTab from './components/AmortizationTab';
import SummaryTab from './components/SummaryTab';
import type { useSimulation } from './useSimulation';
import type { SimulationData } from '../../types/simulation';

export type SimulatorTab = 'costs' | 'loan' | 'payment' | 'amortization' | 'summary';

type Props = ReturnType<typeof useSimulation> & { activeTab: SimulatorTab; onTabChange: (tab: SimulatorTab) => void };

const Simulator: React.FC<Props> = ({ simulationData, updateSimulation, updateCosts, activeTab, onTabChange }) => {
  const [comparison, setComparison] = useState<SimulationData | null>(null);
  const setActiveTab = (tab: SimulatorTab) => {
    onTabChange(tab);
    document.getElementById('simulator-heading')?.scrollIntoView({ block: 'start' });
  };

  const tabs = [
    { id: 'costs' as SimulatorTab, label: 'Costes' },
    { id: 'loan' as SimulatorTab, label: 'Préstamo' },
    { id: 'payment' as SimulatorTab, label: 'Cuota' },
    { id: 'amortization' as SimulatorTab, label: 'Amortización' },
    { id: 'summary' as SimulatorTab, label: 'Resumen' },
  ];

  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const canGoNext = () => getCurrentTabIndex() < tabs.length - 1;
  const canGoPrev = () => getCurrentTabIndex() > 0;

  const goNext = () => {
    const currentIndex = getCurrentTabIndex();
    if (canGoNext()) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    const currentIndex = getCurrentTabIndex();
    if (canGoPrev()) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const renderActiveTab = () => {
    const props = {
      simulationData,
      updateSimulation,
      updateCosts,
      onNext: goNext,
      onPrev: goPrev,
      canGoNext: canGoNext(),
      canGoPrev: canGoPrev()
    };

    switch (activeTab) {
      case 'costs':
        return <CostsTab {...props} />;
      case 'loan':
        return <LoanTab {...props} />;
      case 'payment':
        return <PaymentTab {...props} />;
      case 'amortization':
        return <AmortizationTab {...props} />;
      case 'summary':
        return <SummaryTab {...props} comparison={comparison} onEdit={() => setActiveTab('loan')} onCompare={() => { setComparison(simulationData); setActiveTab('loan'); }} onClearComparison={() => setComparison(null)} />;
      default:
        return <CostsTab {...props} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div id="simulator-heading" className="step-heading scroll-mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-xl font-semibold">Tu simulación hipotecaria</h1>
          <p className="text-xs text-slate-400" aria-live="polite">Paso {getCurrentTabIndex() + 1} de {tabs.length} · {tabs[getCurrentTabIndex()].label}</p>
        </div>
        {comparison && activeTab !== 'summary' && <p className="mt-2 text-sm text-slate-300">Opción inicial conservada. Ajusta los datos y abre Resumen para comparar.</p>}
      </div>
      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-2 py-2">
        <div className="flex justify-center">
          <div 
            className="flex overflow-x-auto gap-1 w-full max-w-4xl"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {tabs.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex-shrink-0 flex flex-col items-center min-w-0 flex-1 space-y-1 px-1 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-700/60'
                      : 'hover:bg-slate-700/40'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-brand" />
                  )}
                  <span className={`text-xs font-medium ${isActive ? 'text-brand' : 'text-slate-400'}`}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default Simulator;
