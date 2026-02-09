
import React, { useState, useRef, useEffect } from 'react';
import { getIntelligentResponse, analyzeImage, getQuickAdvice } from '../services/geminiService';
import { ChatMessage, GroundingSource } from '../types';

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bonjour ! Je suis l\'assistant automatisé de WANZCORP. Comment puis-je vous aider dans votre transformation digitale aujourd\'hui ?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setSources([]);

    try {
      const result = await getIntelligentResponse(input);
      setMessages(prev => [...prev, { role: 'model', text: result.text, timestamp: Date.now() }]);
      setSources(result.grounding);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Désolé, j'ai rencontré une erreur technique.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setMessages(prev => [...prev, { role: 'user', text: "Analyse automatisée de l'image envoyée...", timestamp: Date.now() }]);
      setIsLoading(true);
      
      try {
        const analysis = await analyzeImage(base64, "Peux-tu analyser cette image et me dire comment WANZCORP pourrait aider à améliorer ce design ou cette interface ?");
        setMessages(prev => [...prev, { role: 'model', text: analysis || "Analyse terminée.", timestamp: Date.now() }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'model', text: "Erreur lors de l'analyse automatisée de l'image.", timestamp: Date.now() }]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="ai-hub" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">Consultant <span className="gradient-text">Automatisé</span></h2>
          <p className="text-gray-400">Posez vos questions techniques, analysez vos designs ou demandez des conseils stratégiques.</p>
        </div>

        <div className="glass rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] border border-white/10">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-white">Système Automatisé Actif</span>
            </div>
            <div className="flex space-x-2">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="p-2 text-gray-400 hover:text-brand-accent transition-colors"
                 title="Analyser une image"
               >
                 <i className="fas fa-image"></i>
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-dark/30">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  m.role === 'user' 
                    ? 'bg-brand-accent text-brand-dark font-medium rounded-tr-none' 
                    : 'bg-brand-surface border border-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-brand-surface border border-white/10 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grounding Sources */}
          {sources.length > 0 && (
            <div className="px-6 py-2 bg-brand-dark/50 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-1">Sources consultées :</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline flex items-center space-x-1">
                    <i className="fas fa-external-link-alt scale-75"></i>
                    <span>{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-brand-surface border-t border-white/10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Décrivez votre projet ou posez une question..."
                className="w-full bg-brand-dark border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 text-brand-accent hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
