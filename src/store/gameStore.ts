import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    CHANCE_EVENTS,
    BRAINIAC_EVENTS,
    VANTAGE_EVENTS,
    GIFT_EVENTS,
    type ChanceEvent
} from '@/data/gameData'
import { AlertCircle, BrainCircuit, Mountain, Gift } from 'lucide-react'

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

export interface TileConfig {
    id: number
    type: 'normal' | 'chance' | 'quiz' | 'snake' | 'ladder'
    label?: string
    revealText?: string
    bgColor?: string
}

export interface InputMapping {
    type: 'keyboard' | 'midi'
    value: string | number
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

    // Vantage State
    vantageStatus: 'idle' | 'scanning' | 'revealed'
    currentVantageEvent: ChanceEvent | null

    // Gift State
    giftStatus: 'idle' | 'shaking' | 'revealed'
    currentGiftEvent: ChanceEvent | null

    // Registration State
    activePlayerName: string | null
    gameSessionId: string | null

    // Event Labels
    eventLabels: {
        chance: string
        quiz: string
        ladder: string
        snake: string
    }

    boardTheme: 'light' | 'dark' | 'z1' | 'z2'

    mappings: Record<string, InputMapping | null>
    midiStatus: 'unsupported' | 'disconnected' | 'connected'
    midiDeviceName: string | null
    lastMidiSignalTime: number
    audioFeedbackEnabled: boolean

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
    triggerChance: (tileId?: number) => void
    resetChance: () => void

    // Brainiac Actions
    triggerBrainiac: (tileId?: number) => void
    resetBrainiac: () => void

    // Vantage Actions
    triggerVantage: (tileId?: number) => void
    resetVantage: () => void

    // Gift Actions
    triggerGift: (tileId?: number) => void
    resetGift: () => void

    // Label Actions
    setEventLabel: (type: 'chance' | 'quiz' | 'ladder' | 'snake', label: string) => void

    // Theme Actions
    setBoardTheme: (theme: 'light' | 'dark' | 'z1' | 'z2') => void

    // Mappings
    updateMapping: (actionId: string, mapping: InputMapping | null) => void

    // MIDI Status
    setMidiStatus: (status: 'unsupported' | 'disconnected' | 'connected', deviceName?: string | null) => void
    triggerMidiSignal: () => void
    toggleAudioFeedback: () => void
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            lastRoll: null,
            rollCount: 0,
            isRolling: false,
            players: [
                { id: 1, name: "Alpha", avatarSeed: "alpha", position: 0, coins: 500, totalRolls: 0, luckScore: 85, inventory: ["Shield", "Compass"], isActive: true, color: "indigo" },
                { id: 2, name: "Bravo", avatarSeed: "bravo", position: 0, coins: 250, totalRolls: 0, luckScore: 42, inventory: ["Sword"], isActive: false, color: "rose" },
                { id: 3, name: "Charlie", avatarSeed: "charlie", position: 0, coins: 1200, totalRolls: 0, luckScore: 91, inventory: ["Crown", "Gem"], isActive: false, color: "emerald" },
                { id: 4, name: "Delta", avatarSeed: "delta", position: 0, coins: 50, totalRolls: 0, luckScore: 15, inventory: [], isActive: false, color: "amber" },
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

            vantageStatus: 'idle',
            currentVantageEvent: null,

            giftStatus: 'idle',
            currentGiftEvent: null,

            activePlayerName: null,
            gameSessionId: null,

            eventLabels: {
                chance: 'Chance',
                quiz: 'Quiz',
                ladder: 'Boost',
                snake: 'Danger',
            },

            boardTheme: 'dark',

            mappings: {},
            midiStatus: 'disconnected',
            midiDeviceName: null,
            lastMidiSignalTime: 0,
            audioFeedbackEnabled: true,

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
                set({ isProcessingDice: true, isRolling: false, lastRoll: roll });

                const state = get();
                const currentPlayer = state.players.find(p => p.id === playerId);
                if (!currentPlayer) {
                    set({ isProcessingDice: false });
                    return;
                }

                const targetPosition = Math.min(100, Math.max(0, currentPlayer.position + roll));
                const steps = roll;
                let currentStep = 0;

                const performStep = () => {
                    if (currentStep >= steps) {
                        // Animation finished
                        set((state) => {
                            let nextPlayers = state.players.map(p => {
                                if (p.id === playerId) {
                                    return {
                                        ...p,
                                        totalRolls: p.totalRolls + 1,
                                        isActive: roll === 6
                                    };
                                }
                                return { ...p, isActive: false };
                            });

                            if (roll < 6) {
                                const nextPlayerId = (playerId % state.players.length) + 1;
                                nextPlayers = nextPlayers.map(p => ({
                                    ...p,
                                    isActive: p.id === nextPlayerId
                                }));
                            }
                            return { players: nextPlayers, rollCount: state.rollCount + 1 };
                        });

                        // Trigger events after short delay
                        setTimeout(() => {
                            set({ isProcessingDice: false });
                            const latestState = get();
                            const player = latestState.players.find(p => p.id === playerId);
                            if (player && player.position > 0) {
                                const tile = latestState.boardConfig[player.position - 1];
                                if (tile) {
                                    if (tile.type === 'chance') latestState.triggerChance(player.position - 1);
                                    if (tile.type === 'quiz') latestState.triggerBrainiac(player.position - 1);
                                    if (tile.type === 'ladder') latestState.triggerVantage(player.position - 1);
                                    if (tile.type === 'snake') latestState.triggerGift(player.position - 1);
                                }
                            }
                        }, 400);
                        return;
                    }

                    // Move one step
                    currentStep++;
                    set((state) => ({
                        players: state.players.map(p =>
                            p.id === playerId ? { ...p, position: Math.min(100, p.position + 1) } : p
                        )
                    }));

                    // Schedule next step
                    setTimeout(performStep, 350);
                };

                // Start the sequence
                performStep();
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
                    { id: 1, name: "Alpha", avatarSeed: "alpha", position: 0, coins: 500, totalRolls: 0, luckScore: 85, inventory: ["Shield", "Compass"], isActive: true, color: "indigo" },
                    { id: 2, name: "Bravo", avatarSeed: "bravo", position: 0, coins: 250, totalRolls: 0, luckScore: 42, inventory: ["Sword"], isActive: false, color: "rose" },
                    { id: 3, name: "Charlie", avatarSeed: "charlie", position: 0, coins: 1200, totalRolls: 0, luckScore: 91, inventory: ["Crown", "Gem"], isActive: false, color: "emerald" },
                    { id: 4, name: "Delta", avatarSeed: "delta", position: 0, coins: 50, totalRolls: 0, luckScore: 15, inventory: [], isActive: false, color: "amber" },
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
                vantageStatus: 'idle',
                currentVantageEvent: null,
                giftStatus: 'idle',
                currentGiftEvent: null,
                activePlayerName: null,
                gameSessionId: null,
                isProcessingDice: false,
                hostOverride: false,
                eventLabels: {
                    chance: 'Chance',
                    quiz: 'Quiz',
                    ladder: 'Boost',
                    snake: 'Danger',
                },
                boardTheme: 'dark',
            }),

            toggleHostOverride: () => set((state) => ({ hostOverride: !state.hostOverride })),

            setEventLocations: (type, tileNumbers) => set((state) => ({
                boardConfig: state.boardConfig.map(tile => {
                    if (tileNumbers.includes(tile.id + 1)) {
                        return { ...tile, type, label: state.eventLabels[type] };
                    }
                    if (tile.type === type) {
                        return { ...tile, type: 'normal', label: undefined };
                    }
                    return tile;
                })
            })),

            setEventLabel: (type, label) => set((state) => ({
                eventLabels: { ...state.eventLabels, [type]: label },
                boardConfig: state.boardConfig.map(tile =>
                    tile.type === type ? { ...tile, label } : tile
                )
            })),

            setBoardTheme: (theme) => set({ boardTheme: theme }),

            triggerChance: (tileId) => {
                const { chanceStatus, boardConfig } = get();
                if (chanceStatus === 'idle') {
                    const tile = tileId !== undefined ? boardConfig.find(t => t.id === tileId) : null;
                    if (tile?.revealText) {
                        set({
                            currentChanceEvent: {
                                id: Date.now(),
                                title: "Chance Reveal",
                                description: tile.revealText,
                                icon: AlertCircle as any,
                                color: "from-amber-400 to-orange-600"
                            },
                            chanceStatus: 'spinning'
                        })
                    } else {
                        const randomIndex = Math.floor(Math.random() * CHANCE_EVENTS.length)
                        const selectedEvent = CHANCE_EVENTS[randomIndex]
                        set({
                            currentChanceEvent: selectedEvent,
                            chanceStatus: 'spinning'
                        })
                    }
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

            triggerBrainiac: (tileId) => {
                const { brainiacStatus, boardConfig } = get();
                if (brainiacStatus === 'idle') {
                    const tile = tileId !== undefined ? boardConfig.find(t => t.id === tileId) : null;
                    if (tile?.revealText) {
                        set({
                            currentBrainiacEvent: {
                                id: Date.now(),
                                title: "Quiz Reveal",
                                description: tile.revealText,
                                icon: BrainCircuit as any,
                                color: "from-indigo-400 to-blue-600"
                            },
                            brainiacStatus: 'thinking'
                        })
                    } else {
                        const randomIndex = Math.floor(Math.random() * BRAINIAC_EVENTS.length)
                        const selectedEvent = BRAINIAC_EVENTS[randomIndex]
                        set({
                            currentBrainiacEvent: selectedEvent,
                            brainiacStatus: 'thinking'
                        })
                    }
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

            triggerVantage: (tileId) => {
                const { vantageStatus, boardConfig } = get();
                if (vantageStatus === 'idle') {
                    const tile = tileId !== undefined ? boardConfig.find(t => t.id === tileId) : null;
                    if (tile?.revealText) {
                        set({
                            currentVantageEvent: {
                                id: Date.now(),
                                title: "Vantage Reveal",
                                description: tile.revealText,
                                icon: Mountain as any,
                                color: "from-blue-400 to-indigo-600"
                            },
                            vantageStatus: 'scanning'
                        })
                    } else {
                        const randomIndex = Math.floor(Math.random() * VANTAGE_EVENTS.length)
                        const selectedEvent = VANTAGE_EVENTS[randomIndex]
                        set({
                            currentVantageEvent: selectedEvent,
                            vantageStatus: 'scanning'
                        })
                    }
                } else if (vantageStatus === 'scanning') {
                    set({ vantageStatus: 'revealed' })
                }
            },

            resetVantage: () => {
                const { vantageStatus } = get();
                if (vantageStatus === 'revealed') {
                    set({ vantageStatus: 'idle' });
                } else {
                    set({ currentVantageEvent: null });
                }
            },

            triggerGift: (tileId) => {
                const { giftStatus, boardConfig } = get();
                if (giftStatus === 'idle') {
                    const tile = tileId !== undefined ? boardConfig.find(t => t.id === tileId) : null;
                    if (tile?.revealText) {
                        set({
                            currentGiftEvent: {
                                id: Date.now(),
                                title: "Gift Reveal",
                                description: tile.revealText,
                                icon: Gift as any,
                                color: "from-rose-400 to-red-600"
                            },
                            giftStatus: 'shaking'
                        })
                    } else {
                        const randomIndex = Math.floor(Math.random() * GIFT_EVENTS.length)
                        const selectedEvent = GIFT_EVENTS[randomIndex]
                        set({
                            currentGiftEvent: selectedEvent,
                            giftStatus: 'shaking'
                        })
                    }
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

            updateMapping: (actionId, mapping) => set((state) => ({
                mappings: {
                    ...state.mappings,
                    [actionId]: mapping
                }
            })),

            setMidiStatus: (status, deviceName = null) => set({ midiStatus: status, midiDeviceName: deviceName }),
            triggerMidiSignal: () => set({ lastMidiSignalTime: Date.now() }),
            toggleAudioFeedback: () => set((state) => ({ audioFeedbackEnabled: !state.audioFeedbackEnabled }))
        }),
        {
            name: 'game-storage',
        }
    ))
