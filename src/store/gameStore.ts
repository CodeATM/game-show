import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    CHANCE_EVENTS,
    BRAINIAC_EVENTS,
    VOLTAGE_EVENTS,
    GIFT_EVENTS,
    type ChanceEvent
} from '@/data/gameData'

interface Player {
    id: number
    name: string
    avatarSeed: string
    position: number // 0 (Start) to 100 (Final Tile)
    coins: number
    totalRolls: number
    luckScore: number // 0-100 based on event outcomes
    inventory: string[]
    isActive: boolean
    color: string
}

interface TileConfig {
    id: number
    type: 'normal' | 'chance' | 'quiz' | 'snake' | 'ladder'
    label?: string
}

interface GameState {
    lastRoll: number | null
    rollCount: number
    isRolling: boolean
    players: Player[]
    boardConfig: TileConfig[]
    isProcessingDice: boolean
    hostOverride: boolean

    // Chance State
    chanceStatus: 'idle' | 'spinning' | 'revealed'
    currentChanceEvent: ChanceEvent | null

    // Brainiac State
    brainiacStatus: 'idle' | 'thinking' | 'revealed'
    currentBrainiacEvent: ChanceEvent | null

    // Voltage State
    voltageStatus: 'idle' | 'charging' | 'revealed'
    currentVoltageEvent: ChanceEvent | null

    // Gift State
    giftStatus: 'idle' | 'shaking' | 'revealed'
    currentGiftEvent: ChanceEvent | null

    // Registration State
    activePlayerName: string | null
    gameSessionId: string | null

    // Actions
    setLastRoll: (value: number) => void
    incrementRollCount: () => void
    setIsRolling: (rolling: boolean) => void
    updatePlayerPosition: (playerId: number, newPosition: number) => void
    updatePlayerName: (playerId: number, name: string) => void
    movePlayerWithDice: (playerId: number, roll: number) => void
    setTileConfig: (tileId: number, config: Partial<TileConfig>) => void
    setActivePlayerName: (name: string) => void
    setGameSessionId: (id: string) => void
    toggleHostOverride: () => void
    setEventLocations: (type: 'chance' | 'quiz' | 'snake' | 'ladder', tileNumbers: number[]) => void
    resetGame: () => void

    // Chance Actions
    triggerChance: () => void
    resetChance: () => void

    // Brainiac Actions
    triggerBrainiac: () => void
    resetBrainiac: () => void

    // Voltage Actions
    triggerVoltage: () => void
    resetVoltage: () => void

    // Gift Actions
    triggerGift: () => void
    resetGift: () => void
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            lastRoll: null,
            rollCount: 0,
            isRolling: false,
            players: [
                { id: 1, name: "Alpha", avatarSeed: "alpha-gamer", position: 0, coins: 500, totalRolls: 0, luckScore: 85, inventory: ["Shield", "Compass"], isActive: true, color: "indigo" },
                { id: 2, name: "Bravo", avatarSeed: "bravo-knight", position: 0, coins: 250, totalRolls: 0, luckScore: 42, inventory: ["Sword"], isActive: false, color: "rose" },
                { id: 3, name: "Charlie", avatarSeed: "charlie-wizard", position: 0, coins: 1200, totalRolls: 0, luckScore: 91, inventory: ["Crown", "Gem"], isActive: false, color: "emerald" },
                { id: 4, name: "Delta", avatarSeed: "delta-rogue", position: 0, coins: 50, totalRolls: 0, luckScore: 15, inventory: [], isActive: false, color: "amber" },
            ],
            boardConfig: Array.from({ length: 100 }, (_, i) => {
                const id = i + 1;
                // Initial specialized tiles (matching old Tiles.tsx exampleConfigs)
                if ([5, 23, 43, 64, 86, 98].includes(id)) return { id: i, type: 'chance', label: 'Chance' };
                if ([8, 29, 38, 55, 73, 92].includes(id)) return { id: i, type: 'ladder', label: 'Boost' };
                if ([13, 34, 51, 68, 89].includes(id)) return { id: i, type: 'quiz', label: 'Quiz' };
                if ([16, 26, 46, 59, 76, 83, 95].includes(id)) return { id: i, type: 'snake', label: 'Danger' };
                return { id: i, type: 'normal' };
            }),
            isProcessingDice: false,
            hostOverride: false,

            chanceStatus: 'idle',
            currentChanceEvent: null,

            brainiacStatus: 'idle',
            currentBrainiacEvent: null,

            voltageStatus: 'idle',
            currentVoltageEvent: null,

            giftStatus: 'idle',
            currentGiftEvent: null,

            activePlayerName: null,
            gameSessionId: null,

            setLastRoll: (value) => set({ lastRoll: value }),
            incrementRollCount: () => set((state) => ({ rollCount: state.rollCount + 1 })),
            setIsRolling: (rolling) => set({ isRolling: rolling }),

            updatePlayerPosition: (playerId, newPosition) => set((state) => ({
                players: state.players.map(p =>
                    p.id === playerId ? { ...p, position: Math.min(100, Math.max(0, newPosition)) } : p
                )
            })),
            updatePlayerName: (playerId, name) => set((state) => ({
                players: state.players.map(p =>
                    p.id === playerId ? { ...p, name } : p
                )
            })),

            movePlayerWithDice: (playerId, roll) => {
                if (get().isProcessingDice) return;
                set({ isProcessingDice: true });

                set((state) => {
                    const currentPlayer = state.players.find(p => p.id === playerId);
                    if (!currentPlayer) {
                        set({ isProcessingDice: false });
                        return state;
                    }

                    const newPosition = Math.min(100, Math.max(0, currentPlayer.position + roll));

                    let nextPlayers = state.players.map(p => {
                        if (p.id === playerId) {
                            return {
                                ...p,
                                position: newPosition,
                                totalRolls: p.totalRolls + 1,
                                isActive: roll === 6
                            };
                        }
                        // Default all others to inactive to ensure only one active player
                        return { ...p, isActive: false };
                    });

                    if (roll < 6) {
                        const nextPlayerId = (playerId % state.players.length) + 1;
                        nextPlayers = nextPlayers.map(p => ({
                            ...p,
                            isActive: p.id === nextPlayerId
                        }));
                    }

                    return {
                        players: nextPlayers,
                        lastRoll: roll,
                        rollCount: state.rollCount + 1
                    };
                });

                // Small cooldown to prevent rapid multi-clicks
                setTimeout(() => {
                    const latestState = get();
                    set({ isProcessingDice: false });

                    // Auto-trigger events based on current active player's position
                    // We check the player who just moved (playerId)
                    const player = latestState.players.find(p => p.id === playerId);
                    if (player && player.position > 0) {
                        const tile = latestState.boardConfig[player.position - 1];
                        if (tile) {
                            if (tile.type === 'chance') latestState.triggerChance();
                            if (tile.type === 'quiz') latestState.triggerBrainiac();
                            if (tile.type === 'ladder') latestState.triggerVoltage();
                            if (tile.type === 'snake') latestState.triggerGift();
                        }
                    }
                }, 500);
            },

            setTileConfig: (tileId, config) => set((state) => ({
                boardConfig: state.boardConfig.map(t =>
                    t.id === tileId ? { ...t, ...config } : t
                )
            })),

            setActivePlayerName: (name) => set({ activePlayerName: name }),
            setGameSessionId: (id) => set({ gameSessionId: id }),

            resetGame: () => set({
                lastRoll: null,
                rollCount: 0,
                isRolling: false,
                players: [
                    { id: 1, name: "Alpha", avatarSeed: "alpha-gamer", position: 0, coins: 500, totalRolls: 0, luckScore: 85, inventory: ["Shield", "Compass"], isActive: true, color: "indigo" },
                    { id: 2, name: "Bravo", avatarSeed: "bravo-knight", position: 0, coins: 250, totalRolls: 0, luckScore: 42, inventory: ["Sword"], isActive: false, color: "rose" },
                    { id: 3, name: "Charlie", avatarSeed: "charlie-wizard", position: 0, coins: 1200, totalRolls: 0, luckScore: 91, inventory: ["Crown", "Gem"], isActive: false, color: "emerald" },
                    { id: 4, name: "Delta", avatarSeed: "delta-rogue", position: 0, coins: 50, totalRolls: 0, luckScore: 15, inventory: [], isActive: false, color: "amber" },
                ],
                boardConfig: Array.from({ length: 100 }, (_, i) => {
                    const id = i + 1;
                    if ([5, 23, 43, 64, 86, 98].includes(id)) return { id: i, type: 'chance', label: 'Chance' };
                    if ([8, 29, 38, 55, 73, 92].includes(id)) return { id: i, type: 'ladder', label: 'Boost' };
                    if ([13, 34, 51, 68, 89].includes(id)) return { id: i, type: 'quiz', label: 'Quiz' };
                    if ([16, 26, 46, 59, 76, 83, 95].includes(id)) return { id: i, type: 'snake', label: 'Danger' };
                    return { id: i, type: 'normal' };
                }),
                chanceStatus: 'idle',
                currentChanceEvent: null,
                brainiacStatus: 'idle',
                currentBrainiacEvent: null,
                voltageStatus: 'idle',
                currentVoltageEvent: null,
                giftStatus: 'idle',
                currentGiftEvent: null,
                activePlayerName: null,
                gameSessionId: null,
                isProcessingDice: false,
                hostOverride: false,
            }),

            toggleHostOverride: () => set((state) => ({ hostOverride: !state.hostOverride })),

            setEventLocations: (type, tileNumbers) => set((state) => ({
                boardConfig: state.boardConfig.map(tile => {
                    if (tileNumbers.includes(tile.id + 1)) {
                        return { ...tile, type, label: type.charAt(0).toUpperCase() + type.slice(1) };
                    }
                    if (tile.type === type) {
                        return { ...tile, type: 'normal', label: undefined };
                    }
                    return tile;
                })
            })),

            triggerChance: () => {
                const { chanceStatus } = get();
                if (chanceStatus === 'idle') {
                    const randomIndex = Math.floor(Math.random() * CHANCE_EVENTS.length)
                    const selectedEvent = CHANCE_EVENTS[randomIndex]
                    set({
                        currentChanceEvent: selectedEvent,
                        chanceStatus: 'spinning'
                    })
                } else if (chanceStatus === 'spinning') {
                    set({ chanceStatus: 'revealed' })
                }
            },

            resetChance: () => {
                const { chanceStatus } = get();
                if (chanceStatus === 'revealed') {
                    set({ chanceStatus: 'idle' });
                } else {
                    set({ currentChanceEvent: null });
                }
            },

            triggerBrainiac: () => {
                const { brainiacStatus } = get();
                if (brainiacStatus === 'idle') {
                    const randomIndex = Math.floor(Math.random() * BRAINIAC_EVENTS.length)
                    const selectedEvent = BRAINIAC_EVENTS[randomIndex]
                    set({
                        currentBrainiacEvent: selectedEvent,
                        brainiacStatus: 'thinking'
                    })
                } else if (brainiacStatus === 'thinking') {
                    set({ brainiacStatus: 'revealed' })
                }
            },

            resetBrainiac: () => {
                const { brainiacStatus } = get();
                if (brainiacStatus === 'revealed') {
                    set({ brainiacStatus: 'idle' });
                } else {
                    set({ currentBrainiacEvent: null });
                }
            },

            triggerVoltage: () => {
                const { voltageStatus } = get();
                if (voltageStatus === 'idle') {
                    const randomIndex = Math.floor(Math.random() * VOLTAGE_EVENTS.length)
                    const selectedEvent = VOLTAGE_EVENTS[randomIndex]
                    set({
                        currentVoltageEvent: selectedEvent,
                        voltageStatus: 'charging'
                    })
                } else if (voltageStatus === 'charging') {
                    set({ voltageStatus: 'revealed' })
                }
            },

            resetVoltage: () => {
                const { voltageStatus } = get();
                if (voltageStatus === 'revealed') {
                    set({ voltageStatus: 'idle' });
                } else {
                    set({ currentVoltageEvent: null });
                }
            },

            triggerGift: () => {
                const { giftStatus } = get();
                if (giftStatus === 'idle') {
                    const randomIndex = Math.floor(Math.random() * GIFT_EVENTS.length)
                    const selectedEvent = GIFT_EVENTS[randomIndex]
                    set({
                        currentGiftEvent: selectedEvent,
                        giftStatus: 'shaking'
                    })
                } else if (giftStatus === 'shaking') {
                    set({ giftStatus: 'revealed' })
                }
            },

            resetGift: () => {
                const { giftStatus } = get();
                if (giftStatus === 'revealed') {
                    set({ giftStatus: 'idle' });
                } else {
                    set({ currentGiftEvent: null });
                }
            },
        }),
        {
            name: 'game-storage',
        }
    ))
