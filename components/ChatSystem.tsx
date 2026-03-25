import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Search, Phone, Video, MoreVertical, Smile, MessageCircle } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage: string;
}

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ isOpen, onClose, userProfile }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const contacts: Contact[] = [
    { id: 'contact_1', name: 'Marc L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc', status: 'online', lastMessage: 'On se voit demain ?' },
    { id: 'contact_2', name: 'Sarah B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'offline', lastMessage: 'Merci pour le lien !' },
    { id: 'contact_3', name: 'Patrick J.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick', status: 'online', lastMessage: 'Le projet avance bien.' },
  ];

  // Get a deterministic conversation ID for two users
  const getConversationId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join('_');
  };

  useEffect(() => {
    if (!selectedContact || !auth.currentUser) return;

    const convId = getConversationId(auth.currentUser.uid, selectedContact.id);
    const q = query(
      collection(db, 'conversations', convId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `conversations/${convId}/messages`);
    });

    return () => unsubscribe();
  }, [selectedContact]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact || !auth.currentUser) return;

    const convId = getConversationId(auth.currentUser.uid, selectedContact.id);
    const messageData = {
      conversationId: convId,
      senderId: auth.currentUser.uid,
      text: messageText,
      createdAt: serverTimestamp()
    };

    try {
      // Ensure conversation document exists
      const convRef = doc(db, 'conversations', convId);
      const convSnap = await getDoc(convRef);
      if (!convSnap.exists()) {
        await setDoc(convRef, {
          participants: [auth.currentUser.uid, selectedContact.id],
          updatedAt: serverTimestamp(),
          lastMessage: messageText,
          lastMessageAt: serverTimestamp()
        });
      } else {
        await setDoc(convRef, {
          updatedAt: serverTimestamp(),
          lastMessage: messageText,
          lastMessageAt: serverTimestamp()
        }, { merge: true });
      }

      await addDoc(collection(db, 'conversations', convId, 'messages'), messageData);
      setMessageText('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `conversations/${convId}/messages`);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 right-6 w-[400px] h-[600px] glass border border-white/10 rounded-[2.5rem] shadow-2xl z-[60] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 bg-white/5 border-bottom border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <MessageCircle className="text-brand-accent" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Messages</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">3 Discussions actives</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Contacts List */}
            {!selectedContact ? (
              <div className="w-full flex flex-col">
                <div className="p-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Rechercher un ami..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-accent transition-all"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {contacts.map(contact => (
                    <button 
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="w-full p-3 rounded-2xl hover:bg-white/5 flex items-center space-x-3 transition-colors text-left group"
                    >
                      <div className="relative">
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full border border-white/10 object-cover" />
                        {contact.status === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-accent rounded-full border-2 border-brand-dark"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">{contact.name}</h4>
                          <span className="text-[8px] text-gray-500 font-bold uppercase">10:30</span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate group-hover:text-gray-300 transition-colors">{contact.lastMessage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Window */
              <div className="w-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                      <X size={16} className="rotate-45" />
                    </button>
                    <div className="relative">
                      <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full border border-white/10" />
                      {selectedContact.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-brand-dark"></span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">{selectedContact.name}</h4>
                      <p className="text-[8px] text-brand-accent font-bold uppercase tracking-widest">{selectedContact.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400"><Phone size={16} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400"><Video size={16} /></button>
                  </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl text-xs leading-relaxed ${
                        msg.senderId === auth.currentUser?.uid 
                          ? 'bg-brand-accent text-brand-dark font-bold rounded-tr-none' 
                          : 'bg-white/10 text-white rounded-tl-none'
                      }`}>
                        {msg.text}
                        <div className={`text-[8px] mt-2 opacity-50 ${msg.senderId === auth.currentUser?.uid ? 'text-right' : 'text-left'}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/5 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-brand-accent transition-colors"><Smile size={20} /></button>
                    <input 
                      type="text" 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Écrivez votre message..." 
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:outline-none focus:border-brand-accent transition-all"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="p-3 bg-brand-accent text-brand-dark rounded-2xl disabled:opacity-50 disabled:grayscale hover:scale-105 transition-all shadow-lg shadow-brand-accent/20"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSystem;
