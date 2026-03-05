// Preload script for Electron
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Methods can be added here for secure communication
});
