import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Quest } from '../types';
import { DAILY_QUESTS } from '../data/hubData';

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
      } else {
        // If doc doesn't exist, create it with current state (from local)
        saveToFirestore(points, tokens, unlockedSkins, unlockedTracks, inventory, quests);
      }
      setIsSyncing(false);
      initialLoadDone.current = true;
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Save to LocalStorage and Firestore
  const saveToFirestore = async (p: number, tk: number, s: string[], t: string[], i: string[], q: Quest[]) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        points: p,
        tokens: tk,
        unlockedSkins: s,
        unlockedTracks: t,
        inventory: i,
        quests: q,
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
    
    if (initialLoadDone.current) {
      saveToFirestore(points, tokens, unlockedSkins, unlockedTracks, inventory, quests);
    }
  }, [points, tokens, unlockedSkins, unlockedTracks, inventory, quests]);

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
      isSyncing
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
