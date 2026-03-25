import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Edit3, Grid, Bookmark, 
  Users, MapPin, Calendar, Link as LinkIcon,
  CheckCircle, ShieldCheck, Zap, X, Camera, Save
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: any;
  onUpdateProfile?: (updated: any) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editedProfile);
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      {/* Profile Header */}
      <div className="relative mb-24">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 rounded-[3rem] overflow-hidden border border-white/10 relative group">
          <img 
            src="https://picsum.photos/seed/cover/1200/400" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
          <button className="absolute bottom-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-2xl text-white hover:bg-brand-accent hover:text-brand-dark transition-all">
            <Edit3 size={18} />
          </button>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute -bottom-16 left-8 flex flex-col md:flex-row md:items-end md:space-x-8 space-y-4 md:space-y-0">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-brand-dark border-4 border-brand-dark overflow-hidden shadow-2xl">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-accent rounded-2xl flex items-center justify-center border-4 border-brand-dark text-brand-dark">
              <CheckCircle size={20} fill="currentColor" />
            </div>
          </div>
          <div className="pb-2">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{userProfile.name}</h2>
              <ShieldCheck size={20} className="text-brand-accent" />
            </div>
            <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <div className="flex items-center space-x-2">
                <Users size={14} className="text-brand-accent" />
                <span>1.2K Relations</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-brand-accent" />
                <span>{userProfile.location || 'Kinshasa, RDC'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-brand-accent" />
                <span>Inscrit en 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
        <button 
          onClick={() => setIsEditing(true)}
          className="px-8 py-4 bg-brand-accent text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl shadow-brand-accent/20"
        >
          Modifier le profil
        </button>
        <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all transform hover:-translate-y-1">
          Partager le profil
        </button>
        <button className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all">
          <Settings size={20} />
        </button>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Modifier le profil</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center mb-8">
                  <div className="relative group cursor-pointer">
                    <img src={editedProfile.avatar} alt="Avatar" className="w-24 h-24 rounded-[2rem] border-2 border-brand-accent object-cover" />
                    <div className="absolute inset-0 bg-brand-dark/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Nom complet</label>
                  <input 
                    type="text" 
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-brand-accent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Profession</label>
                  <input 
                    type="text" 
                    value={editedProfile.profession || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, profession: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-brand-accent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Localisation</label>
                  <input 
                    type="text" 
                    value={editedProfile.location || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-brand-accent transition-all"
                  />
                </div>
              </div>

              <div className="mt-10 flex space-x-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-brand-accent text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-accent/20"
                >
                  <Save size={16} />
                  <span>Enregistrer</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Content Tabs */}
      <div className="flex items-center space-x-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        <ProfileTab icon={<Grid size={18} />} label="Publications" active />
        <ProfileTab icon={<Bookmark size={18} />} label="Enregistrements" />
        <ProfileTab icon={<Zap size={18} />} label="Outils IA" />
        <ProfileTab icon={<Users size={18} />} label="Groupes" />
      </div>

      {/* Bio & Details */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Bio</h3>
            <p className="text-sm text-gray-300 leading-relaxed italic mb-6">
              "Passionné par l'innovation technologique et le design futuriste. Je construis le futur avec WANZCORP."
            </p>
            <div className="flex items-center space-x-3 text-brand-accent">
              <LinkIcon size={14} />
              <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:underline">wanzcorp.com/profile</a>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Compétences IA</h3>
            <div className="flex flex-wrap gap-2">
              {['Prompt Engineering', 'Automation', 'Data Science', 'UI Design'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[8px] font-black uppercase tracking-widest rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 group relative">
                <img 
                  src={`https://picsum.photos/seed/post${i}/400/400`} 
                  alt={`Post ${i}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Zap size={32} className="text-brand-dark" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`flex items-center space-x-3 pb-4 border-b-2 transition-all whitespace-nowrap ${active ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-white'}`}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default ProfileView;
