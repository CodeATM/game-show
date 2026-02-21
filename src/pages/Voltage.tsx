import { motion, AnimatePresence } from 'framer-motion'
import { BatteryCharging, RotateCcw, AlertTriangle, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/store/gameStore'

export default function Voltage() {
    const { voltageStatus, currentVoltageEvent, triggerVoltage, resetVoltage } = useGameStore()

    return (
        <div className="h-screen w-full relative flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-8">

            {/* High Voltage Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)]" />
            </div>

            <AnimatePresence mode="wait">
                {voltageStatus !== 'revealed' ? (
                    <motion.div
                        key="hidden-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        className="flex flex-col items-center gap-12"
                    >
                        {/* High Voltage Warning Header */}
                        <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-full backdrop-blur-md">
                            <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                            <span className="text-amber-500 text-xs font-black uppercase tracking-widest">High Voltage Danger</span>
                        </div>

                        {/* Battery Container */}
                        <div
                            className="relative w-48 h-80 rounded-[2.5rem] border-4 border-slate-800 bg-slate-900/50 p-3 group cursor-pointer"
                            onClick={triggerVoltage}
                        >
                            {/* Battery Tip */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-t-lg" />

                            {/* Battery Inner Filling */}
                            <div className="w-full h-full rounded-[1.8rem] bg-slate-950/80 relative overflow-hidden">
                                {voltageStatus === 'charging' && (
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        animate={{ height: "100%" }}
                                        transition={{ duration: 3, ease: "linear" }}
                                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-400 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
                                    >
                                        {/* Electric Arcs effect during charging */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-white blur-[2px] opacity-80" />
                                    </motion.div>
                                )}

                                {/* Centered Icon */}
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <motion.div
                                        animate={voltageStatus === 'charging' ? {
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 1, 0.3],
                                        } : {}}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    >
                                        <BatteryCharging className={`w-20 h-20 transition-all duration-500 ${voltageStatus === 'charging' ? 'text-white' : 'text-slate-700 group-hover:text-amber-500'}`} />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Power Indicator Label */}
                            <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-2 h-8 rounded-full transition-all duration-300 ${voltageStatus === 'charging' ? 'bg-amber-500 animate-pulse' : 'bg-slate-800'}`} style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>

                        {/* Interaction Prompt */}
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter mb-2 italic">
                                {voltageStatus === 'charging' ? 'System Overclocking...' : 'Initiate Power Surge'}
                            </h2>
                            <p className="text-amber-500/60 font-medium text-xs uppercase tracking-[0.2em]">
                                {voltageStatus === 'charging' ? 'Keep distance - High energy detected' : 'Click the cell to begin charge'}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed-state"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full max-w-2xl flex flex-col items-center"
                    >
                        {/* Industrial Terminal Reveal */}
                        <div className={`w-full bg-slate-900 border-t-8 ${currentVoltageEvent?.color.includes('red') ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]' : 'border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)]'} rounded-[1.5rem] p-1 overflow-hidden`}>
                            <div className="bg-slate-950 p-12 rounded-[1rem] flex flex-col items-center text-center relative">

                                {/* Background System Scannelines */}
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] pointer-events-none" />

                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentVoltageEvent?.color} flex items-center justify-center mb-8 shadow-2xl rotate-3`}>
                                    {currentVoltageEvent && <currentVoltageEvent.icon className="w-10 h-10 text-white" />}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <Activity className="w-4 h-4 text-slate-500" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">System Output</span>
                                        <Activity className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic">
                                        {currentVoltageEvent?.title}
                                    </h2>
                                    <div className="h-0.5 w-32 bg-slate-800 mx-auto" />
                                    <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed uppercase tracking-wide">
                                        {currentVoltageEvent?.description}
                                    </p>
                                </div>

                                {/* Industrial Warning Strip */}
                                <div className="absolute bottom-4 left-0 w-full overflow-hidden opacity-20">
                                    <div className="flex gap-4 animate-marquee whitespace-nowrap text-[8px] font-black text-amber-500 uppercase tracking-widest">
                                        {[...Array(10)].map((_, i) => <span key={i}>Caution High Energy Reveal Mode ⚡</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={resetVoltage}
                            className="mt-12 bg-white text-slate-950 hover:bg-slate-200 px-12 py-7 rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center gap-3 shadow-2xl"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Cycle Power Grid
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
