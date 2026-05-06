import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, X, Coins } from 'lucide-react';
import { usePoints } from './PointsContext';

export function CosmicCatcher({ onClose, onWin }: { onClose: () => void, onWin: (reward: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stars, setStars] = useState<{ id: number, x: number, y: number, speed: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setStars([]);
    setGameOver(false);
  };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          onWin(score * 2); // 2 GP per star caught
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const starSpawner = setInterval(() => {
      setStars(prev => [
        ...prev,
        {
          id: Math.random(),
          x: Math.random() * 90,
          y: -10,
          speed: 2 + Math.random() * 3
        }
      ]);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(starSpawner);
    };
  }, [isPlaying, timeLeft, score, onWin]);

  useEffect(() => {
    if (!isPlaying) return;

    const moveStars = setInterval(() => {
      setStars(prev => prev.map(star => ({
        ...star,
        y: star.y + star.speed
      })).filter(star => star.y < 110));
    }, 50);

    return () => clearInterval(moveStars);
  }, [isPlaying]);

  const catchStar = (id: number) => {
    setScore(prev => prev + 1);
    setStars(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-indigo-900/90 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl h-[70vh] bg-black rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        ref={containerRef}
      >
        {/* Game Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="text-yellow-400"><Sparkles size={24} /></div>
            <div>
              <h3 className="text-white font-black">Cosmic Catcher</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Catch the falling memories</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] text-white/40 font-black uppercase">Time</p>
              <p className="text-xl font-black text-white leading-none">{timeLeft}s</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-white/40 font-black uppercase">Score</p>
              <p className="text-xl font-black text-yellow-400 leading-none">{score}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Game Stage */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-black to-indigo-950">
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Sparkles size={48} className="text-yellow-400" />
              </div>
              <h4 className="text-2xl font-black text-white mb-2">Ready to Catch?</h4>
              <p className="text-white/60 text-sm max-w-xs mb-8">Tap or click the falling stars to catch them. Each star caught worth 2 Growth Points!</p>
              <button 
                onClick={startGame}
                className="px-12 py-4 bg-yellow-400 text-black rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Start Mission
              </button>
            </div>
          )}

          {isPlaying && (
            <>
              {stars.map(star => (
                <motion.button
                  key={star.id}
                  onPointerDown={() => catchStar(star.id)}
                  className="absolute p-3 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                  style={{ left: `${star.x}%`, top: `${star.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5 }}
                >
                  <Sparkles size={32} />
                </motion.button>
              ))}
            </>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/80">
              <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mb-6">
                <Trophy size={48} className="text-pink-500" />
              </div>
              <h4 className="text-3xl font-black text-white mb-2">Mission Complete!</h4>
              <p className="text-white/60 text-sm mb-2">You caught {score} memory fragments</p>
              <div className="text-2xl font-black text-yellow-400 mb-8 flex items-center gap-2 justify-center">
                <Coins size={24} />
                +{score * 2} Growth Points
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={startGame}
                  className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black hover:bg-white/20 transition-all"
                >
                  Play Again
                </button>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
