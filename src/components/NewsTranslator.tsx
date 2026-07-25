import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, Send, Loader2, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { SAMPLE_HEADLINES } from '../data/economicData';
import { NewsTranslation } from '../types';

interface NewsTranslatorProps {
  soundEnabled: boolean;
}

export const NewsTranslator: React.FC<NewsTranslatorProps> = ({ soundEnabled }) => {
  const [headline, setHeadline] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<NewsTranslation | null>(null);

  // Cancela áudios pendentes quando o componente é desmontado
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playSpeech = useCallback((title: string, explanation: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Parar fala anterior se houver
    const speechText = `${title}. ${explanation}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  }, [soundEnabled]);

  const handleTranslate = async (textToTranslate?: string) => {
    const input = (textToTranslate || headline).trim();
    if (!input) {
      setError('Por favor, digite ou selecione uma notícia.');
      return;
    }

    setLoading(true);
    setError(null);
    if (textToTranslate) setHeadline(textToTranslate);

    try {
      const response = await fetch('/api/translate-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline: input })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Falha ao se comunicar com o Mentor IA.');
      }

      const data: NewsTranslation = await response.json();
      setTranslationResult(data);
      playSpeech(data.simpleTitle, data.simpleExplanation);

    } catch (err) {
      console.error('Erro na tradução:', err);
      const message = err instanceof Error ? err.message : 'Não foi possível traduzir no momento.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="noticias" className="py-20 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      {/* Background Decor Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Brain className="w-4 h-4 text-indigo-400" />
            4. Tradutor de Economês (IA)
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Notícias Sem <span className="text-indigo-400 italic">Complicação</span>
          </h2>

          <p className="mt-3 text-base text-slate-400 font-medium">
            Cole abaixo qualquer manchete confusa sobre inflação, IPCA ou impostos e descubra o impacto no seu bolso.
          </p>
        </div>

        {/* Container Principal */}
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Manchetes de Exemplo */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              💡 Manchetes de Exemplo:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_HEADLINES.map((item, idx) => (
                <button
                  key={idx}
                  disabled={loading}
                  onClick={() => handleTranslate(item.title)}
                  className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all text-left flex items-center gap-2 hover:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[280px]">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card de Entrada */}
          <div className="bg-indigo-600 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/20 text-white space-y-6 relative overflow-hidden">
            <div>
              <h3 className="text-xl font-bold mb-1">Tradutor de Economês</h3>
              <p className="text-indigo-100 text-xs opacity-90 font-medium">
                Cole aqui aquela notícia confusa do jornal e o mentor IA explica para você.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: 'IPCA acumulado de 10% impacta o varejo e força arrocho monetário'..."
                className="w-full bg-indigo-700/80 border border-indigo-500/40 rounded-2xl p-4 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium resize-none shadow-inner"
              />

              {error && (
                <div className="p-3 rounded-xl bg-indigo-950/80 border border-red-400 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-indigo-200/80 font-medium hidden sm:inline">
                  ⚡ Tradução em linguagem clara e direta
                </span>

                <button
                  disabled={loading}
                  onClick={() => handleTranslate()}
                  className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-700" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-indigo-700" />
                      TRADUZIR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card de Resposta da IA */}
          <AnimatePresence>
            {translationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl shadow-amber-950/30 relative overflow-hidden space-y-6"
              >
                {/* Cabeçalho do Veredito */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" role="img" aria-label="Emoji de veredito">
                      {translationResult.verdictEmoji}
                    </span>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block">
                        Veredito da Notícia
                      </span>
                      <span className="text-lg font-black text-white">
                        {translationResult.verdict}
                      </span>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-300 flex items-center gap-1.5 w-fit">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Análise Didática do Bolso
                  </div>
                </div>

                {/* Pergunta e Título Simples */}
                <div className="space-y-2">
                  <p className="text-xs text-amber-300 font-semibold italic bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    ❓ "{translationResult.questionMessage}"
                  </p>
                  <h3 className="text-xl font-bold text-white pt-1">
                    {translationResult.simpleTitle}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {translationResult.simpleExplanation}
                  </p>
                </div>

                {/* Lição Prática */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block uppercase">
                      Lição Principal para Lembrar:
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {translationResult.keyTakeaway}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};