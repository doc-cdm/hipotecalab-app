import { useState, type FC } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { buyingGuideSteps, dictionaryCategories, sections } from './data';

type ResourceSection = 'dictionary' | 'guide';

const Resources: FC = () => {
  const [activeSection, setActiveSection] = useState<ResourceSection>('dictionary');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          {sections.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-700'
                    : 'hover:bg-slate-700'
                }`}
              >
                <span className={`text-xs ${isActive ? '' : 'text-slate-400 hover:text-white'}`} style={isActive ? {color: '#F6EBD9'} : {}}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeSection === 'dictionary' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-orange-500 mb-6">Diccionario hipotecario</h2>
              
              {dictionaryCategories.map((category) => (
                <div key={category.title} className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">{category.title}</h3>
                  
                  <div className="space-y-3">
                    {category.terms.map((termData) => (
                      <div key={termData.id} className="border border-slate-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleExpanded(termData.id)}
                          className="w-full px-4 py-3 text-left bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium text-white">{termData.term}</span>
                          {expandedItems.includes(termData.id) ? (
                            <ChevronDown size={20} className="text-slate-400" />
                          ) : (
                            <ChevronRight size={20} className="text-slate-400" />
                          )}
                        </button>
                        
                        {expandedItems.includes(termData.id) && (
                          <div className="p-4 bg-slate-750 space-y-3">
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Definición</h4>
                              <p className="text-slate-300 text-sm">{termData.definition}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Utilidad</h4>
                              <p className="text-slate-300 text-sm">{termData.utility}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Por qué es importante</h4>
                              <p className="text-slate-300 text-sm">{termData.importance}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-orange-400 mb-1">Ejemplo</h4>
                              <p className="text-slate-300 text-sm">{termData.example}</p>
                            </div>
                            
                            {termData.notes && (
                              <div>
                                <h4 className="font-semibold text-orange-400 mb-1">Notas adicionales</h4>
                                <p className="text-slate-300 text-sm">{termData.notes}</p>
                                
                                {/* Tabla específica para ITP */}
                                {termData.id === 'itp' && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-orange-300 mb-2">Tipos de ITP por Comunidad Autónoma (2024)</h5>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full bg-slate-600 border border-slate-500 rounded-lg text-xs">
                                        <thead>
                                          <tr className="bg-slate-500">
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Comunidad Autónoma</th>
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Tipo (%)</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-slate-200">
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Andalucía</td><td className="px-3 py-1 border-b border-slate-500">7%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Aragón</td><td className="px-3 py-1 border-b border-slate-500">8-10%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Asturias</td><td className="px-3 py-1 border-b border-slate-500">8-10%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Baleares</td><td className="px-3 py-1 border-b border-slate-500">8-13%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Canarias</td><td className="px-3 py-1 border-b border-slate-500">6,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cantabria</td><td className="px-3 py-1 border-b border-slate-500">9%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla-La Mancha</td><td className="px-3 py-1 border-b border-slate-500">9%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla y León</td><td className="px-3 py-1 border-b border-slate-500">8-10%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cataluña</td><td className="px-3 py-1 border-b border-slate-500">10-11%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Ceuta</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Madrid</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">C. Valenciana</td><td className="px-3 py-1 border-b border-slate-500">10-11%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Extremadura</td><td className="px-3 py-1 border-b border-slate-500">8-11%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Galicia</td><td className="px-3 py-1 border-b border-slate-500">8%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">La Rioja</td><td className="px-3 py-1 border-b border-slate-500">7%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Melilla</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Murcia</td><td className="px-3 py-1 border-b border-slate-500">8%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Navarra</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1">País Vasco</td><td className="px-3 py-1">7%</td></tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                      Fuente: REAF 2024. Los tipos pueden variar según el valor del inmueble y circunstancias específicas.
                                    </p>
                                  </div>
                                )}

                                {/* Tabla específica para AJD */}
                                {termData.id === 'ajd' && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-orange-300 mb-2">Tipos de AJD por Comunidad Autónoma (2024)</h5>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full bg-slate-600 border border-slate-500 rounded-lg text-xs">
                                        <thead>
                                          <tr className="bg-slate-500">
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Comunidad Autónoma</th>
                                            <th className="px-3 py-2 text-left text-orange-200 font-medium border-b border-slate-400">Tipo (%)</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-slate-200">
                                          <tr><td className="px-3 py-1 border-b border-slate-500">País Vasco</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Navarra</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Ceuta</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Melilla</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Canarias</td><td className="px-3 py-1 border-b border-slate-500">0,75%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Madrid</td><td className="px-3 py-1 border-b border-slate-500">0,75%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">La Rioja</td><td className="px-3 py-1 border-b border-slate-500">1%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Andalucía</td><td className="px-3 py-1 border-b border-slate-500">1,2%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Asturias</td><td className="px-3 py-1 border-b border-slate-500">1,2%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Aragón</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Baleares</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cantabria</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla-La Mancha</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla y León</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cataluña</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">C. Valenciana</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Extremadura</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Galicia</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1">Murcia</td><td className="px-3 py-1">1,5%</td></tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                      Fuente: REAF 2024 / AEAT. Los tipos pueden tener reducciones según el tipo de operación.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-orange-500 mb-6">Guía de compra de vivienda</h2>
              
              <div className="space-y-4">
                {buyingGuideSteps.map((step, index) => (
                  <div key={step.id} className="bg-slate-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => step.status === 'complete' ? toggleExpanded(step.id) : null}
                      disabled={step.status === 'coming-soon'}
                      className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                        step.status === 'complete' 
                          ? 'hover:bg-slate-700 cursor-pointer' 
                          : 'cursor-not-allowed'
                      }`}
                    >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            step.status === 'complete' ? 'bg-green-600' : 'bg-slate-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{step.title}</h3>
                            {step.status === 'coming-soon' && (
                              <span className="text-sm text-orange-400">Próximamente</span>
                            )}
                          </div>
                        </div>                      {step.status === 'complete' && (
                        <div>
                          {expandedItems.includes(step.id) ? (
                            <ChevronDown size={20} className="text-slate-400" />
                          ) : (
                            <ChevronRight size={20} className="text-slate-400" />
                          )}
                        </div>
                      )}
                    </button>
                    
                    {expandedItems.includes(step.id) && step.content && (
                      <div className="px-6 pb-4 space-y-4">
                        <p className="text-slate-300 text-sm">{step.content.summary}</p>
                        <div className="space-y-3">
                          {step.content.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="bg-slate-700 rounded-lg p-4">
                              <h4 className="font-medium text-orange-300 mb-2">{detail.title}</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">{detail.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;

