import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/economicData';
import { GlossaryTerm } from '../types';
import { HelpCircle, BookOpen, Volume2, Search, ArrowRight } from 'lucide-react';

interface GlossarySectionProps {
  soundEnabled: boolean;
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ soundEnabled }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm>(GLOSSARY_TERMS[0]);

  const filteredTerms = GLOSSARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.analogyTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const speakTerm = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${term.term}. ${term.analogyTitle}. ${term.analogyDescription}`;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <section id="glossario" className="py-20 bg-slate-900/80 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            5. Dicionário de Metáforas
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Economês Traduzido para <span className="text-purple-400 italic">Português Claro</span>
          </h2>

          <p className="mt-3 text-base text-slate-400 font-medium">
            Entenda os termos mais famosos da economia com comparações simples do cotidiano.
          </p>

          {/* Search Input */}
          {/* <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar termo (ex: Inflação, Juros, PIB)..."
              className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-xs border border-slate-800 focus:outline-none focus:border-purple-500 font-medium transition-all"
            />
          </div> */}
        </div>

        {/* Term Cards Grid & Detail Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Term List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredTerms.map((term) => {
              const isSelected = selectedTerm.id === term.id;
              return (
                <button
                  key={term.id}
                  onClick={() => speakTerm(term)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-500/60 text-purple-200 ring-2 ring-purple-500/20 shadow-lg'
                      : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-sm font-extrabold block text-white">{term.term}</span>
                    <span className="text-xs text-purple-300 font-medium block mt-0.5">{term.analogyTitle}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Termo Técnico: {selectedTerm.technicalTerm}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedTerm.term}
                </h3>
              </div>

              <button
                onClick={() => speakTerm(selectedTerm)}
                className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:text-white transition-all"
                title="Ouvir explicação"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Metaphor Box */}
            <div className="bg-purple-950/40 p-5 rounded-2xl border border-purple-500/30 space-y-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wide block">
                A Metáfora Visual:
              </span>
              <h4 className="text-lg font-bold text-white">
                {selectedTerm.analogyTitle}
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedTerm.analogyDescription}
              </p>
            </div>

            {/* Real Life Example */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                Exemplo no Mundo Real:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {selectedTerm.realExample}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
