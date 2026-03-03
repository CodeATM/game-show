'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { audioManager } from '@/audioManager'

export function useInputController() {
    const midiAccessRef = useRef<MIDIAccess | null>(null)

    useEffect(() => {
        // --- Action Dispatcher ---
        const executeAction = (actionId: string) => {
            const store = useGameStore.getState()
            const activePlayer = store.players.find(p => p.isActive)
            const activePlayerId = activePlayer ? activePlayer.id : store.players[0].id

            switch (actionId) {
                case 'roll_dice':
                    if (store.audioFeedbackEnabled) audioManager.play('dice_roll');
                    store.movePlayerWithDice(activePlayerId, Math.floor(Math.random() * 6) + 1);
                    break;
                case 'roll_1':
                    if (store.audioFeedbackEnabled) audioManager.play('dice_roll');
                    store.movePlayerWithDice(activePlayerId, 1);
                    break;
                case 'roll_2':
                    if (store.audioFeedbackEnabled) audioManager.play('dice_roll');
                    store.movePlayerWithDice(activePlayerId, 2);
                    break;
                case 'roll_3':
                    if (store.audioFeedbackEnabled) audioManager.play('dice_roll');
                    store.movePlayerWithDice(activePlayerId, 3);
                    break;
                case 'roll_4':
                    if (store.audioFeedbackEnabled) audioManager.play('dice_roll');
                    store.movePlayerWithDice(activePlayerId, 4);
                    break;
                case 'roll_5':
                    if (store.audioFeedbackEnabled) audioManager.play('dice_roll');
                    store.movePlayerWithDice(activePlayerId, 5);
                    break;
                case 'roll_6':
                    if (store.audioFeedbackEnabled) audioManager.play('dice_roll');
                    store.movePlayerWithDice(activePlayerId, 6);
                    break;

                case 'trigger_chance':
                    if (store.audioFeedbackEnabled) audioManager.play('chance_trigger');
                    store.triggerChance();
                    break;
                case 'reset_chance': store.resetChance(); break;

                case 'trigger_quiz':
                    if (store.audioFeedbackEnabled) audioManager.play('brainiac_reveal');
                    store.triggerBrainiac();
                    break;
                case 'reset_quiz': store.resetBrainiac(); break;

                case 'trigger_ladder':
                    if (store.audioFeedbackEnabled) audioManager.play('voltage_hit');
                    store.triggerVoltage();
                    break;
                case 'reset_ladder': store.resetVoltage(); break;

                case 'trigger_snake': store.triggerGift(); break;
                case 'reset_snake': store.resetGift(); break;

                case 'hard_reset': store.resetGame(); break;
            }
        }

        const handleInput = (type: 'keyboard' | 'midi', value: string | number) => {
            // Check if user is typing in an input or textarea (keyboard only)
            if (type === 'keyboard' && document.activeElement) {
                const tagName = document.activeElement.tagName.toLowerCase()
                if (tagName === 'input' || tagName === 'textarea') {
                    return // Ignore keyboard shortcuts when typing
                }
            }

            const store = useGameStore.getState()
            const mappings = store.mappings

            // Hardcoded mappings for Note 60-63 as requested, prioritizing over custom mappings
            if (type === 'midi') {
                if (value === 60) { executeAction('roll_dice'); return; }
                if (value === 61) { executeAction('trigger_chance'); return; }
                if (value === 62) { executeAction('trigger_quiz'); return; }
                if (value === 63) { executeAction('trigger_ladder'); return; }
            }

            // Find which action this input corresponds to
            for (const [actionId, mapping] of Object.entries(mappings)) {
                if (mapping && mapping.type === type && mapping.value === value) {
                    // Match found, execute action
                    executeAction(actionId)
                    break // Assumes one input per action to avoid double triggers
                }
            }
        }

        // --- Keyboard Listener ---
        const handleKeyDown = (e: KeyboardEvent) => {
            let key = e.key.toLowerCase()
            // Normalize spacebar
            if (key === ' ') key = 'space'
            handleInput('keyboard', key)
        }

        window.addEventListener('keydown', handleKeyDown)

        // --- MIDI Listener ---
        const handleMidiMessage = (e: MIDIMessageEvent) => {
            if (!e.data) return

            const [command, note, velocity] = e.data
            // Command 144 is Note On (usually 144-159 depending on channel)
            const isNoteOn = command >= 144 && command <= 159

            // Some devices send Note On with velocity 0 instead of Note Off
            if (isNoteOn && velocity > 0) {
                const store = useGameStore.getState()
                console.log('Signal Received (MIDI):', { note, velocity })

                // Visual feedback trigger
                store.triggerMidiSignal()

                // Audio feedback (very short beep) removed in favor of real sound effects
                // if (store.audioFeedbackEnabled) { ... }

                handleInput('midi', note)
            }
        }

        const setupMIDI = async () => {
            const store = useGameStore.getState()

            if (navigator.requestMIDIAccess) {
                try {
                    // sysex: true for maximum compatibility
                    const midiAccess = await navigator.requestMIDIAccess({ sysex: true })
                    midiAccessRef.current = midiAccess

                    const updateStatus = () => {
                        const inputs = Array.from(midiAccess.inputs.values())
                        if (inputs.length > 0) {
                            // Find the first connected input name (e.g. Stream Deck)
                            const deviceName = inputs[0].name || 'Unknown Device'
                            store.setMidiStatus('connected', deviceName)
                        } else {
                            store.setMidiStatus('disconnected')
                        }
                    }

                    const attachToInput = (input: MIDIInput) => {
                        // Directly attach to the onmidimessage property as requested
                        input.onmidimessage = handleMidiMessage
                    }

                    midiAccess.inputs.forEach(attachToInput)
                    updateStatus()

                    // Handle device connect/disconnect
                    midiAccess.onstatechange = (e) => {
                        updateStatus()
                        const port = e.port
                        if (port && port.type === 'input' && port.state === 'connected') {
                            attachToInput(port as MIDIInput)
                        }
                    }
                } catch (err) {
                    console.warn('MIDI Access failed or denied:', err)
                    store.setMidiStatus('unsupported')
                }
            } else {
                console.warn('WebMIDI API not supported by this browser.')
                store.setMidiStatus('unsupported')
            }
        }

        setupMIDI()

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            if (midiAccessRef.current) {
                midiAccessRef.current.inputs.forEach(input => {
                    input.onmidimessage = null
                })
            }
        }
    }, [])

    return null
}
