import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Heart, 
  Pill, 
  Volume2, 
  AlertTriangle, 
  HelpCircle, 
  Camera, 
  Mic, 
  MapPin, 
  Bell, 
  Check, 
  X, 
  Phone, 
  Image as ImageIcon,
  MessageSquare,
  Loader2,
  Scan,
  Smartphone
} from 'lucide-react';

type ElderlyTab = 'pillbox' | 'ocr' | 'emergency' | 'translator' | 'album';

const ElderlyCareSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ElderlyTab>('pillbox');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Pillbox State ---
  const [meds, setMeds] = useState([
    { id: 1, name: 'Paracétamol', dose: '1 comprimé', time: '08:00', taken: false, alertSent: false },
    { id: 2, name: 'Aspirine', dose: '500mg', time: '12:00', taken: false, alertSent: false }
  ]);

  // --- OCR State ---
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [ocrSummary, setOcrSummary] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Emergency State ---
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // --- Translator State ---
  const [translateQuery, setTranslateQuery] = useState('');
  const [translateResponse, setTranslateResponse] = useState<string | null>(null);

  // --- Album State ---
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://picsum.photos/seed/family1/800/600', sender: 'Léa (Petite-fille)', message: 'Coucou Papy ! On pense à toi.' },
    { id: 2, url: 'https://picsum.photos/seed/family2/800/600', sender: 'Marc (Fils)', message: 'Les vacances se passent bien !' }
  ]);

  // --- Logic: Pillbox ---
  const toggleMed = (id: number) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  // --- Logic: OCR & TTS ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const captureAndRead = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    
    const context = canvasRef.current.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      const base64Data = imageData.split(',')[1];

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const model = "gemini-3.1-pro-preview";
        
        const result = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
              { text: "Lis ce document à haute voix et fais-en un résumé très simple pour une personne âgée. Identifie s'il s'agit d'une facture, d'une notice de médicament ou d'un courrier." }
            ]
          }
        });

        const text = result.text;
        setOcrText(text);
        
        // Text to Speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);

      } catch (err) {
        console.error("OCR error:", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // --- Logic: Emergency ---
  const triggerEmergency = () => {
    setIsEmergencyActive(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
    // Simulate WhatsApp alert
    setTimeout(() => {
      alert("ALERTE ENVOYÉE : Votre famille a reçu votre position GPS.");
      setIsEmergencyActive(false);
    }, 2000);
  };

  // --- Logic: Translator ---
  const handleTranslate = async () => {
    if (!translateQuery.trim()) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `Explique ce terme technologique ou cette expression moderne à une personne âgée de 80 ans, sans jargon : "${translateQuery}"`,
      });
      setTranslateResponse(result.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'pillbox', name: 'Pilulier', icon: <Pill size={24} />, color: 'text-blue-500' },
    { id: 'ocr', name: 'Lire Courrier', icon: <Volume2 size={24} />, color: 'text-emerald-500' },
    { id: 'emergency', name: 'URGENCE', icon: <AlertTriangle size={24} />, color: 'text-red-500' },
    { id: 'translator', name: 'Dico Moderne', icon: <HelpCircle size={24} />, color: 'text-purple-500' },
    { id: 'album', name: 'Photos Famille', icon: <ImageIcon size={24} />, color: 'text-orange-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Navigation Géante pour Seniors */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ElderlyTab)}
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all ${
              activeTab === tab.id 
                ? `bg-white text-brand-dark border-brand-accent shadow-2xl scale-105` 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <div className={`mb-3 ${activeTab === tab.id ? tab.color : 'text-gray-500'}`}>
              {tab.icon}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-center">{tab.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass p-10 rounded-[3rem] border border-white/5 min-h-[600px]"
        >
          {/* --- PILLBOX --- */}
          {activeTab === 'pillbox' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-white">Mon Pilulier</h3>
                <button className="p-4 bg-brand-accent text-brand-dark rounded-2xl flex items-center space-x-3 font-black uppercase text-xs tracking-widest">
                  <Scan size={20} />
                  <span>Scanner une Boîte</span>
                </button>
              </div>

              <div className="grid gap-6">
                {meds.map((med) => (
                  <div 
                    key={med.id} 
                    className={`p-8 rounded-[2rem] border-2 flex items-center justify-between transition-all ${
                      med.taken ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${med.taken ? 'bg-emerald-500 text-white' : 'bg-blue-500/20 text-blue-500'}`}>
                        <Pill size={32} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white">{med.name}</h4>
                        <p className="text-gray-400 font-bold">{med.dose} • <span className="text-brand-accent">{med.time}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleMed(med.id)}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        med.taken ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      {med.taken ? <Check size={40} /> : <div className="w-8 h-8 border-4 border-current rounded-full"></div>}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center space-x-6">
                <Bell className="text-red-500 animate-bounce" size={32} />
                <div>
                  <p className="text-red-500 font-black uppercase tracking-widest text-xs">Alerte Proche Active</p>
                  <p className="text-gray-400 text-sm">Si vous ne validez pas vos médicaments, votre famille sera prévenue automatiquement.</p>
                </div>
              </div>
            </div>
          )}

          {/* --- OCR VOCAL --- */}
          {activeTab === 'ocr' && (
            <div className="space-y-8 flex flex-col items-center">
              <h3 className="text-3xl font-black text-white mb-6">Scanner et Lire</h3>
              
              <div className="relative w-full max-w-2xl aspect-video bg-black rounded-[2.5rem] overflow-hidden border-4 border-white/10">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                
                {!videoRef.current?.srcObject && (
                  <button 
                    onClick={startCamera}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/50 hover:bg-black/40 transition-all"
                  >
                    <Camera size={64} className="mb-4" />
                    <span className="font-black uppercase tracking-widest">Allumer la Caméra</span>
                  </button>
                )}
              </div>

              <button 
                onClick={captureAndRead}
                disabled={isProcessing}
                className="w-full max-w-2xl py-8 bg-emerald-500 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-emerald-500/20 flex items-center justify-center space-x-4 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={32} /> : <><Volume2 size={32} /> <span>Scanner et Lire</span></>}
              </button>

              {ocrText && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-2xl p-8 bg-white/5 border border-white/10 rounded-[2rem]"
                >
                  <h4 className="text-brand-accent font-black uppercase tracking-widest text-xs mb-4">Résumé du Document</h4>
                  <p className="text-white text-lg leading-relaxed">{ocrText}</p>
                </motion.div>
              )}
            </div>
          )}

          {/* --- EMERGENCY --- */}
          {activeTab === 'emergency' && (
            <div className="h-full flex flex-col items-center justify-center space-y-12">
              <div className="text-center">
                <h3 className="text-4xl font-black text-white mb-4">Besoin d'aide ?</h3>
                <p className="text-gray-500 text-lg">Appuyez longuement sur le bouton rouge pour alerter les secours et votre famille.</p>
              </div>

              <button 
                onMouseDown={triggerEmergency}
                className={`w-72 h-72 rounded-full border-[12px] flex flex-col items-center justify-center transition-all shadow-2xl ${
                  isEmergencyActive 
                    ? 'bg-white border-red-500 text-red-500 scale-110' 
                    : 'bg-red-500 border-red-600 text-white hover:scale-105 active:scale-95'
                }`}
              >
                <AlertTriangle size={80} className="mb-4" />
                <span className="text-2xl font-black uppercase tracking-tighter">SOS</span>
              </button>

              <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex items-center space-x-4">
                  <MapPin className="text-brand-accent" size={32} />
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ma Position</p>
                    <p className="text-white font-bold">Partagée avec la famille</p>
                  </div>
                </div>
                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex items-center space-x-4">
                  <Smartphone className="text-brand-purple" size={32} />
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Détection Chute</p>
                    <p className="text-white font-bold">Activée</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TRANSLATOR --- */}
          {activeTab === 'translator' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-white mb-4">Dictionnaire Moderne</h3>
                <p className="text-gray-500">Posez une question sur la technologie ou les expressions d'aujourd'hui.</p>
              </div>

              <div className="relative">
                <input 
                  type="text"
                  value={translateQuery}
                  onChange={(e) => setTranslateQuery(e.target.value)}
                  placeholder="C'est quoi un 'DM' sur Instagram ?"
                  className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] px-10 py-8 text-xl text-white outline-none focus:border-brand-accent pr-24"
                />
                <button 
                  onClick={handleTranslate}
                  disabled={isProcessing || !translateQuery}
                  className="absolute right-4 top-4 bottom-4 px-6 bg-brand-accent text-brand-dark rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={24} /> : "Demander"}
                </button>
              </div>

              {translateResponse && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 bg-white/5 border border-brand-accent/30 rounded-[3rem] relative"
                >
                  <div className="absolute -top-6 left-10 w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-dark">
                    <HelpCircle size={24} />
                  </div>
                  <p className="text-2xl text-white leading-relaxed font-medium">{translateResponse}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-10">
                {["Un Selfie", "Le Cloud", "Un Hashtag", "TikTok"].map((term) => (
                  <button 
                    key={term}
                    onClick={() => { setTranslateQuery(`C'est quoi ${term} ?`); handleTranslate(); }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- PHOTO ALBUM --- */}
          {activeTab === 'album' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-white">Album de Famille</h3>
                <div className="flex items-center space-x-4">
                  <div className="px-6 py-3 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent font-black text-[10px] uppercase tracking-widest">
                    2 Nouvelles Photos
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative bg-white/5 rounded-[3rem] overflow-hidden border border-white/10">
                    <img src={photo.url} alt="Family" className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-black">
                          {photo.sender[0]}
                        </div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">{photo.sender}</p>
                      </div>
                      <p className="text-xl text-gray-300 italic mb-8">"{photo.message}"</p>
                      
                      <div className="flex space-x-4">
                        <button className="flex-1 py-4 bg-red-500 text-white rounded-2xl flex items-center justify-center space-x-2 font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                          <Heart size={20} />
                          <span>J'aime</span>
                        </button>
                        <button className="flex-1 py-4 bg-white/10 text-white rounded-2xl flex items-center justify-center space-x-2 font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all">
                          <Mic size={20} />
                          <span>Merci</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ElderlyCareSuite;
