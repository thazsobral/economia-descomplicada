import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Menu, X, BookOpen, Compass, Activity, Brain, HelpCircle } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  setSoundEnabled,
  activeSection
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const speakIntro = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!soundEnabled) {
        setSoundEnabled(true);
        const utterance = new SpeechSynthesisUtterance(
          "Bem-vindo à Economia Descomplicada! Aqui você vai entender por que tudo fica caro em menos de 5 minutos."
        );
        utterance.lang = "pt-BR";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } else {
        setSoundEnabled(false);
      }
    } else {
      setSoundEnabled(!soundEnabled);
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3'
          : 'bg-slate-950/70 backdrop-blur-sm border-b border-slate-800/30 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight italic text-white flex items-center gap-1.5">
              POR QUE TUDO TÁ <span className="text-blue-500 font-extrabold">CARO?</span>
            </h1>
            <p className="text-xs text-slate-400 -mt-0.5 font-medium">
              Economia Descomplicada
            </p>
          </div>
        </div>

        {/* Current Explorer Pill */}
        <div className="hidden lg:flex items-center px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs font-medium text-slate-400">
          Explorando: <span className="text-slate-100 font-semibold ml-1">Bento Grid Interativo</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => scrollTo('simulador')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSection === 'simulador'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Dicionário
          </button>
        </nav>

        {/* Controls & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={speakIntro}
            title={soundEnabled ? 'Desativar Narração' : 'Ativar Narração'}
            className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-medium ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden lg:inline">Voz Ativa</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden lg:inline">Narração</span>
              </>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 py-4 space-y-2 animate-fadeIn">
          <button
            onClick={() => scrollTo('simulador')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            1. Simulador do Paradoxo
          </button>
          <button
            onClick={() => scrollTo('banco-central')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            2. Sala do Banco Central
          </button>
          <button
            onClick={() => scrollTo('solucoes')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            3. Curto vs Longo Prazo
          </button>
          <button
            onClick={() => scrollTo('noticias')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Brain className="w-4 h-4 text-amber-400" />
            4. Tradutor de Notícias (IA)
          </button>
          <button
            onClick={() => scrollTo('glossario')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            5. Dicionário Descomplicado
          </button>
        </div>
      )}
    </header>
  );
};
