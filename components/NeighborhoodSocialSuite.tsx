import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Users, 
  MapPin, 
  Filter, 
  Coffee, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  Search, 
  Target, 
  Globe, 
  Briefcase, 
  Calendar, 
  Heart,
  Loader2,
  ArrowRight,
  Navigation,
  Smartphone
} from 'lucide-react';

type SocialTab = 'filters' | 'heatmap' | 'circles' | 'aimatch';

const NeighborhoodSocialSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SocialTab>('filters');

  // --- Filters State ---
  const [radius, setRadius] = useState(5); // km
  const [selectedJob, setSelectedJob] = useState('Tous');
  const [ageRange, setAgeRange] = useState([18, 35]);

  // --- Heatmap State ---
  const [isAvailable, setIsAvailable] = useState(false);
  const [timer, setTimer] = useState(120); // 120 minutes

  // --- Circles State ---
  const [isGpsVerified, setIsGpsVerified] = useState(false);
  const [localGroups, setLocalGroups] = useState([
    { id: 1, name: 'Cercle Lemba-Salongo', members: 124, active: true },
    { id: 2, name: 'Entraide Quartier Sud', members: 56, active: false }
  ]);

  // --- AI Match State ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMatch, setAiMatch] = useState<any>(null);

  // --- Logic: AI Match ---
  const generateAiMatch = async () => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: "Génère un profil d'ami idéal pour un utilisateur vivant à Kinshasa (Lemba), passionné de Tech et de Foot. Inclus un score de compatibilité, les points communs et un icebreaker personnalisé.",
      });
      setAiMatch(result.text);
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  const tabs = [
    { id: 'filters', name: 'Filtres Pro', icon: <Filter size={20} />, color: 'text-brand-accent' },
    { id: 'heatmap', name: 'Heatmap Passions', icon: <MapPin size={20} />, color: 'text-emerald-500' },
    { id: 'circles', name: 'Cercles Locaux', icon: <Users size={20} />, color: 'text-indigo-500' },
    { id: 'aimatch', name: 'Lien Invisible', icon: <Zap size={20} />, color: 'text-purple-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SocialTab)}
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
          {/* --- FILTRES MULTI-NIVEAUX --- */}
          {activeTab === 'filters' && (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-black text-white mb-4">Ajuste ton Cercle</h3>
                <p className="text-gray-400">Trouve les bonnes personnes, au bon endroit, au bon moment.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black text-white uppercase tracking-widest">Rayon Géo</h4>
                      <span className="text-brand-accent font-black">{radius} km</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" max="50" 
                      value={radius} 
                      onChange={(e) => setRadius(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-accent"
                    />
                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      <span>Quartier</span>
                      <span>Commune</span>
                      <span>Ville</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Pro-Match</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {['Développeur', 'Entrepreneur', 'Gestionnaire', 'Artiste'].map(job => (
                        <button 
                          key={job}
                          onClick={() => setSelectedJob(job)}
                          className={`p-4 rounded-xl border transition-all text-xs font-black uppercase tracking-widest ${
                            selectedJob === job ? 'bg-brand-accent text-brand-dark border-brand-accent' : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          {job}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Démographie</h4>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Tranche d'âge</p>
                      <div className="flex items-center space-x-4">
                        <input type="number" value={ageRange[0]} className="w-20 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center font-black" />
                        <span className="text-gray-500">à</span>
                        <input type="number" value={ageRange[1]} className="w-20 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center font-black" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Sexe</p>
                      <div className="flex space-x-4">
                        {['Tous', 'Homme', 'Femme'].map(gender => (
                          <button key={gender} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10">
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-5 bg-brand-accent text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-accent/20">
                    Appliquer les Filtres
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- HEATMAP PASSIONS --- */}
          {activeTab === 'heatmap' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white">Carte des Passions</h3>
                  <p className="text-gray-500">Visualise les intérêts autour de toi en temps réel.</p>
                </div>
                <button 
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 transition-all ${
                    isAvailable ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  <Coffee size={18} />
                  <span>{isAvailable ? "Libre pour un café (2h)" : "Se rendre disponible"}</span>
                </button>
              </div>

              <div className="h-[500px] bg-white/5 border border-white/10 rounded-[3rem] relative overflow-hidden flex items-center justify-center">
                {/* Mock Map with Passion Icons */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover" />
                
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-20 left-40 p-4 bg-emerald-500 rounded-full shadow-2xl text-white">
                  <Target size={24} />
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-60 left-80 p-4 bg-indigo-500 rounded-full shadow-2xl text-white">
                  <Briefcase size={24} />
                </motion.div>
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-40 right-40 p-4 bg-purple-500 rounded-full shadow-2xl text-white">
                  <Zap size={24} />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-20 right-80 p-4 bg-pink-500 rounded-full shadow-2xl text-white">
                  <Heart size={24} />
                </motion.div>

                {isAvailable && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)] text-white flex flex-col items-center">
                    <Smartphone size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase">Moi</span>
                  </div>
                )}

                <div className="absolute bottom-10 left-10 p-6 glass border border-white/10 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Légende</p>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /><span className="text-[10px] text-white">Sport</span></div>
                    <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-indigo-500 rounded-full" /><span className="text-[10px] text-white">Tech</span></div>
                    <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-purple-500 rounded-full" /><span className="text-[10px] text-white">Art</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- CERCLES DE QUARTIER --- */}
          {activeTab === 'circles' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Tes Groupes Locaux</h4>
                    <button className="p-3 bg-indigo-500 text-white rounded-xl"><Navigation size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    {localGroups.map(group => (
                      <div key={group.id} className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/5 group hover:border-indigo-500/50 transition-all">
                        <div className="flex items-center space-x-6">
                          <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500">
                            <Users size={28} />
                          </div>
                          <div>
                            <p className="text-lg font-black text-white">{group.name}</p>
                            <p className="text-xs text-gray-500">{group.members} membres actifs</p>
                          </div>
                        </div>
                        <button className="p-4 bg-white/5 rounded-xl text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          <MessageSquare size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-8">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isGpsVerified ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-600 border-4 border-dashed border-white/10'}`}>
                    <ShieldCheck size={48} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Vérification GPS</h4>
                    <p className="text-gray-400 text-sm">Valide ta position une fois par semaine pour accéder aux groupes de quartier.</p>
                  </div>
                  <button 
                    onClick={() => setIsGpsVerified(true)}
                    className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20"
                  >
                    {isGpsVerified ? "Position Validée" : "Vérifier ma position"}
                  </button>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Dernière vérification: Il y a 2 jours</p>
                </div>
              </div>
            </div>
          )}

          {/* --- ALGORITHME LIEN INVISIBLE --- */}
          {activeTab === 'aimatch' && (
            <div className="flex flex-col items-center space-y-12">
              <div className="text-center max-w-2xl">
                <h3 className="text-3xl font-black text-white mb-4">Lien Invisible</h3>
                <p className="text-gray-400">L'IA analyse les profils pour détecter des connexions inattendues basées sur ton style de vie.</p>
              </div>

              {!aiMatch ? (
                <button 
                  onClick={generateAiMatch}
                  disabled={isProcessing}
                  className="w-72 h-72 rounded-full bg-purple-500 text-white flex flex-col items-center justify-center space-y-4 shadow-2xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={64} /> : <><Zap size={64} /> <span className="font-black uppercase tracking-widest text-xs text-center">Calculer Compatibilité</span></>}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-2xl p-10 bg-white/5 border border-purple-500/30 rounded-[3rem] relative space-y-8"
                >
                  <div className="absolute -top-6 left-10 w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white">
                    <Zap size={24} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white font-black text-2xl">J</div>
                      <div>
                        <h4 className="text-2xl font-black text-white">Joe M.</h4>
                        <p className="text-purple-500 font-black">Compatibilité: 98%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Distance</p>
                      <p className="text-white font-black">500m</p>
                    </div>
                  </div>

                  <div className="p-8 bg-purple-500/5 rounded-[2rem] border border-purple-500/10">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                      {aiMatch}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Icebreaker Suggéré</p>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group">
                      <p className="text-white text-sm italic">"Salut Joe ! J'ai vu qu'on est tous les deux dans le BTP et fans du Real..."</p>
                      <button className="p-3 bg-purple-500 text-white rounded-xl group-hover:scale-110 transition-all">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => setAiMatch(null)} className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Nouvelle Recherche</button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NeighborhoodSocialSuite;
