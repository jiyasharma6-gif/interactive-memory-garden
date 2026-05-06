import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { usePoints } from './PointsContext';

interface ShopProps {
  onClose: () => void;
}

const ITEMS = [
  { id: 'rare', name: 'Rare Bloom', cost: 100, color: 'text-gray-400', icon: Star, desc: 'Unlocks silver glowing flowers' },
  { id: 'legendary', name: 'Legendary Glint', cost: 500, color: 'text-yellow-500', icon: Sparkles, desc: 'Unlocks golden astral flowers' },
];

export function Shop({ onClose }: ShopProps) {
  const { points, unlockedSkins, unlockSkin } = usePoints();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-10 w-full max-w-xl relative shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900">Gardener's Shop</h2>
            <p className="text-gray-500 font-medium">Spend points to unlock unique blooms.</p>
          </div>
        </div>

        <div className="space-y-4">
          {ITEMS.map((item) => {
            const isUnlocked = unlockedSkins.includes(item.id);
            const canAfford = points >= item.cost;

            return (
              <div 
                key={item.id}
                className="p-6 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-gray-100 transition-all flex items-center justify-between"
              >
                <div className="flex gap-4">
                  <div className={`p-4 rounded-2xl bg-white shadow-sm ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>

                <button
                  disabled={isUnlocked || !canAfford}
                  onClick={() => unlockSkin(item.id, item.cost)}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
                    isUnlocked 
                      ? 'bg-green-100 text-green-600' 
                      : (canAfford ? 'bg-gray-900 text-white hover:scale-105' : 'bg-gray-200 text-gray-400')
                  }`}
                >
                  {isUnlocked ? 'Unlocked' : `${item.cost} GP`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-yellow-50 rounded-[2rem] flex items-center justify-between">
          <span className="text-gray-600 font-bold">Your Balance</span>
          <div className="flex items-center gap-2 text-yellow-600 font-black text-xl">
            <Sparkles size={20} />
            <span>{points} GP</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
