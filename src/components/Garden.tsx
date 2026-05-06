import React, { useState, useEffect, useRef, useMemo } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FlowerData, FLOWER_COLORS, PRESET_MESSAGES } from '../types';
import { Flower } from './Flower';
import { MemoryWall } from './MemoryWall';
import { ShopHub } from './ShopHub';
import { MusicPlayer } from './MusicPlayer';
import { Fireflies } from './Fireflies';
import { UserProfile } from './UserProfile';
import { Tooltip } from './Tooltip';
import { useAuth } from './AuthContext';
import { usePoints } from './PointsContext';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { Plus, X, Music, Sun, Moon, Wind, Leaf, Snowflake, Heart, Gamepad2, Sparkles, ShoppingBag, BookOpen, ScrollText, Eye, EyeOff, Move, Search, Target, Compass, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download, User as UserIcon, Loader2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Season, TimeOfDay } from '../types';

export function Garden() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [isPlanting, setIsPlanting] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isWallOpen, setIsWallOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [selectedColor, setSelectedColor] = useState(FLOWER_COLORS[0]);
  const { season, setSeason, timeOfDay, setTimeOfDay } = useTheme();
  const { points, addPoints, unlockedSkins, isSyncing, updateQuest } = usePoints();
  const { user, effectiveId } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedFlowerId, setFocusedFlowerId] = useState<string | null>(null);
  const [myFlowerId, setMyFlowerId] = useState<string | null>(() => localStorage.getItem('my_planted_flower_id'));
  const [zoom, setZoom] = useState(1);

  const gardenX = useMotionValue(0);
  const gardenY = useMotionValue(0);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'flowers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date().getTime();
      const flowersList = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date());
        return {
          id: doc.id,
          ...data,
          ageInDays: Math.floor((now - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        };
      }).filter(f => f.ageInDays < 10) as FlowerData[];
      
      setFlowers(flowersList);
    }, (error) => {
      console.error("Firestore error:", error);
    });

    return () => unsubscribe();
  }, []);

  const handlePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      let rarity: 'common' | 'rare' | 'legendary' = 'common';
      if (unlockedSkins.includes('legendary')) rarity = 'legendary';
      else if (unlockedSkins.includes('rare')) rarity = 'rare';

      const docRef = await addDoc(collection(db, 'flowers'), {
        planterName: formData.name,
        message: formData.message.trim() || PRESET_MESSAGES[Math.floor(Math.random() * PRESET_MESSAGES.length)],
        color: selectedColor,
        // Large garden: 0-300% range
        x: Math.random() * 280 + 10,
        y: Math.random() * 280 + 10,
        careCount: 0,
        rarity,
        createdAt: serverTimestamp(),
        userId: effectiveId
      });
      
      localStorage.setItem('my_planted_flower_id', docRef.id);
      setMyFlowerId(docRef.id);
      
      addPoints(20);
      updateQuest('care_master', 1); // Planting also counts as care for the quest
      setIsPlanting(false);
      setFormData({ name: '', message: '' });
    } catch (err) {
      console.error("Error planting memory:", err);
    }
  };

  const jumpToFlower = (flower: FlowerData) => {
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    
    // Calculate position to center the flower, accounting for zoom
    const targetX = -(flower.x / 100 * viewWidth * zoom) + (viewWidth / 2);
    const targetY = -(flower.y / 100 * viewHeight * zoom) + (viewHeight / 2);

    // Constrain within bounds
    const minX = -viewWidth * (3 * zoom - 1);
    const minY = -viewHeight * (3 * zoom - 1);
    
    const finalX = Math.min(0, Math.max(minX, targetX));
    const finalY = Math.min(0, Math.max(minY, targetY));

    animate(gardenX, finalX, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    animate(gardenY, finalY, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    
    setFocusedFlowerId(flower.id!);
    setTimeout(() => setFocusedFlowerId(null), 3000);
    setSearchTerm('');
  };

  const panDirection = (dx: number, dy: number) => {
    const step = 300;
    const newX = gardenX.get() + dx * step;
    const newY = gardenY.get() + dy * step;
    
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const minX = -viewWidth * (3 * zoom - 1);
    const minY = -viewHeight * (3 * zoom - 1);

    animate(gardenX, Math.min(0, Math.max(minX, newX)), { duration: 0.5 });
    animate(gardenY, Math.min(0, Math.max(minY, newY)), { duration: 0.5 });
  };

  const filteredFlowersForSearch = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return flowers.filter(f => 
      f.planterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.message.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, flowers]);

  const hasSearchInput = searchTerm.trim().length > 0;
  const noResultsFound = hasSearchInput && filteredFlowersForSearch.length === 0;

  const handleCare = async (id: string) => {
    try {
      const flowerRef = doc(db, 'flowers', id);
      await updateDoc(flowerRef, {
        careCount: increment(1)
      });
      addPoints(10);
      updateQuest('care_master', 1);
    } catch (err) {
      console.error("Error nurturing flower:", err);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing">
      <MusicPlayer />
      
      {/* Mini-Map */}
      <AnimatePresence>
        {showUI && (
          <MiniMap 
            flowers={flowers} 
            gardenX={gardenX} 
            gardenY={gardenY} 
            onJump={jumpToFlower}
            myFlowerId={myFlowerId}
          />
        )}
      </AnimatePresence>

      {/* Scrollable Garden Layer */}
      <motion.div 
        drag
        dragConstraints={{ 
          left: -window.innerWidth * (3 * zoom - 1), 
          right: 0, 
          top: -window.innerHeight * (3 * zoom - 1), 
          bottom: 0 
        }}
        style={{ x: gardenX, y: gardenY, scale: zoom }}
        className="absolute inset-0 w-[300%] h-[300%] z-0 origin-top-left"
      >
        {/* Fireflies at Night */}
        {timeOfDay === TimeOfDay.NIGHT && <Fireflies />}

        {/* Seasonal Overlays */}
        <AnimatePresence>
          {season === Season.WINTER && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white pointer-events-none z-10"
            />
          )}
          {season === Season.AUTUMN && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-orange-900 pointer-events-none z-10"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {flowers.map((flower) => (
            <Flower 
              key={flower.id} 
              flower={{...flower, isProjectedFocus: flower.id === focusedFlowerId}} 
              onCare={handleCare} 
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Search & Find UI */}
      <AnimatePresence>
        {showUI && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            <div className="relative group">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 shadow-2xl focus-within:bg-white focus-within:border-white transition-all">
                <Search size={16} className={`${timeOfDay === TimeOfDay.DAY ? 'text-gray-900/60' : 'text-white/60'} group-focus-within:text-gray-900`} />
                <input 
                  type="text"
                  placeholder="Find a flower..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`bg-transparent border-none outline-none text-sm font-bold w-48 focus:text-gray-900 placeholder:${timeOfDay === TimeOfDay.DAY ? 'text-gray-600/50' : 'text-white/40'} ${timeOfDay === TimeOfDay.DAY ? 'text-gray-900' : 'text-white'}`}
                />
                {myFlowerId && (
                  <Tooltip content="Find My Flower" position="bottom">
                    <button 
                      onClick={() => {
                        const mine = flowers.find(f => f.id === myFlowerId);
                        if (mine) jumpToFlower(mine);
                      }}
                      className="p-1.5 bg-pink-500 text-white rounded-full hover:scale-110 active:scale-95 transition-all"
                    >
                      <Target size={14} />
                    </button>
                  </Tooltip>
                )}
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {filteredFlowersForSearch.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl p-2 shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    {filteredFlowersForSearch.map(f => (
                      <button
                        key={f.id}
                        onClick={() => jumpToFlower(f)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: f.color }} />
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-gray-900 truncate">{f.planterName}</p>
                          <p className="text-[10px] text-gray-500 truncate italic">"{f.message}"</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
                {noResultsFound && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center"
                  >
                    <p className="text-xs font-bold text-gray-400">No flowers found matching your search</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Instructions for Panning */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-4"
          >
            <Move size={48} className={`animate-bounce ${timeOfDay === TimeOfDay.DAY ? 'text-gray-900/40' : 'text-white/40'}`} />
            <p className={`font-black uppercase tracking-widest text-sm drop-shadow-sm ${timeOfDay === TimeOfDay.DAY ? 'text-gray-900/60' : 'text-white/60'}`}>Drag to explore your massive garden</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Toggle Button */}
      <div className="absolute top-10 right-48 z-[110] flex items-center gap-2">
        <Tooltip content={showUI ? "Hide Interface" : "Show Interface"} position="left">
          <button 
            onClick={() => setShowUI(!showUI)}
            className={`p-4 backdrop-blur-xl rounded-full transition-all border shadow-xl ${
              timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10 text-gray-900' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {showUI ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </Tooltip>
        {showUI && (
          <div className={`flex backdrop-blur-xl border rounded-full p-1 shadow-xl ${
            timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10' : 'bg-white/10 border-white/20'
          }`}>
            <Tooltip content="Zoom In" position="bottom">
              <button 
                onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                className={`p-3 rounded-full transition-all text-xs font-black ${
                  timeOfDay === TimeOfDay.DAY ? 'text-gray-900 hover:bg-gray-900/10' : 'text-white hover:bg-white/10'
                }`}
              >
                Zoom +
              </button>
            </Tooltip>
            <Tooltip content="Zoom Out" position="bottom">
              <button 
                onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                className={`p-3 rounded-full transition-all text-xs font-black ${
                  timeOfDay === TimeOfDay.DAY ? 'text-gray-900 hover:bg-gray-900/10' : 'text-white hover:bg-white/10'
                }`}
              >
                Zoom -
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Directional Pad */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-10 right-10 z-[110] flex flex-col items-center gap-2"
          >
            <NavArrow onClick={() => panDirection(0, 1)} direction="up" timeOfDay={timeOfDay} />
            <div className="flex gap-2">
              <NavArrow onClick={() => panDirection(1, 0)} direction="left" timeOfDay={timeOfDay} />
              <div className={`w-10 h-10 rounded-2xl backdrop-blur-xl border shadow-xl ${
                timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10' : 'bg-white/10 border-white/20'
              }`} />
              <NavArrow onClick={() => panDirection(-1, 0)} direction="right" timeOfDay={timeOfDay} />
            </div>
            <NavArrow onClick={() => panDirection(0, -1)} direction="down" timeOfDay={timeOfDay} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main HUD */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 backdrop-blur-xl p-4 rounded-full border shadow-2xl transition-colors ${
              timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10' : 'bg-white/20 border-white/30'
            }`}
          >
            <Tooltip content="Share a memory or wish">
              <button 
                onClick={() => setIsPlanting(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Heart size={20} className="text-pink-500 fill-pink-500" />
                <span>Plant a Memory</span>
              </button>
            </Tooltip>

            <div className="h-8 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <Tooltip content="Daylight Theme">
                <ThemeButton 
                  active={timeOfDay === TimeOfDay.DAY} 
                  onClick={() => setTimeOfDay(TimeOfDay.DAY)}
                  icon={<Sun size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
              <Tooltip content="Starlight Theme">
                <ThemeButton 
                  active={timeOfDay === TimeOfDay.NIGHT} 
                  onClick={() => setTimeOfDay(TimeOfDay.NIGHT)}
                  icon={<Moon size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
            </div>

            <div className="h-8 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <Tooltip content="Spring Season">
                <ThemeButton 
                  active={season === Season.SPRING} 
                  onClick={() => setSeason(Season.SPRING)}
                  icon={<Leaf size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
              <Tooltip content="Autumn Season">
                <ThemeButton 
                  active={season === Season.AUTUMN} 
                  onClick={() => setSeason(Season.AUTUMN)}
                  icon={<Wind size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
              <Tooltip content="Winter Season">
                <ThemeButton 
                  active={season === Season.WINTER} 
                  onClick={() => setSeason(Season.WINTER)}
                  icon={<Snowflake size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
            </div>

            <div className="h-8 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <Tooltip content="Memory Journal">
                <ThemeButton 
                  active={isWallOpen}
                  onClick={() => setIsWallOpen(true)}
                  icon={<ScrollText size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
              <div className="h-8 w-px bg-white/30" />
              <Tooltip content="Arcade Games">
                <ThemeButton 
                  active={false}
                  onClick={() => setIsGameOpen(true)}
                  icon={<Gamepad2 size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
              <Tooltip content="Flower Lore">
                <ThemeButton 
                  active={false}
                  onClick={() => setIsTriviaOpen(true)}
                  icon={<BookOpen size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
              <Tooltip content="Gardener's Hub">
                <ThemeButton 
                  active={false}
                  onClick={() => setIsShopOpen(true)}
                  icon={<ShoppingBag size={18} />}
                  timeOfDay={timeOfDay}
                />
              </Tooltip>
            </div>

            {deferredPrompt && (
              <>
                <div className="h-8 w-px bg-white/30" />
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all animate-pulse"
                >
                  <Download size={18} />
                  <span>Install App</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShopOpen && (
          <ShopHub isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileOpen && (
          <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWallOpen && (
          <MemoryWall flowers={flowers} onClose={() => setIsWallOpen(false)} />
        )}
      </AnimatePresence>

      {/* Planting Modal */}
      <AnimatePresence>
        {isPlanting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative shadow-2xl"
            >
              <button 
                onClick={() => setIsPlanting(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-black text-gray-900 mb-2">Plant a Memory</h2>
              <p className="text-gray-500 mb-8">Share a dedication, wish, or a moment you want to preserve.</p>

              <form onSubmit={handlePlant} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Signed By</label>
                  <input 
                    autoFocus
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-2xl outline-none transition-all font-medium"
                    placeholder="Your name or initials..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">The Memory / Wish</label>
                  <textarea 
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-2xl outline-none transition-all font-medium h-32 resize-none"
                    placeholder="Write something heartfelt..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Choose Color</label>
                  <div className="flex flex-wrap gap-3">
                    {FLOWER_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-all ${selectedColor === color ? 'ring-4 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  Plant in Garden
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Info Stats Panel */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className={`absolute top-10 left-10 z-40 backdrop-blur-md p-6 rounded-3xl border shadow-xl transition-colors ${
              timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10' : 'bg-white/10 border-white/20'
            }`}
          >
            <h1 className={`text-4xl font-black tracking-tighter leading-none font-serif italic drop-shadow-sm ${
              timeOfDay === TimeOfDay.DAY ? 'text-gray-900' : 'text-white/90'
            }`}>Memory<br/>Garden</h1>
            <div className="mt-4 flex flex-col gap-2">
              <div className={`flex items-center gap-2 text-sm font-bold ${
                timeOfDay === TimeOfDay.DAY ? 'text-gray-800' : 'text-white/80'
              }`}>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span>{flowers.length} memories preserved</span>
              </div>
              
              <Tooltip content="Account Settings" position="right">
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${
                    timeOfDay === TimeOfDay.DAY ? 'bg-black/5 border-black/5 hover:bg-black/10' : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg overflow-hidden">
                    {user?.photoURL ? <img src={user.photoURL} alt="" /> : <UserIcon size={16} />}
                  </div>
                  <div className="text-left">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${timeOfDay === TimeOfDay.DAY ? 'text-gray-900' : 'text-white'}`}>
                      {user?.isAnonymous ? 'Guest Account' : (user?.displayName || 'My Profile')}
                    </p>
                    <p className="text-[10px] text-yellow-600 font-bold">{points} GP</p>
                  </div>
                </button>
              </Tooltip>

              {isSyncing && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pink-500 animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  Syncing...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavArrow({ onClick, direction, timeOfDay }: { onClick: () => void, direction: 'up' | 'down' | 'left' | 'right', timeOfDay: TimeOfDay }) {
  const Icon = {
    up: ChevronUp,
    down: ChevronDown,
    left: ChevronLeft,
    right: ChevronRight
  }[direction];

  const label = {
    up: "Pan Up",
    down: "Pan Down",
    left: "Pan Left",
    right: "Pan Right"
  }[direction];

  return (
    <Tooltip content={label} position={direction === 'left' ? 'left' : direction === 'right' ? 'right' : direction === 'up' ? 'top' : 'bottom'}>
      <button
        onClick={onClick}
        className={`p-3 backdrop-blur-xl border rounded-2xl active:scale-95 transition-all shadow-xl ${
          timeOfDay === TimeOfDay.DAY ? 'bg-white/40 border-gray-900/10 text-gray-900' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
      >
        <Icon size={18} />
      </button>
    </Tooltip>
  );
}

function ThemeButton({ active, onClick, icon, timeOfDay }: { active: boolean, onClick: () => void, icon: React.ReactNode, timeOfDay: TimeOfDay }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-all ${
        active 
          ? 'bg-white text-gray-900 shadow-md scale-110' 
          : (timeOfDay === TimeOfDay.DAY ? 'text-gray-900/40 hover:text-gray-900 hover:bg-white/20' : 'text-white/60 hover:text-white hover:bg-white/10')
      }`}
    >
      {icon}
    </button>
  );
}

function MiniMap({ flowers, gardenX, gardenY, onJump, myFlowerId }: { flowers: FlowerData[], gardenX: any, gardenY: any, onJump: (f: FlowerData) => void, myFlowerId: string | null }) {
  const [viewport, setViewport] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unsubX = gardenX.on('change', (v: number) => setViewport(prev => ({ ...prev, x: -v })));
    const unsubY = gardenY.on('change', (v: number) => setViewport(prev => ({ ...prev, y: -v })));
    return () => { unsubX(); unsubY(); };
  }, [gardenX, gardenY]);

  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Jump to the approximate location clicked on the map
    const targetX = -(x * viewWidth * 3) + (viewWidth / 2);
    const targetY = -(y * viewHeight * 3) + (viewHeight / 2);

    animate(gardenX, Math.min(0, Math.max(-viewWidth * 2, targetX)), { duration: 1 });
    animate(gardenY, Math.min(0, Math.max(-viewHeight * 2, targetY)), { duration: 1 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-10 right-48 z-40 w-40 h-40 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 overflow-hidden shadow-2xl"
    >
      <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
        <Compass size={10} className="text-white/60 animate-spin-slow" />
        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Sky Navigation</span>
      </div>
      
      {/* Garden Bounds Preview */}
      <div className="relative w-full h-full p-2 cursor-crosshair" onClick={handleMapClick}>
        <div className="relative w-full h-full bg-black/10 rounded-2xl border border-white/5">
          {/* Flower Dots */}
          {flowers.map(f => (
            <button
              key={f.id}
              onClick={(e) => {
                e.stopPropagation();
                onJump(f);
              }}
              className={`absolute w-1.5 h-1.5 rounded-full transition-transform hover:scale-200 cursor-pointer ${f.id === myFlowerId ? 'z-20 ring-2 ring-pink-500' : 'z-10'}`}
              style={{ 
                left: `${f.x / 3}%`, 
                top: `${f.y / 3}%`,
                backgroundColor: f.color,
                boxShadow: `0 0 4px ${f.color}`
              }}
            />
          ))}

          {/* Current Viewport Box */}
          <div 
            className="absolute border border-white/40 bg-white/5 pointer-events-none transition-all duration-75"
            style={{
              left: `${(viewport.x / (viewWidth * 3)) * 100}%`,
              top: `${(viewport.y / (viewHeight * 3)) * 100}%`,
              width: `${(viewWidth / (viewWidth * 3)) * 100}%`,
              height: `${(viewHeight / (viewHeight * 3)) * 100}%`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
