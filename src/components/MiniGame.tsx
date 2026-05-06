import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Sparkles } from 'lucide-react';
import { usePoints } from './PointsContext';

interface GameProps {
  onClose: () => void;
}

const CARDS = ['🌸', '🌼', '🌻', '🌺', '🌹', '🌷', '🏵️', '🍀'];

export function MiniGame({ onClose }: GameProps) {
  const { addPoints } = usePoints();
  const [cards, setCards] = useState<{ id: number, emoji: string, flipped: boolean, matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    const deck = [...CARDS, ...CARDS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
    setCards(deck);
  }, []);

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlipped([]);
        
        if (newCards.every(c => c.matched)) {
          setIsWon(true);
          addPoints(50);
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

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
        className="bg-white rounded-[3rem] p-8 w-full max-w-2xl relative shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-16 -mt-16 -z-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -ml-12 -mb-12 -z-10" />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Memory Match</h2>
          <p className="text-gray-500 font-medium">Match the flowers to earn growth points!</p>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all border-b-4 ${
                card.flipped || card.matched 
                  ? 'bg-white border-gray-100 rotate-0' 
                  : 'bg-gray-100 border-gray-300 rotate-y-180'
              }`}
            >
              {(card.flipped || card.matched) ? card.emoji : '🌱'}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isWon && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-yellow-500 font-black text-xl mb-4">
                <Trophy size={24} />
                <span>+50 Growth Points!</span>
                <Sparkles size={24} />
              </div>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all"
              >
                Return to Garden
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
