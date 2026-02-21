import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, Sparkles, ChevronRight, Trophy, Star, Activity } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input.tsx'

export default function Register() {
    const [name, setName] = useState('')
    const [sessionId, setSessionId] = useState('')
    const { setActivePlayerName, setGameSessionId } = useGameStore()
    const navigate = useNavigate()

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim() && sessionId.trim()) {
            setActivePlayerName(name.trim())
            setGameSessionId(sessionId.trim())
            navigate('/dice')
        }
    }

    return (
        <div className="h-screen w-full relative flex flex-col items-center justify-center bg-slate-950 overflow-hidden font-sans p-6">

            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-amber-500/10 blur-[120px] rounded-full" />
            </div>

            {/* Registration Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                className="relative z-10 w-full max-w-md bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl flex flex-col gap-8"
            >
                {/* Header Decoration */}
                <div className="flex justify-center -mt-20">
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-full blur-2xl opacity-40"
                        />
                        <div className="relative w-24 h-24 bg-slate-950 rounded-full border-2 border-white/10 flex items-center justify-center shadow-2xl">
                            <Trophy className="text-amber-400 w-10 h-10" />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 -right-2 bg-rose-500 p-1.5 rounded-lg shadow-lg"
                        >
                            <Star className="text-white w-4 h-4 fill-white" />
                        </motion.div>
                    </div>
                </div>

                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Join The <span className="text-indigo-400">Show</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed px-4">
                        Secure your session & select your stage name
                    </p>
                </div>

                <form onSubmit={handleJoin} className="space-y-4">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
                                <Activity className="w-5 h-5" />
                            </div>
                            <Input
                                placeholder="SESSION ID (E.G. SHOW-99)"
                                value={sessionId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSessionId(e.target.value.toUpperCase())}
                                className="h-16 pl-14 bg-white/5 border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-2xl text-white font-black italic tracking-widest text-sm placeholder:text-slate-700 transition-all uppercase"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
                                <User className="w-5 h-5" />
                            </div>
                            <Input
                                placeholder="YOUR STAGE NAME..."
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value.toUpperCase())}
                                className="h-16 pl-14 bg-white/5 border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-2xl text-white font-black italic tracking-widest text-sm placeholder:text-slate-700 transition-all uppercase"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                <Sparkles className="w-5 h-5 text-amber-500/40 group-focus-within:text-amber-400 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!name.trim() || !sessionId.trim()}
                        className="w-full h-16 bg-white text-slate-950 hover:bg-indigo-50 font-black uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 disabled:opacity-20 mt-4"
                    >
                        Enter The Arena
                        <ChevronRight className="w-5 h-5 bg-indigo-500 text-white rounded-lg p-0.5" />
                    </Button>
                </form>

                <p className="text-center text-slate-600 text-[9px] font-bold uppercase tracking-widest">
                    By entering you agree to the rules of engagement
                </p>
            </motion.div>

            {/* Bottom Credits */}
            <div className="absolute bottom-8 text-center">
                <p className="text-slate-500/40 text-[10px] font-black uppercase tracking-[0.4em] italic">
                    Grand Game Show Engine v2.4.0
                </p>
            </div>
        </div>
    )
}
