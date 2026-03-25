import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import StatusStories from './StatusStories';
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
  UserCheck,
  Camera,
  X,
  Search,
  UserPlus,
  ExternalLink
} from 'lucide-react';

type FeedTab = 'city' | 'pro' | 'life' | 'friends';

interface SmartFeedProps {
  userProfile: any;
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  feedSubTab: 'home' | 'friends';
  onFeedSubTabChange: (tab: 'home' | 'friends') => void;
}

const SmartFeed: React.FC<SmartFeedProps> = ({ userProfile, activeTab, onTabChange, feedSubTab, onFeedSubTabChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiWriting, setIsAiWriting] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiInsightsCache, setAiInsightsCache] = useState<Record<string, string>>({});
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- Mock Data ---
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { name: 'Marc L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc', verified: true },
      content: 'Incroyable session de networking aujourd\'hui au Tech Hub Kin ! La tech congolaise est en pleine ébullition. 🚀',
      image: 'https://picsum.photos/seed/techkin/1200/800',
      likes: 124,
      comments: 18,
      time: 'Il y a 2h',
      category: 'Pro'
    },
    {
      id: 2,
      author: { name: 'Sarah B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', verified: false },
      content: 'Quelqu\'un a testé le nouveau menu chez Terrasse Le Gombe ? Les retours ont l\'air top ! 🍲',
      image: 'https://picsum.photos/seed/foodkin/1200/800',
      likes: 89,
      comments: 32,
      time: 'Il y a 5h',
      category: 'City'
    },
    {
      id: 3,
      author: { name: 'Patrick J.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick', verified: true },
      content: 'Nouveau projet WANZCORP lancé ! L\'automatisation des stocks pour les PME de Bandal est enfin là. Contactez-moi pour une démo.',
      likes: 256,
      comments: 45,
      time: 'Il y a 1j',
      category: 'Pro'
    }
  ]);

  const notifications = [
    { id: 1, type: 'like', user: 'Marc L.', content: 'a aimé votre publication', time: 'Il y a 5m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc' },
    { id: 2, type: 'comment', user: 'Sarah B.', content: 'a commenté: "Super projet !"', time: 'Il y a 15m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 3, type: 'connect', user: 'Patrick J.', content: 'souhaite se connecter avec vous', time: 'Il y a 1h', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick' },
  ];

  const suggestions = [
    { id: 1, name: 'Jean-Pierre M.', title: 'CEO @ KinTech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean', mutual: 12 },
    { id: 2, name: 'Amina K.', title: 'Product Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina', mutual: 8 },
    { id: 3, name: 'Robert T.', title: 'Fullstack Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', mutual: 15 },
  ];

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes - 1 } : p));
    } else {
      setLikedPosts([...likedPosts, postId]);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCreatePost = () => {
    if (!postText.trim() && !selectedFile) return;
    const newPost = {
      id: Date.now(),
      author: { name: userProfile.name, avatar: userProfile.avatar, verified: true },
      content: postText,
      image: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      likes: 0,
      comments: 0,
      time: 'À l\'instant',
      category: activeTab === 'city' ? 'City' : 'Pro'
    };
    setPosts([newPost, ...posts]);
    setPostText('');
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAiWrite = async () => {
    if (!postText.trim()) return;
    setIsAiWriting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `En tant qu'expert en communication sociale, améliore ce statut pour le rendre plus percutant et professionnel tout en gardant l'essence du message : "${postText}"`,
      });
      setPostText(result.text);
    } catch (e: any) {
      console.error("AI Writing Error:", e);
      if (e.message?.includes('429') || e.status === 'RESOURCE_EXHAUSTED') {
        // Fallback: simple capitalization and punctuation if AI fails
        const improved = postText.charAt(0).toUpperCase() + postText.slice(1) + (postText.endsWith('.') || postText.endsWith('!') || postText.endsWith('?') ? '' : '.');
        setPostText(improved);
        // Optionally show a small toast or hint that AI is busy
      }
    } finally {
      setIsAiWriting(false);
    }
  };

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
    if (!userProfile) return;
    
    // Check cache first to save quota
    if (aiInsightsCache[activeTab]) {
      setAiInsight(aiInsightsCache[activeTab]);
      return;
    }

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `En tant qu'assistant social intelligent pour l'Afrique, analyse ce profil utilisateur : ${JSON.stringify(userProfile)} et l'onglet actuel "${activeTab}". Donne un conseil court et percutant (1 phrase) pour optimiser sa journée.`,
      });
      
      const insight = result.text;
      setAiInsight(insight);
      setAiInsightsCache(prev => ({ ...prev, [activeTab]: insight }));
    } catch (e: any) { 
      console.error("AI Insight Error:", e);
      
      // Fallback insights based on tab ID
      const fallbacks: Record<string, string> = {
        'city': "Explorez les opportunités locales aujourd'hui pour renforcer votre réseau.",
        'pro': "C'est le moment idéal pour mettre à jour vos compétences et briller professionnellement.",
        'life': "Prenez un moment pour vous aujourd'hui, l'équilibre est la clé du succès.",
        'friends': "Un simple message peut raviver une amitié précieuse. Connectez-vous !"
      };
      
      const fallbackMsg = fallbacks[activeTab] || "Restez positif et productif, WANZCORP est à vos côtés.";
      setAiInsight(fallbackMsg);
      
      // Cache the fallback if it's a quota error to prevent repeated failing calls
      if (e.message?.includes('429') || e.status === 'RESOURCE_EXHAUSTED') {
        setAiInsightsCache(prev => ({ ...prev, [activeTab]: fallbackMsg }));
      }
    }
    finally { setIsProcessing(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getAiInsight();
    }, 500); // Debounce to prevent rapid tab switching from exhausting quota
    
    const handleOpenNotifs = () => setShowNotifications(true);
    window.addEventListener('open-notifications', handleOpenNotifs);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-notifications', handleOpenNotifs);
    };
  }, [activeTab]);

  const tabs = [
    { id: 'city', name: 'Ma Ville', icon: <Building2 size={20} />, color: 'text-emerald-500' },
    { id: 'pro', name: 'Mon Pro', icon: <Briefcase size={20} />, color: 'text-brand-accent' },
    { id: 'life', name: 'Ma Vie', icon: <Heart size={20} />, color: 'text-pink-500' },
    { id: 'friends', name: 'Mes Amis', icon: <Users size={20} />, color: 'text-indigo-500' },
  ];

  const [isLive, setIsLive] = useState(false);

  const handleStartLive = () => {
    setIsLive(true);
    setTimeout(() => {
      setIsLive(false);
      alert("La diffusion en direct est terminée (Simulation)");
    }, 5000);
  };

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handlePickLocation = () => {
    const loc = prompt("Où êtes-vous ? (Simulation)", "Kinshasa, RDC");
    if (loc) setSelectedLocation(loc);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-0 md:px-4">
      {isLive && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <div className="absolute top-10 left-10 flex items-center space-x-4">
            <div className="px-4 py-1 bg-red-600 text-white text-xs font-black rounded-full animate-pulse">EN DIRECT</div>
            <div className="text-white text-xs font-bold">00:05</div>
          </div>
          <div className="w-full h-full bg-gradient-to-b from-brand-dark to-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-brand-accent mx-auto mb-6 flex items-center justify-center">
                <Camera size={48} className="text-brand-accent" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Démarrage du flux...</h2>
              <p className="text-gray-500 text-sm mt-2">Préparez-vous à être vu par votre communauté.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLive(false)}
            className="absolute bottom-10 px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
          >
            Arrêter le direct
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8">
        
        {/* LEFT SIDEBAR: User Profile Summary */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img 
                src={userProfile.avatar} 
                alt="Avatar" 
                className="w-full h-full rounded-full border-4 border-brand-accent object-cover bg-brand-dark"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-brand-dark border-4 border-brand-dark">
                <UserCheck size={14} />
              </div>
            </div>
            <h3 className="text-xl font-black text-white">{userProfile.name}</h3>
            <p className="text-gray-500 text-xs mb-6">{userProfile.profession || 'Membre WANZCORP'}</p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div>
                <p className="text-white font-black text-lg">1.2k</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Amis</p>
              </div>
              <div>
                <p className="text-white font-black text-lg">45</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Outils</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-[2rem] border border-white/10">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Raccourcis</h4>
            <nav className="space-y-2">
              {[
                { icon: <TrendingUp size={18} />, name: 'Tendances', color: 'text-brand-accent' },
                { icon: <Bookmark size={18} />, name: 'Enregistrés', color: 'text-indigo-500' },
                { icon: <MessageSquare size={18} />, name: 'Messages', color: 'text-emerald-500' },
                { icon: <Bell size={18} />, name: 'Notifications', color: 'text-pink-500', action: () => setShowNotifications(true) },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={item.action}
                  className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <div className={`${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* CENTER COLUMN: Main Feed */}
        <div className="lg:col-span-6 space-y-4 md:space-y-8">
          
          {/* WhatsApp Style Stories */}
          <div className="px-4 md:px-0">
            <StatusStories userProfile={userProfile} />
          </div>

          {/* Feed Logic Toggle (Home vs Friends) */}
          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-2xl w-fit mx-auto md:mx-0">
            <button 
              onClick={() => onFeedSubTabChange('home')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${feedSubTab === 'home' ? 'bg-brand-accent text-brand-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Home (IA)
            </button>
            <button 
              onClick={() => onFeedSubTabChange('friends')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${feedSubTab === 'friends' ? 'bg-brand-accent text-brand-dark shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Amis
            </button>
          </div>

          {/* Create Post Area */}
          <div className="bg-brand-dark md:glass p-4 md:p-6 md:rounded-[2.5rem] border-b md:border border-white/5 md:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <img src={userProfile.avatar} alt="Me" className="w-10 h-10 rounded-full border border-brand-accent object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1 relative">
                <textarea 
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={`Quoi de neuf, ${userProfile.name.split(' ')[0]} ?`}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white text-sm focus:outline-none focus:border-brand-accent transition-all resize-none h-20"
                />
                {postText && (
                  <button 
                    onClick={handleAiWrite}
                    disabled={isAiWriting}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-brand-accent/20 text-brand-accent rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-brand-accent hover:text-brand-dark transition-all"
                  >
                    {isAiWriting ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />}
                    <span>Aide-moi à écrire</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex flex-1 justify-around md:justify-start md:space-x-8">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={handleStartLive}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
                >
                  <Camera size={18} className="text-red-500" />
                  <span className="text-[10px] font-bold">En direct</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center space-x-2 transition-colors py-1 px-2 rounded-lg hover:bg-white/5 ${selectedFile ? 'text-brand-accent' : 'text-gray-400 hover:text-white'}`}
                >
                  <Plus size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-bold">{selectedFile ? 'Photo ajoutée' : 'Photo'}</span>
                </button>
                <button 
                  onClick={handlePickLocation}
                  className={`flex items-center space-x-2 transition-colors py-1 px-2 rounded-lg hover:bg-white/5 ${selectedLocation ? 'text-brand-accent' : 'text-gray-400 hover:text-white'}`}
                >
                  <MapPin size={18} className="text-pink-500" />
                  <span className="text-[10px] font-bold">{selectedLocation || 'Lieu'}</span>
                </button>
              </div>
              <button 
                onClick={handleCreatePost}
                disabled={!postText.trim() && !selectedFile}
                className="px-6 py-2 bg-brand-accent text-brand-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-brand-accent/20"
              >
                Publier
              </button>
            </div>
          </div>

          {/* AI Insight Banner */}
          <div className="px-4 md:px-0">
            <AnimatePresence mode="wait">
              {aiInsight && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 md:p-6 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl md:rounded-[2rem] flex items-center space-x-4 md:space-x-6"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-accent rounded-xl md:rounded-2xl flex items-center justify-center text-brand-dark animate-pulse shrink-0">
                    <Zap size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-accent mb-1">Conseil IA du Jour</p>
                    <p className="text-white text-xs md:text-sm font-medium italic">"{aiInsight}"</p>
                  </div>
                  <button onClick={() => setAiInsight(null)} className="text-gray-500 hover:text-white shrink-0"><X size={18} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Navigation (Secondary Tabs) */}
          <div className="bg-brand-dark border-b border-white/5 md:bg-transparent md:border-none px-4 md:px-0 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 py-2 md:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as FeedTab)}
                  className={`px-4 py-2 rounded-full border transition-all flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/30' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className={activeTab === tab.id ? tab.color : 'text-gray-500'}>
                    {React.cloneElement(tab.icon as React.ReactElement<any>, { size: 16 })}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feed Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 md:space-y-8 pb-24"
            >
              {/* --- UNIFIED POSTS (Social Style) --- */}
              {activeTab === 'city' && posts.map(post => (
                <div key={post.id} className="bg-brand-dark md:glass md:rounded-[3rem] border-y md:border border-white/5 md:border-white/10 overflow-hidden group">
                  <div className="p-4 md:p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="relative">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-accent object-cover" referrerPolicy="no-referrer" />
                        {post.author.verified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-brand-accent rounded-full flex items-center justify-center text-brand-dark border-2 border-brand-dark">
                            <UserCheck size={8} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs md:text-sm font-black text-white">{post.author.name}</h4>
                        <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.time} • {post.category}</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white p-2"><MoreHorizontal size={18} /></button>
                  </div>
                  
                  <div className="px-4 md:px-8 pb-4">
                    <p className="text-gray-200 text-sm leading-relaxed">{post.content}</p>
                    
                    {/* Community Note Placeholder */}
                    {post.id === 1 && (
                      <div className="mt-4 p-4 bg-white/5 border-l-4 border-brand-accent rounded-r-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <ShieldCheck size={14} className="text-brand-accent" />
                          <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Note de la communauté</span>
                        </div>
                        <p className="text-[11px] text-gray-400 italic">Les lecteurs ont ajouté du contexte : Cet événement a été confirmé par les autorités locales comme l'un des plus grands rassemblements tech de l'année.</p>
                      </div>
                    )}
                  </div>

                  {post.image && (
                    <div className="relative aspect-video md:h-80 overflow-hidden">
                      <img src={post.image} alt="Post content" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <div className="p-3 md:p-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-4 md:space-x-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-colors group/btn py-2 px-3 rounded-lg hover:bg-white/5 ${likedPosts.includes(post.id) ? 'text-brand-accent' : 'text-gray-500 hover:text-brand-accent'}`}
                      >
                        <Heart size={18} className={likedPosts.includes(post.id) ? 'fill-brand-accent' : 'group-hover/btn:fill-brand-accent'} />
                        <span className="text-xs font-bold">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-emerald-500 transition-colors py-2 px-3 rounded-lg hover:bg-white/5">
                        <MessageSquare size={18} />
                        <span className="text-xs font-bold">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-500 transition-colors py-2 px-3 rounded-lg hover:bg-white/5">
                        <Share2 size={18} />
                      </button>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors p-2">
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {/* --- MA VILLE (Original) --- */}
              {activeTab === 'city' && cityFeed.map(item => (
                <div key={item.id} className="glass rounded-[3rem] overflow-hidden border border-white/10 group hover:border-emerald-500/50 transition-all">
                  <div className="h-64 relative overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-8 flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-black text-white mb-2">{item.name}</h4>
                      <div className="flex items-center space-x-4 text-gray-500 text-xs">
                        <span className="flex items-center space-x-1"><MapPin size={14} /> <span>{item.distance}</span></span>
                        {item.rating && <span className="flex items-center space-x-1 text-yellow-500"><Star size={14} /> <span>{item.rating}</span></span>}
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
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button className="p-4 bg-white/5 rounded-xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all">
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR: LinkedIn Style Suggestions & Trending */}
        <div className="hidden lg:block lg:col-span-3 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Suggestions Pro</h4>
              <button className="text-brand-accent"><ExternalLink size={14} /></button>
            </div>
            <div className="space-y-6">
              {suggestions.map((friend, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <img src={friend.avatar} alt="" className="w-12 h-12 rounded-xl border border-white/10" />
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white truncate">{friend.name}</p>
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest truncate">{friend.title}</p>
                      <p className="text-[7px] text-brand-accent font-black uppercase tracking-widest mt-1">{friend.mutual} relations communes</p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-brand-accent hover:text-brand-dark transition-all flex items-center justify-center space-x-2 group">
                    <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Se connecter</span>
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors border-t border-white/5 pt-6">
              Voir tout le réseau
            </button>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/10">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Tendances Kinshasa</h4>
            <div className="space-y-4">
              {[
                { tag: '#TechKin', count: '2.4k posts' },
                { tag: '#BandalStation', count: '1.8k posts' },
                { tag: '#WanzcorpLaunch', count: '1.2k posts' },
                { tag: '#GombeLife', count: '950 posts' },
              ].map((trend, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-xs font-bold text-white group-hover:text-brand-accent transition-colors">{trend.tag}</p>
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest">{trend.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center Modal */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md glass border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center space-x-3">
                  <Bell className="text-brand-accent" size={24} />
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Notifications</h3>
                </div>
                <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400">
                  <X size={24} />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 rounded-2xl hover:bg-white/5 flex items-center space-x-4 transition-colors cursor-pointer group">
                    <img src={notif.avatar} alt="" className="w-12 h-12 rounded-full border border-white/10" />
                    <div className="flex-1">
                      <p className="text-xs text-white">
                        <span className="font-black uppercase tracking-wider mr-1">{notif.user}</span>
                        <span className="text-gray-400">{notif.content}</span>
                      </p>
                      <p className="text-[8px] text-brand-accent font-black uppercase tracking-widest mt-1">{notif.time}</p>
                    </div>
                    <div className="w-2 h-2 bg-brand-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white/5 text-center">
                <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  Marquer tout comme lu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Mobile Only) */}
      <button className="lg:hidden fixed bottom-24 right-6 w-16 h-16 bg-brand-accent text-brand-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default SmartFeed;
