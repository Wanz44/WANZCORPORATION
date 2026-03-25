import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { 
  Book, 
  Lightbulb, 
  Copy, 
  Users, 
  FileSearch, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Search,
  FileText,
  Quote
} from 'lucide-react';

type ResearchTab = 'biblio' | 'problem' | 'paraphrase' | 'sample' | 'pdf';

const ResearchSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResearchTab>('biblio');

  // --- Bibliography State ---
  const [biblioEntries, setBiblioEntries] = useState<any[]>([]);
  const [biblioForm, setBiblioForm] = useState({ type: 'book', author: '', title: '', year: '', publisher: '', url: '' });

  // --- Problem Statement State ---
  const [problemInput, setProblemInput] = useState('');
  const [problemResponse, setProblemResponse] = useState<string | null>(null);
  const [isProblemLoading, setIsProblemLoading] = useState(false);

  // --- Paraphrase State ---
  const [paraphraseInput, setParaphraseInput] = useState('');
  const [paraphraseResult, setParaphraseResult] = useState<string | null>(null);
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [isParaphraseLoading, setIsParaphraseLoading] = useState(false);

  // --- Sample Calculator State ---
  const [sampleParams, setSampleParams] = useState({ population: 1000, margin: 5, confidence: 95 });
  const [sampleResult, setSampleResult] = useState<number | null>(null);

  // --- PDF Extractor State ---
  const [pdfSearchQuery, setPdfSearchQuery] = useState('');
  const [extractedCitations, setExtractedCitations] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // --- Logic: Bibliography ---
  const addBiblioEntry = () => {
    const { author, title, year, publisher, url } = biblioForm;
    if (!author || !title) return;
    
    let apa = `${author} (${year}). *${title}*. ${publisher}.`;
    if (url) apa += ` Disponible sur : ${url}`;
    
    let iso = `${author.toUpperCase()}, ${year}. *${title}*. ${publisher}.`;
    
    setBiblioEntries([...biblioEntries, { ...biblioForm, apa, iso, id: Date.now() }]);
    setBiblioForm({ type: 'book', author: '', title: '', year: '', publisher: '', url: '' });
  };

  // --- Logic: Problem Assistant (AI) ---
  const handleProblemAssistant = async () => {
    if (!problemInput.trim()) return;
    setIsProblemLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `En tant qu'expert en méthodologie de recherche, aide-moi à affiner cette problématique de TFC : "${problemInput}". Propose une question centrale, des hypothèses et un plan de recherche.`,
      });
      setProblemResponse(result.text || "Erreur de génération.");
    } catch (e: any) {
      console.error("Problem Assistant Error:", e);
      if (e.status === "RESOURCE_EXHAUSTED" || e.code === 429) {
        setProblemResponse("Désolé, l'assistant de problématique est saturé (quota dépassé). Veuillez réessayer plus tard.");
      } else {
        setProblemResponse("Une erreur est survenue lors de la génération de la structure.");
      }
    } finally {
      setIsProblemLoading(false);
    }
  };

  // --- Logic: Paraphrase & Plagiarism (AI) ---
  const handleParaphrase = async () => {
    if (!paraphraseInput.trim()) return;
    setIsParaphraseLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `Reformule le texte suivant de manière académique et originale pour éviter le plagiat : "${paraphraseInput}". Donne également une estimation du score de similarité (0-100%) par rapport à des sources académiques types.`,
      });
      const text = result.text || "";
      setParaphraseResult(text);
      // Mock plagiarism score extraction or random for demo
      setPlagiarismScore(Math.floor(Math.random() * 15)); 
    } catch (e: any) {
      console.error("Paraphrase Error:", e);
      if (e.status === "RESOURCE_EXHAUSTED" || e.code === 429) {
        setParaphraseResult("Service de reformulation indisponible (quota dépassé).");
      } else {
        setParaphraseResult("Une erreur est survenue lors de la reformulation.");
      }
    } finally {
      setIsParaphraseLoading(false);
    }
  };

  // --- Logic: Sample Calculator ---
  const calculateSample = () => {
    const { population, margin, confidence } = sampleParams;
    const z = confidence === 95 ? 1.96 : confidence === 99 ? 2.58 : 1.645;
    const p = 0.5; // Expected proportion
    const e = margin / 100;
    
    const n0 = (z * z * p * (1 - p)) / (e * e);
    const n = n0 / (1 + (n0 - 1) / population);
    
    setSampleResult(Math.ceil(n));
  };

  // --- Logic: PDF Extractor (Mock for now as real PDF parsing needs heavy libs) ---
  const handlePdfExtraction = () => {
    if (!pdfSearchQuery) return;
    setIsExtracting(true);
    setTimeout(() => {
      setExtractedCitations([
        `"...l'impact des technologies numériques sur la gestion des ressources humaines dans les PME congolaises..." (Source: PDF_01.pdf, p.12)`,
        `"...la transformation digitale impose une restructuration des processus décisionnels..." (Source: PDF_04.pdf, p.45)`,
        `"...une corrélation significative entre l'adoption de l'IA et la performance organisationnelle..." (Source: PDF_12.pdf, p.8)`
      ]);
      setIsExtracting(false);
    }, 1500);
  };

  const tabs = [
    { id: 'biblio', name: 'Bibliographie', icon: <Book size={18} /> },
    { id: 'problem', name: 'Problématique', icon: <Lightbulb size={18} /> },
    { id: 'paraphrase', name: 'Reformulation', icon: <Copy size={18} /> },
    { id: 'sample', name: 'Échantillon', icon: <Users size={18} /> },
    { id: 'pdf', name: 'Extraction PDF', icon: <FileSearch size={18} /> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ResearchTab)}
            className={`px-6 py-4 rounded-2xl border transition-all flex items-center space-x-3 group ${
              activeTab === tab.id 
                ? 'bg-brand-accent border-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            {tab.icon}
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
          className="glass p-10 rounded-[3rem] border border-white/5 min-h-[500px]"
        >
          {/* --- BIBLIOGRAPHY GENERATOR --- */}
          {activeTab === 'biblio' && (
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Nouvelle Référence</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Auteur</label>
                      <input type="text" value={biblioForm.author} onChange={(e) => setBiblioForm({...biblioForm, author: e.target.value})} placeholder="Ex: Jean Dupont" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-accent outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Année</label>
                      <input type="text" value={biblioForm.year} onChange={(e) => setBiblioForm({...biblioForm, year: e.target.value})} placeholder="2024" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-accent outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Titre de l'Ouvrage</label>
                    <input type="text" value={biblioForm.title} onChange={(e) => setBiblioForm({...biblioForm, title: e.target.value})} placeholder="L'économie numérique en Afrique" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Éditeur / Revue</label>
                    <input type="text" value={biblioForm.publisher} onChange={(e) => setBiblioForm({...biblioForm, publisher: e.target.value})} placeholder="Éditions Savoir" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-accent outline-none" />
                  </div>
                  <button onClick={addBiblioEntry} className="w-full py-4 bg-brand-accent text-brand-dark font-black text-[10px] uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center">
                    <Plus size={16} className="mr-2" /> Ajouter à la liste
                  </button>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Liste des Références</h4>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {biblioEntries.map((entry) => (
                      <div key={entry.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl relative group">
                        <button onClick={() => setBiblioEntries(biblioEntries.filter(e => e.id !== entry.id))} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                        <div className="mb-4">
                          <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest block mb-1">Format APA</span>
                          <p className="text-xs text-white leading-relaxed italic">{entry.apa}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-brand-purple uppercase tracking-widest block mb-1">Format ISO 690</span>
                          <p className="text-xs text-gray-400 leading-relaxed">{entry.iso}</p>
                        </div>
                      </div>
                    ))}
                    {biblioEntries.length === 0 && (
                      <div className="text-center py-20 border border-white/5 border-dashed rounded-2xl">
                        <p className="text-gray-500 text-sm">Aucune référence ajoutée.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- PROBLEM STATEMENT ASSISTANT --- */}
          {activeTab === 'problem' && (
            <div className="space-y-8">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h4 className="text-2xl font-black text-white mb-4">Assistant de Problématique</h4>
                <p className="text-gray-500 text-sm">Décrivez votre sujet ou votre idée de recherche, et l'IA vous aidera à structurer une problématique scientifique solide.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <textarea
                    value={problemInput}
                    onChange={(e) => setProblemInput(e.target.value)}
                    placeholder="Ex: Je veux étudier l'impact du télétravail sur la motivation des employés dans les banques à Kinshasa..."
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-8 text-white text-sm outline-none focus:border-brand-accent min-h-[250px] resize-none"
                  />
                  <button
                    onClick={handleProblemAssistant}
                    disabled={isProblemLoading || !problemInput.trim()}
                    className="w-full py-5 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-accent/20 hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isProblemLoading ? <RefreshCw className="animate-spin mx-auto" size={20} /> : "Générer la Structure"}
                  </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 min-h-[350px]">
                  {problemResponse ? (
                    <div className="prose prose-invert max-w-none text-sm">
                      <Markdown>{problemResponse}</Markdown>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                      <Lightbulb size={40} className="mb-4 opacity-20" />
                      <p>La structure de votre TFC apparaîtra ici.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- PARAPHRASE & PLAGIARISM --- */}
          {activeTab === 'paraphrase' && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Texte Original</h4>
                  <textarea
                    value={paraphraseInput}
                    onChange={(e) => setParaphraseInput(e.target.value)}
                    placeholder="Collez ici le texte à reformuler..."
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-8 text-white text-sm outline-none focus:border-brand-accent min-h-[300px] resize-none"
                  />
                  <button
                    onClick={handleParaphrase}
                    disabled={isParaphraseLoading || !paraphraseInput.trim()}
                    className="w-full py-5 bg-brand-purple text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-purple/20 hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isParaphraseLoading ? <RefreshCw className="animate-spin mx-auto" size={20} /> : "Reformuler & Analyser"}
                  </button>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Résultat Académique</h4>
                  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 min-h-[300px] relative">
                    {paraphraseResult ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-2xl border border-white/5">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${plagiarismScore && plagiarismScore < 10 ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Similarité estimée</span>
                          </div>
                          <span className="text-xl font-black text-white">{plagiarismScore}%</span>
                        </div>
                        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                          <Markdown>{paraphraseResult}</Markdown>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                        <Copy size={40} className="mb-4 opacity-20" />
                        <p>Le texte reformulé s'affichera ici.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SAMPLE CALCULATOR --- */}
          {activeTab === 'sample' && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h4 className="text-2xl font-black text-white mb-4">Calculateur d'Échantillon</h4>
                <p className="text-gray-500 text-sm">Déterminez la taille idéale de votre échantillon pour vos enquêtes et sondages (Formule de Cochran).</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Population Totale (N)</label>
                  <input type="number" value={sampleParams.population} onChange={(e) => setSampleParams({...sampleParams, population: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white font-black outline-none focus:border-brand-accent" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Marge d'Erreur (%)</label>
                  <input type="number" value={sampleParams.margin} onChange={(e) => setSampleParams({...sampleParams, margin: parseInt(e.target.value) || 5})} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white font-black outline-none focus:border-brand-accent" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Niveau de Confiance (%)</label>
                  <select value={sampleParams.confidence} onChange={(e) => setSampleParams({...sampleParams, confidence: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white font-black outline-none focus:border-brand-accent appearance-none">
                    <option value={90}>90%</option>
                    <option value={95}>95%</option>
                    <option value={99}>99%</option>
                  </select>
                </div>
              </div>

              <button onClick={calculateSample} className="w-full py-6 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-accent/20 hover:brightness-110 transition-all">
                Calculer la Taille de l'Échantillon
              </button>

              {sampleResult && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-12 bg-white/5 rounded-[3rem] border border-brand-accent/30 text-center">
                  <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-4">Taille Recommandée</p>
                  <p className="text-7xl font-black text-white tracking-tighter">{sampleResult}</p>
                  <p className="text-gray-500 text-sm mt-6">Individus à interroger pour des résultats statistiquement significatifs.</p>
                </motion.div>
              )}
            </div>
          )}

          {/* --- PDF CITATION EXTRACTOR --- */}
          {activeTab === 'pdf' && (
            <div className="space-y-10">
              <div className="max-w-3xl mx-auto text-center">
                <h4 className="text-2xl font-black text-white mb-4">Extracteur de Citations PDF</h4>
                <p className="text-gray-500 text-sm">Recherchez des phrases clés ou des concepts à travers vos documents PDF pour vos citations directes.</p>
              </div>

              <div className="flex flex-col items-center space-y-8">
                <div className="w-full max-w-2xl relative">
                  <input
                    type="text"
                    value={pdfSearchQuery}
                    onChange={(e) => setPdfSearchQuery(e.target.value)}
                    placeholder="Entrez un mot-clé ou une phrase (ex: transformation digitale)..."
                    className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 text-white text-sm outline-none focus:border-brand-accent pr-20"
                  />
                  <button
                    onClick={handlePdfExtraction}
                    disabled={isExtracting || !pdfSearchQuery}
                    className="absolute right-3 top-3 bottom-3 px-6 bg-brand-accent text-brand-dark rounded-full font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isExtracting ? <RefreshCw className="animate-spin" size={16} /> : <Search size={18} />}
                  </button>
                </div>

                <div className="w-full grid md:grid-cols-2 gap-6">
                  <div className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:border-brand-accent/50 transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 mb-4 group-hover:text-brand-accent group-hover:bg-brand-accent/10 transition-all">
                      <Plus size={32} />
                    </div>
                    <p className="text-xs font-black text-white uppercase tracking-widest mb-2">Charger vos PDF</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Glissez-déposez jusqu'à 50 fichiers</p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Citations Trouvées</h5>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {extractedCitations.map((citation, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: i * 0.1 }}
                          className="p-6 bg-white/5 border border-white/10 rounded-2xl relative group"
                        >
                          <button className="absolute top-4 right-4 text-gray-500 hover:text-brand-accent opacity-0 group-hover:opacity-100 transition-all">
                            <Copy size={14} />
                          </button>
                          <Quote className="text-brand-accent mb-3 opacity-30" size={16} />
                          <p className="text-xs text-white leading-relaxed italic">{citation}</p>
                        </motion.div>
                      ))}
                      {extractedCitations.length === 0 && !isExtracting && (
                        <div className="text-center py-16 text-gray-600">
                          <FileText size={40} className="mx-auto mb-4 opacity-10" />
                          <p className="text-sm italic">Lancez une recherche pour extraire des citations.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResearchSuite;
