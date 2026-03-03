'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { HelpCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface TileProps {
    id: number
    type: 'normal' | 'chance' | 'quiz' | 'snake' | 'ladder'
    label?: string
    playersOnTile: number[]
    isActiveTile?: boolean
    activeColor?: string
    theme: 'light' | 'dark' | 'groups'
}

function Tile({ id, type, label, playersOnTile, isActiveTile, activeColor, theme }: TileProps) {
    const getStyles = () => {
        if (theme === 'dark') {
            switch (type) {
                case 'chance': return 'border-amber-400 bg-amber-500/15 text-white shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                case 'quiz': return 'border-blue-400 bg-blue-500/15 text-white shadow-[0_0_15px_rgba(96,165,250,0.1)]'
                case 'snake': return 'border-rose-400 bg-rose-500/15 text-white shadow-[0_0_15px_rgba(251,113,133,0.1)]'
                case 'ladder': return 'border-emerald-400 bg-emerald-500/15 text-white shadow-[0_0_15px_rgba(52,211,153,0.1)]'
                default: return 'border-white/10 bg-slate-900/60 text-white'
            }
        } else if (theme === 'groups') {
            if (type !== 'normal') {
                switch (type) {
                    case 'chance': return 'border-amber-500 bg-amber-600/40 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    case 'quiz': return 'border-blue-500 bg-blue-600/40 text-black shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    case 'snake': return 'border-rose-500 bg-rose-600/40 text-black shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    case 'ladder': return 'border-emerald-500 bg-emerald-600/40 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }
            }

            const tileNum = id + 1;
            let baseStyle = '';

            if (tileNum <= 20) {
                baseStyle = 'border-[#A8A8A8] bg-[#A8A8A8]/80 text-black shadow-sm';
            } else if (tileNum <= 50) {
                baseStyle = 'border-[#FFEF00] bg-[#FFEF00]/80 text-black shadow-sm';
            } else if (tileNum <= 80) {
                baseStyle = 'border-[#00FF7F] bg-[#00FF7F]/80 text-black shadow-sm';
            } else {
                baseStyle = 'border-[#E26F66] bg-[#E26F66]/80 text-black shadow-sm';
            }

            return baseStyle;
        } else {
            switch (type) {
                case 'chance': return 'border-amber-300 bg-amber-50 text-black shadow-sm'
                case 'quiz': return 'border-blue-300 bg-blue-50 text-black shadow-sm'
                case 'snake': return 'border-rose-300 bg-rose-50 text-black shadow-sm'
                case 'ladder': return 'border-emerald-300 bg-emerald-50 text-black shadow-sm'
                default: return 'border-slate-300 bg-white text-black shadow-sm'
            }
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

    const neonColorMap: Record<string, string> = {
        indigo: '#6366f1',
        rose: '#f43f5e',
        emerald: '#10b981',
        amber: '#f59e0b'
    };

    const activeNeonColor = activeColor ? neonColorMap[activeColor] || '#6366f1' : '#6366f1';

    return (
        <motion.div
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            className={`relative flex flex-col items-center justify-center rounded-lg border transition-all duration-300 min-h-0 min-w-0 overflow-hidden backdrop-blur-md ${getStyles()} ${isActiveTile ? 'border-transparent shadow-none' : ''}`}
        >
            {/* Glass Reflection Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-lg z-0" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 40.1%, rgba(255,255,255,0) 100%)',
                boxShadow: 'inset 0px 1px 1px rgba(255,255,255,0.3), inset 0px -1px 2px rgba(0,0,0,0.1)'
            }} />
            {/* Neon Strip Light Animation */}
            {isActiveTile && (
                <div className="absolute inset-0 rounded-lg pointer-events-none">
                    {/* Pulsing Base Glow */}
                    <motion.div
                        className="absolute inset-0 rounded-lg opacity-20"
                        style={{ backgroundColor: activeNeonColor }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Rotating Neon Border */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <motion.div
                            className="absolute inset-[-150%] opacity-100"
                            style={{
                                background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, ${activeNeonColor} 340deg, ${activeNeonColor} 360deg)`
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    {/* Constant border to maintain shape */}
                    <div
                        className="absolute inset-0 rounded-lg border-2 opacity-50 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
                        style={{ borderColor: activeNeonColor, boxShadow: `0 0 15px ${activeNeonColor}44` }}
                    />
                </div>
            )}

            <span className="absolute top-1.5 left-2 text-[10px] font-black opacity-80 select-none z-10">
                {id + 1}
            </span>

            <div className="flex flex-col items-center gap-0.5 scale-90 sm:scale-100 mt-2 z-10">
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

export default function TilesPage() {
    const { boardConfig, players, boardTheme } = useGameStore()

    const isLight = boardTheme === 'light'
    const isGroups = boardTheme === 'groups'
    const isLightBg = isLight || isGroups

    return (
        <div className={`h-screen w-full relative flex flex-col items-center justify-center transition-colors duration-700 overflow-hidden selection:bg-indigo-500/30 p-2 sm:p-4 md:p-6 lg:p-8 ${isLightBg
            ? 'bg-slate-50'
            : 'bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)] bg-slate-950'
            }`}>

            {/* Board Container - Centered and scaled to fit 100vh */}
            <div className="w-full h-full max-w-[1600px] flex flex-col items-center justify-center min-h-0 gap-4">

                {/* Start Zone */}
                <div className={`flex items-center gap-4 backdrop-blur-md border p-4 rounded-2xl w-full max-w-4xl transition-all duration-500 ${isLightBg ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' : 'bg-slate-900/40 border-white/5'
                    }`}>
                    <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLightBg ? 'text-indigo-600' : 'text-indigo-400'}`}>Paddock</span>
                        <span className={`text-sm font-black italic tracking-tight uppercase ${isLightBg ? 'text-slate-900' : 'text-white'}`}>Start Zone</span>
                    </div>
                    <div className={`h-8 w-px mx-2 ${isLightBg ? 'bg-slate-200' : 'bg-white/5'}`} />
                    <div className="flex items-center gap-3">
                        {players.filter(p => p.position === 0).length === 0 && (
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">All units deployed</span>
                        )}
                        <div className="flex items-center gap-3">
                            {players.filter(p => p.position === 0).map(p => (
                                <motion.div
                                    key={p.id}
                                    layoutId={`player-${p.id}`}
                                    className={`w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center shadow-lg relative ${p.id === 1 ? 'bg-indigo-500' :
                                        p.id === 2 ? 'bg-rose-500' :
                                            p.id === 3 ? 'bg-emerald-500' :
                                                'bg-amber-500'
                                        }`}
                                >
                                    <span className="text-[10px] font-black text-white uppercase">{p.name[0]}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-10 grid-rows-10 gap-2 p-6 rounded-3xl border backdrop-blur-md transition-all duration-500 w-full h-full max-h-[85vh] mx-auto overflow-hidden ${isLightBg ? 'bg-white/40 border-slate-200 shadow-2xl shadow-slate-200/20' : 'bg-slate-950/40 border-white/5 shadow-2xl'
                    }`}>
                    {(() => {
                        const visualTiles = [];
                        for (let y = 0; y < 10; y++) {
                            const r = 9 - y; // Row from bottom (0-9)
                            for (let x = 0; x < 10; x++) {
                                let index;
                                if (r % 2 === 0) {
                                    index = r * 10 + x; // Left to Right
                                } else {
                                    index = r * 10 + (9 - x); // Right to Left
                                }
                                visualTiles.push(boardConfig[index]);
                            }
                        }

                        return visualTiles.map((tile) => {
                            const playersOnThisTile = players
                                .filter(p => p.position === (tile.id + 1))
                                .map(p => p.id);

                            const activePlayer = players.find(p => p.isActive);
                            const isActiveTile = activePlayer ? activePlayer.position === (tile.id + 1) : false;
                            const activeColor = activePlayer ? activePlayer.color : undefined;

                            return (
                                <Tile
                                    key={tile.id}
                                    id={tile.id}
                                    type={tile.type}
                                    label={tile.label}
                                    playersOnTile={playersOnThisTile}
                                    isActiveTile={isActiveTile}
                                    activeColor={activeColor}
                                    theme={boardTheme}
                                />
                            );
                        });
                    })()}
                </div>
            </div>

        </div>
    )
}
