const { app } = require('electron');
const { window } = require('./window');
app.whenReady().then(window)
