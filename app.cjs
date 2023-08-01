const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  import('./LiveAnalytics.js')
    .then(module => {
      const main = module.default; // Access the named export "main"
      main()
        .catch((err) => {
        console.error(err);
        process.exit(1);
      });
    })
    .catch(err => console.error('An error occurred:', err));

  win.loadFile('./web/index.html')
}

app.whenReady().then(createWindow)
