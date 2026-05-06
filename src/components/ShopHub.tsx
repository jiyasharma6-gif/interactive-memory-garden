import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Gamepad2, 
  ScrollText, 
  Music as MusicIcon, 
  X, 
  Sparkles, 
  Coins, 
  Ticket,
  ChevronRight,
  Gift,
  Lock,
  PlayCircle,
  TrendingUp,
  Star,
  RefreshCw
} from 'lucide-react';
import { usePoints } from './PointsContext';
import { useTheme } from './ThemeContext';
import { ShopItem, Quest, TimeOfDay } from '../types';
import { CosmicCatcher } from './CosmicCatcher';

const SHOP_STOCK: ShopItem[] = [
  { id: 'rainbow_seed', name: 'Rainbow Seed', description: 'Grows a multi-colored flower', price: 150, type: 'seed', rarity: 'rare', icon: '🌈' },
  { id: 'stone_lantern', name: 'Stone Lantern', description: 'Glows softly at night', price: 300, type: 'decor', rarity: 'common', icon: '🏮' },
  { id: 'neon_skin', name: 'Neon Garden Skin', description: 'Make everything glow in dark', price: 1000, type: 'skin', rarity: 'legendary', icon: '🌌' },
  { id: 'lofi_track', name: 'Chill Lofi Beats', description: 'Unlock a new background track', price: 500, type: 'music', rarity: 'rare', icon: '🎧' },
  { id: 'crystal_lily', name: 'Crystal Lily Seed', description: 'A transparent flowering beauty', price: 250, type: 'seed', rarity: 'rare', icon: '💎' },
  { id: 'bench_rustic', name: 'Rustic Bench', description: 'A cozy place to sit', price: 100, type: 'decor', rarity: 'common', icon: '🪑' },
];

const DAILY_QUESTS: Quest[] = [
  { id: 'q1', title: 'Gentle Care', description: 'Nurture 5 flowers', reward: 50, type: 'care', target: 5, progress: 2, completed: false },
  { id: 'q2', title: 'Memory Collector', description: 'Find 3 specific flowers', reward: 100, type: 'collect', target: 3, progress: 0, completed: false },
  { id: 'q3', title: 'Arcade Master', description: 'Play 2 mini-games', reward: 75, type: 'mini-game', target: 2, progress: 1, completed: false },
];

export function ShopHub({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'shop' | 'arcade' | 'quests' | 'music' | 'trade'>('shop');
  const { points, addPoints, unlockedTracks, unlockTrack, inventory, buyItem } = usePoints();
  const { timeOfDay } = useTheme();
  const [tokens, setTokens] = useState(10); // Arcade tokens
  const [isArcadePlaying, setIsArcadePlaying] = useState(false);
  const [trades, setTrades] = useState([
    { id: 't1', user: 'GreenThumb', offering: 'Golden Seed', wanting: '300 GP', icon: '✨' },
    { id: 't2', user: 'RoseLover', offering: 'Rustic Bench', wanting: 'Crystal Lily', icon: '🪑' },
    { id: 't3', user: 'StarGazer', offering: 'Neon Skin', wanting: '1500 GP', icon: '🌌' },
  ]);

  const isDay = timeOfDay === TimeOfDay.DAY;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-4xl h-[80vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border ${
              isDay ? 'bg-white border-gray-100' : 'bg-gray-900 border-white/10'
            }`}
          >
            {/* Header */}
            <div className={`p-8 flex items-center justify-between border-b ${isDay ? 'border-gray-100' : 'border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500 rounded-2xl shadow-lg shadow-pink-500/20">
                  <ShoppingBag className="text-white" size={24} />
                </div>
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${isDay ? 'text-gray-900' : 'text-white'}`}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Hub
                  </h2>
                  <p className={`text-xs font-bold uppercase tracking-widest ${isDay ? 'text-gray-400' : 'text-white/40'}`}>
                    Interactive Marketplace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                  <Coins className="text-yellow-600" size={18} />
                  <span className={`text-sm font-black ${isDay ? 'text-gray-900' : 'text-white'}`}>{points} GP</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <Ticket className="text-blue-600" size={18} />
                  <span className={`text-sm font-black ${isDay ? 'text-gray-900' : 'text-white'}`}>{tokens} TK</span>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-full transition-all ${isDay ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/10 text-white/40'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Tabs */}
              <div className={`w-64 border-r p-6 flex flex-col gap-2 ${isDay ? 'border-gray-100 bg-gray-50/50' : 'border-white/5 bg-black/20'}`}>
                <TabButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<ShoppingBag size={18} />} label="Seed Store" isDay={isDay} />
                <TabButton active={activeTab === 'arcade'} onClick={() => setActiveTab('arcade')} icon={<Gamepad2 size={18} />} label="Mini-Games" isDay={isDay} />
                <TabButton active={activeTab === 'quests'} onClick={() => setActiveTab('quests')} icon={<ScrollText size={18} />} label="Quest Board" isDay={isDay} />
                <TabButton active={activeTab === 'trade'} onClick={() => setActiveTab('trade')} icon={<TrendingUp size={18} />} label="Market" isDay={isDay} />
                <TabButton active={activeTab === 'music'} onClick={() => setActiveTab('music')} icon={<MusicIcon size={18} />} label="Music Vault" isDay={isDay} />
                
                <div className="mt-auto space-y-4">
                  <div className={`p-4 rounded-2xl border ${isDay ? 'bg-white border-gray-100' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw size={14} className="text-pink-500 animate-spin-slow" />
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isDay ? 'text-gray-400' : 'text-white/40'}`}>Inventory Rotates In</span>
                    </div>
                    <div className={`text-lg font-black tracking-tighter ${isDay ? 'text-gray-900' : 'text-white'}`}>14:42:01</div>
                  </div>
                </div>
              </div>

              {/* Main Display */}
              <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'shop' && (
                  <div className="grid grid-cols-2 gap-6">
                    {SHOP_STOCK.map((item) => (
                      <ShopCard 
                        key={item.id} 
                        item={item} 
                        isDay={isDay} 
                        onBuy={() => buyItem(item.id, item.price)}
                        owned={inventory.includes(item.id)}
                        canAfford={points >= item.price}
                      />
                    ))}
                  </div>
                )}
                
                {activeTab === 'quests' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-xl font-bold ${isDay ? 'text-gray-900' : 'text-white'}`}>Daily Missions</h3>
                      <span className="text-xs bg-pink-500/10 text-pink-500 px-3 py-1 rounded-full font-bold">Resets Daily</span>
                    </div>
                    {DAILY_QUESTS.map((quest) => (
                      <QuestItem key={quest.id} quest={quest} isDay={isDay} />
                    ))}
                  </div>
                )}

                {activeTab === 'arcade' && (
                  <div className="space-y-8">
                    <div className={`p-8 rounded-[2rem] relative overflow-hidden group ${isDay ? 'bg-indigo-600' : 'bg-indigo-800'}`}>
                      <div className="relative z-10 text-white">
                        <h3 className="text-3xl font-black mb-2 tracking-tight">Cosmic Catcher</h3>
                        <p className="opacity-80 text-sm max-w-sm mb-6">Catch falling stars to earn Arcade Tokens and exclusive growth boosts!</p>
                        <button 
                          onClick={() => {
                            if (tokens >= 2) {
                              setTokens(t => t - 2);
                              setIsArcadePlaying(true);
                            }
                          }}
                          className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <PlayCircle size={20} />
                          Play Now (2 TK)
                        </button>
                      </div>
                      <Gamepad2 className="absolute -right-10 -bottom-10 text-white/10 rotate-12 group-hover:scale-110 transition-transform" size={240} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className={`p-6 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-4 text-center ${isDay ? 'border-gray-200' : 'border-white/10'}`}>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Lock size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <p className={`font-bold ${isDay ? 'text-gray-900' : 'text-white'}`}>Memory Match</p>
                          <p className="text-xs text-gray-400">Unlock at Level 5</p>
                        </div>
                      </div>
                      <div className={`p-6 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-4 text-center ${isDay ? 'border-gray-200' : 'border-white/10'}`}>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Lock size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <p className={`font-bold ${isDay ? 'text-gray-900' : 'text-white'}`}>Petal Pop</p>
                          <p className="text-xs text-gray-400">Unlock at Level 10</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'music' && (
                  <div className="space-y-4">
                    <h3 className={`text-xl font-bold mb-6 ${isDay ? 'text-gray-900' : 'text-white'}`}>Soundscape Collections</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'zen', name: 'Zen Garden', price: 0 },
                        { id: 'meadow', name: 'Peaceful Meadow', price: 0 },
                        { id: 'mist', name: 'Midnight Mist', price: 400 },
                        { id: 'calm', name: 'Eternal Calm', price: 600 }
                      ].map((track) => {
                        const isUnlocked = unlockedTracks.includes(track.id);
                        return (
                          <div key={track.id} className={`p-5 rounded-2xl flex items-center justify-between border transition-all ${isDay ? 'bg-white hover:bg-gray-50 border-gray-100' : 'bg-white/5 hover:bg-white/10 border-white/5'}`}>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
                                <MusicIcon className="text-pink-500" size={20} />
                              </div>
                              <div>
                                <p className={`font-bold ${isDay ? 'text-gray-900' : 'text-white'}`}>{track.name}</p>
                                <p className="text-xs text-gray-400">Ambient Soundscape</p>
                              </div>
                            </div>
                            <button 
                              disabled={isUnlocked}
                              onClick={() => unlockTrack(track.id, track.price)}
                              className={`px-4 py-2 h-max rounded-xl font-black text-xs transition-all ${
                                isUnlocked 
                                  ? (isDay ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-white/5 text-white/30 cursor-default')
                                  : (isDay ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white text-gray-900 hover:bg-gray-100')
                              }`}
                            >
                              {isUnlocked ? 'Unlocked' : `Unlock (${track.price} GP)`}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'trade' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${isDay ? 'text-gray-900' : 'text-white'}`}>Community Market</h3>
                      <button className="text-xs text-pink-500 font-black uppercase tracking-widest">+ List Item</button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {trades.map((trade) => (
                        <div key={trade.id} className={`p-5 rounded-2xl flex items-center justify-between border ${isDay ? 'bg-white border-gray-100' : 'bg-white/5 border-white/5'}`}>
                          <div className="flex items-center gap-4">
                            <div className="text-3xl p-2 bg-gray-100 dark:bg-white/5 rounded-xl">{trade.icon}</div>
                            <div>
                              <p className={`text-xs font-black text-pink-500 uppercase tracking-widest`}>{trade.user}</p>
                              <p className={`font-bold ${isDay ? 'text-gray-900' : 'text-white'}`}>{trade.offering}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Wanting</p>
                              <p className={`font-black ${isDay ? 'text-gray-900' : 'text-white'}`}>{trade.wanting}</p>
                            </div>
                            <button className="px-6 py-2 bg-pink-500 text-white rounded-xl font-black text-xs shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">
                              Trade
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isArcadePlaying && (
              <CosmicCatcher 
                onClose={() => setIsArcadePlaying(false)} 
                onWin={(reward) => {
                  addPoints(reward);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

function TabButton({ active, label, icon, onClick, isDay }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void; isDay: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
        active 
          ? (isDay ? 'bg-white shadow-xl shadow-black/5 text-gray-900' : 'bg-white/10 text-white shadow-xl') 
          : (isDay ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-white/40 hover:text-white hover:bg-white/5')
      }`}
    >
      <span className={active ? 'text-pink-500' : ''}>{icon}</span>
      {label}
    </button>
  );
}

interface ShopCardProps {
  item: ShopItem;
  isDay: boolean;
  onBuy: () => void;
  owned: boolean;
  canAfford: boolean;
  key?: React.Key;
}

function ShopCard({ item, isDay, onBuy, owned, canAfford }: ShopCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 rounded-[2rem] border transition-all ${
        isDay ? 'bg-white border-gray-100 hover:shadow-2xl' : 'bg-white/5 border-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{item.icon}</div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          item.rarity === 'legendary' ? 'bg-yellow-500 text-white' : (item.rarity === 'rare' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white')
        }`}>
          {item.rarity}
        </div>
      </div>
      <h4 className={`font-black tracking-tight mb-1 ${isDay ? 'text-gray-900' : 'text-white'}`}>{item.name}</h4>
      <p className={`text-xs mb-6 h-8 line-clamp-2 ${isDay ? 'text-gray-500' : 'text-white/40'}`}>{item.description}</p>
      
      <button 
        disabled={owned || !canAfford}
        onClick={onBuy}
        className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
          owned 
            ? 'bg-green-500/10 text-green-500 cursor-default' 
            : (!canAfford ? 'bg-gray-500/10 text-gray-500 cursor-not-allowed' : 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-95')
        }`}
      >
        {owned ? 'Already Owned' : (
          <>
            <Coins size={14} />
            {item.price} Growth Points
          </>
        )}
      </button>
    </motion.div>
  );
}

interface QuestItemProps {
  quest: Quest;
  isDay: boolean;
  key?: React.Key;
}

function QuestItem({ quest, isDay }: QuestItemProps) {
  const percentage = (quest.progress / quest.target) * 100;
  
  return (
    <div className={`p-6 rounded-3xl border ${isDay ? 'bg-white border-gray-100' : 'bg-white/5 border-white/5'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-2xl">
            <TrendingUp size={20} className="text-yellow-600" />
          </div>
          <div>
            <h4 className={`font-bold ${isDay ? 'text-gray-900' : 'text-white'}`}>{quest.title}</h4>
            <p className="text-xs text-gray-400">{quest.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-yellow-600 flex items-center gap-2">
            <Sparkles size={14} />
            +{quest.reward} GP
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span>Progress</span>
          <span>{quest.progress} / {quest.target}</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-pink-500"
          />
        </div>
      </div>
    </div>
  );
}
