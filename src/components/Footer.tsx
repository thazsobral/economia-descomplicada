import React from 'react';
import { Sparkles, RefreshCw, Compass, Activity, BookOpen, Brain, HelpCircle, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white">
                Por Que Tudo Está Tão Caro?
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma educacional e gamificada que traduz conceitos de economia, inflação, taxa de juros e oferta para uma linguagem universal, simples e acessível a qualquer pessoa.
            </p>
          </div>

          {/* Nav Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Módulos Educativos
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollTo('simulador')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1. Simulador do Paradoxo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('banco-central')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>2. Sala do Banco Central</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('solucoes')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>3. Curto vs Longo Prazo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('noticias')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>4. Tradutor de Notícias (IA)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('glossario')}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>5. Dicionário Descomplicado</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Reset & Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Navegação
            </span>
            <button
              onClick={handleScrollToTop}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all w-full justify-center cursor-pointer hover:border-slate-700 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              Voltar ao Início
            </button>
          </div>

        </div>

        {/* Bottom Bar: Badges & Quote */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[10px] uppercase tracking-widest">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full font-bold text-blue-400">
              Aprendizado: 100% Completo
            </span>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full font-bold text-emerald-400">
              Nível: Economista do Cotidiano
            </span>
          </div>

          <p className="text-slate-400 italic font-medium tracking-normal text-xs text-center md:text-right">
            "Economia é o estudo de como cuidamos uns dos outros e dos nossos recursos."
          </p>
        </div>

        {/* Developer Copyright Bar */}
        <div className="pt-4 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Desenvolvido por <strong className="text-slate-200 font-semibold">ThazSobral</strong> para fins de Educação Tecnológica Prática e Interativa.
            </span>
          </div>
          <span className="text-slate-500 shrink-0">
            © 2026 — Todos os direitos reservados.
          </span>
        </div>

      </div>
    </footer>
  );
};