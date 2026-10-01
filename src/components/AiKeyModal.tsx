import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound, ExternalLink, ShieldCheck, Check, Trash2, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { AIProvider } from '../types';
import { AI_PROVIDERS, getStoredAIConfig, saveStoredAIConfig, clearStoredAIConfig } from '../services/aiConfig';

interface AiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AiKeyModal: React.FC<AiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('gemini');
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load existing config on open
  useEffect(() => {
    if (isOpen) {
      const config = getStoredAIConfig();
      setSelectedProvider(config.provider);
      setApiKey(config.apiKey);
      setSavedSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const activeProviderMeta = AI_PROVIDERS[selectedProvider];

  const handleSave = () => {
    if (!apiKey.trim()) {
      setErrorMsg('Por favor, insira uma chave de API válida ou clique no link abaixo para criar uma.');
      return;
    }

    saveStoredAIConfig({
      provider: selectedProvider,
      apiKey: apiKey.trim(),
    });

    setSavedSuccess(true);
    setErrorMsg(null);
    if (onSaved) onSaved();

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    clearStoredAIConfig();
    setApiKey('');
    setSavedSuccess(false);
    setErrorMsg(null);
    if (onSaved) onSaved();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Configurar Chave de IA
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    Privado
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Armazenada exclusivamente no seu navegador (LocalStorage)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-6">
            {/* Explicação de Privacidade e Segurança */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-indigo-300">
                  Sua chave não fica fixa no código
                </strong>
                Para sua segurança e privacidade, a chave inserida é gravada apenas no seu dispositivo. Nenhuma chave do desenvolvedor é utilizada.
              </div>
            </div>

            {/* Seletor de Provedor LLM (Toggle Menu) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Escolha a Inteligência Artificial:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(Object.keys(AI_PROVIDERS) as AIProvider[]).map((pKey) => {
                  const p = AI_PROVIDERS[pKey];
                  const isSelected = selectedProvider === pKey;
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => {
                        setSelectedProvider(pKey);
                        setErrorMsg(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{p.badge}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Informação do Provedor Selecionado */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Modelo padrão:</span>
                <span className="font-semibold text-slate-200">{activeProviderMeta.model}</span>
              </div>
              <p className="text-slate-400 text-[11px] pt-1">
                {activeProviderMeta.description}
              </p>
            </div>

            {/* Input da Chave com visualização */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Chave de API ({activeProviderMeta.name}):
                </label>
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3 h-3" /> Limpar
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setErrorMsg(null);
                    setSavedSuccess(false);
                  }}
                  placeholder={activeProviderMeta.placeholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12 font-mono"
                />

                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Link Dinâmico quando o campo estiver vazio (ou como ação direta) */}
              {!apiKey.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5"
                >
                  <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    Não tem uma chave da {activeProviderMeta.name}?
                  </div>
                  <p className="text-[11px] text-amber-200/90">
                    {activeProviderMeta.instructions}
                  </p>
                  <a
                    href={activeProviderMeta.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 pt-1"
                  >
                    <span>{activeProviderMeta.linkLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              )}

              {/* Se já tiver chave, também exibe o link como atalho útil */}
              {apiKey.trim() && (
                <div className="text-right">
                  <a
                    href={activeProviderMeta.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-400 hover:text-indigo-400 inline-flex items-center gap-1"
                  >
                    Gerenciar chaves na {activeProviderMeta.name} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Chave salva com sucesso no navegador! Fechando...
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4" />
              Salvar Chave
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
