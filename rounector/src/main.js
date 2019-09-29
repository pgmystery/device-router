const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');

let mainWindow;

// Listen for app to be ready
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        backgroundColor: '#F0F0F0',
        width: 407,
        height: 414,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        // show: false,
    });

// TODO: DELETE THIS BEFORE RELEASE!!!
    mainWindow.toggleDevTools();
// TODO: DELETE THIS BEFORE RELEASE!!!

    mainWindow.loadFile(path.join(__dirname, 'interface/index.html'));
});
