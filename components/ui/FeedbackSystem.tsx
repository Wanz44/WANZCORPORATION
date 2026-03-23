import React, { useState } from 'react';

const FeedbackSystem = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="mt-20 glass p-10 rounded-[2.5rem] border border-white/10 max-w-2xl mx-auto text-center">
      <h3 className="text-2xl font-black text-white mb-4">Votre Avis Compte</h3>
      <p className="text-gray-500 mb-8">Aidez-nous à améliorer nos outils intelligents.</p>
      {submitted ? (
        <div className="text-brand-accent font-black animate-bounce">Merci pour votre retour !</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-all transform hover:scale-125 ${rating >= star ? 'text-brand-accent' : 'text-gray-700'}`}
              >
                <i className="fas fa-star"></i>
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment pouvons-nous nous améliorer ?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-brand-accent outline-none mb-6 h-32 resize-none"
          ></textarea>
          <button type="submit" className="px-10 py-4 bg-brand-accent text-brand-dark font-black rounded-xl hover:bg-white transition-all">Envoyer</button>
        </form>
      )}
    </div>
  );
};

export default FeedbackSystem;
