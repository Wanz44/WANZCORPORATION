import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Map as MapIcon, 
  Video, 
  UserCheck, 
  MessageCircle,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';

type DatingTab = 'match' | 'map' | 'verify' | 'coach';

const DatingSocialSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DatingTab>('match');

  // --- Match State ---
  const [visionScore, setVisionScore] = useState(0);
  const [matches, setMatches] = useState([
    { id: 1, name: 'Sarah', score: 94, vision: 'Ambition Pro & Tech', icebreaker: 'Vous aimez tous les deux React Native !' },
    { id: 2, name: 'David', score: 88, vision: 'Vie de Famille & Sport', icebreaker: 'David aussi court le marathon de Kinshasa.' }
  ]);

  // --- Map State ---
  const [events, setEvents] = useState([
    { id: 1, title: 'Hackathon Kinshasa', location: 'Gombe', singles: 12, type: 'Tech' },
    { id: 2, title: 'Session Crossfit', location: 'Bandal', singles: 8, type: 'Sport' },
    { id: 3, title: 'Atelier Cuisine Locale', location: 'Limete', singles: 15, type: 'Culture' }
  ]);

  // --- Coach State ---
  const [chatInput, setChatInput] = useState('');
  const [coachFeedback, setCoachFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Logic: Coach AI ---
  const getCoachAdvice = async () => {
    if (!chatInput.trim()) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `En tant que coach en séduction bienveillant, analyse ce message d'approche : "${chatInput}". Donne des conseils constructifs sur le ton, l'intérêt et comment l'améliorer.`,
      });
      setCoachFeedback(result.text);
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  const tabs = [
    { id: 'match', name: 'Match Vision', icon: <Heart size={20} />, color: 'text-pink-500' },
    { id: 'map', name: 'Events Map', icon: <MapIcon size={20} />, color: 'text-emerald-500' },
    { id: 'verify', name: 'Vérification', icon: <ShieldCheck size={20} />, color: 'text-brand-accent' },
    { id: 'coach', name: 'Coach IA', icon: <MessageSquare size={20} />, color: 'text-indigo-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DatingTab)}
            className={`px-8 py-4 rounded-2xl border transition-all flex items-center space-x-3 ${
              activeTab === tab.id 
                ? 'bg-white text-brand-dark border-brand-accent shadow-xl' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <div className={activeTab === tab.id ? tab.color : 'text-gray-500'}>{tab.icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass p-10 rounded-[3rem] border border-white/5 min-h-[600px]"
        >
          {/* --- MATCH PAR STYLE DE VIE --- */}
          {activeTab === 'match' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-black text-white mb-4">Vision du Futur</h3>
                <p className="text-gray-400">On ne choisit pas sur une photo, mais sur un projet de vie commun.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Tes Piliers</h4>
                  <div className="space-y-6">
                    {['Vie de Famille', 'Ambition Pro', 'Passions (Tech/Art)', 'Localisation'].map((pillar, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <span>{pillar}</span>
                          <span className="text-brand-accent">Priorité Haute</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-accent w-[80%]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Top 3 du Jour</h4>
                  {matches.map(match => (
                    <div key={match.id} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] group hover:border-pink-500/50 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-500 font-black text-xl">{match.name[0]}</div>
                          <div>
                            <p className="text-white font-black">{match.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{match.vision}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-pink-500">{match.score}%</p>
                          <p className="text-[8px] text-gray-600 uppercase font-black">Compatibilité</p>
                        </div>
                      </div>
                      <div className="p-4 bg-pink-500/5 rounded-xl border border-pink-500/10 mb-6">
                        <p className="text-xs text-gray-400 italic">"{match.icebreaker}"</p>
                      </div>
                      <button className="w-full py-4 bg-pink-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2">
                        <MessageCircle size={16} />
                        <span>Envoyer Icebreaker</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- EVENTS & HOBBIES MAP --- */}
          {activeTab === 'map' && (
            <div className="space-y-10">
              <div className="h-[400px] bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden flex items-center justify-center">
                <MapPin className="text-emerald-500 animate-bounce" size={48} />
                <p className="absolute bottom-10 text-gray-500 font-black uppercase tracking-widest text-xs">Carte Interactive de Kinshasa</p>
                {/* Mock Map UI */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-20 left-40 w-4 h-4 bg-emerald-500 rounded-full shadow-2xl shadow-emerald-500" />
                  <div className="absolute top-60 left-80 w-4 h-4 bg-emerald-500 rounded-full shadow-2xl shadow-emerald-500" />
                  <div className="absolute top-40 right-40 w-4 h-4 bg-emerald-500 rounded-full shadow-2xl shadow-emerald-500" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {events.map(event => (
                  <div key={event.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 font-black text-[8px] uppercase tracking-widest">
                        {event.type}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users size={14} />
                        <span className="text-[10px] font-black">{event.singles} célibs</span>
                      </div>
                    </div>
                    <h4 className="text-white font-black">{event.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>{event.location}</span>
                    </p>
                    <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
                      Je participe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- VERIFIED PROFILE --- */}
          {activeTab === 'verify' && (
            <div className="flex flex-col items-center space-y-12">
              <div className="text-center max-w-2xl">
                <h3 className="text-3xl font-black text-white mb-4">Confiance & Sécurité</h3>
                <p className="text-gray-400">Rejoignez une communauté de célibataires sérieux et vérifiés.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10 w-full">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8 text-center">
                  <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent mx-auto">
                    <Video size={40} />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Vérification Vidéo IA</h4>
                  <p className="text-gray-500 text-sm">Passez un test rapide de 10 secondes pour prouver que vous êtes bien vous.</p>
                  <button className="w-full py-5 bg-brand-accent text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-accent/20">
                    Démarrer Vérification
                  </button>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Badge de Sérieux</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Mama Marie', text: 'Un homme très respectueux et ponctuel.' },
                      { name: 'Sarah L.', text: 'Sérieux dans ses projets de vie.' }
                    ].map((rec, i) => (
                      <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 italic text-sm text-gray-400">
                        "{rec.text}"
                        <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mt-2">— {rec.name}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Demander une Recommandation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- COACH DE SÉDUCTION IA --- */}
          {activeTab === 'coach' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center space-x-4">
                    <Zap className="text-indigo-500" size={32} />
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Simulateur de Chat</h4>
                  </div>
                  <p className="text-gray-500 text-sm">Entraînez-vous à aborder et recevez des conseils en temps réel.</p>
                  <div className="space-y-4">
                    <textarea 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Tape ton message d'approche ici..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-indigo-500 h-40 resize-none"
                    />
                    <button 
                      onClick={getCoachAdvice}
                      disabled={isProcessing}
                      className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><span>Analyser mon message</span> <ArrowRight size={16} /></>}
                    </button>
                  </div>
                </div>

                <div className="p-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] space-y-6">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Feedback du Coach</h4>
                  {coachFeedback ? (
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                      {coachFeedback}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 text-gray-600">
                      <MessageSquare size={48} />
                      <p className="text-xs font-black uppercase tracking-widest">En attente de ton message...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DatingSocialSuite;
