import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeContext';
import { Season, TimeOfDay } from '../types';

export function Background() {
  const { season, timeOfDay } = useTheme();

  const getBackgroundColors = () => {
    if (timeOfDay === TimeOfDay.NIGHT) {
      return 'bg-[#0a051a]'; // Deep midnight
    }
    switch (season) {
      case Season.SPRING: return 'bg-[#e0f2fe]'; // Soft sky blue
      case Season.AUTUMN: return 'bg-[#fef3c7]'; // Golden hour
      case Season.WINTER: return 'bg-[#f1f5f9]'; // Icy white
      default: return 'bg-white';
    }
  };

  const getGradientOverlay = () => {
    if (timeOfDay === TimeOfDay.NIGHT) {
      return 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, transparent 70%)';
    }
    switch (season) {
      case Season.SPRING: return 'radial-gradient(circle at 50% 20%, #bfdbfe 0%, transparent 70%)';
      case Season.AUTUMN: return 'radial-gradient(circle at 50% 20%, #fbbf24 0%, transparent 70%)';
      case Season.WINTER: return 'radial-gradient(circle at 50% 20%, #e2e8f0 0%, transparent 70%)';
      default: return '';
    }
  };

  return (
    <motion.div 
      className={`fixed inset-0 -z-10 transition-colors duration-1000 ${getBackgroundColors()}`}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="absolute inset-0 opacity-40 transition-all duration-1000"
        style={{ background: getGradientOverlay() }}
      />
      {/* Decorative environment elements based on season */}
      <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}

export function Atmosphere() {
  const { timeOfDay, season } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Fireflies at night */}
      <AnimatePresence>
        {timeOfDay === TimeOfDay.NIGHT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-200 rounded-full blur-[1px]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                  x: [0, Math.random() * 50 - 25, 0],
                  y: [0, Math.random() * 50 - 25, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mist in Autumn */}
      <AnimatePresence>
        {season === Season.AUTUMN && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white blur-3xl"
            style={{ transform: 'translateY(50%)' }}
          />
        )}
      </AnimatePresence>

      {/* Falling snow in Winter */}
      <AnimatePresence>
        {season === Season.WINTER && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white rounded-full blur-[1px]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, Math.random() * 100 - 50, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rain Effect in Winter or Night */}
      <AnimatePresence>
        {(season === Season.WINTER || timeOfDay === TimeOfDay.NIGHT) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/20 w-[1px] h-[40px]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-50px`,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
