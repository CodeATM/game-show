import { useCallback } from 'react'
import Dice from 'modern-react-dice-roll'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'

// Languid,// Premium motion constants
const springConfig = { type: "spring", damping: 30, stiffness: 80, mass: 1.2 } as const;
const smoothTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const;

function PlayerStatsBar() {
  const { players } = useGameStore()

  return (
    <div className="absolute top-8 right-8 z-50 flex flex-col gap-3">
      {players.map((player, i) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...smoothTransition, delay: i * 0.1 }}
          className={`flex items-center gap-4 p-3 px-5 rounded-2xl border backdrop-blur-xl transition-all duration-500 min-w-[200px] ${player.isActive
            ? 'bg-indigo-500/20 border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.2)]'
            : 'bg-slate-900/40 border-white/5 opacity-60'
            }`}
        >
          {/* DiceBear Avatar Generator */}
          <div className="relative shrink-0">
            <div className={`w-10 h-10 rounded-xl overflow-hidden border ${player.isActive ? 'border-indigo-400 bg-indigo-500/50' : 'border-white/10 bg-slate-800'}`}>
              <img
                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${player.avatarSeed}&backgroundColor=transparent`}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
            {player.isActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[10px] font-black uppercase tracking-widest ${player.isActive ? 'text-white' : 'text-slate-500'}`}>
                {player.name}
              </span>
              <span className={`text-[11px] font-bold ${player.isActive ? 'text-indigo-300' : 'text-slate-600'}`}>
                {player.coins} pts
              </span>
            </div>

            <div className="flex gap-4 border-t border-white/5 pt-1.5 mt-1">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Rolls</span>
                <span className={`text-xs font-black ${player.isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{player.totalRolls}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Luck</span>
                <span className={`text-xs font-black ${player.isActive ? 'text-indigo-100' : 'text-slate-400'}`}>{player.luckScore}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function DiceRoller() {
  const {
    lastRoll,
    rollCount,
    isRolling,
    movePlayerWithDice,
    setIsRolling,
    resetGame
  } = useGameStore()

  const handleRoll = useCallback((value: number) => {
    const activePlayer = useGameStore.getState().players.find(p => p.isActive)
    if (activePlayer) {
      movePlayerWithDice(activePlayer.id, value)
    }
    setIsRolling(false)
  }, [movePlayerWithDice, setIsRolling])

  const startRolling = () => {
    if (!isRolling) {
      setIsRolling(true)
    }
  }

  return (
    <div className="h-screen w-full relative flex flex-col bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)] bg-slate-950 overflow-hidden selection:bg-indigo-500/30">

      {/* Mini Player Stats Bar - Top Right */}
      <PlayerStatsBar />

      {/* 
        Full Screen Overlay Layer 
        Positioned absolutely to never push other content.
      */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isRolling && lastRoll && rollCount > 0 && (
            <motion.div
              key="result-overlay"
              initial={{ opacity: 0, scale: 0.4, filter: "blur(30px)" }}
              animate={{ opacity: 0.08, scale: 2.2, filter: "blur(10px)" }}
              transition={{ ...smoothTransition, duration: 1.5 }}
              className="select-none"
            >
              <span className="text-[40rem] font-black text-white leading-none">
                {lastRoll}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main UI Layer */}
      <div className="relative z-10 flex-1 flex flex-col w-full h-full pt-16">

        {/* Dice Area - Perfectly Centered on X and Y */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="relative cursor-pointer outline-none"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRolling}
          >
            {/* Glow beneath die */}
            <motion.div
              className="absolute inset-0 -z-10 bg-indigo-500/25 blur-[140px] rounded-full"
              animate={{
                scale: isRolling ? [1, 1.4, 1] : 1,
                opacity: isRolling ? [0.4, 0.8, 0.4] : 0.6
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="p-8 select-none">
              <Dice
                onRoll={handleRoll}
                size={340}
                rollingTime={2500}
                defaultValue={(lastRoll || 1) as 1 | 2 | 3 | 4 | 5 | 6}
                triggers={['click', 'r', 'spacebar']}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Control Bar - Fixed Layout to eliminate shifts */}
        <div className="h-80 shrink-0 w-full relative">

          {/* Result Number Layer - Centered in Top Half of footer */}
          <div className="absolute inset-x-0 top-0 h-40 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isRolling && lastRoll && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={springConfig}
                  className="flex flex-col items-center"
                >
                  <motion.span
                    className="text-[10rem] font-black text-white leading-none tracking-tighter"
                    animate={{
                      textShadow: [
                        "0 0 50px rgba(99,102,241,0.4)",
                        "0 0 100px rgba(99,102,241,0.6)",
                        "0 0 50px rgba(99,102,241,0.4)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {lastRoll}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Combined Controls Row - Anchored to Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothTransition}
            className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-6"
          >
            {/* Reset beside History/Numbers Area */}
            <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl p-2.5 rounded-2xl border border-white/5 shadow-2xl">

              {/* History Bar */}
              <div className="flex gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <motion.div
                    key={num}
                    animate={{
                      scale: lastRoll === num ? 1.15 : 1,
                      backgroundColor: lastRoll === num ? "rgba(99, 102, 241, 0.25)" : "transparent",
                      color: lastRoll === num ? "white" : "rgb(100, 116, 139)",
                      borderColor: lastRoll === num ? "rgba(99, 102, 241, 0.5)" : "transparent",
                    }}
                    transition={springConfig}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-black transition-all ${lastRoll === num ? 'shadow-[0_0_30px_rgba(99,102,241,0.4)]' : ''
                      }`}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>

              <div className="h-6 w-px bg-slate-800/50 mx-1" />

              {/* Reset Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetGame}
                  className="h-11 px-6 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all font-bold tracking-widest uppercase text-[10px] gap-2.5 border border-transparent hover:border-red-400/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </motion.div>
            </div>

            {/* Sub-label for roll count */}
            <Badge variant="outline" className="bg-white/5 border-none text-slate-500 px-4 py-1 text-[9px] uppercase tracking-[0.4em] font-bold">
              Session Rolls: {rollCount}
            </Badge>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
