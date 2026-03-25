import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Shield, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mic, 
  Calendar, 
  Utensils, 
  MessageCircle, 
  BookOpen, 
  DollarSign, 
  Users, 
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Camera,
  Share2
} from 'lucide-react';

type EmpowermentTab = 'security' | 'health' | 'finance' | 'education';

const WomenEmpowermentSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EmpowermentTab>('security');

  // --- Security State ---
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [fakeCallActive, setFakeCallActive] = useState(false);

  // --- Health State ---
  const [cycleDay, setCycleDay] = useState(1);
  const [nutritionQuery, setNutritionQuery] = useState('');
  const [nutritionResponse, setNutritionResponse] = useState<string | null>(null);

  // --- Finance State ---
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tontineMembers, setTontineMembers] = useState([
    { id: 1, name: 'Mama Marie', paid: true, turn: false },
    { id: 2, name: 'Sarah', paid: false, turn: true },
    { id: 3, name: 'Esther', paid: true, turn: false },
  ]);

  // --- Education State ---
  const [legalQuery, setLegalQuery] = useState('');
  const [legalResponse, setLegalResponse] = useState<string | null>(null);

  // --- Logic: Security ---
  const triggerFakeCall = () => {
    setFakeCallActive(true);
    const audio = new Audio('https://www.soundjay.com/phone/phone-calling-1.mp3');
    audio.play();
    setTimeout(() => setFakeCallActive(false), 10000);
  };

  // --- Logic: Nutrition (AI) ---
  const handleNutrition = async () => {
    if (!nutritionQuery.trim()) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `En tant qu'expert en nutrition maternelle en Afrique Centrale, suggère des repas basés sur des produits locaux (marché de Kinshasa) pour : "${nutritionQuery}". Concentre-toi sur le fer et les vitamines.`,
      });
      setNutritionResponse(result.text);
    } catch (e: any) { 
      console.error("Nutrition AI Error:", e);
      if (e.status === "RESOURCE_EXHAUSTED" || e.code === 429) {
        setNutritionResponse("Désolé, le service de nutrition est saturé (quota dépassé). Veuillez réessayer plus tard.");
      } else {
        setNutritionResponse("Une erreur est survenue lors de la génération des conseils.");
      }
    }
  };

  // --- Logic: Legal (AI) ---
  const handleLegal = async () => {
    if (!legalQuery.trim()) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `Explique simplement les droits des femmes en RDC concernant : "${legalQuery}". Utilise un langage clair, accessible et bienveillant.`,
      });
      setLegalResponse(result.text);
    } catch (e: any) { 
      console.error("Legal AI Error:", e);
      if (e.status === "RESOURCE_EXHAUSTED" || e.code === 429) {
        setLegalResponse("Désolé, l'assistant juridique est saturé (quota dépassé). Veuillez réessayer plus tard.");
      } else {
        setLegalResponse("Une erreur est survenue lors de l'explication des droits.");
      }
    }
  };

  const tabs = [
    { id: 'security', name: 'Sécurité', icon: <Shield size={20} />, color: 'text-brand-accent' },
    { id: 'health', name: 'Santé', icon: <Heart size={20} />, color: 'text-pink-500' },
    { id: 'finance', name: 'Finance', icon: <Briefcase size={20} />, color: 'text-emerald-500' },
    { id: 'education', name: 'Éducation', icon: <GraduationCap size={20} />, color: 'text-indigo-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as EmpowermentTab)}
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
          {/* --- SECURITY & PROTECTION --- */}
          {activeTab === 'security' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent">
                      <MapPin size={24} />
                    </div>
                    <h4 className="text-xl font-black text-white">Trajet Sûr</h4>
                  </div>
                  <p className="text-gray-400 text-sm">Partagez votre position en temps réel avec vos contacts de confiance pendant vos déplacements.</p>
                  <button 
                    onClick={() => setIsSharingLocation(!isSharingLocation)}
                    className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      isSharingLocation ? 'bg-red-500 text-white' : 'bg-brand-accent text-brand-dark'
                    }`}
                  >
                    {isSharingLocation ? 'Arrêter le Partage' : 'Démarrer le Partage'}
                  </button>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
                      <Phone size={24} />
                    </div>
                    <h4 className="text-xl font-black text-white">Faux Appel</h4>
                  </div>
                  <p className="text-gray-400 text-sm">Déclenchez un appel simulé pour vous extirper d'une situation inconfortable.</p>
                  <button 
                    onClick={triggerFakeCall}
                    className="w-full py-4 bg-white/10 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20"
                  >
                    Lancer l'Appel
                  </button>
                </div>
              </div>

              <div className="p-10 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-500/40 animate-pulse">
                  <Mic size={40} />
                </div>
                <h4 className="text-2xl font-black text-white">Alerte Discrète (SOS)</h4>
                <p className="text-gray-400 max-w-md">Appuyez 3 fois sur le bouton volume pour envoyer un enregistrement audio de 30s et votre position GPS à vos contacts d'urgence.</p>
              </div>
            </div>
          )}

          {/* --- HEALTH & WELL-BEING --- */}
          {activeTab === 'health' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <div className="flex items-center space-x-4 mb-8">
                    <Calendar className="text-pink-500" size={24} />
                    <h4 className="text-xl font-black text-white">Calendrier Privé</h4>
                  </div>
                  <div className="flex justify-between items-center mb-10">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Jour du Cycle</p>
                      <p className="text-6xl font-black text-white">{cycleDay}</p>
                    </div>
                    <div className="px-6 py-3 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-500 font-black text-[10px] uppercase tracking-widest">
                      Phase Folliculaire
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic">Données stockées localement uniquement. Confidentialité garantie.</p>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Utensils className="text-orange-500" size={24} />
                    <h4 className="text-xl font-black text-white">Nutrition & Grossesse</h4>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={nutritionQuery}
                      onChange={(e) => setNutritionQuery(e.target.value)}
                      placeholder="Ex: Repas riche en fer (Kinshasa)..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm outline-none focus:border-pink-500"
                    />
                    <button onClick={handleNutrition} className="absolute right-2 top-2 bottom-2 px-4 bg-pink-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest">
                      Conseil
                    </button>
                  </div>
                  {nutritionResponse && (
                    <div className="p-6 bg-pink-500/5 border border-pink-500/10 rounded-2xl text-sm text-gray-300 leading-relaxed">
                      {nutritionResponse}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-10 bg-brand-purple/10 border border-brand-purple/20 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-brand-purple rounded-2xl flex items-center justify-center text-white">
                    <MessageCircle size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">Téléconsultation</h4>
                    <p className="text-gray-400 text-sm">Parlez à une gynécologue ou psychologue en toute discrétion.</p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-brand-purple text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Démarrer Chat
                </button>
              </div>
            </div>
          )}

          {/* --- FINANCE & ENTREPRENEURSHIP --- */}
          {activeTab === 'finance' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-black text-white">Livre de Caisse</h4>
                    <button className="p-3 bg-emerald-500 text-white rounded-xl"><Plus size={20} /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-gray-400 text-sm">Ventes du jour</span>
                      <span className="text-emerald-500 font-black">45.000 FC</span>
                    </div>
                    <div className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-gray-400 text-sm">Dettes clients</span>
                      <span className="text-red-500 font-black">12.500 FC</span>
                    </div>
                    <div className="flex justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">Bénéfice Net</span>
                      <span className="text-white font-black">32.500 FC</span>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                  <h4 className="text-xl font-black text-white">Ma Tontine</h4>
                  <div className="space-y-4">
                    {tontineMembers.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <span className="text-sm text-white">{m.name}</span>
                        <div className="flex items-center space-x-2">
                          {m.turn && <span className="text-[8px] bg-brand-accent text-brand-dark px-2 py-1 rounded font-black">TOUR</span>}
                          {m.paid ? <CheckCircle2 className="text-emerald-500" size={16} /> : <AlertCircle className="text-gray-600" size={16} />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">Gérer Cotisations</button>
                </div>
              </div>

              <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <ShoppingBag className="text-brand-accent" size={32} />
                  <div>
                    <h4 className="text-xl font-black text-white">Boutique WhatsApp</h4>
                    <p className="text-gray-400 text-sm">Créez un catalogue professionnel avec détourage IA.</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className="p-4 bg-white/10 rounded-xl text-white"><Camera size={20} /></button>
                  <button className="p-4 bg-brand-accent text-brand-dark rounded-xl"><Share2 size={20} /></button>
                </div>
              </div>
            </div>
          )}

          {/* --- EDUCATION & NETWORKING --- */}
          {activeTab === 'education' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-2xl font-black text-white">Bibliothèque de Droits</h4>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={legalQuery}
                      onChange={(e) => setLegalQuery(e.target.value)}
                      placeholder="Ex: Droit à l'héritage..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-white outline-none focus:border-indigo-500"
                    />
                    <button onClick={handleLegal} className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
                      Expliquer
                    </button>
                  </div>
                  {legalResponse && (
                    <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] text-sm text-gray-300 leading-relaxed">
                      {legalResponse}
                    </div>
                  )}
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8">
                  <h4 className="text-2xl font-black text-white">Mentor Matcher</h4>
                  <div className="space-y-6">
                    {[
                      { name: 'Ing. Clarisse', field: 'Développement IT', exp: '12 ans' },
                      { name: 'Mme Solange', field: 'Management Public', exp: '8 ans' }
                    ].map((mentor, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/50 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black">{mentor.name[0]}</div>
                          <div>
                            <p className="text-white font-black">{mentor.name}</p>
                            <p className="text-xs text-gray-500">{mentor.field} • {mentor.exp}</p>
                          </div>
                        </div>
                        <ArrowRight className="text-gray-600 group-hover:text-indigo-500 transition-all" size={20} />
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20">Trouver ma Mentore</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WomenEmpowermentSuite;
