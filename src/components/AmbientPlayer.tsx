import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';
import { Season } from '../types';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AMBIENT_SOUNDS: Record<Season, string> = {
  [Season.SPRING]: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-bird-chirping-1211.mp3', // Peaceful birds
  [Season.AUTUMN]: 'https://assets.mixkit.co/sfx/preview/mixkit-soft-wind-blowing-through-leaves-loop-2591.mp3', // Gentle wind
  [Season.WINTER]: 'https://assets.mixkit.co/sfx/preview/mixkit-light-cold-wind-loop-1077.mp3', // Soft winter hum
};

export function AmbientPlayer() {
  const { season } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.15);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (!isMuted) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay might be blocked until user interaction
          });
        }
      }
    }
  }, [season, isMuted, volume]);

  return (
    <div className="fixed bottom-10 left-10 z-50 flex items-center gap-3">
      <audio
        ref={audioRef}
        src={AMBIENT_SOUNDS[season]}
        loop
        muted={isMuted}
      />
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMuted(!isMuted)}
        className={`p-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all ${
          isMuted ? 'bg-white/10 text-white/40' : 'bg-pink-500 text-white'
        }`}
        title={isMuted ? "Unmute Ambient Sounds" : "Mute Ambient Sounds"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.button>

      <AnimatePresence>
        {!isMuted && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20"
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-pink-500 h-1 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              {season} Ambience
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
