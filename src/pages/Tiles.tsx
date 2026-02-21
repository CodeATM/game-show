import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { HelpCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

// Premium motion constants
const smoothTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const;

interface TileProps {
    id: number
    type: 'normal' | 'chance' | 'quiz' | 'snake' | 'ladder'
    label?: string
    playersOnTile: number[]
}

function Tile({ id, type, label, playersOnTile }: TileProps) {
    const getStyles = () => {
        switch (type) {
            case 'chance': return 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
            case 'quiz': return 'border-blue-400 bg-blue-500/15 text-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.1)]'
            case 'snake': return 'border-rose-400 bg-rose-500/15 text-rose-300 shadow-[0_0_15px_rgba(251,113,133,0.1)]'
            case 'ladder': return 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.1)]'
            default: return 'border-white/10 bg-slate-900/60 text-slate-400'
        }
    }

    const getIcon = () => {
        switch (type) {
            case 'chance': return <AlertCircle className="w-4 h-4" />
            case 'quiz': return <HelpCircle className="w-4 h-4" />
            case 'snake': return <TrendingDown className="w-4 h-4" />
            case 'ladder': return <TrendingUp className="w-4 h-4" />
            default: return null
        }
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            className={`relative flex flex-col items-center justify-center rounded-lg border transition-all duration-300 min-h-0 min-w-0 ${getStyles()}`}
        >
            <span className="absolute top-1.5 left-2 text-[10px] font-black opacity-80 select-none">
                {id + 1}
            </span>

            <div className="flex flex-col items-center gap-0.5 scale-90 sm:scale-100 mt-2">
                {getIcon()}
                {label && <span className="text-[10px] font-black uppercase tracking-widest text-center px-1 line-clamp-1">{label}</span>}
            </div>

            {/* Players on Tile Indicator */}
            <div className="absolute bottom-1.5 inset-x-0 flex justify-center gap-0.5 px-0.5 flex-wrap">
                {playersOnTile.map(pid => (
                    <motion.div
                        key={pid}
                        layoutId={`player-${pid}`}
                        className={`w-2.5 h-2.5 rounded-full border border-white/40 shadow-lg ${pid === 1 ? 'bg-indigo-500' :
                            pid === 2 ? 'bg-rose-500' :
                                pid === 3 ? 'bg-emerald-500' :
                                    'bg-amber-500'
                            }`}
                    />
                ))}
            </div>
        </motion.div>
    )
}

export default function Tiles() {
    const { boardConfig, players } = useGameStore()

    // Expanded special tiles for a richer experience
    const exampleConfigs = [
        { id: 4, type: 'chance', label: 'Chance' },
        { id: 7, type: 'ladder', label: 'Boost' },
        { id: 12, type: 'quiz', label: 'Quiz' },
        { id: 15, type: 'snake', label: 'Danger' },
        { id: 22, type: 'chance', label: 'Mystery' },
        { id: 25, type: 'snake', label: 'Danger' },
        { id: 28, type: 'ladder', label: 'Boost' },
        { id: 33, type: 'quiz', label: 'Trivia' },
        { id: 37, type: 'ladder', label: 'Boost' },
        { id: 42, type: 'chance', label: 'Luck' },
        { id: 45, type: 'snake', label: 'Trap' },
        { id: 50, type: 'quiz', label: 'Trivia' },
        { id: 54, type: 'ladder', label: 'Elite' },
        { id: 58, type: 'snake', label: 'Pit' },
        { id: 63, type: 'chance', label: 'Mystery' },
        { id: 67, type: 'quiz', label: 'Challenge' },
        { id: 72, type: 'ladder', label: 'Ascend' },
        { id: 75, type: 'snake', label: 'Despair' },
        { id: 82, type: 'snake', label: 'Trap' },
        { id: 85, type: 'chance', label: 'Destiny' },
        { id: 88, type: 'quiz', label: 'Mastery' },
        { id: 91, type: 'ladder', label: 'Elite' },
        { id: 94, type: 'snake', label: 'Overlord' },
        { id: 97, type: 'chance', label: 'Grand' },
    ] as const;

    return (
        <div className="h-screen w-full relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)] bg-slate-950 overflow-hidden selection:bg-indigo-500/30 p-2 sm:p-4 md:p-6 lg:p-8">

            {/* Board Container - Centered and scaled to fit 100vh */}
            <div className="w-full h-full max-w-[1600px] flex items-center justify-center min-h-0">
                <div className="grid grid-cols-10 grid-rows-10 gap-2 p-6 bg-slate-950/40 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl w-full h-full max-h-[92vh] mx-auto overflow-hidden">
                    {boardConfig.map((tile) => {
                        const config = exampleConfigs.find(c => c.id === tile.id) || tile;
                        const playersOnThisTile = players
                            .filter(p => p.position === tile.id)
                            .map(p => p.id);

                        return (
                            <Tile
                                key={tile.id}
                                id={tile.id}
                                type={config.type}
                                label={config.label}
                                playersOnTile={playersOnThisTile}
                            />
                        );
                    })}
                </div>
            </div>

        </div>
    )
}
