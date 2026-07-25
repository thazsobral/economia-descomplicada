import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Snowflake, Gauge, CreditCard, Briefcase, ShoppingCart, Award, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CentralBankDashboardProps {
  soundEnabled: boolean;
}

export const CentralBankDashboard: React.FC<CentralBankDashboardProps> = ({ soundEnabled }) => {
  // Selic Interest Rate % (2.0% to 16.0%)
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [activeTab, setActiveTab] = useState<'control' | 'mission'>('control');
  
  // Mission state
  const [currentMission, setCurrentMission] = useState<number>(0);
  const [missionScore, setMissionScore] = useState<number>(0);
  const [missionAnswered, setMissionAnswered] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Calculated Economic Variables based on Interest Rate
  // High rate (>12%) = Cold/Cool (low inflation, low consumption, slightly higher unemployment)
  // Low rate (<6%) = Warm/Hot (high inflation, crazy consumption, high credit)
  const isHot = interestRate < 7.0;
  const isCold = interestRate > 12.0;

  const inflationIndicator = Math.max(1, Math.min(15, Math.round(18 - interestRate * 1.1)));
  const consumptionLevel = Math.max(10, Math.min(100, Math.round(130 - interestRate * 7.5)));
  const creditEase = Math.max(10, Math.min(100, Math.round(125 - interestRate * 7)));
  const jobMarket = Math.max(20, Math.min(95, Math.round(105 - interestRate * 4.5)));

  const handleInterestChange = (newVal: number) => {
    setInterestRate(newVal);

    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = "";
      if (newVal > 12) {
        text = "Juros altos! O freio foi acionado. Os empréstimos ficaram caros e o consumo vai esfriar.";
      } else if (newVal < 6) {
        text = "Juros baixos! O acelerador foi pisado. O crédito ficou barato, mas a inflação pode subir!";
      } else {
        text = "Juros em nível neutro. Equilíbrio entre consumo e controle de inflação.";
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      window.speechSynthesis.speak(u);
    }
  };

  const missions = [
    {
      title: "Missão 1: A Disparada da Carne e da  Gasolina 🥩⛽",
      description: "O consumo no país disparou desenfreadamente e as lojas estão remarcando os preços diariamente. A inflação bateu 12%! Qual é a sua decisão na Sala de Controle?",
      options: [
        {
          label: "Aumentar a Taxa de Juros (Esfriar a Economia) 🧊",
          isCorrect: true,
          explanation: "Excelente! Subir os juros deixa o crédito mais caro, desestimula a correria de compras e força as lojas a parar de remarcar preços."
        },
        {
          label: "Reduzir a Taxa de Juros para zero (Liberar dinheiro fácil) 🔥",
          isCorrect: false,
          explanation: "Ops! Baixar os juros nesse momento jogaria mais gasolina na fogueira, fazendo os preços explodirem ainda mais rápido!"
        }
      ]
    },
    {
      title: "Missão 2: A Paralisia do Comércio 🛑",
      description: "As pessoas estão assustadas com medo de gastar, o comércio está parado e as fábricas correm o risco de demitir trabalhadores. A inflação está controlada e muito baixa. O que fazer?",
      options: [
        {
          label: "Subir os juros para o nível máximo de 18% 🧊",
          isCorrect: false,
          explanation: "Errado! Subir juros quando o comércio já está parado vai esfriar ainda mais o país e causar desemprego severo."
        },
        {
          label: "Baixar a Taxa de Juros com cuidado (Aquecer a Economia) 🔥",
          isCorrect: true,
          explanation: "Perfeito! Baixar juros barateia o financiamento da casa própria, do carro e do investimento das empresas, reanimando os empregos."
        }
      ]
    }
  ];

  const handleMissionAnswer = (isCorrect: boolean, explanation: string) => {
    setMissionAnswered(true);
    if (isCorrect) {
      setMissionScore((prev: number) => prev + 50);
      setFeedbackMsg({ text: explanation, isCorrect: true });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setFeedbackMsg({ text: explanation, isCorrect: false });
    }
  };

  const nextMission = () => {
    setMissionAnswered(false);
    setFeedbackMsg(null);
    if (currentMission < missions.length - 1) {
      setCurrentMission((prev: number) => prev + 1);
    } else {
      setCurrentMission(0);
    }
  };

  return (
    <section id="banco-central" className="py-20 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isHot ? 'bg-amber-600/10' : isCold ? 'bg-cyan-600/10' : 'bg-emerald-600/10'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Gauge className="w-4 h-4 text-blue-500" />
            2. Sala de Controle: Banco Central
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Você é o piloto da <span className="text-blue-500 italic">economia hoje</span>
          </h2>

          <p className="mt-3 text-base text-slate-400 font-medium">
            O Banco Central usa a <strong className="text-white">Taxa de Juros (Selic)</strong> como um termostato para esfriar ou aquecer o comércio.
          </p>

          {/* Mode Switcher */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab('control')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'control'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              🕹️ Sala de Controle Livre
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'mission'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              🎯 Missões do BC ({missionScore} pts)
            </button>
          </div>
        </div>

        {activeTab === 'control' ? (
          /* CONTROL ROOM MAIN PANEL */
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative space-y-8">
            
            {/* Bento Gauge Dial & Controls */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-slate-950/60 p-8 rounded-3xl border border-slate-800">
              
              {/* Esfriar Button */}
              <button
                onClick={() => handleInterestChange(Math.min(16, interestRate + 1.5))}
                className="w-full lg:w-1/3 py-6 px-6 bg-blue-900/30 border border-blue-500/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-blue-900/50 transition-all shadow-lg active:scale-95 group"
              >
                <span className="text-3xl">❄️</span>
                <span className="font-extrabold text-blue-400 uppercase tracking-wider text-base">ESFRIAR</span>
                <span className="text-xs text-blue-200/60 font-medium text-center">Sobe os Juros (Menos Compras e Inflação)</span>
              </button>

              {/* Central Bento Gauge Dial Display */}
              <div className="flex flex-col items-center justify-center space-y-3 py-2">
                <div className="w-48 h-48 rounded-full border-8 border-slate-800 relative flex items-center justify-center shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-slate-900/40 to-orange-500/20 rounded-full" />
                  
                  {/* Gauge Needle */}
                  <div
                    className="w-1.5 h-20 bg-white rounded-full origin-bottom transition-transform duration-500 shadow-lg shadow-white/40"
                    style={{
                      transform: `rotate(${Math.min(120, Math.max(-120, (10 - interestRate) * 15))}deg)`
                    }}
                  />

                  <div className="absolute top-4 font-mono text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    INFLAÇÃO
                  </div>

                  <div className="absolute bottom-6 font-mono text-xl font-black text-white">
                    {interestRate.toFixed(1)}%
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
                    Taxa Selic
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {isCold ? "❄️ Economia Fria" : isHot ? "🔥 Economia Aquecida" : "⚖️ Nível Estável"}
                  </span>
                </div>
              </div>

              {/* Aquecer Button */}
              <button
                onClick={() => handleInterestChange(Math.max(2, interestRate - 1.5))}
                className="w-full lg:w-1/3 py-6 px-6 bg-orange-900/30 border border-orange-500/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-orange-900/50 transition-all shadow-lg active:scale-95 group"
              >
                <span className="text-3xl">🔥</span>
                <span className="font-extrabold text-orange-400 uppercase tracking-wider text-base">AQUECER</span>
                <span className="text-xs text-orange-200/60 font-medium text-center">Baixa os Juros (Mais Crédito e Vendas)</span>
              </button>

            </div>

            {/* Slider Bar */}
            <div className="space-y-2 max-w-xl mx-auto">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>2% (Juros Mínimos)</span>
                <span>8.5% (Neutro)</span>
                <span>16% (Juros Altos)</span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                step="0.5"
                value={interestRate}
                onChange={(e) => handleInterestChange(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
            </div>

            {/* Visual Indicators (Meters and Flows) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              
              {/* Meter 1: Credit & Loans */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Facilidade de Empréstimo
                  </span>
                  <span className="text-cyan-400 font-extrabold">{creditEase}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${creditEase}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {creditEase > 70
                    ? "As parcelas do carro e da casa cabem no bolso. Todo mundo toma crédito."
                    : "Empréstimos caros. As pessoas adiam compras grandes."}
                </p>
              </div>

              {/* Meter 2: Consumption */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    Correria no Comércio
                  </span>
                  <span className="text-emerald-400 font-extrabold">{consumptionLevel}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${consumptionLevel}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {consumptionLevel > 70
                    ? "Lojas cheias! Muita gente disputando produtos."
                    : "Comércio calmo. Consumidores pesquisando mais os preços."}
                </p>
              </div>

              {/* Meter 3: Inflation Risk */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Pressão da Inflação
                  </span>
                  <span className={`font-extrabold ${inflationIndicator > 8 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {inflationIndicator}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${inflationIndicator > 8 ? 'bg-red-500' : 'bg-emerald-400'}`}
                    style={{ width: `${(inflationIndicator / 15) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {inflationIndicator > 8
                    ? "⚠️ Alerta! Os preços sobem rápido porque a demanda supera a oferta."
                    : "✅ Preços comportados e previsíveis."}
                </p>
              </div>

              {/* Meter 4: Job Market */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    Ritmo de Contratações
                  </span>
                  <span className="text-indigo-400 font-extrabold">{jobMarket}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full transition-all duration-500"
                    style={{ width: `${jobMarket}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {jobMarket > 70
                    ? "Empresas contratando para atender à alta demanda."
                    : "Contratações mais cautelosas para controlar custos."}
                </p>
              </div>

            </div>

          </div>
        ) : (
          /* MISSION CHALLENGE MODE */
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl max-w-2xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span className="text-sm font-bold text-white">
                  Desafio de Liderança Monetária
                </span>
              </div>
              <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-xl border border-amber-500/30">
                Score: {missionScore} pts
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                {missions[currentMission].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {missions[currentMission].description}
              </p>

              <div className="space-y-3 pt-2">
                {missions[currentMission].options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={missionAnswered}
                    onClick={() => handleMissionAnswer(opt.isCorrect, opt.explanation)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-semibold transition-all border flex items-center justify-between ${
                      missionAnswered
                        ? opt.isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200 active:scale-[0.99]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {missionAnswered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
              {feedbackMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border text-xs font-medium space-y-2 ${
                    feedbackMsg.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/60 border-red-500/40 text-red-200'
                  }`}
                >
                  <p className="font-bold text-sm">
                    {feedbackMsg.isCorrect ? "🎉 Resposta Perfeita!" : "⚠️ Pense melhor na próxima!"}
                  </p>
                  <p>{feedbackMsg.text}</p>
                  
                  <button
                    onClick={nextMission}
                    className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Próxima Missão
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </div>
    </section>
  );
};
