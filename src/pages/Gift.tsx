import { motion, AnimatePresence } from 'framer-motion'
import { Gift as GiftIcon, RotateCcw, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/gameStore'

export default function Gift() {
    const { giftStatus, currentGiftEvent, triggerGift, resetGift } = useGameStore()

    return (
        <div className="h-screen w-full relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_70%)] bg-slate-950 overflow-hidden px-8">

            {/* Background Decorative Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: Math.random() * 1000 }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            y: [null, -100],
                            x: (Math.random() - 0.5) * 200
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute text-pink-500/20"
                    >
                        <Star size={Math.random() * 12 + 4} />
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {giftStatus !== 'revealed' ? (
                    <motion.div
                        key="hidden-state"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                        className="flex flex-col items-center gap-12"
                    >
                        {/* Shaking Gift Box */}
                        <motion.div
                            className="relative group cursor-pointer"
                            onClick={triggerGift}
                            animate={giftStatus === 'shaking' ? {
                                x: [-2, 2, -2, 2, 0],
                                rotate: [-5, 5, -5, 5, 0],
                                scale: [1, 1.1, 0.9, 1.2, 1]
                            } : {
                                y: [0, -10, 0]
                            }}
                            transition={giftStatus === 'shaking' ? {
                                duration: 0.15,
                                repeat: Infinity,
                            } : {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {/* Glow behind the box */}
                            <div className="absolute inset-0 bg-pink-500/20 blur-[60px] rounded-full scale-150 group-hover:bg-pink-500/40 transition-all duration-700" />

                            <div className={`relative z-10 w-64 h-64 flex items-center justify-center rounded-[3rem] border-4 backdrop-blur-3xl transition-all duration-500 ${giftStatus === 'shaking'
                                ? 'bg-pink-500/40 border-pink-400 shadow-[0_0_80px_rgba(236,72,153,0.6)]'
                                : 'bg-slate-900/40 border-white/10 group-hover:border-pink-500/50 group-hover:bg-pink-500/10'
                                }`}>
                                <GiftIcon className={`w-36 h-36 transition-all duration-500 ${giftStatus === 'shaking' ? 'text-pink-300 scale-110 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]' : 'text-slate-600 group-hover:text-pink-400'}`} />

                                {giftStatus === 'shaking' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{
                                                    opacity: [0, 1, 0],
                                                    scale: [1, 2, 1],
                                                    x: (Math.random() - 0.5) * 300,
                                                    y: (Math.random() - 0.5) * 300,
                                                    rotate: Math.random() * 360
                                                }}
                                                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                                                className="absolute"
                                            >
                                                <Sparkles className="text-pink-300 w-6 h-6" />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                                {giftStatus === 'shaking' ? 'Opening Gift...' : 'A Reward Awaits!'}
                            </h2>
                            <p className="text-pink-500/60 font-medium text-sm uppercase tracking-widest">
                                {giftStatus === 'shaking' ? 'Hold on tight!' : 'Click the box to unwrap'}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed-state"
                        initial={{ opacity: 0, scale: 0.5, rotate: -15, y: 50 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 100 }}
                        className="w-full max-w-xl flex flex-col items-center"
                    >
                        {/* Premium Reward Card */}
                        <div className={`w-full aspect-[16/10] p-1.5 rounded-[3rem] bg-gradient-to-br ${currentGiftEvent?.color} shadow-[0_0_100px_rgba(236,72,153,0.4)] relative`}>
                            <div className="w-full h-full bg-slate-950/95 backdrop-blur-2xl rounded-[2.8rem] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">

                                {/* Confetti Pattern Background */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${currentGiftEvent?.color} flex items-center justify-center mb-10 shadow-2xl ring-8 ring-white/5`}
                                >
                                    {currentGiftEvent && <currentGiftEvent.icon className="w-12 h-12 text-white" />}
                                </motion.div>

                                <div className="space-y-4">
                                    <h3 className="text-pink-500 text-xs font-black uppercase tracking-[0.5em]">Loot Unlocked</h3>
                                    <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase">
                                        {currentGiftEvent?.title}
                                    </h2>
                                    <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-xs mx-auto">
                                        {currentGiftEvent?.description}
                                    </p>
                                </div>

                                {/* Floating sparkles around card */}
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-10 -right-10 opacity-20"
                                >
                                    <Sparkles className="w-40 h-40 text-pink-500" />
                                </motion.div>
                            </div>
                        </div>

                        <Button
                            onClick={resetGift}
                            className="mt-12 bg-pink-600 hover:bg-pink-500 text-white px-10 py-7 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-[0_0_40px_rgba(236,72,153,0.3)] transition-all hover:scale-105"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Claim Reward
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
