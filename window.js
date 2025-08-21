const { MicaBrowserWindow: BrowserWindow } = require('mica-electron');

function window() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    title: 'RunCode',
    minWidth: 600,
    // autoHideMenuBar: true,
    icon: './assets/icons/win/icono.ico',
    transparent: true,
    backgroundColor: '#00000000',
    show: false, // 👈 clave
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    },
  });

  win.loadFile('src/index.html');

  win.webContents.on('dom-ready', () => {
    win.setMicaAcrylicEffect();
  });

  win.once('ready-to-show', () => win.show());
}

module.exports = { window };
