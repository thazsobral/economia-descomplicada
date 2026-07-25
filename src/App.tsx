import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSimulator } from './components/HeroSimulator';
import { CentralBankDashboard } from './components/CentralBankDashboard';
import { TimelineComparison } from './components/TimelineComparison';
import { NewsTranslator } from './components/NewsTranslator';
import { GlossarySection } from './components/GlossarySection';
import { EconomyQuiz } from './components/EconomyQuiz';
import { Footer } from './components/Footer';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('simulador');

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      {/* Header Bar */}
      <Header
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeSection={activeSection}
      />

      {/* Main Single Page Sections */}
      <main id="hero">
        {/* Section 1: Hero Simulator */}
        <HeroSimulator soundEnabled={soundEnabled} />

        {/* Section 2: Central Bank Control Room */}
        <CentralBankDashboard soundEnabled={soundEnabled} />

        {/* Section 3: Timeline Comparison (Short term vs Long term) */}
        <TimelineComparison soundEnabled={soundEnabled} />

        {/* Section 4: AI News Translator */}
        <NewsTranslator soundEnabled={soundEnabled} />

        {/* Section 5: Glossary & Metaphors */}
        <GlossarySection soundEnabled={soundEnabled} />

        {/* Section 6: Quick 2-Min Quiz */}
        <EconomyQuiz soundEnabled={soundEnabled} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
