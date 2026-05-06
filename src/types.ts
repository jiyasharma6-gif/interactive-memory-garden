export enum Season {
  SPRING = 'spring',
  AUTUMN = 'autumn',
  WINTER = 'winter'
}

export enum TimeOfDay {
  DAY = 'day',
  NIGHT = 'night'
}

export interface FlowerData {
  id?: string;
  planterName: string;
  message: string;
  color: string;
  x: number;
  y: number;
  careCount?: number;
  rarity?: 'common' | 'rare' | 'legendary';
  createdAt: any;
  ageInDays?: number;
  isProjectedFocus?: boolean;
  userId?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'seed' | 'decor' | 'skin' | 'music';
  rarity: 'common' | 'rare' | 'legendary';
  icon: string;
  metadata?: any;
  isPremium?: boolean;
  requiredTier?: PremiumTier;
}

// Monetization Types
export type PremiumTier = 'free' | 'patron' | 'master';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PremiumTier;
  price: number; // monthly price in USD, 0 for free
  benefits: string[];
  icon: string;
  color: string;
}

export interface MerchItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: 'print' | 'apparel' | 'accessory';
  relatedFlower?: string;
}

export interface PartnerAd {
  id: string;
  partnerName: string;
  title: string;
  description: string;
  image: string;
  link: string;
  theme: 'nature' | 'wellness' | 'garden';
}

export interface ExclusiveZone {
  id: string;
  name: string;
  description: string;
  requiredTier: PremiumTier;
  unlockPrice?: number; // one-time purchase for non-subscribers
  backgroundImage: string;
  uniqueFlowers: string[];
  loreId?: string;
}

export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  relatedFlower?: string;
  relatedZone?: string;
  isPremium: boolean;
  requiredTier?: PremiumTier;
  icon: string;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rewards: EventReward[];
  subscriberBonus: string;
  theme: string;
  bannerImage: string;
}

export interface EventReward {
  id: string;
  name: string;
  type: 'seed' | 'decor' | 'points' | 'lore';
  value: number | string;
  isSubscriberOnly: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  subscriptionTier: PremiumTier;
  subscriptionExpiry?: string;
  unlockedZones: string[];
  unlockedLore: string[];
  purchasedPremiumItems: string[];
  adsOptOut: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number; // Growth Points
  type: 'collect' | 'care' | 'visit' | 'mini-game';
  target: number;
  progress: number;
  completed: boolean;
}

export interface UserInventory {
  ownedItems: string[]; // IDs of ShopItem
  unlockedTracks: string[]; // IDs of Music tracks
  tokens: number; // Arcade tokens
}

export const PRESET_MESSAGES = [
  "A flower does not think of competing with the flower next to it. It just blooms.",
  "Happiness held is the seed; Happiness shared is the flower.",
  "Wherever life plants you, bloom with grace.",
  "Nature does not hurry, yet everything is accomplished.",
  "Flowers are the music of the ground. From earth's lips spoken without sound.",
  "The earth laughs in flowers.",
  "Love is the flower you've got to let grow.",
  "To plant a garden is to believe in tomorrow.",
  "Every flower is a soul blossoming in nature.",
  "Bloom where you are planted."
];

export const FLOWER_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#F473B9", "#9C27B0", "#FF9800", "#00BCD4"
];
