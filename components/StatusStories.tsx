import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Heart, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: number;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'image' | 'video';
  reactions: number;
  seen: boolean;
}

interface StatusStoriesProps {
  userProfile: any;
}

const StatusStories: React.FC<StatusStoriesProps> = ({ userProfile }) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [reactionCount, setReactionCount] = useState<Record<number, number>>({});

  const stories: Story[] = [
    { id: 1, userName: 'Marc L.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc', content: 'https://picsum.photos/seed/story1/1080/1920', type: 'image', reactions: 12, seen: false },
    { id: 2, userName: 'Sarah B.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', content: 'https://picsum.photos/seed/story2/1080/1920', type: 'image', reactions: 8, seen: false },
    { id: 3, userName: 'Patrick J.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick', content: 'https://picsum.photos/seed/story3/1080/1920', type: 'image', reactions: 24, seen: true },
    { id: 4, userName: 'Julie K.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie', content: 'https://picsum.photos/seed/story4/1080/1920', type: 'image', reactions: 5, seen: true },
  ];

  const handleReaction = (storyId: number) => {
    setReactionCount(prev => ({
      ...prev,
      [storyId]: (prev[storyId] || stories.find(s => s.id === storyId)?.reactions || 0) + 1
    }));
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar px-1">
        {/* My Story Card */}
        <div className="flex-shrink-0 w-28 h-48 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg">
          <img 
            src={userProfile.avatar} 
            alt="My Story" 
            className="w-full h-3/4 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/4 bg-brand-dark flex flex-col items-center justify-center">
            <div className="absolute -top-4 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center border-4 border-brand-dark shadow-xl">
              <Plus size={16} className="text-brand-dark" />
            </div>
            <span className="text-[9px] font-black text-white uppercase tracking-widest mt-3">Créer</span>
          </div>
        </div>

        {/* Friends Stories Cards */}
        {stories.map(story => (
          <div 
            key={story.id} 
            onClick={() => setSelectedStory(story)}
            className="flex-shrink-0 w-28 h-48 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg"
          >
            <img 
              src={story.content} 
              alt={story.userName} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
            
            {/* User Avatar on Story */}
            <div className={`absolute top-3 left-3 w-8 h-8 rounded-full p-[2px] border-2 ${story.seen ? 'border-white/20' : 'border-brand-accent'} shadow-xl`}>
              <img 
                src={story.userAvatar} 
                alt="" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            
            <span className="absolute bottom-3 left-3 right-3 text-[9px] font-black text-white uppercase tracking-widest truncate shadow-sm">
              {story.userName.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <button 
              onClick={() => setSelectedStory(null)}
              className="absolute top-8 right-8 p-4 text-white/50 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-md aspect-[9/16] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={selectedStory.content} 
                alt="Story content" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Header */}
              <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/60 to-transparent flex items-center space-x-4">
                <img src={selectedStory.userAvatar} alt="" className="w-12 h-12 rounded-full border-2 border-brand-accent" />
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">{selectedStory.userName}</h4>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Il y a 2h</p>
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center space-x-4">
                <div className="flex-1 relative group">
                  <input 
                    type="text" 
                    placeholder="Répondre à la story..." 
                    className="w-full bg-white/10 border border-white/20 rounded-full py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-accent transition-all backdrop-blur-md"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-brand-accent transition-colors">
                    <MessageCircle size={20} />
                  </button>
                </div>
                <button 
                  onClick={() => handleReaction(selectedStory.id)}
                  className="p-4 bg-brand-accent text-brand-dark rounded-full hover:scale-110 active:scale-90 transition-all shadow-xl shadow-brand-accent/20 flex items-center space-x-2"
                >
                  <Heart size={20} className="fill-brand-dark" />
                  <span className="text-xs font-black">{reactionCount[selectedStory.id] || selectedStory.reactions}</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute top-4 left-8 right-8 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  onAnimationComplete={() => setSelectedStory(null)}
                  className="h-full bg-brand-accent"
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            <button className="absolute left-12 p-4 text-white/20 hover:text-white transition-colors hidden lg:block">
              <ChevronLeft size={48} />
            </button>
            <button className="absolute right-12 p-4 text-white/20 hover:text-white transition-colors hidden lg:block">
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusStories;
