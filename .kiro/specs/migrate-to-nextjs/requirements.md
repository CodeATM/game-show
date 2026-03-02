# Requirements Document: Migrate React + Vite to Next.js

## Introduction

This document specifies the requirements for migrating a React + Vite application to Next.js 14+ with App Router. The current application is a game show platform with multiple game pages, authentication, state management using Zustand, and UI components from shadcn/ui. The migration must preserve all existing functionality while fixing a routing issue where navigation changes the URL but not the page content until reload.

## Glossary

- **App_Router**: Next.js 14+ routing system using the app directory structure
- **Client_Component**: React component that runs in the browser and uses client-side features (hooks, event handlers)
- **Server_Component**: React component that runs on the server by default in Next.js App Router
- **Game_Store**: Zustand store managing game state, player data, and event states
- **Auth_System**: Authentication mechanism checking for registered player name in localStorage
- **Navigation_Bar**: Floating navigation component with links to all game pages
- **Game_Page**: Individual page component for each game (DiceRoller, Tiles, Chance, Brainiac, Voltage, Gift, Stats, Admin)
- **Protected_Route**: Route that requires authentication to access
- **Layout_Component**: Shared layout wrapper containing navigation and page structure
- **State_Persistence**: Zustand persist middleware storing game state in localStorage
- **Cross_Tab_Sync**: Mechanism synchronizing game state across browser tabs

## Requirements

### Requirement 1: Next.js Project Setup

**User Story:** As a developer, I want to set up a Next.js 14+ project with App Router, so that I can migrate the existing React application to the new framework.

#### Acceptance Criteria

1. THE Migration_System SHALL create a Next.js 14+ project with App Router enabled
2. THE Migration_System SHALL configure TypeScript with the same compiler options as the current project
3. THE Migration_System SHALL preserve the path alias configuration (@/* mapping to src/*)
4. THE Migration_System SHALL install all existing dependencies (React 19, Zustand, Tailwind CSS, Framer Motion, shadcn/ui components, Lucide icons)
5. THE Migration_System SHALL configure Tailwind CSS v4 with the Vite plugin
6. THE Migration_System SHALL preserve the React Compiler babel plugin configuration

### Requirement 2: Routing Migration

**User Story:** As a user, I want navigation to work correctly, so that clicking links changes both the URL and the displayed page content without requiring a reload.

#### Acceptance Criteria

1. THE App_Router SHALL define routes for all game pages (/, /register, /dice, /tiles, /chance, /brainiac, /voltage, /gift, /stats, /admin)
2. WHEN a user navigates to a route, THE App_Router SHALL render the corresponding page component immediately
3. THE App_Router SHALL implement the root layout with the Navigation_Bar component
4. THE App_Router SHALL replace React Router's Navigate component with Next.js redirect functionality
5. THE App_Router SHALL replace React Router's NavLink component with Next.js Link component
6. THE App_Router SHALL preserve the navigation bar's visibility toggle behavior (show on route change, hide after 3 seconds, show on 'b' key press)

### Requirement 3: Authentication and Route Protection

**User Story:** As a user, I want protected routes to require authentication, so that only registered players can access game pages.

#### Acceptance Criteria

1. THE Auth_System SHALL check for activePlayerName in localStorage to determine authentication status
2. WHEN an unauthenticated user accesses a protected route, THE App_Router SHALL redirect to /register
3. WHEN an authenticated user accesses the root path (/), THE App_Router SHALL redirect to /dice
4. WHEN an unauthenticated user accesses the root path (/), THE App_Router SHALL redirect to /register
5. THE Auth_System SHALL remain independent of React hooks to work in both server and client contexts

### Requirement 4: Page Component Migration

**User Story:** As a developer, I want all page components migrated to Next.js structure, so that they work correctly with App Router.

#### Acceptance Criteria

1. THE Migration_System SHALL convert all page components to Next.js page.tsx files in the app directory
2. THE Migration_System SHALL mark all game page components as Client Components using 'use client' directive
3. THE Migration_System SHALL preserve all existing game logic, UI, and interactions in each page component
4. THE Migration_System SHALL maintain the same component structure for DiceRoller, Tiles, Chance, Brainiac, Voltage, Gift, Stats, Admin, and Register pages
5. THE Migration_System SHALL preserve all imports and dependencies for each page component

### Requirement 5: State Management Migration

**User Story:** As a user, I want my game state to persist across page navigation and browser sessions, so that my progress is not lost.

#### Acceptance Criteria

1. THE Game_Store SHALL continue using Zustand with persist middleware
2. THE Game_Store SHALL store state in localStorage with the key 'game-storage'
3. WHEN state changes occur, THE Game_Store SHALL persist updates to localStorage immediately
4. THE Game_Store SHALL preserve all existing state properties (players, boardConfig, event states, authentication state)
5. THE Game_Store SHALL preserve all existing actions (dice rolling, player movement, event triggers, authentication)

### Requirement 6: Cross-Tab Synchronization

**User Story:** As a user, I want game state synchronized across multiple browser tabs, so that changes in one tab are reflected in others.

#### Acceptance Criteria

1. WHEN localStorage 'game-storage' changes in another tab, THE Layout_Component SHALL detect the storage event
2. WHEN a storage event is detected, THE Game_Store SHALL rehydrate its state from localStorage
3. THE Cross_Tab_Sync SHALL work only in client-side components
4. THE Cross_Tab_Sync SHALL preserve the existing implementation using window storage events

### Requirement 7: Layout and Navigation Migration

**User Story:** As a user, I want the navigation bar to work the same way as before, so that I can easily switch between game pages.

#### Acceptance Criteria

1. THE Layout_Component SHALL render the Navigation_Bar with all game page links
2. THE Navigation_Bar SHALL show on initial page load and route changes
3. THE Navigation_Bar SHALL hide automatically after 3 seconds of inactivity
4. WHEN the user presses the 'b' key, THE Navigation_Bar SHALL become visible again
5. THE Navigation_Bar SHALL highlight the active route with the same styling as before
6. THE Navigation_Bar SHALL use Next.js Link components instead of React Router NavLink
7. THE Layout_Component SHALL preserve the floating bottom-center positioning and animations

### Requirement 8: Styling Migration

**User Story:** As a developer, I want all styling to work correctly in Next.js, so that the application looks identical to the current version.

#### Acceptance Criteria

1. THE Migration_System SHALL configure Tailwind CSS v4 with the @tailwindcss/vite plugin
2. THE Migration_System SHALL preserve all global styles from index.css
3. THE Migration_System SHALL ensure all Tailwind classes work correctly in Next.js
4. THE Migration_System SHALL preserve Framer Motion animations for the navigation bar and page transitions
5. THE Migration_System SHALL maintain the dark theme (slate-950 background, slate-50 text)

### Requirement 9: Component Library Migration

**User Story:** As a developer, I want all shadcn/ui components to work in Next.js, so that the UI remains consistent.

#### Acceptance Criteria

1. THE Migration_System SHALL preserve all shadcn/ui components in the components/ui directory
2. THE Migration_System SHALL mark shadcn/ui components as Client Components where necessary
3. THE Migration_System SHALL ensure all component imports use the @/ path alias
4. THE Migration_System SHALL preserve the ErrorBoundary component functionality

### Requirement 10: Build and Development Configuration

**User Story:** As a developer, I want the development and build processes to work correctly, so that I can develop and deploy the application.

#### Acceptance Criteria

1. THE Migration_System SHALL configure Next.js development server to run on the default port (3000)
2. THE Migration_System SHALL configure Next.js build process to generate optimized production bundles
3. THE Migration_System SHALL preserve TypeScript strict mode and type checking
4. THE Migration_System SHALL configure ESLint for Next.js with the same rules as the current project
5. THE Migration_System SHALL ensure all environment variables and configuration work in Next.js

### Requirement 11: Game Data and Logic Preservation

**User Story:** As a user, I want all game mechanics to work exactly as before, so that gameplay is not affected by the migration.

#### Acceptance Criteria

1. THE Migration_System SHALL preserve all game data files (CHANCE_EVENTS, BRAINIAC_EVENTS, VOLTAGE_EVENTS, GIFT_EVENTS)
2. THE Migration_System SHALL preserve dice rolling logic and animations
3. THE Migration_System SHALL preserve player movement and position tracking
4. THE Migration_System SHALL preserve event triggering based on tile types
5. THE Migration_System SHALL preserve all game state transitions and status changes

### Requirement 12: Error Handling and Boundaries

**User Story:** As a user, I want errors to be handled gracefully, so that the application doesn't crash unexpectedly.

#### Acceptance Criteria

1. THE Migration_System SHALL implement error boundaries using Next.js error.tsx files
2. THE Migration_System SHALL preserve the existing ErrorBoundary component for client-side errors
3. WHEN an error occurs, THE Error_Boundary SHALL display a user-friendly error message
4. THE Error_Boundary SHALL allow users to recover from errors without losing game state

### Requirement 13: Routing Issue Resolution

**User Story:** As a user, I want navigation to update the page content immediately, so that I don't need to reload the page to see the new content.

#### Acceptance Criteria

1. WHEN a user clicks a navigation link, THE App_Router SHALL unmount the current page component and mount the new page component
2. THE App_Router SHALL not use client-side navigation that only updates the URL
3. THE App_Router SHALL ensure each route renders its corresponding page component correctly
4. THE App_Router SHALL preserve scroll position behavior on navigation
5. THE App_Router SHALL handle navigation state updates synchronously

### Requirement 14: Metadata and SEO

**User Story:** As a developer, I want proper metadata for each page, so that the application has good SEO and browser tab titles.

#### Acceptance Criteria

1. THE Migration_System SHALL define metadata for each page using Next.js metadata API
2. THE Migration_System SHALL set appropriate page titles for each game page
3. THE Migration_System SHALL set a default title and description for the application
4. THE Migration_System SHALL configure viewport and theme color metadata

### Requirement 15: Static and Public Assets

**User Story:** As a developer, I want all static assets to be accessible, so that images and icons load correctly.

#### Acceptance Criteria

1. THE Migration_System SHALL move public assets to the Next.js public directory
2. THE Migration_System SHALL ensure all asset references use correct paths for Next.js
3. THE Migration_System SHALL preserve favicon and other static files
4. THE Migration_System SHALL configure Next.js to serve static assets correctly
