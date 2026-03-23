import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Package, Plus, Minus, Search, Trash2, Save, AlertCircle, RefreshCw } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  lastUpdated: any;
}

const StockManager: React.FC = () => {
  const [items, setItems] = useState<StockItem[]>([]);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'stock'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stockItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockItem));
      setItems(stockItems);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      unsubscribe();
    };
  }, []);

  const startScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    setScannedId(decodedText);
    stopScanner();
    
    const docRef = doc(db, 'stock', decodedText);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setSelectedItem({ id: docSnap.id, ...docSnap.data() } as StockItem);
    } else {
      setSelectedItem({ id: decodedText, name: '', quantity: 0, price: 0, lastUpdated: Timestamp.now() });
    }
  };

  const onScanFailure = (error: any) => {
    // Silent failure for continuous scanning
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    await setDoc(doc(db, 'stock', selectedItem.id), {
      ...selectedItem,
      lastUpdated: Timestamp.now()
    });
    setSelectedItem(null);
    setScannedId(null);
  };

  const updateQuantity = async (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    await updateDoc(doc(db, 'stock', id), {
      quantity: newQty,
      lastUpdated: Timestamp.now()
    });
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Scanner & Editor */}
        <div className="lg:col-span-5 space-y-6">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white flex items-center">
                <QrCode className="mr-3 text-brand-accent" size={20} />
                Scanner QR Code
              </h3>
              {isScanning && (
                <button onClick={stopScanner} className="text-red-500 hover:scale-110 transition-transform">
                  <Trash2 size={24} />
                </button>
              )}
            </div>

            {!isScanning ? (
              <button 
                onClick={startScanner}
                className="w-full aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center group hover:border-brand-accent/50 transition-all"
              >
                <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent mb-4 group-hover:scale-110 transition-transform">
                  <QrCode size={40} />
                </div>
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Activer la Caméra</span>
              </button>
            ) : (
              <div id="reader" className="w-full rounded-[2rem] overflow-hidden border-2 border-brand-accent"></div>
            )}
          </section>

          <AnimatePresence>
            {selectedItem && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="glass p-8 rounded-[2.5rem] border border-brand-accent/30 bg-brand-accent/5"
              >
                <h3 className="text-lg font-black text-white mb-6 flex items-center">
                  <Package className="mr-3 text-brand-accent" size={20} />
                  Détails du Produit
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">ID / Code Barre</label>
                    <input
                      readOnly
                      value={selectedItem.id}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Nom du Produit</label>
                    <input
                      placeholder="Ex: Marteau de chantier"
                      value={selectedItem.name}
                      onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Quantité</label>
                      <input
                        type="number"
                        value={selectedItem.quantity}
                        onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Prix Unitaire (€)</label>
                      <input
                        type="number"
                        value={selectedItem.price}
                        onChange={(e) => setSelectedItem({ ...selectedItem, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    className="w-full py-4 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-brand-accent/20 hover:brightness-110 transition-all flex items-center justify-center"
                  >
                    <Save className="mr-2" size={16} /> Enregistrer
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-7 space-y-6">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h3 className="text-xl font-black text-white flex items-center">
                <Package className="mr-3 text-brand-accent" size={20} />
                Inventaire
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-white text-sm outline-none focus:border-brand-accent w-full md:w-64"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredItems.map(item => (
                <div key={item.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-brand-accent/30 transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 font-black text-xs">
                      {item.id.substring(0, 4)}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">{item.name || 'Produit sans nom'}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Prix: {item.price}€ | MAJ: {new Date(item.lastUpdated?.toDate()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`text-xl font-black px-4 py-2 rounded-xl ${item.quantity < 5 ? 'bg-red-500/20 text-red-500' : 'bg-brand-accent/20 text-brand-accent'}`}>
                      {item.quantity}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-brand-accent hover:bg-brand-accent/10 rounded-md transition-colors">
                        <Plus size={16} />
                      </button>
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                        <Minus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="text-center py-20 text-gray-500 italic text-sm">
                  {searchQuery ? 'Aucun résultat pour cette recherche.' : 'Votre inventaire est vide. Scannez un produit pour commencer.'}
                </div>
              )}
            </div>
          </section>

          {items.some(i => i.quantity < 5) && (
            <div className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center space-x-4">
              <AlertCircle className="text-red-500" size={24} />
              <div>
                <h5 className="text-sm font-black text-white uppercase tracking-widest">Alerte Stock Faible</h5>
                <p className="text-xs text-gray-400">Certains produits ont une quantité inférieure à 5 unités.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManager;
