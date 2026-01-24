export type HippoStats = {
    health: number;
    satiety: number;
    happiness: number;
    cleanliness: number;
    energy: number;
    thirst: number;
};

export type HippoGender = 'male' | 'female';

export type ClothingCategory = 'head' | 'upper' | 'lower' | 'feet' | 'costume';

export type ClothingItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ClothingCategory;
    icon: any;
    rarity: 'common' | 'rare' | 'epic';
    unlocked: boolean;
    ageRestriction?: 'child' | 'parent';
    costume?: string;
};

export type HippoOutfit = {
    head?: string;
    upper?: string;
    lower?: string;
    feet?: string;
    costume?: string;
};

export type GameStats = {
    bubbleGamePlays: number;
    bubbleGameRecord: number;
    memoryGamePlays: number;
    thirdGamePlays: number;
    totalGamePlays: number;
    totalCoinsEarned: number;
};

export interface Hippo {
    id: string;
    name: string;
    gender: HippoGender;
    age: 'child' | 'parent';
    stats: HippoStats;
    outfit: HippoOutfit;
    coins: number;
    createdAt: Date;
    lastFed?: Date;
    lastCleaned?: Date;
    lastPlayed?: Date;
    lastWatered?: Date;
    feedCount: number;
    cleanCount: number;
    playCount: number;
    sleepCount: number;
    waterCount: number;
    gameStats: GameStats;
}

export type HippoMood = 'happy' | 'sad' | 'hungry' | 'sleepy' | 'dirty' | 'thirsty';

export interface HippoContextType {
    hippo: Hippo | null;
    setHippo: (hippo: Hippo) => void;
    updateStats: (stats: Partial<HippoStats>) => void;
    feed: () => void;
    clean: () => void;
    play: () => boolean;
    sleep: () => void;
    giveWater: () => void;
    resetHippo: () => void;
    hasCompletedOnboarding: boolean;
    completeOnboarding: (name: string, gender: HippoGender, age?: 'child' | 'parent') => void;
    buyItem: (itemId: string) => boolean;
    equipItem: (itemId: string) => void;
    unequipItem: (category: ClothingCategory) => void;
    addCoins: (amount: number) => void;
    getAvailableItems: () => ClothingItem[];
    updateGameStats: (gameType: 'bubble' | 'memory' | 'third', score?: number) => void;
    completeGame?: (score: number) => { coinsBonus: number; happinessBonus: number };
}
