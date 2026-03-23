import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { 
  Brain, 
  Send, 
  Atom, 
  FlaskConical, 
  Divide, 
  Zap, 
  Loader2,
  BookOpen,
  Lightbulb,
  History
} from 'lucide-react';

const KnowledgeEngine: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{ query: string; response: string }[]>([]);

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      
      const result = await ai.models.generateContent({
        model: model,
        contents: query,
        config: {
          systemInstruction: "Tu es un moteur de connaissance scientifique expert en physique, chimie et mathématiques complexes. Fournis des explications détaillées, des formules précises et des étapes de calcul claires. Utilise le format Markdown pour la clarté.",
        },
      });

      const text = result.text;
      if (text) {
        setResponse(text);
        setHistory(prev => [{ query, response: text }, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Knowledge Engine Error:", error);
      setResponse("Désolé, une erreur est survenue lors de la consultation du moteur de connaissance.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickQueries = [
    { label: "Loi d'Ohm", query: "Explique la loi d'Ohm avec des exemples de calcul." },
    { label: "Tableau Périodique", query: "Quelles sont les propriétés des gaz nobles ?" },
    { label: "Relativité", query: "Explique E=mc² simplement." },
    { label: "Calcul Intégral", query: "Comment calculer l'intégrale de x² de 0 à 1 ?" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-8 flex items-center">
              <Brain className="mr-3 text-brand-accent" size={24} />
              Moteur de Connaissance
            </h3>
            
            <form onSubmit={handleAsk} className="space-y-4">
              <div className="relative">
                <textarea
                  placeholder="Posez votre question scientifique (Physique, Chimie, Maths)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-6 text-white text-sm outline-none focus:border-brand-accent min-h-[180px] resize-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute bottom-4 right-4 p-4 bg-brand-accent text-brand-dark rounded-2xl shadow-lg shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Suggestions Rapides</h4>
              <div className="flex flex-wrap gap-2">
                {quickQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(q.query); handleAsk(); }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/10 hover:text-brand-accent transition-all"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-lg font-black text-white mb-6 flex items-center">
              <History className="mr-3 text-gray-500" size={18} />
              Historique Récent
            </h3>
            <div className="space-y-3">
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(item.query); setResponse(item.response); }}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all group"
                >
                  <p className="text-xs font-bold text-white truncate group-hover:text-brand-accent">{item.query}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Consulté</p>
                </button>
              ))}
              {history.length === 0 && (
                <p className="text-center py-8 text-gray-500 italic text-sm">Aucune recherche récente.</p>
              )}
            </div>
          </section>
        </div>

        {/* Response Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {response ? (
              <motion.section
                key="response"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass p-10 rounded-[3rem] border border-white/5 min-h-[600px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
                      <Lightbulb size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">Réponse de l'IA</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Moteur de Connaissance v3.1</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse delay-150"></div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none relative z-10">
                  <div className="markdown-body">
                    <Markdown>{response}</Markdown>
                  </div>
                </div>
              </motion.section>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 glass rounded-[3rem] border border-white/5 border-dashed min-h-[600px]">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mx-auto"></div>
                      <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-accent animate-pulse" size={32} />
                    </div>
                    <p className="text-xl font-black text-white uppercase tracking-widest">Analyse en cours...</p>
                    <p className="text-gray-500 text-sm">Le moteur de connaissance traite votre requête scientifique.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent mx-auto mb-8">
                      <BookOpen size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Prêt à répondre</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Posez une question sur la physique quantique, la chimie organique ou des calculs mathématiques avancés pour obtenir une réponse détaillée.
                    </p>
                    <div className="grid grid-cols-3 gap-4 pt-8">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Atom className="mx-auto mb-2 text-brand-accent" size={20} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Physique</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <FlaskConical className="mx-auto mb-2 text-brand-purple" size={20} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chimie</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Divide className="mx-auto mb-2 text-brand-accent" size={20} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Maths</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeEngine;
