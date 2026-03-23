import React from 'react';
import Logo from '../Logo';
import { LogOut, User } from 'lucide-react';
import { auth } from '../../firebase';

interface NavbarProps {
  userProfile?: any;
  onOnboardingTrigger?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userProfile, onOnboardingTrigger }) => (
  <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Logo size={40} className="rounded-xl" />
        <span className="text-2xl font-black tracking-tighter text-white">WANZCORP</span>
      </div>
      <div className="hidden md:flex items-center space-x-10">
        {['Services', 'Outils', 'Templates', 'Offres'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-accent transition-colors">{item}</a>
        ))}
        
        {userProfile ? (
          <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
            <div className="flex items-center space-x-3">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-8 h-8 rounded-full border border-brand-accent object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{userProfile.name}</span>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOnboardingTrigger}
            className="px-6 py-2.5 bg-brand-accent text-brand-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-accent/20"
          >
            Se Connecter
          </button>
        )}
      </div>
    </div>
  </nav>
);

export default Navbar;
