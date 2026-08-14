import React, { useState } from 'react';
import CostsTab from './components/CostsTab';
import LoanTab from './components/LoanTab';
import PaymentTab from './components/PaymentTab';
import AmortizationTab from './components/AmortizationTab';
import SummaryTab from './components/SummaryTab';
import { useSimulation } from './useSimulation';

type Tab = 'costs' | 'loan' | 'payment' | 'amortization' | 'summary';

const Simulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('costs');
  const { simulationData, updateSimulation, updateCosts } = useSimulation();

  const tabs = [
    { id: 'costs' as Tab, label: 'Costes' },
    { id: 'loan' as Tab, label: 'Préstamo' },
    { id: 'payment' as Tab, label: 'Cuota' },
    { id: 'amortization' as Tab, label: 'Amortización' },
    { id: 'summary' as Tab, label: 'Resumen' },
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
        return <SummaryTab {...props} />;
      default:
        return <CostsTab {...props} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-2 py-2">
        <div className="flex justify-center">
          <div 
            className="flex overflow-x-auto gap-2"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {tabs.map(({ id, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex-shrink-0 flex flex-col items-center min-w-[72px] space-y-1 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-700/60'
                      : 'hover:bg-slate-700/40'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-orange-500" />
                  )}
                  <span className={`text-xs font-medium ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>{label}</span>
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
