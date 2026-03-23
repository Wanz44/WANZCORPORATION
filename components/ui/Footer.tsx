import React from 'react';
import Logo from '../Logo';

const Footer = () => (
  <footer className="py-20 border-t border-white/5 bg-brand-dark">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center space-x-3 mb-8">
          <Logo size={80} className="rounded-xl" />
          <span className="text-xl font-black tracking-tighter text-white">WANZCORP</span>
        </div>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          L'ingénierie logicielle redéfinie pour l'ère de l'intelligence artificielle. Nous bâtissons les outils qui façonneront demain.
        </p>
      </div>
      <div>
        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Navigation</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li><a href="#" className="hover:text-brand-accent transition-colors">À propos</a></li>
          <li><a href="#" className="hover:text-brand-accent transition-colors">Carrières</a></li>
          <li><a href="#" className="hover:text-brand-accent transition-colors">Blog Tech</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Légal</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li><a href="#" className="hover:text-brand-accent transition-colors">Confidentialité</a></li>
          <li><a href="#" className="hover:text-brand-accent transition-colors">CGU</a></li>
          <li><a href="#" className="hover:text-brand-accent transition-colors">Mentions Légales</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
      © 2024 WANZCORP ENGINEERING. TOUS DROITS RÉSERVÉS.
    </div>
  </footer>
);

export default Footer;
