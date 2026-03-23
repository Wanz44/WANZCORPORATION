
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

interface Feedback {
  id: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: any;
}

const FeedbackSystem: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newFeedbacks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Feedback[];
      setFeedbacks(newFeedbacks);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      let user = auth.currentUser;
      if (!user) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        user = result.user;
      }

      await addDoc(collection(db, 'feedbacks'), {
        userId: user.uid,
        userName: user.displayName || 'Utilisateur Anonyme',
        userPhoto: user.photoURL || '',
        rating,
        comment,
        createdAt: serverTimestamp()
      });

      setComment('');
      setRating(5);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding feedback: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-black text-white mb-4">Avis de la <span className="text-brand-accent">Communauté</span></h3>
        <p className="text-gray-400">Votre avis nous aide à nous améliorer chaque jour.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <AnimatePresence>
          {feedbacks.map((f, index) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group"
            >
              <div className="flex items-start space-x-4">
                <img 
                  src={f.userPhoto || `https://ui-avatars.com/api/?name=${f.userName}&background=random`} 
                  alt={f.userName} 
                  className="w-12 h-12 rounded-full border-2 border-brand-accent/20"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-bold text-sm">{f.userName}</h4>
                    <div className="flex text-brand-accent text-[10px]">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < f.rating ? 'text-brand-accent' : 'text-gray-600'}`}></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm italic">"{f.comment}"</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <i className="fas fa-quote-right text-4xl text-white"></i>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!showForm ? (
        <div className="text-center">
          <button 
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all"
          >
            Laisser un avis
          </button>
        </div>
      ) : (
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit} 
          className="glass p-8 rounded-[2.5rem] border border-brand-accent/20 shadow-2xl relative"
        >
          <button 
            type="button"
            onClick={() => setShowForm(false)}
            className="absolute top-6 right-6 text-gray-500 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
          
          <h4 className="text-xl font-black text-white mb-6 text-center">Partagez votre expérience</h4>
          
          <div className="flex justify-center space-x-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-all ${star <= rating ? 'text-brand-accent scale-110' : 'text-gray-600 hover:text-gray-400'}`}
              >
                <i className="fas fa-star"></i>
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre commentaire..."
            required
            rows={4}
            className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent mb-6"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-brand-accent text-brand-dark font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Publier mon avis'}
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default FeedbackSystem;
