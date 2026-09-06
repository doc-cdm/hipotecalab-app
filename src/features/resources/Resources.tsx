import { useState, type FC } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { buyingGuideSteps, dictionaryCategories, sections } from './data';

type ResourceSection = 'dictionary' | 'guide';

const Resources: FC = () => {
  const [activeSection, setActiveSection] = useState<ResourceSection>('dictionary');
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filteredCategories = dictionaryCategories.map(category => ({ ...category, terms: category.terms.filter(term => `${term.term} ${term.definition}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(normalizedQuery)) })).filter(category => category.terms.length > 0);
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
                aria-pressed={isActive}
                onClick={() => setActiveSection(id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-700'
                    : 'hover:bg-slate-700'
                }`}
              >
                <span className={`text-xs ${isActive ? 'text-brand-cream' : 'text-slate-400 hover:text-white'}`}>{label}</span>
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
              <h2 className="text-2xl font-bold text-brand mb-6">Diccionario hipotecario</h2>
              
              <div className="relative">
                <label htmlFor="resource-search" className="block text-sm text-slate-300 mb-2">¿Qué término quieres entender?</label>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-4 text-slate-400" aria-hidden="true" />
                  <input id="resource-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Busca TIN, entrada, tasación…" className="w-full rounded-xl border border-slate-600 bg-slate-800 pl-11 pr-4 py-3 text-white" />
                </div>
              </div>
              <p role="status" className="text-sm text-slate-400">{query.trim() ? `${filteredCategories.reduce((total, category) => total + category.terms.length, 0)} términos encontrados` : 'Abre un concepto para ver su explicación y un ejemplo.'}</p>
              {filteredCategories.length === 0 && (
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center">
                  <Search size={28} className="mx-auto mb-3 text-blue-200" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">No encontramos ese término</h3>
                  <p className="mt-2 mb-4 text-sm text-slate-300">Prueba con una palabra más corta o explora el diccionario completo.</p>
                  <button type="button" onClick={() => setQuery('')} className="primary-button">Ver todos los términos</button>
                </div>
              )}
              {filteredCategories.map((category) => (
                <div key={category.title} className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">{category.title}</h3>
                  
                  <div className="space-y-3">
                    {category.terms.map((termData) => (
                      <div key={termData.id} className="border border-slate-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleExpanded(termData.id)}
                          aria-expanded={expandedItems.includes(termData.id)}
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
                              <h4 className="font-semibold text-brand mb-1">Definición</h4>
                              <p className="text-slate-300 text-sm">{termData.definition}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-brand mb-1">Utilidad</h4>
                              <p className="text-slate-300 text-sm">{termData.utility}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-brand mb-1">Por qué es importante</h4>
                              <p className="text-slate-300 text-sm">{termData.importance}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-brand mb-1">Ejemplo</h4>
                              <p className="text-slate-300 text-sm">{termData.example}</p>
                            </div>
                            
                            {termData.notes && (
                              <div>
                                <h4 className="font-semibold text-brand mb-1">Notas adicionales</h4>
                                <p className="text-slate-300 text-sm">{termData.notes}</p>
                                
                                {/* Tabla específica para ITP */}
                                {termData.id === 'itp' && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-brand mb-2">Tipos generales de ITP por Comunidad Autónoma (2026)</h5>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full bg-slate-600 border border-slate-500 rounded-lg text-xs">
                                        <thead>
                                          <tr className="bg-slate-500">
                                            <th className="px-3 py-2 text-left text-brand font-medium border-b border-slate-400">Comunidad Autónoma</th>
                                            <th className="px-3 py-2 text-left text-brand font-medium border-b border-slate-400">Tipo (%)</th>
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
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cataluña</td><td className="px-3 py-1 border-b border-slate-500">10-13%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Ceuta</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Madrid</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">C. Valenciana</td><td className="px-3 py-1 border-b border-slate-500">9%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Extremadura</td><td className="px-3 py-1 border-b border-slate-500">8-11%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Galicia</td><td className="px-3 py-1 border-b border-slate-500">8%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">La Rioja</td><td className="px-3 py-1 border-b border-slate-500">7%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Melilla</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Murcia</td><td className="px-3 py-1 border-b border-slate-500">8%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Navarra</td><td className="px-3 py-1 border-b border-slate-500">6%</td></tr>
                                          <tr><td className="px-3 py-1">País Vasco</td><td className="px-3 py-1">4-7%</td></tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                      Fuente: normativa autonómica vigente (2026), recopilada por Rankia/OCU. Son tipos generales orientativos: casi todas las CC.AA. aplican tipos reducidos para jóvenes, familias numerosas, discapacidad o VPO, y varios tramos suben con el valor del inmueble. Verifica siempre el tipo exacto en la web de tu Comunidad Autónoma.
                                    </p>
                                  </div>
                                )}

                                {/* Tabla específica para AJD */}
                                {termData.id === 'ajd' && (
                                  <div className="mt-4">
                                    <h5 className="font-medium text-brand mb-2">Tipos generales de AJD por Comunidad Autónoma (2026)</h5>
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full bg-slate-600 border border-slate-500 rounded-lg text-xs">
                                        <thead>
                                          <tr className="bg-slate-500">
                                            <th className="px-3 py-2 text-left text-brand font-medium border-b border-slate-400">Comunidad Autónoma</th>
                                            <th className="px-3 py-2 text-left text-brand font-medium border-b border-slate-400">Tipo (%)</th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-slate-200">
                                          <tr><td className="px-3 py-1 border-b border-slate-500">País Vasco</td><td className="px-3 py-1 border-b border-slate-500">0%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Navarra</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Ceuta</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Melilla</td><td className="px-3 py-1 border-b border-slate-500">0,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Madrid</td><td className="px-3 py-1 border-b border-slate-500">0,75%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">La Rioja</td><td className="px-3 py-1 border-b border-slate-500">1%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Canarias</td><td className="px-3 py-1 border-b border-slate-500">1%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Andalucía</td><td className="px-3 py-1 border-b border-slate-500">1,2%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Asturias</td><td className="px-3 py-1 border-b border-slate-500">1,2%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla-La Mancha</td><td className="px-3 py-1 border-b border-slate-500">1,25%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">C. Valenciana</td><td className="px-3 py-1 border-b border-slate-500">1,4%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Aragón</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Baleares</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cantabria</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Castilla y León</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Cataluña</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Extremadura</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1 border-b border-slate-500">Galicia</td><td className="px-3 py-1 border-b border-slate-500">1,5%</td></tr>
                                          <tr><td className="px-3 py-1">Murcia</td><td className="px-3 py-1">1,5%</td></tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                      Fuente: normativa autonómica vigente (2026), recopilada por Rankia/AEAT. Son tipos generales orientativos: muchas CC.AA. aplican tipos reducidos para jóvenes, familia numerosa o discapacidad, y algunos suben para renuncia a la exención de IVA. Verifica siempre el tipo exacto en la web de tu Comunidad Autónoma.
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
              <h2 className="text-2xl font-bold text-brand mb-6">Guía de compra de vivienda</h2>
              
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
                              <span className="text-sm text-brand">Próximamente</span>
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
                              <h4 className="font-medium text-brand mb-2">{detail.title}</h4>
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

