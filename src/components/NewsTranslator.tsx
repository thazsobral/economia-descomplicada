import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  KeyRound,
  ExternalLink,
  Settings
} from 'lucide-react';
import { SAMPLE_HEADLINES } from '../data/economicData';
import { NewsTranslation, AIProvider } from '../types';
import {
  getStoredAIConfig,
  AI_PROVIDERS,
  saveStoredAIConfig
} from '../services/aiConfig';

interface NewsTranslatorProps {
  onOpenAiKeyModal?: () => void;
}

export const NewsTranslator: React.FC<NewsTranslatorProps> = ({ onOpenAiKeyModal }) => {
  const [headline, setHeadline] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<NewsTranslation | null>(null);

  // Estado da chave e provedor de IA
  const [aiConfig, setAiConfig] = useState(getStoredAIConfig());
  const [inlineKey, setInlineKey] = useState<string>('');
  const [inlineProvider, setInlineProvider] = useState<AIProvider>(aiConfig.provider);

  const refreshConfig = useCallback(() => {
    const cfg = getStoredAIConfig();
    setAiConfig(cfg);
    setInlineProvider(cfg.provider);
  }, []);

  useEffect(() => {
    refreshConfig();
    window.addEventListener('ai-config-changed', refreshConfig);
    return () => window.removeEventListener('ai-config-changed', refreshConfig);
  }, [refreshConfig]);

  const activeProviderMeta = AI_PROVIDERS[aiConfig.provider || 'gemini'];
  const currentInlineMeta = AI_PROVIDERS[inlineProvider];
  const hasKey = Boolean(aiConfig.apiKey && aiConfig.apiKey.trim().length > 0);

  const handleSaveInlineKey = () => {
    if (!inlineKey.trim()) {
      setError('Por favor, digite ou cole a sua chave de API.');
      return;
    }
    saveStoredAIConfig({
      provider: inlineProvider,
      apiKey: inlineKey.trim(),
    });
    setInlineKey('');
    setError(null);
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const input = (textToTranslate || headline).trim();
    if (!input) {
      setError('Por favor, digite ou selecione uma notícia.');
      return;
    }

    const currentKey = aiConfig.apiKey?.trim();
    if (!currentKey) {
      setError('Adicione sua chave de IA abaixo ou no menu para traduzir a notícia com o mentor de economia.');
      return;
    }

    setLoading(true);
    setError(null);
    if (textToTranslate) setHeadline(textToTranslate);

    try {
      const response = await fetch('/api/translate-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: input,
          provider: aiConfig.provider,
          apiKey: currentKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const fullMsg = data?.details ? `${data.error} ${data.details}` : (data?.error || 'Falha ao se comunicar com o Mentor IA.');
        throw new Error(fullMsg);
      }

      setTranslationResult(data);
    } catch (err: any) {
      console.error('Erro na tradução:', err);
      const message = err instanceof Error ? err.message : 'Não foi possível traduzir no momento.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="noticias" className="py-20 bg-slate-950 dark:bg-slate-950 bg-slate-50 relative overflow-hidden border-t border-slate-200 dark:border-slate-900 transition-colors">
      {/* Background Decor Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <Brain className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            4. Tradutor de Economês (IA)
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Notícias Sem <span className="text-indigo-600 dark:text-indigo-400 italic">Complicação</span>
          </h2>

          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 font-medium">
            Cole abaixo qualquer manchete confusa sobre inflação, juros, câmbio ou impostos e descubra o impacto real no seu bolso.
          </p>
        </div>

        {/* Container Principal */}
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Banner de Chave do Usuário (se não tiver chave cadastrada) */}
          {!hasKey && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-md space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-amber-950 dark:text-amber-100">
                      Configure sua Chave de IA para Traduzir
                    </h4>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                      Para sua segurança, não usamos chaves fixas no servidor. A chave fica guardada no LocalStorage do seu navegador.
                    </p>
                  </div>
                </div>

                {onOpenAiKeyModal && (
                  <button
                    onClick={onOpenAiKeyModal}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shrink-0 shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Abrir Menu
                  </button>
                )}
              </div>

              {/* Toggle de Provedores Rápidos */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  1. Escolha a IA desejada:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.keys(AI_PROVIDERS) as AIProvider[]).map((pKey) => {
                    const meta = AI_PROVIDERS[pKey];
                    const isSel = inlineProvider === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => setInlineProvider(pKey)}
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                          isSel
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                        }`}
                      >
                        <div className="font-bold">{meta.name}</div>
                        <div className={`text-[10px] ${isSel ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {meta.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campo para colar a chave + Link direto para criação se vazio */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  2. Cole sua chave de API ({currentInlineMeta.name}):
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    value={inlineKey}
                    onChange={(e) => setInlineKey(e.target.value)}
                    placeholder={currentInlineMeta.placeholder}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveInlineKey}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    Salvar Chave
                  </button>
                </div>

                {/* Link dinâmico quando a chave estiver vazia */}
                {!inlineKey.trim() && (
                  <div className="pt-1 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-amber-800 dark:text-amber-300">
                      Não possui uma chave da {currentInlineMeta.name}?
                    </span>
                    <a
                      href={currentInlineMeta.keyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400 hover:underline"
                    >
                      {currentInlineMeta.linkLabel}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Status quando chave está configurada */}
          {hasKey && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  IA Conectada:
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/60">
                  {activeProviderMeta.name}
                </span>
                <span className="text-slate-500 hidden sm:inline">
                  (Chave salva no LocalStorage)
                </span>
              </div>

              {onOpenAiKeyModal && (
                <button
                  onClick={onOpenAiKeyModal}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Alterar Provedor / Chave</span>
                </button>
              )}
            </div>
          )}
          
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
                  className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all text-left flex items-center gap-2 hover:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate max-w-[280px]">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card de Entrada */}
          <div className="bg-indigo-600 dark:bg-indigo-600 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/20 text-white space-y-6 relative overflow-hidden">
            <div>
              <h3 className="text-xl font-bold mb-1 text-white">Tradutor de Economês</h3>
              <p className="text-indigo-100 text-xs opacity-90 font-medium">
                Cole aqui aquela notícia confusa do jornal e o mentor IA explica de forma simples para você.
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
                <div className="p-3 rounded-xl bg-indigo-950/90 border border-red-400 text-red-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                  {!hasKey && onOpenAiKeyModal && (
                    <button
                      onClick={onOpenAiKeyModal}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold text-[11px] shrink-0 hover:bg-amber-600 transition-colors"
                    >
                      Configurar Chave
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-indigo-200/90 font-medium hidden sm:inline">
                  ⚡ Tradução instantânea e imparcial
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
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl shadow-amber-950/10 dark:shadow-amber-950/30 relative overflow-hidden space-y-6"
              >
                {/* Cabeçalho do Veredito */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" role="img" aria-label="Emoji de veredito">
                      {translationResult.verdictEmoji}
                    </span>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
                        Veredito da Notícia
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {translationResult.verdict}
                      </span>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-amber-600 dark:text-amber-300 flex items-center gap-1.5 w-fit">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Análise Didática do Bolso
                  </div>
                </div>

                {/* Pergunta e Título Simples */}
                <div className="space-y-2">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold italic bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20">
                    ❓ "{translationResult.questionMessage}"
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                    {translationResult.simpleTitle}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {translationResult.simpleExplanation}
                  </p>
                </div>

                {/* Lição Prática */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                      Lição Principal para Lembrar:
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
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
