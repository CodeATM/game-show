import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { Lightbulb, RotateCcw, BrainCircuit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/gameStore'

export default function Brainiac() {
    const { brainiacStatus, currentBrainiacEvent, triggerBrainiac, resetBrainiac } = useGameStore()

    const sparks = useMemo(() => [
        { x: -42, delay: 0.5 },
        { x: 15, delay: 1.2 },
        { x: 33, delay: 0.8 },
        { x: -12, delay: 1.5 },
        { x: 48, delay: 0.3 },
        { x: -25, delay: 1.9 },
        { x: 5, delay: 0.7 },
        { x: -38, delay: 1.1 }
    ], [])

    return (
        <div className="h-screen w-full relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] bg-slate-950 overflow-hidden px-8">

            {/* Background Decorative Elements - Blueish/Academic theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <AnimatePresence mode="wait">
                {brainiacStatus !== 'revealed' ? (
                    <motion.div
                        key="hidden-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={brainiacStatus === 'thinking' ? {
                            scale: [1, 1.05, 0.95, 1.1, 1],
                            rotate: [0, -5, 5, -5, 5, 0],
                        } : {
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={brainiacStatus === 'thinking' ? {
                            duration: 0.5,
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
                        onClick={triggerBrainiac}
                    >
                        {/* Wisdom Aura / Pulsing Rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 2],
                                        opacity: [0.4, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.6,
                                        ease: "easeOut"
                                    }}
                                    className={`absolute w-80 h-80 rounded-full border-2 border-blue-400/30 blur-md`}
                                />
                            ))}
                        </div>

                        {/* BrainBulb Icon Core */}
                        <motion.div
                            animate={brainiacStatus === 'thinking' ? {
                                boxShadow: [
                                    "0 0 20px rgba(59,130,246,0.3)",
                                    "0 0 60px rgba(59,130,246,0.8)",
                                    "0 0 20px rgba(59,130,246,0.3)"
                                ]
                            } : {}}
                            transition={{ duration: 0.4, repeat: Infinity }}
                            className={`relative z-10 w-72 h-72 flex items-center justify-center rounded-full border-4 backdrop-blur-3xl transition-all duration-500 ${brainiacStatus === 'thinking'
                                ? 'bg-blue-500/40 border-blue-400 border-dashed animate-spin-slow'
                                : 'bg-slate-900/40 border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10'
                                }`}
                        >
                            <Lightbulb className={`w-36 h-36 transition-all duration-500 ${brainiacStatus === 'thinking' ? 'text-yellow-300 scale-110 drop-shadow-[0_0_25px_rgba(253,224,71,0.9)]' : 'text-slate-500 group-hover:text-blue-400'
                                }`} fill={brainiacStatus === 'thinking' ? "currentColor" : "none"} />

                            {/* Intellectual Sparks (Floating geometric shapes) */}
                            {brainiacStatus === 'thinking' && (
                                <div className="absolute inset-0">
                                    {sparks.map((spark, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [-20, -100],
                                                x: spark.x,
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 1.2, 0.5],
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: spark.delay }}
                                            className="absolute top-1/2 left-1/2 w-4 h-4 text-blue-300/60"
                                        >
                                            <BrainCircuit className="w-full h-full" />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Hint Text */}
                        <motion.div
                            animate={{ opacity: brainiacStatus === 'thinking' ? 0 : [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-12 text-center"
                        >
                            <p className="text-lg font-black uppercase tracking-[0.5em] text-blue-500">
                                Brainiac Mode
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                Click to reveal question
                            </p>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed-state"
                        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="w-full max-w-xl flex flex-col items-center"
                    >
                        {/* Question Card */}
                        <div className={`w-full aspect-16/10 p-1 rounded-[2.5rem] bg-linear-gradient-to-br ${currentBrainiacEvent?.color} shadow-[0_0_100px_rgba(59,130,246,0.5)] relative overflow-hidden`}>
                            {/* Geometric Background pattern */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
                                    {[...Array(24)].map((_, i) => (
                                        <div key={i} className="border-[0.5px] border-white/20" />
                                    ))}
                                </div>
                            </div>

                            <div className="w-full h-full bg-slate-950/90 backdrop-blur-xl rounded-[2.4rem] p-10 flex flex-col items-center justify-center text-center relative z-10">

                                <div className={`p-6 rounded-full bg-linear-gradient-to-br ${currentBrainiacEvent?.color} mb-8 shadow-2xl ring-4 ring-white/10`}>
                                    {currentBrainiacEvent && <currentBrainiacEvent.icon className="w-14 h-14 text-white" />}
                                </div>

                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-black text-white mb-6 tracking-tight"
                                >
                                    {currentBrainiacEvent?.title}
                                </motion.h2>

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl text-blue-100/90 font-medium leading-relaxed max-w-sm italic quote"
                                >
                                    "{currentBrainiacEvent?.description}"
                                </motion.p>

                                {/* Decorative Icons */}
                                <div className="absolute top-4 right-4 opacity-10 rotate-12">
                                    <BrainCircuit className="w-16 h-16" />
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12"
                        >
                            <Button
                                onClick={resetBrainiac}
                                variant="outline"
                                className="bg-blue-600 border-none hover:bg-blue-500 text-white px-10 py-7 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                            >
                                <RotateCcw className="w-5 h-5 mr-3" />
                                Next Question
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
