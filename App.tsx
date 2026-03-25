import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X,
  Search as SearchIcon,
  Settings,
  HelpCircle
} from 'lucide-react';
import SmartOnboarding from './components/SmartOnboarding';
import SmartFeed from './components/SmartFeed';
import ChatSystem from './components/ChatSystem';
import VideoFeed from './components/VideoFeed';
import Marketplace from './components/Marketplace';
import ProfileView from './components/ProfileView';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// UI Components
import Navbar from './components/ui/Navbar';
import Sidebar from './components/ui/Sidebar';
import Footer from './components/ui/Footer';
import FeedbackSystem from './components/ui/FeedbackSystem';

// Modals
import WhatsAppConfirmation from './components/modals/WhatsAppConfirmation';
import PricingOrderModal from './components/modals/PricingOrderModal';
import TemplatePurchaseModal from './components/modals/TemplatePurchaseModal';
import Logo from './components/Logo';

// Tools
import FileConverter from './components/tools/FileConverter';
import CVBuilder from './components/tools/CVBuilder';
import QuoteGenerator from './components/tools/QuoteGenerator';
import ClientPortal from './components/tools/ClientPortal';
import EcommerceCalculator from './components/tools/EcommerceCalculator';
import StockManager from './components/tools/StockManager';
import SportsDashboard from './components/tools/SportsDashboard';
import ScientificCalculator from './components/tools/ScientificCalculator';
import KnowledgeEngine from './components/tools/KnowledgeEngine';
import ResearchSuite from './components/tools/ResearchSuite';
import ElderlyCareSuite from './components/tools/ElderlyCareSuite';
import WomenEmpowermentSuite from './components/tools/WomenEmpowermentSuite';
import PerformanceGrowthSuite from './components/tools/PerformanceGrowthSuite';
import TeenGenZSuite from './components/tools/TeenGenZSuite';
import CouplesLogisticsSuite from './components/tools/CouplesLogisticsSuite';
import YoungLoveSuite from './components/tools/YoungLoveSuite';
import DatingSocialSuite from './components/tools/DatingSocialSuite';
import LocalServicesJobSuite from './components/tools/LocalServicesJobSuite';
import NeighborhoodSocialSuite from './components/tools/NeighborhoodSocialSuite';

// Constants & Types
import { SERVICES, TEMPLATES, PRICING_PLANS, ALL_TOOLS } from './constants';
import { Service, Template, PricingPlan, ServiceCategory } from './types';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [pendingWhatsAppUrl, setPendingWhatsAppUrl] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'landing' | 'feed' | 'tools' | 'video' | 'marketplace' | 'profile' | 'settings' | 'support'>('landing');
  const [feedSubTab, setFeedSubTab] = useState<'home' | 'friends'>('home');
  const [activeTab, setActiveTab] = useState<'city' | 'pro' | 'life' | 'friends'>('city');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          setViewMode('feed');
        } else {
          setShowOnboarding(true);
        }
      } else {
        setUserProfile(null);
        setViewMode('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return SERVICES;
    return SERVICES.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const personalizedTools = useMemo(() => {
    if (!userProfile || !userProfile.tags) return ALL_TOOLS;
    return ALL_TOOLS.filter(tool => 
      tool.tags.some(tag => userProfile.tags.includes(tag))
    );
  }, [userProfile]);

  const handleOnboardingComplete = (profile: any) => {
    setUserProfile(profile);
    setShowOnboarding(false);
    setViewMode('feed');
  };

  const handleUpdateProfile = async (updated: any) => {
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), updated);
        setUserProfile(updated);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserProfile(null);
      setViewMode('landing');
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOrderConfirm = (plan: PricingPlan) => {
    const message = `Bonjour WANZCORP, je souhaite commander le ${plan.name} (${plan.price}).`;
    const url = `https://wa.me/243825555555?text=${encodeURIComponent(message)}`;
    setPendingWhatsAppUrl(url);
    setSelectedPlan(null);
  };

  const handleTemplatePurchase = (template: Template) => {
    const message = `Bonjour WANZCORP, je souhaite acheter le template ${template.title} ($${template.price}).`;
    const url = `https://wa.me/243825555555?text=${encodeURIComponent(message)}`;
    setPendingWhatsAppUrl(url);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen selection:bg-brand-accent selection:text-brand-dark">
      <Navbar 
        userProfile={userProfile} 
        onOnboardingTrigger={() => setShowOnboarding(true)} 
        onOpenChat={() => setIsChatOpen(true)}
        onOpenNotifications={() => {
          if (viewMode === 'feed') {
            window.dispatchEvent(new CustomEvent('open-notifications'));
          } else {
            setViewMode('feed');
            setTimeout(() => window.dispatchEvent(new CustomEvent('open-notifications')), 100);
          }
        }}
        onNavigate={(view, tab) => {
          setViewMode(view as any);
          if (tab) setActiveTab(tab as any);
        }}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userProfile={userProfile} 
        onLogout={handleLogout}
        onViewChange={(view) => setViewMode(view as any)}
      />

      {showOnboarding && <SmartOnboarding onComplete={handleOnboardingComplete} />}

      {userProfile && (
        <ChatSystem 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          userProfile={userProfile} 
        />
      )}

      {/* Hero Section */}
      {viewMode === 'landing' && (
        <section id="home" className="relative pt-48 pb-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/20 blur-[150px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center animate-reveal-up">
            <div className="flex justify-center mb-12">
              <Logo size={120} className="rounded-[2.5rem] shadow-2xl shadow-brand-accent/20" />
            </div>
            <div className="inline-block px-4 py-1.5 mb-8 rounded-full glass border border-white/20 text-brand-accent text-xs font-bold tracking-widest uppercase animate-fade-in">
              L'excellence Digitale par WANZCORP
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-white leading-[0.9] perspective-1000">
              Créez le Futur <br />
              <span className="gradient-text">Sans Limite</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
              WANZCORP fusionne l'ingénierie logicielle de pointe et l'automatisation avancée pour propulser vos ambitions vers de nouveaux sommets.
            </p>
            <div className="flex flex-wrap justify-center gap-6 opacity-0 animate-reveal-up [animation-delay:600ms] [animation-fill-mode:forwards]">
              <button 
                onClick={() => setShowOnboarding(true)}
                className="group px-10 py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:bg-white transition-all transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,210,255,0.4)] active:scale-95"
              >
                <i className="fas fa-user-plus mr-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"></i> Créer mon compte intelligent
              </button>
              <a href="#contact" className="group px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all transform hover:-translate-y-2 active:scale-95">
                <i className="fas fa-rocket mr-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"></i> Démarrer un projet
              </a>
            </div>
            
            <div className="mt-24 relative max-w-5xl mx-auto opacity-0 animate-reveal-up [animation-delay:800ms] [animation-fill-mode:forwards]">
               <div className="glass rounded-[3rem] p-3 border border-white/10 shadow-2xl transform hover:rotate-0 transition-transform duration-1000 ease-expo-out rotate-2">
                  <img src="https://picsum.photos/1200/600?grayscale" alt="Dashboard" className="rounded-[2.5rem] opacity-40 grayscale hover:grayscale-0 transition-all duration-1000" />
               </div>
               <div className="absolute -bottom-12 -left-12 w-56 h-56 glass rounded-[2.5rem] p-8 border border-white/10 hidden md:flex flex-col justify-center animate-float shadow-2xl">
                  <i className="fas fa-terminal text-brand-accent text-5xl mb-4"></i>
                  <div className="text-sm font-extrabold text-white">Ingénierie Pure</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Standard WANZCORP</div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Feed Section */}
      {viewMode === 'feed' && userProfile && (
        <section className="pt-24 md:pt-48 pb-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden md:flex items-center justify-between mb-12">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-brand-accent/20 rounded-[2rem] flex items-center justify-center text-brand-accent border border-brand-accent/30 overflow-hidden">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <i className="fas fa-user-circle text-4xl"></i>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">Bienvenue, {userProfile.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile.tags?.map((tag: string, i: number) => (
                      <span key={i} className="text-[8px] font-black text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setViewMode('tools')}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                >
                  Mes Outils
                </button>
                <button className="p-4 bg-brand-accent text-brand-dark rounded-2xl shadow-xl shadow-brand-accent/20">
                  <i className="fas fa-cog"></i>
                </button>
              </div>
            </div>
            <SmartFeed 
              userProfile={userProfile} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              feedSubTab={feedSubTab}
              onFeedSubTabChange={setFeedSubTab}
            />
          </div>
        </section>
      )}

      {/* Video Section */}
      {viewMode === 'video' && userProfile && (
        <section className="pt-20 md:pt-24 h-screen overflow-hidden">
          <VideoFeed />
        </section>
      )}

      {/* Marketplace Section */}
      {viewMode === 'marketplace' && userProfile && (
        <section className="pt-24 md:pt-32 pb-20">
          <Marketplace />
        </section>
      )}

      {/* Profile Section */}
      {viewMode === 'profile' && userProfile && (
        <section className="pt-24 md:pt-32 pb-20">
          <ProfileView 
            userProfile={userProfile} 
            onUpdateProfile={handleUpdateProfile}
          />
        </section>
      )}

      {/* Settings Section */}
      {viewMode === 'settings' && userProfile && (
        <section className="pt-24 md:pt-32 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="glass p-8 rounded-[3rem] border border-white/10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent">
                  <Settings size={24} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Paramètres</h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Mode Sombre</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Activer le thème sombre</p>
                  </div>
                  <div className="w-12 h-6 bg-brand-accent rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-brand-dark rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Notifications</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gérer les alertes push</p>
                  </div>
                  <button className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Modifier</button>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Confidentialité</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Qui peut voir votre profil</p>
                  </div>
                  <button className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Gérer</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Support Section */}
      {viewMode === 'support' && userProfile && (
        <section className="pt-24 md:pt-32 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="glass p-8 rounded-[3rem] border border-white/10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent">
                  <HelpCircle size={24} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Aide & Support</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Centre d'aide</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Trouvez des réponses à vos questions</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Contactez-nous</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Support direct 24/7</p>
                </div>
              </div>

              <div className="p-6 bg-brand-accent/10 rounded-2xl border border-brand-accent/20">
                <h3 className="text-sm font-black text-brand-accent uppercase tracking-widest mb-2">Statut du système</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Tous les systèmes sont opérationnels</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {viewMode === 'landing' && (
        <section id="services" className="py-32 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-5xl font-black text-white mb-6">Solutions <span className="text-brand-accent">Haut de Gamme</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">Chaque ligne de code est optimisée pour la performance et l'évolutivité de votre business.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 transform active:scale-90 ${activeCategory === 'all' ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20' : 'glass border border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                Tout Voir
              </button>
              {Object.values(ServiceCategory).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 transform active:scale-90 ${activeCategory === cat ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20' : 'glass border border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredServices.map((service, idx) => (
                <div 
                  key={service.id} 
                  className="glass p-10 rounded-[2.5rem] text-left border border-white/10 group hover:-translate-y-4 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] transition-all duration-700 ease-expo-out opacity-0 animate-reveal-up"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500">
                    <i className={`fas ${service.icon} text-3xl text-brand-accent`}></i>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-accent transition-colors">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">{service.description}</p>
                  <div className="space-y-3">
                    {service.features.map((f, i) => (
                      <div key={i} className="flex items-center text-xs text-gray-300 transform group-hover:translate-x-1 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-3"></div> {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools Section */}
      {(viewMode === 'tools' || (viewMode === 'landing' && !activeTool)) && (
        <section id="tools" className="pt-24 md:pt-32 pb-32 bg-brand-dark/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              {viewMode === 'tools' && (
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <button onClick={() => setViewMode('feed')} className="text-gray-500 hover:text-white"><i className="fas fa-arrow-left"></i> Retour au flux</button>
                </div>
              )}
              <h2 className="text-5xl font-black text-white mb-6">Outils de <span className="text-brand-accent">Performance</span></h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
                {userProfile ? "Tes outils personnalisés selon ton profil intelligent." : "Des solutions intelligentes pour votre productivité quotidienne."}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
                {personalizedTools.map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => {
                      if (!userProfile) {
                        setShowOnboarding(true);
                      } else {
                        setActiveTool(tool.id);
                      }
                    }}
                    className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center space-y-3 group ${
                      activeTool === tool.id ? 'bg-brand-accent border-brand-accent text-brand-dark shadow-xl shadow-brand-accent/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 transition-transform group-hover:scale-110 ${
                      activeTool === tool.id ? 'bg-brand-dark/20' : tool.bg + ' ' + tool.color
                    }`}>
                      <i className={`fas ${tool.icon} text-xl`}></i>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {!activeTool ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 glass rounded-[3rem] border border-white/5 border-dashed"
                >
                  <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent mx-auto mb-6">
                    <i className="fas fa-tools text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">Sélectionnez un outil pour commencer</h3>
                  <p className="text-gray-500">Cliquez sur l'une des icônes ci-dessus pour activer l'utilitaire souhaité.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTool}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {activeTool === 'converter' && <FileConverter />}
                  {activeTool === 'cv' && <CVBuilder />}
                  {activeTool === 'quote' && <QuoteGenerator />}
                  {activeTool === 'portal' && <ClientPortal />}
                  {activeTool === 'ecommerce' && <EcommerceCalculator />}
                  {activeTool === 'stock' && <StockManager />}
                  {activeTool === 'sports' && <SportsDashboard />}
                  {activeTool === 'calculator' && <ScientificCalculator />}
                  {activeTool === 'knowledge' && <KnowledgeEngine />}
                  {activeTool === 'research' && <ResearchSuite />}
                  {activeTool === 'elderly' && <ElderlyCareSuite />}
                  {activeTool === 'women' && <WomenEmpowermentSuite />}
                  {activeTool === 'performance' && <PerformanceGrowthSuite />}
                  {activeTool === 'teenz' && <TeenGenZSuite />}
                  {activeTool === 'couples' && <CouplesLogisticsSuite />}
                  {activeTool === 'love' && <YoungLoveSuite />}
                  {activeTool === 'dating' && <DatingSocialSuite />}
                  {activeTool === 'services' && <LocalServicesJobSuite />}
                  {activeTool === 'social' && <NeighborhoodSocialSuite />}
                </motion.div>
              )}
            </AnimatePresence>

            <FeedbackSystem />
          </div>
        </section>
      )}

      {/* Templates Section */}
      {viewMode === 'landing' && (
        <section id="templates" className="py-32">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-6">Boutique <span className="gradient-text">Signature</span></h2>
              <p className="text-gray-400 text-lg">Des composants et architectures prêts pour la production.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {TEMPLATES.map((t, idx) => (
                <div 
                  key={t.id} 
                  className="glass rounded-[2.5rem] overflow-hidden border border-white/10 group hover:-translate-y-4 transition-all duration-700 ease-expo-out opacity-0 animate-reveal-up"
                  style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="h-56 bg-gradient-to-br from-brand-surface to-brand-dark flex items-center justify-center overflow-hidden relative">
                     <div className="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                     <i className={`fas ${t.icon} text-7xl text-brand-purple group-hover:scale-125 group-hover:rotate-6 transition-all duration-1000`}></i>
                  </div>
                  <div className="p-8">
                    <div className="text-[10px] text-brand-purple font-black mb-3 uppercase tracking-[0.2em]">{t.category}</div>
                    <h3 className="text-2xl font-black text-white mb-3">{t.title}</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">{t.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-white tracking-tighter">${t.price}</span>
                      <button 
                        onClick={() => setSelectedTemplate(t)}
                        className="px-6 py-3 bg-brand-purple/10 text-brand-purple font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-purple hover:text-white transition-all transform active:scale-95"
                      >
                        Acheter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {viewMode === 'landing' && (
        <section id="offres" className="py-32 bg-brand-accent/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-6">Nos <span className="text-brand-accent">Packs</span> Business</h2>
              <p className="text-gray-400 text-lg">Choisissez le catalyseur de votre réussite numérique.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {PRICING_PLANS.map((plan, idx) => (
                <div 
                  key={plan.id} 
                  className={`p-12 rounded-[3rem] text-left border transition-all duration-700 ease-expo-out hover:-translate-y-6 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] opacity-0 animate-reveal-up ${plan.isPremium ? 'bg-gradient-to-b from-brand-purple/20 to-brand-dark border-brand-purple/50' : 'glass border-white/10'}`}
                  style={{ animationDelay: `${idx * 200}ms`, animationFillMode: 'forwards' }}
                >
                  {plan.isPremium && <div className="inline-block px-4 py-1 bg-brand-purple text-white text-[10px] font-black rounded-full mb-8 tracking-[0.2em]">PLATINUM</div>}
                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <div className="text-5xl font-black text-white mb-6 tracking-tighter">{plan.price}</div>
                  <p className="text-sm text-gray-500 mb-10 h-12 leading-relaxed">{plan.description}</p>
                  <div className="space-y-5 mb-12">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-200">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                          <i className="fas fa-check text-[10px] text-green-400"></i>
                        </div> 
                        {f}
                      </div>
                    ))}
                    {plan.unavailableFeatures.map((f, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
                          <i className="fas fa-times text-[10px] text-red-400/50"></i>
                        </div> 
                        {f}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 ${plan.isPremium ? 'bg-brand-purple text-white shadow-xl shadow-brand-purple/20 hover:opacity-90' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    Commander le pack
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      {pendingWhatsAppUrl && (
        <WhatsAppConfirmation 
          url={pendingWhatsAppUrl} 
          onCancel={() => setPendingWhatsAppUrl(null)} 
        />
      )}

      {selectedPlan && !pendingWhatsAppUrl && (
        <PricingOrderModal 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          onConfirm={handleOrderConfirm} 
        />
      )}

      {selectedTemplate && !pendingWhatsAppUrl && (
        <TemplatePurchaseModal 
          template={selectedTemplate} 
          onClose={() => setSelectedTemplate(null)} 
          onConfirm={handleTemplatePurchase} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default App;
