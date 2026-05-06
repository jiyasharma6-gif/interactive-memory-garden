import React, { useState } from 'react';
import { ShopItem } from '../types';
import { PREMIUM_SEEDS, PREMIUM_DECORATIONS, PREMIUM_MUSIC_PACKS } from '../data/hubData';
import { usePoints } from './PointsContext';

type PremiumCategory = 'seeds' | 'decorations' | 'music';

export function PremiumShop() {
  const { points, premiumItems, purchasePremium, canAccessPremium, subscriptionTier } = usePoints();
  const [activeCategory, setActiveCategory] = useState<PremiumCategory>('seeds');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const categories: { id: PremiumCategory; label: string; items: ShopItem[] }[] = [
    { id: 'seeds', label: 'Premium Seeds', items: PREMIUM_SEEDS },
    { id: 'decorations', label: 'Decorations', items: PREMIUM_DECORATIONS },
    { id: 'music', label: 'Music Packs', items: PREMIUM_MUSIC_PACKS },
  ];

  const activeItems = categories.find(c => c.id === activeCategory)?.items || [];

  const handlePurchase = (item: ShopItem) => {
    if (!canAccessPremium(item.requiredTier)) {
      setPurchaseMessage(`Requires ${item.requiredTier === 'patron' ? 'Garden Patron' : 'Garden Master'} subscription`);
      setTimeout(() => setPurchaseMessage(null), 3000);
      return;
    }
    
    if (premiumItems.includes(item.id)) {
      setPurchaseMessage('You already own this item!');
      setTimeout(() => setPurchaseMessage(null), 3000);
      return;
    }

    if (purchasePremium(item)) {
      setPurchaseMessage(`${item.name} unlocked!`);
      setTimeout(() => setPurchaseMessage(null), 3000);
    } else {
      setPurchaseMessage('Not enough points!');
      setTimeout(() => setPurchaseMessage(null), 3000);
    }
  };

  const getTierBadge = (tier?: string) => {
    if (tier === 'master') return { label: 'Master', color: 'bg-amber-500' };
    if (tier === 'patron') return { label: 'Patron', color: 'bg-purple-500' };
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <span className="text-2xl">&#128081;</span> Premium Collection
        </h2>
        <div className="text-sm text-amber-300">
          {points.toLocaleString()} GP
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Purchase Message */}
      {purchaseMessage && (
        <div className="mb-4 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 text-sm text-center">
          {purchaseMessage}
        </div>
      )}

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {activeItems.map(item => {
            const owned = premiumItems.includes(item.id);
            const canAccess = canAccessPremium(item.requiredTier);
            const tierBadge = getTierBadge(item.requiredTier);
            
            return (
              <div
                key={item.id}
                className={`relative p-4 rounded-xl border transition-all ${
                  owned
                    ? 'bg-amber-900/30 border-amber-500/50'
                    : canAccess
                    ? 'bg-gradient-to-br from-amber-900/20 to-purple-900/20 border-amber-500/30 hover:border-amber-400'
                    : 'bg-gray-900/30 border-gray-700/50 opacity-70'
                }`}
              >
                {/* Premium Badge */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {tierBadge && (
                    <span className={`px-2 py-0.5 ${tierBadge.color} text-white text-xs rounded-full font-medium`}>
                      {tierBadge.label}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">
                    Premium
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center text-3xl">
                    {item.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-sm font-bold ${owned ? 'text-green-400' : 'text-amber-400'}`}>
                        {owned ? 'Owned' : `${item.price} GP`}
                      </span>
                      
                      {!owned && (
                        <button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAccess}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            canAccess
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {canAccess ? 'Purchase' : 'Locked'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Upsell (for free users) */}
      {subscriptionTier === 'free' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/40 to-amber-900/40 rounded-xl border border-purple-500/30">
          <p className="text-sm text-white/80">
            <span className="text-amber-400 font-semibold">Unlock more!</span> Subscribe to Garden Patron or Master for access to exclusive items and bonuses.
          </p>
        </div>
      )}
    </div>
  );
}
