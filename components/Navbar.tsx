
import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Accueil', href: '#home', id: 'home' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Templates', href: '#templates', id: 'templates' },
    { name: 'Offres', href: '#offres', id: 'offres' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 150;

      sections.forEach(section => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-700 ease-expo-out ${
      scrolled ? 'py-4' : 'py-10'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass relative rounded-[2rem] border transition-all duration-700 ease-expo-out ${
          scrolled ? 'bg-brand-dark/80 backdrop-blur-2xl border-white/10 shadow-2xl px-6 py-2' : 'bg-transparent border-transparent px-0 py-0'
        }`}>
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" onClick={closeMenu} className="flex-shrink-0 flex items-center space-x-4 group">
               <div className="transition-all duration-700 ease-expo-out transform group-hover:scale-110 group-hover:rotate-3">
                  <Logo className="text-brand-accent" size={scrolled ? 80 : 130} />
               </div>
               <span className={`text-xl font-black tracking-tighter text-white transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-100 md:opacity-0'}`}>WANZCORP</span>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                      activeSection === link.id 
                        ? 'text-brand-accent bg-white/5' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {activeSection === link.id && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-brand-accent rounded-full animate-fade-in"></span>
                    )}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="w-12 h-12 flex items-center justify-center rounded-2xl glass border-white/10 text-gray-400 hover:text-white transition-all active:scale-90"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between overflow-hidden">
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-2 translate-x-1' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-500 ${isOpen ? 'opacity-0 translate-x-4' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-1.5 translate-x-1' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`md:hidden fixed inset-0 z-[-1] transition-all duration-700 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-2xl" onClick={closeMenu}></div>
        <div className={`absolute top-32 left-6 right-6 glass p-8 rounded-[2.5rem] border border-white/10 transition-all duration-700 ease-expo-out ${isOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'}`}>
          <div className="flex flex-col space-y-4">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`px-6 py-5 rounded-2xl text-lg font-black tracking-tight transition-all duration-500 ${
                  activeSection === link.id 
                    ? 'text-brand-accent bg-white/5' 
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                  <i className={`fas fa-arrow-right text-[10px] transition-transform duration-500 ${activeSection === link.id ? 'translate-x-0' : '-translate-x-4 opacity-0'}`}></i>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
