import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, 
  Camera, 
  Mic, 
  Lock, 
  Trophy, 
  Smile, 
  Gift, 
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
  ArrowRight,
  Image as ImageIcon,
  Star
} from 'lucide-react';

type LoveTab = 'memory' | 'challenge' | 'mood' | 'gift';

const YoungLoveSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LoveTab>('memory');

  // --- Memory State ---
  const [memories, setMemories] = useState([
    { id: 1, type: 'photo', url: 'https://picsum.photos/seed/love1/800/600', date: '2026-03-20', locked: false },
    { id: 2, type: 'voice', url: '#', date: '2027-03-23', locked: true }
  ]);

  // --- Challenge State ---
  const [challenges, setChallenges] = useState([
    { id: 1, name: 'Pique-nique au coucher du soleil', points: 50, done: true },
    { id: 2, name: 'Cuisiner un plat inconnu', points: 30, done: false },
    { id: 3, name: 'Rando de 5km', points: 40, done: false }
  ]);

  // --- Mood State ---
  const [moods, setMoods] = useState({ 
    Marc: { emoji: '😊', status: 'Heureux' }, 
    Léa: { emoji: '😴', status: 'Fatiguée' } 
  });

  // --- Gift State ---
  const [wishlist, setWishlist] = useState([
    { id: 1, item: 'Casque Bluetooth', price: '45.000 FC', reserved: true },
    { id: 2, item: 'Livre de Cuisine', price: '12.000 FC', reserved: false }
  ]);

  const tabs = [
    { id: 'memory', name: 'Memory Capsule', icon: <Camera size={20} />, color: 'text-pink-500' },
    { id: 'challenge', name: 'Challenge App', icon: <Trophy size={20} />, color: 'text-yellow-500' },
    { id: 'mood', name: 'Mood Tracker', icon: <Smile size={20} />, color: 'text-brand-accent' },
    { id: 'gift', name: 'Gift & Wishlist', icon: <Gift size={20} />, color: 'text-purple-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as LoveTab)}
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
          {/* --- MEMORY CAPSULE --- */}
          {activeTab === 'memory' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-white">Journal Intime Partagé</h3>
                <div className="flex space-x-4">
                  <button className="p-4 bg-pink-500 text-white rounded-2xl"><Camera size={24} /></button>
                  <button className="p-4 bg-white/10 text-white rounded-2xl"><Mic size={24} /></button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {memories.map(memory => (
                  <div key={memory.id} className={`relative bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 ${memory.locked ? 'blur-sm' : ''}`}>
                    {memory.locked ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
                        <Lock className="text-white mb-4" size={48} />
                        <p className="text-white font-black uppercase tracking-widest text-xs">Débloqué le {memory.date}</p>
                      </div>
                    ) : (
                      <>
                        <img src={memory.url} alt="Memory" className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
                        <div className="p-8">
                          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">{memory.date}</p>
                          <p className="text-xl text-white italic">"Notre premier pique-nique au bord du fleuve."</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CHALLENGE APP --- */}
          {activeTab === 'challenge' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest">Défis à deux</h4>
                  <div className="space-y-4">
                    {challenges.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.done ? 'bg-yellow-500 text-white' : 'bg-white/5 text-gray-600'}`}>
                            <Star size={20} />
                          </div>
                          <span className={`text-sm font-black ${c.done ? 'text-gray-600 line-through' : 'text-white'}`}>{c.name}</span>
                        </div>
                        <span className="text-xs font-black text-yellow-500">+{c.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-yellow-500/10 border border-yellow-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-yellow-500/40">
                    <Trophy size={48} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">Couple Explorateur</h4>
                    <p className="text-gray-400 text-sm">Niveau 4 • 120 / 200 XP</p>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[60%]" />
                  </div>
                  <button className="px-8 py-4 bg-yellow-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Voir Badges</button>
                </div>
              </div>
            </div>
          )}

          {/* --- MOOD TRACKER --- */}
          {activeTab === 'mood' && (
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Marc</p>
                  <div className="text-8xl">{moods.Marc.emoji}</div>
                  <p className="text-white font-black">{moods.Marc.status}</p>
                </div>
                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Léa</p>
                  <div className="text-8xl">{moods.Léa.emoji}</div>
                  <p className="text-white font-black">{moods.Léa.status}</p>
                </div>
              </div>

              <div className="p-10 bg-brand-accent/10 border border-brand-accent/20 rounded-[2.5rem] flex items-center space-x-8">
                <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-dark">
                  <Zap size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">Conseil IA</h4>
                  <p className="text-gray-400 text-sm italic">"Léa semble un peu fatiguée aujourd'hui, pourquoi ne pas lui envoyer une playlist relaxante ou lui proposer un massage ?"</p>
                </div>
              </div>
            </div>
          )}

          {/* --- GIFT & WISHLIST --- */}
          {activeTab === 'gift' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">Ma Liste de Souhaits</h4>
                    <button className="p-3 bg-purple-500 text-white rounded-xl"><Plus size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    {wishlist.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div>
                          <p className="text-sm font-black text-white">{item.item}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.price}</p>
                        </div>
                        {item.reserved && <span className="text-[8px] bg-purple-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">RÉSERVÉ</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-purple-500/10 border border-purple-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6">
                  <Gift className="text-purple-500" size={64} />
                  <h4 className="text-2xl font-black text-white">Mode Surprise</h4>
                  <p className="text-gray-400 text-sm">Réservez un cadeau sans que votre partenaire ne le sache. La surprise reste entière !</p>
                  <button className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Voir la liste de Marc</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default YoungLoveSuite;
