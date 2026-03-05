'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Dices, LayoutGrid, Zap, BrainCircuit, Activity, Gift as GiftIcon, TrendingUp, ShieldAlert } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastActivity, setLastActivity] = useState<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setIsVisible(true)
    setLastActivity(Date.now())
  }, [pathname])

  // Auto-hide after 3 seconds of inactivity
  useEffect(() => {
    if (!isVisible || !lastActivity) return

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isVisible, lastActivity])

  // Show on 'b' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key.toLowerCase() === 'b') {
        setIsVisible(true)
        setLastActivity(Date.now())
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'game-storage') {
        useGameStore.persist.rehydrate()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: 100, x: '-50%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-8 left-1/2 z-50 px-4 w-full max-w-fit"
        >
          <nav className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-2xl p-2 rounded-full border border-white/5 shadow-2xl overflow-x-auto no-scrollbar max-w-[90vw]">
            {/* <Link
              href="/dice"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/dice'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Dices className="w-4 h-4" />
              Dice
            </Link> */}
            <Link
              href="/tiles"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/tiles'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Board
            </Link>
            <Link
              href="/chance"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/chance'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Zap className="w-4 h-4" />
              Chance
            </Link>
            <Link
              href="/brainiac"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/brainiac'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <BrainCircuit className="w-4 h-4" />
              Brainiac
            </Link>
            <Link
              href="/vantage"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/vantage'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Activity className="w-4 h-4" />
              Vantage
            </Link>
            <Link
              href="/gift"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/gift'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <GiftIcon className="w-4 h-4" />
              Gift
            </Link>
            <Link
              href="/stats"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/stats'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              Stats
            </Link>
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pathname === '/admin'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Admin
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
