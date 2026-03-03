'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export function useInputController() {
    const midiAccessRef = useRef<MIDIAccess | null>(null)

    useEffect(() => {
        // --- Action Dispatcher ---
        const executeAction = (actionId: string) => {
            const store = useGameStore.getState()
            const activePlayer = store.players.find(p => p.isActive)
            const activePlayerId = activePlayer ? activePlayer.id : store.players[0].id

            switch (actionId) {
                case 'roll_1': store.movePlayerWithDice(activePlayerId, 1); break;
                case 'roll_2': store.movePlayerWithDice(activePlayerId, 2); break;
                case 'roll_3': store.movePlayerWithDice(activePlayerId, 3); break;
                case 'roll_4': store.movePlayerWithDice(activePlayerId, 4); break;
                case 'roll_5': store.movePlayerWithDice(activePlayerId, 5); break;
                case 'roll_6': store.movePlayerWithDice(activePlayerId, 6); break;

                case 'trigger_chance': store.triggerChance(); break;
                case 'reset_chance': store.resetChance(); break;

                case 'trigger_quiz': store.triggerBrainiac(); break;
                case 'reset_quiz': store.resetBrainiac(); break;

                case 'trigger_ladder': store.triggerVoltage(); break;
                case 'reset_ladder': store.resetVoltage(); break;

                case 'trigger_snake': store.triggerGift(); break;
                case 'reset_snake': store.resetGift(); break;

                case 'hard_reset': store.resetGame(); break;
            }
        }

        const handleInput = (type: 'keyboard' | 'midi', value: string | number) => {
            // Check if user is typing in an input or textarea
            if (document.activeElement) {
                const tagName = document.activeElement.tagName.toLowerCase()
                if (tagName === 'input' || tagName === 'textarea') {
                    return // Ignore inputs when typing
                }
            }

            const mappings = useGameStore.getState().mappings

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
        const handleMidiMessage = (e: Event) => {
            const message = e as MIDIMessageEvent
            if (!message.data) return

            const [command, note, velocity] = message.data
            // Command 144 is Note On (usually 144-159 depending on channel)
            const isNoteOn = command >= 144 && command <= 159

            // Some devices send Note On with velocity 0 instead of Note Off
            if (isNoteOn && velocity > 0) {
                handleInput('midi', note)
            }
        }

        const setupMIDI = async () => {
            if (navigator.requestMIDIAccess) {
                try {
                    const midiAccess = await navigator.requestMIDIAccess()
                    midiAccessRef.current = midiAccess

                    const inputs = midiAccess.inputs.values()
                    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                        input.value.addEventListener('midimessage', handleMidiMessage)
                    }

                    // Handle device connect/disconnect
                    midiAccess.onstatechange = (e) => {
                        const port = e.port
                        if (port && port.type === 'input' && port.state === 'connected') {
                            // Re-attach listener to new port
                            port.addEventListener('midimessage', handleMidiMessage)
                        }
                    }
                } catch (err) {
                    console.warn('MIDI Access failed or denied:', err)
                }
            } else {
                console.warn('WebMIDI API not supported by this browser.')
            }
        }

        setupMIDI()

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            if (midiAccessRef.current) {
                const inputs = midiAccessRef.current.inputs.values()
                for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                    input.value.removeEventListener('midimessage', handleMidiMessage)
                }
            }
        }
    }, [])
}
