import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Trophy, TrendingUp, Users, Calendar, Activity, Zap, Info, ArrowRight } from 'lucide-react';

const MOCK_MATCHES = [
  { id: 1, home: 'Real Madrid', away: 'Barcelona', homeProb: 45, drawProb: 25, awayProb: 30, homeForm: [1, 1, 0, 1, 1], awayForm: [1, 0, 1, 1, 0], xG: 2.1, xGA: 1.2 },
  { id: 2, home: 'Man City', away: 'Liverpool', homeProb: 55, drawProb: 20, awayProb: 25, homeForm: [1, 1, 1, 0, 1], awayForm: [1, 1, 0, 1, 1], xG: 2.4, xGA: 0.9 },
  { id: 3, home: 'PSG', away: 'Marseille', homeProb: 70, drawProb: 15, awayProb: 15, homeForm: [1, 1, 1, 1, 1], awayForm: [0, 1, 0, 1, 0], xG: 3.2, xGA: 0.8 },
  { id: 4, home: 'Bayern', away: 'Dortmund', homeProb: 60, drawProb: 20, awayProb: 20, homeForm: [1, 1, 0, 1, 1], awayForm: [1, 0, 1, 1, 1], xG: 2.8, xGA: 1.1 },
];

const SportsDashboard: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState(MOCK_MATCHES[0]);
  const [loading, setLoading] = useState(false);

  const getFormColor = (val: number) => val === 1 ? 'bg-green-500' : val === 0 ? 'bg-red-500' : 'bg-gray-500';

  const probData = [
    { name: 'Victoire Domicile', value: selectedMatch.homeProb, color: '#00FFF0' },
    { name: 'Nul', value: selectedMatch.drawProb, color: '#6B7280' },
    { name: 'Victoire Extérieur', value: selectedMatch.awayProb, color: '#A855F7' }
  ];

  const statData = [
    { name: 'xG (Attaque)', home: selectedMatch.xG, away: selectedMatch.xGA + 0.5 },
    { name: 'xGA (Défense)', home: selectedMatch.xGA, away: selectedMatch.xG - 0.5 },
    { name: 'Possession', home: 55, away: 45 },
    { name: 'Tirs / Match', home: 15, away: 12 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Match List */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-8 flex items-center">
              <Calendar className="mr-3 text-brand-accent" size={20} />
              Matchs du Jour
            </h3>
            <div className="space-y-4">
              {MOCK_MATCHES.map(match => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full p-6 rounded-2xl border transition-all text-left group ${selectedMatch.id === match.id ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ligue 1 / Champions League</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Live</span>
                  </div>
                  <div className="flex justify-between items-center font-black text-sm uppercase tracking-widest">
                    <span>{match.home}</span>
                    <span className="text-brand-accent mx-2">VS</span>
                    <span>{match.away}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] border border-brand-accent/30 bg-brand-accent/5">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Conseil de l'Algorithme</h4>
                <p className="text-lg font-black text-brand-accent">
                  {selectedMatch.homeProb > 60 ? `Victoire ${selectedMatch.home}` : selectedMatch.awayProb > 60 ? `Victoire ${selectedMatch.away}` : 'Match Serré - Double Chance'}
                </p>
                <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                  Basé sur les xG récents et la forme actuelle des équipes.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Stats Dashboard */}
        <div className="lg:col-span-8 space-y-8">
          <section className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
            
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                   <Users size={32} className="text-brand-accent" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedMatch.home}</h2>
                <div className="flex justify-center space-x-1 mt-2">
                  {selectedMatch.homeForm.map((v, i) => <div key={i} className={`w-2 h-2 rounded-full ${getFormColor(v)}`} />)}
                </div>
              </div>

              <div className="text-center px-8">
                <div className="text-4xl font-black text-brand-accent mb-2">VS</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Probabilités</div>
              </div>

              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                   <Users size={32} className="text-brand-purple" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedMatch.away}</h2>
                <div className="flex justify-center space-x-1 mt-2">
                  {selectedMatch.awayForm.map((v, i) => <div key={i} className={`w-2 h-2 rounded-full ${getFormColor(v)}`} />)}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Domicile</p>
                <p className="text-3xl font-black text-brand-accent">{selectedMatch.homeProb}%</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nul</p>
                <p className="text-3xl font-black text-white">{selectedMatch.drawProb}%</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Extérieur</p>
                <p className="text-3xl font-black text-brand-purple">{selectedMatch.awayProb}%</p>
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section className="glass p-10 rounded-[3rem] border border-white/5 h-[350px]">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Comparaison des Stats</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#666" width={100} fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="home" fill="#00FFF0" radius={[0, 4, 4, 0]} name={selectedMatch.home} />
                  <Bar dataKey="away" fill="#A855F7" radius={[0, 4, 4, 0]} name={selectedMatch.away} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="glass p-10 rounded-[3rem] border border-white/5 h-[350px]">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Évolution de la Forme (xG)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'M-5', home: 1.2, away: 0.8 },
                  { name: 'M-4', home: 1.8, away: 1.5 },
                  { name: 'M-3', home: 2.1, away: 1.2 },
                  { name: 'M-2', home: 1.5, away: 2.0 },
                  { name: 'M-1', home: 2.4, away: 1.8 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="home" stroke="#00FFF0" fillOpacity={0.1} fill="#00FFF0" name={selectedMatch.home} />
                  <Area type="monotone" dataKey="away" stroke="#A855F7" fillOpacity={0.1} fill="#A855F7" name={selectedMatch.away} />
                </AreaChart>
              </ResponsiveContainer>
            </section>
          </div>

          <section className="glass p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-accent mr-6">
                <Info size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Source des Données</h4>
                <p className="text-xs text-gray-500">API Football-Data.org & Stats Perform (Simulé)</p>
              </div>
            </div>
            <button className="flex items-center text-brand-accent font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform">
              Voir plus de stats <ArrowRight size={16} className="ml-2" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SportsDashboard;
