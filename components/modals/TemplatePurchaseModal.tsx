import React from 'react';
import { Template } from '../../types';

const TemplatePurchaseModal = ({ template, onClose, onConfirm }: { template: Template, onClose: () => void, onConfirm: (template: Template) => void }) => (
  <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
    <div className="glass p-10 rounded-[3rem] max-w-lg w-full border border-white/10 animate-reveal-up">
      <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple mb-6">
        <i className={`fas ${template.icon} text-2xl`}></i>
      </div>
      <h3 className="text-3xl font-black text-white mb-2">{template.title}</h3>
      <p className="text-brand-purple font-black text-xl mb-6">${template.price}</p>
      <p className="text-gray-400 mb-10 leading-relaxed">{template.description}</p>
      <div className="flex space-x-4">
        <button onClick={() => onConfirm(template)} className="flex-1 py-4 bg-brand-purple text-white font-black rounded-2xl hover:opacity-90 transition-all">Acheter maintenant</button>
        <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all">Fermer</button>
      </div>
    </div>
  </div>
);

export default TemplatePurchaseModal;
