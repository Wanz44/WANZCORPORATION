import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Zap, 
  Gamepad2, 
  PiggyBank, 
  Smartphone, 
  Code2, 
  Heart, 
  X, 
  Check, 
  Target, 
  Trophy, 
  Timer, 
  Layout, 
  BookOpen, 
  Rocket,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';

type TeenTab = 'orientation' | 'money' | 'detox' | 'code';

const TeenGenZSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TeenTab>('orientation');

  // --- Orientation State ---
  const [swipedJobs, setSwipedJobs] = useState<any[]>([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [careerPath, setCareerPath] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const jobs = [
    { id: 1, title: 'Développeur Fullstack', tags: ['Code', 'Logique', 'Création'], image: 'https://picsum.photos/seed/code/400/600' },
    { id: 2, title: 'Designer UI/UX', tags: ['Dessin', 'Psychologie', 'Web'], image: 'https://picsum.photos/seed/design/400/600' },
    { id: 3, title: 'Manager de Projet', tags: ['Organisation', 'Social', 'Leadership'], image: 'https://picsum.photos/seed/manager/400/600' },
    { id: 4, title: 'Ingénieur Robotique', tags: ['Maths', 'Moteurs', 'Innovation'], image: 'https://picsum.photos/seed/robot/400/600' }
  ];

  // --- Money State ---
  const [savings, setSavings] = useState(15000);
  const [goal, setGoal] = useState({ name: 'Carte Graphique RTX', price: 85000 });

  // --- Detox State ---
  const [focusLevel, setFocusLevel] = useState(50);
  const [isFocusing, setIsFocusing] = useState(false);

  // --- Code State ---
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, title: 'Mon Premier Jeu', type: 'Script' },
    { id: 2, title: 'Logo Clan Gaming', type: 'Design' }
  ]);

  // --- Logic: Orientation AI ---
  const handleSwipe = async (liked: boolean) => {
    const job = jobs[currentJobIndex];
    if (liked) setSwipedJobs([...swipedJobs, job]);
    
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
    } else {
      // End of swipes, generate path
      setIsProcessing(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = "gemini-3.1-pro-preview";
        const result = await ai.models.generateContent({
          model,
          contents: `Analyse ces intérêts : ${swipedJobs.map(j => j.tags.join(', ')).join(', ')}. Propose un parcours de compétences précis avec des écoles locales (RDC) et des plateformes en ligne (Coursera, Udemy).`,
        });
        setCareerPath(result.text);
      } catch (e) { console.error(e); }
      finally { setIsProcessing(false); }
    }
  };

  const tabs = [
    { id: 'orientation', name: 'Orientation', icon: <Gamepad2 size={20} />, color: 'text-brand-accent' },
    { id: 'money', name: 'Argent de Poche', icon: <PiggyBank size={20} />, color: 'text-emerald-500' },
    { id: 'detox', name: 'Digital Detox', icon: <Smartphone size={20} />, color: 'text-indigo-500' },
    { id: 'code', name: 'Starter Kit Code', icon: <Code2 size={20} />, color: 'text-purple-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TeenTab)}
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
          {/* --- ORIENTATION NEXT-GEN --- */}
          {activeTab === 'orientation' && (
            <div className="flex flex-col items-center space-y-10">
              <div className="text-center">
                <h3 className="text-3xl font-black text-white mb-2">Tinder des Métiers</h3>
                <p className="text-gray-500">Swipe à droite si ça te branche, à gauche si c'est pas ton truc.</p>
              </div>

              {!careerPath ? (
                <div className="relative w-full max-w-sm aspect-[3/4] group">
                  <AnimatePresence>
                    <motion.div 
                      key={currentJobIndex}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ x: 300, opacity: 0, rotate: 20 }}
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                      <img src={jobs[currentJobIndex].image} alt="Job" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-8 flex flex-col justify-end">
                        <h4 className="text-2xl font-black text-white mb-4">{jobs[currentJobIndex].title}</h4>
                        <div className="flex flex-wrap gap-2">
                          {jobs[currentJobIndex].tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 rounded-full text-[10px] text-brand-accent font-black uppercase tracking-widest">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-6">
                    <button onClick={() => handleSwipe(false)} className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all">
                      <X size={40} />
                    </button>
                    <button onClick={() => handleSwipe(true)} className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition-all">
                      <Check size={40} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl p-10 bg-brand-accent/5 border border-brand-accent/20 rounded-[3rem] space-y-6">
                  <div className="flex items-center space-x-4">
                    <Rocket className="text-brand-accent" size={32} />
                    <h4 className="text-2xl font-black text-white">Ton Parcours IA</h4>
                  </div>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {isProcessing ? <Loader2 className="animate-spin text-brand-accent" size={32} /> : careerPath}
                  </div>
                  <button onClick={() => { setCareerPath(null); setCurrentJobIndex(0); setSwipedJobs([]); }} className="text-xs font-black text-brand-accent uppercase tracking-widest">Recommencer</button>
                </div>
              )}
            </div>
          )}

          {/* --- MONEY MANAGER --- */}
          {activeTab === 'money' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Mon Objectif</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black text-white">{goal.name}</p>
                      <p className="text-gray-500 font-bold">{goal.price.toLocaleString()} FC</p>
                    </div>
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                      <Target size={32} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-emerald-500">Épargné: {savings.toLocaleString()} FC</span>
                      <span className="text-gray-500">Reste: {(goal.price - savings).toLocaleString()} FC</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(savings / goal.price) * 100}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-emerald-500/10 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Estimation</p>
                    <p className="text-2xl font-black text-white">Dans 42 jours</p>
                  </div>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Bonus Parents</h4>
                  <div className="space-y-4">
                    {[
                      { task: 'Vaisselle (Semaine)', reward: 5000, done: true },
                      { task: 'Moyenne > 15/20', reward: 20000, done: false },
                      { task: 'Rangement Chambre', reward: 2000, done: false }
                    ].map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-sm font-bold text-white">{t.task}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-emerald-500 font-black">+{t.reward} FC</span>
                          {t.done ? <Trophy className="text-yellow-500" size={20} /> : <div className="w-5 h-5 border-2 border-white/10 rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- DIGITAL DETOX --- */}
          {activeTab === 'detox' && (
            <div className="flex flex-col items-center space-y-12">
              <div className="text-center">
                <h3 className="text-3xl font-black text-white mb-2">Focus Buddy</h3>
                <p className="text-gray-500">Ton personnage grandit quand tu lâches ton téléphone.</p>
              </div>

              <div className="relative w-64 h-64">
                <motion.div 
                  animate={{ y: [0, -10, 0], scale: isFocusing ? 1.1 : 1 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-full h-full bg-indigo-500/20 rounded-full flex items-center justify-center border-4 border-indigo-500/30"
                >
                  <div className="text-8xl">👾</div>
                </motion.div>
                {isFocusing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest"
                  >
                    +2 XP / min
                  </motion.div>
                )}
              </div>

              <div className="w-full max-w-md space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Niveau 12</p>
                    <p className="text-white font-black">Focus Master</p>
                  </div>
                  <p className="text-indigo-500 font-black">840 / 1000 XP</p>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[84%]" />
                </div>
                
                <button 
                  onClick={() => setIsFocusing(!isFocusing)}
                  className={`w-full py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all ${
                    isFocusing ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20'
                  }`}
                >
                  {isFocusing ? "Arrêter le Focus" : "Démarrer Session (2h)"}
                </button>
              </div>
            </div>
          )}

          {/* --- STARTER KIT CODE --- */}
          {activeTab === 'code' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Mon Portfolio</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {portfolioItems.map(item => (
                      <div key={item.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center group hover:border-purple-500/50 transition-all">
                        <Layout className="mx-auto mb-3 text-purple-500" size={24} />
                        <p className="text-xs font-black text-white mb-1">{item.title}</p>
                        <p className="text-[8px] text-gray-500 uppercase tracking-widest">{item.type}</p>
                      </div>
                    ))}
                    <button className="p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-white transition-all">
                      <Plus size={24} className="mb-2" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Ajouter</span>
                    </button>
                  </div>
                  <button className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Générer ma PWA</button>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Micro-Cours</h4>
                  <div className="space-y-4">
                    {[
                      { title: 'Variables en JS', time: '5 min', xp: 50 },
                      { title: 'Design de Bouton', time: '3 min', xp: 30 },
                      { title: 'Flexbox en 2 min', time: '2 min', xp: 20 }
                    ].map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                        <div className="flex items-center space-x-4">
                          <BookOpen className="text-purple-500" size={20} />
                          <div>
                            <p className="text-sm font-bold text-white">{c.title}</p>
                            <p className="text-[10px] text-gray-500">{c.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-emerald-500 font-black text-xs">+{c.xp} XP</span>
                          <ArrowRight className="text-gray-600 group-hover:text-white transition-all" size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TeenGenZSuite;
