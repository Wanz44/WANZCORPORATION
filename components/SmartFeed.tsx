import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Home, 
  Briefcase, 
  Heart, 
  Users, 
  MapPin, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Bell, 
  Loader2,
  ArrowRight,
  Plus,
  MoreHorizontal,
  Share2,
  Bookmark,
  Coffee,
  Building2,
  Utensils,
  Church,
  Star,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

type FeedTab = 'city' | 'pro' | 'life' | 'friends';

interface SmartFeedProps {
  userProfile: any;
}

const SmartFeed: React.FC<SmartFeedProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<FeedTab>('city');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // --- Mock Data ---
  const cityFeed = [
    { id: 1, type: 'place', name: 'Terrasse Le Gombe', category: 'Restaurant', distance: '500m', rating: 4.8, image: 'https://picsum.photos/seed/resto1/800/600', verified: true },
    { id: 2, type: 'event', name: 'Messe du Dimanche', category: 'Église', distance: '1.2km', time: '09:00', image: 'https://picsum.photos/seed/church1/800/600' },
    { id: 3, type: 'place', name: 'Bandal Station', category: 'Loisirs', distance: '2.5km', rating: 4.5, image: 'https://picsum.photos/seed/loisir1/800/600' }
  ];

  const proFeed = [
    { id: 1, type: 'job', title: 'Développeur React Senior', company: 'Tech Hub Kin', salary: '2.500$', tags: ['#React', '#NodeJS'], match: 98 },
    { id: 2, type: 'mission', title: 'Audit Sécurité Réseau', company: 'Banque Centrale', duration: '3 mois', tags: ['#Cyber', '#Audit'], match: 85 },
    { id: 3, type: 'tool', title: 'Générateur de Factures Pro', category: 'Outil WANZCORP', description: 'Déjà configuré avec ton logo.', icon: <Briefcase size={24} /> }
  ];

  const lifeFeed = [
    { id: 1, type: 'health', title: 'Calculateur de Macros', status: 'Prêt', value: '2500 kcal/jour', icon: <Zap size={24} /> },
    { id: 2, type: 'family', title: 'Agenda Partagé', status: 'Nouveau', value: 'Dîner chez les parents à 19h', icon: <Heart size={24} /> },
    { id: 3, type: 'private', title: 'Coffre-fort Chiffré', status: 'Sécurisé', value: '12 documents protégés', icon: <ShieldCheck size={24} /> }
  ];

  const friendsFeed = [
    { id: 1, name: 'Marc L.', profession: 'Entrepreneur', distance: '300m', common: 'Football, Tech', match: 94, verified: true },
    { id: 2, name: 'Sarah B.', profession: 'Designer', distance: '800m', common: 'Art, Musique', match: 88, verified: false },
    { id: 3, name: 'Patrick J.', profession: 'Ingénieur', distance: '1.5km', common: 'Tech, Fitness', match: 91, verified: true }
  ];

  // --- Logic: AI Insight ---
  const getAiInsight = async () => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `En tant qu'assistant social intelligent pour l'Afrique, analyse ce profil utilisateur : ${JSON.stringify(userProfile)} et l'onglet actuel "${activeTab}". Donne un conseil court et percutant (1 phrase) pour optimiser sa journée.`,
      });
      setAiInsight(result.text);
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  useEffect(() => {
    getAiInsight();
  }, [activeTab]);

  const tabs = [
    { id: 'city', name: 'Ma Ville', icon: <Building2 size={20} />, color: 'text-emerald-500' },
    { id: 'pro', name: 'Mon Pro', icon: <Briefcase size={20} />, color: 'text-brand-accent' },
    { id: 'life', name: 'Ma Vie', icon: <Heart size={20} />, color: 'text-pink-500' },
    { id: 'friends', name: 'Mes Amis', icon: <Users size={20} />, color: 'text-indigo-500' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* AI Insight Banner */}
      <AnimatePresence mode="wait">
        {aiInsight && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-brand-accent/10 border border-brand-accent/20 rounded-[2rem] flex items-center space-x-6"
          >
            <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-dark animate-pulse">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-1">Conseil IA du Jour</p>
              <p className="text-white text-sm font-medium italic">"{aiInsight}"</p>
            </div>
            <button onClick={() => setAiInsight(null)} className="text-gray-500 hover:text-white"><MoreHorizontal size={20} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FeedTab)}
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

      {/* Feed Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          {/* --- MA VILLE --- */}
          {activeTab === 'city' && cityFeed.map(item => (
            <div key={item.id} className="glass rounded-[3rem] overflow-hidden border border-white/10 group hover:border-emerald-500/50 transition-all">
              <div className="h-64 relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  {item.category}
                </div>
                {item.verified && (
                  <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>
              <div className="p-8 flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-black text-white mb-2">{item.name}</h4>
                  <div className="flex items-center space-x-4 text-gray-500 text-xs">
                    <span className="flex items-center space-x-1"><MapPin size={14} /> <span>{item.distance}</span></span>
                    {item.rating && <span className="flex items-center space-x-1 text-yellow-500"><Star size={14} /> <span>{item.rating}</span></span>}
                    {item.time && <span className="flex items-center space-x-1"><Clock size={14} /> <span>{item.time}</span></span>}
                  </div>
                </div>
                <button className="p-4 bg-emerald-500 text-white rounded-2xl hover:scale-110 transition-all">
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          ))}

          {/* --- MON PRO --- */}
          {activeTab === 'pro' && proFeed.map(item => (
            <div key={item.id} className="glass p-8 rounded-[2.5rem] border border-white/10 flex items-center justify-between group hover:border-brand-accent/50 transition-all">
              <div className="flex items-center space-x-8">
                <div className="w-20 h-20 bg-brand-accent/10 rounded-[1.5rem] flex items-center justify-center text-brand-accent">
                  {item.type === 'job' ? <Briefcase size={32} /> : item.type === 'mission' ? <TrendingUp size={32} /> : item.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-xl font-black text-white">{item.title}</h4>
                    {item.match && <span className="px-3 py-1 bg-brand-accent/20 text-brand-accent text-[8px] font-black rounded-full uppercase tracking-widest">Match {item.match}%</span>}
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{item.company || item.category}</p>
                  <div className="flex space-x-2">
                    {item.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{tag}</span>
                    ))}
                    {item.salary && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{item.salary}</span>}
                    {item.duration && <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.duration}</span>}
                  </div>
                </div>
              </div>
              <button className="px-8 py-4 bg-brand-accent text-brand-dark rounded-xl font-black text-[10px] uppercase tracking-widest">
                {item.type === 'tool' ? 'Ouvrir' : 'Postuler'}
              </button>
            </div>
          ))}

          {/* --- MA VIE --- */}
          {activeTab === 'life' && (
            <div className="grid md:grid-cols-2 gap-8">
              {lifeFeed.map(item => (
                <div key={item.id} className="glass p-10 rounded-[3rem] border border-white/10 space-y-6 group hover:border-pink-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
                      {item.icon}
                    </div>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{item.status}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm italic">"{item.value}"</p>
                  </div>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 transition-all">
                    Accéder
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* --- MES AMIS --- */}
          {activeTab === 'friends' && friendsFeed.map(item => (
            <div key={item.id} className="glass p-8 rounded-[2.5rem] border border-white/10 flex items-center justify-between group hover:border-indigo-500/50 transition-all">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white font-black text-2xl">
                    {item.name[0]}
                  </div>
                  {item.verified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-brand-dark border-4 border-brand-dark">
                      <UserCheck size={14} />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-xl font-black text-white">{item.name}</h4>
                    <span className="text-indigo-500 font-black text-[10px] uppercase tracking-widest">{item.match}% Match</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{item.profession} • {item.distance}</p>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Communs: {item.common}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="p-4 bg-white/5 rounded-xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all">
                  <MessageSquare size={20} />
                </button>
                <button className="p-4 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-20 h-20 bg-brand-accent text-brand-dark rounded-full shadow-2xl shadow-brand-accent/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <Plus size={32} />
      </button>
    </div>
  );
};

export default SmartFeed;
