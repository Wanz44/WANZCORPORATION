import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';
import { FileText, Send, Plus, Trash2, User, Building, Calculator, Briefcase } from 'lucide-react';

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const QuoteGenerator: React.FC = () => {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    project: '',
    phone: ''
  });

  const [items, setItems] = useState<QuoteItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [taxRate, setTaxRate] = useState(20);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const calculateTax = () => calculateSubtotal() * (taxRate / 100);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVIS PROFESSIONNEL', margin, y);
    y += 15;

    // Client Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client: ${clientInfo.name}`, margin, y);
    y += 5;
    doc.text(`Adresse: ${clientInfo.address}`, margin, y);
    y += 5;
    doc.text(`Projet: ${clientInfo.project}`, margin, y);
    y += 15;

    // Table Header
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin, y);
    doc.text('Qté', 140, y);
    doc.text('P.U.', 160, y);
    doc.text('Total', 180, y);
    y += 5;
    doc.line(margin, y, 190, y);
    y += 10;

    // Items
    doc.setFont('helvetica', 'normal');
    items.forEach(item => {
      const total = item.quantity * item.unitPrice;
      doc.text(item.description, margin, y);
      doc.text(item.quantity.toString(), 140, y);
      doc.text(`${item.unitPrice}€`, 160, y);
      doc.text(`${total}€`, 180, y);
      y += 8;
    });

    y += 10;
    doc.line(140, y, 190, y);
    y += 10;

    // Totals
    doc.text('Sous-total:', 140, y);
    doc.text(`${calculateSubtotal().toFixed(2)}€`, 180, y);
    y += 8;
    doc.text(`TVA (${taxRate}%):`, 140, y);
    doc.text(`${calculateTax().toFixed(2)}€`, 180, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 140, y);
    doc.text(`${calculateTotal().toFixed(2)}€`, 180, y);

    return doc;
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(`devis_${clientInfo.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleWhatsApp = () => {
    const message = `Bonjour ${clientInfo.name}, voici le devis pour le projet : ${clientInfo.project}. Total: ${calculateTotal().toFixed(2)}€. Je vous l'envoie par mail également.`;
    const encodedMessage = encodeURIComponent(message);
    const phone = clientInfo.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-black text-white mb-6 flex items-center">
              <User className="mr-3 text-brand-accent" size={20} />
              Informations Client & Projet
            </h3>
            <div className="grid gap-4">
              <input
                placeholder="Nom du Client"
                value={clientInfo.name}
                onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
              />
              <input
                placeholder="Téléphone (ex: 33612345678)"
                value={clientInfo.phone}
                onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
              />
              <input
                placeholder="Adresse du Chantier"
                value={clientInfo.address}
                onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
              />
              <input
                placeholder="Nom du Projet / Travaux"
                value={clientInfo.project}
                onChange={(e) => setClientInfo({ ...clientInfo, project: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent"
              />
            </div>
          </section>

          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white flex items-center">
                <Calculator className="mr-3 text-brand-accent" size={20} />
                Détails de la Prestation
              </h3>
              <button onClick={addItem} className="text-brand-accent hover:scale-110 transition-transform">
                <Plus size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-6">
                    <input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(i, 'description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="P.U."
                      value={item.unitPrice}
                      onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="col-span-1">
                    <button onClick={() => removeItem(i)} className="text-gray-500 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Taux TVA (%)</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-right outline-none focus:border-brand-accent"
                />
              </div>
              <div className="flex justify-between items-center text-2xl font-black text-white">
                <span>Total TTC</span>
                <span className="text-brand-accent">{calculateTotal().toFixed(2)}€</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDownload}
              className="py-5 bg-white/5 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <FileText className="mr-3" size={20} />
              PDF
            </button>
            <button
              onClick={handleWhatsApp}
              className="py-5 bg-green-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-green-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              <Send className="mr-3" size={20} />
              WhatsApp
            </button>
          </div>
        </div>

        <div className="hidden lg:block sticky top-32 h-fit">
          <div className="bg-white rounded-lg shadow-2xl p-12 min-h-[600px] text-gray-800 font-sans">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">DEVIS</h1>
                <p className="text-gray-500 text-sm">N° 2026-001</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-accent">WANZCORP BTP</p>
                <p className="text-xs text-gray-500">Service Intelligent</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Destinataire</h4>
                <p className="font-bold">{clientInfo.name || 'Nom du Client'}</p>
                <p className="text-sm text-gray-600">{clientInfo.address || 'Adresse du Chantier'}</p>
              </div>
              <div className="text-right">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date</h4>
                <p className="font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full mb-12">
              <thead>
                <tr className="border-b-2 border-gray-100 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="pb-4">Description</th>
                  <th className="pb-4 text-center">Qté</th>
                  <th className="pb-4 text-right">P.U.</th>
                  <th className="pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-4">{item.description || 'Description...'}</td>
                    <td className="py-4 text-center">{item.quantity}</td>
                    <td className="py-4 text-right">{item.unitPrice}€</td>
                    <td className="py-4 text-right font-bold">{(item.quantity * item.unitPrice).toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="w-64 ml-auto space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-bold">{calculateSubtotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">TVA ({taxRate}%)</span>
                <span className="font-bold">{calculateTax().toFixed(2)}€</span>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div className="flex justify-between text-lg">
                <span className="font-black text-gray-900">Total TTC</span>
                <span className="font-black text-brand-accent">{calculateTotal().toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteGenerator;
