import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Banknote, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface HeroSimulatorProps {
  soundEnabled: boolean;
}

export const HeroSimulator: React.FC<HeroSimulatorProps> = ({ soundEnabled }) => {
  // Simulator State
  const [moneySupply, setMoneySupply] = useState<number>(100); // R$ 100
  const [productSupply, setProductSupply] = useState<number>(10); // 10 itens
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);

  // Derived Economic Variables
  const unitPrice = useMemo(() => {
    if (productSupply === 0) return 0;
    return moneySupply / productSupply;
  }, [moneySupply, productSupply]);

  // Base reference price is R$ 10.00
  const basePrice = 10;
  const inflationPercent = useMemo(() => {
    return Math.round(((unitPrice - basePrice) / basePrice) * 100);
  }, [unitPrice]);

  const purchasingPowerIndex = useMemo(() => {
    // How many items R$ 100 buys
    return ((100 / unitPrice)).toFixed(1);
  }, [unitPrice]);

  // Chart Data Generation (Simulating 5 steps ahead based on current ratio)
  const chartData = useMemo(() => {
    const data = [];
    const baseM = moneySupply;
    const baseP = productSupply;

    for (let step = 1; step <= 5; step++) {
      // Simulate trajectory over time
      const projectedMoney = Math.round(baseM * Math.pow(1 + (baseM > 300 ? 0.2 : 0.05), step - 1));
      const projectedProducts = Math.round(baseP * Math.pow(1 + (baseP > 25 ? 0.15 : 0.02), step - 1));
      const p = projectedMoney / projectedProducts;
      data.push({
        month: `Mês ${step}`,
        preco: Math.round(p * 10) / 10,
        compras: Math.round((100 / p) * 10) / 10,
      });
    }
    return data;
  }, [moneySupply, productSupply]);

  // Presets
  const applyPreset = (money: number, products: number) => {
    setMoneySupply(money);
    setProductSupply(products);

    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = "";
      if (money > 500 && products < 15) {
        text = "Você imprimiu muito dinheiro sem fabricar produtos! O preço de cada item disparou!";
      } else if (products > 35) {
        text = "As fábricas produziram em abundância! O preço caiu e o seu dinheiro rende muito mais!";
      } else {
        text = "Economia em equilíbrio! O dinheiro equivale certinho à quantidade de produtos no mercado.";
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <section id="simulador" className="relative pt-28 pb-16 overflow-hidden">
      {/* Background Decor Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/10 via-cyan-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4"
          >
            <Zap className="w-4 h-4 text-blue-500" />
            1. O Paradoxo da Mansão & dos Preços
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
          >
            Se todo mundo ficar rico do nada, <span className="text-blue-500 italic">o pão continua custando 1 real?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 font-normal leading-relaxed italic"
          >
            "O preço das coisas não é um número mágico — é a disputa entre o dinheiro no bolso de todos e a quantidade de mercadorias produzidas."
          </motion.p>
        </div>

        {/* Preset Shortcut Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-1">
            Cenários Rápidos:
          </span>
          <button
            onClick={() => applyPreset(800, 10)}
            className="px-4 py-2 rounded-2xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            🚨 Imprimir Notas Demais
          </button>
          <button
            onClick={() => applyPreset(100, 40)}
            className="px-4 py-2 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            🌱 Abundância de Produtos
          </button>
          <button
            onClick={() => applyPreset(100, 10)}
            className="px-4 py-2 rounded-2xl bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 text-blue-400 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            ⚖️ Equilíbrio Perfeito
          </button>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sliders & Controls (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                A Sala dos Botões
              </h2>
              <button
                onClick={() => setShowExplanationModal(!showExplanationModal)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Como Funciona?
              </button>
            </div>

            {/* Slider 1: Money Supply */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  Dinheiro em Circulação:
                </label>
                <span className="text-base font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  R$ {moneySupply.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={moneySupply}
                onChange={(e) => setMoneySupply(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
              />

              {/* Visual metaphor icons for money */}
              <div className="flex items-center gap-1.5 overflow-hidden py-1">
                {Array.from({ length: Math.min(12, Math.ceil(moneySupply / 80)) }).map((_, i) => (
                  <motion.div
                    key={`money-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-bold"
                  >
                    💵
                  </motion.div>
                ))}
                {moneySupply > 800 && <span className="text-xs font-bold text-red-400 ml-1">🔥 Excesso!</span>}
              </div>
              <p className="text-xs text-slate-400">
                Aumentar o dinheiro sem fabricar mais mercadorias é como distribuir mais fichas num jogo onde os prêmios continuam os mesmos.
              </p>
            </div>

            {/* Slider 2: Product Supply */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  Produtos Fabricados no Mercado:
                </label>
                <span className="text-base font-extrabold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
                  {productSupply} itens
                </span>
              </div>

              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={productSupply}
                onChange={(e) => setProductSupply(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />

              {/* Visual metaphor icons for products */}
              <div className="flex flex-wrap items-center gap-1.5 py-1">
                {Array.from({ length: Math.min(14, productSupply) }).map((_, i) => (
                  <motion.div
                    key={`prod-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-bold"
                  >
                    🍎
                  </motion.div>
                ))}
                {productSupply >= 40 && <span className="text-xs font-bold text-emerald-400 ml-1">📦 Abundância!</span>}
              </div>
              <p className="text-xs text-slate-400">
                Quanto mais mercadorias são produzidas pelas indústrias e fazendas, mais barata fica cada unidade.
              </p>
            </div>

          </div>

          {/* Right Column: Live Price Output & Graph (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Dynamic Price Display Card */}
            <motion.div
              layout
              className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-2xl relative overflow-hidden ${
                inflationPercent > 50
                  ? 'bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-900 border-red-500/50 shadow-red-950/50'
                  : inflationPercent < -10
                  ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/50 shadow-emerald-950/50'
                  : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700 shadow-slate-950/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                    Etiqueta de Preço Resultante
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      R$ {unitPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-slate-400">/ por item</span>
                  </div>
                </div>

                {/* Inflation Badge */}
                <div className="flex items-center gap-2">
                  {inflationPercent > 0 ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-extrabold">
                      <ArrowUpRight className="w-5 h-5 text-red-400 animate-bounce" />
                      +{inflationPercent}% de Inflação
                    </div>
                  ) : inflationPercent < 0 ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-extrabold">
                      <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                      {inflationPercent}% (Preço Menor!)
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-bold">
                      ⚖️ Preço Base de Referência
                    </div>
                  )}
                </div>
              </div>

              {/* Real purchasing power comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium block">
                    Poder de Compra (Com R$ 100):
                  </span>
                  <span className="text-2xl font-black text-emerald-400 block mt-1">
                    {purchasingPowerIndex} <span className="text-sm font-semibold text-slate-300">unidades</span>
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {Number(purchasingPowerIndex) < 5
                      ? "⚠️ Seu dinheiro quase não compra nada!"
                      : "✅ Excelente rendimento das suas economias!"}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium block">
                    O Que Está Acontecendo?
                  </span>
                  <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                    {moneySupply / productSupply > 30
                      ? "Muitas notas disputando pouquíssimas mercadorias. Os vendedores são forçados a subir o preço!"
                      : moneySupply / productSupply < 5
                      ? "Muita oferta de produtos e pouco dinheiro livre. Os vendedores dão desconto para não encalhar!"
                      : "A quantidade de moedas acompanha exatamente a oferta de alimentos e bens. Preços estáveis!"}
                  </p>
                </div>
              </div>

            </motion.div>

            {/* Recharts Trajectory Graph */}
            <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Projeção de Preços (Próximos Meses)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Se essa tendência continuar, veja o impacto na sua carteira
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium border border-slate-700">
                  Simulação Direta
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="precoColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={unitPrice > 15 ? "#ef4444" : "#10b981"} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={unitPrice > 15 ? "#ef4444" : "#10b981"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                      formatter={(val: any) => [val !== undefined ? `R$${val}` : '', 'Preço Estimado']}
                    />
                    <Area
                      type="monotone"
                      dataKey="preco"
                      stroke={unitPrice > 15 ? "#ef4444" : "#10b981"}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#precoColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Storyteller Explanation */}
        <AnimatePresence>
          {showExplanationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setShowExplanationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🏝️ A Parábola da Ilha das 10 Maçãs
                  </h3>
                  <button
                    onClick={() => setShowExplanationModal(false)}
                    className="text-slate-400 hover:text-white text-sm font-bold"
                  >
                    ✕ fechar
                  </button>
                </div>

                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <p>
                    Imagine que você e mais 9 amigos estão isolados numa ilha. Na ilha inteira só nasceram <strong className="text-amber-400 font-semibold">10 maçãs</strong> naquela semana.
                  </p>
                  <p>
                    Se cada um de vocês tiver apenas <strong className="text-emerald-400 font-semibold">R$ 1 no bolso</strong>, cada maçã vai custar R$ 1. É justo, todos conseguem comer.
                  </p>
                  <p>
                    Agora imagine que o prefeito da ilha encontra um baú de pirata e distribui <strong className="text-emerald-400 font-semibold">R$ 100 para cada um</strong>. Todos correm para a macieira com a carteira cheia. Mas adivinhe? <strong className="text-red-400 font-semibold">Ainda existem apenas as mesmas 10 maçãs!</strong>
                  </p>
                  <p className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-semibold text-amber-300">
                    💡 Moral da História: O dinheiro em si não se come nem se veste. O valor real da sociedade vem do que ela produz (alimentos, remédios, casas). Imprimir dinheiro não multiplica as maçãs!
                  </p>
                </div>

                <button
                  onClick={() => setShowExplanationModal(false)}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  Entendi perfeitamente!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
