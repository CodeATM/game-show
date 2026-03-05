import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import serve from 'electron-serve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadURL = serve({ directory: path.join(__dirname, 'out') });

// app.isPackaged is more reliable than process.env.NODE_ENV in Electron
const isDev = !app.isPackaged;

function createWindow(route = '') {
    console.log(`[Main] Creating window for route: ${route || 'home'}...`);

    const mainWindow = new BrowserWindow({
        width: route.includes('admin') ? 1000 : 1280,
        height: route.includes('admin') ? 800 : 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        title: route ? `Game Show - ${route.toUpperCase()}` : "Game Show Desktop",
        backgroundColor: '#020617',
    });

    if (isDev) {
        // Construct URL for specific route in dev
        const baseUrl = 'http://localhost:3000';
        const url = route ? `${baseUrl}/${route.replace(/^\//, '')}` : baseUrl;

        console.log('[Main] Loading Dev URL:', url);

        mainWindow.loadURL(url).catch(err => {
            console.error('[Main] Failed to load dev URL, retrying in 2s...', err.message);
            setTimeout(() => mainWindow.loadURL(url), 2000);
        });

        if (isDev) mainWindow.webContents.openDevTools();
    } else {
        // In production, we load the specific HTML file from the 'out' directory
        // Next.js 'export' generates files like tiles.html, admin.html
        const targetRoute = route ? `${route.replace(/^\//, '')}.html` : 'index.html';

        console.log('[Main] Loading Prod Route via electron-serve:', targetRoute);
        loadURL(mainWindow).then(() => {
            return mainWindow.loadURL(`app://-/${targetRoute}`);
        }).catch(err => {
            console.error('[Main] Failed to load prod route:', targetRoute, err.message);
            // Fallback to index.html if specific route file not found
            mainWindow.loadURL(`app://-/index.html`);
        });
    }

    // Permissions for MIDI and NDI
    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission) => {
        if (['midi', 'midiSysex', 'media'].includes(permission)) {
            return true;
        }
        return false;
    });

    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
        if (details.deviceType === 'midi') {
            return true;
        }
        return false;
    });

    return mainWindow;
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                { role: 'quit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'New Board Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => createWindow('tiles')
                },
                {
                    label: 'New Admin Window',
                    accelerator: 'CmdOrCtrl+Shift+A',
                    click: () => createWindow('admin')
                },
                { type: 'separator' },
                { role: 'minimize' },
                { role: 'zoom' },
                { role: 'close' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = await import('electron');
                        await shell.openExternal('https://electronjs.org');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// App lifecycle
app.whenReady().then(() => {
    console.log('[Main] App ready');
    createMenu();
    // Start with a Board window by default
    createWindow('tiles');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow('tiles');
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
