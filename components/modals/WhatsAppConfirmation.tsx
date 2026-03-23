import React from 'react';

const WhatsAppConfirmation = ({ url, onCancel }: { url: string, onCancel: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-xl">
    <div className="glass p-10 rounded-[3rem] max-w-md w-full border border-white/10 text-center animate-reveal-up">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8">
        <i className="fab fa-whatsapp text-4xl"></i>
      </div>
      <h3 className="text-2xl font-black text-white mb-4">Confirmer la commande</h3>
      <p className="text-gray-400 mb-10 leading-relaxed">
        Vous allez être redirigé vers WhatsApp pour finaliser votre commande avec un conseiller WANZCORP.
      </p>
      <div className="flex flex-col space-y-4">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-5 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-500/20"
        >
          Continuer sur WhatsApp
        </a>
        <button 
          onClick={onCancel}
          className="w-full py-5 bg-white/5 text-gray-400 font-black rounded-2xl hover:bg-white/10 transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
);

export default WhatsAppConfirmation;
