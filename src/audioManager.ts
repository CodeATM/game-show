'use client'

/**
 * AUDIO CONFIGURATION
 * Replace the values here if you change the file names or paths.
 */
const AUDIO_FILES = {
    // One-shot sounds (trigger events)
    dice_roll: '/audio/dice-roll.mp3',
    chance_trigger: '/audio/chance-trigger.mp3',
    brainiac_reveal: '/audio/brainiac-reveal.mp3',
    vantage_hit: '/audio/voltage-hit.mp3',
    reveal_event: '/audio/reveal-event.mp3',
    // Animation looping sounds
    vantage_animation: '/audio/vantage-animation.mp3',
    gift_animation: '/audio/gift-animation.mp3',
    chance_animation: '/audio/chance-animation.mp3',
    brainiac_animation: '/audio/brainiac-animation.mp3'
} as const;

type SoundName = keyof typeof AUDIO_FILES;

class AudioManager {
    private sounds: Map<SoundName, HTMLAudioElement> = new Map();
    private activeLoopingSounds: Set<SoundName> = new Set();
    private blockedLoops: Set<SoundName> = new Set();
    private initialized = false;

    constructor() {
        if (typeof window !== 'undefined') {
            // Preload all sounds
            Object.entries(AUDIO_FILES).forEach(([name, path]) => {
                const audio = new Audio(path);
                audio.preload = 'auto';
                this.sounds.set(name as SoundName, audio);
            });

            // GLOBAL AUTO-INITIALIZATION on first interaction
            const initHandler = () => {
                this.init().then(() => {
                    window.removeEventListener('click', initHandler);
                    window.removeEventListener('keydown', initHandler);
                    window.removeEventListener('touchstart', initHandler);
                    window.removeEventListener('mousedown', initHandler);
                });
            };
            window.addEventListener('click', initHandler);
            window.addEventListener('keydown', initHandler);
            window.addEventListener('touchstart', initHandler);
            window.addEventListener('mousedown', initHandler);
        }
    }

    /**
     * Unlocks the audio system for the current tab/window.
     */
    public async init() {
        if (this.initialized) return;

        console.log('--- Initializing Audio Engine ---');

        // Resume AudioContext if available (some browsers need this)
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            const ctx = new AudioContextClass();
            if (ctx.state === 'suspended') await ctx.resume();
        }

        // Play a tiny silent buffer to unlock the HTMLAudioElement pool
        const silentSound = new Audio();
        silentSound.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
        try {
            await silentSound.play();
            this.initialized = true;
            console.log('--- Audio Engine Unlocked ---');

            // Retry any loops that were blocked before initialization
            if (this.blockedLoops.size > 0) {
                console.log(`Replaying ${this.blockedLoops.size} blocked loops...`);
                this.blockedLoops.forEach(name => {
                    this.playLoop(name);
                });
                this.blockedLoops.clear();
            }
        } catch (err) {
            console.warn('Audio unlock failed (retrying on next gesture):', err);
        }
    }

    /**
     * Plays a sound once.
     */
    public play(name: SoundName, volume = 1.0) {
        const audio = this.sounds.get(name);
        if (audio) {
            // For one-shots, we use a fresh instance to allow overlapping
            const sound = new Audio(audio.src);
            sound.volume = volume;
            sound.play().catch(err => {
                console.warn(`Playback blocked/failed for "${name}" (needs user gesture):`, err.message);
            });
        }
    }

    /**
     * Starts a looping sound.
     */
    public playLoop(name: SoundName, volume = 1.0) {
        if (this.activeLoopingSounds.has(name)) return;

        if (!this.initialized) {
            console.log(`Loop "${name}" blocked (no gesture yet). Queuing for later...`);
            this.blockedLoops.add(name);
            return;
        }

        console.log(`Starting loop: ${name}`);
        const audio = this.sounds.get(name);
        if (audio) {
            audio.loop = true;
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play()
                .then(() => {
                    this.activeLoopingSounds.add(name);
                })
                .catch(err => {
                    console.warn(`Loop "${name}" failed to start:`, err.message);
                    if (err.name === 'NotAllowedError') {
                        this.initialized = false;
                        this.blockedLoops.add(name);
                    }
                });
        }
    }

    /**
     * Stops a looping sound.
     */
    public stop(name: SoundName) {
        this.blockedLoops.delete(name);
        const audio = this.sounds.get(name);
        if (audio) {
            if (this.activeLoopingSounds.has(name)) {
                console.log(`Stopping sound: ${name}`);
            }
            audio.pause();
            audio.currentTime = 0;
            this.activeLoopingSounds.delete(name);
        }
    }

    public stopAll() {
        this.blockedLoops.clear();
        this.sounds.forEach((audio, name) => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeLoopingSounds.clear();
    }
}

export const audioManager = new AudioManager();
