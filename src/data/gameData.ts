import type { LucideIcon } from 'lucide-react'
import { Zap, ArrowRight, Wallet, UserMinus, Repeat, BrainCircuit, Lightbulb, GraduationCap, Activity, ZapOff, ShieldAlert, BatteryCharging, Mountain, Telescope, Compass, Search } from 'lucide-react'

export interface ChanceEvent {
    id: number
    title: string
    description: string
    icon: LucideIcon
    color: string
}

export const CHANCE_EVENTS: ChanceEvent[] = [
    {
        id: 1,
        title: "Vortex Jump",
        description: "Advance 10 tiles instantly.",
        icon: ArrowRight,
        color: "from-emerald-400 to-teal-600"
    },
    {
        id: 2,
        title: "Tax Season",
        description: "Give $100 to the player behind you.",
        icon: Wallet,
        color: "from-rose-400 to-red-600"
    },
    {
        id: 3,
        title: "Magnetic Pull",
        description: "Move the leader back 5 tiles.",
        icon: UserMinus,
        color: "from-blue-400 to-indigo-600"
    },
    {
        id: 4,
        title: "Quantum Swap",
        description: "Swap positions with a random player.",
        icon: Repeat,
        color: "from-purple-400 to-fuchsia-600"
    },
    {
        id: 5,
        title: "Overload",
        description: "Roll again! This roll is doubled.",
        icon: Zap,
        color: "from-amber-400 to-orange-600"
    },
    {
        id: 6,
        title: "Quiz Time!",
        description: "What is the capital of France? (Move 5 steps if correct)",
        icon: Zap,
        color: "from-indigo-400 to-blue-600"
    },
    {
        id: 7,
        title: "Trivia Challenge",
        description: "Which planet is known as the Red Planet? (Bonus if correct)",
        icon: Zap,
        color: "from-orange-400 to-red-600"
    },
    {
        id: 8,
        title: "Geography Bee",
        description: "Which is the largest ocean on Earth? (Move 7 steps if correct)",
        icon: Zap,
        color: "from-cyan-400 to-blue-600"
    },
    {
        id: 9,
        title: "Math Whiz",
        description: "What is 12 x 12? (Instant Boost if correct)",
        icon: Zap,
        color: "from-yellow-400 to-orange-600"
    }
]

export const BRAINIAC_EVENTS: ChanceEvent[] = [
    {
        id: 1,
        title: "Quantum Riddle",
        description: "What travels around the world but stays in a corner? (Move 8 steps if correct)",
        icon: BrainCircuit,
        color: "from-cyan-400 to-blue-600"
    },
    {
        id: 2,
        title: "History Buff",
        description: "In which year did the French Revolution start? (Instant $200 Reward)",
        icon: GraduationCap,
        color: "from-indigo-400 to-purple-600"
    },
    {
        id: 3,
        title: "Genius Spark",
        description: "What has keys but no locks, and space but no rooms? (Victory Lap if correct)",
        icon: Lightbulb,
        color: "from-blue-400 to-indigo-600"
    },
    {
        id: 4,
        title: "Science Lab",
        description: "What is the chemical symbol for Gold? (Advance to nearest Special Tile)",
        icon: BrainCircuit,
        color: "from-teal-400 to-emerald-600"
    }
]

export const VANTAGE_EVENTS: ChanceEvent[] = [
    {
        id: 1,
        title: "Peak View",
        description: "All players move forward 5 spaces!",
        icon: Mountain,
        color: "from-emerald-400 via-teal-500 to-cyan-600"
    },
    {
        id: 2,
        title: "Deep Focus",
        description: "The leader loses half their bank balance.",
        icon: Telescope,
        color: "from-blue-600 to-indigo-900"
    },
    {
        id: 3,
        title: "Clear Path",
        description: "Gain immunity to the next 2 negative events.",
        icon: Compass,
        color: "from-cyan-400 to-blue-500"
    },
    {
        id: 4,
        title: "Discovery",
        description: "Steal 50 coins from EVERY OTHER player.",
        icon: Search,
        color: "from-purple-500 to-indigo-700"
    }
]

export const GIFT_EVENTS: ChanceEvent[] = [
    {
        id: 1,
        title: "Golden Compass",
        description: "Teleport to any tile within 20 steps.",
        icon: ArrowRight,
        color: "from-yellow-300 to-amber-500"
    },
    {
        id: 2,
        title: "Shield of Aegis",
        description: "Protect yourself from the next 3 traps.",
        icon: ShieldAlert,
        color: "from-blue-300 to-indigo-500"
    },
    {
        id: 3,
        title: "Lucky Clover",
        description: "Your next 3 dice rolls are doubled.",
        icon: Activity,
        color: "from-emerald-300 to-green-600"
    },
    {
        id: 4,
        title: "Treasure Chest",
        description: "Receive a random amount of coins (50-200).",
        icon: Wallet,
        color: "from-amber-400 to-orange-600"
    }
]
