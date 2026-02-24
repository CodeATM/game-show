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
    setTileConfig: (tileId: number, config: Partial<TileConfig>) => void
    setActivePlayerName: (name: string) => void
    setGameSessionId: (id: string) => void
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
                { id: 1, name: "Alpha", avatarSeed: "alpha-gamer", position: 0, coins: 500, totalRolls: 12, luckScore: 85, inventory: ["Shield", "Compass"], isActive: true, color: "indigo" },
                { id: 2, name: "Bravo", avatarSeed: "bravo-knight", position: 0, coins: 250, totalRolls: 8, luckScore: 42, inventory: ["Sword"], isActive: false, color: "rose" },
                { id: 3, name: "Charlie", avatarSeed: "charlie-wizard", position: 0, coins: 1200, totalRolls: 25, luckScore: 91, inventory: ["Crown", "Gem"], isActive: false, color: "emerald" },
                { id: 4, name: "Delta", avatarSeed: "delta-rogue", position: 0, coins: 50, totalRolls: 4, luckScore: 15, inventory: [], isActive: false, color: "amber" },
            ],
            boardConfig: Array.from({ length: 100 }, (_, i) => ({
                id: i,
                type: 'normal'
            })),

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
                    { id: 1, name: "Alpha", avatarSeed: "alpha-gamer", position: 0, coins: 500, totalRolls: 12, luckScore: 85, inventory: ["Shield", "Compass"], isActive: true, color: "indigo" },
                    { id: 2, name: "Bravo", avatarSeed: "bravo-knight", position: 0, coins: 250, totalRolls: 8, luckScore: 42, inventory: ["Sword"], isActive: false, color: "rose" },
                    { id: 3, name: "Charlie", avatarSeed: "charlie-wizard", position: 0, coins: 1200, totalRolls: 25, luckScore: 91, inventory: ["Crown", "Gem"], isActive: false, color: "emerald" },
                    { id: 4, name: "Delta", avatarSeed: "delta-rogue", position: 0, coins: 50, totalRolls: 4, luckScore: 15, inventory: [], isActive: false, color: "amber" },
                ],
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
            }),

            triggerChance: () => {
                // Guard: prevent multiple triggers if already spinning or revealed
                if (get().chanceStatus !== 'idle') return

                const randomIndex = Math.floor(Math.random() * CHANCE_EVENTS.length)
                const selectedEvent = CHANCE_EVENTS[randomIndex]
                set({
                    currentChanceEvent: selectedEvent,
                    chanceStatus: 'spinning'
                })

                setTimeout(() => {
                    set({ chanceStatus: 'revealed' })
                }, 2000)
            },

            resetChance: () => set({
                chanceStatus: 'idle',
                currentChanceEvent: null
            }),

            triggerBrainiac: () => {
                if (get().brainiacStatus !== 'idle') return

                const randomIndex = Math.floor(Math.random() * BRAINIAC_EVENTS.length)
                const selectedEvent = BRAINIAC_EVENTS[randomIndex]

                set({
                    currentBrainiacEvent: selectedEvent,
                    brainiacStatus: 'thinking'
                })

                setTimeout(() => {
                    set({ brainiacStatus: 'revealed' })
                }, 2000)
            },

            resetBrainiac: () => set({
                brainiacStatus: 'idle',
                currentBrainiacEvent: null
            }),

            triggerVoltage: () => {
                if (get().voltageStatus !== 'idle') return

                const randomIndex = Math.floor(Math.random() * VOLTAGE_EVENTS.length)
                const selectedEvent = VOLTAGE_EVENTS[randomIndex]

                set({
                    currentVoltageEvent: selectedEvent,
                    voltageStatus: 'charging'
                })

                setTimeout(() => {
                    set({ voltageStatus: 'revealed' })
                }, 3000) // Longer charge for "Voltage"
            },

            resetVoltage: () => set({
                voltageStatus: 'idle',
                currentVoltageEvent: null
            }),

            triggerGift: () => {
                if (get().giftStatus !== 'idle') return

                const randomIndex = Math.floor(Math.random() * GIFT_EVENTS.length)
                const selectedEvent = GIFT_EVENTS[randomIndex]

                set({
                    currentGiftEvent: selectedEvent,
                    giftStatus: 'shaking'
                })

                setTimeout(() => {
                    set({ giftStatus: 'revealed' })
                }, 2000)
            },

            resetGift: () => set({
                giftStatus: 'idle',
                currentGiftEvent: null
            }),
        }),
        {
            name: 'game-storage',
        }
    ))
