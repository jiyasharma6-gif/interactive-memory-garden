import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Heart, MessageSquare, User, Globe } from 'lucide-react';
import { FlowerData } from '../types';
import { Tooltip } from './Tooltip';
import { useAuth } from './AuthContext';

interface MemoryWallProps {
  flowers: FlowerData[];
  onClose: () => void;
}

export function MemoryWall({ flowers, onClose }: MemoryWallProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const { user } = useAuth();

  const filteredFlowers = flowers.filter(f => {
    const matchesSearch = f.planterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        f.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'mine') {
      return matchesSearch && f.userId === user?.uid;
    }
    return matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-2xl overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <h2 className="text-5xl font-black text-gray-900 font-serif italic mb-2 tracking-tight">The Archive of Memories</h2>
            <p className="text-gray-500 font-medium max-w-md">A collection of every wish and dedication planted in this garden.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <Tooltip content="Show all public memories">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Globe size={14} />
                  Global
                </button>
              </Tooltip>
              <Tooltip content="Show only my planted memories">
                <button 
                  onClick={() => setActiveTab('mine')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'mine' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <User size={14} />
                  Personal
                </button>
              </Tooltip>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-gray-100 border-2 border-transparent focus:border-pink-500 focus:bg-white rounded-2xl outline-none w-full sm:w-64 transition-all font-medium text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredFlowers.map((flower, idx) => (
              <motion.div
                key={flower.id || idx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="w-12 h-12 rounded-2xl shadow-inner border-2 border-white"
                    style={{ backgroundColor: flower.color }}
                  />
                  {flower.careCount && flower.careCount > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[10px] font-black text-pink-500 uppercase tracking-widest shadow-sm">
                      <Heart size={10} className="fill-pink-500" />
                      {flower.careCount}
                    </div>
                  )}
                </div>

                <MessageSquare className="text-gray-200 mb-4" size={32} />
                <p className="text-lg font-medium text-gray-800 leading-relaxed mb-6 italic">"{flower.message}"</p>
                
                <div className="pt-6 border-t border-gray-200/50">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Planted By</span>
                  <p className="text-gray-900 font-bold">{flower.planterName}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredFlowers.length === 0 && (
          <div className="text-center py-40">
            <p className="text-gray-400 font-medium text-xl">No memories match your search.</p>
          </div>
        )}
      </div>

      <Tooltip content="Close Archive" position="left">
        <button 
          onClick={onClose}
          className="fixed top-10 right-10 p-4 bg-gray-900 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-[80]"
        >
          <X size={24} />
        </button>
      </Tooltip>
    </motion.div>
  );
}
