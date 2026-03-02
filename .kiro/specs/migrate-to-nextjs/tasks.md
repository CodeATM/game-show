# Implementation Plan: Migrate React + Vite to Next.js

## Overview

This implementation plan provides a systematic approach to migrating the React + Vite application to Next.js 14+ with App Router. The migration is broken down into discrete, incremental steps that build upon each other, ensuring that functionality is preserved and the routing issue is resolved.

## Tasks

- [ ] 1. Initialize Next.js project and configure dependencies
  - Create new Next.js 14+ project with App Router using `npx create-next-app@latest`
  - Configure TypeScript with strict mode and path aliases (@/*)
  - Install all dependencies: React 19, Zustand, Tailwind CSS v4, Framer Motion, Lucide icons, shadcn/ui, modern-react-dice-roll
  - Configure Tailwind CSS v4 with @tailwindcss/vite plugin in next.config.js
  - Configure React Compiler babel plugin in next.config.js
  - Set up ESLint for Next.js
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 10.4_

- [ ] 2. Set up project structure and copy shared code
  - Create lib/, store/, components/, data/ directories
  - Copy lib/auth.ts and add server-safe check (typeof window === 'undefined')
  - Copy store/gameStore.ts (no changes needed)
  - Copy data/gameData.ts (no changes needed)
  - Copy components/ui/ directory with all shadcn/ui components
  - Add 'use client' directive to interactive shadcn/ui components
  - Copy components/ErrorBoundary.tsx
  - _Requirements: 4.5, 5.1, 5.4, 5.5, 9.1, 9.2, 9.3, 11.1_

- [ ] 3. Create root layout with navigation
  - [ ] 3.1 Create app/layout.tsx with metadata and HTML structure
    - Define root layout component
    - Add metadata (title, description, viewport, theme color)
    - Include global CSS import
    - Wrap children with Navigation component
    - _Requirements: 1.1, 7.1, 14.1, 14.3, 14.4_
  
  - [ ] 3.2 Create components/Navigation.tsx client component
    - Extract navigation bar from router.tsx
    - Add 'use client' directive
    - Implement visibility state (show on mount, hide after 3s)
    - Implement 'b' key press handler to show navigation
    - Use usePathname() for active route detection
    - Replace NavLink with Next.js Link component
    - Add cross-tab synchronization listener
    - Preserve Framer Motion animations
    - _Requirements: 2.3, 2.5, 2.6, 6.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [ ] 3.3 Write property test for navigation visibility
    - **Property 12: Navigation bar visibility toggle behavior**
    - **Validates: Requirements 2.6**
  
  - [ ] 3.4 Write property test for active route highlighting
    - **Property 4: Active route is highlighted in navigation**
    - **Validates: Requirements 7.5**

- [ ] 4. Create global styles and configure Tailwind
  - Create app/globals.css with all styles from src/index.css
  - Ensure Tailwind directives are included
  - Preserve dark theme colors (slate-950 background, slate-50 text)
  - Verify Framer Motion animations work
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [ ] 5. Implement authentication and protected route wrapper
  - [ ] 5.1 Create components/ProtectedRoute.tsx client component
    - Add 'use client' directive
    - Use useRouter() and useEffect() for client-side redirect
    - Check isAuthenticated() and redirect to /register if false
    - Return null while checking auth
    - _Requirements: 3.1, 3.2_
  
  - [ ] 5.2 Write property test for authentication check
    - **Property 13: Authentication check reflects localStorage state**
    - **Validates: Requirements 3.1**
  
  - [ ] 5.3 Write property test for protected route redirection
    - **Property 2: Protected routes redirect unauthenticated users**
    - **Validates: Requirements 3.2**

- [ ] 6. Create root page with authentication-based redirect
  - Create app/page.tsx as client component
  - Check isAuthenticated() and redirect to /dice or /register
  - Use useRouter() and useEffect() for client-side redirect
  - _Requirements: 3.3, 3.4_

- [ ] 7. Migrate Register page
  - Create app/register/page.tsx
  - Add 'use client' directive
  - Copy entire Register component from src/pages/Register.tsx
  - Ensure all imports use @/ alias
  - Verify authentication flow works
  - _Requirements: 2.1, 4.1, 4.2, 4.5_

- [ ] 8. Migrate game pages (DiceRoller, Tiles, Chance, Brainiac)
  - [ ] 8.1 Create app/dice/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy DiceRoller component logic and JSX
    - Add metadata export with title "Dice Roller"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_
  
  - [ ] 8.2 Create app/tiles/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy Tiles component logic and JSX
    - Add metadata export with title "Board Game"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_
  
  - [ ] 8.3 Create app/chance/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy Chance component logic and JSX
    - Add metadata export with title "Chance"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_
  
  - [ ] 8.4 Create app/brainiac/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy Brainiac component logic and JSX
    - Add metadata export with title "Brainiac"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_
  
  - [ ] 8.5 Write property test for dice rolling
    - **Property 7: Dice rolls produce valid results**
    - **Validates: Requirements 11.2**

- [ ] 9. Migrate remaining game pages (Voltage, Gift, Stats, Admin)
  - [ ] 9.1 Create app/voltage/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy Voltage component logic and JSX
    - Add metadata export with title "Voltage"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_
  
  - [ ] 9.2 Create app/gift/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy Gift component logic and JSX
    - Add metadata export with title "Gift"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_
  
  - [ ] 9.3 Create app/stats/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy Stats component logic and JSX
    - Add metadata export with title "Stats"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_
  
  - [ ] 9.4 Create app/admin/page.tsx
    - Add 'use client' directive
    - Wrap content in ProtectedRoute component
    - Copy Admin component logic and JSX
    - Add metadata export with title "Admin"
    - _Requirements: 2.1, 4.1, 4.2, 4.5, 14.2_

- [ ] 10. Checkpoint - Verify all pages render and navigation works
  - Test that all pages load without errors
  - Test that navigation between pages works without reload
  - Test that protected routes redirect unauthenticated users
  - Test that authentication flow works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement and test state management
  - [ ] 11.1 Verify Zustand store works in Next.js
    - Test that state persists to localStorage
    - Test that state rehydrates on page load
    - Test that all store actions work correctly
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 11.2 Write property test for state persistence
    - **Property 5: State changes persist to localStorage**
    - **Validates: Requirements 5.2, 5.3**
  
  - [ ] 11.3 Write property test for cross-tab synchronization
    - **Property 6: Storage events trigger state rehydration**
    - **Validates: Requirements 6.2**
  
  - [ ] 11.4 Write property test for player movement
    - **Property 8: Player movement updates position correctly**
    - **Validates: Requirements 11.3**
  
  - [ ] 11.5 Write property test for tile event triggering
    - **Property 9: Tile types trigger corresponding events**
    - **Validates: Requirements 11.4**

- [ ] 12. Implement error handling
  - [ ] 12.1 Create app/error.tsx for route-level errors
    - Add 'use client' directive
    - Display user-friendly error message
    - Provide reset button
    - Log errors to console
    - _Requirements: 12.1, 12.3_
  
  - [ ] 12.2 Verify ErrorBoundary component works
    - Test that component errors are caught
    - Test that error UI displays correctly
    - Test that reset functionality works
    - _Requirements: 12.2, 12.3_
  
  - [ ] 12.3 Write property test for error recovery
    - **Property 10: Error recovery preserves game state**
    - **Validates: Requirements 12.4**

- [ ] 13. Configure static assets and metadata
  - Move public/vite.svg to public/ directory in Next.js
  - Verify favicon and static files are accessible
  - Add metadata to each page route
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ] 14. Write comprehensive property tests for routing
  - [ ] 14.1 Write property test for navigation rendering
    - **Property 1: Navigation renders correct page component**
    - **Validates: Requirements 2.2, 13.1, 13.3**
  
  - [ ] 14.2 Write property test for navigation bar visibility
    - **Property 3: Navigation bar shows on route changes**
    - **Validates: Requirements 7.2**
  
  - [ ] 14.3 Write property test for page metadata
    - **Property 11: Page metadata matches route**
    - **Validates: Requirements 14.2**

- [ ] 15. Final testing and verification
  - [ ] 15.1 Run TypeScript type checking
    - Verify no type errors
    - Ensure strict mode is enabled
    - _Requirements: 10.3_
  
  - [ ] 15.2 Run ESLint
    - Fix any linting errors
    - Ensure code quality standards are met
    - _Requirements: 10.4_
  
  - [ ] 15.3 Test development server
    - Run `npm run dev` and verify app works
    - Test all pages and navigation
    - Test authentication flow
    - Test game mechanics
    - _Requirements: 10.1_
  
  - [ ] 15.4 Test production build
    - Run `npm run build` and verify build succeeds
    - Run `npm run start` and verify production app works
    - Test all functionality in production mode
    - _Requirements: 10.2_

- [ ] 16. Final checkpoint - Complete migration verification
  - Verify all requirements are met
  - Verify routing issue is fixed (navigation updates content immediately)
  - Verify all game mechanics work correctly
  - Verify state persistence and cross-tab sync work
  - Verify styling matches original application
  - Verify all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- The migration is incremental - each step builds on the previous
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- All game logic and data structures are preserved from the original application
- The routing issue is fixed by using Next.js App Router which properly unmounts/mounts components on navigation
