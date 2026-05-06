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
