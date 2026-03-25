import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings, User, Shield, HelpCircle, 
  LogOut, Moon, Bell, Bookmark, History,
  CreditCard, Users, Flag
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onLogout: () => void;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userProfile, onLogout, onViewChange }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-brand-dark border-r border-white/10 z-[101] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 flex items-center justify-center border border-brand-accent/30 overflow-hidden">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="text-brand-accent" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">{userProfile.name}</h3>
                    <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">Membre Pro</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Personnel</h4>
                  <div className="space-y-1">
                    <SidebarItem icon={<User size={18} />} label="Profil" onClick={() => { onViewChange('profile'); onClose(); }} />
                    <SidebarItem icon={<Bookmark size={18} />} label="Enregistrements" />
                    <SidebarItem icon={<History size={18} />} label="Historique des liens" />
                    <SidebarItem icon={<CreditCard size={18} />} label="Meta Pay" />
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Communauté</h4>
                  <div className="space-y-1">
                    <SidebarItem icon={<Users size={18} />} label="Groupes" badge="3" />
                    <SidebarItem icon={<Flag size={18} />} label="Pages" />
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Paramètres</h4>
                  <div className="space-y-1">
                    <SidebarItem icon={<Settings size={18} />} label="Paramètres & Confidentialité" onClick={() => { onViewChange('settings'); onClose(); }} />
                    <SidebarItem icon={<Shield size={18} />} label="Espace Comptes" />
                    <SidebarItem icon={<Moon size={18} />} label="Mode Sombre" />
                    <SidebarItem icon={<Bell size={18} />} label="Notifications" />
                  </div>
                </section>

                <section className="pt-4 border-t border-white/5">
                  <SidebarItem icon={<HelpCircle size={18} />} label="Aide et support" onClick={() => { onViewChange('support'); onClose(); }} />
                  <SidebarItem icon={<LogOut size={18} />} label="Se déconnecter" color="text-red-500" onClick={onLogout} />
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SidebarItem = ({ icon, label, badge, color = "text-gray-300", onClick }: { icon: React.ReactNode, label: string, badge?: string, color?: string, onClick?: () => void }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-all group">
    <div className="flex items-center space-x-4">
      <span className={`${color} group-hover:text-brand-accent transition-colors`}>{icon}</span>
      <span className={`text-sm font-bold ${color === 'text-red-500' ? 'text-red-500' : 'text-gray-300'} group-hover:text-white transition-colors`}>{label}</span>
    </div>
    {badge && (
      <span className="bg-brand-accent text-brand-dark text-[10px] font-black px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

export default Sidebar;
