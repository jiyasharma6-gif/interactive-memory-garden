import { ShopItem, Quest, Season, SubscriptionPlan, ExclusiveZone, LoreEntry, SeasonalEvent, MerchItem, PartnerAd } from '../types';

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

// Premium Seeds
export const PREMIUM_SEEDS: ShopItem[] = [
  { id: 'celestial_orchid', name: 'Celestial Orchid Seed', description: 'A rare orchid that glows with starlight. Only blooms under the night sky.', price: 500, type: 'seed', rarity: 'legendary', icon: '🌟', isPremium: true, requiredTier: 'patron' },
  { id: 'phoenix_bloom', name: 'Phoenix Bloom Seed', description: 'A fiery flower that rises from its own ashes. Never wilts.', price: 750, type: 'seed', rarity: 'legendary', icon: '🔥', isPremium: true, requiredTier: 'patron' },
  { id: 'moonpetal', name: 'Moonpetal Seed', description: 'Luminescent petals that follow the phases of the moon.', price: 600, type: 'seed', rarity: 'legendary', icon: '🌙', isPremium: true, requiredTier: 'patron' },
  { id: 'dragons_breath', name: "Dragon's Breath Seed", description: 'An ancient flower said to have grown in dragon lairs.', price: 1000, type: 'seed', rarity: 'legendary', icon: '🐉', isPremium: true, requiredTier: 'master' },
  { id: 'aurora_lily', name: 'Aurora Lily Seed', description: 'Shimmers with the colors of the northern lights.', price: 850, type: 'seed', rarity: 'legendary', icon: '💫', isPremium: true, requiredTier: 'master' },
];

// Premium Decorations
export const PREMIUM_DECORATIONS: ShopItem[] = [
  { id: 'crystal_fountain', name: 'Crystal Fountain', description: 'A magical fountain that attracts rare butterflies to your garden.', price: 800, type: 'decor', rarity: 'legendary', icon: '💎', isPremium: true, requiredTier: 'patron' },
  { id: 'fairy_ring', name: 'Fairy Ring', description: 'An enchanted mushroom circle where fairies dance at night.', price: 650, type: 'decor', rarity: 'legendary', icon: '🧚', isPremium: true, requiredTier: 'patron' },
  { id: 'ancient_shrine', name: 'Ancient Shrine', description: 'A weathered shrine that blesses nearby flowers with faster growth.', price: 900, type: 'decor', rarity: 'legendary', icon: '⛩️', isPremium: true, requiredTier: 'patron' },
  { id: 'wishing_well', name: 'Wishing Well', description: 'Toss in points for a chance at rare rewards.', price: 1200, type: 'decor', rarity: 'legendary', icon: '🪙', isPremium: true, requiredTier: 'master' },
  { id: 'celestial_arch', name: 'Celestial Arch', description: 'A gateway decorated with stars and moons.', price: 1500, type: 'decor', rarity: 'legendary', icon: '🌌', isPremium: true, requiredTier: 'master' },
];

// Premium Music Packs
export const PREMIUM_MUSIC_PACKS: ShopItem[] = [
  { id: 'music_celestial', name: 'Celestial Symphony Pack', description: 'Ethereal orchestral pieces inspired by the cosmos.', price: 400, type: 'music', rarity: 'legendary', icon: '🎻', isPremium: true, requiredTier: 'patron' },
  { id: 'music_ancient', name: 'Ancient Melodies Pack', description: 'Mystical tunes from forgotten civilizations.', price: 350, type: 'music', rarity: 'rare', icon: '🎺', isPremium: true, requiredTier: 'patron' },
  { id: 'music_seasons', name: 'Four Seasons Collection', description: 'Dynamic soundscapes that change with the seasons.', price: 600, type: 'music', rarity: 'legendary', icon: '🎼', isPremium: true, requiredTier: 'master' },
  { id: 'music_lullaby', name: 'Garden Lullabies', description: 'Soothing melodies perfect for peaceful contemplation.', price: 300, type: 'music', rarity: 'rare', icon: '🎵', isPremium: true, requiredTier: 'patron' },
];

// Subscription Tiers
export const SUBSCRIPTION_TIERS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Seedling',
    tier: 'free',
    price: 0,
    benefits: [
      'Access to basic garden',
      'Plant and care for memories',
      'Earn growth points',
      'Basic music tracks',
      'Daily quests'
    ],
    icon: '🌱',
    color: '#6BCB77'
  },
  {
    id: 'patron',
    name: 'Garden Patron',
    tier: 'patron',
    price: 2.99,
    benefits: [
      'Everything in Seedling',
      'Premium seeds and decorations',
      'Exclusive Celestial Grove zone',
      'Ad-free experience',
      'Early access to seasonal events',
      'Subscriber-only lore entries',
      '20% bonus growth points'
    ],
    icon: '🌺',
    color: '#9C27B0'
  },
  {
    id: 'master',
    name: 'Garden Master',
    tier: 'master',
    price: 7.99,
    benefits: [
      'Everything in Garden Patron',
      'All premium content unlocked',
      'Exclusive Mystic Pond zone',
      'All lore entries unlocked',
      'Exclusive seasonal rewards',
      'Priority support',
      '50% bonus growth points',
      'Monthly exclusive flower'
    ],
    icon: '👑',
    color: '#FFD700'
  }
];

// Exclusive Zones
export const EXCLUSIVE_ZONES: ExclusiveZone[] = [
  {
    id: 'celestial_grove',
    name: 'Celestial Grove',
    description: 'A mystical forest clearing bathed in eternal starlight. Here, flowers grow with cosmic energy.',
    requiredTier: 'patron',
    unlockPrice: 500,
    backgroundImage: '/zones/celestial-grove.jpg',
    uniqueFlowers: ['celestial_orchid', 'moonpetal', 'aurora_lily'],
    loreId: 'lore_celestial_origin'
  },
  {
    id: 'mystic_pond',
    name: 'Mystic Pond',
    description: 'A serene pond where water lilies whisper ancient secrets. The mist here reveals hidden truths.',
    requiredTier: 'master',
    unlockPrice: 1000,
    backgroundImage: '/zones/mystic-pond.jpg',
    uniqueFlowers: ['dragons_breath', 'phoenix_bloom'],
    loreId: 'lore_pond_secrets'
  },
  {
    id: 'ember_garden',
    name: 'Ember Garden',
    description: 'A warm volcanic garden where fire flowers thrive among glowing embers.',
    requiredTier: 'master',
    backgroundImage: '/zones/ember-garden.jpg',
    uniqueFlowers: ['phoenix_bloom', 'dragons_breath'],
    loreId: 'lore_ember_legend'
  }
];

// Lore Entries
export const LORE_ENTRIES: LoreEntry[] = [
  {
    id: 'lore_garden_origin',
    title: 'The First Garden',
    content: 'Long ago, when memories were but whispers in the wind, a lone gardener planted the first seed of remembrance. From that single act of care, the Memory Garden began to grow, spreading across the realm of consciousness...',
    isPremium: false,
    icon: '📜'
  },
  {
    id: 'lore_flower_whispers',
    title: 'The Language of Flowers',
    content: 'Each flower in the garden speaks a silent language. The cherry blossom speaks of fleeting beauty, the frost rose of resilience, and the sunflower of unwavering hope. Those who listen closely can hear their stories...',
    relatedFlower: 'cherry_blossom_seed',
    isPremium: false,
    icon: '🌸'
  },
  {
    id: 'lore_celestial_origin',
    title: 'Origin of the Celestial Grove',
    content: 'When the first stars fell to earth, they took root in a hidden clearing. The Celestial Grove was born from stardust and moonbeams, a place where the boundary between sky and earth blurs into wonder...',
    relatedZone: 'celestial_grove',
    isPremium: true,
    requiredTier: 'patron',
    icon: '✨'
  },
  {
    id: 'lore_pond_secrets',
    title: 'Secrets of the Mystic Pond',
    content: 'The waters of the Mystic Pond hold reflections of memories yet to be made. Ancient gardeners would gaze into its depths to glimpse the flowers of tomorrow. Some say the pond itself is alive...',
    relatedZone: 'mystic_pond',
    isPremium: true,
    requiredTier: 'master',
    icon: '🌊'
  },
  {
    id: 'lore_ember_legend',
    title: 'Legend of the Ember Garden',
    content: 'Born from the last breath of a benevolent dragon, the Ember Garden burns with eternal warmth. Here, fire is not destroyer but creator, nurturing flowers that bloom in flame...',
    relatedZone: 'ember_garden',
    isPremium: true,
    requiredTier: 'master',
    icon: '🔥'
  },
  {
    id: 'lore_phoenix_tale',
    title: 'Tale of the Phoenix Bloom',
    content: 'The Phoenix Bloom is said to sprout only where a phoenix has shed its feathers. Each petal carries the essence of rebirth, granting resilience to gardens blessed with its presence...',
    relatedFlower: 'phoenix_bloom',
    isPremium: true,
    requiredTier: 'patron',
    icon: '🔥'
  }
];

// Seasonal Events
export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'spring_awakening',
    name: 'Spring Awakening Festival',
    description: 'Celebrate the return of new growth with exclusive spring flowers and double growth points!',
    startDate: '2024-03-20',
    endDate: '2024-04-20',
    rewards: [
      { id: 'spring_crown', name: 'Flower Crown', type: 'decor', value: 'spring_crown', isSubscriberOnly: false },
      { id: 'spring_points', name: 'Bonus Points', type: 'points', value: 500, isSubscriberOnly: false },
      { id: 'spring_rare', name: 'Sakura Spirit Seed', type: 'seed', value: 'sakura_spirit', isSubscriberOnly: true }
    ],
    subscriberBonus: 'Exclusive Sakura Spirit Seed and 2x event points',
    theme: 'spring',
    bannerImage: '/events/spring-awakening.jpg'
  },
  {
    id: 'midsummer_magic',
    name: 'Midsummer Magic',
    description: 'The longest day brings the most magical blooms. Capture fireflies and grow luminescent flowers!',
    startDate: '2024-06-20',
    endDate: '2024-07-20',
    rewards: [
      { id: 'firefly_jar', name: 'Firefly Jar', type: 'decor', value: 'firefly_jar', isSubscriberOnly: false },
      { id: 'summer_points', name: 'Summer Points', type: 'points', value: 600, isSubscriberOnly: false },
      { id: 'sunfire_seed', name: 'Sunfire Flower Seed', type: 'seed', value: 'sunfire_flower', isSubscriberOnly: true }
    ],
    subscriberBonus: 'Exclusive Sunfire Flower and unlimited firefly catching',
    theme: 'summer',
    bannerImage: '/events/midsummer-magic.jpg'
  },
  {
    id: 'harvest_moon',
    name: 'Harvest Moon Celebration',
    description: 'Under the golden harvest moon, rare seeds can be found and ancient lore unlocked.',
    startDate: '2024-09-22',
    endDate: '2024-10-22',
    rewards: [
      { id: 'moon_lantern', name: 'Moon Lantern', type: 'decor', value: 'moon_lantern', isSubscriberOnly: false },
      { id: 'harvest_lore', name: 'Ancient Harvest Tale', type: 'lore', value: 'lore_harvest', isSubscriberOnly: false },
      { id: 'golden_gourd', name: 'Golden Gourd Seed', type: 'seed', value: 'golden_gourd', isSubscriberOnly: true }
    ],
    subscriberBonus: 'Exclusive Golden Gourd and secret lore chapters',
    theme: 'autumn',
    bannerImage: '/events/harvest-moon.jpg'
  }
];

// Merchandise Items
export const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'merch_poster_celestial',
    name: 'Celestial Garden Poster',
    description: 'A stunning art print featuring the Celestial Grove in all its starlit glory.',
    basePrice: 24.99,
    image: '/merch/poster-celestial.jpg',
    category: 'print',
    relatedFlower: 'celestial_orchid'
  },
  {
    id: 'merch_tshirt_phoenix',
    name: 'Phoenix Bloom Tee',
    description: 'Soft cotton t-shirt featuring the legendary Phoenix Bloom.',
    basePrice: 29.99,
    image: '/merch/tshirt-phoenix.jpg',
    category: 'apparel',
    relatedFlower: 'phoenix_bloom'
  },
  {
    id: 'merch_mug_garden',
    name: 'Memory Garden Mug',
    description: 'Start your day with memories. Features wraparound garden illustration.',
    basePrice: 18.99,
    image: '/merch/mug-garden.jpg',
    category: 'accessory'
  },
  {
    id: 'merch_notebook',
    name: 'Gardener\'s Journal',
    description: 'A beautiful hardcover notebook for recording your garden thoughts.',
    basePrice: 22.99,
    image: '/merch/notebook.jpg',
    category: 'accessory'
  },
  {
    id: 'merch_enamel_pin',
    name: 'Rare Flower Pin Set',
    description: 'Collectible enamel pins featuring legendary flowers from the garden.',
    basePrice: 14.99,
    image: '/merch/pins.jpg',
    category: 'accessory'
  }
];

// Partner Ads (Garden-themed, subtle)
export const PARTNER_ADS: PartnerAd[] = [
  {
    id: 'ad_calm',
    partnerName: 'Calm Gardens',
    title: 'Find Your Inner Peace',
    description: 'Real-world garden meditation retreats. 10% off for Memory Garden players.',
    image: '/ads/calm-gardens.jpg',
    link: '#',
    theme: 'wellness'
  },
  {
    id: 'ad_seeds',
    partnerName: 'Bloom Seeds Co.',
    title: 'Grow Real Memories',
    description: 'Premium flower seeds delivered to your door. Start your real garden today.',
    image: '/ads/bloom-seeds.jpg',
    link: '#',
    theme: 'garden'
  },
  {
    id: 'ad_nature',
    partnerName: 'Nature Sounds App',
    title: 'Ambient Nature Anywhere',
    description: 'Take the peaceful sounds of nature with you. Free trial for gardeners.',
    image: '/ads/nature-sounds.jpg',
    link: '#',
    theme: 'nature'
  }
];
