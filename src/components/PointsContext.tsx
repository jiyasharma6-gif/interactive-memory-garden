import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Quest, PremiumTier, ShopItem } from '../types';
import { DAILY_QUESTS, SUBSCRIPTION_TIERS } from '../data/hubData';

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  unlockedSkins: string[];
  unlockSkin: (skin: string, cost: number) => boolean;
  unlockedTracks: string[];
  unlockTrack: (trackId: string, cost: number) => boolean;
  inventory: string[];
  buyItem: (itemId: string, cost: number) => boolean;
  tokens: number;
  addTokens: (amount: number) => void;
  quests: Quest[];
  updateQuest: (questId: string, progress: number) => void;
  claimQuestReward: (questId: string) => void;
  isSyncing: boolean;
  // Monetization
  subscriptionTier: PremiumTier;
  premiumItems: string[];
  unlockedZones: string[];
  unlockedLore: string[];
  adsOptOut: boolean;
  subscribe: (tier: PremiumTier) => boolean;
  purchasePremium: (item: ShopItem) => boolean;
  unlockZone: (zoneId: string, cost: number) => boolean;
  unlockLore: (loreId: string) => boolean;
  setAdsOptOut: (optOut: boolean) => void;
  canAccessPremium: (requiredTier?: PremiumTier) => boolean;
  getPointsMultiplier: () => number;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(true);
  const [points, setPoints] = useState<number>(0);
  const [tokens, setTokens] = useState<number>(50); // Starting tokens
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(['common']);
  const [unlockedTracks, setUnlockedTracks] = useState<string[]>(['zen', 'meadow']);
  const [inventory, setInventory] = useState<string[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  
  // Monetization state
  const [subscriptionTier, setSubscriptionTier] = useState<PremiumTier>('free');
  const [premiumItems, setPremiumItems] = useState<string[]>([]);
  const [unlockedZones, setUnlockedZones] = useState<string[]>([]);
  const [unlockedLore, setUnlockedLore] = useState<string[]>([]);
  const [adsOptOut, setAdsOptOutState] = useState<boolean>(false);
  
  // Initialize and reset quests if a new day has arrived
  useEffect(() => {
    const lastReset = localStorage.getItem('memory_garden_last_reset');
    const today = new Date().toDateString();
    
    if (lastReset !== today || quests.length === 0) {
      setQuests(DAILY_QUESTS);
      localStorage.setItem('memory_garden_last_reset', today);
    }
  }, [quests.length]);
  
  const initialLoadDone = useRef(false);

  // Initial load from LocalStorage
  useEffect(() => {
    const sPoints = localStorage.getItem('memory_garden_points');
    const sTokens = localStorage.getItem('memory_garden_tokens');
    const sSkins = localStorage.getItem('memory_garden_skins');
    const sTracks = localStorage.getItem('memory_garden_tracks');
    const sInventory = localStorage.getItem('memory_garden_inventory');
    const sQuests = localStorage.getItem('memory_garden_quests');

    if (sPoints) setPoints(parseInt(sPoints, 10));
    if (sTokens) setTokens(parseInt(sTokens, 10));
    if (sSkins) setUnlockedSkins(JSON.parse(sSkins));
    if (sTracks) setUnlockedTracks(JSON.parse(sTracks));
    if (sInventory) setInventory(JSON.parse(sInventory));
    if (sQuests) setQuests(JSON.parse(sQuests));
    
    // Load monetization data
    const sSubscription = localStorage.getItem('memory_garden_subscription');
    const sPremiumItems = localStorage.getItem('memory_garden_premium_items');
    const sZones = localStorage.getItem('memory_garden_zones');
    const sLore = localStorage.getItem('memory_garden_lore');
    const sAdsOptOut = localStorage.getItem('memory_garden_ads_opt_out');
    
    if (sSubscription) setSubscriptionTier(sSubscription as PremiumTier);
    if (sPremiumItems) setPremiumItems(JSON.parse(sPremiumItems));
    if (sZones) setUnlockedZones(JSON.parse(sZones));
    if (sLore) setUnlockedLore(JSON.parse(sLore));
    if (sAdsOptOut) setAdsOptOutState(sAdsOptOut === 'true');
  }, []);

  // Sync with Firestore when user is available
  useEffect(() => {
    if (!user) {
      setIsSyncing(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPoints(data.points ?? 0);
        setTokens(data.tokens ?? 50);
        setUnlockedSkins(data.unlockedSkins ?? ['common']);
        setUnlockedTracks(data.unlockedTracks ?? ['zen', 'meadow']);
        setInventory(data.inventory ?? []);
        setQuests(data.quests ?? []);
        // Monetization data
        setSubscriptionTier(data.subscriptionTier ?? 'free');
        setPremiumItems(data.premiumItems ?? []);
        setUnlockedZones(data.unlockedZones ?? []);
        setUnlockedLore(data.unlockedLore ?? []);
        setAdsOptOutState(data.adsOptOut ?? false);
      } else {
        // If doc doesn't exist, create it with current state (from local)
        saveToFirestore(points, tokens, unlockedSkins, unlockedTracks, inventory, quests, subscriptionTier, premiumItems, unlockedZones, unlockedLore, adsOptOut);
      }
      setIsSyncing(false);
      initialLoadDone.current = true;
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Save to LocalStorage and Firestore
  const saveToFirestore = async (
    p: number, tk: number, s: string[], t: string[], i: string[], q: Quest[],
    subTier: PremiumTier, premItems: string[], zones: string[], lore: string[], adsOut: boolean
  ) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        points: p,
        tokens: tk,
        unlockedSkins: s,
        unlockedTracks: t,
        inventory: i,
        quests: q,
        subscriptionTier: subTier,
        premiumItems: premItems,
        unlockedZones: zones,
        unlockedLore: lore,
        adsOptOut: adsOut,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (e) {
      console.error("Error saving profile", e);
    }
  };

  useEffect(() => {
    localStorage.setItem('memory_garden_points', points.toString());
    localStorage.setItem('memory_garden_tokens', tokens.toString());
    localStorage.setItem('memory_garden_skins', JSON.stringify(unlockedSkins));
    localStorage.setItem('memory_garden_tracks', JSON.stringify(unlockedTracks));
    localStorage.setItem('memory_garden_inventory', JSON.stringify(inventory));
    localStorage.setItem('memory_garden_quests', JSON.stringify(quests));
    localStorage.setItem('memory_garden_subscription', subscriptionTier);
    localStorage.setItem('memory_garden_premium_items', JSON.stringify(premiumItems));
    localStorage.setItem('memory_garden_zones', JSON.stringify(unlockedZones));
    localStorage.setItem('memory_garden_lore', JSON.stringify(unlockedLore));
    localStorage.setItem('memory_garden_ads_opt_out', adsOptOut.toString());
    
    if (initialLoadDone.current) {
      saveToFirestore(points, tokens, unlockedSkins, unlockedTracks, inventory, quests, subscriptionTier, premiumItems, unlockedZones, unlockedLore, adsOptOut);
    }
  }, [points, tokens, unlockedSkins, unlockedTracks, inventory, quests, subscriptionTier, premiumItems, unlockedZones, unlockedLore, adsOptOut]);

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const addTokens = (amount: number) => {
    setTokens(prev => prev + amount);
  };

  const unlockSkin = (skin: string, cost: number) => {
    if (points >= cost && !unlockedSkins.includes(skin)) {
      setPoints(prev => prev - cost);
      setUnlockedSkins(prev => [...prev, skin]);
      return true;
    }
    return false;
  };

  const unlockTrack = (trackId: string, cost: number) => {
    if (points >= cost && !unlockedTracks.includes(trackId)) {
      setPoints(prev => prev - cost);
      setUnlockedTracks(prev => [...prev, trackId]);
      return true;
    }
    return false;
  };

  const buyItem = (itemId: string, cost: number) => {
    if (points >= cost && !inventory.includes(itemId)) {
      setPoints(prev => prev - cost);
      setInventory(prev => [...prev, itemId]);
      
      // Quest hook: collector
      if (itemId.includes('seed')) {
        updateQuest('collector', 1);
      }
      
      return true;
    }
    return false;
  };

  const updateQuest = (questId: string, progress: number) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && !q.completed) {
        const newProgress = Math.min(q.progress + progress, q.target);
        return { ...q, progress: newProgress, completed: newProgress >= q.target };
      }
      return q;
    }));
  };

  const claimQuestReward = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && quest.completed) {
      addPoints(quest.reward);
      setQuests(prev => prev.filter(q => q.id !== questId));
    }
  };

  // Monetization functions
  const tierHierarchy: PremiumTier[] = ['free', 'patron', 'master'];
  
  const canAccessPremium = (requiredTier?: PremiumTier): boolean => {
    if (!requiredTier || requiredTier === 'free') return true;
    const userTierIndex = tierHierarchy.indexOf(subscriptionTier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
    return userTierIndex >= requiredTierIndex;
  };

  const getPointsMultiplier = (): number => {
    switch (subscriptionTier) {
      case 'master': return 1.5;
      case 'patron': return 1.2;
      default: return 1.0;
    }
  };

  const subscribe = (tier: PremiumTier): boolean => {
    // In a real app, this would integrate with Stripe/payment provider
    // For demo purposes, we simulate the subscription
    setSubscriptionTier(tier);
    if (tier !== 'free') {
      setAdsOptOutState(true); // Subscribers get ad-free experience
    }
    return true;
  };

  const purchasePremium = (item: ShopItem): boolean => {
    if (!item.isPremium) return false;
    
    // Check tier requirement
    if (item.requiredTier && !canAccessPremium(item.requiredTier)) {
      return false;
    }
    
    // Check if already owned
    if (premiumItems.includes(item.id)) return false;
    
    // Check points
    if (points < item.price) return false;
    
    setPoints(prev => prev - item.price);
    setPremiumItems(prev => [...prev, item.id]);
    
    // Also add to appropriate collections
    if (item.type === 'music') {
      setUnlockedTracks(prev => [...prev, item.id]);
    } else {
      setInventory(prev => [...prev, item.id]);
    }
    
    return true;
  };

  const unlockZone = (zoneId: string, cost: number): boolean => {
    if (unlockedZones.includes(zoneId)) return false;
    if (points < cost) return false;
    
    setPoints(prev => prev - cost);
    setUnlockedZones(prev => [...prev, zoneId]);
    return true;
  };

  const unlockLore = (loreId: string): boolean => {
    if (unlockedLore.includes(loreId)) return true;
    setUnlockedLore(prev => [...prev, loreId]);
    return true;
  };

  const setAdsOptOut = (optOut: boolean) => {
    setAdsOptOutState(optOut);
  };

  return (
    <PointsContext.Provider value={{ 
      points, 
      addPoints, 
      unlockedSkins, 
      unlockSkin, 
      unlockedTracks, 
      unlockTrack,
      inventory,
      buyItem,
      tokens,
      addTokens,
      quests,
      updateQuest,
      claimQuestReward,
      isSyncing,
      // Monetization
      subscriptionTier,
      premiumItems,
      unlockedZones,
      unlockedLore,
      adsOptOut,
      subscribe,
      purchasePremium,
      unlockZone,
      unlockLore,
      setAdsOptOut,
      canAccessPremium,
      getPointsMultiplier
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (!context) throw new Error('usePoints must be used within a PointsProvider');
  return context;
}
