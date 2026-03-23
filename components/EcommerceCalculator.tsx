import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calculator, DollarSign, Truck, Megaphone, Receipt, TrendingUp, AlertCircle } from 'lucide-react';

const EcommerceCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    sellingPrice: 0,
    productCost: 0,
    shippingCost: 0,
    adSpendPerSale: 0,
    taxRate: 20,
    platformFees: 5,
    otherCosts: 0
  });

  const calculateMetrics = () => {
    const sellingPrice = inputs.sellingPrice;
    const taxes = sellingPrice * (inputs.taxRate / 100);
    const platformFees = sellingPrice * (inputs.platformFees / 100);
    const totalCosts = inputs.productCost + inputs.shippingCost + inputs.adSpendPerSale + taxes + platformFees + inputs.otherCosts;
    const netProfit = sellingPrice - totalCosts;
    const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
    const breakEvenAdSpend = sellingPrice - (inputs.productCost + inputs.shippingCost + taxes + platformFees + inputs.otherCosts);

    return {
      taxes,
      platformFees,
      totalCosts,
      netProfit,
      margin,
      breakEvenAdSpend
    };
  };

  const metrics = calculateMetrics();

  const chartData = [
    { name: 'Coût Produit', value: inputs.productCost, color: '#00FFF0' },
    { name: 'Livraison', value: inputs.shippingCost, color: '#A855F7' },
    { name: 'Publicité', value: inputs.adSpendPerSale, color: '#F59E0B' },
    { name: 'Taxes', value: metrics.taxes, color: '#EF4444' },
    { name: 'Frais Plateforme', value: metrics.platformFees, color: '#10B981' },
    { name: 'Autres', value: inputs.otherCosts, color: '#6B7280' },
    { name: 'Profit Net', value: Math.max(0, metrics.netProfit), color: '#3B82F6' }
  ].filter(item => item.value > 0);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-5 space-y-6">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-8 flex items-center">
              <Calculator className="mr-3 text-brand-accent" size={20} />
              Paramètres de Vente
            </h3>
            <div className="space-y-6">
              <div className="grid gap-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Prix de Vente TTC (€)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                  <input
                    type="number"
                    value={inputs.sellingPrice}
                    onChange={(e) => setInputs({ ...inputs, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg font-black outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                    <TrendingUp size={12} className="mr-1" /> Coût Produit
                  </label>
                  <input
                    type="number"
                    value={inputs.productCost}
                    onChange={(e) => setInputs({ ...inputs, productCost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                    <Truck size={12} className="mr-1" /> Livraison
                  </label>
                  <input
                    type="number"
                    value={inputs.shippingCost}
                    onChange={(e) => setInputs({ ...inputs, shippingCost: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                    <Megaphone size={12} className="mr-1" /> Pub / Vente
                  </label>
                  <input
                    type="number"
                    value={inputs.adSpendPerSale}
                    onChange={(e) => setInputs({ ...inputs, adSpendPerSale: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                    <Receipt size={12} className="mr-1" /> Taxes (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.taxRate}
                    onChange={(e) => setInputs({ ...inputs, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                    Frais Plateforme (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.platformFees}
                    onChange={(e) => setInputs({ ...inputs, platformFees: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                    Autres Frais
                  </label>
                  <input
                    type="number"
                    value={inputs.otherCosts}
                    onChange={(e) => setInputs({ ...inputs, otherCosts: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] border border-white/5 bg-brand-accent/5">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Break-Even ROAS</h4>
                <p className="text-2xl font-black text-brand-accent">
                  {(inputs.sellingPrice / (inputs.sellingPrice - metrics.breakEvenAdSpend)).toFixed(2)}
                </p>
                <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                  C'est le ROAS minimum nécessaire pour ne pas perdre d'argent sur chaque vente.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Dashboard */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2.5rem] border border-white/5">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Marge Nette</h4>
              <div className="flex items-baseline space-x-2">
                <span className={`text-4xl font-black ${metrics.margin > 0 ? 'text-brand-accent' : 'text-red-500'}`}>
                  {metrics.margin.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-white/5">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Profit Net / Vente</h4>
              <div className="flex items-baseline space-x-2">
                <span className={`text-4xl font-black ${metrics.netProfit > 0 ? 'text-brand-accent' : 'text-red-500'}`}>
                  {metrics.netProfit.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          <section className="glass p-10 rounded-[3rem] border border-white/5 h-[400px]">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Répartition des Coûts</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </section>

          <section className="glass p-10 rounded-[3rem] border border-white/5 h-[300px]">
             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Structure de Coût vs Prix de Vente</h4>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Vente', total: inputs.sellingPrice, costs: metrics.totalCosts, profit: metrics.netProfit }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="costs" fill="#EF4444" radius={[4, 4, 0, 0]} name="Coûts Totaux" />
                  <Bar dataKey="profit" fill="#00FFF0" radius={[4, 4, 0, 0]} name="Profit Net" />
                </BarChart>
             </ResponsiveContainer>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EcommerceCalculator;
