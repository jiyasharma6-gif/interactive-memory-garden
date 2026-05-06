import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, LogOut, ShieldCheck, Cloud, RefreshCw, LogIn, X, Star, Heart, Calendar } from 'lucide-react';
import { useAuth } from './AuthContext';
import { usePoints } from './PointsContext';
import { useTheme } from './ThemeContext';
import { TimeOfDay } from '../types';

export function UserProfile({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, loginWithGoogle, logout, isAnonymous } = useAuth();
  const { points, inventory, isSyncing } = usePoints();
  const { timeOfDay } = useTheme();
  
  const isDay = timeOfDay === TimeOfDay.DAY;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
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
            className={`relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border ${
              isDay ? 'bg-white border-gray-100' : 'bg-gray-900 border-white/10'
            } p-8`}
          >
            <button 
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-full transition-all ${isDay ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/10 text-white/40'}`}
            >
              <X size={20} />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isDay ? 'border-pink-50' : 'border-white/10'} shadow-xl`}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-pink-500 flex items-center justify-center text-white">
                      <UserIcon size={40} />
                    </div>
                  )}
                </div>
                {!isAnonymous && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                    <ShieldCheck size={14} />
                  </div>
                )}
              </div>

              <h2 className={`text-2xl font-black tracking-tight ${isDay ? 'text-gray-900' : 'text-white'}`}>
                {isAnonymous ? 'Guest Gardener' : (user?.displayName || 'Gardener')}
              </h2>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDay ? 'text-gray-400' : 'text-white/40'}`}>
                Level {Math.floor(points / 500) + 1} Enthusiast
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-2xl border ${isDay ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-2 mb-1 text-pink-500">
                  <Star size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Growth Points</span>
                </div>
                <div className={`text-xl font-black ${isDay ? 'text-gray-900' : 'text-white'}`}>{points}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isDay ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-2 mb-1 text-blue-500">
                  <Heart size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Collections</span>
                </div>
                <div className={`text-xl font-black ${isDay ? 'text-gray-900' : 'text-white'}`}>{inventory.length}</div>
              </div>
            </div>

            {/* Sync Status */}
            <div className={`mb-8 p-4 rounded-2xl border flex items-center justify-between ${
              isAnonymous 
                ? (isDay ? 'bg-yellow-50 border-yellow-100' : 'bg-yellow-500/10 border-yellow-500/10')
                : (isDay ? 'bg-green-50 border-green-100' : 'bg-green-500/10 border-green-500/10')
            }`}>
              <div className="flex items-center gap-3">
                <RefreshCw className={isAnonymous ? 'text-yellow-600' : 'text-green-600'} size={20} />
                <div>
                  <p className={`text-xs font-black uppercase tracking-tight ${isDay ? 'text-gray-900' : 'text-white'}`}>
                    {isAnonymous ? 'Local Progress Only' : 'Cloud Synced'}
                  </p>
                  <p className={`text-[10px] ${isDay ? 'text-gray-500' : 'text-white/40'}`}>
                    {isAnonymous ? 'Login to save across devices' : 'Your garden is safe in the clouds'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isAnonymous ? (
                <button
                  onClick={loginWithGoogle}
                  className="w-full py-4 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <LogIn size={20} />
                  Sync with Google
                </button>
              ) : (
                <button
                  onClick={logout}
                  className={`w-full py-4 rounded-2xl font-black border transition-all flex items-center justify-center gap-3 ${
                    isDay ? 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              )}
            </div>

            <p className={`text-center mt-6 text-[10px] font-medium ${isDay ? 'text-gray-400' : 'text-white/20'}`}>
              Member since {new Date(user?.metadata.creationTime || Date.now()).toLocaleDateString()}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
