import React, { useState } from 'react';
import { EXCLUSIVE_ZONES, LORE_ENTRIES } from '../data/hubData';
import { usePoints } from './PointsContext';

export function ExclusiveZones() {
  const { points, subscriptionTier, unlockedZones, unlockZone, canAccessPremium } = usePoints();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUnlock = (zoneId: string, cost?: number) => {
    const zone = EXCLUSIVE_ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    // Check subscription tier
    if (!canAccessPremium(zone.requiredTier)) {
      setMessage(`Requires ${zone.requiredTier === 'patron' ? 'Garden Patron' : 'Garden Master'} subscription`);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // If already unlocked via subscription, just open
    if (canAccessPremium(zone.requiredTier)) {
      setSelectedZone(zoneId);
      return;
    }

    // Otherwise, try to purchase with points
    if (cost && unlockZone(zoneId, cost)) {
      setMessage(`${zone.name} unlocked!`);
      setSelectedZone(zoneId);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('Not enough points!');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getTierColor = (tier: string) => {
    if (tier === 'master') return 'from-amber-500/30 to-amber-900/30';
    return 'from-purple-500/30 to-purple-900/30';
  };

  const selectedZoneData = EXCLUSIVE_ZONES.find(z => z.id === selectedZone);
  const relatedLore = selectedZoneData?.loreId 
    ? LORE_ENTRIES.find(l => l.id === selectedZoneData.loreId)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-teal-400 flex items-center gap-2">
          <span className="text-2xl">&#127758;</span> Exclusive Zones
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Discover mystical gardens hidden beyond the veil
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-300 text-sm text-center">
          {message}
        </div>
      )}

      {/* Zone Detail View */}
      {selectedZone && selectedZoneData ? (
        <div className="flex-1 overflow-y-auto">
          <button
            onClick={() => setSelectedZone(null)}
            className="mb-4 text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            <span>&#8592;</span> Back to zones
          </button>
          
          <div className={`p-6 rounded-xl bg-gradient-to-br ${getTierColor(selectedZoneData.requiredTier)} border border-teal-500/30`}>
            <h3 className="text-xl font-bold text-white mb-2">{selectedZoneData.name}</h3>
            <p className="text-sm text-white/70 mb-4">{selectedZoneData.description}</p>
            
            {/* Unique Flowers */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-teal-300 mb-2">Unique Flowers Found Here:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedZoneData.uniqueFlowers.map(flower => (
                  <span key={flower} className="px-3 py-1 bg-teal-900/50 rounded-full text-xs text-teal-200">
                    {flower.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Lore */}
            {relatedLore && (
              <div className="p-4 bg-black/30 rounded-lg border border-teal-600/30">
                <h4 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  {relatedLore.icon} {relatedLore.title}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {relatedLore.content}
                </p>
              </div>
            )}

            {/* Enter Zone Button (Placeholder) */}
            <button className="mt-4 w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-all">
              Enter {selectedZoneData.name}
            </button>
          </div>
        </div>
      ) : (
        /* Zones Grid */
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {EXCLUSIVE_ZONES.map(zone => {
              const isUnlocked = unlockedZones.includes(zone.id) || canAccessPremium(zone.requiredTier);
              const tierLabel = zone.requiredTier === 'master' ? 'Master' : 'Patron';
              
              return (
                <div
                  key={zone.id}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isUnlocked
                      ? `bg-gradient-to-br ${getTierColor(zone.requiredTier)} border-teal-500/30 hover:border-teal-400`
                      : 'bg-gray-900/50 border-gray-700/50'
                  }`}
                  onClick={() => isUnlocked && handleUnlock(zone.id, zone.unlockPrice)}
                >
                  {/* Lock Overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <span className="text-4xl">&#128274;</span>
                        <p className="text-sm text-white/70 mt-2">
                          Requires {tierLabel}
                        </p>
                        {zone.unlockPrice && (
                          <p className="text-xs text-amber-400 mt-1">
                            Or unlock for {zone.unlockPrice} GP
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tier Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 ${zone.requiredTier === 'master' ? 'bg-amber-500' : 'bg-purple-500'} text-white text-xs rounded-full font-medium`}>
                      {tierLabel}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    {/* Zone Icon */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500/30 to-blue-500/30 flex items-center justify-center">
                      <span className="text-3xl">
                        {zone.id === 'celestial_grove' && '&#127776;'}
                        {zone.id === 'mystic_pond' && '&#129692;'}
                        {zone.id === 'ember_garden' && '&#128293;'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{zone.name}</h3>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">{zone.description}</p>
                      
                      {isUnlocked && (
                        <span className="inline-block mt-2 text-xs text-teal-400">
                          Click to explore &#8594;
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
