import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  User, 
  MapPin, 
  Briefcase, 
  Heart, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Zap,
  ShieldCheck,
  ChevronLeft,
  Camera,
  Info,
  LogIn,
  Mail,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Logo from './Logo';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  location: {
    neighborhood: string;
    city: string;
    province: string;
  };
  profession: string;
  interests: string[];
  objectives: string[];
  tags: string[];
}

interface SmartOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const SmartOnboarding: React.FC<SmartOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authMethod, setAuthMethod] = useState<'choice' | 'google' | 'email'>('choice');
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    interests: [],
    objectives: [],
    tags: [],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    location: {
      neighborhood: '',
      city: 'Kinshasa',
      province: 'Kinshasa'
    }
  });

  const totalSteps = 8;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingProfile = docSnap.data() as UserProfile;
        onComplete(existingProfile);
      } else {
        setProfile(prev => ({
          ...prev,
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          avatar: user.photoURL || prev.avatar
        }));
        setStep(1);
      }
    } catch (e: any) {
      console.error("Login Error:", e);
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    try {
      let user;
      if (emailMode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingProfile = docSnap.data() as UserProfile;
        onComplete(existingProfile);
      } else {
        setProfile(prev => ({
          ...prev,
          uid: user.uid,
          email: user.email || '',
          name: email.split('@')[0], // Default name from email
        }));
        setStep(1);
      }
    } catch (e: any) {
      console.error("Email Auth Error:", e);
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalize = async () => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";

      // Final AI Analysis to generate tags
      const analysisResult = await ai.models.generateContent({
        model,
        contents: `Analyse ce profil utilisateur et génère 5 tags intelligents (hashtags) pour personnaliser son expérience : Nom: ${profile.name}, Profession: ${profile.profession}, Intérêts: ${profile.interests?.join(', ')}, Objectifs: ${profile.objectives?.join(', ')}. Réponds uniquement par les tags séparés par des virgules.`,
      });

      const tags = analysisResult.text.split(',').map(t => t.trim());
      const finalProfile = { ...profile, tags } as UserProfile;
      
      // Save to Firestore
      if (finalProfile.uid) {
        await setDoc(doc(db, 'users', finalProfile.uid), finalProfile);
      }

      setProfile(finalProfile);
      setStep(7);
      
      setTimeout(() => {
        onComplete(finalProfile);
      }, 3000);
    } catch (e) {
      console.error(e);
      // Fallback tags
      const finalProfile = { ...profile, tags: ['#Innovation', '#Kinshasa', '#Tech'] } as UserProfile;
      onComplete(finalProfile);
    } finally {
      setIsProcessing(false);
    }
  };

  const commonInterests = [
    "Football", "Musique", "Tech", "Entrepreneuriat", "Fitness", "Cuisine", "Art", "Voyage", "Lecture", "Gaming"
  ];

  const commonObjectives = [
    "Trouver un emploi", "Réseautage Pro", "Améliorer mon couple", "Faire du sport", "Apprendre une langue", "Investir", "Sortir plus"
  ];

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  const toggleObjective = (objective: string) => {
    setProfile(prev => ({
      ...prev,
      objectives: prev.objectives?.includes(objective)
        ? prev.objectives.filter(o => o !== objective)
        : [...(prev.objectives || []), objective]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div 
            key="step_login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="space-y-10 text-center"
          >
            <div className="flex items-center justify-center mb-8 animate-bounce-slow">
              <Logo size={80} className="rounded-[2rem]" />
            </div>
            
            <AnimatePresence mode="wait">
              {authMethod === 'choice' && (
                <motion.div 
                  key="choice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">Bienvenue sur <span className="text-brand-accent">WANZCORP</span></h2>
                    <p className="text-gray-400 text-lg max-w-sm mx-auto">Connecte-toi pour accéder à tes outils intelligents et ton flux personnalisé.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={handleGoogleLogin}
                      disabled={isProcessing}
                      className="w-full py-6 bg-white text-brand-dark font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-4 shadow-2xl shadow-white/10 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                          <span>Continuer avec Google</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => setAuthMethod('email')}
                      className="w-full py-6 bg-white/5 border border-white/10 text-white font-black rounded-[2rem] hover:bg-white/10 transition-all flex items-center justify-center space-x-4"
                    >
                      <Mail size={20} />
                      <span>Utiliser un Email</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {authMethod === 'email' && (
                <motion.div 
                  key="email"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <button 
                    onClick={() => setAuthMethod('choice')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4"
                  >
                    <ArrowLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Retour</span>
                  </button>

                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white tracking-tighter">
                      {emailMode === 'signup' ? 'Créer un compte' : 'Se connecter'}
                    </h2>
                    <p className="text-gray-400 text-sm">Saisis tes informations pour continuer.</p>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white focus:border-brand-accent outline-none transition-all"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white focus:border-brand-accent outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs font-medium px-4">{error}</p>
                    )}

                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-6 bg-brand-accent text-brand-dark font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-4 shadow-2xl shadow-brand-accent/20 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <span>{emailMode === 'signup' ? 'Créer mon compte' : 'Se connecter'}</span>
                      )}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setEmailMode(emailMode === 'signup' ? 'login' : 'signup')}
                      className="w-full py-4 text-gray-500 hover:text-white transition-colors text-xs font-bold"
                    >
                      {emailMode === 'signup' ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="pt-8 flex items-center justify-center space-x-3 text-gray-600">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Connexion sécurisée par Firebase</span>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-8 group">
              <div className="absolute inset-0 bg-brand-accent/20 rounded-full blur-xl group-hover:bg-brand-accent/40 transition-all"></div>
              <img 
                src={profile.avatar} 
                alt="Avatar" 
                className="w-full h-full rounded-full border-4 border-brand-accent relative z-10 object-cover bg-brand-dark"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setProfile(prev => ({ ...prev, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` }))}
                className="absolute bottom-0 right-0 w-10 h-10 bg-brand-accent text-brand-dark rounded-full flex items-center justify-center z-20 hover:scale-110 transition-all shadow-xl"
              >
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Quel est ton nom ?</h2>
            <p className="text-gray-500">Utilise ton vrai nom pour que tes amis te reconnaissent.</p>
            <input 
              type="text"
              autoFocus
              value={profile.name || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ton nom complet"
              className="w-full bg-white/5 border-b-2 border-white/10 py-4 text-2xl text-white text-center focus:outline-none focus:border-brand-accent transition-all"
            />
            <button 
              disabled={!profile.name}
              onClick={nextStep}
              className="w-full py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-8"
            >
              Continuer
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center"
          >
            <h2 className="text-4xl font-black text-white tracking-tight">Parle-nous de toi</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Âge</label>
                <input 
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  placeholder="Ex: 25"
                  className="w-full bg-white/5 border-b-2 border-white/10 py-4 text-2xl text-white text-center focus:outline-none focus:border-brand-accent transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Genre</label>
                <div className="flex justify-center gap-4">
                  {['Homme', 'Femme', 'Autre'].map(g => (
                    <button
                      key={g}
                      onClick={() => setProfile(prev => ({ ...prev, gender: g }))}
                      className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${profile.gender === g ? 'bg-brand-accent text-brand-dark' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              disabled={!profile.age || !profile.gender}
              onClick={nextStep}
              className="w-full py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-8"
            >
              Continuer
            </button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
              <MapPin size={40} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Où habites-tu ?</h2>
            <div className="space-y-4">
              <input 
                type="text"
                value={profile.location?.neighborhood || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, location: { ...prev.location!, neighborhood: e.target.value } }))}
                placeholder="Ton quartier (ex: Lemba)"
                className="w-full bg-white/5 border-b-2 border-white/10 py-4 text-xl text-white text-center focus:outline-none focus:border-brand-accent transition-all"
              />
              <input 
                type="text"
                value={profile.location?.city || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, location: { ...prev.location!, city: e.target.value } }))}
                placeholder="Ta ville"
                className="w-full bg-white/5 border-b-2 border-white/10 py-4 text-xl text-white text-center focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
            <button 
              disabled={!profile.location?.neighborhood || !profile.location?.city}
              onClick={nextStep}
              className="w-full py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-8"
            >
              Continuer
            </button>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
              <Briefcase size={40} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Que fais-tu ?</h2>
            <p className="text-gray-500">Profession, études ou passion principale.</p>
            <input 
              type="text"
              value={profile.profession || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
              placeholder="Ex: Développeur, Étudiant, Commerçant"
              className="w-full bg-white/5 border-b-2 border-white/10 py-4 text-2xl text-white text-center focus:outline-none focus:border-brand-accent transition-all"
            />
            <button 
              disabled={!profile.profession}
              onClick={nextStep}
              className="w-full py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-8"
            >
              Continuer
            </button>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center"
          >
            <h2 className="text-4xl font-black text-white tracking-tight">Tes centres d'intérêt</h2>
            <p className="text-gray-500">Sélectionne ce qui te passionne.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {commonInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${profile.interests?.includes(interest) ? 'bg-brand-accent text-brand-dark border-brand-accent' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <button 
              disabled={profile.interests?.length === 0}
              onClick={nextStep}
              className="w-full py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-8"
            >
              Continuer
            </button>
          </motion.div>
        );
      case 6:
        return (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-purple mx-auto mb-4">
              <Target size={40} />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Tes objectifs</h2>
            <p className="text-gray-500">Que souhaites-tu accomplir sur WANZCORP ?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {commonObjectives.map(obj => (
                <button
                  key={obj}
                  onClick={() => toggleObjective(obj)}
                  className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${profile.objectives?.includes(obj) ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                >
                  {obj}
                </button>
              ))}
            </div>
            <button 
              disabled={profile.objectives?.length === 0 || isProcessing}
              onClick={handleFinalize}
              className="w-full py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-8 flex items-center justify-center space-x-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Analyse par IA...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Finaliser mon profil</span>
                </>
              )}
            </button>
          </motion.div>
        );
      case 7:
        return (
          <motion.div 
            key="step6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-brand-accent/20 rounded-full blur-2xl animate-pulse"></div>
              <img 
                src={profile.avatar} 
                alt="Avatar" 
                className="w-full h-full rounded-full border-4 border-brand-accent relative z-10 object-cover bg-brand-dark"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-accent text-brand-dark rounded-full flex items-center justify-center z-20 shadow-xl">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter">Profil Prêt !</h2>
            <p className="text-gray-400 text-lg">L'IA a configuré ton flux et tes outils personnalisés.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {profile.tags?.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-brand-accent/10 text-brand-accent text-[10px] font-black rounded-full uppercase tracking-widest border border-brand-accent/20">
                  {tag}
                </span>
              ))}
            </div>
            <div className="pt-12 flex items-center justify-center space-x-3 text-brand-accent">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sécurisé par WANZCORP Intelligence</span>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-brand-dark flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/10 blur-[120px] rounded-full animate-pulse-slow delay-1000"></div>
      </div>

      <div className="w-full max-w-xl relative">
        {/* Progress Bar */}
        {step > 0 && step < 7 && (
          <div className="absolute -top-12 left-0 w-full flex items-center justify-between px-2">
            <button 
              onClick={prevStep} 
              disabled={step === 1}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 mx-8 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((step - 1) / (totalSteps - 2)) * 100}%` }}
                className="h-full bg-brand-accent"
              />
            </div>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest w-10 text-right">
              {step}/{totalSteps - 1}
            </div>
          </div>
        )}

        <div className="glass p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        {step < 6 && (
          <div className="mt-8 flex items-center justify-center space-x-2 text-gray-600">
            <Info size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Tes données sont chiffrées et privées</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartOnboarding;
