/**
 * Simple authentication utility to check for registered player name
 * independent of Zustand store hooks to prevent circular dependencies
 * and ensure routing logic is clean.
 */
export const getActivePlayerName = (): string | null => {
    try {
        const storage = localStorage.getItem('game-storage');
        if (!storage) return null;

        const parsed = JSON.parse(storage);
        return parsed?.state?.activePlayerName || null;
    } catch (error) {
        console.error('Failed to parse game-storage for auth check:', error);
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    return !!getActivePlayerName();
};
