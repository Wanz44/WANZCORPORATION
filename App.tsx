
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import { SERVICES, TEMPLATES, PRICING_PLANS } from './constants';
import { ServiceCategory, PricingPlan, Template } from './types';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [pendingWhatsAppUrl, setPendingWhatsAppUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });

  const [orderFormData, setOrderFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [templateOrderFormData, setTemplateOrderFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const filteredServices = activeCategory === 'all' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplateOrderFormData(prev => ({ ...prev, [name]: value }));
  };

  const WHATSAPP_NUMBER = "243850062491";

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*Nouveau Message WANZCORP*%0A%0A` +
                 `*Nom:* ${formData.name}%0A` +
                 `*Email:* ${formData.email}%0A` +
                 `*Service:* ${formData.service || 'Non spécifié'}%0A` +
                 `*Projet:* ${formData.message}`;
    setPendingWhatsAppUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const text = `*COMMANDE DE PACK WANZCORP*%0A%0A` +
                 `*Pack:* ${selectedPlan.name}%0A` +
                 `*Prix:* ${selectedPlan.price}%0A%0A` +
                 `*Client:* ${orderFormData.name}%0A` +
                 `*Email:* ${orderFormData.email}%0A` +
                 `*Détails du projet:* ${orderFormData.message}`;
    
    setPendingWhatsAppUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`);
  };

  const handleTemplateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    const text = `*ACHAT DE TEMPLATE WANZCORP*%0A%0A` +
                 `*Template:* ${selectedTemplate.title}%0A` +
                 `*Catégorie:* ${selectedTemplate.category}%0A` +
                 `*Prix:* ${selectedTemplate.price}$%0A%0A` +
                 `*Client:* ${templateOrderFormData.name}%0A` +
                 `*Email:* ${templateOrderFormData.email}%0A` +
                 `*Demande:* ${templateOrderFormData.message}`;
    
    setPendingWhatsAppUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`);
  };

  const confirmAndRedirect = () => {
    if (pendingWhatsAppUrl) {
      window.open(pendingWhatsAppUrl, '_blank');
      setPendingWhatsAppUrl(null);
      setSelectedPlan(null);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-accent selection:text-brand-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative pt-48 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/20 blur-[150px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center animate-reveal-up">
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
            <a href="#contact" className="group px-10 py-5 bg-brand-accent text-brand-dark font-black rounded-2xl hover:bg-white transition-all transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,210,255,0.4)] active:scale-95">
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

      {/* Services Section */}
      <section id="services" className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl font-black text-white mb-6">Solutions <span className="text-brand-accent">Haut de Gamme</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">Chaque ligne de code est optimisée pour la performance et l'évolutivité de votre business.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {['all', ...Object.values(ServiceCategory)].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 transform active:scale-90 ${activeCategory === cat ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20' : 'glass border border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {cat === 'all' ? 'Tout Voir' : cat}
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

      {/* Templates Section */}
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

      {/* Pricing Section */}
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

      {/* Confirmation WhatsApp Modal */}
      {pendingWhatsAppUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl animate-fade-in" onClick={() => setPendingWhatsAppUrl(null)}></div>
          <div className="glass w-full max-w-sm p-8 rounded-[2.5rem] border border-brand-accent/30 relative animate-zoom-in text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fab fa-whatsapp text-4xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Redirection WhatsApp</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Vous allez être redirigé vers WhatsApp pour finaliser votre demande avec un conseiller WANZCORP.</p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={confirmAndRedirect}
                className="w-full py-4 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Continuer vers WhatsApp
              </button>
              <button 
                onClick={() => setPendingWhatsAppUrl(null)}
                className="w-full py-4 bg-white/5 text-gray-400 font-black text-xs uppercase tracking-widest rounded-xl hover:text-white transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Order Modal */}
      {selectedPlan && !pendingWhatsAppUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-2xl animate-fade-in" onClick={() => setSelectedPlan(null)}></div>
          <div className="glass w-full max-w-lg p-10 rounded-[3rem] border border-white/20 relative animate-zoom-in shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
            <button onClick={() => setSelectedPlan(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <i className="fas fa-times text-2xl"></i>
            </button>
            <div className="mb-10">
              <div className="text-brand-accent text-xs font-black uppercase tracking-[0.3em] mb-3">Confirmation de commande</div>
              <h3 className="text-4xl font-black text-white tracking-tighter">Pack {selectedPlan.name}</h3>
              <div className="text-brand-accent text-2xl font-black mt-2 tracking-tighter">{selectedPlan.price}</div>
            </div>
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" name="name" required value={orderFormData.name} onChange={handleOrderInputChange} placeholder="Nom Complet" className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-accent transition-all" />
                <input type="email" name="email" required value={orderFormData.email} onChange={handleOrderInputChange} placeholder="Email professionnel" className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-accent" />
              </div>
              <textarea name="message" required rows={3} value={orderFormData.message} onChange={handleOrderInputChange} placeholder="Décrivez brièvement votre projet..." className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-accent"></textarea>
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-brand-accent to-brand-purple text-brand-dark font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:brightness-110 active:scale-95 transition-all">
                <i className="fab fa-whatsapp mr-2 text-xl"></i> Lancer sur WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Template Purchase Modal */}
      {selectedTemplate && !pendingWhatsAppUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-2xl animate-fade-in" onClick={() => setSelectedTemplate(null)}></div>
          <div className="glass w-full max-w-lg p-10 rounded-[3rem] border border-brand-purple/30 relative animate-zoom-in shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
            <button onClick={() => setSelectedTemplate(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <i className="fas fa-times text-2xl"></i>
            </button>
            <div className="mb-10">
              <div className="text-brand-purple text-xs font-black uppercase tracking-[0.3em] mb-3">Acquisition Template</div>
              <h3 className="text-4xl font-black text-white tracking-tighter">{selectedTemplate.title}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-gray-500 text-sm font-bold">{selectedTemplate.category}</span>
                <span className="text-brand-purple text-2xl font-black">${selectedTemplate.price}</span>
              </div>
            </div>
            <form onSubmit={handleTemplateOrderSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" name="name" required value={templateOrderFormData.name} onChange={handleTemplateOrderInputChange} placeholder="Votre Nom" className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-purple" />
                <input type="email" name="email" required value={templateOrderFormData.email} onChange={handleTemplateOrderInputChange} placeholder="Votre Email" className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-purple" />
              </div>
              <textarea name="message" required rows={3} value={templateOrderFormData.message} onChange={handleTemplateOrderInputChange} placeholder="Souhaitez-vous une installation assistée ?" className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-purple"></textarea>
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-brand-purple to-brand-dark text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl border border-brand-purple/50 hover:brightness-110 active:scale-95 transition-all">
                <i className="fab fa-whatsapp mr-2 text-xl"></i> Obtenir sur WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass rounded-[4rem] p-10 md:p-20 border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 blur-[100px] rounded-full -mr-48 -mt-48"></div>
             <div className="grid lg:grid-cols-2 gap-24 relative z-10">
                <div className="animate-reveal-up">
                  <h2 className="text-5xl font-black text-white mb-8 leading-tight">Parlons de votre <br/><span className="gradient-text">Prochaine Étape</span></h2>
                  <p className="text-gray-400 text-lg mb-12 leading-relaxed">Nous ne créons pas seulement des logiciels, nous forgeons des outils de leadership pour votre entreprise.</p>
                  
                  <div className="space-y-10">
                    <div className="flex items-center space-x-8 group">
                       <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-dark transition-all duration-500">
                          <i className="fas fa-map-marker-alt text-2xl"></i>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1">Localisation</div>
                          <div className="text-xl text-white font-bold">3344, avenue des aviateurs<br/>Kinshasa / Gombe</div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-8 group">
                       <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all duration-500">
                          <i className="fas fa-envelope text-2xl"></i>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1">Email Direct</div>
                          <div className="text-xl text-white font-bold">contact@wanzcorp.com</div>
                       </div>
                    </div>
                  </div>
                </div>

                <form className="space-y-6 animate-reveal-up [animation-delay:200ms] [animation-fill-mode:forwards] opacity-0" onSubmit={handleWhatsAppSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Nom" className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-accent" />
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-accent" />
                  </div>
                  <select name="service" value={formData.service} onChange={handleInputChange} className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-accent appearance-none">
                    <option value="">Projet type...</option>
                    <option value="Développement Web">Développement Web</option>
                    <option value="Application Mobile">Application Mobile</option>
                    <option value="Automatisé">Systèmes Automatisés</option>
                    <option value="Design UX">UI/UX Design</option>
                  </select>
                  <textarea name="message" required rows={4} value={formData.message} onChange={handleInputChange} placeholder="Parlez-nous de vos objectifs..." className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-accent"></textarea>
                  <button type="submit" className="w-full py-6 bg-gradient-to-r from-brand-accent via-brand-accent to-brand-purple text-brand-dark font-black text-sm uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,210,255,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(0,210,255,0.6)] hover:-translate-y-1 transition-all active:scale-[0.98]">
                    Lancer la discussion
                  </button>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-brand-dark/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center space-y-6 mb-12 animate-fade-in">
            <Logo className="text-brand-accent transform hover:scale-110 transition-transform duration-700" size={120} />
            <span className="text-3xl font-black text-white tracking-tighter">WANZCORP</span>
          </div>
          <div className="flex justify-center space-x-8 mb-12">
            {['facebook-f', 'twitter', 'linkedin-in', 'instagram'].map(icon => (
              <a key={icon} href="#" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-brand-accent hover:scale-125 transition-all duration-500">
                <i className={`fab fa-${icon}`}></i>
              </a>
            ))}
          </div>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em]">© 2026 WANZCORP • Kinshasa Gombe</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
