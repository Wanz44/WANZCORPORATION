
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LiveVoice from './components/LiveVoice';
import Logo from './components/Logo';
import { SERVICES, TEMPLATES, PRICING_PLANS } from './constants';
import { ServiceCategory, PricingPlan, Template } from './types';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
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
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
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
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setSelectedPlan(null);
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
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative pt-48 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full glass border border-white/20 text-brand-accent text-sm font-bold tracking-widest uppercase">
            L'excellence Digitale par WANZCORP
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-white">
            Transformez Vos Idées en <br />
            <span className="gradient-text">Réalité Digitale</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10">
            Nous concevons des écosystèmes logiciels complets : Web, Mobile, Desktop et IA. 
            L'ingénierie au service de votre croissance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="px-8 py-4 bg-brand-accent text-brand-dark font-bold rounded-xl hover:bg-brand-accent/90 transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-accent/20">
              <i className="fas fa-paper-plane mr-2"></i> Demander un devis
            </a>
          </div>
          
          <div className="mt-20 relative max-w-5xl mx-auto">
             <div className="glass rounded-3xl p-2 border border-white/10 shadow-2xl transform rotate-1">
                <img src="https://picsum.photos/1200/600?grayscale" alt="Dashboard" className="rounded-2xl opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
             </div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 glass rounded-2xl p-6 border border-white/10 hidden md:block animate-float">
                <i className="fas fa-code text-brand-accent text-4xl mb-4"></i>
                <div className="text-sm font-bold">Code Qualité</div>
                <div className="text-xs text-gray-400">Standard Entreprise</div>
             </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Nos Solutions <span className="text-brand-accent">360°</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Des services d'ingénierie logicielle de pointe pour tous vos besoins.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'all' ? 'bg-brand-accent text-brand-dark' : 'glass border border-white/10 text-gray-400'}`}
            >
              Tous
            </button>
            {Object.values(ServiceCategory).map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${activeCategory === cat ? 'bg-brand-accent text-brand-dark' : 'glass border border-white/10 text-gray-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => (
              <div key={service.id} className="glass p-8 rounded-3xl text-left border border-white/10 group hover:border-brand-accent/50 transition-all duration-300">
                <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i className={`fas ${service.icon} text-2xl text-brand-accent`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center text-xs text-gray-300">
                      <i className="fas fa-check-circle text-brand-accent mr-2"></i> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Boutique de <span className="gradient-text">Templates</span></h2>
            <p className="text-gray-400">Gagnez du temps avec nos solutions pré-conçues et optimisées.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TEMPLATES.map(t => (
              <div key={t.id} className="glass rounded-3xl overflow-hidden border border-white/10 group hover:border-brand-purple transition-all">
                <div className="h-48 bg-gradient-to-br from-brand-surface to-brand-dark flex items-center justify-center overflow-hidden">
                   <i className={`fas ${t.icon} text-6xl text-brand-purple group-hover:scale-125 transition-transform duration-500`}></i>
                </div>
                <div className="p-6">
                  <div className="text-xs text-brand-purple font-bold mb-2 uppercase">{t.category}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{t.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">${t.price}</span>
                    <button 
                      onClick={() => setSelectedTemplate(t)}
                      className="px-4 py-2 bg-brand-purple/20 text-brand-purple font-bold text-sm rounded-lg hover:bg-brand-purple hover:text-white transition-colors"
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
      <section id="offres" className="py-24 bg-brand-accent/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Tarification <span className="text-brand-accent">Transparente</span></h2>
            <p className="text-gray-400">Des offres adaptées à chaque étape de votre projet.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map(plan => (
              <div key={plan.id} className={`p-10 rounded-[2.5rem] text-left border transition-all hover:scale-105 ${plan.isPremium ? 'bg-gradient-to-b from-brand-purple/20 to-brand-dark border-brand-purple shadow-xl shadow-brand-purple/10' : 'glass border-white/10'}`}>
                {plan.isPremium && <div className="inline-block px-3 py-1 bg-brand-purple text-white text-[10px] font-bold rounded-full mb-6">RECOMMANDÉ</div>}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-black text-white mb-4">{plan.price}</div>
                <p className="text-sm text-gray-400 mb-8 h-12">{plan.description}</p>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-200">
                      <i className="fas fa-check text-green-400 mr-3"></i> {f}
                    </li>
                  ))}
                  {plan.unavailableFeatures.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-times text-red-400/50 mr-3"></i> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${plan.isPremium ? 'bg-brand-purple text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  Choisir ce pack
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Order Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" onClick={() => setSelectedPlan(null)}></div>
          <div className="glass w-full max-w-lg p-8 rounded-[2.5rem] border border-white/20 relative animate-float shadow-2xl">
            <button onClick={() => setSelectedPlan(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="mb-8">
              <div className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-2">Finalisez votre commande</div>
              <h3 className="text-3xl font-black text-white">Pack {selectedPlan.name}</h3>
              <div className="text-brand-accent text-xl font-bold">{selectedPlan.price}</div>
            </div>
            <form onSubmit={handleOrderSubmit} className="space-y-5">
              <input type="text" name="name" required value={orderFormData.name} onChange={handleOrderInputChange} placeholder="Nom Complet" className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-accent" />
              <input type="email" name="email" required value={orderFormData.email} onChange={handleOrderInputChange} placeholder="Email professionnel" className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-accent" />
              <textarea name="message" required rows={3} value={orderFormData.message} onChange={handleOrderInputChange} placeholder="Description du Projet..." className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-accent"></textarea>
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-brand-accent to-brand-purple text-brand-dark font-black text-lg rounded-2xl shadow-xl hover:opacity-90 transition-all">
                <i className="fab fa-whatsapp mr-2 text-xl"></i> Confirmer sur WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Template Purchase Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" onClick={() => setSelectedTemplate(null)}></div>
          <div className="glass w-full max-w-lg p-8 rounded-[2.5rem] border border-brand-purple/30 relative animate-float shadow-2xl">
            <button onClick={() => setSelectedTemplate(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="mb-8">
              <div className="text-brand-purple text-xs font-bold uppercase tracking-widest mb-2">Achat de Template</div>
              <h3 className="text-3xl font-black text-white">{selectedTemplate.title}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-gray-400 text-sm">{selectedTemplate.category}</span>
                <span className="text-brand-purple text-xl font-bold">${selectedTemplate.price}</span>
              </div>
            </div>
            <form onSubmit={handleTemplateOrderSubmit} className="space-y-5">
              <input type="text" name="name" required value={templateOrderFormData.name} onChange={handleTemplateOrderInputChange} placeholder="Votre Nom" className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-purple" />
              <input type="email" name="email" required value={templateOrderFormData.email} onChange={handleTemplateOrderInputChange} placeholder="Votre Email" className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-purple" />
              <textarea name="message" required rows={3} value={templateOrderFormData.message} onChange={handleTemplateOrderInputChange} placeholder="Informations complémentaires ou personnalisation..." className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-purple"></textarea>
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-brand-purple to-brand-dark text-white font-black text-lg rounded-2xl shadow-xl hover:opacity-90 border border-brand-purple/50 transition-all">
                <i className="fab fa-whatsapp mr-2 text-xl"></i> Commander sur WhatsApp
              </button>
              <p className="text-[10px] text-center text-gray-500 italic">Un expert WANZCORP vous répondra instantanément pour finaliser l'installation.</p>
            </form>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass rounded-[3rem] p-8 md:p-16 border border-white/10">
             <div className="grid lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-4xl font-extrabold text-white mb-6">Parlons de votre <br/><span className="gradient-text">Prochain Succès</span></h2>
                  <p className="text-gray-400 mb-10">Notre équipe d'experts est prête à relever vos défis technologiques les plus complexes. Chaque message nous parvient directement sur WhatsApp.</p>
                  
                  <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                       <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                          <i className="fas fa-map-marker-alt"></i>
                       </div>
                       <div>
                          <div className="text-xs text-gray-500 font-bold uppercase">Adresse</div>
                          <div className="text-lg text-white font-medium">3344, avenue des aviateurs<br/>Kinshasa / Gombe</div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-6">
                       <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                          <i className="fas fa-envelope"></i>
                       </div>
                       <div>
                          <div className="text-xs text-gray-500 font-bold uppercase">Email</div>
                          <div className="text-lg text-white font-medium">contact@wanzcorp.com</div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-6">
                       <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                          <i className="fab fa-whatsapp"></i>
                       </div>
                       <div>
                          <div className="text-xs text-gray-500 font-bold uppercase">WhatsApp</div>
                          <div className="text-lg text-white font-medium">+243 850 062 491</div>
                       </div>
                    </div>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={handleWhatsAppSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Nom complet" className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent" />
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent" />
                  </div>
                  <select name="service" value={formData.service} onChange={handleInputChange} className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent">
                    <option value="">Sélectionnez un service</option>
                    <option value="Développement Web">Développement Web</option>
                    <option value="Application Mobile">Application Mobile</option>
                    <option value="Logiciel Desktop">Logiciel Desktop</option>
                    <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                    <option value="Design UI/UX">Design UI/UX</option>
                  </select>
                  <textarea name="message" required rows={4} value={formData.message} onChange={handleInputChange} placeholder="Décrivez votre projet..." className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent"></textarea>
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-brand-accent to-brand-purple text-brand-dark font-black text-lg rounded-xl shadow-xl hover:opacity-90 transition-all active:scale-[0.98]">
                    <i className="fab fa-whatsapp mr-2"></i> Envoyer sur WhatsApp
                  </button>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center space-y-4 mb-4">
            <Logo className="text-brand-accent" size={96} />
            <span className="text-xl font-black text-white">WANZCORP</span>
          </div>
          <div className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            <i className="fas fa-map-marker-alt text-brand-accent mr-2"></i> 3344, avenue des aviateurs, Kinshasa / Gombe
          </div>
          <p className="text-gray-500 text-sm mb-8">© 2026 WANZCORP. Créativité Informatique & Intelligence Artificielle.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="text-gray-400 hover:text-brand-accent transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </footer>

      <LiveVoice />
    </div>
  );
};

export default App;
