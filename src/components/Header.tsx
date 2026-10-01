import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Compass,
  Activity,
  Brain,
  HelpCircle,
  Sun,
  Moon,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeSection: string;
  onOpenAiKeyModal: () => void;
  hasAiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenAiKeyModal,
  hasAiKey,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/95 dark:bg-slate-900/95 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-lg py-2.5 sm:py-3'
          : 'bg-slate-950/80 dark:bg-slate-950/80 bg-white/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/40 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo - shrink-0 e whitespace-nowrap evitam quebra indesejada */}
        <div
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
            E
          </div>
          <div className="whitespace-nowrap">
            <h1 className="text-base sm:text-lg font-black tracking-tight italic text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
              <span>POR QUE TUDO TÁ</span>
              <span className="text-blue-500 font-extrabold not-italic">CARO?</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              Economia Descomplicada
            </p>
          </div>
        </div>

        {/* Desktop Nav Links - centralizado e limpo, sem pill excessivo */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <button
            onClick={() => scrollTo('simulador')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSection === 'simulador'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Simulador
          </button>

          <button
            onClick={() => scrollTo('banco-central')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSection === 'banco-central'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Banco Central
          </button>

          <button
            onClick={() => scrollTo('solucoes')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSection === 'solucoes'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Decisões
          </button>

          <button
            onClick={() => scrollTo('noticias')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSection === 'noticias'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Tradutor IA
          </button>

          <button
            onClick={() => scrollTo('glossario')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSection === 'glossario'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Dicionário
          </button>
        </nav>

        {/* Controles da Direita: Alternância de Tema & Chave de IA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botão de Chave de IA */}
          <button
            type="button"
            onClick={onOpenAiKeyModal}
            title={hasAiKey ? 'Chave de IA configurada (Clique para alterar)' : 'Configurar Chave de IA'}
            className={`px-3 py-1.5 sm:py-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
              hasAiKey
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 shadow-sm'
                : 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Chave de IA</span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                hasAiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Botão de Alternância de Tema (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            aria-label="Alternar tema"
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu de navegação"
            className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 animate-fadeIn shadow-xl">
          <button
            onClick={() => scrollTo('simulador')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-500" />
            1. Simulador do Paradoxo
          </button>
          <button
            onClick={() => scrollTo('banco-central')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-cyan-500" />
            2. Sala do Banco Central
          </button>
          <button
            onClick={() => scrollTo('solucoes')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            3. Curto vs Longo Prazo
          </button>
          <button
            onClick={() => scrollTo('noticias')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Brain className="w-4 h-4 text-amber-500" />
            4. Tradutor de Notícias (IA)
          </button>
          <button
            onClick={() => scrollTo('glossario')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-purple-500" />
            5. Dicionário Descomplicado
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 px-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiKeyModal();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Configurar Chave IA
            </button>
            <button
              onClick={toggleTheme}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              Tema
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
