import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { HeroSimulator } from './components/HeroSimulator';
import { CentralBankDashboard } from './components/CentralBankDashboard';
import { TimelineComparison } from './components/TimelineComparison';
import { NewsTranslator } from './components/NewsTranslator';
import { GlossarySection } from './components/GlossarySection';
import { EconomyQuiz } from './components/EconomyQuiz';
import { Footer } from './components/Footer';
import { AiKeyModal } from './components/AiKeyModal';
import { getStoredAIConfig } from './services/aiConfig';

function MainApp() {
  const [activeSection, setActiveSection] = useState<string>('simulador');
  const [isAiKeyModalOpen, setIsAiKeyModalOpen] = useState<boolean>(false);
  const [hasAiKey, setHasAiKey] = useState<boolean>(false);

  const checkAiKey = useCallback(() => {
    const config = getStoredAIConfig();
    setHasAiKey(Boolean(config.apiKey && config.apiKey.trim().length > 0));
  }, []);

  useEffect(() => {
    checkAiKey();
    window.addEventListener('ai-config-changed', checkAiKey);
    return () => window.removeEventListener('ai-config-changed', checkAiKey);
  }, [checkAiKey]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['simulador', 'banco-central', 'solucoes', 'noticias', 'glossario', 'desafio'];
      const scrollPos = window.scrollY + 250;

      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 bg-slate-50 text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 antialiased transition-colors duration-200">
      {/* Header Bar */}
      <Header
        activeSection={activeSection}
        onOpenAiKeyModal={() => setIsAiKeyModalOpen(true)}
        hasAiKey={hasAiKey}
      />

      {/* Main Single Page Sections */}
      <main id="hero">
        {/* Section 1: Hero Simulator */}
        <HeroSimulator soundEnabled={false} />

        {/* Section 2: Central Bank Control Room */}
        <CentralBankDashboard soundEnabled={false} />

        {/* Section 3: Timeline Comparison (Short term vs Long term) */}
        <TimelineComparison soundEnabled={false} />

        {/* Section 4: AI News Translator */}
        <NewsTranslator onOpenAiKeyModal={() => setIsAiKeyModalOpen(true)} />

        {/* Section 5: Glossary & Metaphors */}
        <GlossarySection soundEnabled={false} />

        {/* Section 6: Quick 2-Min Quiz */}
        <EconomyQuiz soundEnabled={false} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal de Configuração de Chave de IA do Usuário */}
      <AiKeyModal
        isOpen={isAiKeyModalOpen}
        onClose={() => setIsAiKeyModalOpen(false)}
        onSaved={checkAiKey}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
