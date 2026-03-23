import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, 
  Wallet, 
  CheckSquare, 
  Calendar, 
  Sparkles, 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageSquare, 
  TrendingUp, 
  Zap, 
  Bell, 
  Loader2,
  ArrowRight
} from 'lucide-react';

type CouplesTab = 'budget' | 'tasks' | 'date' | 'agenda';

const CouplesLogisticsSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CouplesTab>('budget');

  // --- Budget State ---
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Loyer', amount: 450000, payer: 'Marc' },
    { id: 2, name: 'Courses', amount: 120000, payer: 'Léa' },
    { id: 3, name: 'Électricité', amount: 50000, payer: 'Marc' }
  ]);
  const [revenues, setRevenues] = useState({ Marc: 1200000, Léa: 800000 });

  // --- Tasks State ---
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Vaisselle', points: 10, assigned: 'Léa', done: true },
    { id: 2, name: 'Cuisine', points: 20, assigned: 'Marc', done: false },
    { id: 3, name: 'Groupe Électrogène', points: 15, assigned: 'Marc', done: false }
  ]);

  // --- Date State ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [dateIdea, setDateIdea] = useState<string | null>(null);
  const [dailyQuestion, setDailyQuestion] = useState<string | null>(null);

  // --- Logic: Budget Pro-rata ---
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRevenue = revenues.Marc + revenues.Léa;
  const marcShare = (revenues.Marc / totalRevenue) * totalExpenses;
  const leaShare = (revenues.Léa / totalRevenue) * totalExpenses;
  const marcPaid = expenses.filter(e => e.payer === 'Marc').reduce((acc, curr) => acc + curr.amount, 0);
  const leaPaid = expenses.filter(e => e.payer === 'Léa').reduce((acc, curr) => acc + curr.amount, 0);

  // --- Logic: Date Generator ---
  const generateDateIdea = async () => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: "Propose une idée de rendez-vous originale pour un jeune couple à Kinshasa. Budget modéré. Inclus un restaurant spécifique ou une activité à la maison.",
      });
      setDateIdea(result.text);
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  const tabs = [
    { id: 'budget', name: 'Budget Commun', icon: <Wallet size={20} />, color: 'text-emerald-500' },
    { id: 'tasks', name: 'Tâches Ménagères', icon: <CheckSquare size={20} />, color: 'text-brand-accent' },
    { id: 'date', name: 'Date Night', icon: <Sparkles size={20} />, color: 'text-pink-500' },
    { id: 'agenda', name: 'Agenda Partagé', icon: <Calendar size={20} />, color: 'text-indigo-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CouplesTab)}
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
          {/* --- BUDGET COMMUN --- */}
          {activeTab === 'budget' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Dépenses Communes</h4>
                    <button className="p-3 bg-emerald-500 text-white rounded-xl"><Plus size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    {expenses.map(e => (
                      <div key={e.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500 font-black">{e.payer[0]}</div>
                          <div>
                            <p className="text-sm font-black text-white">{e.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Payé par {e.payer}</p>
                          </div>
                        </div>
                        <span className="text-lg font-black text-white">{e.amount.toLocaleString()} FC</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Répartition Équitable</h4>
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-black text-white">Marc</span>
                        <span className="text-xs text-gray-500">Doit payer {Math.ceil(marcShare).toLocaleString()} FC</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[60%]" />
                      </div>
                      <p className="text-[10px] text-emerald-500 font-black mt-2">A déjà payé {marcPaid.toLocaleString()} FC</p>
                    </div>
                    <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-black text-white">Léa</span>
                        <span className="text-xs text-gray-500">Doit payer {Math.ceil(leaShare).toLocaleString()} FC</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[40%]" />
                      </div>
                      <p className="text-[10px] text-emerald-500 font-black mt-2">A déjà payé {leaPaid.toLocaleString()} FC</p>
                    </div>
                  </div>
                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Règlement</p>
                    <p className="text-2xl font-black text-white">Léa doit {Math.ceil(leaShare - leaPaid).toLocaleString()} FC à Marc</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TASK MANAGER --- */}
          {activeTab === 'tasks' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Corvées de la Semaine</h4>
                  <div className="space-y-4">
                    {tasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => setTasks(tasks.map(task => task.id === t.id ? {...task, done: !task.done} : task))} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${t.done ? 'bg-brand-accent border-brand-accent' : 'border-white/20'}`}>
                            {t.done && <CheckCircle2 size={14} className="text-brand-dark" />}
                          </button>
                          <div>
                            <p className={`text-sm font-black ${t.done ? 'text-gray-600 line-through' : 'text-white'}`}>{t.name}</p>
                            <p className="text-[10px] text-gray-500">Assigné à {t.assigned}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-brand-accent">+{t.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Classement & Récompense</h4>
                  <div className="space-y-8">
                    <div className="flex items-end justify-around h-48 pt-10">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white font-black">L</div>
                        <div className="w-20 bg-emerald-500 rounded-t-2xl flex flex-col items-center justify-center py-4" style={{ height: '120px' }}>
                          <span className="text-white font-black">85</span>
                        </div>
                        <span className="text-xs font-black text-white">Léa</span>
                      </div>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white font-black">M</div>
                        <div className="w-20 bg-brand-accent rounded-t-2xl flex flex-col items-center justify-center py-4" style={{ height: '80px' }}>
                          <span className="text-brand-dark font-black">45</span>
                        </div>
                        <span className="text-xs font-black text-white">Marc</span>
                      </div>
                    </div>
                    <div className="p-8 bg-brand-accent/10 border border-brand-accent/20 rounded-[2rem] text-center">
                      <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2">Récompense Actuelle</p>
                      <p className="text-white font-black italic">"Le gagnant choisit le resto ce weekend !"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- DATE NIGHT GENERATOR --- */}
          {activeTab === 'date' && (
            <div className="flex flex-col items-center space-y-12">
              <div className="text-center">
                <h3 className="text-3xl font-black text-white mb-2">Surprends-nous</h3>
                <p className="text-gray-500">L'IA s'occupe de briser la routine.</p>
              </div>

              <button 
                onClick={generateDateIdea}
                disabled={isProcessing}
                className="w-72 h-72 rounded-full bg-pink-500 text-white flex flex-col items-center justify-center space-y-4 shadow-2xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={64} /> : <><Sparkles size={64} /> <span className="font-black uppercase tracking-widest text-xs">Générer Idée</span></>}
              </button>

              {dateIdea && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-2xl p-10 bg-white/5 border border-pink-500/30 rounded-[3rem] relative"
                >
                  <div className="absolute -top-6 left-10 w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white">
                    <Heart size={24} />
                  </div>
                  <p className="text-xl text-white leading-relaxed italic">"{dateIdea}"</p>
                </motion.div>
              )}

              <div className="w-full max-w-2xl p-10 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500">
                    <MessageSquare size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">Question du Jour</h4>
                    <p className="text-gray-400 text-sm">"Quel est ton plus beau souvenir de nous deux cette année ?"</p>
                  </div>
                </div>
                <button className="p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          )}

          {/* --- AGENDA PARTAGÉ --- */}
          {activeTab === 'agenda' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Événements Familiaux</h4>
                  <div className="space-y-4">
                    {[
                      { date: '25 Mars', event: 'Anniversaire Belle-Mère', type: 'Famille' },
                      { date: '28 Mars', event: 'Dîner chez les parents', type: 'Social' },
                      { date: '2 Avril', event: 'Échéance Loyer', type: 'Finance' }
                    ].map((ev, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex flex-col items-center justify-center text-indigo-500">
                            <span className="text-[10px] font-black uppercase">{ev.date.split(' ')[1]}</span>
                            <span className="text-sm font-black">{ev.date.split(' ')[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{ev.event}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{ev.type}</p>
                          </div>
                        </div>
                        <Bell className="text-gray-600" size={16} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center space-x-4">
                    <Zap className="text-indigo-500" size={32} />
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Temps pour Nous</h4>
                  </div>
                  <p className="text-gray-400 text-sm">L'IA a analysé vos agendas et trouvé des créneaux libres pour vous retrouver.</p>
                  <div className="space-y-4">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-white font-black">Vendredi Soir</p>
                        <p className="text-xs text-gray-500">Libre à partir de 19:00</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest">Réserver</button>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-white font-black">Dimanche Matin</p>
                        <p className="text-xs text-gray-500">Petit-déjeuner tardif</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest">Réserver</button>
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

export default CouplesLogisticsSuite;
