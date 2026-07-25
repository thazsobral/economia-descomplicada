import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS } from '../data/economicData';
import { Award, CheckCircle2, XCircle, RotateCcw, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EconomyQuizProps {
  soundEnabled: boolean;
}

export const EconomyQuiz: React.FC<EconomyQuizProps> = ({ soundEnabled }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copiedBadge, setCopiedBadge] = useState<boolean>(false);

  const q = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);

    const option = q.options[index];
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }

    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = option.isCorrect
        ? "Correto! " + option.explanation
        : "Ops! " + option.explanation;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      window.speechSynthesis.speak(u);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsCompleted(false);
  };

  const copyShareBadge = () => {
    const text = `🏆 Concluí o Desafio 'Por que tudo está tão caro?' e acertei ${score} de 3 perguntas sobre economia descomplicada! Aprenda você também!`;
    navigator.clipboard.writeText(text);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2500);
  };

  return (
    <section id="desafio" className="py-20 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
            <Award className="w-4 h-4 text-emerald-400" />
            6. Desafio Final em 2 Minutos
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Teste Seus <span className="text-emerald-400">Superpoderes Econômicos</span>
          </h2>

          <p className="mt-2 text-base text-slate-300">
            Três perguntas rápidas para provar que você agora entende mais sobre economia do que a maioria dos comentaristas de TV!
          </p>
        </div>

        {/* Quiz Card */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative space-y-6">
          
          {!isCompleted ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pergunta {currentIdx + 1} de {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl border border-emerald-500/30">
                  Pontos: {score}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white leading-relaxed">
                  {q.question}
                </h3>

                <div className="space-y-3 pt-2">
                  {q.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const showResult = selectedOption !== null;

                    return (
                      <button
                        key={idx}
                        disabled={showResult}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between ${
                          showResult
                            ? option.isCorrect
                              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                              : isSelected
                              ? 'bg-red-500/20 border-red-500/60 text-red-200'
                              : 'bg-slate-950 border-slate-800 text-slate-500 opacity-50'
                            : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200 active:scale-[0.99]'
                        }`}
                      >
                        <span className="pr-4">{option.label}</span>
                        {showResult && (
                          option.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                          ) : null
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Box on Answer */}
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 pt-4"
                >
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    <strong>Explicação:</strong> {q.options[selectedOption].explanation}
                  </p>

                  <button
                    onClick={nextQuestion}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {currentIdx < QUIZ_QUESTIONS.length - 1 ? "Próxima Pergunta →" : "Ver Meu Resultado Final 🏆"}
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            /* COMPLETED CERTIFICATE BADGE */
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-1 mx-auto shadow-xl">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl">
                  🎓
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                  Certificado de Conclusão
                </span>
                <h3 className="text-2xl font-black text-white">
                  Você é um Mestre da Economia Descomplicada!
                </h3>
                <p className="text-sm text-slate-300">
                  Você acertou <strong className="text-emerald-400">{score} de 3</strong> perguntas e provou que entendeu a diferença entre criar valor real e a ilusão de notas impressas!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={copyShareBadge}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedBadge ? "Copiado para a Área de Transferência! 🎉" : "Compartilhar Conquista"}
                </button>

                <button
                  onClick={restartQuiz}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Refazer o Desafio
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
