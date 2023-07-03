const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true // Enable Node.js integration in renderer process
    }
  });

  // Load your application's HTML file
  mainWindow.loadFile('./kommentary/src/index.html');

  // Open the DevTools (remove this line for production)
  mainWindow.webContents.openDevTools();
}

// Event handler when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Quit when all windows are closed
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

// Event handler for macOS when the dock icon is clicked and no other windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
