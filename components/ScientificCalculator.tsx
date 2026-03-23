import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Square, 
  Circle, 
  Triangle, 
  BarChart3, 
  Variable, 
  Cpu, 
  Plus, 
  Minus, 
  X, 
  Divide, 
  ChevronRight,
  RefreshCw,
  Hash,
  Sigma,
  Binary
} from 'lucide-react';

type CalcMode = 'algebra' | 'geometry' | 'statistics' | 'algorithms';

const ScientificCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('algebra');

  // Algebra State
  const [algebraInput, setAlgebraInput] = useState({ a: 0, b: 0, c: 0 });
  const [algebraResult, setAlgebraResult] = useState<string | null>(null);

  // Geometry State
  const [geoShape, setGeoShape] = useState<'circle' | 'square' | 'triangle' | 'rectangle'>('circle');
  const [geoInput, setGeoInput] = useState({ r: 0, w: 0, h: 0, a: 0, b: 0, c: 0 });
  const [geoResult, setGeoResult] = useState<number | null>(null);

  // Statistics State
  const [statsInput, setStatsInput] = useState('');
  const [statsResult, setStatsResult] = useState<{ mean: number, median: number, stdDev: number } | null>(null);

  // Algorithms State
  const [algoInput, setAlgoInput] = useState(0);
  const [algoResult, setAlgoResult] = useState<any>(null);

  // Algebra Logic: Quadratic Equation Solver
  const solveQuadratic = () => {
    const { a, b, c } = algebraInput;
    if (a === 0) {
      setAlgebraResult("Ce n'est pas une équation quadratique (a=0).");
      return;
    }
    const delta = b * b - 4 * a * c;
    if (delta < 0) {
      setAlgebraResult("Pas de racines réelles (Δ < 0).");
    } else if (delta === 0) {
      const x = -b / (2 * a);
      setAlgebraResult(`Une racine réelle : x = ${x.toFixed(2)}`);
    } else {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      setAlgebraResult(`Deux racines réelles : x1 = ${x1.toFixed(2)}, x2 = ${x2.toFixed(2)}`);
    }
  };

  // Geometry Logic
  const calculateGeo = () => {
    let res = 0;
    switch (geoShape) {
      case 'circle': res = Math.PI * geoInput.r * geoInput.r; break;
      case 'square': res = geoInput.w * geoInput.w; break;
      case 'rectangle': res = geoInput.w * geoInput.h; break;
      case 'triangle': 
        const s = (geoInput.a + geoInput.b + geoInput.c) / 2;
        res = Math.sqrt(s * (s - geoInput.a) * (s - geoInput.b) * (s - geoInput.c));
        break;
    }
    setGeoResult(res);
  };

  // Statistics Logic
  const calculateStats = () => {
    const nums = statsInput.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (nums.length === 0) return;

    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
    const stdDev = Math.sqrt(variance);

    setStatsResult({ mean, median, stdDev });
  };

  // Algorithms Logic
  const calculateAlgo = (type: 'fib' | 'prime' | 'fact') => {
    const n = Math.floor(algoInput);
    if (n < 0) return;

    switch (type) {
      case 'fib':
        let a = 0, b = 1, temp;
        const sequence = [0];
        for (let i = 1; i <= n; i++) {
          sequence.push(b);
          temp = a + b;
          a = b;
          b = temp;
        }
        setAlgoResult(sequence.join(', '));
        break;
      case 'prime':
        const isPrime = (num: number) => {
          for (let i = 2, s = Math.sqrt(num); i <= s; i++)
            if (num % i === 0) return false;
          return num > 1;
        };
        setAlgoResult(isPrime(n) ? `${n} est un nombre premier.` : `${n} n'est pas un nombre premier.`);
        break;
      case 'fact':
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        setAlgoResult(`${n}! = ${f}`);
        break;
    }
  };

  const modes = [
    { id: 'algebra', name: 'Algèbre', icon: <Variable size={20} />, color: 'text-blue-500' },
    { id: 'geometry', name: 'Géométrie', icon: <Square size={20} />, color: 'text-emerald-500' },
    { id: 'statistics', name: 'Statistiques', icon: <BarChart3 size={20} />, color: 'text-purple-500' },
    { id: 'algorithms', name: 'Algorithmes', icon: <Cpu size={20} />, color: 'text-orange-500' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar: Mode Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-8 flex items-center">
              <Calculator className="mr-3 text-brand-accent" size={20} />
              Calculatrice
            </h3>
            <div className="space-y-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as CalcMode)}
                  className={`w-full p-5 rounded-2xl border transition-all flex items-center space-x-4 group ${
                    mode === m.id 
                      ? 'bg-brand-accent border-brand-accent text-brand-dark' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${mode === m.id ? 'bg-brand-dark/20' : 'bg-white/5'}`}>
                    {m.icon}
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-10 rounded-[3rem] border border-white/5 min-h-[500px]"
            >
              {mode === 'algebra' && (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Résolveur d'Équation Quadratique</h4>
                    <p className="text-sm text-gray-400 mb-8 italic">Format: ax² + bx + c = 0</p>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valeur a</label>
                        <input
                          type="number"
                          value={algebraInput.a}
                          onChange={(e) => setAlgebraInput({ ...algebraInput, a: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valeur b</label>
                        <input
                          type="number"
                          value={algebraInput.b}
                          onChange={(e) => setAlgebraInput({ ...algebraInput, b: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valeur c</label>
                        <input
                          type="number"
                          value={algebraInput.c}
                          onChange={(e) => setAlgebraInput({ ...algebraInput, c: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={solveQuadratic}
                      className="mt-8 w-full py-5 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-accent/20 hover:brightness-110 transition-all"
                    >
                      Résoudre l'Équation
                    </button>
                  </div>

                  {algebraResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-white/5 rounded-2xl border border-brand-accent/30"
                    >
                      <h5 className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2">Résultat</h5>
                      <p className="text-xl font-black text-white">{algebraResult}</p>
                    </motion.div>
                  )}
                </div>
              )}

              {mode === 'geometry' && (
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Calculateur de Surface</h4>
                  <div className="flex flex-wrap gap-4 mb-8">
                    {[
                      { id: 'circle', name: 'Cercle', icon: <Circle size={16} /> },
                      { id: 'square', name: 'Carré', icon: <Square size={16} /> },
                      { id: 'rectangle', name: 'Rectangle', icon: <Square size={16} className="scale-x-125" /> },
                      { id: 'triangle', name: 'Triangle', icon: <Triangle size={16} /> },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setGeoShape(s.id as any)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center space-x-2 ${
                          geoShape === s.id ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {s.icon} <span>{s.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {geoShape === 'circle' && (
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rayon (r)</label>
                        <input
                          type="number"
                          value={geoInput.r}
                          onChange={(e) => setGeoInput({ ...geoInput, r: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                        />
                      </div>
                    )}
                    {(geoShape === 'square' || geoShape === 'rectangle') && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Largeur (w)</label>
                        <input
                          type="number"
                          value={geoInput.w}
                          onChange={(e) => setGeoInput({ ...geoInput, w: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                        />
                      </div>
                    )}
                    {geoShape === 'rectangle' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hauteur (h)</label>
                        <input
                          type="number"
                          value={geoInput.h}
                          onChange={(e) => setGeoInput({ ...geoInput, h: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                        />
                      </div>
                    )}
                    {geoShape === 'triangle' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Côté a</label>
                          <input
                            type="number"
                            value={geoInput.a}
                            onChange={(e) => setGeoInput({ ...geoInput, a: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Côté b</label>
                          <input
                            type="number"
                            value={geoInput.b}
                            onChange={(e) => setGeoInput({ ...geoInput, b: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Côté c</label>
                          <input
                            type="number"
                            value={geoInput.c}
                            onChange={(e) => setGeoInput({ ...geoInput, c: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black outline-none focus:border-brand-accent"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={calculateGeo}
                    className="w-full py-5 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-accent/20 hover:brightness-110 transition-all"
                  >
                    Calculer la Surface
                  </button>

                  {geoResult !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-white/5 rounded-2xl border border-brand-accent/30"
                    >
                      <h5 className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2">Surface</h5>
                      <p className="text-3xl font-black text-white">{geoResult.toFixed(4)} <span className="text-sm text-gray-500">unités²</span></p>
                    </motion.div>
                  )}
                </div>
              )}

              {mode === 'statistics' && (
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Analyse Statistique</h4>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Série de Nombres (séparés par des virgules)</label>
                    <textarea
                      placeholder="Ex: 10, 20, 15, 30, 25"
                      value={statsInput}
                      onChange={(e) => setStatsInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-black outline-none focus:border-brand-accent min-h-[120px]"
                    />
                  </div>

                  <button
                    onClick={calculateStats}
                    className="w-full py-5 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-accent/20 hover:brightness-110 transition-all"
                  >
                    Lancer l'Analyse
                  </button>

                  {statsResult && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Moyenne</p>
                        <p className="text-xl font-black text-brand-accent">{statsResult.mean.toFixed(2)}</p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Médiane</p>
                        <p className="text-xl font-black text-white">{statsResult.median.toFixed(2)}</p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Écart-Type</p>
                        <p className="text-xl font-black text-brand-purple">{statsResult.stdDev.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mode === 'algorithms' && (
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Algorithmes Mathématiques</h4>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valeur d'Entrée (n)</label>
                    <input
                      type="number"
                      value={algoInput}
                      onChange={(e) => setAlgoInput(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-white font-black outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => calculateAlgo('fib')}
                      className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-accent transition-all group"
                    >
                      <Binary className="mx-auto mb-3 text-gray-500 group-hover:text-brand-accent" size={24} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Fibonacci</span>
                    </button>
                    <button
                      onClick={() => calculateAlgo('prime')}
                      className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-accent transition-all group"
                    >
                      <Hash className="mx-auto mb-3 text-gray-500 group-hover:text-brand-accent" size={24} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Premier ?</span>
                    </button>
                    <button
                      onClick={() => calculateAlgo('fact')}
                      className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-accent transition-all group"
                    >
                      <Sigma className="mx-auto mb-3 text-gray-500 group-hover:text-brand-accent" size={24} />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Factorielle</span>
                    </button>
                  </div>

                  {algoResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-white/5 rounded-2xl border border-brand-accent/30"
                    >
                      <h5 className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2">Résultat Algorithmique</h5>
                      <p className="text-sm font-mono text-white break-all">{algoResult}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
