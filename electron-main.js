const { app, BrowserWindow, dialog } = require('electron');

let gameServer = null;
let mainWindow = null;

function createWindow() {
  process.env.HOST = '127.0.0.1';
  process.env.PORT = '0';
  gameServer = require('./server.js');

  gameServer.once('listening', () => {
    const address = gameServer.address();
    mainWindow = new BrowserWindow({
      width: 1440,
      height: 900,
      minWidth: 980,
      minHeight: 650,
      title: 'LEGENDS OF ETERNIA',
      backgroundColor: '#09111d',
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });

    mainWindow.loadURL(`http://127.0.0.1:${address.port}`);
    mainWindow.on('closed', () => { mainWindow = null; });
  });

  gameServer.on('error', (error) => {
    dialog.showErrorBox('Oyun başlatılamadı', `Yerel oyun sunucusu açılamadı:\n${error.message}`);
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (gameServer && gameServer.listening) gameServer.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (gameServer && gameServer.listening) gameServer.close();
});
