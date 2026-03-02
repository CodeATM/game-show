# Design Document: Migrate React + Vite to Next.js

## Overview

This design outlines the migration strategy for converting a React + Vite application to Next.js 14+ with App Router. The migration will preserve all existing functionality while fixing the routing issue and leveraging Next.js features for improved performance and developer experience.

The migration follows a systematic approach:
1. Set up Next.js project structure with App Router
2. Migrate routing from React Router to Next.js App Router
3. Convert page components to Next.js page structure
4. Adapt authentication and route protection for Next.js
5. Ensure state management works with client/server component boundaries
6. Preserve all styling, animations, and UI components
7. Test and verify all functionality

## Architecture

### High-Level Structure

```
app/
├── layout.tsx                 # Root layout with Navigation_Bar
├── page.tsx                   # Root redirect logic
├── register/
│   └── page.tsx              # Registration page
├── dice/
│   └── page.tsx              # Dice roller game
├── tiles/
│   └── page.tsx              # Board game
├── chance/
│   └── page.tsx              # Chance wheel game
├── brainiac/
│   └── page.tsx              # Quiz game
├── voltage/
│   └── page.tsx              # Voltage game
├── gift/
│   └── page.tsx              # Gift game
├── stats/
│   └── page.tsx              # Statistics page
├── admin/
│   └── page.tsx              # Admin panel
└── error.tsx                  # Error boundary

lib/
├── auth.ts                    # Authentication utilities
└── utils.ts                   # Utility functions

store/
└── gameStore.ts              # Zustand store (unchanged)

components/
├── ui/                        # shadcn/ui components
├── ErrorBoundary.tsx         # Client-side error boundary
└── Navigation.tsx            # Extracted navigation bar component

data/
└── gameData.ts               # Game events and data (unchanged)
```

### Component Hierarchy

```
RootLayout (Server Component)
├── Navigation (Client Component)
└── Page Content (Client Component)
    ├── Game Pages (Client Components)
    │   ├── DiceRoller
    │   ├── Tiles
    │   ├── Chance
    │   ├── Brainiac
    │   ├── Voltage
    │   ├── Gift
    │   ├── Stats
    │   └── Admin
    └── Register (Client Component)
```

### Server vs Client Components

**Server Components:**
- Root layout (app/layout.tsx) - handles metadata and HTML structure
- Middleware (if needed for auth checks)

**Client Components:**
- All game pages (require hooks, state, event handlers)
- Navigation bar (requires useState, useEffect, event listeners)
- UI components from shadcn/ui (use hooks and interactivity)
- Error boundaries (require componentDidCatch)

## Components and Interfaces

### 1. Root Layout Component

**File:** `app/layout.tsx`

**Purpose:** Provides the HTML structure, metadata, and wraps all pages with the Navigation component.

**Implementation:**
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Game Show',
  description: 'Interactive game show platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans">
          <main className="flex-1 relative">
            {children}
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  )
}
```

### 2. Navigation Component

**File:** `components/Navigation.tsx`

**Purpose:** Floating navigation bar with visibility toggle, extracted from router.tsx for reusability.

**Key Features:**
- Client component ('use client')
- Visibility state management (show on mount, hide after 3s, show on 'b' key)
- Active route highlighting using usePathname()
- Framer Motion animations
- Cross-tab synchronization listener

**Implementation Strategy:**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Dices, LayoutGrid, /* ... other icons */ } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastActivity, setLastActivity] = useState(() => Date.now())
  const pathname = usePathname()

  // Visibility logic on route change
  useEffect(() => {
    setIsVisible(true)
    setLastActivity(Date.now())
  }, [pathname])

  // Auto-hide after 3 seconds
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isVisible) {
      timer = setTimeout(() => setIsVisible(false), 3000)
    }
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
            {/* Navigation links using Next.js Link and pathname comparison */}
            <Link 
              href="/dice" 
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                pathname === '/dice' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Dices className="w-4 h-4" />
              Dice
            </Link>
            {/* ... other navigation links */}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 3. Root Page Component

**File:** `app/page.tsx`

**Purpose:** Handles root path redirection based on authentication status.

**Implementation:**
```typescript
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function HomePage() {
  if (isAuthenticated()) {
    redirect('/dice')
  } else {
    redirect('/register')
  }
}
```

**Note:** This uses server-side redirect. If auth check requires client-side access, we'll use a client component with useEffect and useRouter.

### 4. Authentication Utilities

**File:** `lib/auth.ts`

**Purpose:** Check authentication status by reading localStorage (unchanged from current implementation).

**Key Considerations:**
- Works in both server and client contexts
- In server context, will return false (no localStorage)
- In client context, reads from localStorage
- For server-side auth checks, we may need middleware or client-side checks

**Implementation:** Keep existing implementation, but add server-safe wrapper:

```typescript
export const getActivePlayerName = (): string | null => {
  if (typeof window === 'undefined') return null // Server-side
  
  try {
    const storage = localStorage.getItem('game-storage')
    if (!storage) return null
    const parsed = JSON.parse(storage)
    return parsed?.state?.activePlayerName || null
  } catch (error) {
    console.error('Failed to parse game-storage for auth check:', error)
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!getActivePlayerName()
}
```

### 5. Protected Route Pattern

**Approach:** Use client-side protection with useEffect and redirect.

**File:** `app/dice/page.tsx` (example)

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import DiceRollerContent from '@/components/pages/DiceRollerContent'

export default function DicePage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/register')
    }
  }, [router])

  if (!isAuthenticated()) {
    return null // or loading spinner
  }

  return <DiceRollerContent />
}
```

**Alternative Approach:** Create a ProtectedRoute wrapper component:

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/register')
    }
  }, [router])

  if (!isAuthenticated()) {
    return null
  }

  return <>{children}</>
}
```

Then use in pages:
```typescript
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import DiceRollerContent from '@/components/pages/DiceRollerContent'

export default function DicePage() {
  return (
    <ProtectedRoute>
      <DiceRollerContent />
    </ProtectedRoute>
  )
}
```

### 6. Page Component Migration

**Strategy:** Each page becomes a page.tsx file in its route directory.

**Example:** `app/dice/page.tsx`

```typescript
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
// Import the existing page component content
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
// ... rest of imports from original DiceRoller.tsx

export default function DicePage() {
  return (
    <ProtectedRoute>
      {/* Paste entire DiceRoller component JSX here */}
    </ProtectedRoute>
  )
}
```

**For each game page:**
1. Create app/[route]/page.tsx
2. Add 'use client' directive at top
3. Wrap content in ProtectedRoute (except /register)
4. Copy all logic and JSX from original page component
5. Ensure all imports use @/ alias

### 7. State Management

**File:** `store/gameStore.ts`

**Changes:** None required. Zustand works perfectly with Next.js client components.

**Key Points:**
- Store remains a client-side only module
- Persist middleware continues using localStorage
- All store hooks work in client components
- No server-side state access needed

### 8. Error Handling

**File:** `app/error.tsx`

**Purpose:** Catch and handle errors in the app directory.

```typescript
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

**File:** `components/ErrorBoundary.tsx`

Keep existing implementation for additional client-side error catching.

## Data Models

### Route Structure

```typescript
type Route = {
  path: string
  component: React.ComponentType
  protected: boolean
  metadata: {
    title: string
    description?: string
  }
}

const routes: Route[] = [
  { path: '/', component: HomePage, protected: false, metadata: { title: 'Game Show' } },
  { path: '/register', component: RegisterPage, protected: false, metadata: { title: 'Register' } },
  { path: '/dice', component: DicePage, protected: true, metadata: { title: 'Dice Roller' } },
  { path: '/tiles', component: TilesPage, protected: true, metadata: { title: 'Board Game' } },
  { path: '/chance', component: ChancePage, protected: true, metadata: { title: 'Chance' } },
  { path: '/brainiac', component: BrainiacPage, protected: true, metadata: { title: 'Brainiac' } },
  { path: '/voltage', component: VoltagePage, protected: true, metadata: { title: 'Voltage' } },
  { path: '/gift', component: GiftPage, protected: true, metadata: { title: 'Gift' } },
  { path: '/stats', component: StatsPage, protected: true, metadata: { title: 'Stats' } },
  { path: '/admin', component: AdminPage, protected: true, metadata: { title: 'Admin' } },
]
```

### Navigation Link Configuration

```typescript
type NavLink = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  activeColor: string
}

const navLinks: NavLink[] = [
  { href: '/dice', label: 'Dice', icon: Dices, activeColor: 'indigo' },
  { href: '/tiles', label: 'Board', icon: LayoutGrid, activeColor: 'indigo' },
  { href: '/chance', label: 'Chance', icon: Zap, activeColor: 'amber' },
  { href: '/brainiac', label: 'Brainiac', icon: BrainCircuit, activeColor: 'amber' },
  { href: '/voltage', label: 'Voltage', icon: Activity, activeColor: 'amber' },
  { href: '/gift', label: 'Gift', icon: GiftIcon, activeColor: 'amber' },
  { href: '/stats', label: 'Stats', icon: TrendingUp, activeColor: 'indigo' },
  { href: '/admin', label: 'Admin', icon: ShieldAlert, activeColor: 'rose' },
]
```

### Migration Checklist Data Model

```typescript
type MigrationTask = {
  id: string
  category: 'setup' | 'routing' | 'components' | 'styling' | 'testing'
  description: string
  completed: boolean
  dependencies: string[]
}

const migrationTasks: MigrationTask[] = [
  { id: 'setup-nextjs', category: 'setup', description: 'Initialize Next.js project', completed: false, dependencies: [] },
  { id: 'install-deps', category: 'setup', description: 'Install dependencies', completed: false, dependencies: ['setup-nextjs'] },
  { id: 'config-typescript', category: 'setup', description: 'Configure TypeScript', completed: false, dependencies: ['setup-nextjs'] },
  // ... more tasks
]
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following testable properties and eliminated redundancy:

**Redundancy Analysis:**
- Properties 2.2 and 13.1 both test that navigation updates the rendered component - these can be combined into one comprehensive property
- Properties 13.3 is subsumed by the combined navigation property
- Properties 5.2 and 5.3 both test localStorage persistence - these can be combined
- Properties 7.2 and 7.5 test navigation bar behavior - these are distinct (visibility vs highlighting)
- Property 2.6 tests navigation visibility toggle which is distinct from 7.2

**Unique Properties Identified:**
1. Navigation updates page content immediately (combines 2.2, 13.1, 13.3)
2. Authentication-based redirection for protected routes (3.2)
3. Navigation bar visibility on route changes (7.2)
4. Navigation bar highlights active route (7.5)
5. State persistence to localStorage (combines 5.2, 5.3)
6. Cross-tab state synchronization (6.2)
7. Dice rolling produces valid results (11.2)
8. Player movement updates position correctly (11.3)
9. Tile types trigger correct events (11.4)
10. Error recovery preserves game state (12.4)
11. Page metadata matches expected titles (14.2)

### Properties

Property 1: Navigation renders correct page component
*For any* valid route in the application, when a user navigates to that route, the App Router should unmount the previous page component and mount the corresponding page component for the new route immediately without requiring a page reload.
**Validates: Requirements 2.2, 13.1, 13.3**

Property 2: Protected routes redirect unauthenticated users
*For any* protected route (dice, tiles, chance, brainiac, voltage, gift, stats, admin), when an unauthenticated user attempts to access it, the App Router should redirect to the /register page.
**Validates: Requirements 3.2**

Property 3: Navigation bar shows on route changes
*For any* route change in the application, the Navigation Bar should become visible immediately after the navigation occurs.
**Validates: Requirements 7.2**

Property 4: Active route is highlighted in navigation
*For any* route in the navigation bar, when that route is the current active route, the corresponding navigation link should display with active styling (indigo or amber background with shadow).
**Validates: Requirements 7.5**

Property 5: State changes persist to localStorage
*For any* state change in the Game Store, the updated state should be immediately persisted to localStorage under the key 'game-storage', and reading from localStorage should return the updated state.
**Validates: Requirements 5.2, 5.3**

Property 6: Storage events trigger state rehydration
*For any* storage event on the 'game-storage' key, the Game Store should rehydrate its state from localStorage, ensuring the in-memory state matches the localStorage state.
**Validates: Requirements 6.2**

Property 7: Dice rolls produce valid results
*For any* dice roll action, the result should be an integer between 1 and 6 (inclusive), and the player's position should increase by that amount (capped at 100).
**Validates: Requirements 11.2**

Property 8: Player movement updates position correctly
*For any* player and any valid dice roll value, calling movePlayerWithDice should update the player's position by adding the roll value to their current position (with a maximum of 100 and minimum of 0).
**Validates: Requirements 11.3**

Property 9: Tile types trigger corresponding events
*For any* player landing on a tile, if the tile type is 'chance', 'quiz', 'ladder', or 'snake', the corresponding event (triggerChance, triggerBrainiac, triggerVoltage, or triggerGift) should be triggered automatically.
**Validates: Requirements 11.4**

Property 10: Error recovery preserves game state
*For any* error that occurs and is caught by an error boundary, after the error is handled, the Game Store state should remain unchanged from its state before the error occurred.
**Validates: Requirements 12.4**

Property 11: Page metadata matches route
*For any* page route, the document title should match the expected title for that page (e.g., /dice should have title "Dice Roller", /stats should have title "Stats").
**Validates: Requirements 14.2**

Property 12: Navigation bar visibility toggle behavior
*For any* state where the navigation bar is visible, after 3 seconds of inactivity (no route changes, no 'b' key presses), the navigation bar should automatically hide.
**Validates: Requirements 2.6**

Property 13: Authentication check reflects localStorage state
*For any* localStorage state, if 'game-storage' contains a non-empty activePlayerName, isAuthenticated() should return true; otherwise, it should return false.
**Validates: Requirements 3.1**

## Error Handling

### Client-Side Errors

**Error Boundary Component:**
- Catches React component errors during rendering
- Displays fallback UI with error message
- Provides "Try again" button to reset error state
- Logs errors to console for debugging

**Implementation:**
```typescript
// components/ErrorBoundary.tsx
'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-slate-400 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Next.js Error Boundaries

**app/error.tsx:**
- Catches errors in route segments
- Automatically wraps route segments
- Provides reset functionality
- Works with both server and client errors

**app/global-error.tsx (optional):**
- Catches errors in root layout
- Replaces entire root layout on error
- Used for catastrophic errors

### Error Scenarios

1. **Authentication Errors:**
   - Missing or corrupted localStorage data
   - Handle gracefully by treating as unauthenticated
   - Redirect to /register

2. **State Hydration Errors:**
   - Corrupted game-storage in localStorage
   - Catch JSON parse errors
   - Reset to default state if unrecoverable

3. **Navigation Errors:**
   - Invalid routes handled by Next.js 404
   - Redirect to home page for unknown routes

4. **Component Rendering Errors:**
   - Caught by ErrorBoundary
   - Display error UI
   - Allow retry without losing game state

5. **Network Errors (if applicable):**
   - Handle fetch failures gracefully
   - Show user-friendly error messages
   - Provide retry mechanisms

## Testing Strategy

### Dual Testing Approach

The migration will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**
- Verify specific examples and edge cases
- Test integration points between components
- Test error conditions and boundary cases
- Focus on concrete scenarios

**Property-Based Tests:**
- Verify universal properties across all inputs
- Test with randomized data (routes, player states, dice rolls)
- Ensure properties hold for all valid inputs
- Minimum 100 iterations per property test

### Property-Based Testing Configuration

**Library:** fast-check (for TypeScript/JavaScript)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: migrate-to-nextjs, Property {number}: {property_text}**
- Tests run in CI/CD pipeline
- Failures include counterexamples for debugging

### Test Categories

#### 1. Routing Tests

**Unit Tests:**
- Test that /register page renders for unauthenticated users
- Test that / redirects to /dice for authenticated users
- Test that / redirects to /register for unauthenticated users
- Test that 404 page renders for invalid routes

**Property Tests:**
- Property 1: Navigation renders correct page component
- Property 2: Protected routes redirect unauthenticated users
- Property 3: Navigation bar shows on route changes
- Property 4: Active route is highlighted in navigation

#### 2. Authentication Tests

**Unit Tests:**
- Test isAuthenticated() returns false when localStorage is empty
- Test isAuthenticated() returns true when activePlayerName exists
- Test getActivePlayerName() handles corrupted JSON gracefully

**Property Tests:**
- Property 13: Authentication check reflects localStorage state

#### 3. State Management Tests

**Unit Tests:**
- Test that initial state loads correctly
- Test that resetGame() restores default state
- Test that specific actions (setLastRoll, incrementRollCount) work correctly

**Property Tests:**
- Property 5: State changes persist to localStorage
- Property 6: Storage events trigger state rehydration
- Property 7: Dice rolls produce valid results
- Property 8: Player movement updates position correctly
- Property 9: Tile types trigger corresponding events

#### 4. UI Component Tests

**Unit Tests:**
- Test that Navigation component renders all links
- Test that 'b' key press shows navigation
- Test that navigation hides after 3 seconds
- Test that error boundary catches and displays errors

**Property Tests:**
- Property 12: Navigation bar visibility toggle behavior

#### 5. Error Handling Tests

**Unit Tests:**
- Test that ErrorBoundary catches component errors
- Test that error.tsx displays error UI
- Test that reset button clears error state

**Property Tests:**
- Property 10: Error recovery preserves game state

#### 6. Metadata Tests

**Unit Tests:**
- Test that root layout has default metadata
- Test that each page has correct title

**Property Tests:**
- Property 11: Page metadata matches route

### Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **fast-check**: Property-based testing library
- **@testing-library/user-event**: User interaction simulation
- **MSW (Mock Service Worker)**: API mocking if needed

### Test Execution

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run only property tests
npm test -- --testNamePattern="Property"

# Run only unit tests
npm test -- --testNamePattern="Unit"
```

### Continuous Integration

- All tests run on every commit
- Property tests run with 100 iterations in CI
- Coverage threshold: 80% for critical paths
- Failed property tests include counterexamples in CI logs

### Manual Testing Checklist

After automated tests pass, manually verify:
- [ ] All pages load correctly
- [ ] Navigation works without page reload
- [ ] Authentication redirects work
- [ ] Game state persists across page refreshes
- [ ] Cross-tab synchronization works
- [ ] All game mechanics function correctly
- [ ] Styling matches original application
- [ ] Animations work smoothly
- [ ] Error boundaries catch and display errors
- [ ] Build process completes successfully
- [ ] Production build runs correctly
