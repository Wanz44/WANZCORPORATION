import React from 'react';
import Logo from '../Logo';
import { LogOut, User, Search, Bell, MessageCircle, Home, Briefcase, Layout, Zap, Users } from 'lucide-react';
import { auth } from '../../firebase';

interface NavbarProps {
  userProfile: any;
  onOnboardingTrigger: () => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onNavigate: (view: 'feed' | 'tools' | 'video' | 'marketplace' | 'profile', tab?: string) => void;
  onOpenSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userProfile, onOnboardingTrigger, onOpenChat, onOpenNotifications, onNavigate, onOpenSidebar }) => (
  <div className="fixed top-0 left-0 w-full z-50">
    {/* Desktop Navbar */}
    <nav className="hidden md:block max-w-7xl mx-auto glass border border-white/10 px-8 py-4 rounded-[2rem] mt-6 mx-6 shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { onNavigate('feed', 'city'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Logo size={40} className="rounded-xl" />
            <span className="text-2xl font-black tracking-tighter text-white">WANZCORP</span>
          </div>
          
          <div className="flex items-center relative group">
            <Search className="absolute left-4 text-gray-500 group-focus-within:text-brand-accent transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher sur WANZCORP..." 
              className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-brand-accent focus:bg-white/10 transition-all w-64 xl:w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-8">
          {userProfile && (
            <div className="flex items-center space-x-6 pr-6 border-r border-white/10">
              <button 
                onClick={() => onNavigate('feed', 'city')}
                className="p-2 text-gray-400 hover:text-brand-accent transition-colors relative group" title="Accueil"
              >
                <Home size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-brand-dark border border-white/10 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Accueil</span>
              </button>
              <button 
                onClick={() => onNavigate('feed', 'pro')}
                className="p-2 text-gray-400 hover:text-brand-accent transition-colors relative group" title="Services"
              >
                <Briefcase size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-brand-dark border border-white/10 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Services</span>
              </button>
              <button 
                onClick={() => onNavigate('tools')}
                className="p-2 text-gray-400 hover:text-brand-accent transition-colors relative group" title="Outils"
              >
                <Layout size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-brand-dark border border-white/10 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Outils</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-brand-accent transition-colors relative group" title="Offres">
                <Zap size={20} />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-brand-dark border border-white/10 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Offres</span>
              </button>
            </div>
          )}

          {userProfile ? (
            <div className="flex items-center space-x-4">
              <button 
                onClick={onOpenChat}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-brand-accent rounded-xl transition-all relative"
              >
                <MessageCircle size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-dark"></span>
              </button>
              
              <button 
                onClick={onOpenNotifications}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-brand-accent rounded-xl transition-all relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-dark"></span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-9 h-9 rounded-full border border-brand-accent object-cover cursor-pointer hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => auth.signOut()}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-8">
                {['Services', 'Outils', 'Templates', 'Offres'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-accent transition-colors">{item}</a>
                ))}
              </div>
              <button 
                onClick={onOnboardingTrigger}
                className="px-6 py-2.5 bg-brand-accent text-brand-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-accent/20"
              >
                Se Connecter
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>

    {/* Mobile Facebook-style Header */}
    <div className="md:hidden bg-brand-dark border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('feed', 'city')}>
        <Logo size={32} className="rounded-lg" />
        <span className="text-xl font-black tracking-tighter text-white">WANZCORP</span>
      </div>
      <div className="flex items-center space-x-3">
        <button className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <Search size={18} />
        </button>
        <button 
          onClick={onOpenChat}
          className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors relative"
        >
          <MessageCircle size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-accent rounded-full border border-brand-dark"></span>
        </button>
        <button 
          onClick={onOpenSidebar}
          className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <Layout size={18} />
        </button>
      </div>
    </div>

    {/* Mobile Facebook-style Tab Bar */}
    {userProfile && (
      <div className="md:hidden bg-brand-dark border-b border-white/5 flex items-center justify-around py-1">
        <button 
          onClick={() => onNavigate('feed', 'city')}
          className="flex-1 py-3 flex flex-col items-center justify-center text-brand-accent border-b-2 border-brand-accent"
        >
          <Home size={22} />
        </button>
        <button 
          onClick={() => onNavigate('video')}
          className="flex-1 py-3 flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <Zap size={22} />
        </button>
        <button 
          onClick={() => onNavigate('marketplace')}
          className="flex-1 py-3 flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <Briefcase size={22} />
        </button>
        <button 
          onClick={() => onNavigate('profile')}
          className="flex-1 py-3 flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors"
        >
          <User size={22} />
        </button>
        <button 
          onClick={onOpenNotifications}
          className="flex-1 py-3 flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors relative"
        >
          <Bell size={22} />
          <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-red-500 text-[8px] font-black text-white rounded-full flex items-center justify-center border border-brand-dark">3</span>
        </button>
      </div>
    )}
  </div>
);

export default Navbar;
