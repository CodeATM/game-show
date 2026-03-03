'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { Zap, RotateCcw, ArrowRight, Wallet, UserMinus, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/gameStore'
import { audioManager } from '@/audioManager'
import { useEffect } from 'react'

// Icon mapping to handle serialization issues
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'Zap': Zap,
    'ArrowRight': ArrowRight,
    'Wallet': Wallet,
    'UserMinus': UserMinus,
    'Repeat': Repeat,
}

export default function ChancePage() {
    const { chanceStatus, currentChanceEvent, triggerChance, resetChance, audioFeedbackEnabled } = useGameStore()

    useEffect(() => {
        if (!audioFeedbackEnabled) {
            audioManager.stop('chance_animation');
            return;
        }

        if (chanceStatus === 'spinning') {
            audioManager.playLoop('chance_animation');
        } else {
            audioManager.stop('chance_animation');
            if (chanceStatus === 'revealed') {
                audioManager.play('reveal_event');
            }
        }

        return () => {
            audioManager.stop('chance_animation');
        };
    }, [chanceStatus, audioFeedbackEnabled]);

    // Get icon component by name
    const getIconComponent = () => {
        if (!currentChanceEvent?.icon) return null
        // If icon is already a component, use it
        if (typeof currentChanceEvent.icon === 'function') {
            return currentChanceEvent.icon
        }
        // If icon is serialized, try to get from map
        const iconName = (currentChanceEvent.icon as any).name || 'Zap'
        return iconMap[iconName] || Zap
    }

    const EventIcon = getIconComponent()

    const sparks = useMemo(() => [
        { x: -150, y: 120 }, { x: 80, y: -190 }, { x: -40, y: 150 },
        { x: 160, y: 40 }, { x: -120, y: -130 }, { x: 200, y: -70 },
        { x: -180, y: -20 }, { x: 50, y: 180 }, { x: -90, y: 110 },
        { x: 110, y: -150 }, { x: -200, y: 60 }, { x: 140, y: 130 }
    ], [])

    return (
        <div className="h-screen w-full relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),transparent_70%)] bg-slate-950 overflow-hidden px-8">

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <AnimatePresence mode="wait">
                {chanceStatus !== 'revealed' ? (
                    <motion.div
                        key="hidden-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={chanceStatus === 'spinning' ? {
                            x: [0, -2, 2, -2, 2, 0],
                            y: [0, 2, -2, 2, -2, 0],
                        } : {
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0
                        }}
                        transition={chanceStatus === 'spinning' ? {
                            duration: 0.1,
                            repeat: Infinity,
                        } : {
                            duration: 0.5
                        }}
                        exit={{
                            opacity: 0,
                            scale: 2,
                            filter: "blur(40px)",
                            transition: { duration: 0.5, ease: "easeIn" }
                        }}
                        className="relative group cursor-pointer"
                        onClick={() => triggerChance()}
                    >
                        {/* Power Aura / Pulsing Rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.8],
                                        opacity: [0.3, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.5,
                                        ease: "easeOut"
                                    }}
                                    className={`absolute w-72 h-72 rounded-full border-2 border-amber-500/30 blur-sm`}
                                />
                            ))}
                        </div>

                        {/* Voltage Icon Core */}
                        <motion.div
                            animate={chanceStatus === 'spinning' ? {
                                scale: [1, 1.2, 0.9, 1.3],
                                rotate: [0, 180, 270, 720],
                            } : {
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: chanceStatus === 'spinning' ? 0.35 : 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`relative z-10 w-72 h-72 flex items-center justify-center rounded-[3rem] border-4 backdrop-blur-3xl transition-all duration-500 ${chanceStatus === 'spinning'
                                ? 'bg-amber-500/30 border-amber-400 shadow-[0_0_100px_rgba(245,158,11,0.6)]'
                                : 'bg-slate-900/40 border-white/10 group-hover:border-amber-500/50 group-hover:bg-amber-500/10'
                                }`}
                        >
                            <Zap className={`w-32 h-32 transition-all duration-500 ${chanceStatus === 'spinning' ? 'text-amber-300 scale-125 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]' : 'text-slate-500 group-hover:text-amber-400'
                                }`} fill={chanceStatus === 'spinning' ? "currentColor" : "none"} />

                            {/* Electric Sparks */}
                            {chanceStatus === 'spinning' && (
                                <div className="absolute inset-0">
                                    {sparks.map((spark, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 2.5, 0.8],
                                                x: spark.x,
                                                y: spark.y,
                                            }}
                                            transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.03 }}
                                            className="absolute top-1/2 left-1/2 w-1.5 h-12 bg-amber-400 blur-[1px] rounded-full origin-center"
                                            style={{ rotate: `${i * 30}deg` }}
                                        />
                                    ))}
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={`bolt-${i}`}
                                            animate={{
                                                opacity: [0, 0.8, 0],
                                                scaleX: [0.8, 1.2, 0.9],
                                            }}
                                            transition={{ duration: 0.1, repeat: Infinity, delay: i * 0.15 }}
                                            className="absolute top-1/2 left-1/2 w-full h-1 bg-white blur-[2px] -translate-y-1/2"
                                            style={{ rotate: `${45 + i * 90}deg` }}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Hint Text */}
                        <motion.div
                            animate={{ opacity: chanceStatus === 'spinning' ? 0 : [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-12 text-center"
                        >
                            <p className="text-lg font-black uppercase tracking-[0.5em] text-amber-500">
                                Unleash the Power
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                Click to activate chance
                            </p>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed-state"
                        initial={{ opacity: 0, y: 40, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="w-full max-w-xl flex flex-col items-center"
                    >
                        {/* Event Card */}
                        <div className={`w-full aspect-16/10 p-1 rounded-[2.5rem] bg-linear-to-br ${currentChanceEvent?.color} shadow-[0_0_80px_rgba(0,0,0,0.4)] relative`}>
                            <div className="w-full h-full bg-slate-950/90 backdrop-blur-xl rounded-[2.4rem] p-10 flex flex-col items-center justify-center text-center">

                                <div className={`p-5 rounded-3xl bg-linear-to-br ${currentChanceEvent?.color} mb-6 shadow-2xl`}>
                                    {EventIcon && <EventIcon className="w-12 h-12 text-white" />}
                                </div>

                                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter italic">
                                    {currentChanceEvent?.title || 'Chance Event'}
                                </h2>

                                <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-sm">
                                    {currentChanceEvent?.description || 'Something mysterious is about to happen...'}
                                </p>

                                {/* Decorative Elements */}
                                <div className="absolute top-4 left-4 opacity-10">
                                    <Zap className="w-12 h-12" />
                                </div>
                                <div className="absolute bottom-4 right-4 opacity-10 rotate-180">
                                    <Zap className="w-12 h-12" />
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 flex gap-4"
                        >
                            <Button
                                onClick={resetChance}
                                variant="outline"
                                className="bg-slate-900/40 border-white/5 hover:bg-white/5 text-slate-400 px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Chance
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
