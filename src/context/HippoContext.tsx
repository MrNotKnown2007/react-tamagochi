import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SHOP_ITEMS } from '../constants/shop-items';
import { Hippo, HippoContextType, HippoGender, HippoOutfit, HippoStats } from '../types/hippo';
import { storage } from '../utils/storage';

const getAgeMultiplier = (age: 'child' | 'parent'): number => {
    return age === 'child' ? 1.2 : 0.8;
};

const getSleepMultiplier = (age: 'child' | 'parent'): number => {
    return age === 'child' ? 1.5 : 0.9;
};

const getFoodMultiplier = (age: 'child' | 'parent'): number => {
    return age === 'child' ? 1.4 : 0.8;
};

const HippoContext = createContext<HippoContextType | undefined>(undefined);

const initialStats: HippoStats = {
    health: 100,
    satiety: 50,
    happiness: 70,
    cleanliness: 60,
    energy: 80,
    thirst: 30,
};

const initialHippo: Hippo = {
    id: '1',
    name: 'Бегемотик',
    gender: 'male',
    age: 'child',
    stats: initialStats,
    outfit: {},
    coins: 100,
    createdAt: new Date(),
    lastFed: new Date(),
    lastCleaned: new Date(),
    lastPlayed: new Date(),
    lastWatered: new Date(),
    feedCount: 0,
    cleanCount: 0,
    playCount: 0,
    sleepCount: 0,
    waterCount: 0,
    gameStats: {
        bubbleGamePlays: 0,
        bubbleGameRecord: 0,
        memoryGamePlays: 0,
        thirdGamePlays: 0,
        totalGamePlays: 0,
        totalCoinsEarned: 0,
    },
};

export function HippoProvider({ children }: { children: React.ReactNode }) {
    const [hippo, setHippo] = useState<Hippo | null>(initialHippo);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHippoData();
    }, []);

    const loadHippoData = async () => {
        try {
            const [
                savedName,
                savedGender,
                savedAge,
                savedStats,
                savedOutfit,
                savedCoins,
                feedCount,
                cleanCount,
                playCount,
                sleepCount,
                waterCount,
                savedGameStats
            ] = await Promise.all([
                storage.getItem('hippoName'),
                storage.getItem('hippoGender'),
                storage.getItem('hippoAge'),
                storage.getItem('hippoStats'),
                storage.getItem('hippoOutfit'),
                storage.getItem('hippoCoins'),
                storage.getItem('hippoFeedCount'),
                storage.getItem('hippoCleanCount'),
                storage.getItem('hippoPlayCount'),
                storage.getItem('hippoSleepCount'),
                storage.getItem('hippoWaterCount'),
                storage.getItem('hippoGameStats')
            ]);

            if (savedName) {
                const baseHippo = {
                    ...initialHippo,
                    name: savedName,
                    gender: (savedGender as HippoGender) || 'male',
                    age: savedAge ? (savedAge as 'child' | 'parent') : 'child',
                    coins: savedCoins ? parseInt(savedCoins) : initialHippo.coins,
                    outfit: savedOutfit ? JSON.parse(savedOutfit) : {},
                    feedCount: feedCount ? parseInt(feedCount) : 0,
                    cleanCount: cleanCount ? parseInt(cleanCount) : 0,
                    playCount: playCount ? parseInt(playCount) : 0,
                    sleepCount: sleepCount ? parseInt(sleepCount) : 0,
                    waterCount: waterCount ? parseInt(waterCount) : 0,
                    gameStats: savedGameStats ? JSON.parse(savedGameStats) : initialHippo.gameStats,
                };

                if (savedStats) {
                    try {
                        const parsedStats = JSON.parse(savedStats);
                        setHippo({
                            ...baseHippo,
                            stats: { ...initialStats, ...parsedStats },
                        });
                    } catch (e) {
                        console.error('Failed to parse saved stats:', e);
                        setHippo(baseHippo);
                    }
                } else {
                    setHippo({
                        ...baseHippo,
                        stats: initialStats,
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load hippo data:', error);
            setHippo(initialHippo);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStats = useCallback((newStats: Partial<HippoStats>) => {
        setHippo(prev => {
            if (!prev) return prev;
            const updatedStats = {
                health: Math.max(0, Math.min(100, (newStats.health ?? prev.stats.health))),
                satiety: Math.max(0, Math.min(100, (newStats.satiety ?? prev.stats.satiety))),
                happiness: Math.max(0, Math.min(100, (newStats.happiness ?? prev.stats.happiness))),
                cleanliness: Math.max(0, Math.min(100, (newStats.cleanliness ?? prev.stats.cleanliness))),
                energy: Math.max(0, Math.min(100, (newStats.energy ?? prev.stats.energy))),
                thirst: Math.max(0, Math.min(100, (newStats.thirst ?? prev.stats.thirst))),
            };
            const updatedHippo = {
                ...prev,
                stats: updatedStats,
                lastFed: newStats.satiety !== undefined ? new Date() : prev.lastFed,
                lastCleaned: newStats.cleanliness !== undefined ? new Date() : prev.lastCleaned,
                lastPlayed: newStats.happiness !== undefined ? new Date() : prev.lastPlayed,
                lastWatered: newStats.thirst !== undefined ? new Date() : prev.lastWatered,
            };
            storage.setItem('hippoStats', JSON.stringify(updatedStats));
            return updatedHippo;
        });
    }, []);

    const feed = useCallback(() => {
        if (!hippo) return;
        const ageMultiplier = getFoodMultiplier(hippo.age);
        setHippo(prev => {
            if (!prev) return prev;
            const updated = { ...prev, feedCount: prev.feedCount + 1 };
            storage.setItem('hippoFeedCount', updated.feedCount.toString());
            return updated;
        });
        updateStats({
            satiety: Math.min(100, (hippo.stats.satiety || 0) + Math.round(30 * ageMultiplier)),
            energy: Math.min(100, (hippo.stats.energy || 0) + Math.round(5 * ageMultiplier)),
            thirst: Math.max(0, (hippo.stats.thirst || 0) - Math.round(5 * ageMultiplier)),
        });
    }, [hippo, updateStats]);

    const clean = useCallback(() => {
        if (!hippo) return;
        const ageMultiplier = getAgeMultiplier(hippo.age);
        setHippo(prev => {
            if (!prev) return prev;
            const updated = { ...prev, cleanCount: prev.cleanCount + 1 };
            storage.setItem('hippoCleanCount', updated.cleanCount.toString());
            return updated;
        });
        updateStats({
            cleanliness: Math.min(100, (hippo.stats.cleanliness || 0) + Math.round(40 * ageMultiplier)),
            energy: Math.max(0, (hippo.stats.energy || 0) - Math.round(10 * (hippo.age === 'child' ? 0.8 : 1.2))),
            health: Math.min(100, (hippo.stats.health || 0) + (hippo.age === 'child' ? 4 : 2)),
        });
    }, [hippo, updateStats]);

    const addCoins = useCallback((amount: number) => {
        setHippo(prev => {
            if (!prev) return prev;
            const updated = { ...prev, coins: prev.coins + amount };
            storage.setItem('hippoCoins', updated.coins.toString());
            return updated;
        });
    }, []);

    const play = useCallback((): boolean => {
        if (!hippo) return false;
        const minEnergy = 20;
        if (hippo.stats.energy < minEnergy) {
            return false;
        }
        const ageMultiplier = hippo.age === 'child' ? 1.2 : 0.9;
        setHippo(prev => {
            if (!prev) return prev;
            const updated = { ...prev, playCount: prev.playCount + 1 };
            storage.setItem('hippoPlayCount', updated.playCount.toString());
            return updated;
        });
        updateStats({
            happiness: Math.min(100, (hippo.stats.happiness || 0) + Math.round(10 * ageMultiplier)),
            energy: Math.max(0, (hippo.stats.energy || 0) - Math.round(20 * (hippo.age === 'child' ? 1.3 : 0.8))),
            satiety: Math.max(0, (hippo.stats.satiety || 0) - Math.round(5 * (hippo.age === 'child' ? 1.2 : 0.9))),
            thirst: Math.max(0, (hippo.stats.thirst || 0) - Math.round(5 * (hippo.age === 'child' ? 1.5 : 0.8))),
        });
        return true;
    }, [hippo, updateStats]);

    const updateGameStats = useCallback((gameType: 'bubble' | 'memory' | 'third', score: number = 0) => {
        setHippo(prev => {
            if (!prev) return prev;
            const updatedGameStats = { ...prev.gameStats };
            if (gameType === 'bubble') {
                updatedGameStats.bubbleGamePlays += 1;
                updatedGameStats.bubbleGameRecord = Math.max(updatedGameStats.bubbleGameRecord, score);
            } else if (gameType === 'memory') {
                updatedGameStats.memoryGamePlays += 1;
            } else if (gameType === 'third') {
                updatedGameStats.thirdGamePlays += 1;
            }
            updatedGameStats.totalGamePlays += 1;
            updatedGameStats.totalCoinsEarned += Math.floor(score / 10);
            const updated = { ...prev, gameStats: updatedGameStats };
            storage.setItem('hippoGameStats', JSON.stringify(updatedGameStats));
            return updated;
        });
    }, []);

    const sleep = useCallback(() => {
        if (!hippo) return;
        const sleepMultiplier = getSleepMultiplier(hippo.age);
        setHippo(prev => {
            if (!prev) return prev;
            const updated = { ...prev, sleepCount: prev.sleepCount + 1 };
            storage.setItem('hippoSleepCount', updated.sleepCount.toString());
            return updated;
        });
        updateStats({
            energy: Math.min(100, (hippo.stats.energy || 0) + Math.round(50 * sleepMultiplier)),
            health: Math.min(100, (hippo.stats.health || 0) + Math.round(5 * sleepMultiplier)),
            satiety: Math.max(0, (hippo.stats.satiety || 0) - Math.round(5 * (hippo.age === 'child' ? 0.7 : 1.3))),
            thirst: Math.max(0, (hippo.stats.thirst || 0) - Math.round(10 * (hippo.age === 'child' ? 0.7 : 1.3))),
        });
    }, [hippo, updateStats]);

    const giveWater = useCallback(() => {
        if (!hippo) return;
        const ageMultiplier = getAgeMultiplier(hippo.age);
        setHippo(prev => {
            if (!prev) return prev;
            const updated = { ...prev, waterCount: prev.waterCount + 1 };
            storage.setItem('hippoWaterCount', updated.waterCount.toString());
            return updated;
        });
        updateStats({
            thirst: Math.min(100, (hippo.stats.thirst || 0) + Math.round(30 * ageMultiplier)),
            health: Math.min(100, (hippo.stats.health || 0) + Math.round(10 * ageMultiplier)),
        });
    }, [hippo, updateStats]);

    const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadUnlockedItems = async () => {
            const saved = await storage.getItem('unlockedItems');
            if (saved) {
                try {
                    setUnlockedItems(new Set(JSON.parse(saved)));
                } catch (e) {
                    console.error('Failed to parse unlocked items:', e);
                }
            }
        };
        if (!isLoading) {
            loadUnlockedItems();
        }
    }, [isLoading]);

    const buyItem = useCallback((itemId: string): boolean => {
        const item = SHOP_ITEMS.find((i: any) => i.id === itemId);
        if (!item || !hippo) return false;
        if (hippo.coins >= item.price) {
            setHippo(prev => {
                if (!prev) return prev;
                const updatedCoins = prev.coins - item.price;
                const updatedOutfit = { ...prev.outfit };
                if (item.category === 'costume') {
                    updatedOutfit.head = undefined;
                    updatedOutfit.upper = undefined;
                    updatedOutfit.lower = undefined;
                    updatedOutfit.feet = undefined;
                    updatedOutfit.costume = itemId;
                } else if (['head', 'upper', 'lower', 'feet'].includes(item.category)) {
                    if (updatedOutfit.costume) {
                        updatedOutfit.costume = undefined;
                    }
                    updatedOutfit[item.category as keyof HippoOutfit] = itemId;
                }
                const updated = { ...prev, coins: updatedCoins, outfit: updatedOutfit };
                storage.setItem('hippoCoins', updatedCoins.toString());
                storage.setItem('hippoOutfit', JSON.stringify(updatedOutfit));
                return updated;
            });
            const newUnlockedItems = new Set([...unlockedItems, itemId]);
            setUnlockedItems(newUnlockedItems);
            storage.setItem('unlockedItems', JSON.stringify(Array.from(newUnlockedItems)));
            return true;
        }
        return false;
    }, [hippo, unlockedItems]);

    const equipItem = useCallback((itemId: string) => {
        const item = SHOP_ITEMS.find((i: any) => i.id === itemId);
        if (!item || !hippo || !unlockedItems.has(itemId)) return;
        setHippo(prev => {
            if (!prev) return prev;
            const updatedOutfit = { ...prev.outfit };
            if (item.category === 'costume') {
                updatedOutfit.head = undefined;
                updatedOutfit.upper = undefined;
                updatedOutfit.lower = undefined;
                updatedOutfit.feet = undefined;
                updatedOutfit.costume = itemId;
            } else if (['head', 'upper', 'lower', 'feet'].includes(item.category)) {
                if (updatedOutfit.costume) {
                    updatedOutfit.costume = undefined;
                }
                updatedOutfit[item.category as keyof HippoOutfit] = itemId;
            }
            const updated = { ...prev, outfit: updatedOutfit };
            storage.setItem('hippoOutfit', JSON.stringify(updatedOutfit));
            return updated;
        });
    }, [hippo, unlockedItems]);

    const unequipItem = useCallback((category: keyof HippoOutfit) => {
        if (!hippo) return;
        setHippo(prev => {
            if (!prev) return prev;
            const updatedOutfit = { ...prev.outfit };
            delete updatedOutfit[category];
            const updated = { ...prev, outfit: updatedOutfit };
            storage.setItem('hippoOutfit', JSON.stringify(updatedOutfit));
            return updated;
        });
    }, [hippo]);

    const getAvailableItems = useCallback(() => {
        return SHOP_ITEMS.map((item: any) => ({
            ...item,
            unlocked: unlockedItems.has(item.id)
        }));
    }, [unlockedItems]);

    useEffect(() => {
        if (isLoading) return;
        const interval = setInterval(() => {
            setHippo(prev => {
                if (!prev) return prev;
                const updatedStats = {
                    health: Math.max(0, prev.stats.health - 0.1),
                    satiety: Math.max(0, prev.stats.satiety - 0.2),
                    happiness: Math.max(0, prev.stats.happiness - 0.1),
                    cleanliness: Math.max(0, prev.stats.cleanliness - 0.15),
                    energy: Math.min(100, prev.stats.energy + 0.1),
                    thirst: Math.max(0, prev.stats.thirst - 0.25),
                };
                if (updatedStats.thirst < 20) {
                    updatedStats.health = Math.max(0, updatedStats.health - 0.3);
                    updatedStats.happiness = Math.max(0, updatedStats.happiness - 0.2);
                }
                storage.setItem('hippoStats', JSON.stringify(updatedStats));
                return { ...prev, stats: updatedStats };
            });
        }, 30000);
        return () => clearInterval(interval);
    }, [isLoading]);

    const completeOnboarding = useCallback((name: string, gender: HippoGender, age?: 'child' | 'parent') => {
        setHippo(prev => {
            const updatedHippo = prev ? {
                ...prev,
                name,
                gender,
                age: age || prev.age
            } : {
                ...initialHippo,
                name,
                gender,
                age: age || 'child'
            };
            Promise.all([
                storage.setItem('hippoName', name),
                storage.setItem('hippoGender', gender),
                storage.setItem('hippoAge', updatedHippo.age),
                storage.setItem('hasCreatedHippo', 'true'),
                storage.setItem('hippoStats', JSON.stringify(updatedHippo.stats)),
                storage.setItem('hippoCoins', updatedHippo.coins.toString()),
                storage.setItem('hippoGameStats', JSON.stringify(updatedHippo.gameStats)),
            ]);
            return updatedHippo;
        });
    }, []);

    const hasCompletedOnboarding = (() => {
        if (hippo?.name && hippo.name !== 'Бегемотик') {
            return true;
        }
        return false;
    })();

    const setHippoAsync = useCallback((newHippo: Hippo) => {
        setHippo(newHippo);
        Promise.all([
            storage.setItem('hippoName', newHippo.name),
            storage.setItem('hippoGender', newHippo.gender),
            storage.setItem('hippoStats', JSON.stringify(newHippo.stats)),
            storage.setItem('hippoOutfit', JSON.stringify(newHippo.outfit || {})),
            storage.setItem('hippoCoins', newHippo.coins.toString()),
            storage.setItem('hippoFeedCount', newHippo.feedCount.toString()),
            storage.setItem('hippoCleanCount', newHippo.cleanCount.toString()),
            storage.setItem('hippoPlayCount', newHippo.playCount.toString()),
            storage.setItem('hippoSleepCount', newHippo.sleepCount.toString()),
            storage.setItem('hippoWaterCount', newHippo.waterCount.toString()),
            storage.setItem('hippoGameStats', JSON.stringify(newHippo.gameStats)),
        ]);
    }, []);

    const resetHippo = useCallback(async () => {
        try {
            await Promise.all([
                storage.removeItem('hippoStats'),
                storage.removeItem('hippoName'),
                storage.removeItem('hippoGender'),
                storage.removeItem('hippoAge'),
                storage.removeItem('hasCreatedHippo'),
                storage.removeItem('hippoOutfit'),
                storage.removeItem('hippoCoins'),
                storage.removeItem('unlockedItems'),
                storage.removeItem('hippoFeedCount'),
                storage.removeItem('hippoCleanCount'),
                storage.removeItem('hippoPlayCount'),
                storage.removeItem('hippoSleepCount'),
                storage.removeItem('hippoWaterCount'),
                storage.removeItem('hippoGameStats'),
            ]);
            setHippo({ ...initialHippo });
        } catch (error) {
            console.error('Failed to reset hippo:', error);
            throw error;
        }
    }, []);

    const value: HippoContextType = {
        hippo,
        setHippo: setHippoAsync,
        updateStats,
        feed,
        clean,
        play,
        sleep,
        giveWater,
        resetHippo,
        hasCompletedOnboarding,
        completeOnboarding,
        buyItem,
        equipItem,
        unequipItem,
        addCoins,
        getAvailableItems,
        updateGameStats,
    };

    if (isLoading) {
        return null;
    }

    return (
        <HippoContext.Provider value={value}>
            {children}
        </HippoContext.Provider>
    );
}

export function useHippo() {
    const context = useContext(HippoContext);
    if (context === undefined) {
        throw new Error('useHippo must be used within a HippoProvider');
    }
    return context;
}
