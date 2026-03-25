import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Filter, ShoppingBag, Heart, 
  MapPin, Tag, Star, ArrowRight, Plus 
} from 'lucide-react';

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tout', icon: <ShoppingBag size={14} /> },
    { id: 'tech', name: 'Tech', icon: <Tag size={14} /> },
    { id: 'fashion', name: 'Mode', icon: <Tag size={14} /> },
    { id: 'home', name: 'Maison', icon: <Tag size={14} /> },
    { id: 'services', name: 'Services', icon: <Tag size={14} /> }
  ];

  const items = [
    {
      id: 1,
      title: 'MacBook Pro M3 Max',
      price: '3,499',
      location: 'Kinshasa, Gombe',
      rating: 4.9,
      image: 'https://picsum.photos/seed/macbook/400/300',
      category: 'tech'
    },
    {
      id: 2,
      title: 'iPhone 15 Pro Max',
      price: '1,199',
      location: 'Lubumbashi',
      rating: 4.8,
      image: 'https://picsum.photos/seed/iphone/400/300',
      category: 'tech'
    },
    {
      id: 3,
      title: 'Service de Développement Web',
      price: '500+',
      location: 'Remote',
      rating: 5.0,
      image: 'https://picsum.photos/seed/web/400/300',
      category: 'services'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Marketplace</h2>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Trouvez les meilleures offres locales</p>
        </div>
        <button className="flex items-center space-x-3 px-8 py-4 bg-brand-accent text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl shadow-brand-accent/20">
          <Plus size={18} />
          <span>Vendre un article</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher sur le marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-brand-accent text-brand-dark' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass rounded-[2.5rem] overflow-hidden border border-white/10 hover:-translate-y-2 transition-all duration-500"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <button className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-xl text-white hover:text-red-500 transition-colors">
                <Heart size={18} />
              </button>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-brand-accent text-brand-dark rounded-lg text-[10px] font-black uppercase tracking-widest">
                ${item.price}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-white group-hover:text-brand-accent transition-colors truncate">{item.title}</h3>
                <div className="flex items-center space-x-1 text-brand-accent">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[10px] font-black">{item.rating}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                <MapPin size={12} />
                <span>{item.location}</span>
              </div>
              <button className="w-full flex items-center justify-center space-x-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent hover:text-brand-dark transition-all">
                <span>Voir les détails</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
