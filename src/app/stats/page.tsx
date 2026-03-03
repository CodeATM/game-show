'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Trophy,
    Coins,
    Zap,
    Dices,
    TrendingUp,
    Star,
    Shield,
    type LucideIcon,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react'
import { useGameStore } from '@/store/gameStore'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
    trend?: string
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-5 rounded-3xl overflow-hidden"
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

            <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
                            <ArrowUpRight size={10} />
                            {trend}
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white w-6 h-6" />
                </div>
            </div>
        </motion.div>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`px-2.5 py-1 rounded-md font-black ${className}`}>
            {children}
        </span>
    )
}

function StatsContent() {
    const players = useGameStore(state => state.players)
    const rollCount = useGameStore(state => state.rollCount)

    if (!players || players.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-950 text-slate-500 font-sans">
                <div className="text-center space-y-4">
                    <Trophy className="w-12 h-12 mx-auto opacity-20" />
                    <p className="text-xs font-black uppercase tracking-[0.3em]">No player data available</p>
                </div>
            </div>
        )
    }

    const totalCoins = players.reduce((acc, p) => acc + p.coins, 0)
    const activeLeader = [...players].sort((a, b) => b.coins - a.coins)[0]
    const avgLuck = players.length > 0
        ? Math.round(players.reduce((acc, p) => acc + p.luckScore, 0) / players.length)
        : 0

    return (
        <div className="h-full w-full relative flex flex-col bg-slate-950 overflow-hidden font-sans">

            {/* Dynamic Background Noise/Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative flex-1 container max-w-7xl mx-auto px-6 pt-4 pb-24 flex flex-col gap-4 overflow-hidden">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 shrink-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-amber-500 w-6 h-6" />
                            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Board Metrics</h1>
                        </div>
                        <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[8px]">Session Overview & Player Performance</p>
                    </div>
                    <div className="flex items-center gap-4 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
                        <div className="px-4 py-1">
                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Total Circulation</p>
                            <p className="text-lg font-black text-white italic">${totalCoins.toLocaleString()}</p>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="px-4 py-1">
                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Dice Velocity</p>
                            <p className="text-xl font-black text-white italic">{rollCount} rolls</p>
                        </div>
                    </div>
                </div>

                {/* Top Row Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                    <StatCard
                        title="Top Earner"
                        value={activeLeader.name}
                        icon={Star}
                        color="from-amber-400 to-orange-600"
                        trend="Top of Leaderboard"
                    />
                    <StatCard
                        title="Average Luck"
                        value={`${avgLuck}%`}
                        icon={Zap}
                        color="from-indigo-400 to-blue-600"
                    />
                    <StatCard
                        title="Items Found"
                        value={players.reduce((acc, p) => acc + p.inventory.length, 0)}
                        icon={Shield}
                        color="from-emerald-400 to-teal-600"
                    />
                    <StatCard
                        title="Game Progress"
                        value={`${Math.round((activeLeader.position / 99) * 100)}%`}
                        icon={TrendingUp}
                        color="from-pink-500 to-rose-600"
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

                    {/* Leaderboard Column */}
                    <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-2 flex items-center gap-3">
                            <Coins size={14} className="text-amber-500" />
                            Live Leaderboard
                        </h2>
                        <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {[...players].sort((a, b) => b.coins - a.coins).map((player, idx) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex items-center gap-6 p-4 bg-slate-900/40 hover:bg-white/5 border border-white/5 rounded-2xl transition-all cursor-pointer"
                                >
                                    <span className="text-3xl font-black text-slate-800 italic group-hover:text-slate-600 transition-colors">0{idx + 1}</span>

                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-slate-800 shrink-0">
                                        <img
                                            src={`/avatars/${player.avatarSeed}.svg`}
                                            alt={player.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-white italic uppercase tracking-tighter">{player.name}</h4>
                                            {player.isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Position {player.position + 1} / 100</p>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <p className="text-2xl font-black text-white italic tracking-tighter">${player.coins.toLocaleString()}</p>
                                        <div className="flex gap-1 mt-1">
                                            {player.inventory.map((_item, i) => (
                                                <div key={i} className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center border border-white/10">
                                                    <Star size={10} className="text-slate-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <ChevronRight className="text-slate-700 group-hover:text-white transition-colors" size={20} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Side Distribution / Details */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                            <Dices className="absolute -right-12 -top-12 w-64 h-64 text-white/10 rotate-12" />

                            <div className="relative space-y-2">
                                <Badge className="bg-white/20 text-white border-none uppercase tracking-widest text-[9px]">Luck Factor</Badge>
                                <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none">Game<br />Luckiness</h3>
                            </div>

                            <div className="relative p-6 bg-black/20 backdrop-blur-md rounded-3xl border border-white/5 space-y-4 my-6">
                                {players.map(p => (
                                    <div key={p.id} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-white/60">{p.name}</span>
                                            <span className="text-white">{p.luckScore}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${p.luckScore}%` }}
                                                className={`h-full bg-linear-to-r ${p.id === 1 ? 'from-amber-400 to-orange-500' : p.id === 2 ? 'from-rose-400 to-red-500' : p.id === 3 ? 'from-emerald-400 to-teal-500' : 'from-blue-400 to-indigo-500'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="relative text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                Luck score is calculated based on encounter outcomes and gift rarity.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default function StatsPage() {
    return (
        <StatsContent />
    )
}
