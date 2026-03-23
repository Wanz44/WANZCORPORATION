import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  TrendingUp, 
  Dumbbell, 
  Wallet, 
  Home, 
  CheckCircle2, 
  Clock, 
  Target, 
  MessageSquare, 
  Users, 
  Zap, 
  Moon, 
  Coffee, 
  PieChart, 
  ShieldAlert, 
  Truck, 
  Baby, 
  Wrench,
  Plus,
  Trash2,
  ChevronRight,
  BarChart3,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

type PerformanceTab = 'career' | 'health' | 'finance' | 'family';

const PerformanceGrowthSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PerformanceTab>('career');

  // --- Career State ---
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Finaliser le rapport Lex Holding', priority: true, done: false },
    { id: 2, text: 'Appel partenaire logistique', priority: false, done: false }
  ]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Health State ---
  const [macros, setMacros] = useState({ weight: 80, height: 180, goal: 'bulk' });
  const [macroResult, setMacroResult] = useState<any>(null);
  const [workoutLog, setWorkoutLog] = useState<any[]>([]);

  // --- Finance State ---
  const [assets, setAssets] = useState([
    { id: 1, name: 'Immobilier (Gombe)', value: 150000, type: 'Real Estate' },
    { id: 2, name: 'Parts Lex Holding', value: 50000, type: 'Business' },
    { id: 3, name: 'Bitcoin', value: 12000, type: 'Crypto' }
  ]);
  const [runway, setRunway] = useState({ savings: 20000, expenses: 2500 });

  // --- Family State ---
  const [maintenance, setMaintenance] = useState([
    { id: 1, task: 'Vidange Groupe Électrogène', due: 'Dans 5 jours', icon: <Zap size={16} /> },
    { id: 2, task: 'Vérification Toiture', due: 'Avril 2026', icon: <Home size={16} /> },
    { id: 3, task: 'Assurance Véhicule', due: '30 Mars', icon: <ShieldAlert size={16} /> }
  ]);

  // --- Logic: Timer ---
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // --- Logic: Macros ---
  const calculateMacros = () => {
    const bmr = 10 * macros.weight + 6.25 * macros.height - 5 * 30 + 5; // Simplified Mifflin-St Jeor
    const tdee = bmr * 1.55; // Moderate activity
    const target = macros.goal === 'bulk' ? tdee + 500 : tdee - 500;
    
    setMacroResult({
      calories: Math.ceil(target),
      protein: Math.ceil(macros.weight * 2.2),
      carbs: Math.ceil((target * 0.5) / 4),
      fats: Math.ceil((target * 0.25) / 9)
    });
  };

  const tabs = [
    { id: 'career', name: 'Carrière', icon: <TrendingUp size={20} />, color: 'text-brand-accent' },
    { id: 'health', name: 'Santé & Force', icon: <Dumbbell size={20} />, color: 'text-orange-500' },
    { id: 'finance', name: 'Patrimoine', icon: <Wallet size={20} />, color: 'text-emerald-500' },
    { id: 'family', name: 'Responsabilités', icon: <Home size={20} />, color: 'text-blue-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PerformanceTab)}
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
          {/* --- CAREER & PERFORMANCE --- */}
          {activeTab === 'career' && (
            <div className="space-y-10">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Project Tracker */}
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Focus du Jour</h4>
                    <div className="px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent font-black text-[10px] uppercase tracking-widest">
                      Deep Work
                    </div>
                  </div>

                  <div className="space-y-4">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.done ? 'bg-brand-accent border-brand-accent' : 'border-white/20'}`}>
                            {task.done && <CheckCircle2 size={14} className="text-brand-dark" />}
                          </button>
                          <span className={`text-sm font-medium ${task.done ? 'text-gray-600 line-through' : 'text-white'}`}>
                            {task.text}
                          </span>
                        </div>
                        {task.priority && <Zap size={16} className="text-brand-accent" />}
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Temps Écoulé</p>
                      <p className="text-4xl font-mono text-white tracking-tighter">{formatTime(timer)}</p>
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isTimerRunning ? 'bg-red-500 text-white' : 'bg-brand-accent text-brand-dark'}`}>
                        {isTimerRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                      </button>
                      <button onClick={() => { setTimer(0); setIsTimerRunning(false); }} className="w-14 h-14 bg-white/5 text-gray-400 rounded-full flex items-center justify-center hover:bg-white/10">
                        <RotateCcw size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Networking CRM */}
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Networking CRM</h4>
                  <div className="space-y-6">
                    {[
                      { name: 'Ya Joe', role: 'Partenaire Lex Holding', last: 'Il y a 2 mois', status: 'urgent' },
                      { name: 'Sarah M.', role: 'Directrice IT', last: 'Il y a 1 semaine', status: 'ok' },
                      { name: 'Patrick B.', role: 'Investisseur', last: 'Il y a 5 mois', status: 'urgent' }
                    ].map((contact, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-brand-accent/50 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white font-black">{contact.name[0]}</div>
                          <div>
                            <p className="text-white font-black">{contact.name}</p>
                            <p className="text-xs text-gray-500">{contact.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${contact.status === 'urgent' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {contact.status === 'urgent' ? 'Relancer' : 'À jour'}
                          </p>
                          <p className="text-[10px] text-gray-600">{contact.last}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10">
                    Ajouter un Contact Pro
                  </button>
                </div>
              </div>

              {/* Negotiation Simulator */}
              <div className="p-10 bg-brand-accent/5 border border-brand-accent/20 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-dark">
                    <MessageSquare size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">Simulateur de Négociation</h4>
                    <p className="text-gray-400 text-sm">Préparez vos arguments salariaux avec l'IA avant votre entretien annuel.</p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-brand-accent text-brand-dark rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Lancer Simulation
                </button>
              </div>
            </div>
          )}

          {/* --- HEALTH & STRENGTH --- */}
          {activeTab === 'health' && (
            <div className="space-y-10">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Macros Calculator */}
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Calculateur de Macros</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Poids (kg)</label>
                      <input type="number" value={macros.weight} onChange={(e) => setMacros({...macros, weight: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-orange-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Objectif</label>
                      <select value={macros.goal} onChange={(e) => setMacros({...macros, goal: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-orange-500 appearance-none">
                        <option value="bulk">Prise de Masse (+500)</option>
                        <option value="cut">Sèche (-500)</option>
                        <option value="maintain">Maintien</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={calculateMacros} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20">Calculer le Plan</button>
                  
                  {macroResult && (
                    <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/5">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Kcal</p>
                        <p className="text-xl font-black text-white">{macroResult.calories}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-emerald-500 uppercase mb-1">Prot</p>
                        <p className="text-xl font-black text-white">{macroResult.protein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-blue-500 uppercase mb-1">Gluc</p>
                        <p className="text-xl font-black text-white">{macroResult.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-yellow-500 uppercase mb-1">Lip</p>
                        <p className="text-xl font-black text-white">{macroResult.fats}g</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Workout Log */}
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Log d'Entraînement</h4>
                    <BarChart3 className="text-orange-500" size={20} />
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Développé Couché', sets: '4 x 10', weight: '85kg' },
                      { name: 'Squat', sets: '3 x 12', weight: '110kg' },
                      { name: 'Tractions', sets: '3 x Max', weight: 'PDC' }
                    ].map((ex, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-sm font-black text-white">{ex.name}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-gray-500">{ex.sets}</span>
                          <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-lg text-[10px] font-black">{ex.weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">Nouvelle Séance</button>
                </div>
              </div>

              {/* Recovery Assistant */}
              <div className="p-10 bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
                    <Moon size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">Récupération & Sommeil</h4>
                    <p className="text-gray-400 text-sm">Optimisez votre testostérone naturelle et votre croissance musculaire.</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <Coffee className="text-yellow-500 mb-1" size={20} />
                    <span className="text-[8px] font-black text-gray-500 uppercase">Caféine</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="text-blue-500 mb-1" size={20} />
                    <span className="text-[8px] font-black text-gray-500 uppercase">Écran</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- FINANCE & PATRIMOINE --- */}
          {activeTab === 'finance' && (
            <div className="space-y-10">
              <div className="grid lg:grid-cols-3 gap-10">
                {/* Portfolio Tracker */}
                <div className="lg:col-span-2 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Mon Patrimoine</h4>
                    <PieChart className="text-emerald-500" size={20} />
                  </div>
                  <div className="space-y-4">
                    {assets.map(asset => (
                      <div key={asset.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                            {asset.type === 'Real Estate' ? <Home size={18} /> : asset.type === 'Business' ? <Zap size={18} /> : <TrendingUp size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{asset.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{asset.type}</p>
                          </div>
                        </div>
                        <span className="text-lg font-black text-white">${asset.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valeur Totale</span>
                    <span className="text-3xl font-black text-emerald-500">${assets.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Runway Calculator */}
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Runway Personnel</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Épargne Liquide ($)</label>
                      <input type="number" value={runway.savings} onChange={(e) => setRunway({...runway, savings: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Dépenses Mensuelles ($)</label>
                      <input type="number" value={runway.expenses} onChange={(e) => setRunway({...runway, expenses: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div className="p-8 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 text-center">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Sérénité Financière</p>
                    <p className="text-6xl font-black text-white tracking-tighter">{Math.floor(runway.savings / runway.expenses)}</p>
                    <p className="text-gray-500 text-xs mt-4 uppercase tracking-widest font-black">Mois de Survie</p>
                  </div>
                </div>
              </div>

              {/* Logistics Budget */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Truck className="text-brand-accent" size={32} />
                  <div>
                    <h4 className="text-xl font-black text-white">Optimiseur Logistique</h4>
                    <p className="text-gray-400 text-sm">Suivi carburant et maintenance pour flottes de véhicules.</p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20">
                  Ouvrir Power Query
                </button>
              </div>
            </div>
          )}

          {/* --- FAMILY & RESPONSIBILITIES --- */}
          {activeTab === 'family' && (
            <div className="space-y-10">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Maintenance Manager */}
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Maintenance Maison</h4>
                  <div className="space-y-4">
                    {maintenance.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-accent">
                            {item.icon}
                          </div>
                          <span className="text-sm font-black text-white">{item.task}</span>
                        </div>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{item.due}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">Ajouter une Tâche</button>
                </div>

                {/* Paternity Mentor */}
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center space-x-4">
                    <Baby className="text-blue-500" size={32} />
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Mentor de Paternité</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Étape Actuelle</p>
                      <p className="text-white font-medium italic">"L'enfant commence à explorer son environnement. Encouragez la motricité fine."</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Conseil</p>
                        <p className="text-xs text-white">Équilibre Vie Pro</p>
                      </button>
                      <button className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-all">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Santé</p>
                        <p className="text-xs text-white">Vaccins & Suivi</p>
                      </button>
                    </div>
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

export default PerformanceGrowthSuite;
