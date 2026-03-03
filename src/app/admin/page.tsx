'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    BrainCircuit,
    Gift,
    AlertCircle,
    RotateCcw,
    Play,
    ShieldAlert,
    Activity,
    Lock,
    Users,
    Plus,
    Minus,
    ToggleLeft,
    ToggleRight,
    Sun,
    Moon,
    Layers,
    Settings2,
    Keyboard,
    Music,
    X
} from 'lucide-react'
import { useGameStore, type TileConfig } from '@/store/gameStore'
import { useInputController } from '@/hooks/useInputController'
import { AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface AdminControlProps {
    title: string
    description: string
    status: string
    icon: React.ElementType
    color: string
    onTrigger: () => void
    onReset: () => void
    tileNumbers: number[]
    onUpdateLocations: (nums: number[]) => void
    hostOverride: boolean
    label: string
    onUpdateLabel: (val: string) => void
    boardConfig: TileConfig[]
    onUpdateTileLabel: (id: number, val: string) => void
}

function AdminControl({ title, description, status, icon: Icon, color, onTrigger, onReset, tileNumbers, onUpdateLocations, hostOverride, label, onUpdateLabel, boardConfig, onUpdateTileLabel }: AdminControlProps) {
    const [inputValue, setInputValue] = React.useState(tileNumbers.join(', '))

    React.useEffect(() => {
        setInputValue(tileNumbers.join(', '))
    }, [tileNumbers])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const parsed = inputValue.split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n) && n >= 1 && n <= 100);
            onUpdateLocations(parsed)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-6 rounded-[2rem] flex flex-col gap-6"
        >
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-${color}-500/20 flex items-center justify-center border border-${color}-500/30`}>
                    <Icon className={`text-${color}-400 w-6 h-6`} />
                </div>
                <div className="flex bg-white/5 rounded-full px-3 py-1 border border-white/5 items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'idle' ? 'bg-slate-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{status}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="space-y-1.5">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Tile Locations</span>
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-10 bg-white/5 border-white/5 text-white font-bold text-xs placeholder:text-slate-700"
                        placeholder="e.g. 5, 12, 45..."
                    />
                </div>

                <div className="space-y-1.5">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Board Label</span>
                    <Input
                        value={label}
                        onChange={(e) => onUpdateLabel(e.target.value)}
                        className="h-10 bg-white/5 border-white/5 text-white font-bold text-xs placeholder:text-slate-700"
                        placeholder="e.g. Boost, Danger..."
                    />
                </div>

                <div className="space-y-1.5 flex-1 min-h-0">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Individual Tile Overrides</span>
                    <div className="h-[120px] w-full rounded-xl border border-white/5 bg-white/2 p-2 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                            {tileNumbers.map(num => {
                                const tile = boardConfig.find(t => t.id === num - 1);
                                return (
                                    <div key={num} className="flex items-center gap-2 bg-white/5 p-1.5 rounded-lg border border-white/5">
                                        <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                            <span className="text-[9px] font-black text-indigo-400">{num}</span>
                                        </div>
                                        <Input
                                            value={tile?.label || ''}
                                            onChange={(e) => onUpdateTileLabel(num - 1, e.target.value)}
                                            className="h-7 bg-transparent border-none text-[10px] font-bold text-white placeholder:text-slate-700 p-0 px-1 focus-visible:ring-0"
                                            placeholder="Label..."
                                        />
                                    </div>
                                );
                            })}
                            {tileNumbers.length === 0 && (
                                <div className="h-full flex items-center justify-center py-4">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">No tiles assigned</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
                <Button
                    onClick={onTrigger}
                    disabled={(status === 'idle' && !hostOverride) || (status === 'revealed' && !hostOverride)}
                    className="h-12 bg-white/10 hover:bg-white/20 border-white/5 text-white font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <Play className="w-3.5 h-3.5" />
                    {status === 'idle' ? 'Trigger' : 'Reveal'}
                </Button>
                <Button
                    onClick={onReset}
                    disabled={status === 'idle' && !hostOverride}
                    variant="ghost"
                    className="h-12 border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-400/5 font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                </Button>
            </div>
        </motion.div>
    )
}

interface PlayerCardProps {
    player: {
        id: number
        name: string
        avatarSeed: string
        position: number
        color: string
        coins: number
        isActive: boolean
    }
    updatePlayerName: (id: number, name: string) => void
    updatePlayerPosition: (id: number, pos: number) => void
    movePlayerWithDice: (id: number, roll: number) => void
    hostOverride: boolean
    isProcessingDice: boolean
}

function PlayerCard({ player, updatePlayerName, updatePlayerPosition, movePlayerWithDice, hostOverride, isProcessingDice }: PlayerCardProps) {
    const [moveValue, setMoveValue] = React.useState('')

    const handleMove = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && moveValue.trim() !== '') {
            const value = parseInt(moveValue)
            if (!isNaN(value)) {
                updatePlayerPosition(player.id, player.position + value)
                setMoveValue('')
            }
        }
    }

    return (
        <div className="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${player.color}-500 shadow-lg`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Player 0{player.id}</span>
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-white/10 text-slate-400">
                    Pos: {player.position}
                </Badge>
            </div>

            <div className="flex flex-col gap-3">
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Display Name</span>
                    <Input
                        value={player.name}
                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                        className="h-11 bg-white/5 border-white/5 text-white font-bold placeholder:text-slate-600 focus:ring-indigo-500/20"
                        placeholder="Enter Name..."
                    />
                </div>

                <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Move (± Val + Enter)</span>
                    <div className="flex gap-2">
                        <Input
                            value={moveValue}
                            onChange={(e) => setMoveValue(e.target.value)}
                            onKeyDown={handleMove}
                            className="h-11 bg-white/5 border-white/5 text-white font-black placeholder:text-slate-700 text-center"
                            placeholder="±"
                        />
                        <div className="flex items-center bg-white/5 rounded-xl border border-white/5 p-1 gap-1 flex-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => updatePlayerPosition(player.id, player.position - 1)}
                                className="flex-1 h-9 rounded-lg hover:bg-white/10 text-slate-400"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => updatePlayerPosition(player.id, player.position + 1)}
                                className="flex-1 h-9 rounded-lg hover:bg-white/10 text-slate-400"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Button
                        key={num}
                        size="sm"
                        variant="ghost"
                        onMouseDown={() => movePlayerWithDice(player.id, num)}
                        disabled={isProcessingDice || (!hostOverride && !player.isActive)}
                        className={`flex-1 h-8 text-[9px] font-black uppercase tracking-tighter bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-indigo-500/20 disabled:opacity-20 disabled:cursor-not-allowed`}
                    >
                        {num}
                    </Button>
                ))}
            </div>
        </div>
    )
}

function AdminContent() {
    useInputController()
    const [showMapping, setShowMapping] = React.useState(false)

    const {
        players,
        updatePlayerName,
        updatePlayerPosition,
        movePlayerWithDice,
        isProcessingDice,
        hostOverride,
        toggleHostOverride,
        boardConfig,
        setEventLocations,
        eventLabels,
        setEventLabel,
        boardTheme,
        setBoardTheme,
        chanceStatus, triggerChance, resetChance,
        brainiacStatus, triggerBrainiac, resetBrainiac,
        voltageStatus, triggerVoltage, resetVoltage,
        giftStatus, triggerGift, resetGift,
        resetGame,
        mappings,
        updateMapping
    } = useGameStore()

    const [showAdvanced, setShowAdvanced] = React.useState(false)
    const [recording, setRecording] = React.useState<{ actionId: string, type: 'keyboard' | 'midi' } | null>(null)

    React.useEffect(() => {
        if (!recording) return

        if (recording.type === 'keyboard') {
            const handleKeyDown = (e: KeyboardEvent) => {
                e.preventDefault()
                let key = e.key.toLowerCase()
                if (key === ' ') key = 'space'
                updateMapping(recording.actionId, { type: 'keyboard', value: key })
                setRecording(null) // Stop recording immediately
            }
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        } else if (recording.type === 'midi') {
            const handleMidi = (e: Event) => {
                const message = e as MIDIMessageEvent
                if (!message.data) return
                const [command, note, velocity] = message.data
                const isNoteOn = command >= 144 && command <= 159
                if (isNoteOn && velocity > 0) {
                    updateMapping(recording.actionId, { type: 'midi', value: note })
                    setRecording(null) // Stop recording immediately
                }
            }

            let cleanup: (() => void) | null = null;
            if (navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess().then(access => {
                    const inputs = access.inputs.values()
                    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                        input.value.addEventListener('midimessage', handleMidi)
                    }
                    cleanup = () => {
                        const inputsToClean = access.inputs.values()
                        for (let input = inputsToClean.next(); input && !input.done; input = inputsToClean.next()) {
                            input.value.removeEventListener('midimessage', handleMidi)
                        }
                    }
                })
            }
            return () => { if (cleanup) cleanup() }
        }
    }, [recording, updateMapping])

    const ACTIONS = [
        { id: 'roll_1', label: 'Roll 1 (Active Player)' },
        { id: 'roll_2', label: 'Roll 2 (Active Player)' },
        { id: 'roll_3', label: 'Roll 3 (Active Player)' },
        { id: 'roll_4', label: 'Roll 4 (Active Player)' },
        { id: 'roll_5', label: 'Roll 5 (Active Player)' },
        { id: 'roll_6', label: 'Roll 6 (Active Player)' },
        { id: 'trigger_chance', label: 'Trigger Chance' },
        { id: 'reset_chance', label: 'Reset Chance' },
        { id: 'trigger_quiz', label: 'Trigger Quiz' },
        { id: 'reset_quiz', label: 'Reset Quiz' },
        { id: 'trigger_ladder', label: 'Trigger Voltage' },
        { id: 'reset_ladder', label: 'Reset Voltage' },
        { id: 'trigger_snake', label: 'Trigger Gift' },
        { id: 'reset_snake', label: 'Reset Gift' },
        { id: 'hard_reset', label: 'Hard Reset Game' },
    ]

    return (
        <div className="min-h-screen w-full relative flex flex-col bg-slate-950 font-sans overflow-x-hidden">

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-10">

                {/* Admin Header */}
                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="text-rose-500 w-8 h-8" />
                            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">Admin Panel</h1>
                        </div>
                        <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px]">Real-time Event Management & State Control</p>
                    </div>

                    <Button
                        onClick={resetGame}
                        variant="destructive"
                        className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-2xl shadow-rose-500/20"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Hard Reset Game
                    </Button>
                </div>

                {/* Participant Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <Users className="text-indigo-400 w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Participant Roster</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Player Positioning & Identity Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setBoardTheme('light')}
                                    className={`h-8 px-3 rounded-lg gap-2 transition-all ${boardTheme === 'light' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    <Sun className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Light</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setBoardTheme('dark')}
                                    className={`h-8 px-3 rounded-lg gap-2 transition-all ${boardTheme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    <Moon className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setBoardTheme('groups')}
                                    className={`h-8 px-3 rounded-lg gap-2 transition-all ${boardTheme === 'groups' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Zones</span>
                                </Button>
                            </div>

                            <div className="h-8 w-px bg-white/5" />

                            <Button
                                onClick={toggleHostOverride}
                                variant="outline"
                                className={`h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 border-white/10 transition-all ${hostOverride ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-white/5 text-slate-500'}`}
                            >
                                {hostOverride ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                Host Override: {hostOverride ? 'ON' : 'OFF'}
                            </Button>
                            <div className="flex bg-white/5 rounded-full px-4 py-2 border border-white/5 items-center gap-3">
                                <Activity className="text-indigo-400 w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Live</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {players.map((player) => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                updatePlayerName={updatePlayerName}
                                updatePlayerPosition={updatePlayerPosition}
                                movePlayerWithDice={movePlayerWithDice}
                                hostOverride={hostOverride}
                                isProcessingDice={isProcessingDice}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Control Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <AdminControl
                        title="Chance Event"
                        description="Trigger a random mystery outcome."
                        status={chanceStatus}
                        icon={AlertCircle}
                        color="amber"
                        onTrigger={triggerChance}
                        onReset={resetChance}
                        tileNumbers={boardConfig.filter(t => t.type === 'chance').map(t => t.id + 1)}
                        onUpdateLocations={(nums) => setEventLocations('chance', nums)}
                        hostOverride={hostOverride}
                        label={eventLabels.chance}
                        onUpdateLabel={(val) => setEventLabel('chance', val)}
                        boardConfig={boardConfig}
                        onUpdateTileLabel={(id, val) => useGameStore.getState().setTileConfig(id, { label: val })}
                    />
                    <AdminControl
                        title="Brainiac Quiz"
                        description="Launch a mental challenge."
                        status={brainiacStatus}
                        icon={BrainCircuit}
                        color="indigo"
                        onTrigger={triggerBrainiac}
                        onReset={resetBrainiac}
                        tileNumbers={boardConfig.filter(t => t.type === 'quiz').map(t => t.id + 1)}
                        onUpdateLocations={(nums) => setEventLocations('quiz', nums)}
                        hostOverride={hostOverride}
                        label={eventLabels.quiz}
                        onUpdateLabel={(val) => setEventLabel('quiz', val)}
                        boardConfig={boardConfig}
                        onUpdateTileLabel={(id, val) => useGameStore.getState().setTileConfig(id, { label: val })}
                    />
                    <AdminControl
                        title="Voltage Surge"
                        description="Execute a global power surge."
                        status={voltageStatus}
                        icon={Activity}
                        color="blue"
                        onTrigger={triggerVoltage}
                        onReset={resetVoltage}
                        tileNumbers={boardConfig.filter(t => t.type === 'ladder').map(t => t.id + 1)}
                        onUpdateLocations={(nums) => setEventLocations('ladder', nums)}
                        hostOverride={hostOverride}
                        label={eventLabels.ladder}
                        onUpdateLabel={(val) => setEventLabel('ladder', val)}
                        boardConfig={boardConfig}
                        onUpdateTileLabel={(id, val) => useGameStore.getState().setTileConfig(id, { label: val })}
                    />
                    <AdminControl
                        title="Mystery Gift"
                        description="Unbox a premium tile reward."
                        status={giftStatus}
                        icon={Gift}
                        color="rose"
                        onTrigger={triggerGift}
                        onReset={resetGift}
                        tileNumbers={boardConfig.filter(t => t.type === 'snake').map(t => t.id + 1)}
                        onUpdateLocations={(nums) => setEventLocations('snake', nums)}
                        hostOverride={hostOverride}
                        label={eventLabels.snake}
                        onUpdateLabel={(val) => setEventLabel('snake', val)}
                        boardConfig={boardConfig}
                        onUpdateTileLabel={(id, val) => useGameStore.getState().setTileConfig(id, { label: val })}
                    />
                </div>

                {/* Advanced Settings Toggle */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Settings2 className="w-5 h-5 text-slate-400" />
                        <span className="text-white font-bold tracking-widest uppercase text-sm">
                            {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
                        </span>
                    </button>
                </div>

                {/* Advanced Settings Content */}
                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-6"
                        >
                            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8">
                                <h3 className="text-xl text-white font-black italic uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Command Mapping</h3>
                                {/* Nested toggle for mapping list */}
                                <button
                                    onClick={() => setShowMapping(prev => !prev)}
                                    className="mb-3 px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm font-bold uppercase tracking-wider text-white hover:bg-slate-700/70 transition-colors"
                                >
                                    {showMapping ? 'Hide Mappings' : 'Show Mappings'}
                                </button>
                                {showMapping && (
                                    <div className="space-y-3">
                                        {ACTIONS.map(action => (
                                            <div key={action.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl cursor-default transition-colors hover:border-white/10">
                                                <div className="text-white font-bold uppercase tracking-wider text-sm flex-1">
                                                    {action.label}
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                    <button
                                                        onClick={() => setRecording({ actionId: action.id, type: 'keyboard' })}
                                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors text-xs font-bold uppercase tracking-widest w-full sm:w-auto ${recording?.actionId === action.id && recording?.type === 'keyboard' ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'}`}
                                                    >
                                                        <Keyboard className="w-4 h-4 shrink-0" />
                                                        {recording?.actionId === action.id && recording?.type === 'keyboard' ? "Press Key..." : "Bind Key"}
                                                    </button>
                                                    <button
                                                        onClick={() => setRecording({ actionId: action.id, type: 'midi' })}
                                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors text-xs font-bold uppercase tracking-widest w-full sm:w-auto ${recording?.actionId === action.id && recording?.type === 'midi' ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'}`}
                                                    >
                                                        <Music className="w-4 h-4 shrink-0" />
                                                        {recording?.actionId === action.id && recording?.type === 'midi' ? "Hit Pad..." : "Bind MIDI"}
                                                    </button>

                                                    {/* Current Mapping Display */}
                                                    <div className="flex items-center gap-2 sm:min-w-[120px] justify-end mt-2 sm:mt-0">
                                                        {mappings[action.id] ? (
                                                            <span className="px-3 py-1 bg-white/10 rounded-md text-slate-300 text-xs font-mono uppercase">
                                                                {mappings[action.id]?.type}: {mappings[action.id]?.value}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 text-xs italic uppercase tracking-wider">Unmapped</span>
                                                        )}
                                                        {mappings[action.id] && (
                                                            <button onClick={() => updateMapping(action.id, null)} className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition-colors">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Info Section */}
                <div className="mt-auto bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5">
                            <Lock className="text-slate-500 w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-black italic uppercase tracking-widest text-sm">System Authority Level 4</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Direct state mutation enabled. Use controls with caution.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500"
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Link</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default function AdminPage() {
    return (
        <AdminContent />
    )
}
