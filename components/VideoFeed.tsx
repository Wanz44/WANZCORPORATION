import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, MessageCircle, Share2, Music, 
  Play, Pause, Volume2, VolumeX, Maximize2 
} from 'lucide-react';

const VideoFeed: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const videos = [
    {
      id: 1,
      url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-dancing-39741-large.mp4',
      author: '@tech_guru',
      description: 'Découvrez les nouvelles tendances IA de 2026 ! #AI #Tech #Future',
      likes: '124K',
      comments: '1.2K',
      music: 'Original Sound - Tech Guru'
    },
    {
      id: 2,
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-dancing-in-a-nightclub-42584-large.mp4',
      author: '@creative_mind',
      description: 'Comment l\'IA transforme l\'art numérique. #DigitalArt #AIArt',
      likes: '89K',
      comments: '850',
      music: 'Creative Vibes - Creative Mind'
    }
  ];

  return (
    <div className="h-full bg-black flex flex-col md:flex-row">
      {/* Main Video Player */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        <video 
          src={videos[activeVideo].url}
          autoPlay
          loop
          muted={isMuted}
          className="h-full max-h-screen w-full object-contain"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        
        {/* Video Info (Mobile Style) */}
        <div className="absolute bottom-6 left-6 right-16 text-white">
          <h3 className="font-black text-lg mb-2">{videos[activeVideo].author}</h3>
          <p className="text-sm mb-4 line-clamp-2">{videos[activeVideo].description}</p>
          <div className="flex items-center space-x-2">
            <Music size={14} className="animate-spin-slow" />
            <span className="text-xs font-bold">{videos[activeVideo].music}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-white">
              <Heart size={24} />
            </button>
            <span className="text-[10px] font-black text-white mt-1">{videos[activeVideo].likes}</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-white">
              <MessageCircle size={24} />
            </button>
            <span className="text-[10px] font-black text-white mt-1">{videos[activeVideo].comments}</span>
          </div>
          <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-white">
            <Share2 size={24} />
          </button>
        </div>

        {/* Controls */}
        <div className="absolute top-6 right-6 flex items-center space-x-4">
          <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-black/40 backdrop-blur-md rounded-xl text-white">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="p-3 bg-black/40 backdrop-blur-md rounded-xl text-white">
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop Style) */}
      <div className="hidden md:flex w-80 bg-brand-dark border-l border-white/10 flex-col p-6">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Suivant</h2>
        <div className="space-y-4 overflow-y-auto">
          {videos.map((v, i) => (
            <button 
              key={v.id}
              onClick={() => setActiveVideo(i)}
              className={`w-full group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all ${activeVideo === i ? 'border-brand-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <video src={v.url} muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={32} className="text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
