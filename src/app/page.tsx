'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Zap } from 'lucide-react'

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const startTime = Date.now()
    const duration = 5000

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      const newCountdown = Math.max(0, 5 - Math.floor(elapsed / 1000))

      setProgress(newProgress)
      setCountdown(newCountdown)

      if (elapsed >= duration) {
        clearInterval(timer)
        router.push('/tiles')
      }
    }, 50)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-md w-full px-8">
        {/* Core Branding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            <Zap className="text-indigo-400 w-10 h-10 fill-indigo-400/20" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
              Game Show
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">
              Initiating Sequence
            </p>
          </div>
        </motion.div>

        {/* Countdown & Progress */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="absolute left-0 top-0 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={countdown}
                initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                className="text-7xl font-black text-white italic tracking-tighter"
              >
                {countdown > 0 ? countdown : "GO"}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2 px-6 py-1.5 rounded-full border border-white/5 bg-white/2">
              System Ready in {countdown}s
            </span>
          </div>
        </div>

        {/* Footer info */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-3 mt-4"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Handshake: Connection Stable
          </span>
        </motion.div>
      </div>
    </div>
  )
}
