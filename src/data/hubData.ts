import { ShopItem, Quest, Season } from '../types';

export const SHOP_STOCK: Record<Season, ShopItem[]> = {
  [Season.SPRING]: [
    { id: 'cherry_blossom_seed', name: 'Cherry Blossom Seed', description: 'A delicate seed that blooms into a pink cherry blossom.', price: 50, type: 'seed', rarity: 'rare', icon: '🌸' },
    { id: 'sun_charm', name: 'Spring Sun Charm', description: 'Attracts more growth points in Spring.', price: 150, type: 'decor', rarity: 'common', icon: '☀️' },
    { id: 'skin_pastel', name: 'Pastel Skin', description: 'A soft pastel theme for your garden UI.', price: 300, type: 'skin', rarity: 'rare', icon: '🎨' },
  ],
  [Season.AUTUMN]: [
    { id: 'maple_seed', name: 'Fiery Maple Seed', description: 'Grows into a beautiful red maple plant.', price: 60, type: 'seed', rarity: 'rare', icon: '🍁' },
    { id: 'lantern', name: 'Spirit Lantern', description: 'A glowing lantern to light up autumn nights.', price: 200, type: 'decor', rarity: 'rare', icon: '🏮' },
    { id: 'music_cozy', name: 'Cozy Rain Track', description: 'Unlock a relaxing rain soundscape.', price: 250, type: 'music', rarity: 'common', icon: '🎵' },
  ],
  [Season.WINTER]: [
    { id: 'frost_seed', name: 'Frost Rose Seed', description: 'A flower that thrives in sub-zero temperatures.', price: 75, type: 'seed', rarity: 'legendary', icon: '❄️' },
    { id: 'sculpture', name: 'Ice Sculpture', description: 'A magnificent ice swan that never melts.', price: 500, type: 'decor', rarity: 'legendary', icon: '🦢' },
    { id: 'skin_dark', name: 'Midnight Skin', description: 'A deep dark theme for late night gardening.', price: 300, type: 'skin', rarity: 'rare', icon: '🌑' },
  ],
};

export const MUSIC_ITEMS: ShopItem[] = [
  { id: 'zen_garden', name: 'Zen Garden', description: 'Peaceful meditative loops.', price: 100, type: 'music', rarity: 'common', icon: '🎶' },
  { id: 'forest_whispers', name: 'Forest Whispers', description: 'Deep wood sounds and bird calls.', price: 200, type: 'music', rarity: 'rare', icon: '🌳' },
  { id: 'ethereal_float', name: 'Ethereal Float', description: 'Lush ambient pads.', price: 400, type: 'music', rarity: 'legendary', icon: '✨' },
];

export const DAILY_QUESTS: Quest[] = [
  { id: 'care_master', title: 'Gentle Care', description: 'Water or care for flowers 5 times.', reward: 100, type: 'care', target: 5, progress: 0, completed: false },
  { id: 'social_butterfly', title: 'Social Butterfly', description: 'Visit the garden during 3 different times of day.', reward: 150, type: 'visit', target: 3, progress: 0, completed: false },
  { id: 'gamer', title: 'Arcade Enthusiast', description: 'Play the arcade mini-game 2 times.', reward: 80, type: 'mini-game', target: 2, progress: 0, completed: false },
  { id: 'collector', title: 'Seed Collector', description: 'Buy 1 new seed from the shop.', reward: 200, type: 'seed' as any, target: 1, progress: 0, completed: false },
];
