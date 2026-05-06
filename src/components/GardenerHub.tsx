import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Joystick, ClipboardList, Music, Sparkles, Coins, Gift, Trophy, ArrowRightLeft, User, MessageSquare } from 'lucide-react';
import { usePoints } from './PointsContext';
import { useTheme } from './ThemeContext';
import { Tooltip } from './Tooltip';
import { SHOP_STOCK, DAILY_QUESTS, MUSIC_ITEMS } from '../data/hubData';
import { ShopItem, Quest } from '../types';
import { CosmicCatcher } from './CosmicCatcher';

interface HubProps {
  onClose: () => void;
}

export function GardenerHub({ onClose }: HubProps) {
  const [activeTab, setActiveTab] = useState<'shop' | 'arcade' | 'quests' | 'music' | 'market'>('shop');
  const { points, tokens, quests, claimQuestReward, updateQuest, addTokens, addPoints, buyItem, unlockedTracks, unlockTrack, inventory } = usePoints();
  const { season } = useTheme();
  const [isArcadePlaying, setIsArcadePlaying] = useState(false);

  // Daily rotation logic: select items based on current day
  const dailyStock = useMemo<ShopItem[]>(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const allSeasonal = SHOP_STOCK[season] || [];
    // Simple rotation: take a subset or shuffle based on day
    return [...allSeasonal].sort((a, b) => {
      const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + dayOfYear;
      const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + dayOfYear;
      return (hashA % 10) - (hashB % 10);
    });
  }, [season]);

  const trades = [
    { id: 't1', user: 'ElderBloom', offer: 'Cherry Blossom Seed', want: '100 Growth Points', icon: '🌸' },
    { id: 't2', user: 'RainStrider', offer: 'Midnight Mist Track', want: 'Frost Rose Seed', icon: '🎵' },
    { id: 't3', user: 'PetalSeeker', offer: 'Spirit Lantern', want: 'Fiery Maple Seed', icon: '🏮' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-zinc-900 border border-white/10 rounded-[3rem] w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-pink-500/10"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500" />
          
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-pink-500 rounded-[1.5rem] text-white shadow-xl shadow-pink-500/30"
            >
              <Sparkles size={28} />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter italic">Gardener's Hub</h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Live Marketplace • Community Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 mb-1">
                <Sparkles size={14} className="text-pink-400" />
                <span className="text-white font-black text-sm">{points} CP</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Coins size={14} className="text-yellow-400" />
                <span className="text-white font-black text-sm">{tokens} TK</span>
              </div>
            </div>
            <div className="w-px h-12 bg-white/10 mx-2" />
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white border border-white/5"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex p-3 gap-3 bg-black/40 mx-8 mt-6 rounded-[2rem] border border-white/5 shadow-inner">
          {[
            { id: 'shop', label: 'Shop', icon: <ShoppingBag size={20} /> },
            { id: 'quests', label: 'Missions', icon: <ClipboardList size={20} /> },
            { id: 'arcade', label: 'Arcade', icon: <Joystick size={20} /> },
            { id: 'market', label: 'Market', icon: <ArrowRightLeft size={20} /> },
            { id: 'music', label: 'Vault', icon: <Music size={20} /> },
          ].map((tab) => (
            <Tooltip key={tab.id} content={tab.label} position="top">
              <button
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-widest ${
                  activeTab === tab.id 
                    ? 'bg-white text-zinc-900 shadow-xl shadow-white/5 scale-105 px-8' 
                    : 'text-white/30 hover:text-white hover:bg-white/5 px-6'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {dailyStock.map((item) => (
                  <ShopItemCard key={item.id} item={item} />
                ))}
              </motion.div>
            )}

            {activeTab === 'quests' && (
              <motion.div
                key="quests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ClipboardList className="text-pink-500" />
                    Daily Operations
                  </h3>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                    Resets in 14h 22m
                  </div>
                </div>
                {quests.length > 0 ? quests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                )) : (
                   <div className="text-center py-12 text-white/20">No active quests. Visit tomorrow!</div>
                )}
              </motion.div>
            )}

            {activeTab === 'arcade' && (
              <motion.div
                key="arcade"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-[3rem] border border-white/5"
              >
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-40 h-40 bg-zinc-800 rounded-[2.5rem] flex items-center justify-center text-pink-500 mb-8 border border-white/10 shadow-2xl relative"
                >
                  <Joystick size={80} />
                  <div className="absolute -top-4 -right-4 bg-yellow-500 text-black p-3 rounded-2xl shadow-xl">
                    <Coins size={24} />
                  </div>
                </motion.div>
                <h3 className="text-4xl font-black text-white mb-4 italic tracking-tighter">Cosmic Catcher</h3>
                <p className="text-white/40 mb-8 max-w-md font-medium">Catch the falling memory fragments to earn tokens and massive growth point boosts!</p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    disabled={tokens < 5}
                    onClick={() => {
                      addTokens(-5);
                      setIsArcadePlaying(true);
                    }}
                    className={`px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl group flex items-center gap-3 ${
                      tokens >= 5 
                        ? 'bg-white text-zinc-900 hover:scale-105 active:scale-95' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    Start Game
                    <span className="text-[10px] px-2 py-1 bg-zinc-900 text-white rounded-lg">5 TK</span>
                  </button>
                  <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">High Score: 2,450 CP</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'market' && (
              <motion.div
                key="market"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between mb-8 px-4">
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">Community Market</h3>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Trade items with other gardeners</p>
                  </div>
                  <button className="px-6 py-3 bg-pink-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-pink-500/20">
                    + List My Item
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {trades.map((trade) => (
                    <div key={trade.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform">
                          {trade.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{trade.user}</p>
                          </div>
                          <h4 className="text-white font-bold text-lg">{trade.offer}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 w-full md:w-auto">
                        <div className="hidden md:block">
                          <ArrowRightLeft className="text-white/20" size={24} />
                        </div>
                        <div className="flex-1 md:flex-none">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Requesting</p>
                          <p className="text-white font-black italic">{trade.want}</p>
                        </div>
                        <button className="px-8 py-3 bg-white text-zinc-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all">
                          Propose Trade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'music' && (
              <motion.div
                key="music"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {MUSIC_ITEMS.map((track) => (
                  <MusicItemCard key={track.id} item={track} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {isArcadePlaying && (
          <CosmicCatcher 
            onClose={() => setIsArcadePlaying(false)} 
            onWin={(reward) => {
              addPoints(reward);
              updateQuest('gamer', 1);
              // Maybe reward tokens too if they perform well?
              if (reward > 50) addTokens(2);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ShopItemCard({ item, key }: { item: ShopItem; key?: React.Key }) {
  const { points, buyItem, inventory } = usePoints();
  const isOwned = inventory.includes(item.id);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all group relative overflow-hidden"
    >
      {item.rarity === 'legendary' && (
        <div className="absolute top-0 right-0 p-3 text-[10px] font-black uppercase bg-yellow-500 text-black px-6 rounded-bl-3xl tracking-widest shadow-xl">
          Legendary
        </div>
      )}
      
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
        <div className="text-7xl group-hover:scale-125 transition-transform duration-500 relative z-10 drop-shadow-2xl">{item.icon}</div>
      </div>

      <h4 className="text-xl font-black text-white mb-2 leading-none italic">{item.name}</h4>
      <p className="text-white/40 text-xs mb-8 flex-1 font-medium leading-relaxed">{item.description}</p>
      
      <button 
        disabled={isOwned || points < item.price}
        onClick={() => buyItem(item.id, item.price)}
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
          isOwned 
            ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default' 
            : points >= item.price 
              ? 'bg-white text-zinc-900 hover:bg-pink-500 hover:text-white shadow-xl hover:shadow-pink-500/20' 
              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
        }`}
      >
        {isOwned ? (
          <>Owned Inventory</>
        ) : (
          <>
            <Sparkles size={16} />
            {item.price} Growth Points
          </>
        )}
      </button>
    </motion.div>
  );
}

function QuestCard({ quest, key }: { quest: Quest; key?: React.Key }) {
  const { claimQuestReward } = usePoints();
  const progressPercent = (quest.progress / quest.target) * 100;

  return (
    <motion.div 
      whileHover={{ x: 10 }}
      className="bg-white/5 border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 group hover:bg-white/10 transition-all border-l-4 border-l-pink-500"
    >
      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl shrink-0 ${
        quest.completed ? 'bg-green-500 text-white' : 'bg-zinc-800 text-pink-500'
      }`}>
        {quest.completed ? <Trophy size={32} /> : <Gift size={32} />}
      </div>
      
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xl font-black text-white italic tracking-tight">{quest.title}</h4>
          <span className="text-xs font-black text-pink-500 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full">+{quest.reward} CP</span>
        </div>
        <p className="text-white/40 text-sm mb-6 font-medium leading-relaxed">{quest.description}</p>
        
        <div className="relative">
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className={`h-full transition-all duration-1000 shadow-[0_0_15px_rgba(236,72,153,0.5)] ${quest.completed ? 'bg-green-400' : 'bg-pink-500'}`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
            <span>Overall Progress</span>
            <span className={quest.completed ? 'text-green-400' : 'text-pink-500'}>{quest.progress} / {quest.target}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 w-full md:w-auto">
        <button 
          disabled={!quest.completed}
          onClick={() => claimQuestReward(quest.id)}
          className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
            quest.completed 
              ? 'bg-green-500 text-white hover:bg-green-400 shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95' 
              : 'bg-white/5 text-white/10 cursor-default border border-white/5'
          }`}
        >
          {quest.completed ? 'Claim Reward' : `${Math.floor(progressPercent)}% DONE`}
        </button>
      </div>
    </motion.div>
  );
}

function MusicItemCard({ item, key }: { item: ShopItem; key?: React.Key }) {
  const { points, unlockedTracks, unlockTrack } = usePoints();
  const isOwned = unlockedTracks.includes(item.id);

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-zinc-800/50 border border-white/5 rounded-[2rem] p-6 flex items-center gap-6 hover:bg-zinc-800 transition-all group"
    >
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-pink-500 group-hover:text-white transition-all shadow-xl">
        {item.icon}
      </div>
      <div className="flex-1">
        <h4 className="text-white font-bold text-lg mb-1">{item.name}</h4>
        <div className="flex items-center gap-2">
          <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">{item.rarity}</p>
          <div className="w-1 h-1 bg-white/10 rounded-full" />
          <p className="text-[10px] text-pink-500/60 font-black uppercase tracking-widest">Ambient Loop</p>
        </div>
      </div>
      <button 
        disabled={isOwned || points < item.price}
        onClick={() => unlockTrack(item.id, item.price)}
        className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
          isOwned 
            ? 'bg-transparent text-green-500 cursor-default border border-green-500/20' 
            : points >= item.price 
              ? 'bg-white text-zinc-900 hover:bg-pink-500 hover:text-white shadow-xl' 
              : 'bg-white/5 text-white/20 border border-white/5'
        }`}
      >
        {isOwned ? 'Active' : `${item.price} CP`}
      </button>
    </motion.div>
  );
}
