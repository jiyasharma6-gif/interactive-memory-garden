import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertCircle, Trophy, Sparkles } from 'lucide-react';
import { usePoints } from './PointsContext';

interface TriviaProps {
  onClose: () => void;
}

const QUESTIONS = [
  {
    q: "Which flower is known as the 'flower of the sun'?",
    a: ["Rose", "Sunflower", "Lily", "Tulip"],
    correct: 1
  },
  {
    q: "What is the primary purpose of a flower's bright colors?",
    a: ["To stay warm", "To attract pollinators", "To hide from animals", "To look pretty"],
    correct: 1
  },
  {
    q: "Which season is known as the 'awakening' of the garden?",
    a: ["Winter", "Autumn", "Summer", "Spring"],
    correct: 3
  },
  {
    q: "What do flowers use to turn sunlight into food?",
    a: ["Photosynthesis", "Magic", "Metabolism", "Respiration"],
    correct: 0
  },
  {
    q: "Which flower symbolizes 'pure love' and 'remembrance'?",
    a: ["Cactus", "Forget-me-not", "Venus Fly Trap", "Dandelion"],
    correct: 1
  }
];

export function TriviaGame({ onClose }: TriviaProps) {
  const { addPoints } = usePoints();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === QUESTIONS[currentIdx].correct;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
        addPoints(score * 20);
      }
    }, 1500);
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
        className="bg-white rounded-[3rem] p-10 w-full max-w-xl relative shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {!isFinished ? (
          <div>
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Nature Trivia • Question {currentIdx + 1}/{QUESTIONS.length}</span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">{QUESTIONS[currentIdx].q}</h2>
            </div>

            <div className="space-y-3">
              {QUESTIONS[currentIdx].a.map((ans, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-5 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between ${
                    selected === i 
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                      : (selected !== null && i === QUESTIONS[currentIdx].correct ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-transparent hover:border-gray-200')
                  }`}
                >
                  <span>{ans}</span>
                  {selected === i && (
                    isCorrect ? <Check size={20} /> : <AlertCircle size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
            <h2 className="text-4xl font-black text-gray-900 mb-2">Well Done!</h2>
            <p className="text-gray-500 mb-8 font-medium">You scored {score} correctly.</p>
            
            <div className="flex items-center justify-center gap-2 text-yellow-600 font-bold text-xl mb-8">
              <Sparkles size={24} />
              <span>+{score * 20} Growth Points</span>
            </div>

            <button 
              onClick={onClose}
              className="px-12 py-4 bg-gray-900 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all"
            >
              Back to Garden
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
