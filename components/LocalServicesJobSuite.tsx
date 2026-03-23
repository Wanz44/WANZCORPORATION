import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Briefcase, 
  MapPin, 
  FileText, 
  Bell, 
  Smartphone, 
  Mic, 
  Plus, 
  Search, 
  CheckCircle2, 
  Wallet, 
  Truck, 
  Wrench, 
  BookOpen, 
  Globe, 
  QrCode, 
  Zap, 
  ArrowRight, 
  Loader2,
  Camera,
  Layers
} from 'lucide-react';

type ServiceTab = 'marketplace' | 'cv' | 'jobs' | 'micro';

const LocalServicesJobSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceTab>('marketplace');

  // --- Marketplace State ---
  const [services, setServices] = useState([
    { id: 1, title: 'Réparer une fuite d\'eau', provider: 'Jean M.', price: '15.000 FC', location: 'Bandal' },
    { id: 2, title: 'Cours de Maths (6ème)', provider: 'Sarah L.', price: '10.000 FC/h', location: 'Gombe' },
    { id: 3, title: 'Traduction Lingala/Français', provider: 'Patrick B.', price: '5.000 FC/page', location: 'Limete' }
  ]);

  // --- CV Builder State ---
  const [cvInput, setCvInput] = useState('');
  const [cvResult, setCvResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Job Board State ---
  const [jobAlerts, setJobAlerts] = useState([
    { id: 1, title: 'Chauffeur Poids Lourd', company: 'Logistics RDC', location: 'Kinshasa/Gombe', time: 'Il y a 2h' },
    { id: 2, title: 'Développeur React Native', company: 'Tech Hub', location: 'Remote', time: 'Il y a 5h' }
  ]);

  // --- Micro-Tasks State ---
  const [microTasks, setMicroTasks] = useState([
    { id: 1, title: 'Vérifier horaires boutique', reward: '500 FC', time: '2 min' },
    { id: 2, title: 'Photo article en rayon', reward: '1.200 FC', time: '5 min' },
    { id: 3, title: 'Enregistrement Lingala', reward: '2.000 FC', time: '10 min' }
  ]);

  // --- Logic: CV Builder AI ---
  const buildCV = async () => {
    if (!cvInput.trim()) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `Transforme ces informations en un CV professionnel structuré avec des mots-clés pertinents pour les recruteurs : "${cvInput}".`,
      });
      setCvResult(result.text);
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  const tabs = [
    { id: 'marketplace', name: 'Services Locaux', icon: <Wrench size={20} />, color: 'text-brand-accent' },
    { id: 'cv', name: 'CV Builder', icon: <FileText size={20} />, color: 'text-indigo-500' },
    { id: 'jobs', name: 'Job Board', icon: <Bell size={20} />, color: 'text-emerald-500' },
    { id: 'micro', name: 'Micro-Tâches', icon: <Smartphone size={20} />, color: 'text-purple-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ServiceTab)}
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
          {/* --- MARKETPLACE DE SERVICES --- */}
          {activeTab === 'marketplace' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-white">Services de Proximité</h3>
                <button className="px-6 py-3 bg-brand-accent text-brand-dark rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Devenir Prestataire</span>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {services.map(service => (
                  <div key={service.id} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6 group hover:border-brand-accent/50 transition-all">
                    <div className="w-12 h-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent">
                      {service.title.includes('fuite') ? <Wrench size={24} /> : service.title.includes('Maths') ? <BookOpen size={24} /> : <Globe size={24} />}
                    </div>
                    <div>
                      <h4 className="text-white font-black">{service.title}</h4>
                      <p className="text-xs text-gray-500">{service.provider} • {service.location}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-lg font-black text-white">{service.price}</span>
                      <button className="p-3 bg-white/5 rounded-xl text-brand-accent hover:bg-brand-accent hover:text-brand-dark transition-all">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Wallet className="text-emerald-500" size={32} />
                  <div>
                    <h4 className="text-xl font-black text-white">Paiement Mobile Money</h4>
                    <p className="text-gray-400 text-sm">Orange Money, Airtel Money, M-Pesa. L'argent est bloqué jusqu'à validation.</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500 font-black">OM</div>
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-red-500 font-black">AM</div>
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 font-black">MP</div>
                </div>
              </div>
            </div>
          )}

          {/* --- CV BUILDER UNIVERSEL --- */}
          {activeTab === 'cv' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center space-x-4">
                    <Mic className="text-indigo-500" size={32} />
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Assistant CV Audio</h4>
                  </div>
                  <p className="text-gray-500 text-sm">Parle de tes talents, l'IA s'occupe de la rédaction professionnelle.</p>
                  <div className="space-y-4">
                    <textarea 
                      value={cvInput}
                      onChange={(e) => setCvInput(e.target.value)}
                      placeholder="Ex: Je sais conduire des camions et je fais de la mécanique légère..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-indigo-500 h-40 resize-none"
                    />
                    <button 
                      onClick={buildCV}
                      disabled={isProcessing}
                      className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><span>Générer mon CV PDF</span> <Zap size={16} /></>}
                    </button>
                  </div>
                </div>

                <div className="p-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Aperçu & Carte Numérique</h4>
                  {cvResult ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">
                        {cvResult}
                      </div>
                      <div className="p-6 bg-white/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <QrCode className="text-white" size={48} />
                          <div>
                            <p className="text-white font-black">Carte de Visite</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Scan pour contact</p>
                          </div>
                        </div>
                        <button className="p-3 bg-white/5 rounded-xl text-white"><Smartphone size={20} /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 text-gray-600">
                      <FileText size={48} />
                      <p className="text-xs font-black uppercase tracking-widest">En attente de tes infos...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- JOB BOARD PUSH --- */}
          {activeTab === 'jobs' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-white">Opportunités Immédiates</h3>
                <div className="flex items-center space-x-2 text-emerald-500">
                  <Bell className="animate-pulse" size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Alertes Actives</span>
                </div>
              </div>

              <div className="space-y-6">
                {jobAlerts.map(job => (
                  <div key={job.id} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/50 transition-all">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Briefcase size={32} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">{job.title}</h4>
                        <p className="text-gray-500 text-sm">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-6">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{job.time}</span>
                      <button className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Postuler</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-center space-y-6">
                <h4 className="text-xl font-black text-white uppercase tracking-widest">Configuration des Alertes</h4>
                <div className="flex flex-wrap gap-4 justify-center">
                  <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white text-xs font-black">Chauffeur</span>
                  <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white text-xs font-black">Kinshasa/Gombe</span>
                  <span className="px-6 py-3 bg-emerald-500 text-white rounded-full text-xs font-black flex items-center space-x-2">
                    <Smartphone size={14} />
                    <span>WhatsApp</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* --- MICRO-TÂCHES DIGITALES --- */}
          {activeTab === 'micro' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Missions Disponibles</h4>
                  <div className="space-y-4">
                    {microTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                            {task.title.includes('Photo') ? <Camera size={20} /> : task.title.includes('horaires') ? <Layers size={20} /> : <Mic size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{task.title}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{task.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-500 font-black">{task.reward}</p>
                          <button className="text-[8px] font-black text-purple-500 uppercase tracking-widest mt-1">Accepter</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-purple-500/10 border border-purple-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-purple-500/40">
                    <Wallet size={48} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Mon Portefeuille</h4>
                    <p className="text-gray-400 text-sm">Gagnez des revenus complémentaires avec votre smartphone.</p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 w-full">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Solde Cumulé</p>
                    <p className="text-4xl font-black text-white">8.400 FC</p>
                  </div>
                  <button className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Retirer mes gains</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LocalServicesJobSuite;
