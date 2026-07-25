import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIMELINE_SCENARIOS } from '../data/economicData';
import { TimelineScenario } from '../types';
import { CheckCircle2, AlertTriangle, ArrowRight, Banknote, ShoppingBag, TrendingUp, Wrench, Zap, Boxes, ShieldCheck } from 'lucide-react';

interface TimelineComparisonProps {
  soundEnabled: boolean;
}

export const TimelineComparison: React.FC<TimelineComparisonProps> = ({ soundEnabled }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('short_term_print');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeScenario: TimelineScenario = TIMELINE_SCENARIOS.find(s => s.id === selectedScenarioId) || TIMELINE_SCENARIOS[0];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Banknote': return <Banknote className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    setActiveStepIndex(0);

    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const scenario = TIMELINE_SCENARIOS.find(s => s.id === id);
      if (scenario) {
        const u = new SpeechSynthesisUtterance(scenario.summary);
        u.lang = "pt-BR";
        window.speechSynthesis.speak(u);
      }
    }
  };

  return (
    <section id="solucoes" className="py-20 bg-slate-900/60 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Wrench className="w-4 h-4 text-blue-500" />
            3. Linha do Tempo: Decisões do Governo
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Tapa-Buraco <span className="text-red-500 italic">vs</span> Crescimento Real
          </h2>

          <p className="mt-3 text-base text-slate-400 font-medium">
            Diante da inflação, há dois caminhos: o atalho fácil (imprimir dinheiro) ou o investimento produtivo na indústria e educação.
          </p>

          {/* Scenario Selector Tabs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {TIMELINE_SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;
              const isShortTerm = scenario.type === 'short_term';

              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioChange(scenario.id)}
                  className={`w-full sm:w-auto px-6 py-5 rounded-3xl text-left border transition-all duration-300 shadow-xl flex items-center gap-4 ${
                    isSelected
                      ? isShortTerm
                        ? 'bg-red-950/30 border-red-500/40 ring-2 ring-red-500/20'
                        : 'bg-emerald-950/30 border-emerald-500/40 ring-2 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${
                    isShortTerm ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {isShortTerm ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white uppercase tracking-wider">{scenario.title}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isShortTerm ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {scenario.badge}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5 italic">{scenario.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Summary Card */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 mb-10 max-w-4xl mx-auto shadow-2xl relative">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl ${
              activeScenario.type === 'short_term' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {activeScenario.type === 'short_term' ? '🩹' : '🌱'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Resumo da Estratégia: {activeScenario.title}
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                {activeScenario.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Timeline Stepper */}
        <div className="space-y-8 max-w-5xl mx-auto">
          
          {/* Step Progress Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {activeScenario.steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    isActive
                      ? activeScenario.type === 'short_term'
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-lg'
                        : 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{step.period}</span>
                    <span className="text-[10px] opacity-80">Etapa {idx + 1} de 4</span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{step.title}</p>
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeScenario.id}-${activeStepIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
                activeScenario.type === 'short_term'
                  ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/30'
                  : 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
                      {activeScenario.steps[activeStepIndex].period}
                    </span>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {activeScenario.steps[activeStepIndex].title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-normal">
                    {activeScenario.steps[activeStepIndex].description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
                      {getStepIcon(activeScenario.steps[activeStepIndex].icon)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Impacto Prático no Bolso:</span>
                      <span className="text-xs font-semibold text-white">
                        {activeScenario.steps[activeStepIndex].impactText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Step Controls */}
                <div className="flex md:flex-col items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6">
                  {activeStepIndex < activeScenario.steps.length - 1 ? (
                    <button
                      onClick={() => setActiveStepIndex(prev => prev + 1)}
                      className={`w-full px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                        activeScenario.type === 'short_term'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      Avançar no Tempo <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-center p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Fim da Trajetória
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
