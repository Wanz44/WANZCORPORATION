import React from 'react';
import { PricingPlan } from '../../types';

const PricingOrderModal = ({ plan, onClose, onConfirm }: { plan: PricingPlan, onClose: () => void, onConfirm: (plan: PricingPlan) => void }) => (
  <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
    <div className="glass p-10 rounded-[3rem] max-w-lg w-full border border-white/10 animate-reveal-up">
      <h3 className="text-3xl font-black text-white mb-2">Commander {plan.name}</h3>
      <p className="text-brand-accent font-black text-xl mb-8">{plan.price}</p>
      <div className="space-y-4 mb-10">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-center text-sm text-gray-300">
            <i className="fas fa-check text-green-500 mr-3"></i> {f}
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <button onClick={() => onConfirm(plan)} className="flex-1 py-4 bg-brand-accent text-brand-dark font-black rounded-2xl hover:bg-white transition-all">Confirmer</button>
        <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all">Fermer</button>
      </div>
    </div>
  </div>
);

export default PricingOrderModal;
