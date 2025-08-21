const { app, ipcMain } = require('electron');
const { window } = require('./window');
const path = require('path');
app.whenReady().then(window)



ipcMain.on('devtools:open',  (e, mode='detach') => e.sender.openDevTools({ mode }));
ipcMain.on('devtools:close', (e)                => e.sender.closeDevTools());
ipcMain.on('devtools:toggle', (e, mode='detach') => {
  const wc = e.sender;
  wc.isDevToolsOpened() ? wc.closeDevTools() : wc.openDevTools({ mode });
});
