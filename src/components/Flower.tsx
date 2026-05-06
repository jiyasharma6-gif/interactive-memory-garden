import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlowerData } from '../types';
import { Tooltip } from './Tooltip';
import { Droplet, Sparkles, Heart } from 'lucide-react';

interface FlowerProps {
  flower: FlowerData;
  onCare: (id: string) => void | Promise<void>;
  key?: string | number;
}

export function Flower({ flower, onCare }: FlowerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCareFeedback, setShowCareFeedback] = useState(false);

  const handleCareAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCare(flower.id!);
    setShowCareFeedback(true);
    setTimeout(() => setShowCareFeedback(false), 1000);
  };

  // Calculate age-based growth
  const ageInDays = React.useMemo(() => {
    if (!flower.createdAt) return 0;
    const createdDate = flower.createdAt.toDate ? flower.createdAt.toDate() : new Date(flower.createdAt);
    const diffTime = Math.abs(new Date().getTime() - createdDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, [flower.createdAt]);

  const isSignificantCare = (flower.careCount || 0) > 5;
  const isNewlyPlanted = ageInDays < 1;
  
  // Bloom intensity increases for new flowers or well-cared flowers
  const bloomScale = isNewlyPlanted || isSignificantCare ? 1.15 : 1;
  const bloomSaturation = isNewlyPlanted || isSignificantCare ? 1.4 : 1;

  const heightFactor = Math.min(1 + ageInDays * 0.12 + (flower.careCount || 0) * 0.03, 3) * bloomScale; 
  const vibrancy = 1 + Math.min((flower.careCount || 0) * 0.15, 1.5) * bloomSaturation;
  const careGlow = (flower.careCount || 0) * 4;

  const pulseScale = isNewlyPlanted || isSignificantCare ? [1, 1.05, 1] : 1;
  const saturationPulse = isNewlyPlanted || isSignificantCare ? 0.4 : 0.1;

  // Calculate life percentage for fading out (0 to 1)
  const lifeOpacity = ageInDays >= 8 ? Math.max(0, (12 - ageInDays) / 4) : 1; 

  // Smooth color intensity shift based on growth and care
  const colorIntensity = Math.min(0.2 + ageInDays * 0.05 + (flower.careCount || 0) * 0.02, 1);
  
  const baseColor = React.useMemo(() => {
    // Subtle white-to-color or color-to-gold shift
    if (ageInDays > 10) return "#FFD700"; // Golden for elders
    return flower.color;
  }, [flower.color, ageInDays]);

  const rarityStyles = React.useMemo(() => {
    switch (flower.rarity) {
      case 'legendary':
        return {
          glow: 'drop-shadow(0 0 15px #fbbf24) drop-shadow(0 0 5px #fff)',
          borderColor: 'border-yellow-400',
          bg: 'bg-yellow-400/10'
        };
      case 'rare':
        return {
          glow: 'drop-shadow(0 0 10px #fff)',
          borderColor: 'border-white/50',
          bg: 'bg-white/5'
        };
      default:
        return {
          glow: '',
          borderColor: 'border-transparent',
          bg: ''
        };
    }
  }, [flower.rarity]);

  // Randomize characteristics slightly for organic feel
  const swayDuration = React.useMemo(() => 3 + Math.random() * 2, []);
  const breathDelay = React.useMemo(() => Math.random() * 2, []);

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center cursor-pointer origin-bottom"
      style={{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        zIndex: Math.floor(flower.y)
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [1, 1 * (1 + (flower.careCount || 0) * 0.005), 1], 
        opacity: lifeOpacity,
        rotate: [-1, 2, -1],
        x: [-1, 1, -1]
      }}
      transition={{
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: breathDelay },
        opacity: { duration: 0.5 },
        rotate: { duration: swayDuration, repeat: Infinity, ease: "easeInOut" },
        x: { duration: swayDuration * 1.2, repeat: Infinity, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Flower Message Tooltip & Care Actions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -100, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute z-50 p-5 rounded-[2rem] bg-white/95 backdrop-blur-md shadow-2xl text-center min-w-[240px] border border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium text-gray-800 italic mb-3 leading-relaxed">"{flower.message}"</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">— {flower.planterName}</p>
            
            <div className="flex items-center justify-center gap-3">
              <Tooltip content="Helps the flower grow taller">
                <button 
                  onClick={handleCareAction}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Droplet size={14} />
                  Water
                </button>
              </Tooltip>
              <Tooltip content="Increases color intensity">
                <button 
                  onClick={handleCareAction}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold hover:bg-yellow-100 transition-colors"
                >
                  <Sparkles size={14} />
                  Pollinate
                </button>
              </Tooltip>
            </div>

            {flower.careCount && flower.careCount > 0 && (
              <p className="mt-3 text-[10px] text-gray-400 font-medium">Nurtured {flower.careCount} times</p>
            )}

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-white/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistence/Resilience Indicator */}
      {flower.careCount && flower.careCount > 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-6 text-pink-500 drop-shadow-md z-[20]"
        >
          <Heart size={14} className="fill-pink-500" />
        </motion.div>
      )}

      {/* The Flower itself */}
      <motion.div 
        className="relative flex items-center justify-center transition-all duration-700"
        style={{ 
          width: `${3 * heightFactor}rem`, 
          height: `${3 * heightFactor}rem`,
          filter: `${rarityStyles.glow} drop-shadow(0 0 ${careGlow}px ${baseColor}) saturate(${vibrancy})`
        }}
        animate={{
          scale: pulseScale,
          filter: [
            `${rarityStyles.glow} drop-shadow(0 0 ${careGlow}px ${baseColor}) saturate(${vibrancy})`,
            `${rarityStyles.glow} drop-shadow(0 0 ${careGlow + 10}px ${baseColor}) saturate(${vibrancy + saturationPulse})`,
            `${rarityStyles.glow} drop-shadow(0 0 ${careGlow}px ${baseColor}) saturate(${vibrancy})`
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: breathDelay }}
      >
        <AnimatePresence>
          {flower.isProjectedFocus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
              transition={{ duration: 1.5, repeat: 2 }}
              className="absolute inset-0 rounded-full bg-white/40 blur-xl pointer-events-none z-[-1]"
            />
          )}
          {showCareFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute z-[100] text-yellow-400 font-bold pointer-events-none whitespace-nowrap"
            >
              +10 Growth
            </motion.div>
          )}
        </AnimatePresence>
        {/* Petals */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1.5 * heightFactor}rem`,
              height: `${2.5 * heightFactor}rem`,
              backgroundColor: isHovered ? '#fff' : baseColor,
              filter: isHovered ? `drop-shadow(0 0 10px ${baseColor})` : 'none',
              transformOrigin: 'bottom center',
              rotate: i * 60,
              bottom: '50%',
              opacity: colorIntensity,
            }}
            animate={{
              rotate: isOpen ? [i * 60, i * 60 + 10, i * 60] : i * 60,
              scaleY: isOpen ? 1.2 : [1, 1.05 + (flower.careCount || 0) * 0.015, 1],
              scaleX: isOpen ? 1 : [0.95 + (flower.careCount || 0) * 0.005, 1.02, 0.95 + (flower.careCount || 0) * 0.005],
              filter: [
                `none`,
                `drop-shadow(0 0 ${2 + (flower.careCount || 0)}px white)`,
                `none`
              ]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, repeatType: "reverse" },
              scaleY: { 
                duration: isOpen ? 2 : 4 + Math.random(), 
                repeat: Infinity, 
                delay: isOpen ? 0 : breathDelay,
                ease: "easeInOut" 
              },
              scaleX: { 
                duration: isOpen ? 2 : 4 + Math.random(), 
                repeat: Infinity, 
                delay: isOpen ? 0 : breathDelay,
                ease: "easeInOut" 
              },
              filter: {
                duration: 6,
                repeat: Infinity,
                delay: i * 0.5
              }
            }}
          />
        ))}
        {/* Center */}
        <motion.div 
          className="absolute rounded-full z-10 shadow-inner"
          style={{ 
            width: `${1 * heightFactor}rem`,
            height: `${1 * heightFactor}rem`,
            backgroundColor: isHovered ? '#fff' : '#fbbf24' 
          }}
          animate={{ scale: [1, 1.1 + (flower.careCount || 0) * 0.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: breathDelay, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Stem */}
      <motion.div 
        className="bg-green-600/40 rounded-full -mt-4 blur-[0.5px] transition-all duration-700" 
        style={{ 
          width: '4px',
          height: `${3 * heightFactor}rem`
        }}
        animate={{
          height: [`${3 * heightFactor}rem`, `${3 * heightFactor + 0.2}rem`, `${3 * heightFactor}rem`]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: breathDelay, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
