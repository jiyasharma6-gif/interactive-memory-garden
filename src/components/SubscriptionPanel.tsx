import React, { useState } from 'react';
import { SUBSCRIPTION_TIERS } from '../data/hubData';
import { usePoints } from './PointsContext';
import { PremiumTier } from '../types';

export function SubscriptionPanel() {
  const { subscriptionTier, subscribe, getPointsMultiplier } = usePoints();
  const [showConfirm, setShowConfirm] = useState<PremiumTier | null>(null);

  const handleSubscribe = (tier: PremiumTier) => {
    // In production, this would open a payment flow
    setShowConfirm(tier);
  };

  const confirmSubscription = () => {
    if (showConfirm) {
      subscribe(showConfirm);
      setShowConfirm(null);
    }
  };

  const currentTierIndex = ['free', 'patron', 'master'].indexOf(subscriptionTier);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <span className="text-2xl">&#128142;</span> Subscription Tiers
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Support the garden and unlock exclusive benefits
        </p>
      </div>

      {/* Current Status */}
      <div className="mb-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Current Tier:</span>
          <span className="font-semibold text-purple-300">
            {SUBSCRIPTION_TIERS.find(t => t.tier === subscriptionTier)?.name || 'Seedling'}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-white/70">Points Multiplier:</span>
          <span className="font-semibold text-green-400">{getPointsMultiplier()}x</span>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {SUBSCRIPTION_TIERS.map((tier, index) => {
          const isCurrentTier = tier.tier === subscriptionTier;
          const isUpgrade = index > currentTierIndex;
          const isDowngrade = index < currentTierIndex;

          return (
            <div
              key={tier.id}
              className={`relative p-4 rounded-xl border transition-all ${
                isCurrentTier
                  ? 'bg-gradient-to-br from-purple-900/40 to-amber-900/40 border-purple-400'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Current Badge */}
              {isCurrentTier && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-medium">
                  Current
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${tier.color}20` }}
                >
                  {tier.icon}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{tier.name}</h3>
                    {tier.price > 0 && (
                      <span className="text-sm text-white/60">
                        ${tier.price}/month
                      </span>
                    )}
                  </div>

                  {/* Benefits */}
                  <ul className="mt-2 space-y-1">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">&#10003;</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  {!isCurrentTier && isUpgrade && (
                    <button
                      onClick={() => handleSubscribe(tier.tier)}
                      className="mt-3 w-full py-2 rounded-lg font-medium text-sm transition-all"
                      style={{ 
                        backgroundColor: tier.color,
                        color: tier.tier === 'master' ? '#000' : '#fff'
                      }}
                    >
                      Upgrade to {tier.name}
                    </button>
                  )}
                  
                  {!isCurrentTier && isDowngrade && (
                    <button
                      onClick={() => handleSubscribe(tier.tier)}
                      className="mt-3 w-full py-2 rounded-lg font-medium text-sm bg-gray-700 text-white/70 hover:bg-gray-600 transition-all"
                    >
                      Downgrade
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-purple-500/30">
            <h3 className="text-lg font-bold text-white mb-2">
              Confirm Subscription Change
            </h3>
            <p className="text-sm text-white/70 mb-4">
              {showConfirm === 'free' 
                ? 'Are you sure you want to cancel your subscription?' 
                : `You are about to subscribe to ${SUBSCRIPTION_TIERS.find(t => t.tier === showConfirm)?.name}. In a real app, this would open a payment flow.`
              }
            </p>
            <p className="text-xs text-amber-400 mb-4">
              Demo Mode: No actual payment will be processed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubscription}
                className="flex-1 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
