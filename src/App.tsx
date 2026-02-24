import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DiceRoller from '@/pages/DiceRoller'
import Tiles from '@/pages/Tiles'
import Chance from '@/pages/Chance'
import Brainiac from '@/pages/Brainiac'
import Voltage from '@/pages/Voltage'
import Gift from '@/pages/Gift'
import Stats from '@/pages/Stats'
import Admin from '@/pages/Admin'
import Register from '@/pages/Register'

import { Dices, LayoutGrid, Zap, BrainCircuit, Activity, Gift as GiftIcon, TrendingUp, ShieldAlert } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'

// --- Layout Component ---

function Layout({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastActivity, setLastActivity] = useState(() => Date.now())
  const location = useLocation()

  // Reveal navigation on route change and handle auto-hide
  useEffect(() => {
    const reveal = () => {
      setIsVisible(true)
      setLastActivity(Date.now())
    }
    reveal()
  }, [location.pathname])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isVisible) {
      timer = window.setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    }
    return () => window.clearTimeout(timer)
  }, [isVisible, lastActivity])

  // Keyboard shortcut listener
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans">
      <main className="flex-1 relative">
        {children}
      </main>

      {/* Floating Navigation */}
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
              <NavLink to="/dice" end className={({ isActive }) => `flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Dices className="w-4 h-4" />
                Dice
              </NavLink>
              <NavLink to="/tiles" end className={({ isActive }) => `flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <LayoutGrid className="w-4 h-4" />
                Board
              </NavLink>
              <NavLink to="/chance" end className={({ isActive }) => `flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Zap className="w-4 h-4" />
                Chance
              </NavLink>
              <NavLink to="/brainiac" end className={({ isActive }) => `flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <BrainCircuit className="w-5 h-5" />
                <span className="text-sm">Brainiac</span>
              </NavLink>
              <NavLink to="/voltage" end className={({ isActive }) => `flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Activity className="w-5 h-5" />
                <span className="text-sm">Voltage</span>
              </NavLink>
              <NavLink to="/gift" end className={({ isActive }) => `flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <GiftIcon className="w-5 h-5" />
                <span className="text-sm">Gift</span>
              </NavLink>
              <NavLink to="/stats" end className={({ isActive }) => `flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Stats</span>
              </NavLink>
              <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <ShieldAlert className="w-5 h-5" />
                <span className="text-sm">Admin</span>
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Main App Component ---

function App() {
  const { activePlayerName } = useGameStore()

  // Cross-tab Synchronization
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
    <Layout>
      <Routes>
        <Route path="/" element={activePlayerName ? <DiceRoller /> : <Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dice" element={<DiceRoller />} />
        <Route path="/tiles" element={<Tiles />} />
        <Route path="/chance" element={<Chance />} />
        <Route path="/brainiac" element={<Brainiac />} />
        <Route path="/voltage" element={<Voltage />} />
        <Route path="/gift" element={<Gift />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
